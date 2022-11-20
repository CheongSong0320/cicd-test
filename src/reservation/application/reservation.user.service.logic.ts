import { UserTokenPayload } from '@hanwha-sbi/nestjs-authorization';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
import { CommunityClubRepository } from '../infrastructure/repository/communityClub.repository';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';
import { applicationGroupBy } from '../infrastructure/util/applicationGroupBy';
import { setYearMonthDbDate } from '../infrastructure/util/dateUtil';
import { getSeatAndTimeType } from '../infrastructure/util/typeUtil';
import { ReservationValidator } from '../infrastructure/validator/reservation.validator';
import {
  GetUnavailableDateQuery,
  GetHistoryBySearchType,
  MakeReservationBody,
  UpdateReservationBody,
  UpdateReservationQuery,
  GetTimeTableQuery,
  GetAvailableDateQuery,
  GetAvailableSlotQuery,
  GetAvailableDateParam,
  GetAvailableSeatQuery,
  GetReservationHistoryQuery,
} from '../interface/reservation.interface';

dayjs.extend(isBetween);

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

  findUniqueReservation(id: number) {
    return this.reservationRepository.findUniqueReservation(+id);
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
      seatNumber: value.seatNumber,
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
    {
      searchType,
      date,
      communityClubId: communityId,
    }: GetReservationHistoryQuery,
  ) {
    const groupByDateReservationHistory = applicationGroupBy(
      await this.reservationRepository.getHistoryByQueryType(
        this.reservationValidator.getHistoryByQueryType(
          userId,
          date,
          communityId,
        ),
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
        ...getSeatAndTimeType(value.type),
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

  updateReservation(id: number, body: MakeReservationBody) {
    return this.reservationRepository.updateReservation(id, body);
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

  async getAvailableDate(id: number, { month, seat }: GetAvailableDateQuery) {
    const nowYear = new Date().getFullYear();

    const community = await this.communityRepository.findUniqueRelationType(id);

    const reservations = await this.reservationRepository.getAvailableDate(
      id,
      setYearMonthDbDate(nowYear, +month, -1),
      setYearMonthDbDate(nowYear, +month + 1, -1),
      seat,
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
            (seat ? 1 : timeLimit.maxCount);

          const val = Object.entries(
            applicationGroupBy(
              reservations,
              (args) => args.startDate.toISOString().split('T')[0],
            ),
          ).map(([key, value]) => {
            const nowSlotCount = value.reduce(
              (prev, curr) =>
                prev +
                ((curr.endDate.getTime() - curr.startDate.getTime()) /
                  1000 /
                  3600) *
                  (60 / timeLimit.reservationTimeInterval),
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
            (seat ? 1 : timeLimit.maxCount);

          const nowSeatMaxCount = seat ? 1 : timeLimit.maxCount;

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

                console.log(
                  ((curr.endDate.getTime() - curr.startDate.getTime()) /
                    1000 /
                    3600) *
                    (60 / timeLimit.reservationTimeInterval),
                );

                const slots =
                  ((curr.endDate.getTime() - curr.startDate.getTime()) /
                    1000 /
                    3600) *
                  (60 / timeLimit.reservationTimeInterval);

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

            console.log(summary);

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
          .month(month - 1)
          .daysInMonth(),
      },
      (v, i) => ({
        date: dayjs()
          .month(month - 1)
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

  async getAvailableSlot(id: number, { date, seat }: GetAvailableSlotQuery) {
    const [year, month, day] = date.split('T')[0].split('-');
    const community = await this.communityRepository.findUniqueRelationType(id);

    const timeLimit = community.CommunityClubTimeLimit!;

    const { openTime, closedTime, maxCount, reservationTimeInterval } =
      timeLimit;

    const reservations = await this.reservationRepository.getAvailableDate(
      id,
      setYearMonthDbDate(+year, +month, -1, +day),
      setYearMonthDbDate(+year, +month, -1, +day + 1),
      seat,
    );

    const slotPerTime = 60 / reservationTimeInterval;

    const slots = Array(24 * slotPerTime)
      .fill(0)
      .map((_, i) => {
        return {
          time: (
            '0' +
            ~~(i / slotPerTime) +
            ':0' +
            60 * ((i / slotPerTime) % 1)
          ).replace(/\d(\d\d)/g, '$1'),
        };
      })
      .reduce(
        (prev, curr) =>
          Object.assign(
            { ...prev },
            (() => {
              const [thisTime, thisMinute] = curr.time.split(':');
              return +thisTime >= openTime ? { [curr.time]: 0 } : {};
            })(),
          ),
        {} as { [key: string]: number },
      );

    reservations.map((value) => {
      const [startHour] = value.startDate
        .toISOString()
        .split('T')[1]
        .split(':');
      const [endHour] = value.endDate.toISOString().split('T')[1].split(':');

      for (let i = +startHour; i < +endHour; i++)
        for (let j = 0; j < slotPerTime; j++) {
          const textDate = `${i < 10 ? `0${i}` : i}:${
            j * reservationTimeInterval || '00'
          }`;

          slots[textDate]++;
        }
    });

    return {
      slots: Object.entries(slots).map(([key, value]) => {
        const [hour, minute] = key.split(':');
        return {
          slotId: key,
          isAvailable:
            +hour * 60 + +minute >
              dayjs().get('hour') * 60 + dayjs().get('minute') &&
            value < (seat ? 1 : maxCount)
              ? true
              : false,
        };
      }),
    };
  }

  async getAvailableSeat(id: number, { date, slot }: GetAvailableSeatQuery) {
    const community = await this.communityRepository.findUniqueRelationType(id);

    const maxCount =
      community.type === 'PERSON'
        ? community.CommunityClubPerson!.maxCount
        : community.type === 'SEAT'
        ? community.CommunityClubSeat!.maxCount
        : community.CommunityClubTimeLimit!.maxCount;

    const seats = Array.from({ length: maxCount }, (v, i) => ({
      seatId: i + 1,
      isAvailable: true,
    }));

    if ((!date && !slot) || (!date && slot)) return { seats };

    const [year, month, day] = date!.split('T')[0].split('-');
    const [hour, minute] = date!.split('T')[1].split(':');

    if (date && !slot) {
      switch (community.type) {
        case 'SEAT': {
          const reservations = applicationGroupBy(
            await this.reservationRepository.getAvailableDate(
              id,
              setYearMonthDbDate(+year, +month, -1, +day),
              setYearMonthDbDate(+year, +month, -1, +day + 1),
            ),
            'seatNumber',
          );

          return {
            seats: seats.map((value) => ({
              ...value,
              isAvailable: reservations[value.seatId]?.length ? false : true,
            })),
          };
        }
      }
    }

    if (date && slot) {
      switch (community.type) {
        case 'SEAT_TIME_LMIT': {
          const timeLimit = community.CommunityClubTimeLimit!;
          const endDate = dayjs(date)
            .add(timeLimit.reservationTimeInterval * +slot, 'minute')
            .toISOString();

          console.log({ date, endDate });

          const { openTime, closedTime, maxCount, reservationTimeInterval } =
            timeLimit;

          const reservations = Object.entries(
            applicationGroupBy(
              await this.reservationRepository.getAvailableDate(
                id,
                setYearMonthDbDate(+year, +month, -1, +day),
                setYearMonthDbDate(+year, +month, -1, +day + 1),
              ),
              'seatNumber',
            ),
          ).reduce((prev, [key, value]) => {
            return {
              ...prev,
              [key]: {
                seatId: key,
                isAvailable: value.some(
                  (value) =>
                    !(
                      dayjs(date).isBetween(value.startDate, value.endDate) ||
                      dayjs(endDate).isBetween(value.startDate, value.endDate)
                    ),
                ),
              },
            };
          }, {} as { [key: number]: { seatId: number; isAvailable: boolean } });

          return {
            seats: seats.map((value) => reservations[value.seatId] ?? value),
          };
        }
      }
    }
  }

  async getCommunityById(id: number) {
    const community = await this.communityRepository.getCommunityById(id);
    return { ...community, ...getSeatAndTimeType(community?.type) };
  }
}
