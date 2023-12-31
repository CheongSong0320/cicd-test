import { CommunityClubRestCycle } from '@prisma/client';
import * as dayjs from 'dayjs';

export const getDayCalculas = (day: number, date?: Date) => {
    return dayjs(date ?? dayjs())
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .add(day, 'day')
        .toDate();
};

export const calculateUsageMinute = (start: Date, end: Date) => (end.getTime() - start.getTime()) / 60000;

export const createTimeString = (nowMinute: number) => `${~~(nowMinute / 60)}시간 ${Math.round(nowMinute % 60)}분`;

export const calculateUsageTimeString = (start: Date, end: Date) => createTimeString(calculateUsageMinute(start, end));

export const setYearMonthDbDate = (year: number, month: number, addMonth: number, date?: number, hour?: number, minute?: number) =>
    dayjs()
        .year(year)
        .month(month)
        .date(date ?? 1)
        .hour(hour ?? 0)
        .minute(minute ?? 0)
        .second(0)
        .millisecond(0)
        .add(addMonth, 'month')
        .toDate();

export const getEndOfDay = (date: Date) => dayjs(date).subtract(1, 'millisecond').toDate();

export const getReservationDate = (startDate: Date, timeInterval?: number, slotCount?: number) => ({
    startDate: startDate,
    endDate: slotCount
        ? dayjs(startDate)
              .add(slotCount * timeInterval!, 'minute')
              .toDate()
        : dayjs(startDate).add(1, 'day').toDate(),
});

export const getResetCycleStartDate = (resetCycle: CommunityClubRestCycle) => {
    return {
        cycleStartDate: dayjs()
            .subtract(1, resetCycle === 'YEAR' ? 'year' : resetCycle === 'MONTH' ? 'month' : 'day')
            .toDate(),
        cycleEndDate: dayjs().add(1, 'day').toDate(),
    };
};
