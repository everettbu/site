"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { motion } from "motion/react";
import { useGridNavigation, TRANSITION_EASE } from "@/lib/useGridNavigation";
import { Direction, RoomId, DEFAULT_ROOM, rooms } from "@/lib/grid";
import { BRIDGES } from "@/lib/bridges";
import Minimap from "./Minimap";
import MapOverlay from "./MapOverlay";
import NavigationHint from "./NavigationHint";
import HomeButton from "./HomeButton";
import Sprite, { SpriteHandle } from "./Sprite";
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

const BRIDGE_POSITION: Record<Direction, string> = {
  up: "top-0 left-1/2 -translate-x-1/2",
  down: "bottom-0 left-1/2 -translate-x-1/2",
  left: "left-0 top-1/2 -translate-y-1/2",
  right: "right-0 top-1/2 -translate-y-1/2",
};

function Bridge({ edge }: { edge: Direction }) {
  const { src, width, height } = BRIDGES[edge];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={`absolute ${BRIDGE_POSITION[edge]} pointer-events-none`}
      style={{ imageRendering: "pixelated", width, height }}
    />
  );
}

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
      {(roomId === "home" || roomId === "about") && <Bridge edge="down" />}
      {(roomId === "home" || roomId === "media") && <Bridge edge="up" />}
      {(roomId === "home" || roomId === "library") && <Bridge edge="right" />}
      {(roomId === "home" || roomId === "projects") && <Bridge edge="left" />}
    </div>
  );
}

export default function GridWorld() {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const spriteRef = useRef<SpriteHandle>(null);
  const launchSprite = useCallback((d: Direction) => spriteRef.current?.launch(d), []);

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
  } = useGridNavigation({ disabled: isMapOpen, onSwipe: launchSprite });

  const handleMapNavigate = useCallback(
    (roomId: RoomId) => {
      setIsMapOpen(false);
      moveTo(roomId);
    },
    [moveTo]
  );

  const isHome = currentRoom === DEFAULT_ROOM;
  const exits = useMemo(
    () => Object.keys(rooms[currentRoom].neighbors) as Direction[],
    [currentRoom]
  );

  const transitionConfig = {
    duration,
    ease: TRANSITION_EASE,
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

      <Sprite
        ref={spriteRef}
        disabled={isMapOpen}
        exits={exits}
        onExit={move}
        exitDuration={duration}
      />

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
