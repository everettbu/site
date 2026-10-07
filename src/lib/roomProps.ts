import { Rect } from "./bridges";
import { RoomId } from "./grid";
import { Seat } from "./seat";
import { nookFits, nookSolids, seatZone, standingSpot } from "./readingNook";

/** Furniture in a room the sprite interacts with, in screen px for a vw × vh viewport. */
export interface RoomProps {
  solids: (vw: number, vh: number) => Rect[];
  seat?: (vw: number, vh: number) => Seat | undefined; // undefined: no chair at this size
}

export const ROOM_PROPS: Partial<Record<RoomId, RoomProps>> = {
  library: {
    solids: nookSolids,
    seat: (vw) => (nookFits(vw) ? { zone: seatZone(vw), spot: standingSpot(vw) } : undefined),
  },
};
