export type GetHistoryBySearchType = 'date' | 'community';

export interface MakeReservationBody {
  startDate: Date;
  endDate: Date;
  communityClubId: number;
  seatNumber?: number;
}
