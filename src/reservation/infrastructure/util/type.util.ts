import { CommunityClubType } from '@prisma/client';

export const getTimeType = (type: CommunityClubType) => (type === 'PERSON' || type === 'SEAT' ? 'ALLDAY' : 'SLOT');

export const getSeatType = (type: CommunityClubType) => (type === 'SEAT' || type === 'SEAT_TIME_LMIT' ? 'SEAT' : 'NUM_PERSON');

export const getSeatAndTimeType = (type: CommunityClubType) => ({
    seatType: getSeatType(type),
    timeType: getTimeType(type),
});

export const toNumberOrUndefined = <T extends string | undefined>(value: T) => (value ? +value : undefined);
