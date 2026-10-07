"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "motion/react";
import {
  RoomId,
  Direction,
  DEFAULT_ROOM,
  rooms,
  hashToRoom,
  getNextRoom,
} from "./grid";

const WHEEL_THRESHOLD = 50;
const WHEEL_TIMEOUT = 200;
const SWIPE_THRESHOLD = 50;
const ANIMATION_DURATION = 0.4;
export const TRANSITION_EASE = [0.25, 0.1, 0.25, 1.0] as const;

export function useGridNavigation(options?: {
  disabled?: boolean;
  /** Handles swipes / scrolls instead of moving rooms directly (the sprite launches) */
  onSwipe?: (direction: Direction) => void;
}) {
  const disabled = options?.disabled ?? false;
  const onSwipe = options?.onSwipe;
  const reducedMotion = useReducedMotion();
  const [currentRoom, setCurrentRoom] = useState<RoomId>(DEFAULT_ROOM);
  const [previousRoom, setPreviousRoom] = useState<RoomId | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<Direction | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const isAnimatingRef = useRef(false);
  const wheelLockedUntil = useRef(0);
  const wheelAccX = useRef(0);
  const wheelAccY = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const duration = reducedMotion ? 0 : ANIMATION_DURATION;

  /** Returns true if a transition started. */
  const move = useCallback(
    (direction: Direction): boolean => {
      if (isAnimatingRef.current) return false;

      const next = getNextRoom(currentRoom, direction);
      if (!next) return false;

      if (!hasMoved) setHasMoved(true);

      isAnimatingRef.current = true;
      setIsAnimating(true);
      setPreviousRoom(currentRoom);
      setTransitionDirection(direction);
      setCurrentRoom(next);

      const hash = rooms[next].hash;
      window.history.replaceState(null, "", hash || window.location.pathname);
      return true;
    },
    [currentRoom, hasMoved]
  );

  const moveToHome = useCallback(() => {
    if (isAnimatingRef.current) return;
    if (currentRoom === DEFAULT_ROOM) return;

    if (!hasMoved) setHasMoved(true);

    isAnimatingRef.current = true;
    setIsAnimating(true);
    setPreviousRoom(currentRoom);
    setTransitionDirection(null); // null signals crossfade
    setCurrentRoom(DEFAULT_ROOM);
    window.history.replaceState(null, "", window.location.pathname);
  }, [currentRoom, hasMoved]);

  const moveTo = useCallback(
    (targetRoom: RoomId) => {
      if (currentRoom === targetRoom) return;
      if (!rooms[targetRoom]) return;

      if (!hasMoved) setHasMoved(true);

      // Instant jump — no animation
      setCurrentRoom(targetRoom);
      setInitialLoad(true);
      requestAnimationFrame(() => setInitialLoad(false));

      const hash = rooms[targetRoom].hash;
      window.history.replaceState(null, "", hash || window.location.pathname);
    },
    [currentRoom, hasMoved]
  );

  const onAnimationComplete = useCallback(() => {
    isAnimatingRef.current = false;
    setIsAnimating(false);
    setPreviousRoom(null);
    setTransitionDirection(null);
    wheelAccX.current = 0;
    wheelAccY.current = 0;
    wheelLockedUntil.current = Date.now() + 400;
  }, []);

  // Read hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    const room = hashToRoom[hash];
    if (room) {
      setCurrentRoom(room);
    }
    requestAnimationFrame(() => {
      setInitialLoad(false);
    });
  }, []);

  // Wheel / trackpad handler
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (disabled) return;
      if (isAnimatingRef.current || Date.now() < wheelLockedUntil.current) {
        wheelAccX.current = 0;
        wheelAccY.current = 0;
        return;
      }

      wheelAccX.current += e.deltaX;
      wheelAccY.current += e.deltaY;

      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => {
        wheelAccX.current = 0;
        wheelAccY.current = 0;
      }, WHEEL_TIMEOUT);

      const absX = Math.abs(wheelAccX.current);
      const absY = Math.abs(wheelAccY.current);

      if (absX > WHEEL_THRESHOLD || absY > WHEEL_THRESHOLD) {
        let direction: Direction;
        if (absX > absY) {
          direction = wheelAccX.current > 0 ? "right" : "left";
        } else {
          direction = wheelAccY.current > 0 ? "down" : "up";
        }
        wheelAccX.current = 0;
        wheelAccY.current = 0;
        (onSwipe ?? move)(direction);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [move, onSwipe, disabled]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // Arrow keys / WASD belong to the sprite (useSpriteMovement)
      if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        moveToHome();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveToHome, disabled]);

  // Touch handler
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (disabled) return;
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current || isAnimatingRef.current) return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;
      touchStart.current = null;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) return;

      let direction: Direction;
      if (absX > absY) {
        direction = dx < 0 ? "right" : "left";
      } else {
        direction = dy < 0 ? "down" : "up";
      }

      (onSwipe ?? move)(direction);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [move, onSwipe, disabled]);

  return {
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
  };
}
