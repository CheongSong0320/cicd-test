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

  @ApiPropertyOptional({ type: 'string' })
  communityName: string | undefined;
}

class GetHistory {
  @ApiProperty({ type: 'string' })
  date: string | undefined;

  @ApiPropertyOptional({ type: 'string' })
  communityClubId: string | undefined;

  @ApiPropertyOptional({ type: 'string' })
  communityName: string | undefined;

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
