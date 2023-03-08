import { ApiProperty } from '@nestjs/swagger';

export class PatchReservationBody {
    @ApiProperty({ enum: ['ACCEPTED', 'REJECTED'] })
    status: 'ACCEPTED' | 'REJECTED';
}
