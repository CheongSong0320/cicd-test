import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus, UserType } from '@prisma/client';

export class RegisterReservationResponse {
    /**
     * id
     */
    id: number;

    /**
     * 예약 생성 일시
     */
    createdAt: Date;

    /**
     * 예약 시작 일시
     */
    startDate: Date;

    /**
     * 예약 종료 일시
     */
    endDate: Date;

    /**
     * 동
     */
    dong: string;

    /**
     * 호
     */
    ho: string;

    /**
     * 멤버십 가입 여부
     */
    isMemberShip: boolean | null;

    /**
     * status
     */
    @ApiProperty({ enum: ReservationStatus })
    status: ReservationStatus;

    /**
     * 커뮤니티 클럽 Id
     */
    communityClubId: number;

    /**
     * 예약자 Id
     */
    userId: string;

    /**
     * 멤버십 Id
     */
    membershipId: number | null;

    /**
     * 예약자 이름
     */
    userName: string;

    /**
     * 사용자 유형
     */
    @ApiProperty({ enum: UserType })
    userType: UserType;

    /**
     * 예약자 연락처
     */
    userPhone: string;

    /**
     * seatNumber
     */
    seatNumber: number | null;
}
