import { AdminTokenPayload } from '@hanwha-sbi/nestjs-authorization';
import { Injectable } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { CommunityClubRepository } from '../infrastructure/repository/communityClub.repository';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';
import { applicationGroupBy } from '../infrastructure/util/applicationGroupBy';
import {
  calculateUsageMinute,
  createTimeString,
} from '../infrastructure/util/dateUtil';
import { CommunityClubValidator } from '../infrastructure/validator/communityClub.validator';
import { ReservationValidator } from '../infrastructure/validator/reservation.validator';
import {
  CommunityUsageStatusType,
  RegisterCommunityBody,
  UpdateCommunityBody,
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

  paylaoad: AdminTokenPayload;
  registerCommunity(body: RegisterCommunityBody, paylaoad: AdminTokenPayload) {
    return this.communityClubRepository.create(
      this.communityClubValidator.registerCommunityClubValidator(
        {
          ...body,
          type: body.communityClub.type,
        } as RegisterCommunityBody,
        paylaoad.apartmentId,
      ),
    );
  }

  async getCommunityUsageStatus(payload: AdminTokenPayload) {
    const communities = await this.communityClubRepository.findByApartmentId(
      this.communityClubValidator.findByApartmentIdValidator(
        payload.apartmentId,
      ),
    );
    const communityMap = applicationGroupBy(communities, 'id');

    const reservationList = applicationGroupBy(
      await this.reservationRepository.findByCommunityClubIds(
        this.reservationValidator.findByCommunityClubIds(
          Object.keys(communityMap).map(Number),
        ),
      ),
      (args) => `${args.dong}_${args.ho}_${args.communityClubId}`,
    );

    return {
      communities: communities.map((value) => value.name),
      usageStatus: Object.values(
        Object.entries(reservationList).reduce(
          (curr, [key, value]) => {
            const [dong, ho, communityClubId] = key.split('_');
            const now = curr[dong + ho] ?? { dong, ho, usageStatus: [] };
            const nowCommunity = communityMap[communityClubId][0];

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
    payload: AdminTokenPayload,
    dong: string,
    ho: string,
  ) {
    const communities = await this.communityClubRepository.findByApartmentId(
      this.communityClubValidator.findByApartmentIdValidator(
        payload.apartmentId,
      ),
    );

    const communityMap = applicationGroupBy(communities, 'id');

    const usageByUser = await this.reservationRepository.findWithCommunityClub(
      this.reservationValidator.findWithCommunityClub(
        Object.keys(communityMap).map(Number),
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
          const nowCommunity = communityMap[innerPrev.communityClubId][0];

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
      communities: communities.map((value) => value.name),
      usageByUser,
      usageByHouseHold: groupBy2depth,
    };
  }

  async getTimeLimitReservationDetail(payload: AdminTokenPayload) {
    const reservationDetail =
      await this.communityClubRepository.findCommunityClubWithReservation(
        this.communityClubValidator.findCommunityClubWithReservation(
          payload.apartmentId,
        ),
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

  async getCommunityClubs(payload: AdminTokenPayload) {
    return this.communityClubRepository.getCommunityClubsAdmin(
      payload.apartmentId,
    );
  }

  async getReservationByCommunityClub(communityClubId: number) {
    return this.reservationRepository.getReservationByCommunityClub(
      communityClubId,
    );
  }

  deleteCommunity(id: number) {
    return this.communityClubRepository.deleteCommunity(id);
  }

  updateCommunity(id: number, body: UpdateCommunityBody) {
    return this.communityClubRepository.updateCommunity(id, body);
  }

  async approveReservation(id: number) {
    const { status } = await this.communityClubRepository.findUniqueOrFail(id);

    return this.communityClubRepository.approveReservation(
      id,
      status === 'READY' ? 'PENDING' : 'READY',
    );
  }
}
