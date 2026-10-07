import { Direction } from "./grid";
import { PIXEL_SCALE } from "./pixelArt";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Bridge art at display size (source PNGs are 2×). Bridges sit centred on their edge. */
export const BRIDGES: Record<Direction, { src: string; width: number; height: number }> = {
  up: { src: "/bridges/bridge-north.png", width: 82, height: 57 },
  down: { src: "/bridges/bridge-south.png", width: 82, height: 57 },
  left: { src: "/bridges/bridge-west.png", width: 57, height: 82 },
  right: { src: "/bridges/bridge-east.png", width: 59, height: 82 },
};

const SPAN = 82; // length along the edge — shared by every bridge
const POST = 12; // railing on each side of the deck

const isVertical = (edge: Direction) => edge === "up" || edge === "down";

/** The whole bridge, railings included, measured along the edge. */
export function bridgeSpan(edge: Direction, vw: number, vh: number): [number, number] {
  const center = isVertical(edge) ? vw / 2 : vh / 2;
  return [center - SPAN / 2, center + SPAN / 2];
}

/** The walkable gap between the railings, measured along the edge. */
export function deckSpan(edge: Direction, vw: number, vh: number): [number, number] {
  const [a, b] = bridgeSpan(edge, vw, vh);
  return [a + POST, b - POST];
}

/** The two railings of a bridge — solid. */
export function bridgeRailings(edge: Direction, vw: number, vh: number): Rect[] {
  const { width, height } = BRIDGES[edge];
  const [a, b] = deckSpan(edge, vw, vh);

  if (isVertical(edge)) {
    const y = edge === "up" ? 0 : vh - height;
    return [
      { x: a - POST, y, w: POST, h: height },
      { x: b, y, w: POST, h: height },
    ];
  }
  const x = edge === "left" ? 0 : vw - width;
  return [
    { x, y: a - POST, w: width, h: POST },
    { x, y: b, w: width, h: POST },
  ];
}

// --- Water -------------------------------------------------------------------

/** Width of the water along a room's edge. Bridges are long enough to cross it onto land. */
export const WATER = 16 * PIXEL_SCALE;

/** The water along a room's `edges` — solid, except where a bridge crosses it. */
export function waterRects(edges: Direction[], exits: Direction[], vw: number, vh: number): Rect[] {
  return edges.flatMap((edge) => {
    const length = isVertical(edge) ? vw : vh;
    const band = (from: number, to: number): Rect =>
      isVertical(edge)
        ? { x: from, y: edge === "up" ? 0 : vh - WATER, w: to - from, h: WATER }
        : { x: edge === "left" ? 0 : vw - WATER, y: from, w: WATER, h: to - from };
    if (!exits.includes(edge)) return [band(0, length)];
    const [a, b] = bridgeSpan(edge, vw, vh);
    return [band(0, a), band(b, length)];
  });
}
