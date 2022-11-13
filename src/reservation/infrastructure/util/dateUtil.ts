import * as dayjs from 'dayjs';
import e from 'express';

export const getDayCalculas = (day: number) => {
  return dayjs()
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0)
    .add(day, 'day')
    .add(9, 'hour')
    .toDate();
};

export const calculateUsageMinute = (start: Date, end: Date) =>
  (end.getTime() - start.getTime()) / 60000;

export const createTimeString = (nowMinute: number) =>
  `${nowMinute / 60}시간 ${nowMinute % 60}분`;

export const calculateUsageTimeString = (start: Date, end: Date) =>
  createTimeString(calculateUsageMinute(start, end));
