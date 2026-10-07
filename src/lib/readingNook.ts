// The reading nook in the library's top-right corner: an armchair, a floor
// lamp and a side table with the day's paper. Walk up to the chair and press
// Space to sit, Space again to read.
//
// Art is a grid of palette keys per row, "." transparent — the same format,
// scale and outline colour as the sprite, so the furniture sits on its pixel grid.

export type Frame = readonly string[];
export type Palette = Record<string, string>;

export const NOOK_SCALE = 3; // screen px per art px — matches the sprite

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

export type SeatState = "empty" | "sitting" | "reading";

/**
 * Space: sits down when standing at the chair, then opens the paper, then
 * folds it again. Walking (any arrow key) gets back up — see `standUp`.
 */
export function pressSpace(state: SeatState, atChair: boolean): SeatState {
  if (state === "empty") return atChair ? "sitting" : "empty";
  return state === "sitting" ? "reading" : "sitting";
}

export const standUp = (): SeatState => "empty";

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

/** Distance from the room's top-right corner, in screen px — clears the top exit label. */
export const NOOK_INSET = { top: 72, right: 110 };

/** Centre of the lamp shade, in art px — where its glow comes from. */
export const LAMP_LIGHT = { x: NOOK_LAYOUT.lamp.x + 6.5, y: NOOK_LAYOUT.lamp.y + 4 };

// --- Geometry for the sprite (screen px) ------------------------------------

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const FLOOR = 23; // art row where the furniture meets the floor
const SEAT = { x: 26, w: 14 }; // the cushion, in art px across the nook

function origin(vw: number) {
  return { x: vw - NOOK_INSET.right - NOOK_COLS * NOOK_SCALE, y: NOOK_INSET.top };
}

const px = (n: number) => n * NOOK_SCALE;

/** Solid: the furniture and the corner behind it, up to the top of the room. */
export function nookSolids(vw: number): Rect[] {
  const o = origin(vw);
  return [{ x: o.x + px(5), y: 0, w: px(54), h: o.y + px(FLOOR) }];
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
