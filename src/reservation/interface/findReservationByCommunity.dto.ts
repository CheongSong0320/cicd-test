import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class InnerReservation {
    @ApiProperty()
    id: number;
    @ApiProperty()
    startDate: Date;
    @ApiProperty()
    endDate: Date;
    @ApiPropertyOptional({ type: 'number' })
    seatNumber: number | null;
}

class InnerValueDto {
    @ApiProperty()
    communityName: string;

    @ApiProperty({ type: [InnerReservation] })
    reservation: InnerReservation[];
}

export class FindReservationByCommunityResponse {
    @ApiProperty({ type: [InnerValueDto] })
    reservation: InnerValueDto[];
}
