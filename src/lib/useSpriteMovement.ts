"use client";

import { useState, useEffect, useLayoutEffect, useRef, RefObject } from "react";
import { animate } from "motion/react";
import { Direction } from "./grid";
import { Rect, deckSpan, bridgeRailings } from "./bridges";
import { TRANSITION_EASE } from "./useGridNavigation";

const SPEED = 200; // px per second
const STRIDE = 14; // px travelled per walk frame

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

export interface SpritePose {
  facing: Direction;
  moving: boolean;
  step: number; // index into the walk cycle
}

/**
 * Moves the element behind `ref` with arrow keys / WASD.
 * Screen edges are walls; the only way out is across a bridge deck on one of
 * the room's `exits`. Bridge railings collide with the sprite's feet. Crossing
 * calls `onExit`; if that starts a room transition, the sprite glides to the
 * opposite edge in step with the room slide.
 * Position is written straight to the DOM each frame; React only re-renders
 * when the pose (facing / walk frame) changes. The rAF loop stops when idle.
 */
export function useSpriteMovement(
  ref: RefObject<HTMLElement | null>,
  box: { width: number; height: number; feet: Rect }, // feet: hitbox, relative to the sprite
  options?: {
    disabled?: boolean;
    exits?: Direction[];
    onExit?: (direction: Direction) => boolean;
    exitDuration?: number;
  }
) {
  const disabled = options?.disabled ?? false;
  const [pose, setPose] = useState<SpritePose>({ facing: "down", moving: false, step: 0 });
  const [ready, setReady] = useState(false);

  const pos = useRef({ x: 0, y: 0 });
  const held = useRef<Direction[]>([]); // most recently pressed last
  const poseRef = useRef(pose);
  const frameId = useRef<number | null>(null);
  const distance = useRef(0);
  const crossing = useRef(false); // gliding into the next room

  // Latest room/callbacks without re-subscribing listeners
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  const { width, height, feet } = box;

  // Place below the centre of the viewport on mount
  useLayoutEffect(() => {
    pos.current = {
      x: Math.round((window.innerWidth - width) / 2),
      y: Math.round(window.innerHeight / 2 + 48),
    };
    apply();
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function apply() {
    const el = ref.current;
    if (!el) return;
    // Whole pixels keep the pixel art crisp
    el.style.transform = `translate3d(${Math.round(pos.current.x)}px, ${Math.round(pos.current.y)}px, 0)`;
  }

  function clamp() {
    const p = pos.current;
    p.x = Math.min(Math.max(p.x, 0), window.innerWidth - width);
    p.y = Math.min(Math.max(p.y, 0), window.innerHeight - height);
  }

  function updatePose(next: SpritePose) {
    const prev = poseRef.current;
    if (prev.facing === next.facing && prev.moving === next.moving && prev.step === next.step) return;
    poseRef.current = next;
    setPose(next);
  }

  // Push the feet back out of any rect they ran into along the axis of travel
  function collide(rects: Rect[], dx: number, dy: number) {
    const p = pos.current;
    for (const r of rects) {
      const fx = p.x + feet.x;
      const fy = p.y + feet.y;
      if (fx >= r.x + r.w || fx + feet.w <= r.x || fy >= r.y + r.h || fy + feet.h <= r.y) continue;
      if (dx > 0) p.x = r.x - feet.x - feet.w;
      else if (dx < 0) p.x = r.x + r.w - feet.x;
      else if (dy > 0) p.y = r.y - feet.y - feet.h;
      else if (dy < 0) p.y = r.y + r.h - feet.y;
    }
  }

  function onDeck(edge: Direction) {
    const [a, b] = deckSpan(edge, window.innerWidth, window.innerHeight);
    const vertical = edge === "up" || edge === "down";
    const start = vertical ? pos.current.x + feet.x : pos.current.y + feet.y;
    return start >= a && start + (vertical ? feet.w : feet.h) <= b;
  }

  // Hand the sprite over to the next room, matching the room slide
  function cross(direction: Direction) {
    const opts = optionsRef.current;
    if (!opts?.onExit?.(direction)) return false;

    const from = { ...pos.current };
    const to = {
      x: direction === "right" ? 0 : direction === "left" ? window.innerWidth - width : from.x,
      y: direction === "down" ? 0 : direction === "up" ? window.innerHeight - height : from.y,
    };

    crossing.current = true;
    animate(0, 1, {
      duration: opts.exitDuration ?? 0,
      ease: TRANSITION_EASE,
      onUpdate: (t) => {
        pos.current = { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
        apply();
      },
      onComplete: () => {
        crossing.current = false;
      },
    });
    return true;
  }

  useEffect(() => {
    let last = 0;

    const tick = (now: number) => {
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
        updatePose({ facing: facing ?? poseRef.current.facing, moving: false, step: 0 });
        return;
      }

      const travel = SPEED * dt;

      if (!crossing.current) {
        const { innerWidth: vw, innerHeight: vh } = window;
        const exits = optionsRef.current?.exits ?? [];
        const railings = exits.flatMap((edge) => bridgeRailings(edge, vw, vh));

        const len = Math.hypot(dx, dy);
        const p = pos.current;
        p.x += (dx / len) * travel;
        collide(railings, dx, 0);
        p.y += (dy / len) * travel;
        collide(railings, 0, dy);

        const pushed: Direction[] = [];
        if (p.x < 0) pushed.push("left");
        else if (p.x > vw - width) pushed.push("right");
        if (p.y < 0) pushed.push("up");
        else if (p.y > vh - height) pushed.push("down");

        clamp();
        const left = pushed.some((edge) => exits.includes(edge) && onDeck(edge) && cross(edge));
        if (!left) apply();
      }

      distance.current += travel;
      updatePose({ facing, moving: true, step: Math.floor(distance.current / STRIDE) });

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

  return { pose, ready };
}
