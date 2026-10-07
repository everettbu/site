import { Frame, Palette } from "./pixelArt";

// Placeholder world art, on the same pixel grid as the sprite.

// Calm, low-contrast water — close to the page so it frames the room without pulling focus
export const WATER_COLOR = "#e8f1f7";

export const WORLD_PALETTE: Palette = {
  v: "#cfe0ec", // wave crest
};

export const WATER_TILE_COLS = 40;
export const WATER_TILE_ROWS = 40; // tall, so the side bands don't repeat visibly

// A small crest:  .vvv.
//                 v...v
const CREST = [".vvv.", "v...v"];

function waves(at: [x: number, y: number][]): Frame {
  const grid = Array.from({ length: WATER_TILE_ROWS }, () => ".".repeat(WATER_TILE_COLS).split(""));
  for (const [x, y] of at) {
    CREST.forEach((row, dy) => [...row].forEach((key, dx) => key !== "." && (grid[y + dy][x + dx] = key)));
  }
  return grid.map((row) => row.join(""));
}

/** Two sparse sets of crests that sway out of step with each other. */
export const WATER_WAVES: [Frame, Frame] = [
  waves([[3, 3], [24, 10], [12, 21], [31, 27], [5, 35]]),
  waves([[15, 6], [33, 1], [8, 13], [22, 31], [36, 18]]),
];
