"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { animate, useReducedMotion, Easing } from "motion/react";
import { Direction } from "./grid";
import { Rect, WATER, deckSpan, bridgeRailings, waterRects } from "./bridges";
import { TRANSITION_EASE } from "./useGridNavigation";

const SPEED = 260; // walking, px per second
const STRIDE = 14; // px travelled per walk frame
const FLY_SPEED = 900; // px per second
const FLY_HEIGHT = 18; // px off the ground in flight
const FLAIL_MS = 110; // tumble / stars frame time
const DAZED_MS = 350;
const LAUNCH_COOLDOWN = 400; // ms — swallows trackpad inertia after a landing
const CAMERA_MARGIN = 0.3; // tall rooms scroll to keep the sprite this far (of the viewport) from the edges
const CAMERA_SPEED = SPEED * 1.6; // px per second — fast enough to lead the walk, catches up smoothly

const KEY_DIRECTIONS: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

export type SpriteAction = "idle" | "walk" | "fly" | "tumble" | "dazed";

export interface SpritePose {
  facing: Direction;
  action: SpriteAction;
  step: number; // index into the action's frame cycle
}

// Everything the sprite's transforms are derived from
interface Body {
  x: number;
  y: number;
  z: number; // height off the ground
  sx: number; // squash & stretch
  sy: number;
}

const isVertical = (d: Direction) => d === "up" || d === "down";
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Drives the sprite: walking with arrow keys / WASD, and `launch` (from a
 * swipe) — a superhero flight up/down, or a knock-back left/right.
 *
 * Screen edges are walls; the only way out is across a bridge deck on one of
 * the room's `exits`. Bridge railings — and, around an island room, the
 * water — collide with the sprite's feet.
 * Leaving calls `onExit`; if that starts a room transition, the sprite glides
 * to the opposite edge in step with the room slide.
 *
 * Transforms are written straight to the DOM; React only re-renders when the
 * pose changes. The walking rAF loop stops when idle.
 */
export function useSpriteMovement(
  box: { width: number; height: number; feet: Rect }, // feet: hitbox, relative to the sprite
  options?: {
    disabled?: boolean;
    exits?: Direction[];
    water?: Direction[]; // edges bordered by water — solid to walk on
    onExit?: (direction: Direction) => boolean;
    exitDuration?: number;
    getScroller?: () => HTMLElement | undefined; // the current room's, if it is taller than the viewport
  }
) {
  const disabled = options?.disabled ?? false;
  const reducedMotion = useReducedMotion();
  const [pose, setPose] = useState<SpritePose>({ facing: "down", action: "idle", step: 0 });
  const [ready, setReady] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null); // position
  const bodyRef = useRef<HTMLDivElement>(null); // height + squash
  const shadowRef = useRef<HTMLDivElement>(null);

  const body = useRef<Body>({ x: 0, y: 0, z: 0, sx: 1, sy: 1 });
  const held = useRef<Direction[]>([]); // most recently pressed last
  const poseRef = useRef(pose);
  const frameId = useRef<number | null>(null);
  const distance = useRef(0);
  const crossing = useRef(false); // walking glide into the next room
  const scripted = useRef(false); // a launch owns the sprite
  const launchLockedUntil = useRef(0);

  // Latest room/callbacks without re-subscribing listeners
  const optionsRef = useRef(options);
  const reducedRef = useRef(reducedMotion);
  useEffect(() => {
    optionsRef.current = options;
    reducedRef.current = reducedMotion;
  });

  const { width, height, feet } = box;

  // Start in the centre — where landings and H put him, and in line with the side bridge decks
  useLayoutEffect(() => {
    body.current.x = Math.round((window.innerWidth - width) / 2);
    body.current.y = Math.round((window.innerHeight - height) / 2);
    apply();
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function apply() {
    const b = body.current;
    // Whole pixels keep the pixel art crisp
    if (rootRef.current) {
      rootRef.current.style.transform = `translate3d(${Math.round(b.x)}px, ${Math.round(b.y)}px, 0)`;
    }
    if (bodyRef.current) {
      bodyRef.current.style.transform = `translate3d(0, ${-Math.round(b.z)}px, 0) scale(${b.sx}, ${b.sy})`;
    }
    if (shadowRef.current) {
      const lift = b.z / FLY_HEIGHT;
      shadowRef.current.style.transform = `scale(${1 - lift * 0.35})`;
      shadowRef.current.style.opacity = `${1 - lift * 0.5}`;
    }
  }

  function clamp() {
    const b = body.current;
    b.x = Math.min(Math.max(b.x, 0), window.innerWidth - width);
    b.y = Math.min(Math.max(b.y, 0), window.innerHeight - height);
  }

  function updatePose(next: SpritePose) {
    const prev = poseRef.current;
    if (prev.facing === next.facing && prev.action === next.action && prev.step === next.step) return;
    poseRef.current = next;
    setPose(next);
  }

  // --- Tweens ---------------------------------------------------------------

  /** Tween body properties to `to`. `onFrame` runs after interpolation, so it may override any of them. */
  function tween(
    to: Partial<Body>,
    duration: number,
    ease: Easing | readonly number[],
    onFrame?: (t: number, elapsedMs: number) => void
  ) {
    const from = { ...body.current };
    const keys = Object.keys(to) as (keyof Body)[];
    const seconds = reducedRef.current ? 0 : duration;
    return animate(0, 1, {
      duration: seconds,
      ease: ease as Easing,
      onUpdate: (t) => {
        for (const k of keys) body.current[k] = lerp(from[k], to[k]!, t);
        onFrame?.(t, t * seconds * 1000);
        apply();
      },
    });
  }

  /** Slide to the opposite edge in step with the room transition. */
  function glideAcross(direction: Direction) {
    const { innerWidth: vw, innerHeight: vh } = window;
    const to = {
      right: { x: 0 },
      left: { x: vw - width },
      down: { y: 0 },
      up: { y: vh - height },
    }[direction];
    return tween(to, optionsRef.current?.exitDuration ?? 0, TRANSITION_EASE);
  }

  // --- Camera (tall rooms) ----------------------------------------------------

  function scroller() {
    const el = optionsRef.current?.getScroller?.();
    const max = el ? el.scrollHeight - el.clientHeight : 0;
    return el && max > 0 ? { el, max } : null;
  }

  /**
   * Scroll a tall room so the sprite stays in the middle band of the screen.
   * Scrolling stops at the room's ends, so the screen edges are its walls there.
   * The camera's speed is capped, so it eases back to the band (e.g. after a crash) instead of jumping.
   */
  function followCamera(dt: number) {
    const scroll = scroller();
    if (!scroll) return;
    const { el, max } = scroll;
    const b = body.current;
    const vh = window.innerHeight;
    const world = b.y + el.scrollTop;
    const top = vh * CAMERA_MARGIN;
    const bottom = vh * (1 - CAMERA_MARGIN) - height;

    let shift = 0;
    if (b.y > bottom) shift = b.y - bottom;
    else if (b.y < top) shift = b.y - top;
    const step = CAMERA_SPEED * dt;
    shift = Math.min(Math.max(shift, -step), step);
    el.scrollTop = Math.min(Math.max(el.scrollTop + shift, 0), max);
    b.y = world - el.scrollTop; // read back — the browser may round
  }

  // --- Collision ------------------------------------------------------------

  // Push the feet back out of any rect they ran into along the axis of travel
  function collide(rects: Rect[], dx: number, dy: number) {
    const b = body.current;
    for (const r of rects) {
      const fx = b.x + feet.x;
      const fy = b.y + feet.y;
      if (fx >= r.x + r.w || fx + feet.w <= r.x || fy >= r.y + r.h || fy + feet.h <= r.y) continue;
      if (dx > 0) b.x = r.x - feet.x - feet.w;
      else if (dx < 0) b.x = r.x + r.w - feet.x;
      else if (dy > 0) b.y = r.y - feet.y - feet.h;
      else if (dy < 0) b.y = r.y + r.h - feet.y;
    }
  }

  /** Everything the feet can't walk through: bridge railings, and water along the room's edges. */
  function solids() {
    const { innerWidth: vw, innerHeight: vh } = window;
    const exits = optionsRef.current?.exits ?? [];
    const water = optionsRef.current?.water ?? [];
    return [...exits.flatMap((edge) => bridgeRailings(edge, vw, vh)), ...waterRects(water, exits, vw, vh)];
  }

  /** If the feet would end up in the water at `p`, bring them onto the shore instead. */
  function ashore(p: { x: number; y: number }) {
    const water = optionsRef.current?.water ?? [];
    if (!water.length) return p;
    const { innerWidth: vw, innerHeight: vh } = window;
    const wet = waterRects(water, optionsRef.current?.exits ?? [], vw, vh).some(
      (r) => p.x + feet.x < r.x + r.w && p.x + feet.x + feet.w > r.x && p.y + feet.y < r.y + r.h && p.y + feet.y + feet.h > r.y
    );
    if (!wet) return p;
    // Only the wet edges push back
    const inset = (edge: Direction) => (water.includes(edge) ? WATER : 0);
    return {
      x: Math.min(Math.max(p.x, inset("left") - feet.x), vw - inset("right") - feet.x - feet.w),
      y: Math.min(Math.max(p.y, inset("up") - feet.y), vh - inset("down") - feet.y - feet.h),
    };
  }

  function onDeck(edge: Direction) {
    const [a, b] = deckSpan(edge, window.innerWidth, window.innerHeight);
    const start = isVertical(edge) ? body.current.x + feet.x : body.current.y + feet.y;
    return start >= a && start + (isVertical(edge) ? feet.w : feet.h) <= b;
  }

  /**
   * Where a flight in `direction` ends: through a bridge, or against a wall / railing.
   * Flights never scroll a tall room — the screen edge is a wall unless that edge's bridge is in view.
   */
  function flightPath(direction: Direction) {
    const { innerWidth: vw, innerHeight: vh } = window;
    const scroll = scroller();
    const bridgeInView =
      !scroll ||
      !isVertical(direction) ||
      (direction === "up" ? scroll.el.scrollTop <= 0 : scroll.el.scrollTop >= scroll.max - 1);
    const hasBridge = bridgeInView && (optionsRef.current?.exits ?? []).includes(direction);
    const through = hasBridge && onDeck(direction);

    const b = body.current;
    // Vertical flights are airborne, so the drawn sprite meets the wall FLY_HEIGHT later
    let stop = { up: FLY_HEIGHT, down: vh - height + FLY_HEIGHT, left: 0, right: vw - width }[direction];

    if (!through && hasBridge) {
      const fx = b.x + feet.x;
      const fy = b.y + feet.y;
      for (const r of bridgeRailings(direction, vw, vh)) {
        const inLine = isVertical(direction)
          ? fx < r.x + r.w && fx + feet.w > r.x
          : fy < r.y + r.h && fy + feet.h > r.y;
        if (!inLine) continue;
        if (direction === "up") stop = Math.max(stop, r.y + r.h - feet.y);
        if (direction === "down") stop = Math.min(stop, r.y - feet.y - feet.h);
        if (direction === "left") stop = Math.max(stop, r.x + r.w - feet.x);
        if (direction === "right") stop = Math.min(stop, r.x - feet.x - feet.w);
      }
    }

    // Never fly backwards when already against the wall
    const current = isVertical(direction) ? b.y : b.x;
    stop = direction === "up" || direction === "left" ? Math.min(stop, current) : Math.max(stop, current);
    return { stop, from: current, through };
  }

  // --- Launch ---------------------------------------------------------------

  async function launch(direction: Direction) {
    if (disabled || scripted.current || crossing.current) return;
    if (Date.now() < launchLockedUntil.current) return;
    scripted.current = true;

    const vertical = isVertical(direction);
    const { stop, from, through } = flightPath(direction);
    const flightTime = Math.max(Math.abs(stop - from) / FLY_SPEED, 0.12);

    if (vertical) {
      // Crouch, spring up, fly
      updatePose({ facing: direction, action: "idle", step: 0 });
      await tween({ sx: 1.15, sy: 0.8 }, 0.1, "easeOut");
      updatePose({ facing: direction, action: "fly", step: 0 });
      await tween({ sx: 0.9, sy: 1.15, z: FLY_HEIGHT * 0.6 }, 0.08, "easeOut");
      await tween({ y: stop, z: FLY_HEIGHT, sx: 1, sy: 1 }, flightTime, [0.4, 0, 1, 1]);
    } else {
      // Knocked off his feet — flies sideways, flailing
      await tween({ x: stop }, flightTime, "linear", (t, ms) => {
        body.current.z = FLY_HEIGHT * 0.6 * Math.min(t * 5, 1);
        updatePose({ facing: direction, action: "tumble", step: Math.floor(ms / FLAIL_MS) });
      });
    }

    if (through && optionsRef.current?.onExit?.(direction)) {
      await carryOn(direction);
    } else {
      await crash(direction);
    }

    scripted.current = false;
    launchLockedUntil.current = Date.now() + LAUNCH_COOLDOWN;
    updatePose({ facing: poseRef.current.facing, action: "idle", step: 0 });
  }

  /** Through the bridge, then on to land in the middle of the new room. */
  async function carryOn(direction: Direction) {
    await glideAcross(direction);

    const centre = {
      x: (window.innerWidth - width) / 2,
      y: (window.innerHeight - height) / 2,
    };
    const { action, facing } = poseRef.current;
    const lift = body.current.z;
    await tween(centre, 0.6, "easeOut", (t, ms) => {
      body.current.z = lift * (1 - t * t); // drift down, touching down at the end
      if (action === "tumble") updatePose({ facing, action, step: Math.floor(ms / FLAIL_MS) });
    });

    // Touch down
    updatePose({ facing: direction, action: "idle", step: 0 });
    await tween({ z: 0, sx: 1.2, sy: 0.78 }, 0.07, "easeOut");
    await tween({ sx: 1, sy: 1 }, 0.22, "backOut");
  }

  /** Splat, bounce off, thud, see stars. */
  async function crash(direction: Direction) {
    // Flatten against the wall, not towards the sprite's centre
    const el = bodyRef.current;
    if (el) el.style.transformOrigin = { up: "top", down: "bottom", left: "left bottom", right: "right bottom" }[direction];
    await tween(isVertical(direction) ? { sx: 1.25, sy: 0.7 } : { sx: 0.65, sy: 1.15 }, 0.06, "easeOut");

    const BOUNCE = 22;
    const b = body.current;
    // Off the wall — and back onto dry land if he flew out over water
    const to = ashore({
      x: b.x + (direction === "left" ? BOUNCE : direction === "right" ? -BOUNCE : 0),
      y: b.y + (direction === "up" ? BOUNCE : direction === "down" ? -BOUNCE : 0),
    });
    const lift = b.z;
    await tween({ ...to, sx: 1, sy: 1 }, 0.35, "easeOut", (t, ms) => {
      body.current.z = lift * (1 - t) + 14 * Math.sin(Math.PI * t);
      updatePose({ facing: "down", action: "dazed", step: Math.floor(ms / FLAIL_MS) });
    });
    if (el) el.style.transformOrigin = ""; // back to the class default (bottom) now the scale is 1

    // Thud, then stars
    await tween({ z: 0, sx: 1.15, sy: 0.85 }, 0.06, "easeOut");
    await tween({ sx: 1, sy: 1 }, 0.15, "easeOut");
    await tween({}, DAZED_MS / 1000, "linear", (_, ms) => {
      updatePose({ facing: "down", action: "dazed", step: Math.floor(ms / (FLAIL_MS * 1.5)) });
    });
  }

  /** Back to the middle of the room, in step with the home crossfade. */
  async function recentre() {
    if (scripted.current || crossing.current) return;
    scripted.current = true;
    updatePose({ facing: "down", action: "idle", step: 0 });
    await tween(
      { x: (window.innerWidth - width) / 2, y: (window.innerHeight - height) / 2 },
      optionsRef.current?.exitDuration ?? 0,
      TRANSITION_EASE
    );
    scripted.current = false;
  }

  // Walking into a bridge: hand over to the next room
  function cross(direction: Direction) {
    if (!optionsRef.current?.onExit?.(direction)) return false;
    crossing.current = true;
    glideAcross(direction).then(() => {
      crossing.current = false;
    });
    return true;
  }

  // --- Walking --------------------------------------------------------------

  useEffect(() => {
    let last = 0;

    const tick = (now: number) => {
      // A launch is playing — stay alive while keys are held, resume after
      if (scripted.current) {
        last = now;
        frameId.current = held.current.length ? requestAnimationFrame(tick) : null;
        return;
      }

      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;

      const keys = held.current;
      const dx = (keys.includes("right") ? 1 : 0) - (keys.includes("left") ? 1 : 0);
      const dy = (keys.includes("down") ? 1 : 0) - (keys.includes("up") ? 1 : 0);
      const facing = keys[keys.length - 1];

      if (!facing || (dx === 0 && dy === 0)) {
        frameId.current = null;
        last = 0;
        distance.current = 0;
        updatePose({ facing: facing ?? poseRef.current.facing, action: "idle", step: 0 });
        return;
      }

      const travel = SPEED * dt;

      if (!crossing.current) {
        const { innerWidth: vw, innerHeight: vh } = window;
        const exits = optionsRef.current?.exits ?? [];
        const walls = solids();

        const len = Math.hypot(dx, dy);
        const b = body.current;
        b.x += (dx / len) * travel;
        collide(walls, dx, 0);
        b.y += (dy / len) * travel;
        collide(walls, 0, dy);
        followCamera(dt);

        const pushed: Direction[] = [];
        if (b.x < 0) pushed.push("left");
        else if (b.x > vw - width) pushed.push("right");
        if (b.y < 0) pushed.push("up");
        else if (b.y > vh - height) pushed.push("down");

        clamp();
        const left = pushed.some((edge) => exits.includes(edge) && onDeck(edge) && cross(edge));
        if (!left) apply();
      }

      distance.current += travel;
      updatePose({ facing, action: "walk", step: Math.floor(distance.current / STRIDE) });

      frameId.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frameId.current === null) frameId.current = requestAnimationFrame(tick);
    };

    const release = () => {
      held.current = [];
      start(); // let the loop settle into the idle pose
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const direction = KEY_DIRECTIONS[e.key.length === 1 ? e.key.toLowerCase() : e.key];
      if (!direction) return;

      e.preventDefault();
      if (!held.current.includes(direction)) held.current.push(direction);
      start();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const direction = KEY_DIRECTIONS[e.key.length === 1 ? e.key.toLowerCase() : e.key];
      if (!direction) return;
      held.current = held.current.filter((d) => d !== direction);
      start();
    };

    const handleResize = () => {
      clamp();
      apply();
    };

    if (disabled) release();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", release);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", release);
      window.removeEventListener("resize", handleResize);
      if (frameId.current !== null) cancelAnimationFrame(frameId.current);
      frameId.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  return { rootRef, bodyRef, shadowRef, pose, ready, launch, recentre };
}
