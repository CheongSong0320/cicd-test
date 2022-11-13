import * as dayjs from 'dayjs';

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

export const calculateUsageTimeString = (start: Date, end: Date) => {
  const nowMinute = (end.getTime() - start.getTime()) / 60000;

  return `${nowMinute / 60}시간 ${nowMinute % 60}분`;
};
