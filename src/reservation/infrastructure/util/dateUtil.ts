import * as dayjs from 'dayjs';
import e from 'express';

export const getDayCalculas = (day: number, date?: Date) => {
  return dayjs(date ?? dayjs())
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0)
    .add(day, 'day')
    .toDate();
};

export const calculateUsageMinute = (start: Date, end: Date) =>
  (end.getTime() - start.getTime()) / 60000;

export const createTimeString = (nowMinute: number) =>
  `${Math.floor(nowMinute / 60)}시간 ${nowMinute % 60}분`;

export const calculateUsageTimeString = (start: Date, end: Date) =>
  createTimeString(calculateUsageMinute(start, end));

export const setYearMonthDbDate = (
  year: number,
  month: number,
  addMonth: number,
  date?: number,
  hour?: number,
  minute?: number,
) =>
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
