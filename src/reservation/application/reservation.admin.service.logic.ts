import { Injectable } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { CommunityClubRepository } from '../infrastructure/repository/communityClub.repository';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';
import { applicationGroupBy } from '../infrastructure/util/applicationGroupBy';
import {
  calculateUsageMinute,
  calculateUsageTimeString,
  createTimeString,
} from '../infrastructure/util/dateUtil';
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
                    calculateUsageMinute(
                      innerPrev.startDate,
                      innerPrev.endDate,
                    ),
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
                    usageTime: createTimeString(usageTime),
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
    dong: string,
    ho: string,
  ) {
    const communities = applicationGroupBy(
      await this.communityClubRepository.findByApartmentId(
        this.communityClubValidator.findByApartmentIdValidator(param),
      ),
      'id',
    );

    const usageByUser = await this.reservationRepository.findWithCommunityClub(
      this.reservationValidator.findWithCommunityClub(
        Object.keys(communities).map(Number),
        dong,
        ho,
      ),
    );

    const groupBy1depth = Object.entries(
      applicationGroupBy(
        usageByUser,
        (value) =>
          `${value.dong}-${value.ho}-${value.userId}-${value.communityClubId}`,
      ),
    ).map(([key, value]) => {
      const { userName, userType, userPhone } = value[0];
      const v = value.reduce(
        (innerCurr, innerPrev) => {
          const nowCommunity = communities[innerPrev.communityClubId][0];

          return {
            communityName: nowCommunity.name,
            usageCount: innerCurr.usageCount + 1,
            usageTime:
              innerCurr.usageTime +
              calculateUsageMinute(innerPrev.startDate, innerPrev.endDate),
          };
        },
        { usageTime: 0, usageCount: 0, communityName: '' },
      );

      return {
        ...v,
        key,
        userName,
        userType,
        userPhone,
        usageTimeString: createTimeString(v.usageTime),
      };
    });

    const groupBy2depth = Object.entries(
      applicationGroupBy(groupBy1depth, (value) => {
        const [dong, ho, userId] = value.key.split('-');
        return `${dong}-${ho}-${userId}`;
      }),
    ).map(([key, value]) => {
      const { userName, userType, userPhone } = value[0];
      return {
        key: key,
        userName,
        userType,
        userPhone,
        usageStatus: value.map(
          ({ communityName, usageCount, usageTime, usageTimeString }) => {
            return {
              communityName,
              usageCount,
              usageTime,
              usageTimeString,
            };
          },
        ),
      };
    });

    return {
      usageByUser,
      usageByHouseHold: groupBy2depth,
    };
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

interface usageStatusDetail {
  dong: number;
  ho: number;
  usageUser: [
    {
      userName: string;
      userType: UserType;
      phoneNumber: string;
      usageStatus: [
        {
          communityName: string;
          usageCount: string;
          usageTime: string;
          usageTimeString: string;
        },
      ];
    },
  ];
}
