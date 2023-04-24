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
}

class InnerValueDto {
    /**
     * 커뮤니티 이름
     */
    communityName: string;

    /**
     * 예약 정보
     */
    @ApiProperty({ type: [InnerReservation] })
    reservation: InnerReservation[];
}

export class FindReservationByCommunityResponse {
    /**
     * 예약 정보
     */
    @ApiProperty({ type: [InnerValueDto] })
    reservation: InnerValueDto[];
}
