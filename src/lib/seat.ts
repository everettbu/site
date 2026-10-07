"use client";

import { createContext } from "react";
import { Rect } from "./bridges";

export type SeatState = "empty" | "sitting" | "reading";

/** A chair: stand with your feet in `zone` and press Space. Getting up puts the feet at `spot` (top-centre of the feet). */
export interface Seat {
  zone: Rect;
  spot: { x: number; y: number };
}

/** Space: sits down when standing at the chair, then opens the paper, then folds it again. */
export function pressSpace(state: SeatState, atChair: boolean): SeatState {
  if (state === "empty") return atChair ? "sitting" : "empty";
  return state === "sitting" ? "reading" : "sitting";
}

/** Whether the sprite is in the current room's chair — the chair art draws him while he is. */
export const SeatContext = createContext<SeatState>("empty");
