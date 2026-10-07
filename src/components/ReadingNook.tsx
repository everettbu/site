import { memo } from "react";
import {
  Frame,
  NOOK_PALETTE,
  NOOK_SCALE,
  NOOK_COLS,
  NOOK_ROWS,
  NOOK_INSET,
  NOOK_LAYOUT,
  LAMP_LIGHT,
  CHAIR_ART,
  TABLE_ART,
  LAMP_ART,
  RUG_ART,
  SeatState,
} from "@/lib/readingNook";

/** One SVG path per colour, positioned in art px inside the nook. */
const Piece = memo(function Piece({ frame, at }: { frame: Frame; at: { x: number; y: number } }) {
  const paths: Record<string, string> = {};
  frame.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const key = row[x];
      if (key !== ".") paths[key] = (paths[key] ?? "") + `M${x} ${y}h1v1h-1z`;
    }
  });
  const cols = frame[0].length;
  const rows = frame.length;
  return (
    <svg
      width={cols * NOOK_SCALE}
      height={rows * NOOK_SCALE}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      className="absolute block"
      style={{ left: at.x * NOOK_SCALE, top: at.y * NOOK_SCALE }}
      aria-hidden
    >
      {Object.entries(paths).map(([key, d]) => (
        <path key={key} d={d} fill={NOOK_PALETTE[key]} />
      ))}
    </svg>
  );
});

const GLOW = 180; // px across the lamp's pool of light

export default function ReadingNook({ state = "empty" }: { state?: SeatState }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top: NOOK_INSET.top,
        right: NOOK_INSET.right,
        width: NOOK_COLS * NOOK_SCALE,
        height: NOOK_ROWS * NOOK_SCALE,
      }}
      aria-hidden
    >
      <div
        className="absolute rounded-full"
        style={{
          width: GLOW,
          height: GLOW,
          left: LAMP_LIGHT.x * NOOK_SCALE - GLOW / 2,
          top: LAMP_LIGHT.y * NOOK_SCALE - GLOW / 2,
          background: "radial-gradient(closest-side, rgba(255, 228, 150, 0.35), rgba(255, 228, 150, 0))",
        }}
      />
      <Piece frame={RUG_ART} at={NOOK_LAYOUT.rug} />
      <Piece frame={LAMP_ART} at={NOOK_LAYOUT.lamp} />
      <Piece frame={CHAIR_ART[state]} at={NOOK_LAYOUT.chair} />
      <Piece frame={TABLE_ART[state]} at={NOOK_LAYOUT.table} />
    </div>
  );
}
