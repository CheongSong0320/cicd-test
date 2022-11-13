// Prisma.validator<Prisma.ReservationGroupByArgs>;
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { getDayCalculas } from '../util/dateUtil';

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
      select: {
        id: true,
        startDate: true,
        endDate: true,
        userName: true,
        userType: true,
        userPhone: true,
        CommunityClub: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  findTodayReservation(userId: number) {
    return Prisma.validator<Prisma.ReservationFindManyArgs>()({
      where: {
        userId,
        startDate: {
          gte: getDayCalculas(0),
        },
        endDate: {
          lt: getDayCalculas(1),
        },
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        CommunityClub: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
