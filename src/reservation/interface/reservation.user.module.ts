import { Module } from '@nestjs/common';

import { PrismaService } from 'src/providers/prisma.service';
import { ReservationUserService } from '../application/reservation.user.service';
import { ReservationUserServiceLogic } from '../application/reservation.user.service.logic';
import { ReservationUserController } from '../presentation/reservation.user.controller';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';
import { ReservationValidator } from '../infrastructure/validator/reservation.validator';

@Module({
  controllers: [ReservationUserController],
  providers: [
    ReservationUserService,
    ReservationUserServiceLogic,
    PrismaService,
    ReservationRepository,
    ReservationValidator,
  ],
})
export class UserReservationModule {}
