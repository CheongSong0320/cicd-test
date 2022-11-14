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

export interface GetAvailableDateParam {
  id: string;
}

export interface GetUnavailableDateQuery {
  year: string;
  month: string;
}

export interface GetUnavailableDateByTimePriorityQuery {
  year: string;
  month: string;
  day: string;
  startTime: string;
  endTime: string;
}
