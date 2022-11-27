import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { CommunityClub, CommunityClubPerson, CommunityClubRestCycle, CommunityClubSeat, CommunityClubTarget, CommunityClubTimeLimit, CommunityClubType } from '@prisma/client';

import { CommunityClubDto } from 'src/reservation/domain/prisma/communityClub.dto';
import { CommunityClubPersonDto } from 'src/reservation/domain/prisma/communityClubPerson.dto';
import { CommunityClubSeatDto } from 'src/reservation/domain/prisma/communityClubSeat.dto';
import { CommunityClubTimeLimitDto } from 'src/reservation/domain/prisma/communityClubTimeLimit.dto';

type IRegisterCommunity = CommunityClub & {
    CommunityClubPerson: CommunityClubPerson | null;
    CommunityClubSeat: CommunityClubSeat | null;
    CommunityClubTimeLimit: CommunityClubTimeLimit | null;
};

export class RegisterCommunityDto {
    static from(value: IRegisterCommunity) {
        return new RegisterCommunityDto(value);
    }

    constructor({
        id,
        name,
        target,
        type,
        freeCountPerHouse,
        maxCountPerHouse,
        resetCycle,
        signOffOn,
        isWating,
        memo,
        apartmentId,
        active,
        image,
        CommunityClubPerson,
        CommunityClubSeat,
        CommunityClubTimeLimit,
    }: IRegisterCommunity) {
        this.id = id;
        this.name = name;
        this.target = target;
        this.type = type;
        this.freeCountPerHouse = freeCountPerHouse;
        this.maxCountPerHouse = maxCountPerHouse;
        this.resetCycle = resetCycle;
        this.signOffOn = signOffOn;
        this.isWating = isWating;
        this.memo = memo;
        this.apartmentId = apartmentId;
        this.active = active;
        this.image = image;

        this.CommunityClubPerson = CommunityClubPerson ? CommunityClubPersonDto.from(CommunityClubPerson) : undefined;
        this.CommunityClubSeat = CommunityClubSeat ? CommunityClubSeatDto.from(CommunityClubSeat) : undefined;
        this.CommunityClubTimeLimit = CommunityClubTimeLimit ? CommunityClubTimeLimitDto.from(CommunityClubTimeLimit) : undefined;
    }

    id: number;

    name: string;

    @ApiProperty({ enum: ['ALL', 'INDIVIDUAL', 'HOUSE'], description: '이용대상' })
    target: CommunityClubTarget;

    @ApiProperty({ enum: ['PERSON', 'PERSON_TIME_LIMIT', 'SEAT', 'SEAT_TIME_LMIT'], description: '커뮤니티 타입 (PRESON->인원제, SEAT->시간제)' })
    type: CommunityClubType;

    @ApiProperty({ description: '세대당 무료 인원 수 (무료 이후 이용료 청구)' })
    freeCountPerHouse: number;

    @ApiProperty({ description: '세대당 최대 인원 수 (이용료와 관계없이 예약가능한 인원)' })
    maxCountPerHouse: number | null;

    @ApiProperty({ enum: ['YEAR', 'MONTH', 'DAY'], description: '이용갱신 주기' })
    resetCycle: CommunityClubRestCycle;

    @ApiProperty({ type: Boolean, description: '승인 필요 여부' })
    signOffOn: boolean;

    @ApiProperty({ description: '예약대기 여부' })
    isWating: boolean;

    @ApiProperty({ description: '시설 설명' })
    memo: string;

    apartmentId: number;

    active: boolean;

    image: string | null;

    @ApiPropertyOptional({ type: CommunityClubPersonDto, description: '인원제의 추가정보' })
    CommunityClubPerson?: CommunityClubPersonDto;

    @ApiPropertyOptional({ type: CommunityClubSeatDto, description: '좌석제의 추가정보' })
    CommunityClubSeat?: CommunityClubSeatDto;

    @ApiPropertyOptional({ type: CommunityClubTimeLimitDto, description: '시간제 추가정보' })
    CommunityClubTimeLimit?: CommunityClubTimeLimitDto;
}
