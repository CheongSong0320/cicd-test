import { Injectable } from '@nestjs/common';
import { CommunityClubRepository } from '../infrastructure/repository/communityClub.repository';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';
import { applicationGroupBy } from '../infrastructure/util/applicationGroupBy';
import { calculateUsageTimeString } from '../infrastructure/util/dateUtil';
import { CommunityClubValidator } from '../infrastructure/validator/communityClub.validator';
import { ReservationValidator } from '../infrastructure/validator/reservation.validator';
import {
  CommunityUsageStatusType,
  GetCommunityUsageStatusDetailParam,
  GetCommunityUsageStatusParam,
  RegisterCommunityBody,
  GetReservationDetailParam,
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
    const communities = applicationGroupBy(
      await this.communityClubRepository.findByApartmentId(
        this.communityClubValidator.findByApartmentIdValidator(param),
      ),
      'id',
    );

    const reservationList = applicationGroupBy(
      await this.reservationRepository.findByCommunityClubIds(
        this.reservationValidator.findByCommunityClubIds(
          Object.keys(communities).map(Number),
        ),
      ),
      (args) => `${args.dong}_${args.ho}_${args.communityClubId}`,
    );

    return {
      usageStatus: Object.values(
        Object.entries(reservationList).reduce(
          (curr, [key, value]) => {
            const [dong, ho, communityClubId] = key.split('_');
            const now = curr[dong + ho] ?? { dong, ho, usageStatus: [] };
            const nowCommunity = communities[communityClubId][0];

            const { usageCount, usageTime } = value.reduce(
              (innerCurr, innerPrev) => {
                return {
                  usageCount: innerCurr.usageCount + 1,
                  usageTime:
                    innerCurr.usageTime +
                    (innerPrev.endDate.getTime() -
                      innerPrev.startDate.getTime()) /
                      1000 /
                      60,
                };
              },
              { usageTime: 0, usageCount: 0 },
            );

            return {
              ...curr,
              [dong + ho]: {
                ...now,
                usageStatus: [
                  ...now.usageStatus,
                  {
                    communityClubId: Number(communityClubId),
                    communityName: nowCommunity.name,
                    usageCount,
                    usageTime: `${usageTime / 60}시간 ${usageTime % 60}분`,
                    viewProperty:
                      nowCommunity.resetCycle === 'DAY'
                        ? 'usageTime'
                        : 'usageCount',
                  },
                ],
              },
            };
          },
          {} as {
            [key: string]: {
              dong: string;
              ho: string;
              usageStatus: CommunityUsageStatusType[];
            };
          },
        ),
      ),
    };
  }

  async getCommunityUsageStatusDetail(
    param: GetCommunityUsageStatusDetailParam,
  ) {
    const communities = await this.communityClubRepository.findByApartmentId(
      this.communityClubValidator.findByApartmentIdValidator(param),
    );

    const usageByUser = (
      await this.reservationRepository.findWithCommunityClub(
        this.reservationValidator.findWithCommunityClub(
          communities.map((value) => value.id),
        ),
      )
    ).map((value) => ({
      id: value.id,
      startDate: value.startDate,
      endDate: value.endDate,
      userName: value.userName,
      userType: value.userType,
      userPhone: value.userPhone,
      communityName: value.CommunityClub.name,
      usageTime: calculateUsageTimeString(value.startDate, value.endDate),
    }));

    return { usageByUser };
  }

  async getTimeLimitReservationDetail(param: GetReservationDetailParam) {
    const reservationDetail =
      await this.communityClubRepository.findCommunityClubWithReservation(
        this.communityClubValidator.findCommunityClubWithReservation(param),
      );

    return reservationDetail.map((value) => ({
      id: value.id,
      name: value.name,
      CommunityClubTimeLimit: value.CommunityClubTimeLimit,
      reservation: applicationGroupBy(
        value.Reservation,
        (value) => value.startDate.toISOString().split('T')[0],
      ),
    }));
  }
}
