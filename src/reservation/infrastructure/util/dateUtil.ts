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
