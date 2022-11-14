export type GetHistoryBySearchType = 'date' | 'community';

export interface MakeReservationBody {
  startDate: Date;
  endDate: Date;
  communityClubId: number;
  seatNumber?: number;
}

export interface DeleteReservationQuery {
  id: string;
}

export interface UpdateReservationBody {
  startDate: Date;
  endDate: Date;
  seatNumber?: number;
}

export interface UpdateReservationQuery {
  id: string;
}
