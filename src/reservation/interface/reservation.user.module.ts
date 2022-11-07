import { Module } from '@nestjs/common';

import { PrismaService } from 'src/providers/prisma.service';
import { ReservationService } from '../application/reservation.user.service';
import { ReservationServiceLogic } from '../application/reservation.user.service.logic';
import { ReservationController } from '../presentation/reservation.controller';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';

@Module({
  controllers: [ReservationController],
  providers: [
    ReservationService,
    ReservationServiceLogic,
    PrismaService,
    ReservationRepository,
  ],
})
export class UserReservationModule {}
