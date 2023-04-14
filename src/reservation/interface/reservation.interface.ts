import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export type GetHistoryBySearchType = 'date' | 'community';

export class GetReservationHistoryQuery {
    @ApiPropertyOptional()
    dateFrom?: string;

    @ApiPropertyOptional()
    dateTo?: string;

    @ApiPropertyOptional()
    communityClubId?: string;
}

export class RegisterReservationBody {
    startDate: Date;

    @Type(() => Number)
    slotCount?: number;

    @Type(() => Number)
    seatId?: number;
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
    date: Date;
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
    dateFrom: Date;
    dateTo: Date;
}
