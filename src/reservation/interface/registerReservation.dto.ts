import { ApiProperty } from '@nestjs/swagger';

export class RegisterReservationResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    startDate: Date;

    @ApiProperty()
    endDate: Date;

    @ApiProperty()
    dong: string;

    @ApiProperty()
    ho: string;

    @ApiProperty()
    isMemberShip: boolean | null;

    @ApiProperty({ enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'] })
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

    @ApiProperty()
    communityClubId: number;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    membershipId: number | null;

    @ApiProperty()
    userName: string;

    @ApiProperty({ enum: ['HOUSEHOLDER', 'MEMBER', 'ETC'] })
    userType: 'HOUSEHOLDER' | 'MEMBER' | 'ETC';

    @ApiProperty()
    userPhone: string;

    @ApiProperty()
    seatNumber: number | null;
}
