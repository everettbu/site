import { Direction, RoomId, rooms } from "@/lib/grid";
import { BRIDGE_GAP, BRIDGE_SPAN } from "@/lib/bridges";
import Water from "./Water";

// Placed just past the room's edge, filling the gap to the neighbour
const PLACEMENT: Record<Direction, React.CSSProperties> = {
  right: { left: "100%", top: 0, width: BRIDGE_GAP, height: "100%" },
  left: { right: "100%", top: 0, width: BRIDGE_GAP, height: "100%" },
  down: { top: "100%", left: 0, width: "100%", height: BRIDGE_GAP },
  up: { bottom: "100%", left: 0, width: "100%", height: BRIDGE_GAP },
};

const TOWARDS: Record<Direction, string> = { right: "to right", left: "to left", down: "to bottom", up: "to top" };

/**
 * The open water between a room and its neighbour across a long bridge, with
 * the bridge's middle span. The rooms' tints blend across it, so each end
 * matches the room it meets.
 */
export default function BridgeGap({ direction, from, to }: { direction: Direction; from: RoomId; to: RoomId }) {
  const vertical = direction === "up" || direction === "down";
  const span = vertical ? BRIDGE_SPAN.vertical : BRIDGE_SPAN.horizontal;
  const tint = (room: RoomId) => rooms[room].tint ?? "transparent";
  return (
    <div className="absolute pointer-events-none" style={PLACEMENT[direction]} aria-hidden>
      <Water />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${TOWARDS[direction]}, ${tint(from)}, ${tint(to)})`,
          backgroundRepeat: "no-repeat", // a repeating gradient bleeds its far end into the edge — a pale seam
        }}
      />
      <div
        className={`absolute ${vertical ? "inset-y-0 left-1/2 -translate-x-1/2" : "inset-x-0 top-1/2 -translate-y-1/2"}`}
        style={{
          width: vertical ? span.width : undefined,
          height: vertical ? undefined : span.height,
          backgroundImage: `url(${span.src})`,
          backgroundSize: `${span.width}px ${span.height}px`,
          backgroundRepeat: vertical ? "repeat-y" : "repeat-x",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
