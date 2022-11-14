import { Module } from '@nestjs/common';

import { PrismaService } from 'src/providers/prisma.service';
import { ReservationUserService } from '../application/reservation.user.service';
import { ReservationUserServiceLogic } from '../application/reservation.user.service.logic';
import { ReservationUserController } from '../presentation/reservation.user.controller';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';
import { ReservationValidator } from '../infrastructure/validator/reservation.validator';
import { CommunityClubRepository } from '../infrastructure/repository/communityClub.repository';
import { CommunityClubValidator } from '../infrastructure/validator/communityClub.validator';

@Module({
  controllers: [ReservationUserController],
  providers: [
    ReservationUserService,
    ReservationUserServiceLogic,
    PrismaService,
    ReservationRepository,
    ReservationValidator,
    CommunityClubRepository,
    CommunityClubValidator,
  ],
})
export class UserReservationModule {}
