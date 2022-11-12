import { Injectable } from '@nestjs/common';
import { CommunityClubRepository } from '../infrastructure/repository/communityClub.repository';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';
import { CommunityClubValidator } from '../infrastructure/validator/communityClub.validator';
import { RegisterCommunityBody } from '../interface/community.interface';

@Injectable()
export class ReservationAdminServiceLogic {
  constructor(
    private reservationRepository: ReservationRepository,
    private communityClubValidator: CommunityClubValidator,
    private communityClubRepository: CommunityClubRepository,
  ) {}

  helloReservation() {
    return this.reservationRepository.find();
  }

  registerCommunity(body: RegisterCommunityBody) {
    return this.communityClubRepository.create(
      this.communityClubValidator.registerCommunityClubValidator({
        ...body,
        type: body.communityClub.type,
      } as RegisterCommunityBody),
    );
  }
}
