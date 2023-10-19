import localDayjs from 'lib/dayjs'
import { TrackingName } from '@types'
import type { Tracker, RoutineItem, Week } from '@types'

export * from './moods'
export * from './data'

export const collections = {
  days: 'days',
  weeks: 'weeks',
  years: 'years',
} as const

export const DEFAULT_ROUTINE: RoutineItem[] = [
  {
    order: 1,
    text: '🧘🏼‍♂️ Meditation',
    status: false,
  },
  {
    order: 2,
    text: '📖 Reading',
    status: false,
  },
  {
    order: 3,
    text: '💡 Learning',
    status: false,
  },
]

export const DEFAULT_WEEK: Week = [
  localDayjs().startOf('week').startOf('day'),
  localDayjs().endOf('week').endOf('day'),
]

const DEFAULT_BOOLEAN_OBJECT = {
  0: false,
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
}

const DEFAULT_LITERS_OBJECT = {
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
}

export const DEFAULT_TRACKER: Tracker = {
  [TrackingName.EXERCISE]: DEFAULT_BOOLEAN_OBJECT,
  [TrackingName.HEALTHY_EATING]: DEFAULT_BOOLEAN_OBJECT,
  [TrackingName.LITERS_OF_WATER]: DEFAULT_LITERS_OBJECT,
}

export const WEEK_DAYS = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
]
