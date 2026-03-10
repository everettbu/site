"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RoomId, rooms } from "@/lib/grid";

interface MapOverlayProps {
  isOpen: boolean;
  currentRoom: RoomId;
  onClose: () => void;
  onNavigate: (roomId: RoomId) => void;
}

// Single GAP drives everything. Home edges = 2*GAP (span intermediate rooms).
// All leaf edges = GAP. Nodes are square so visible edges are equal both axes.
const GAP = 17;
const CX = 50;
const CY = 40;

const ROOM_POSITIONS: Record<string, { x: number; y: number }> = {
  home:           { x: CX,               y: CY },
  about:          { x: CX,               y: CY - 2 * GAP },
  library:        { x: CX - 2 * GAP,     y: CY },
  media:          { x: CX,               y: CY + 2 * GAP },
  projects:       { x: CX + 2 * GAP,     y: CY },
  guestbook:      { x: CX - GAP,         y: CY - 2 * GAP },
  "album-shelf":  { x: CX - 2 * GAP,     y: CY - GAP },
  "book-shelf":   { x: CX - 3 * GAP,     y: CY },
  "world-map":    { x: CX - 2 * GAP,     y: CY + GAP },
  montages:       { x: CX + GAP,         y: CY + 2 * GAP },
  collections:    { x: CX - 2 * GAP,     y: CY + 2 * GAP },
  "photo-reel":   { x: CX,               y: CY + 3 * GAP },
};

function getEdges(): [string, string][] {
  const seen = new Set<string>();
  const edges: [string, string][] = [];

  for (const [roomId, config] of Object.entries(rooms)) {
    for (const neighborId of Object.values(config.neighbors)) {
      if (!neighborId) continue;
      const key = [roomId, neighborId].sort().join("|");
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([roomId, neighborId]);
      }
    }
  }

  return edges;
}

export default function MapOverlay({
  isOpen,
  currentRoom,
  onClose,
  onNavigate,
}: MapOverlayProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleEscape]);

  const edges = getEdges();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="map-overlay"
          className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-700 transition-colors text-sm tracking-widest uppercase font-light z-10"
            onClick={onClose}
          >
            Close
          </button>

          {/* Square container — equal % = equal pixels in both axes */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative aspect-square h-full max-w-full">
              {/* Edges — center-to-center, masked by opaque node backgrounds */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {edges.map(([a, b]) => {
                  const posA = ROOM_POSITIONS[a];
                  const posB = ROOM_POSITIONS[b];
                  if (!posA || !posB) return null;

                  return (
                    <line
                      key={`${a}-${b}`}
                      x1={`${posA.x}%`}
                      y1={`${posA.y}%`}
                      x2={`${posB.x}%`}
                      y2={`${posB.y}%`}
                      stroke="currentColor"
                      className="text-neutral-300"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </svg>

              {/* Room nodes — rounded rectangles with opaque backgrounds */}
              {Object.entries(ROOM_POSITIONS).map(([roomId, pos]) => {
                const room = rooms[roomId];
                if (!room) return null;
                const isCurrent = roomId === currentRoom;

                return (
                  <button
                    key={roomId}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-20 h-20 rounded-lg border transition-colors cursor-pointer ${
                      isCurrent
                        ? "bg-neutral-900 border-neutral-900 text-white"
                        : "bg-white border-neutral-300 text-neutral-400 hover:border-neutral-500 hover:text-neutral-600"
                    }`}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(roomId);
                    }}
                  >
                    <span className="text-[10px] tracking-widest uppercase font-light">
                      {room.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
