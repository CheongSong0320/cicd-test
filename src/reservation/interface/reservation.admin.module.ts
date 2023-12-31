import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { PrismaService, ReadOnlyPrismaService } from 'src/providers/prisma.service';
import { ReservationAdminService } from '../application/reservation.admin.service';
import { ReservationAdminServiceLogic } from '../application/reservation.admin.service.logic';
import { ApiService } from '../infrastructure/repository/api.repository';
import { CommunityClubRepository } from '../infrastructure/repository/communityClub.repository';
import { NotificationRepository } from '../infrastructure/repository/notification.repository';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';
import { CommunityClubValidator } from '../infrastructure/validator/communityClub.validator';
import { ReservationValidator } from '../infrastructure/validator/reservation.validator';
import { ReservationAdminController } from '../presentation/reservation.admin.controller';

@Module({
    imports: [HttpModule],
    controllers: [ReservationAdminController],
    providers: [
        ReservationAdminService,
        ReservationAdminServiceLogic,
        PrismaService,
        ReadOnlyPrismaService,
        CommunityClubValidator,
        ReservationValidator,
        ReservationRepository,
        CommunityClubRepository,
        NotificationRepository,
        ApiService,
    ],
})
export class AdminReservationModule {}
