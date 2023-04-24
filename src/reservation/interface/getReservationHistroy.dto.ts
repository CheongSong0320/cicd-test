import { ApiProperty } from '@nestjs/swagger';

class InnerReservation {
    /**
     * id
     */
    id: number;

    /**
     * startDate
     */
    startDate: Date;

    /**
     * endDate
     */
    endDate: Date;

    /**
     * seatNumber
     */
    seatNumber: number | null;

    /**
     * 커뮤니티 이름
     */
    communityName: string | undefined;
}

class GetHistory {
    /**
     * date
     */
    date: Date | undefined;

    /**
     * communityClubId
     */
    communityClubId: string | undefined;

    /**
     * communityName
     */
    communityName: string | undefined;

    /**
     * 예약 정보
     */
    @ApiProperty({ type: [InnerReservation] })
    reservation: InnerReservation[];
}

export class GetReservationHistoryResponse {
    @ApiProperty({ type: [GetHistory] })
    reservation: GetHistory[];
}

// reservation: {
//   date: string | undefined;
//   communityClubId: string | undefined;
//   communityName: string | undefined;
//   reservation: {
//       id: number;
//       startDate: Date;
//       endDate: Date;
//       seatNumber: number | null;
//       communityName: string | undefined;
//   }[];
// }[];
// }
