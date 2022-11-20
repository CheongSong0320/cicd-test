// Prisma.validator<Prisma.ReservationGroupByArgs>;
import { UserTokenPayload } from '@hanwha-sbi/nestjs-authorization';
import { Injectable } from '@nestjs/common';
import { CommunityClub, Prisma, ReservationStatus } from '@prisma/client';
import {
  MakeReservationBody,
  UpdateReservationBody,
} from 'src/reservation/interface/reservation.interface';
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
        startDate: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
        },
        endDate: {
          lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      },
      orderBy: {
        id: 'asc',
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
      orderBy: {
        id: 'asc',
      },
    });
  }

  findTodayReservation(userId: string) {
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
      orderBy: {
        id: 'asc',
      },
    });
  }

  findReservationByCommunity(userId: string) {
    return Prisma.validator<Prisma.ReservationFindManyArgs>()({
      where: {
        startDate: {
          gte: getDayCalculas(0),
        },
        status: {
          not: 'CANCELLED',
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

  getHistoryByQueryType(userId: string, date?: Date, communityId?: string) {
    return Prisma.validator<Prisma.ReservationFindManyArgs>()({
      where: {
        userId,
        startDate: {
          gte: date ? getDayCalculas(0, date) : getDayCalculas(-31),
        },
        endDate: {
          lt: date ? getDayCalculas(1, date) : getDayCalculas(0),
        },
        communityClubId: {
          equals: communityId ? +communityId : undefined,
        },
        status: {
          not: 'CANCELLED',
        },
      },
      include: {
        CommunityClub: true,
      },
    });
  }

  getCommunityClub(apartmentId: number) {
    return Prisma.validator<Prisma.CommunityClubFindManyArgs>()({
      where: {
        apartmentId,
      },
      include: {
        CommunityClubPerson: true,
        CommunityClubSeat: true,
        CommunityClubTimeLimit: true,
      },
    });
  }

  makeReservation(
    payload: UserTokenPayload,
    { startDate, endDate, seatNumber, communityClubId }: MakeReservationBody,
    community: CommunityClub,
    status: ReservationStatus,
  ) {
    return Prisma.validator<Prisma.ReservationCreateArgs>()({
      data: {
        startDate,
        endDate,
        seatNumber,
        userId: payload.id,
        dong: payload.apartment!.resident.dong,
        ho: payload.apartment!.resident.ho,
        userName: payload.user.name,
        userType: payload.apartment!.resident.type,
        userPhone: payload.user.phone,
        status,
        communityClubId,
      },
    });
  }

  deleteReservation(id: number) {
    return Prisma.validator<Prisma.ReservationUpdateArgs>()({
      data: {
        status: 'CANCELLED',
      },
      where: {
        id,
      },
    });
  }

  updateReservation(id: number, body: UpdateReservationBody) {
    return Prisma.validator<Prisma.ReservationUpdateArgs>()({
      data: {
        ...body,
      },
      where: {
        id,
      },
    });
  }
}
