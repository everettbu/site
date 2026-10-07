"use client";

import { useState, useCallback, useMemo, useRef, useLayoutEffect } from "react";
import { motion } from "motion/react";
import { useGridNavigation, TRANSITION_EASE } from "@/lib/useGridNavigation";
import { Direction, RoomId, DEFAULT_ROOM, rooms } from "@/lib/grid";
import { BRIDGES, BRIDGE_GAP, crossingGap } from "@/lib/bridges";
import { RoomScrollContext } from "@/lib/roomScroll";
import Minimap from "./Minimap";
import MapOverlay from "./MapOverlay";
import NavigationHint from "./NavigationHint";
import HomeButton from "./HomeButton";
import Sprite, { SpriteHandle } from "./Sprite";
import Water from "./Water";
import BridgeGap from "./BridgeGap";
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

// Where the room across a long bridge sits, relative to this one
const ACROSS: Record<Direction, string> = {
  right: `calc(100% + ${BRIDGE_GAP}px) 0`,
  left: `calc(-100% - ${BRIDGE_GAP}px) 0`,
  down: `0 calc(100% + ${BRIDGE_GAP}px)`,
  up: `0 calc(-100% - ${BRIDGE_GAP}px)`,
};

function RoomView({
  roomId,
  onMove,
  scrollers,
}: {
  roomId: RoomId;
  onMove: (d: Direction) => void;
  scrollers: Map<RoomId, HTMLElement>;
}) {
  const registerScroller = useCallback(
    (el: HTMLElement | null) => {
      if (el) scrollers.set(roomId, el);
      else scrollers.delete(roomId);
    },
    [roomId, scrollers]
  );

  const Component = tileComponents[roomId];
  if (!Component) return null;
  return (
    <div className="relative w-[100vw] h-[100dvh]">
      {rooms[roomId].water && <Water edges={rooms[roomId].water} />}
      {rooms[roomId].tint && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: rooms[roomId].tint }} />
      )}
      <RoomScrollContext value={registerScroller}>
        <Component onMove={onMove} />
      </RoomScrollContext>
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
  const scrollers = useRef(new Map<RoomId, HTMLElement>()).current; // tall rooms' scroll containers
  const launchSprite = useCallback((d: Direction) => spriteRef.current?.launch(d), []);
  const recentreSprite = useCallback(() => spriteRef.current?.recentre(), []);

  // Walking a long bridge: the next room is laid out beyond the gap and the world pans with him
  const [crossing, setCrossing] = useState<{ direction: Direction; to: RoomId } | null>(null);
  const crossingRef = useRef(crossing);
  crossingRef.current = crossing;
  const cameraRef = useRef<HTMLDivElement>(null);

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
  } = useGridNavigation({
    disabled: isMapOpen || !!crossing,
    onSwipe: launchSprite,
    onHome: recentreSprite,
  });

  const handleMapNavigate = useCallback(
    (roomId: RoomId) => {
      setIsMapOpen(false);
      moveTo(roomId);
    },
    [moveTo]
  );

  const isHome = currentRoom === DEFAULT_ROOM;

  // Room labels do nothing mid-bridge
  const moveFromTile = useCallback((d: Direction) => !crossingRef.current && move(d), [move]);

  const bridge = {
    gap: (d: Direction) => crossingGap(currentRoom, d),
    start: (d: Direction) => setCrossing({ direction: d, to: rooms[currentRoom].neighbors[d]! }),
    camera: (offset: number) => {
      const el = cameraRef.current;
      const d = crossingRef.current?.direction;
      if (!el || !d) return;
      const vertical = d === "up" || d === "down";
      el.style.transform = vertical ? `translate3d(0, ${-offset}px, 0)` : `translate3d(${-offset}px, 0, 0)`;
    },
    end: (arrived: boolean) => {
      const to = crossingRef.current?.to;
      if (arrived && to) moveTo(to);
      setCrossing(null);
    },
  };

  // Off the bridge: put the world back in the same frame the rooms swap, so nothing jumps
  useLayoutEffect(() => {
    if (!crossing && cameraRef.current) cameraRef.current.style.transform = "";
  }, [crossing]);
  const getScroller = useCallback(() => scrollers.get(currentRoom), [scrollers, currentRoom]);
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
      <div ref={cameraRef} className="absolute inset-0 will-change-transform">
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
            <RoomView roomId={previousRoom} onMove={moveFromTile} scrollers={scrollers} />
          </motion.div>
        )}

        {/* Across a long bridge: the gap, and the room beyond — becomes the current room on arrival */}
        {crossing && <BridgeGap direction={crossing.direction} from={currentRoom} to={crossing.to} />}
        {crossing && (
          <motion.div
            key={`in-${crossing.to}`}
            className="absolute inset-0"
            style={{ translate: ACROSS[crossing.direction] }}
            initial={false}
            animate={{ x: 0, y: 0, opacity: 1 }}
          >
            <RoomView roomId={crossing.to} onMove={moveFromTile} scrollers={scrollers} />
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
          <RoomView roomId={currentRoom} onMove={moveFromTile} scrollers={scrollers} />
        </motion.div>
      </div>

      <Sprite
        ref={spriteRef}
        disabled={isMapOpen}
        exits={exits}
        water={rooms[currentRoom].water}
        onExit={move}
        getScroller={getScroller}
        exitDuration={duration}
        bridge={bridge}
      />

      <Minimap currentRoom={currentRoom} onToggle={() => !crossingRef.current && setIsMapOpen((v) => !v)} />
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
