import { Injectable } from '@nestjs/common';
import { Prisma, Reservation } from '@prisma/client';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/providers/prisma.service';
import {
  GetUnavailableDateQuery,
  MakeReservationBody,
} from 'src/reservation/interface/reservation.interface';
import { getDayCalculas, setYearMonthDbDate } from '../util/dateUtil';
import { ReservationValidator } from '../validator/reservation.validator';

@Injectable()
export class ReservationRepository {
  constructor(private prisma: PrismaService) {
    prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
      console.log('Query: ' + event.params);
      console.log('Duration: ' + event.duration + 'ms');
    });
  }

  findMany() {
    return this.prisma.reservation.findMany();
  }

  findByCommunityClubIds(
    args: ReturnType<ReservationValidator['findByCommunityClubIds']>,
  ) {
    return this.prisma.reservation.findMany(args);
  }

  findByCommunityClubIdsAndGroupBy(
    args: ReturnType<ReservationValidator['findByCommunityClubIdsAndGroupBy']>,
  ) {
    return this.prisma.reservation.groupBy(args);
  }

  findWithCommunityClub(
    args: ReturnType<ReservationValidator['findWithCommunityClub']>,
  ) {
    return this.prisma.reservation.findMany(args);
  }

  findTodayReservation(
    args: ReturnType<ReservationValidator['findTodayReservation']>,
  ) {
    return this.prisma.reservation.findMany(args);
  }

  findReservationByCommunity(
    args: ReturnType<ReservationValidator['findReservationByCommunity']>,
  ) {
    return this.prisma.reservation.findMany(args);
  }

  getHistoryByQueryType(
    args: ReturnType<ReservationValidator['getHistoryByQueryType']>,
  ) {
    return this.prisma.reservation.findMany(args);
  }

  getCommunityClub(args: ReturnType<ReservationValidator['getCommunityClub']>) {
    return this.prisma.communityClub.findMany(args);
  }

  makeReservation(args: ReturnType<ReservationValidator['makeReservation']>) {
    return this.prisma.reservation.create(args);
  }

  deleteReservation(
    args: ReturnType<ReservationValidator['deleteReservation']>,
  ) {
    return this.prisma.reservation.update(args);
  }

  updateReservation(id: number, body: MakeReservationBody) {
    return this.prisma.reservation.update({
      where: {
        id,
      },
      data: {
        startDate: body.startDate,
        endDate: body.endDate,
        seatNumber: body.seatNumber,
      },
    });
  }

  groupByAndCount(
    communityClubId: number,
    { year, month }: GetUnavailableDateQuery,
  ) {
    return this.prisma.reservation.groupBy({
      by: ['startDate', 'seatNumber'],
      where: {
        communityClubId,
        status: {
          not: 'CANCELLED',
        },
        startDate: {
          gte: setYearMonthDbDate(+year, +month, -1),
        },
        endDate: {
          lt: setYearMonthDbDate(+year, +month, 0),
        },
      },
      _count: {
        _all: true,
      },
    });
  }

  getUnavailableDateByTimePriority(
    communityClubId: number,
    {
      year,
      month,
      day,
      startTime,
      endTime,
    }: {
      year: number;
      month: number;
      day: number;
      startTime: string;
      endTime: string;
    },
  ) {
    const [startHour, startMinute] = startTime.split(':');
    const [endHour, endMinute] = endTime.split(':');

    return this.prisma.reservation.groupBy({
      by: ['seatNumber'],
      where: {
        communityClubId,
        status: {
          not: 'CANCELLED',
        },
        startDate: {
          gte: setYearMonthDbDate(
            year,
            month - 1,
            0,
            day,
            +startHour,
            +startMinute,
          ),
        },
        endDate: {
          lt: setYearMonthDbDate(year, month - 1, 0, day, +endHour, +endMinute),
        },
      },
      _count: {
        _all: true,
      },
    });
  }

  getReservationByCommunityClub(communityClubId: number) {
    return this.prisma.reservation.findMany({
      where: {
        communityClubId,
      },
    });
  }

  getTodayReservationCount(communityClubId: number) {
    return this.prisma.reservation.findMany({
      where: {
        communityClubId,
        startDate: {
          gte: getDayCalculas(0),
        },
        endDate: {
          lt: getDayCalculas(1),
        },
      },
    });
  }

  findReservationByDate(startDate: Date, endDate: Date) {
    return this.prisma.reservation.findMany({
      where: {
        status: {
          not: 'CANCELLED',
        },
        startDate: {
          gte: startDate,
        },
        endDate: {
          lt: endDate,
        },
      },
    });
  }

  getAvailableDate(
    communityClubId: number,
    startDate: Date,
    endDate: Date,
    seat?: number,
  ) {
    return this.prisma.reservation.findMany({
      where: {
        communityClubId,
        seatNumber: seat ? +seat : seat,
        status: {
          not: 'CANCELLED',
        },
        startDate: {
          gte: startDate,
        },
        endDate: {
          lt: endDate,
        },
      },
    });
  }
}
