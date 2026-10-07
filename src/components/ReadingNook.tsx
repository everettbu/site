import { useContext } from "react";
import { PIXEL_SCALE, Frame } from "@/lib/pixelArt";
import { SeatContext } from "@/lib/seat";
import {
  NOOK_PALETTE,
  NOOK_COLS,
  NOOK_ROWS,
  NOOK_INSET,
  NOOK_LAYOUT,
  LAMP_LIGHT,
  CHAIR_ART,
  TABLE_ART,
  LAMP_ART,
  RUG_ART,
  NOOK_MIN_VW,
  nookLeftCss,
} from "@/lib/readingNook";
import PixelArt from "./PixelArt";

function Piece({ frame, at }: { frame: Frame; at: { x: number; y: number } }) {
  return (
    <div className="absolute" style={{ left: at.x * PIXEL_SCALE, top: at.y * PIXEL_SCALE }}>
      <PixelArt frame={frame} palette={NOOK_PALETTE} />
    </div>
  );
}

const GLOW = 180; // px across the lamp's pool of light

export default function ReadingNook() {
  const state = useContext(SeatContext);
  return (
    <>
      {/* Same cutoff as the sprite's collisions: too narrow a screen, no nook */}
      <style>{`@media (width < ${NOOK_MIN_VW}px) { .reading-nook { display: none; } }`}</style>
      <div
        className="reading-nook absolute pointer-events-none"
        style={{
          top: NOOK_INSET.top,
          left: nookLeftCss,
          width: NOOK_COLS * PIXEL_SCALE,
          height: NOOK_ROWS * PIXEL_SCALE,
        }}
        aria-hidden
      >
        <div
          className="absolute rounded-full"
          style={{
            width: GLOW,
            height: GLOW,
            left: LAMP_LIGHT.x * PIXEL_SCALE - GLOW / 2,
            top: LAMP_LIGHT.y * PIXEL_SCALE - GLOW / 2,
            background: "radial-gradient(closest-side, rgba(255, 228, 150, 0.35), rgba(255, 228, 150, 0))",
          }}
        />
        <Piece frame={RUG_ART} at={NOOK_LAYOUT.rug} />
        <Piece frame={LAMP_ART} at={NOOK_LAYOUT.lamp} />
        <Piece frame={CHAIR_ART[state]} at={NOOK_LAYOUT.chair} />
        <Piece frame={TABLE_ART[state]} at={NOOK_LAYOUT.table} />
      </div>
    </>
  );
}
