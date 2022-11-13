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
}
