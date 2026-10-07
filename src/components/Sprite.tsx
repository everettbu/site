"use client";

import { memo, Ref, useImperativeHandle } from "react";
import { Direction } from "@/lib/grid";
import { useSpriteMovement } from "@/lib/useSpriteMovement";
import {
  Frame,
  SPRITE_COLS,
  SPRITE_ROWS,
  SPRITE_SCALE,
  SPRITE_PALETTE,
  SPRITE_FEET,
  SPRITE_SHADOW,
  getFrame,
} from "@/lib/spriteFrames";

const WIDTH = SPRITE_COLS * SPRITE_SCALE;
const HEIGHT = SPRITE_ROWS * SPRITE_SCALE;
const BOX = {
  width: WIDTH,
  height: HEIGHT,
  feet: {
    x: SPRITE_FEET.x * SPRITE_SCALE,
    y: SPRITE_FEET.y * SPRITE_SCALE,
    w: SPRITE_FEET.w * SPRITE_SCALE,
    h: SPRITE_FEET.h * SPRITE_SCALE,
  },
};

const SHADOW_COLS = SPRITE_SHADOW[0].length;
const SHADOW_ROWS = SPRITE_SHADOW.length;

// One path per colour — a handful of nodes instead of one per pixel
const FrameArt = memo(function FrameArt({ frame }: { frame: Frame }) {
  const cols = frame[0].length;
  const rows = frame.length;
  const paths: Record<string, string> = {};
  frame.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const key = row[x];
      if (key === ".") continue;
      paths[key] = (paths[key] ?? "") + `M${x} ${y}h1v1h-1z`;
    }
  });

  return (
    <svg
      width={cols * SPRITE_SCALE}
      height={rows * SPRITE_SCALE}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      className="block"
      aria-hidden
    >
      {Object.entries(paths).map(([key, d]) => (
        <path key={key} d={d} fill={SPRITE_PALETTE[key]} />
      ))}
    </svg>
  );
});

export interface SpriteHandle {
  launch: (direction: Direction) => void;
}

interface SpriteProps {
  ref?: Ref<SpriteHandle>;
  disabled?: boolean;
  exits?: Direction[];
  onExit?: (d: Direction) => boolean;
  exitDuration?: number;
}

export default function Sprite({ ref, disabled, exits, onExit, exitDuration }: SpriteProps) {
  const { rootRef, bodyRef, shadowRef, pose, ready, launch } = useSpriteMovement(BOX, {
    disabled,
    exits,
    onExit,
    exitDuration,
  });

  useImperativeHandle(ref, () => ({ launch }));

  const { frame, mirror } = getFrame(pose);

  return (
    <div
      ref={rootRef}
      className={`fixed top-0 left-0 z-40 pointer-events-none will-change-transform transition-opacity duration-500 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
      style={{ width: WIDTH, height: HEIGHT }}
    >
      {/* Stays on the ground while the body leaves it */}
      <div
        ref={shadowRef}
        className="absolute"
        style={{
          left: ((SPRITE_COLS - SHADOW_COLS) / 2) * SPRITE_SCALE,
          top: (SPRITE_ROWS - SHADOW_ROWS + 1) * SPRITE_SCALE,
        }}
      >
        <FrameArt frame={SPRITE_SHADOW} />
      </div>
      <div ref={bodyRef} className="relative origin-bottom will-change-transform">
        <div style={mirror ? { transform: "scaleX(-1)" } : undefined}>
          <FrameArt frame={frame} />
        </div>
      </div>
    </div>
  );
}
