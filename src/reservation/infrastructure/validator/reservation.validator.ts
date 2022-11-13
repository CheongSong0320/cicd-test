// Prisma.validator<Prisma.ReservationGroupByArgs>;
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReservationValidator {
  findByCommunityClubIds(ids: number[]) {
    const now = new Date();
    return Prisma.validator<Prisma.ReservationFindManyArgs>()({
      where: {
        communityClubId: {
          in: ids,
        },
        status: 'READY',
        startDate: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
        },
        endDate: {
          lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      },
    });
  }

  findByCommunityClubIdsAndGroupBy(ids: number[]) {
    const now = new Date();
    return Prisma.validator<Prisma.ReservationGroupByArgs>()({
      by: ['communityClubId'],
      where: {
        communityClubId: {
          in: ids,
        },
        status: 'READY',
        startDate: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
        },
        endDate: {
          lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      },
      _count: {
        _all: true,
      },
    });
  }

  findWithCommunityClub(ids: number[]) {
    return Prisma.validator<Prisma.ReservationFindManyArgs>()({
      where: {
        communityClubId: {
          in: ids,
        },
      },
      include: {
        CommunityClub: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
