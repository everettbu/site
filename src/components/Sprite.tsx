"use client";

import { useRef, memo } from "react";
import { Direction } from "@/lib/grid";
import { useSpriteMovement } from "@/lib/useSpriteMovement";
import {
  Frame,
  SPRITE_COLS,
  SPRITE_ROWS,
  SPRITE_SCALE,
  SPRITE_PALETTE,
  SPRITE_FRAMES,
  SPRITE_FEET,
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

// One path per colour — a handful of nodes instead of one per pixel
const FrameArt = memo(function FrameArt({ frame }: { frame: Frame }) {
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
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${SPRITE_COLS} ${SPRITE_ROWS}`}
      shapeRendering="crispEdges"
      aria-hidden
    >
      {Object.entries(paths).map(([key, d]) => (
        <path key={key} d={d} fill={SPRITE_PALETTE[key]} />
      ))}
    </svg>
  );
});

interface SpriteProps {
  disabled?: boolean;
  exits?: Direction[];
  onExit?: (d: Direction) => boolean;
  exitDuration?: number;
}

export default function Sprite({ disabled, exits, onExit, exitDuration }: SpriteProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { pose, ready } = useSpriteMovement(ref, BOX, { disabled, exits, onExit, exitDuration });

  const set = SPRITE_FRAMES[pose.facing];
  const frame = pose.moving ? set.walk[pose.step % set.walk.length] : set.idle;

  return (
    <div
      ref={ref}
      className={`fixed top-0 left-0 z-40 pointer-events-none will-change-transform transition-opacity duration-500 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      <div style={set.mirror ? { transform: "scaleX(-1)" } : undefined}>
        <FrameArt frame={frame} />
      </div>
    </div>
  );
}
