import { Rect } from "./bridges";
import { RoomId } from "./grid";
import { Seat } from "./seat";
import { nookSolids, seatZone, standingSpot } from "./readingNook";

/** Furniture in a room the sprite interacts with, in screen px for a vw × vh viewport. */
export interface RoomProps {
  solids: (vw: number, vh: number) => Rect[];
  seat?: (vw: number, vh: number) => Seat;
}

export const ROOM_PROPS: Partial<Record<RoomId, RoomProps>> = {
  library: {
    solids: nookSolids,
    seat: (vw) => ({ zone: seatZone(vw), spot: standingSpot(vw) }),
  },
};
