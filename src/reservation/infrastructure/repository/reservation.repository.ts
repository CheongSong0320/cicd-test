import { Injectable } from '@nestjs/common';
import { Reservation } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma.service';

import type { IReservationRepository } from '../../domain/repository/reservation.repository.interface';

@Injectable()
export class ReservationRepository implements IReservationRepository {
  constructor(private prisma: PrismaService) {}

  find() {
    return this.prisma.reservation.findMany();
  }
}
