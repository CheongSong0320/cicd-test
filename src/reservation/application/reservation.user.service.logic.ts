import { UserTokenPayload } from '@hanwha-sbi/nestjs-authorization';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
import { CommunityClubRepository } from '../infrastructure/repository/communityClub.repository';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';
import { applicationGroupBy } from '../infrastructure/util/applicationGroupBy';
import { getDayCalculas, getEndOfDay, getReservationDate, getResetCycleStartDate, setYearMonthDbDate } from '../infrastructure/util/dateUtil';
import { getReservationCount } from '../infrastructure/util/reservation.util';
import { getSeatAndTimeType, getTimeType, toNumberOrUndefined } from '../infrastructure/util/typeUtil';
import { ReservationValidator } from '../infrastructure/validator/reservation.validator';
import { FindReservationByCommunityResponse } from '../interface/findReservationByCommunity.dto';
import { GetReservationHistoryResponse } from '../interface/getReservationHistroy.dto';
import { RegisterReservationResponse } from '../interface/registerReservation.dto';
import {
    GetHistoryBySearchType,
    MakeReservationBody,
    UpdateReservationQuery,
    GetTimeTableQuery,
    GetAvailableDateQuery,
    GetAvailableSlotQuery,
    GetAvailableDateParam,
    GetAvailableSeatQuery,
    GetReservationHistoryQuery,
    RegisterReservationBody,
    GetReservationQuery,
} from '../interface/reservation.interface';
import { TodayReservationRespone } from '../interface/todayReservation.dto';

dayjs.extend(isBetween);

@Injectable()
export class ReservationUserServiceLogic {
    constructor(private reservationRepository: ReservationRepository, private reservationValidator: ReservationValidator, private communityRepository: CommunityClubRepository) {}

    helloReservation() {
        return this.reservationRepository.findMany();
    }

    async findUniqueReservation(id: number) {
        const reservation = await this.reservationRepository.findUniqueReservation(+id);

        const returnValue = { ...reservation, communityClub: reservation?.CommunityClub };

        returnValue.communityClub = undefined;

        return returnValue;
    }

    async getTodayReservation(userId: string, { startDate, endDate }: GetReservationQuery): Promise<(TodayReservationRespone | undefined)[]> {
        const todayReservations = await this.reservationRepository.findTodayReservation(this.reservationValidator.findTodayReservation(userId, startDate, endDate));

        return todayReservations
            .map(value =>
                value?.CommunityClub?.active
                    ? {
                          id: value.id,
                          startDate: value.startDate,
                          endDate: value.endDate,
                          communityClubName: value.CommunityClub.name,
                          seatNumber: value.seatNumber,
                          communityClub: {
                              ...value.CommunityClub,
                              ...getSeatAndTimeType(value.CommunityClub.type),
                          },
                      }
                    : undefined,
            )
            .filter(x => x !== undefined);
    }

    async findReservationByCommunity(userId: string): Promise<FindReservationByCommunityResponse> {
        const reservationGroupByCommunity = applicationGroupBy(
            await this.reservationRepository.findReservationByCommunity(this.reservationValidator.findReservationByCommunity(userId)),
            'communityClubId',
        );

        return {
            reservation: Object.entries(reservationGroupByCommunity).map(([_, value]) => {
                return {
                    communityName: value[0].CommunityClub.name,
                    reservation: value.flatMap(value => ({
                        id: value.id,
                        startDate: value.startDate,
                        endDate: value.endDate,
                        seatNumber: value.seatNumber,
                        communityClub: {
                            ...value.CommunityClub,
                            ...getSeatAndTimeType(value.CommunityClub.type),
                        },
                    })),
                };
            }),
        };
    }

    async getHistoryByQueryType(userId: string, { searchType, date, communityClubId: communityId }: GetReservationHistoryQuery): Promise<GetReservationHistoryResponse> {
        const groupByDateReservationHistory = applicationGroupBy(
            await this.reservationRepository.getHistoryByQueryType(this.reservationValidator.getHistoryByQueryType(userId, date, communityId)),
            args => (searchType === 'date' ? args.communityClubId : args.startDate.toISOString().split('T')[0]),
        );

        return {
            reservation: Object.entries(groupByDateReservationHistory).map(([key, value]) => ({
                date: searchType === 'community' ? key : undefined,
                communityClubId: searchType === 'date' ? key : undefined,
                communityName: searchType === 'date' ? value[0].CommunityClub.name : undefined,
                reservation: value.flatMap(value => ({
                    id: value.id,
                    startDate: value.startDate,
                    endDate: value.endDate,
                    seatNumber: value.seatNumber,
                    communityName: searchType === 'community' ? value.CommunityClub.name : undefined,
                    communityClub: {
                        ...value.CommunityClub,
                        ...getSeatAndTimeType(value.CommunityClub.type),
                    },
                })),
            })),
        };
    }

    async getCommunityClub(apartmentId: number) {
        return {
            community: (await this.reservationRepository.getCommunityClub(this.reservationValidator.getCommunityClub(apartmentId))).map(value => ({
                ...value,
                ...getSeatAndTimeType(value.type),
            })),
        };
    }

    deleteReservation(id: number) {
        return this.reservationRepository.deleteReservation(this.reservationValidator.deleteReservation(id));
    }

    updateReservation(id: number, body: MakeReservationBody) {
        return this.reservationRepository.updateReservation(id, body);
    }

    async getTimeTable(id: number, { year, month, day }: GetTimeTableQuery) {
        const community = await this.communityRepository.findUniqueRelationType(id);

        const startDate = setYearMonthDbDate(+year, +month - 1, 0, +day);
        const endDate = setYearMonthDbDate(+year, +month - 1, 0, +day + 1);

        return { startDate, endDate };
    }

    async getAvailableDate(id: number, { month, seat, date }: GetAvailableDateQuery) {
        const nowYear = new Date().getFullYear();

        const utcDiff = date ? dayjs(setYearMonthDbDate(nowYear, +month, -1)).diff(date, 'hour') : 0;

        const community = await this.communityRepository.findUniqueRelationType(id);

        const reservations = (
            await this.reservationRepository.getAvailableDate(
                id,
                date ?? setYearMonthDbDate(nowYear, +month, -1),
                date ? dayjs(date).add(1, 'month').toDate() : setYearMonthDbDate(nowYear, +month + 1, -1),
                seat,
            )
        ).map(value => ({
            ...value,
            startDate: dayjs(value.startDate).add(utcDiff, 'hour').toDate(),
            endDate: dayjs(value.endDate).add(utcDiff, 'hour').toDate(),
        }));

        console.log(reservations);

        const val = (() => {
            switch (community.type) {
                case 'PERSON': {
                    const val = Object.entries(applicationGroupBy(reservations, args => args.startDate.toISOString().split('T')[0])).map(([key, value]) => {
                        return {
                            date: new Date(key),
                            isAvailableDay: value.length < community.CommunityClubPerson!.maxCount ? true : false,
                        };
                    });

                    return { dates: val };
                }

                case 'SEAT': {
                    const val = Object.entries(applicationGroupBy(reservations, args => `${args.startDate.toISOString().split('T')[0]}_${args.seatNumber}`)).map(([key, value]) => {
                        return {
                            date: new Date(key),
                            availableSeatsCount: Math.max(0, community.CommunityClubPerson!.maxCount - value.length),
                        };
                    });

                    return { dates: val };
                }

                case 'PERSON_TIME_LIMIT': {
                    const timeLimit = community.CommunityClubTimeLimit!;

                    const nowSlotMaxCount = (timeLimit.closedTime - timeLimit.openTime) * (60 / timeLimit.reservationTimeInterval) * (seat ? 1 : timeLimit.maxCount);

                    const val = Object.entries(applicationGroupBy(reservations, args => args.startDate.toISOString().split('T')[0])).map(([key, value]) => {
                        const nowSlotCount = value.reduce((prev, curr) => prev + ((curr.endDate.getTime() - curr.startDate.getTime()) / 1000 / 3600) * (60 / timeLimit.reservationTimeInterval), 0);
                        return {
                            date: new Date(key),
                            availableSlotsCount: Math.max(nowSlotMaxCount - nowSlotCount),
                        };
                    });

                    return { dates: val, nowSlotMaxCount };
                }

                case 'SEAT_TIME_LMIT': {
                    const timeLimit = community.CommunityClubTimeLimit!;

                    const nowSlotMaxCount = (timeLimit.closedTime - timeLimit.openTime) * (60 / timeLimit.reservationTimeInterval) * (seat ? 1 : timeLimit.maxCount);

                    const nowSeatMaxCount = seat ? 1 : timeLimit.maxCount;

                    console.log({ nowSlotMaxCount, nowSeatMaxCount });

                    const val = Object.entries(applicationGroupBy(reservations, args => args.startDate.toISOString().split('T')[0])).map(([key, value]) => {
                        const nowCount = value.reduce(
                            (prev, curr) => {
                                const now = prev[curr.seatNumber!] ?? {
                                    slotCount: 0,
                                };

                                console.log(((curr.endDate.getTime() - curr.startDate.getTime()) / 1000 / 3600) * (60 / timeLimit.reservationTimeInterval));

                                const slots = ((curr.endDate.getTime() - curr.startDate.getTime()) / 1000 / 3600) * (60 / timeLimit.reservationTimeInterval);

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
                            availableSlotsCount: Math.max(0, nowSlotMaxCount - summary.reduce((prev, curr) => prev + curr.slotCount, 0)),
                            availableSeatsCount: Math.max(0, nowSeatMaxCount - summary.filter(value => value.slotCount >= nowSeatMaxCount).length),
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
                    .hour(0)
                    .minute(0)
                    .millisecond(0)
                    .second(0)
                    .toISOString(),
                isAvailableDay: community.type === 'PERSON' ? true : undefined,
                availableSlotsCount: val.nowSlotMaxCount,
                availableSeatsCount: val.nowSeatMaxCount,
            }),
        );

        const valDict = applicationGroupBy(val.dates as any, args => args['date'].toISOString());

        return {
            dates: dates.map(value => valDict[value.date]?.[0] ?? value),
        };
    }

    async getAvailableSlot(id: number, { date, seat }: GetAvailableSlotQuery) {
        console.log({ date });
        const [year, month, day] = date.split('T')[0].split('-');
        const [hour, minute, second] = date.split('T')[1].split(':');
        const community = await this.communityRepository.findUniqueRelationType(id);

        const timeLimit = community.CommunityClubTimeLimit!;

        const { openTime, closedTime, maxCount, reservationTimeInterval } = timeLimit;

        const reservations = await this.reservationRepository.getAvailableDate(
            id,
            setYearMonthDbDate(+year, +month, -1, +day, +hour, +minute).toISOString(),
            setYearMonthDbDate(+year, +month, -1, +day + 1, +hour, +minute).toISOString(),
            seat,
        );

        const slotPerTime = 60 / reservationTimeInterval;

        const openingHour = openTime > closedTime ? 24 - openTime + closedTime : closedTime - openTime;

        const slots: { [key: string]: number } = new Array(openingHour * slotPerTime).fill(0).reduce((prev, curr, i) => {
            const nowTime = (openTime + ~~(i / slotPerTime)) % 24;
            const nowMinute = ':0' + 60 * ((i / slotPerTime) % 1);
            return {
                ...prev,
                [`0${nowTime}${nowMinute}`.replace(/\d(\d\d)/g, '$1')]: 0,
            };
        }, {} as { [key: string]: number });

        reservations.map(value => {
            const [startHour] = value.startDate.toISOString().split('T')[1].split(':');
            const [endHour] = value.endDate.toISOString().split('T')[1].split(':');

            console.log(value.startDate, value.endDate);

            for (let i = +startHour; i <= +endHour; i++)
                for (let j = 0; j < slotPerTime - 1; j++) {
                    const textDate = `${i < 10 ? `0${i}` : i}:${j * reservationTimeInterval || '00'}`;
                    console.log(textDate);
                    slots[textDate]++;
                }
        });

        const nowMinute = dayjs();

        console.log(nowMinute.toISOString());
        console.log('!@*@$&($!@&*($!@&89');

        const startedTime = +hour > openTime ? dayjs(setYearMonthDbDate(+year, +month, -1, +day + 1, +openTime, 0)) : dayjs(setYearMonthDbDate(+year, +month, -1, +day, +openTime, 0));

        console.log({ hour, openTime });
        console.log(startedTime.toISOString());

        return {
            slots: Object.entries(slots).map(([key, value], idx) => {
                const [hour, minute] = key.split(':');
                const slotDayjs: dayjs.Dayjs = dayjs(startedTime).add(idx * reservationTimeInterval, 'minute');

                console.log(key, slotDayjs.toISOString());

                return {
                    slotId: key,
                    isAvailable: (nowMinute.isBefore(slotDayjs) ? true : false) && (value < (seat ? 1 : maxCount) ? true : false),
                    // isAvailable: value < (seat ? 1 : maxCount) ? (nowMinute.isBefore(slotDayjs) ? true : false) : false,
                };
            }),
        };
    }

    async getAvailableSeat(id: number, { startDate: date, slotCount: slot }: GetAvailableSeatQuery) {
        const community = await this.communityRepository.findUniqueRelationType(id);

        console.log(community);

        const maxCount =
            community.type === 'PERSON' ? community.CommunityClubPerson!.maxCount : community.type === 'SEAT' ? community.CommunityClubSeat!.maxCount : community.CommunityClubTimeLimit!.maxCount;

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
                            setYearMonthDbDate(+year, +month, -1, +day, +hour, +minute),
                            setYearMonthDbDate(+year, +month, -1, +day + 1, +hour, +minute),
                        ),
                        'seatNumber',
                    );

                    console.log(reservations);

                    return {
                        seats: seats.map(value => ({
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
                    console.log(await this.reservationRepository.getAvailableDate(id, setYearMonthDbDate(+year, +month, -1, +day), setYearMonthDbDate(+year, +month, -1, +day + 1)));

                    const now = dayjs();

                    console.log(dayjs(now).isBetween(now, dayjs().add(10, 'minute')));

                    const { openTime, closedTime, maxCount, reservationTimeInterval } = timeLimit;

                    const reservations = Object.entries(
                        applicationGroupBy(
                            await this.reservationRepository.getAvailableDate(id, setYearMonthDbDate(+year, +month, -1, +day), setYearMonthDbDate(+year, +month, -1, +day + 1)),
                            'seatNumber',
                        ),
                    ).reduce((prev, [key, value]) => {
                        return {
                            ...prev,
                            [key]: {
                                seatId: key,
                                isAvailable: value.some(
                                    value => !(dayjs(date).isBetween(value.startDate, value.endDate, null, '[)') || dayjs(endDate).isBetween(value.startDate, value.endDate, null, '[)')),
                                ),
                            },
                        };
                    }, {} as { [key: number]: { seatId: number; isAvailable: boolean } });

                    return {
                        seats: seats.map(value => reservations[value.seatId] ?? value),
                    };
                }
            }
        }
    }

    async getCommunityById(id: number) {
        const community = await this.communityRepository.getCommunityById(id);
        return { ...community, ...getSeatAndTimeType(community?.type) };
    }

    async registerReservation(id: number, body: RegisterReservationBody, payload: UserTokenPayload): Promise<RegisterReservationResponse> {
        console.log(payload);
        if (payload.apartment?.resident.accepted === false) throw new BadRequestException('미승인 유저는 예약할 수  없습니다.');

        const community = await this.communityRepository.findUniqueRelationType(id);

        const { cycleEndDate, cycleStartDate } = getResetCycleStartDate(community.resetCycle);

        const timeLimit = community?.CommunityClubTimeLimit;

        const maxCount = community.CommunityClubPerson?.maxCount ?? community.CommunityClubSeat?.maxCount ?? community.CommunityClubTimeLimit?.maxCount ?? 0;

        const { startDate, endDate } = getReservationDate(body.startDate, timeLimit?.reservationTimeInterval, body.slotCount);

        const reservationCycleCount = await this.reservationRepository.getReservationCountByResident(
            community.id,
            cycleStartDate,
            cycleEndDate,
            payload.apartment?.resident.dong,
            payload.apartment?.resident.ho,
        );

        const myReservationCount = await this.reservationRepository.getReservationCountByResident(
            community.id,
            startDate,
            endDate,
            payload.apartment?.resident.dong,
            payload.apartment?.resident.ho,
            payload.id,
        );

        const todayReservationCount = await this.reservationRepository.getReservationCountByDate(community.id, startDate, endDate, body.seatId);

        if (todayReservationCount >= maxCount && !community.isWating) throw new BadRequestException('시설 사용인원 초과');

        if (community.maxCountPerHouse && reservationCycleCount >= community.maxCountPerHouse) throw new BadRequestException('세대별 최대 이용수 초과');

        if (myReservationCount) throw new BadRequestException('이용시간이 중복되었습니다.');

        return this.reservationRepository.makeReservation(
            this.reservationValidator.makeReservation(
                payload,
                {
                    startDate,
                    endDate: getEndOfDay(endDate),
                    communityClubId: id,
                    seatNumber: body.seatId,
                },
                community,
                !community.signOffOn || (community.isWating && todayReservationCount >= (body.seatId ? 1 : maxCount)) ? 'PENDING' : 'READY',
            ),
        );
    }
}
