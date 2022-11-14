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

  findWithCommunityClub(ids: number[], dong: string, ho: string) {
    return Prisma.validator<Prisma.ReservationFindManyArgs>()({
      where: {
        communityClubId: {
          in: ids,
        },
        dong,
        ho,
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        userName: true,
        userType: true,
        userPhone: true,
        userId: true,
        dong: true,
        ho: true,
        communityClubId: true,
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
        status: {
          in: ['READY', 'PENDING'],
        },
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        seatNumber: true,
        CommunityClub: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  findReservationByCommunity(userId: number) {
    return Prisma.validator<Prisma.ReservationFindManyArgs>()({
      where: {
        startDate: {
          gte: getDayCalculas(0),
        },
        userId,
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        seatNumber: true,
        communityClubId: true,
        CommunityClub: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  getHistoryByQueryType(userId: number) {
    return Prisma.validator<Prisma.ReservationFindManyArgs>()({
      where: {
        userId,
        startDate: {
          gte: getDayCalculas(-31),
        },
        endDate: {
          lt: getDayCalculas(0),
        },
      },
      include: {
        CommunityClub: true,
      },
    });
  }
}
