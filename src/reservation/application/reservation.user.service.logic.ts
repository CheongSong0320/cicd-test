import { UserTokenPayload } from '@hanwha-sbi/nestjs-authorization';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { CommunityClubRepository } from '../infrastructure/repository/communityClub.repository';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';
import { applicationGroupBy } from '../infrastructure/util/applicationGroupBy';
import { setYearMonthDbDate } from '../infrastructure/util/dateUtil';
import { ReservationValidator } from '../infrastructure/validator/reservation.validator';
import {
  GetUnavailableDateQuery,
  GetHistoryBySearchType,
  MakeReservationBody,
  UpdateReservationBody,
  UpdateReservationQuery,
  GetTimeTableQuery,
  GetAvailableDateQuery,
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
      community: (
        await this.reservationRepository.getCommunityClub(
          this.reservationValidator.getCommunityClub(apartmentId),
        )
      ).map((value) => ({
        ...value,
        timeType:
          value.type === 'PERSON' || value.type === 'SEAT' ? 'ALLDAY' : 'SLOT',
        seatType:
          value.type === 'SEAT' || value.type === 'SEAT_TIME_LMIT'
            ? 'SEAT'
            : 'NUM_PERSON',
      })),
    };
  }

  async makeReservation(payload: UserTokenPayload, body: MakeReservationBody) {
    const community = await this.communityRepository.findUniqueOrThrow(
      body.communityClubId,
    );

    const maxCount =
      community.CommunityClubPerson?.maxCount ??
      community.CommunityClubSeat?.maxCount ??
      community.CommunityClubTimeLimit?.maxCount ??
      0;

    const todayReservationCount = (
      await this.reservationRepository.getTodayReservationCount(community.id)
    ).reduce((prev, curr) => {
      return prev + (curr.status === 'CANCELLED' ? 0 : 1);
    }, 0);

    return this.reservationRepository.makeReservation(
      this.reservationValidator.makeReservation(
        payload,
        body,
        community,
        community.signOffOn || maxCount <= todayReservationCount
          ? 'PENDING'
          : 'READY',
      ),
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

  async getUnavailableDate(id: number, query: GetUnavailableDateQuery) {
    const community = await this.communityRepository.findUniqueRelationType(id);

    const maxCount =
      community.CommunityClubPerson?.maxCount ??
      community.CommunityClubSeat?.maxCount ??
      community.CommunityClubTimeLimit?.maxCount ??
      100000;

    const reservationCount = await this.reservationRepository.groupByAndCount(
      community.id,
      query,
    );

    return {
      unavailableDate: reservationCount
        .filter((value) => value._count._all >= maxCount)
        .map((value) => ({
          date: value.startDate,
          seatNumber: value.seatNumber,
        })),
    };
  }

  async getUnavailableDateByTimePriority(
    id: number,
    query: {
      year: number;
      month: number;
      day: number;
      startTime: string;
      endTime: string;
    },
  ) {
    const community = await this.communityRepository.findUniqueRelationType(id);

    const maxCount = community.CommunityClubTimeLimit?.maxCount ?? 100000;

    const reservationCount = applicationGroupBy(
      await this.reservationRepository.getUnavailableDateByTimePriority(
        id,
        query,
      ),
      'seatNumber',
    );

    return {
      isAvailableList: [...Array(maxCount)].map((value, index) => ({
        seatNumber: index + 1,
        isAvailable: reservationCount[index + 1] ? true : false,
      })),
    };
  }

  async getTimeTable(id: number, { year, month, day }: GetTimeTableQuery) {
    const community = await this.communityRepository.findUniqueRelationType(id);

    const startDate = setYearMonthDbDate(+year, +month - 1, 0, +day);
    const endDate = setYearMonthDbDate(+year, +month - 1, 0, +day + 1);

    return { startDate, endDate };
  }

  async getAvailableDate(id: number, query: GetAvailableDateQuery) {
    const community = await this.communityRepository.findUniqueRelationType(id);

    const reservations = await this.reservationRepository.getAvailableDate(
      id,
      +query.month,
      query?.seat,
    );

    const val = (() => {
      switch (community.type) {
        case 'PERSON': {
          const val = Object.entries(
            applicationGroupBy(
              reservations,
              (args) => args.startDate.toISOString().split('T')[0],
            ),
          ).map(([key, value]) => {
            return {
              date: new Date(key),
              isAvailableDay:
                value.length < community.CommunityClubPerson!.maxCount
                  ? true
                  : false,
            };
          });

          return { dates: val };
        }

        case 'SEAT': {
          const val = Object.entries(
            applicationGroupBy(
              reservations,
              (args) =>
                `${args.startDate.toISOString().split('T')[0]}_${
                  args.seatNumber
                }`,
            ),
          ).map(([key, value]) => {
            return {
              date: new Date(key),
              availableSeatsCount: Math.max(
                0,
                community.CommunityClubPerson!.maxCount - value.length,
              ),
            };
          });

          return { dates: val };
        }

        case 'PERSON_TIME_LIMIT': {
          const timeLimit = community.CommunityClubTimeLimit!;

          const nowSlotMaxCount =
            (timeLimit.closedTime - timeLimit.openTime) *
            (60 / timeLimit.reservationTimeInterval) *
            (query.seat ? 1 : timeLimit.maxCount);

          const val = Object.entries(
            applicationGroupBy(
              reservations,
              (args) => args.startDate.toISOString().split('T')[0],
            ),
          ).map(([key, value]) => {
            const nowSlotCount = value.reduce(
              (prev, curr) =>
                prev +
                (curr.endDate.getTime() - curr.startDate.getTime()) /
                  ((60 / timeLimit.reservationTimeInterval) * 60 * 1000),
              0,
            );
            return {
              date: new Date(key),
              availableSlotsCount: Math.max(nowSlotMaxCount - nowSlotCount),
            };
          });

          return { dates: val, nowSlotMaxCount };
        }

        case 'SEAT_TIME_LMIT': {
          const timeLimit = community.CommunityClubTimeLimit!;

          const nowSlotMaxCount =
            (timeLimit.closedTime - timeLimit.openTime) *
            (60 / timeLimit.reservationTimeInterval) *
            (query.seat ? 1 : timeLimit.maxCount);

          const nowSeatMaxCount = query.seat ? 1 : timeLimit.maxCount;

          console.log({ nowSlotMaxCount, nowSeatMaxCount });

          const val = Object.entries(
            applicationGroupBy(
              reservations,
              (args) => args.startDate.toISOString().split('T')[0],
            ),
          ).map(([key, value]) => {
            const nowCount = value.reduce(
              (prev, curr) => {
                const now = prev[curr.seatNumber!] ?? {
                  slotCount: 0,
                };

                const slots =
                  (curr.endDate.getTime() - curr.startDate.getTime()) /
                  ((60 / timeLimit.reservationTimeInterval) * 60 * 1000);

                return {
                  ...prev,
                  [curr.seatNumber!]: {
                    slotCount: now.slotCount + slots,
                  },
                };
              },
              {} as {
                [key: number]: { slotCount: number };
              },
            );

            const summary = Object.values(nowCount);

            return {
              date: new Date(key),
              availableSlotsCount: Math.max(
                0,
                nowSlotMaxCount -
                  summary.reduce((prev, curr) => prev + curr.slotCount, 0),
              ),
              availableSeatsCount: Math.max(
                0,
                nowSeatMaxCount -
                  summary.filter((value) => value.slotCount >= nowSeatMaxCount)
                    .length,
              ),
            };
          });

          return { dates: val, nowSlotMaxCount, nowSeatMaxCount };
        }
      }
    })();

    const dates = Array.from(
      {
        length: dayjs()
          .month(query.month - 1)
          .daysInMonth(),
      },
      (v, i) => ({
        date: dayjs()
          .month(query.month - 1)
          .date(i + 1)
          .hour(9)
          .minute(0)
          .second(0)
          .millisecond(0)
          .toISOString(),
        isAvailableDay: community.type === 'PERSON' ? true : undefined,
        availableSlotsCount: val.nowSlotMaxCount,
        availableSeatsCount: val.nowSeatMaxCount,
      }),
    );

    const valDict = applicationGroupBy(val.dates as any, (args) =>
      args['date'].toISOString(),
    );

    return {
      dates: dates.map((value) => valDict[value.date]?.[0] ?? value),
    };
  }
}
