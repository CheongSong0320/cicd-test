import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Reservation, ReservationStatus, UserType, CommunityClub } from '@prisma/client';

export class ReservationDto implements Reservation {
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

    @ApiPropertyOptional()
    isMemberShip: boolean | null;

    @ApiProperty({ enum: ReservationStatus })
    status: ReservationStatus;

    @ApiProperty()
    communityClubId: number;

    @ApiProperty()
    userId: string;

    @ApiPropertyOptional()
    membershipId: number | null;

    @ApiProperty()
    userName: string;

    @ApiProperty({ enum: UserType })
    userType: UserType;

    @ApiProperty()
    userPhone: string;

    @ApiPropertyOptional()
    seatNumber: number | null;

    @ApiProperty()
    communityName: string;

    static from(reservation: Reservation & { CommunityClub: CommunityClub }) {
        return new ReservationDto(reservation);
    }

    constructor(reservation: Reservation & { CommunityClub: CommunityClub }) {
        this.id = reservation.id;
        this.createdAt = reservation.createdAt;
        this.startDate = reservation.startDate;
        this.endDate = reservation.endDate;
        this.dong = reservation.dong;
        this.ho = reservation.ho;
        this.isMemberShip = reservation.isMemberShip;
        this.status = reservation.status;
        this.communityClubId = reservation.communityClubId;
        this.userId = reservation.userId;
        this.membershipId = reservation.membershipId;
        this.userName = reservation.userName;
        this.userType = reservation.userType;
        this.userPhone = reservation.userPhone;
        this.seatNumber = reservation.seatNumber;
        this.communityName = reservation.CommunityClub.name;
    }
}
