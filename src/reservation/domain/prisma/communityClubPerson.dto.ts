import { ApiProperty } from '@nestjs/swagger';
import { CommunityClubPerson, CommunityClubTimeInterval } from '@prisma/client';

export class CommunityClubPersonDto implements CommunityClubPerson {
    static from(value: CommunityClubPerson) {
        return new CommunityClubPersonDto(value);
    }

    constructor({ id, maxCount, reservationOpenDate, reservationTimeInterval, communityClubId }) {
        this.id = id;
        this.maxCount = maxCount;
        this.reservationOpenDate = reservationOpenDate;
        this.reservationTimeInterval = reservationTimeInterval;
        this.communityClubId = communityClubId;
    }

    id: number;

    @ApiProperty({ description: '최대 인원/좌석 수' })
    maxCount: number;

    @ApiProperty({ description: '예약 오픈일' })
    reservationOpenDate: number;

    @ApiProperty({ enum: ['YEAR', 'MONTH', 'DAY'], description: '이용 갱신 주기' })
    reservationTimeInterval: CommunityClubTimeInterval;

    @ApiProperty({ description: '커뮤니티클럽 id' })
    communityClubId: number;
}
