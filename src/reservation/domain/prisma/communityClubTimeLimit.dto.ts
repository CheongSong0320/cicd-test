import { ApiProperty } from '@nestjs/swagger';
import { CommunityClubTimeLimit, CommunityClubTimeInterval } from '@prisma/client';

export class CommunityClubTimeLimitDto implements CommunityClubTimeLimit {
    static from(value: CommunityClubTimeLimit) {
        return new CommunityClubTimeLimitDto(value);
    }

    constructor({ id, maxCount, reservationTimeInterval, openTime, closedTime, maxTimeInterval }: CommunityClubTimeLimit) {
        this.id = id;
        this.maxCount = maxCount;
        this.reservationTimeInterval = reservationTimeInterval;
        this.openTime = openTime;
        this.closedTime = closedTime;
        this.maxTimeInterval = maxTimeInterval;
    }

    id: number;

    @ApiProperty({ description: '최대 인원/좌석 수' })
    maxCount: number;

    @ApiProperty({ description: '예약 단위 (15/30/60)' })
    reservationTimeInterval: number;

    @ApiProperty({ description: '운영 시작시간' })
    openTime: number;

    @ApiProperty({ description: '운영 종료시간' })
    closedTime: number;

    @ApiProperty({ description: '최대 예약시간' })
    maxTimeInterval: number;

    @ApiProperty({ description: '커뮤니티 클럽 id' })
    communityClubId: number;
}
