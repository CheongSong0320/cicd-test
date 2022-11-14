import { UserTokenPayload } from '@hanwha-sbi/nestjs-authorization';
import { Injectable } from '@nestjs/common';
import { CommunityClubRepository } from '../infrastructure/repository/communityClub.repository';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';
import { applicationGroupBy } from '../infrastructure/util/applicationGroupBy';
import { ReservationValidator } from '../infrastructure/validator/reservation.validator';
import {
  GetHistoryBySearchType,
  MakeReservationBody,
  UpdateReservationBody,
  UpdateReservationQuery,
} from '../interface/reservation.interface';

@Injectable()
export class ReservationUserServiceLogic {
  constructor(
    private reservationRepository: ReservationRepository,
    private reservationValidator: ReservationValidator,
    private communityRepository: CommunityClubRepository,
  ) {}

  helloReservation() {
    return this.reservationRepository.findMany();
  }

  async getTodayReservation(userId: string) {
    const todayReservations =
      await this.reservationRepository.findTodayReservation(
        this.reservationValidator.findTodayReservation(userId),
      );

    return todayReservations.map((value) => ({
      id: value.id,
      startDate: value.startDate,
      endDate: value.endDate,
      communityClubName: value.CommunityClub.name,
    }));
  }

  async findReservationByCommunity(userId: string) {
    const reservationGroupByCommunity = applicationGroupBy(
      await this.reservationRepository.findReservationByCommunity(
        this.reservationValidator.findReservationByCommunity(userId),
      ),
      'communityClubId',
    );

    return {
      reservation: Object.entries(reservationGroupByCommunity).map(
        ([_, value]) => {
          return {
            communityName: value[0].CommunityClub.name,
            reservation: value.flatMap((value) => ({
              id: value.id,
              startDate: value.startDate,
              endDate: value.endDate,
              seatNumber: value.seatNumber,
            })),
          };
        },
      ),
    };
  }

  async getHistoryByQueryType(
    userId: string,
    searchType: GetHistoryBySearchType,
  ) {
    const groupByDateReservationHistory = applicationGroupBy(
      await this.reservationRepository.getHistoryByQueryType(
        this.reservationValidator.getHistoryByQueryType(userId),
      ),
      (args) =>
        searchType === 'date'
          ? args.startDate.toISOString().split('T')[0]
          : args.communityClubId,
    );

    return {
      reservation: Object.entries(groupByDateReservationHistory).map(
        ([key, value]) => ({
          date: searchType === 'date' ? key : undefined,
          communityClubId: searchType === 'community' ? key : undefined,
          communityName:
            searchType === 'community'
              ? value[0].CommunityClub.name
              : undefined,
          reservation: value.flatMap((value) => ({
            id: value.id,
            startDate: value.startDate,
            endDate: value.endDate,
            seatNumber: value.seatNumber,
            communityName:
              searchType === 'date' ? value.CommunityClub.name : undefined,
          })),
        }),
      ),
    };
  }

  async getCommunityClub(apartmentId: number) {
    return {
      community: await this.reservationRepository.getCommunityClub(
        this.reservationValidator.getCommunityClub(apartmentId),
      ),
    };
  }

  async makeReservation(payload: UserTokenPayload, body: MakeReservationBody) {
    const community = await this.communityRepository.findUniqueOrThrow(
      body.communityClubId,
    );

    return this.reservationRepository.makeReservation(
      this.reservationValidator.makeReservation(payload, body, community),
    );
  }

  deleteReservation(id: number) {
    return this.reservationRepository.deleteReservation(
      this.reservationValidator.deleteReservation(id),
    );
  }

  updateReservation(
    query: UpdateReservationQuery,
    body: UpdateReservationBody,
  ) {
    return this.reservationRepository.updateReservation(
      this.reservationValidator.updateReservation(parseInt(query.id, 10), body),
    );
  }
}
