import { Injectable } from '@nestjs/common';
import { Prisma, Reservation } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma.service';
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

  updateReservation(
    args: ReturnType<ReservationValidator['updateReservation']>,
  ) {
    return this.prisma.reservation.update(args);
  }
}
