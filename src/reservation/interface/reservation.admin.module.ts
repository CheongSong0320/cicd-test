import { Module } from '@nestjs/common';

import { PrismaService } from 'src/providers/prisma.service';
import { ReservationAdminService } from '../application/reservation.admin.service';
import { ReservationAdminServiceLogic } from '../application/reservation.admin.service.logic';
import { CommunityClubRepository } from '../infrastructure/repository/communityClub.repository';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';
import { CommunityClubValidator } from '../infrastructure/validator/communityClub.validator';
import { ReservationValidator } from '../infrastructure/validator/reservation.validator';
import { ReservationAdminController } from '../presentation/reservation.admin.controller';

@Module({
    controllers: [ReservationAdminController],
    providers: [ReservationAdminService, ReservationAdminServiceLogic, PrismaService, CommunityClubValidator, ReservationValidator, ReservationRepository, CommunityClubRepository],
})
export class AdminReservationModule {}
