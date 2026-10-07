import { Direction } from "./grid";

// Placeholder pixel art. Each frame is a grid of palette keys; "." is transparent.
// Side frames face right — left is the same art mirrored.

export const SPRITE_COLS = 12;
export const SPRITE_ROWS = 16;
export const SPRITE_SCALE = 3; // screen px per art px — matches the bridge art

// Collision box around the legs, in art px — the head may overlap walls and railings
export const SPRITE_FEET = { x: 2, y: 12, w: 8, h: 4 };

export const SPRITE_PALETTE: Record<string, string> = {
  o: "#2b2a33", // outline
  h: "#5a3a2a", // hair
  s: "#f2c29b", // skin
  e: "#2b2a33", // eyes
  t: "#5b6b8c", // shirt
  p: "#3b3f4f", // pants
};

export type Frame = readonly string[];

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
  mirror?: boolean;
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
const left: FrameSet = { ...right, mirror: true };

export const SPRITE_FRAMES: Record<Direction, FrameSet> = { up, down, left, right };
