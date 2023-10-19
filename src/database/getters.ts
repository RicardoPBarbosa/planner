import type { Dayjs } from 'dayjs'
import { Timestamp, and, collection, getDocs, orderBy, query, where } from 'firebase/firestore'

import { db } from 'lib/firebase'
import localDayjs from 'lib/dayjs'
import { collections } from 'constants'
import type { DayPlanner, Week, WeekPlanner, YearPlanner } from '@types'
import { dayPlannerConverter, weekPlannerConverter, yearPlannerConverter } from './converters'

/**
 * DAILY PLANNER
 */

export async function dayPlannerQuery(userId: string, start: Date, end: Date) {
  const q = query(
    collection(db, collections.days),
    where('userId', '==', userId),
    where('day', '>=', Timestamp.fromDate(start)),
    where('day', '<', Timestamp.fromDate(end)),
    orderBy('day', 'desc')
  ).withConverter(dayPlannerConverter)
  return getDocs(q)
}

export async function getDailyPlanner(day: Dayjs, userId?: string): Promise<DayPlanner | null> {
  if (!userId) throw new Error('Unauthenticated')
  const [start, end] = [day.startOf('day').toDate(), day.endOf('day').toDate()]
  const querySnapshot = await dayPlannerQuery(userId, start, end)

  return querySnapshot.docs[0]?.data() || null
}

export async function getAllDailyPlanners(userId?: string): Promise<DayPlanner[] | null> {
  if (!userId) throw new Error('Unauthenticated')
  const q = query(
    collection(db, collections.days),
    where('userId', '==', userId),
    orderBy('day', 'desc')
  ).withConverter(dayPlannerConverter)
  const querySnapshot = await getDocs(q)
  if (querySnapshot.empty) return null

  return querySnapshot.docs.map((doc) => doc.data())
}

/**
 * WEEKLY PLANNER
 */

export async function weekPlannerQuery(userId: string, start: Date, end: Date) {
  const q = query(
    collection(db, collections.weeks),
    and(
      where('userId', '==', userId),
      where('startDate', '==', Timestamp.fromDate(start)),
      where('endDate', '==', Timestamp.fromDate(end))
    )
  ).withConverter(weekPlannerConverter)
  return getDocs(q)
}

export async function getAllWeeklyPlanners(userId?: string): Promise<WeekPlanner[] | null> {
  if (!userId) throw new Error('Unauthenticated')
  const q = query(
    collection(db, collections.weeks),
    where('userId', '==', userId),
    orderBy('startDate', 'desc')
  ).withConverter(weekPlannerConverter)
  const querySnapshot = await getDocs(q)
  if (querySnapshot.empty) return null

  return querySnapshot.docs.map((doc) => doc.data())
}

export async function getWeeklyPlanner(week: Week, userId?: string): Promise<WeekPlanner | null> {
  if (!userId) throw new Error('Unauthenticated')
  const [start, end] = [week[0].startOf('day').toDate(), week[1].endOf('day').toDate()]
  const querySnapshot = await weekPlannerQuery(userId, start, end)
  if (querySnapshot.empty) return null

  return querySnapshot.docs[0].data()
}

export async function getWeeklyPlannerFromDay(
  day: Dayjs,
  userId?: string
): Promise<WeekPlanner | null> {
  if (!userId) throw new Error('Unauthenticated')
  const [start, end] = [
    day.startOf('week').startOf('day').toDate(),
    day.endOf('week').endOf('day').toDate(),
  ] as const
  const querySnapshot = await weekPlannerQuery(userId, start, end)
  if (querySnapshot.empty) return null

  return querySnapshot.docs[0].data()
}

export async function getWeeklyPlannersOfYear(
  year: number,
  userId?: string
): Promise<WeekPlanner[] | null> {
  if (!userId) throw new Error('Unauthenticated')
  const firstDayOfYear = Timestamp.fromDate(localDayjs().startOf('year').toDate())
  const lastDayOfYear = Timestamp.fromDate(new Date(year, 11, 31, 23, 59, 59, 999000000))
  const q = query(
    collection(db, collections.weeks),
    and(
      where('userId', '==', userId),
      where('startDate', '>=', firstDayOfYear),
      where('startDate', '<=', lastDayOfYear)
    )
  ).withConverter(weekPlannerConverter)
  const querySnapshot = await getDocs(q)
  if (querySnapshot.empty) return null

  return querySnapshot.docs.map((doc) => doc.data())
}

/**
 * YEARLY PLANNER
 */

export async function yearPlannerQuery(userId: string, year: number) {
  const q = query(
    collection(db, collections.years),
    where('userId', '==', userId),
    where('year', '==', year)
  ).withConverter(yearPlannerConverter)
  return getDocs(q)
}

export async function getYearlyPlanner(year: number, userId?: string): Promise<YearPlanner | null> {
  if (!userId) throw new Error('Unauthenticated')
  const querySnapshot = await yearPlannerQuery(userId, year)
  if (querySnapshot.empty) return null

  return querySnapshot.docs[0].data()
}

export async function getAllYearlyPlanners(userId?: string): Promise<YearPlanner[] | null> {
  if (!userId) throw new Error('Unauthenticated')
  const q = query(
    collection(db, collections.years),
    where('userId', '==', userId),
    orderBy('year', 'desc')
  ).withConverter(yearPlannerConverter)
  const querySnapshot = await getDocs(q)
  if (querySnapshot.empty) return null

  return querySnapshot.docs.map((doc) => doc.data())
}
