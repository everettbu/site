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

const ROOM_POSITIONS: Record<string, { x: number; y: number }> = {
  home:           { x: 50, y: 42 },
  about:          { x: 50, y: 18 },
  library:        { x: 30, y: 42 },
  media:          { x: 50, y: 58 },
  projects:       { x: 70, y: 42 },
  guestbook:      { x: 30, y: 18 },
  "album-shelf":  { x: 30, y: 30 },
  "book-shelf":   { x: 12, y: 42 },
  "world-map":    { x: 30, y: 50 },
  montages:       { x: 70, y: 58 },
  collections:    { x: 30, y: 58 },
  "photo-reel":   { x: 50, y: 72 },
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
            className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-700 transition-colors text-sm tracking-widest uppercase font-light"
            onClick={onClose}
          >
            Close
          </button>

          {/* SVG edges */}
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
                  strokeWidth="1"
                />
              );
            })}
          </svg>

          {/* Room nodes */}
          {Object.entries(ROOM_POSITIONS).map(([roomId, pos]) => {
            const room = rooms[roomId];
            if (!room) return null;
            const isCurrent = roomId === currentRoom;

            return (
              <button
                key={roomId}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(roomId);
                }}
              >
                <span
                  className={`w-3 h-3 rounded-full transition-colors ${
                    isCurrent
                      ? "bg-neutral-900"
                      : "bg-neutral-300 group-hover:bg-neutral-600"
                  }`}
                />
                <span
                  className={`text-[10px] tracking-widest uppercase whitespace-nowrap ${
                    isCurrent
                      ? "font-medium text-neutral-900"
                      : "font-light text-neutral-400"
                  }`}
                >
                  {room.label}
                </span>
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
