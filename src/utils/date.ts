import dayjs, { Dayjs } from 'dayjs';

const normalizeDate = (date: number | Dayjs): Dayjs => {
    return dayjs.isDayjs(date) ? date : dayjs(date);
};

export const isToday = (date: number | Dayjs) => normalizeDate(date).isSame(dayjs(), 'day');
export const isTomorrow = (date: number | Dayjs) => normalizeDate(date).isSame(dayjs().add(1, 'day'), 'day');
export const isThisWeek = (date: number | Dayjs) => normalizeDate(date).isSame(dayjs(), 'week');
export const isThisMonth = (date: number | Dayjs) => normalizeDate(date).isSame(dayjs(), 'month');
export const isCompleted = (completedCount: number, target: number) => completedCount >= target;
