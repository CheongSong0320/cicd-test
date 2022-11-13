import { Injectable } from '@nestjs/common';
import { Prisma, Reservation } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma.service';
import { ReservationValidator } from '../validator/reservation.validator';

@Injectable()
export class ReservationRepository {
  constructor(private prisma: PrismaService) {}

  findMany() {
    return this.prisma.reservation.findMany();
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
}
