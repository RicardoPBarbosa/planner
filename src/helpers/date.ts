import type { Dayjs } from 'dayjs'

import localDayjs from 'lib/dayjs'
import type { Week, WeekRange } from '@types'

export function setWeekQueryKey(week: Week) {
  return [week[0].format('DD/MM/YYYY'), week[1].format('DD/MM/YYYY')]
}

export function isSameWeek([itemStart, itemEnd]: Week, [currentStart, currentEnd]: Week) {
  return (
    localDayjs(itemStart, 'YYYY-MM-DDTHH:mm:ss').isSame(localDayjs(currentStart), 'day') &&
    localDayjs(itemEnd, 'YYYY-MM-DDTHH:mm:ss').isSame(localDayjs(currentEnd), 'day')
  )
}

export function getWeekRange(date: Date): WeekRange {
  return {
    from: localDayjs(date).startOf('week').toDate(),
    to: localDayjs(date).endOf('week').toDate(),
  }
}

export function getWeekDays(weekStart: Date): Date[] {
  const start = getWeekRange(weekStart).from
  const days = [start]
  for (let i = 1; i < 7; i += 1) {
    days.push(localDayjs(start).add(i, 'days').toDate())
  }
  return days
}

export function isDuringWeek(date: Dayjs, week: Week) {
  return date.isAfter(localDayjs(week[0])) && date.isBefore(localDayjs(week[1]))
}
