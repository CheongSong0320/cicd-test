import { ApiProperty } from '@nestjs/swagger';

export type GetHistoryBySearchType = 'date' | 'community';

export class GetReservationHistoryQuery {
    @ApiProperty({ enum: ['date', 'community'] })
    searchType: 'date' | 'community';
    date?: Date;
    communityClubId?: string;
}

export class RegisterReservationBody {
    startDate: Date;
    slotCount?: string;
    seatId?: string;
}

export class MakeReservationBody {
    startDate: Date;
    endDate: Date;
    communityClubId: number;
    seatNumber?: number;
}

export class DeleteReservationQuery {
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

export class GetAvailableDateParam {
    id: string;
}

export class GetTimeTableParam {
    id: string;
}

export class GetTimeTableQuery {
    year: string;
    month: string;
    day: string;
}

export type TimeType = 'SLOT' | 'ALLDAY';
export type SeatType = 'SEAT' | 'NUM_PERSON';

export class GetAvailableDateQuery {
    month: number;
    seat?: number;
}

export class GetAvailableSlotQuery {
    date: string;
    seat?: number;
}

export class GetAvailableSeatQuery {
    startDate?: string;
    slotCount?: string;
}

export class GetReservationQuery {
    startDate: Date;
    endDate: Date;
}
