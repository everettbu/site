"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { useGridNavigation } from "@/lib/useGridNavigation";
import { Direction, RoomId, DEFAULT_ROOM, rooms } from "@/lib/grid";
import Minimap from "./Minimap";
import MapOverlay from "./MapOverlay";
import NavigationHint from "./NavigationHint";
import HomeButton from "./HomeButton";
import HomeTile from "./tiles/HomeTile";
import AboutTile from "./tiles/AboutTile";
import LibraryTile from "./tiles/LibraryTile";
import MediaTile from "./tiles/MediaTile";
import ProjectsTile from "./tiles/ProjectsTile";
import GuestbookTile from "./tiles/GuestbookTile";
import AlbumShelfTile from "./tiles/AlbumShelfTile";
import BookShelfTile from "./tiles/BookShelfTile";
import WorldMapTile from "./tiles/WorldMapTile";
import MontagesTile from "./tiles/MontagesTile";
import CollectionsTile from "./tiles/CollectionsTile";
import PhotoReelTile from "./tiles/PhotoReelTile";

const tileComponents: Record<
  string,
  React.ComponentType<{ onMove: (d: Direction) => void }>
> = {
  home: HomeTile,
  about: AboutTile,
  library: LibraryTile,
  media: MediaTile,
  projects: ProjectsTile,
  guestbook: GuestbookTile,
  "album-shelf": AlbumShelfTile,
  "book-shelf": BookShelfTile,
  "world-map": WorldMapTile,
  montages: MontagesTile,
  collections: CollectionsTile,
  "photo-reel": PhotoReelTile,
};

const SLIDE_OFFSETS: Record<Direction, { x: string; y: string }> = {
  up: { x: "0%", y: "-100%" },
  down: { x: "0%", y: "100%" },
  left: { x: "-100%", y: "0%" },
  right: { x: "100%", y: "0%" },
};

const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

function RoomView({
  roomId,
  onMove,
}: {
  roomId: RoomId;
  onMove: (d: Direction) => void;
}) {
  const Component = tileComponents[roomId];
  if (!Component) return null;
  return (
    <div className="relative w-[100vw] h-[100dvh]">
      <Component onMove={onMove} />
      {/* eslint-disable @next/next/no-img-element */}
      {(roomId === "home" || roomId === "about") && (
        <img src="/bridges/bridge-south.png" alt="" className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ imageRendering: "pixelated", width: 82, height: 57 }} />
      )}
      {(roomId === "home" || roomId === "media") && (
        <img src="/bridges/bridge-north.png" alt="" className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ imageRendering: "pixelated", width: 82, height: 57 }} />
      )}
      {(roomId === "home" || roomId === "library") && (
        <img src="/bridges/bridge-east.png" alt="" className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{ imageRendering: "pixelated", width: 59, height: 82 }} />
      )}
      {(roomId === "home" || roomId === "projects") && (
        <img src="/bridges/bridge-west.png" alt="" className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{ imageRendering: "pixelated", width: 57, height: 82 }} />
      )}
    </div>
  );
}

export default function GridWorld() {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const {
    currentRoom,
    previousRoom,
    transitionDirection,
    isAnimating,
    hasMoved,
    initialLoad,
    duration,
    move,
    moveTo,
    moveToHome,
    onAnimationComplete,
  } = useGridNavigation({ disabled: isMapOpen });

  const handleMapNavigate = useCallback(
    (roomId: RoomId) => {
      setIsMapOpen(false);
      moveTo(roomId);
    },
    [moveTo]
  );

  const isHome = currentRoom === DEFAULT_ROOM;

  const transitionConfig = {
    duration,
    ease: [0.25, 0.1, 0.25, 1.0] as const,
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Outgoing room (only during transition) */}
      {isAnimating && previousRoom && (
        <motion.div
          key={`out-${previousRoom}`}
          className="absolute inset-0"
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={
            transitionDirection
              ? { ...SLIDE_OFFSETS[OPPOSITE[transitionDirection]], opacity: 1 }
              : { opacity: 0 }
          }
          transition={transitionConfig}
        >
          <RoomView roomId={previousRoom} onMove={move} />
        </motion.div>
      )}

      {/* Current room */}
      <motion.div
        key={`in-${currentRoom}`}
        className="absolute inset-0"
        initial={
          initialLoad
            ? false
            : transitionDirection
              ? { ...SLIDE_OFFSETS[transitionDirection], opacity: 1 }
              : { opacity: 0 }
        }
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={initialLoad ? { duration: 0 } : transitionConfig}
        onAnimationComplete={onAnimationComplete}
      >
        <RoomView roomId={currentRoom} onMove={move} />
      </motion.div>

      <Minimap currentRoom={currentRoom} onToggle={() => setIsMapOpen((v) => !v)} />
      <MapOverlay
        isOpen={isMapOpen}
        currentRoom={currentRoom}
        onClose={() => setIsMapOpen(false)}
        onNavigate={handleMapNavigate}
      />
      <NavigationHint visible={!hasMoved} />
      <HomeButton visible={!isHome && hasMoved} onPress={moveToHome} />
    </div>
  );
}
