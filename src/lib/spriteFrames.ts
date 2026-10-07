import { Direction } from "./grid";
import { Frame } from "./pixelArt";
import type { SpritePose } from "./useSpriteMovement";

// Placeholder pixel art. Each frame is a grid of palette keys; "." is transparent.
// Side frames face right — left is the same art mirrored.

export const SPRITE_COLS = 12;
export const SPRITE_ROWS = 16;

// Collision box around the legs, in art px — the head may overlap walls and railings
export const SPRITE_FEET = { x: 2, y: 12, w: 8, h: 4 };

export const SPRITE_PALETTE: Record<string, string> = {
  o: "#2b2a33", // outline
  h: "#5a3a2a", // hair
  s: "#f2c29b", // skin
  e: "#2b2a33", // eyes
  t: "#5b6b8c", // shirt
  p: "#3b3f4f", // pants
  y: "#f2c94c", // dizzy stars
  x: "rgba(43, 42, 51, 0.16)", // ground shadow
};


const HEAD_FRONT = [
  "...oooooo...",
  "..ohhhhhho..",
  ".ohhhhhhhho.",
  ".ohhhhhhhho.",
  ".ohssssssho.",
  ".osesssseso.",
  ".osssssssso.",
  "..osssssso..",
];

const HEAD_BACK = [
  "...oooooo...",
  "..ohhhhhho..",
  ".ohhhhhhhho.",
  ".ohhhhhhhho.",
  ".ohhhhhhhho.",
  ".ohhhhhhhho.",
  ".ohhhhhhhho.",
  "..osssssso..",
];

const TORSO_FRONT = [
  "..otttttto..",
  ".otttttttto.",
  ".otttttttto.",
  ".sottttttos.",
  "..oppppppo..",
];

const LEGS_FRONT_IDLE = ["..oppooppo..", "..oppooppo..", "..ooo..ooo.."];
const LEGS_FRONT_A = ["..oppooppo..", "..oppo.ooo..", "..ooo......."];
const LEGS_FRONT_B = ["..oppooppo..", "..ooo.oppo..", ".......ooo.."];

const SIDE_UPPER = [
  "...ooooo....",
  "..ohhhhho...",
  ".ohhhhhhho..",
  ".ohhhhhhho..",
  ".ohhhhssso..",
  ".ohhhsseso..",
  ".ohhsssssso.",
  "..osssssoo..",
  "...otttto...",
  "..otttttto..",
  "..otttttto..",
  "..ottttsto..",
];

const LEGS_SIDE_IDLE = ["...oppppo...", "...oppppo...", "...oppppo...", "...ooooooo.."];
const LEGS_SIDE_STRIDE = ["...oppppo...", "..oppooppo..", ".oppo..oppo.", ".ooo....ooo."];

function front(head: string[], legs: string[]): Frame {
  return [...head, ...TORSO_FRONT, ...legs];
}

export interface FrameSet {
  idle: Frame;
  walk: readonly Frame[]; // looped while moving
}

const down: FrameSet = {
  idle: front(HEAD_FRONT, LEGS_FRONT_IDLE),
  walk: [
    front(HEAD_FRONT, LEGS_FRONT_A),
    front(HEAD_FRONT, LEGS_FRONT_IDLE),
    front(HEAD_FRONT, LEGS_FRONT_B),
    front(HEAD_FRONT, LEGS_FRONT_IDLE),
  ],
};

const up: FrameSet = {
  idle: front(HEAD_BACK, LEGS_FRONT_IDLE),
  walk: [
    front(HEAD_BACK, LEGS_FRONT_A),
    front(HEAD_BACK, LEGS_FRONT_IDLE),
    front(HEAD_BACK, LEGS_FRONT_B),
    front(HEAD_BACK, LEGS_FRONT_IDLE),
  ],
};

const sideIdle = [...SIDE_UPPER, ...LEGS_SIDE_IDLE];
const sideStride = [...SIDE_UPPER, ...LEGS_SIDE_STRIDE];

const right: FrameSet = { idle: sideIdle, walk: [sideStride, sideIdle] };
const left = right;

export const SPRITE_FRAMES: Record<Direction, FrameSet> = { up, down, left, right };

// --- Flight, knock-back and crash ---------------------------------------

// Superhero pose: arms straight overhead, legs together
const FLY_LOWER = [
  "otttttttttto",
  ".otttttttto.",
  ".otttttttto.",
  "..otttttto..",
  "..oppppppo..",
  "..oppooppo..",
  "...oppppo...",
  "....oooo....",
];

const FLY_UP: Frame = [
  "oo.oooooo.oo",
  "os.ohhhho.so",
  "osohhhhhhoso",
  "otohhhhhhoto",
  "otohhhhhhoto",
  "otohhhhhhoto",
  "otohhhhhhoto",
  "otossssssoto",
  ...FLY_LOWER,
];

// Flying down: the same back view as FLY_UP, turned 180° — fists and head lead, legs trail
const FLY_DOWN: Frame = [...FLY_UP].reverse().map((row) => [...row].reverse().join(""));

// Flying sideways (faces right, the way he's going): fist forward, legs trailing, flailing
const TUMBLE: readonly Frame[] = [
  [
    ...SIDE_UPPER.slice(0, 8),
    "...ottttooo.",
    "..otttttttso",
    "..ottttttoo.",
    "..opppppo...",
    ".oppppppo...",
    "oppppoo.....",
    "ooooo.......",
    "............",
  ],
  [
    ...SIDE_UPPER.slice(0, 8),
    "...ottttoos.",
    "..ottttttoo.",
    "..otttttto..",
    "..opppppo...",
    "..opppppo...",
    ".opppooo....",
    ".oooo.......",
    "............",
  ],
];

// Seeing stars — the two frames swap the stars to make them twinkle
const DAZED_FACE = ".oseesseeso.";
const dazed = (r0: string, r2: string): Frame => [
  r0,
  HEAD_FRONT[1],
  r2,
  ...HEAD_FRONT.slice(3, 5),
  DAZED_FACE,
  ...HEAD_FRONT.slice(6),
  ...TORSO_FRONT,
  ...LEGS_FRONT_IDLE,
];
const DAZED: readonly Frame[] = [
  dazed("y..oooooo...", ".ohhhhhhhhoy"),
  dazed("...oooooo..y", "yohhhhhhhho."),
];

export const SPRITE_SHADOW: Frame = [".oooooooo.", "oooooooooo", ".oooooooo."].map((r) =>
  r.replaceAll("o", "x")
);

/** The art for a pose. Side-facing art is mirrored for "left". */
export function getFrame({ facing, action, step }: SpritePose): { frame: Frame; mirror: boolean } {
  const set = SPRITE_FRAMES[facing];
  const mirror = facing === "left";
  switch (action) {
    case "walk":
      return { frame: set.walk[step % set.walk.length], mirror };
    case "fly":
      return { frame: facing === "up" ? FLY_UP : FLY_DOWN, mirror: false };
    case "tumble":
      return { frame: TUMBLE[step % TUMBLE.length], mirror };
    case "dazed":
      return { frame: DAZED[step % DAZED.length], mirror: false };
    default:
      return { frame: set.idle, mirror };
  }
}
