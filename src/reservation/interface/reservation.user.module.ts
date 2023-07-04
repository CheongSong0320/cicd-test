import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { PrismaService, ReadOnlyPrismaService } from 'src/providers/prisma.service';
import { ReservationUserService } from '../application/reservation.user.service';
import { ReservationUserServiceLogic } from '../application/reservation.user.service.logic';
import { CommunityClubRepository } from '../infrastructure/repository/communityClub.repository';
import { NotificationRepository } from '../infrastructure/repository/notification.repository';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';
import { CommunityClubValidator } from '../infrastructure/validator/communityClub.validator';
import { ReservationValidator } from '../infrastructure/validator/reservation.validator';
import { ReservationUserController } from '../presentation/reservation.user.controller';

@Module({
    imports: [HttpModule],
    controllers: [ReservationUserController],
    providers: [
        ReservationUserService,
        ReservationUserServiceLogic,
        PrismaService,
        ReadOnlyPrismaService,
        ReservationRepository,
        ReservationValidator,
        CommunityClubRepository,
        CommunityClubValidator,
        NotificationRepository,
    ],
})
export class UserReservationModule {}
