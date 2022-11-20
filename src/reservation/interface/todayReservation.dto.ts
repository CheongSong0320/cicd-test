import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TodayReservationRespone {
  @ApiProperty()
  id: number;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;
  @ApiPropertyOptional({ type: 'number' })
  seatNumber: number | null;
}
