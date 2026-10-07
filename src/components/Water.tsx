import { CSSProperties } from "react";
import { Direction } from "@/lib/grid";
import { PIXEL_SCALE, frameDataUri } from "@/lib/pixelArt";
import { WATER } from "@/lib/bridges";
import { WORLD_PALETTE, WATER_COLOR, WATER_WAVES, WATER_TILE_COLS, WATER_TILE_ROWS } from "@/lib/worldArt";

const TILE_W = WATER_TILE_COLS * PIXEL_SCALE;
const TILE_H = WATER_TILE_ROWS * PIXEL_SCALE;

// Paint only a band of WATER px along each wet edge
const BANDS: Record<Direction, string> = {
  up: `top / 100% ${WATER}px`,
  down: `bottom / 100% ${WATER}px`,
  left: `left / ${WATER}px 100%`,
  right: `right / ${WATER}px 100%`,
};
const bandMask = (edges: Direction[]) =>
  edges.map((edge) => `linear-gradient(#000 0 0) ${BANDS[edge]} no-repeat`).join(", ");

const WAVES = WATER_WAVES.map(
  (frame): CSSProperties => ({
    backgroundImage: frameDataUri(frame, WORLD_PALETTE),
    backgroundSize: `${TILE_W}px ${TILE_H}px`,
    "--sway": `${PIXEL_SCALE}px`,
  } as CSSProperties)
);

/**
 * Calm pixel water along the room's `edges`: sparse wave crests that sway a
 * single art pixel, two sets out of step. Stepped transform animation only,
 * so it runs on the compositor.
 */
export default function Water({ edges }: { edges: Direction[] }) {
  const mask = bandMask(edges);
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ backgroundColor: WATER_COLOR, mask, WebkitMask: mask }}
      aria-hidden
    >
      <div
        className="absolute -inset-x-3 inset-y-0 animate-[water-sway_4.8s_steps(1)_infinite] motion-reduce:animate-none"
        style={WAVES[0]}
      />
      <div
        className="absolute -inset-x-3 inset-y-0 animate-[water-sway_4.8s_steps(1)_-2.4s_infinite] motion-reduce:animate-none"
        style={WAVES[1]}
      />
    </div>
  );
}
