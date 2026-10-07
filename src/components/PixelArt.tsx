import { memo } from "react";
import { Frame, Palette, PIXEL_SCALE, framePaths } from "@/lib/pixelArt";

const PixelArt = memo(function PixelArt({
  frame,
  palette,
  className,
}: {
  frame: Frame;
  palette: Palette;
  className?: string;
}) {
  const cols = frame[0].length;
  const rows = frame.length;
  return (
    <svg
      width={cols * PIXEL_SCALE}
      height={rows * PIXEL_SCALE}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      className={`block ${className ?? ""}`}
      aria-hidden
    >
      {framePaths(frame, palette).map(({ key, d, fill }) => (
        <path key={key} d={d} fill={fill} />
      ))}
    </svg>
  );
});

export default PixelArt;
