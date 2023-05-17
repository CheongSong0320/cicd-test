import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';

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

    /**
     * 반려 이유
     * status가 반려 시, 필수값입니다.
     */
    @ValidateIf(o => o.status === StatusType.REJECTED)
    @IsString()
    rejectReason?: string;
}
