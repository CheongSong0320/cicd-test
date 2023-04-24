import { ApiProperty } from '@nestjs/swagger';

enum StatusType {
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
}

export class PatchReservationBody {
    /**
     * status
     */
    @ApiProperty({ enum: StatusType })
    status: StatusType;
}
