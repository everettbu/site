// Pixel art as text grids: each row a string of palette keys, "." transparent.

export type Frame = readonly string[];
export type Palette = Record<string, string>;

export const PIXEL_SCALE = 3; // screen px per art px — shared by the sprite and the world art

/** One SVG path per colour — a handful of nodes instead of one per pixel. */
export function framePaths(frame: Frame, palette: Palette) {
  const paths: Record<string, string> = {};
  frame.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const key = row[x];
      if (key === ".") continue;
      paths[key] = (paths[key] ?? "") + `M${x} ${y}h1v1h-1z`;
    }
  });
  return Object.entries(paths).map(([key, d]) => ({ key, d, fill: palette[key] }));
}

/** A frame as an SVG data URI, for tiling as a CSS background. */
export function frameDataUri(frame: Frame, palette: Palette) {
  const cols = frame[0].length;
  const rows = frame.length;
  const body = framePaths(frame, palette)
    .map(({ d, fill }) => `<path d='${d}' fill='${fill}'/>`)
    .join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${cols} ${rows}' shape-rendering='crispEdges'>${body}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
