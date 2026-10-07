// The reading nook in the library's top-right corner: an armchair, a floor
// lamp and a side table with the day's paper. Walk up to the chair and press
// Space to sit, Space again to read (see seat.ts).
//
// Same pixel grid and outline colour as the sprite, so the furniture sits in his world.

import { Frame, Palette, PIXEL_SCALE } from "./pixelArt";
import { BRIDGES, Rect, WATER } from "./bridges";
import { SPRITE_FEET } from "./spriteFrames";
import { SeatState } from "./seat";

export const NOOK_PALETTE: Palette = {
  o: "#2b2a33", // outline
  x: "rgba(43, 42, 51, 0.16)", // floor shadow
  // the sitter — same colours as the sprite
  h: "#5a3a2a", // hair
  s: "#f2c29b", // skin
  e: "#2b2a33", // eyes
  t: "#5b6b8c", // shirt
  p: "#3b3f4f", // pants
  // upholstery
  A: "#d98a62",
  B: "#b9603f",
  D: "#8e4430",
  // wood — the bridge planks' tones
  l: "#c89062",
  w: "#ae7349",
  d: "#86522f",
  // lamp shade and brass
  L: "#fbeec4",
  M: "#efd796",
  N: "#cfae62",
  g: "#d8b25a",
  G: "#9a7531",
  // newspaper
  n: "#f1ede2",
  m: "#cfc9b8",
  i: "#9a968a",
  // mug
  c: "#e9e4dc",
  C: "#6a4a3a",
  // rug
  r: "#6c7fa3",
  R: "#4c5a7d",
  u: "#e2c98e",
  f: "#efe4c8",
};

const CHAIR: Frame = [
  ".....oooooooooooooooo.....",
  "....oAAAAAAAAAAAAAAAAo....",
  "...oAAAAAAAAAAAAAAAAAAo...",
  "...oABBBBBBBBBBBBBBBBDo...",
  "...oABBBBBBBBBBBBBBBBDo...",
  "...oABBBDBBBDABBBDABBDo...",
  "...oABBBBBBBBBBBBBBBBDo...",
  "..oooBBBBBBBBBBBBBBBBooo..",
  ".oAAAoBBBBDBBBBDBBBBoAAAo.",
  "oAAAAAoBBBBBBBBBBBBoAAAAAo",
  "oDDDDDoBBBBBBBBBBBBoDDDDDo",
  "oBBBBDooooooooooooooDBBBBo",
  "oBDDDDoAAAAAAAAAAAAoDDDDBo",
  "oBBADDoAAAAAAAAAAAAoDBADBo",
  "oBBBBDoBBBBBBBBBBBBoDBBBBo",
  "oBBBBDoBBBBBBBBBBBBoDBBBBo",
  "oBBBBDooooooooooooooDBBBBo",
  "oBBBBDoDDDDDDDDDDDDoDBBBBo",
  "oDDDDDoDDDDDDDDDDDDoDDDDDo",
  "oooooooooooooooooooooooooo",
  ".dxxdxxxxxxxxxxxxxxxxdxxd.",
  "...xxxxxxxxxxxxxxxxxxxx...",
];

/** Settled in: thighs on the cushion, feet dangling over the edge. */
const SITTING: Frame = [
  "...oooooo...",
  "..ohhhhhho..",
  ".ohhhhhhhho.",
  ".ohhhhhhhho.",
  ".ohssssssho.",
  ".osesssseso.",
  ".osssssssso.",
  "..osssssso..",
  ".otttttttto.",
  ".sottttttos.",
  ".oppppppppo.",
  ".oppppppppo.",
  "..oppooppo..",
  "..oppooppo..",
  "..ooo..ooo..",
];

/** The paper held open — only the top of his head shows. */
const READING: Frame = [
  "...oooooo...",
  "..ohhhhhho..",
  ".ohhhhhhhho.",
  "oooooooooooo",
  "onnnnnnnmnno",
  "oniiiinnmnio",
  "onnnnnnnmnio",
  "oniinininnio",
  "onnnnnnnmnno",
  "oniiininmiio",
  "osnnnnnnmnso",
  "oooooooooooo",
  ".oppppppppo.",
  "..oppooppo..",
  "..oppooppo..",
  "..ooo..ooo..",
];

/** Pedestal side table with the folded paper and a mug of tea. */
const TABLE: Frame = [
  ".ooooooooooo.",
  ".onninnoooCoo",
  "ooiinnmnoocoo",
  "olooooooooooo",
  "odddddddddddo",
  ".ooooooooooo.",
  ".....odo.....",
  ".....owo.....",
  ".....owo.....",
  ".....owo.....",
  ".....owo.....",
  "..owwwwwwwo..",
  ".ooooooooooo.",
  "..xxxxxxxxx..",
];

const TABLE_NO_PAPER: Frame = [
  "..oooooooooo.",
  ".ollllllloCoo",
  "ollllllllocoo",
  "olwwwwwwwoooo",
  "odddddddddddo",
  ".ooooooooooo.",
  ".....odo.....",
  ".....owo.....",
  ".....owo.....",
  ".....owo.....",
  ".....owo.....",
  "..owwwwwwwo..",
  ".ooooooooooo.",
  "..xxxxxxxxx..",
];

const LAMP: Frame = [
  "...ooooooo...",
  "..oLLLLLLMo..",
  "..oLLLLLLMo..",
  ".oLLLLLLLMMo.",
  ".oLLLLLLLMMo.",
  "oLLLLLLLLMMNo",
  "oMMMMMMMMNNNo",
  "ooooooooooooo",
  ".....ogo.....",
  ".....ogo.....",
  ".....ogo.....",
  ".....oGo.....",
  ".....ogo.....",
  ".....ogo.....",
  ".....ogo.....",
  ".....ogo.....",
  ".....ogo.....",
  ".....ogo.....",
  ".....ogo.....",
  ".....ogo.....",
  ".....ogo.....",
  "...ogggggo...",
  "..oGGGGGGGo..",
  "..xooooooox..",
  "..xxxxxxxxx..",
];

const RUG: Frame = [
  "..oooooooooooooooooooooooooooooooooooooooooooooooooooooo..",
  "ffoRRRRRuRRRuRRRuRRRuRRRuRRRuRRRuRRRuRRRuRRRuRRRuRRRRRRoff",
  "..oRRuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuRRo..",
  "ffoRRurrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrruRRoff",
  "..oRRurrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrruRRo..",
  "ffoRRurrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrruRRoff",
  "..oRRurrrrrrrrrrrrrrrrrrrrrrrurrrrrrrrrrrrrrrrrrrrrruRRo..",
  "ffoRRurrrrrrrrrrrrrrrrrrrrrurrrurrrrrrrrrrrrrrrrrrrruRRoff",
  "..oRRurrrrrrrrrrrrrrrrrrrurrrrrrrurrrrrrrrrrrrrrrrrruRRo..",
  "ffoRRurrrrrrrrrrrrrrrrrurrrrrurrrrrurrrrrrrrrrrrrrrruRRoff",
  "..oRRurrrrrrrrrrrrrrrrrrrurrrrrrrurrrrrrrrrrrrrrrrrruRRo..",
  "ffoRRurrrrrrrrrrrrrrrrrrrrrurrrurrrrrrrrrrrrrrrrrrrruRRoff",
  "..oRRurrrrrrrrrrrrrrrrrrrrrrrurrrrrrrrrrrrrrrrrrrrrruRRo..",
  "ffoRRurrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrruRRoff",
  "..oRRurrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrruRRo..",
  "ffoRRuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuRRoff",
  "..oRRRRRuRRRuRRRuRRRuRRRuRRRuRRRuRRRuRRRuRRRuRRRuRRRRRRo..",
  "..oooooooooooooooooooooooooooooooooooooooooooooooooooooo..",
];

/** `top` drawn over `base` at (x, y), in art px. */
function overlay(base: Frame, top: Frame, x: number, y: number): Frame {
  return base.map((row, by) => {
    const over = top[by - y];
    if (!over) return row;
    return [...row].map((k, bx) => (over[bx - x] && over[bx - x] !== "." ? over[bx - x] : k)).join("");
  });
}

// --- Sitting and reading -----------------------------------------------------

const SITTER_AT = { x: 7, y: 3 }; // where the sitter sits in the chair art

export const CHAIR_ART: Record<SeatState, Frame> = {
  empty: CHAIR,
  sitting: overlay(CHAIR, SITTING, SITTER_AT.x, SITTER_AT.y),
  reading: overlay(CHAIR, READING, SITTER_AT.x, SITTER_AT.y),
};

/** The paper leaves the table while it's being read. */
export const TABLE_ART: Record<SeatState, Frame> = {
  empty: TABLE,
  sitting: TABLE,
  reading: TABLE_NO_PAPER,
};

export { LAMP as LAMP_ART, RUG as RUG_ART };

// --- Layout ----------------------------------------------------------------

/** Each piece's top-left inside the nook, in art px. Drawn in this order. */
export const NOOK_LAYOUT = {
  rug: { x: 0, y: 20 },
  lamp: { x: 47, y: 0 },
  chair: { x: 20, y: 3 },
  table: { x: 5, y: 11 },
} as const;

export const NOOK_COLS = 60;
export const NOOK_ROWS = 38;

/**
 * Placement in the room, in screen px: in from the top-right corner, but on a
 * narrow screen never so far left that the furniture blocks the up bridge —
 * at the closest, it sits right up against the bridge's railing.
 */
export const NOOK_INSET = { top: 100, right: 200, bridgeClearance: BRIDGES.up.width / 2 };

/** Centre of the lamp shade, in art px — where its glow comes from. */
export const LAMP_LIGHT = { x: NOOK_LAYOUT.lamp.x + 6.5, y: NOOK_LAYOUT.lamp.y + 4 };

// --- Geometry for the sprite (screen px) ------------------------------------

const FLOOR = 23; // art row where the furniture meets the floor
const SEAT = { x: 26, w: 14 }; // the cushion, in art px across the nook

const px = (n: number) => n * PIXEL_SCALE;

// The solid starts this far into the nook (the table's left edge)
const SOLID_LEFT = 5;
// Leftmost the nook may sit: its solid starts right of the up bridge, with room to walk past
const minLeft = (vw: number) => vw / 2 + NOOK_INSET.bridgeClearance - px(SOLID_LEFT);

/** The nook's top-left corner. `nookLeftCss` is the same rule for the stylesheet. */
function origin(vw: number) {
  return { x: Math.max(minLeft(vw), vw - NOOK_INSET.right - px(NOOK_COLS)), y: NOOK_INSET.top };
}

export const nookLeftCss = `max(calc(50vw + ${NOOK_INSET.bridgeClearance - px(SOLID_LEFT)}px), calc(100vw - ${NOOK_INSET.right + px(NOOK_COLS)}px))`;

/**
 * Narrowest screen with room for the nook: pushed right of the up bridge, the
 * sprite's feet must still fit in front of the seat before the right-edge water.
 * Below this the library has no nook at all.
 */
export const NOOK_MIN_VW = 2 * (NOOK_INSET.bridgeClearance + px(SEAT.x - SOLID_LEFT + SPRITE_FEET.w) + WATER);

export const nookFits = (vw: number) => vw >= NOOK_MIN_VW;

/** Solid: the furniture and the corner behind it, up to the top of the room. */
export function nookSolids(vw: number): Rect[] {
  if (!nookFits(vw)) return [];
  const o = origin(vw);
  return [{ x: o.x + px(SOLID_LEFT), y: 0, w: px(54), h: o.y + px(FLOOR) }];
}

/** Stand with your feet here to sit down. */
export function seatZone(vw: number): Rect {
  const o = origin(vw);
  return { x: o.x + px(SEAT.x), y: o.y + px(FLOOR), w: px(SEAT.w), h: px(8) };
}

/** Where the sprite's feet land when it gets up: centred on the chair, just in front. */
export function standingSpot(vw: number): { x: number; y: number } {
  const o = origin(vw);
  return { x: o.x + px(SEAT.x + SEAT.w / 2), y: o.y + px(FLOOR) };
}
