import { CommunityClub, Reservation } from '@prisma/client';
import { calculateUsageMinute } from './dateUtil';

export const calculateReservationUsageStatus =
    ({ freeCountPerHouse, name }: CommunityClub) =>
    (value: Reservation[]) =>
        value.reduce(
            ({ usageTime, usageCount, additionalUsageTime, additionalUsageCount }, { startDate, endDate }) => {
                const nowUsageMinute = calculateUsageMinute(startDate, endDate);
                return {
                    usageCount: usageCount + 1,
                    usageTime: usageTime + nowUsageMinute,
                    additionalUsageCount: usageCount + 1 > freeCountPerHouse ? additionalUsageCount + 1 : 0,
                    additionalUsageTime: usageCount + 1 > freeCountPerHouse ? additionalUsageTime + nowUsageMinute : 0,
                    communityName: name,
                };
            },
            { usageTime: 0, usageCount: 0, additionalUsageTime: 0, additionalUsageCount: 0, communityName: '' },
        );
