"use client";

import { Ref, useImperativeHandle } from "react";
import { Direction } from "@/lib/grid";
import { useSpriteMovement } from "@/lib/useSpriteMovement";
import { PIXEL_SCALE } from "@/lib/pixelArt";
import {
  SPRITE_COLS,
  SPRITE_ROWS,
  SPRITE_PALETTE,
  SPRITE_FEET,
  SPRITE_SHADOW,
  getFrame,
} from "@/lib/spriteFrames";
import PixelArt from "./PixelArt";

const WIDTH = SPRITE_COLS * PIXEL_SCALE;
const HEIGHT = SPRITE_ROWS * PIXEL_SCALE;
const BOX = {
  width: WIDTH,
  height: HEIGHT,
  feet: {
    x: SPRITE_FEET.x * PIXEL_SCALE,
    y: SPRITE_FEET.y * PIXEL_SCALE,
    w: SPRITE_FEET.w * PIXEL_SCALE,
    h: SPRITE_FEET.h * PIXEL_SCALE,
  },
};

const SHADOW_COLS = SPRITE_SHADOW[0].length;
const SHADOW_ROWS = SPRITE_SHADOW.length;

export interface SpriteHandle {
  launch: (direction: Direction) => void;
  recentre: () => void;
}

interface SpriteProps {
  ref?: Ref<SpriteHandle>;
  disabled?: boolean;
  exits?: Direction[];
  water?: Direction[];
  onExit?: (d: Direction) => boolean;
  exitDuration?: number;
  getScroller?: () => HTMLElement | undefined;
}

export default function Sprite({
  ref,
  disabled,
  exits,
  water,
  onExit,
  exitDuration,
  getScroller,
}: SpriteProps) {
  const { rootRef, bodyRef, shadowRef, pose, ready, launch, recentre } = useSpriteMovement(BOX, {
    disabled,
    exits,
    water,
    onExit,
    exitDuration,
    getScroller,
  });

  useImperativeHandle(ref, () => ({ launch, recentre }));

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
          left: ((SPRITE_COLS - SHADOW_COLS) / 2) * PIXEL_SCALE,
          top: (SPRITE_ROWS - SHADOW_ROWS + 1) * PIXEL_SCALE,
        }}
      >
        <PixelArt frame={SPRITE_SHADOW} palette={SPRITE_PALETTE} />
      </div>
      <div ref={bodyRef} className="relative origin-bottom will-change-transform">
        <div style={mirror ? { transform: "scaleX(-1)" } : undefined}>
          <PixelArt frame={frame} palette={SPRITE_PALETTE} />
        </div>
      </div>
    </div>
  );
}
