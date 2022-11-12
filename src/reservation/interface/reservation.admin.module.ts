import { Module } from '@nestjs/common';

import { PrismaService } from 'src/providers/prisma.service';
import { ReservationAdminService } from '../application/reservation.admin.service';
import { ReservationAdminServiceLogic } from '../application/reservation.admin.service.logic';
import { ReservationAdminController } from '../presentation/reservation.admin.controller';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';

@Module({
  controllers: [ReservationAdminController],
  providers: [
    ReservationAdminService,
    ReservationAdminServiceLogic,
    PrismaService,
    ReservationRepository,
  ],
})
export class AdminReservationModule {}
