import { Injectable } from '@nestjs/common';
import { CommunityClubRepository } from '../infrastructure/repository/communityClub.repository';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';
import { CommunityClubValidator } from '../infrastructure/validator/communityClub.validator';
import { ReservationValidator } from '../infrastructure/validator/reservation.validator';
import {
  GetCommunityUsageStatusDetailParam,
  GetCommunityUsageStatusParam,
  RegisterCommunityBody,
} from '../interface/community.interface';

@Injectable()
export class ReservationAdminServiceLogic {
  constructor(
    private reservationValidator: ReservationValidator,
    private reservationRepository: ReservationRepository,
    private communityClubValidator: CommunityClubValidator,
    private communityClubRepository: CommunityClubRepository,
  ) {}

  helloReservation() {
    return this.reservationRepository.findMany();
  }

  registerCommunity(body: RegisterCommunityBody) {
    return this.communityClubRepository.create(
      this.communityClubValidator.registerCommunityClubValidator({
        ...body,
        type: body.communityClub.type,
      } as RegisterCommunityBody),
    );
  }

  async getCommunityUsageStatus(param: GetCommunityUsageStatusParam) {
    const communities = await this.communityClubRepository.findByApartmentId(
      this.communityClubValidator.findByApartmentIdValidator(param),
    );

    const usageStatus =
      await this.reservationRepository.findByCommunityClubIdsAndGroupBy(
        this.reservationValidator.findByCommunityClubIdsAndGroupBy(
          communities.map((value) => value.id),
        ),
      );

    return {
      communities,
      usageStatus,
    };
  }

  async getCommunityUsageStatusDetail(
    param: GetCommunityUsageStatusDetailParam,
  ) {
    const communities = await this.communityClubRepository.findByApartmentId(
      this.communityClubValidator.findByApartmentIdValidator(param),
    );

    return this.reservationRepository.findWithCommunityClub(
      this.reservationValidator.findWithCommunityClub(
        communities.map((value) => value.id),
      ),
    );
  }
}
