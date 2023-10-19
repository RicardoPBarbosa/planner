import type { Dayjs } from 'dayjs'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import type { FieldValue, PartialWithFieldValue, WithFieldValue } from 'firebase/firestore'

import { db } from 'lib/firebase'
import localDayjs from 'lib/dayjs'
import { DEFAULT_ROUTINE, DEFAULT_TRACKER, DEFAULT_WEEK, collections } from 'constants'
import type { DayPlanner, TopTask, Tracker, Week, WeekPlanner, YearPlanner } from '@types'
import { dayPlannerQuery, weekPlannerQuery, yearPlannerQuery } from './getters'
import { dayPlannerConverter, weekPlannerConverter, yearPlannerConverter } from './converters'

export async function update(
  id: string,
  payload: PartialWithFieldValue<DayPlanner | WeekPlanner | YearPlanner>,
  collection: keyof typeof collections,
  userId?: string
) {
  if (!userId) throw new Error('Unauthenticated')
  const converter: { [key in typeof collection]: any } = {
    days: dayPlannerConverter,
    weeks: weekPlannerConverter,
    years: yearPlannerConverter,
  }

  const docRef = doc(db, collection, id).withConverter(converter[collection])
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) {
    throw new Error('Entry not found')
  }
  await setDoc(docRef, payload, { merge: true })
}

/**
 * DAILY PLANNER
 */

export async function setDailyPlanner(userId?: string, day: Dayjs = localDayjs()) {
  if (!userId) throw new Error('Unauthenticated')
  const [start, end] = [day.startOf('day').toDate(), day.endOf('day').toDate()]
  const querySnapshot = await dayPlannerQuery(userId, start, end)
  if (querySnapshot.empty) {
    const ref = doc(collection(db, collections.days)).withConverter(dayPlannerConverter)
    await setDoc(ref, {
      day: day.set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0),
      routine: DEFAULT_ROUTINE,
      sleepHours: null,
      gratefulFor: [],
      positiveAffirmation: null,
      mood: null,
      litersOfWater: 0,
      toDoList: [],
      userId,
      updatedAt: localDayjs(),
    })
  }
}

/**
 * WEEKLY PLANNER
 */

export async function setWeeklyPlanner(userId?: string, week: Week = DEFAULT_WEEK) {
  if (!userId) throw new Error('Unauthenticated')
  const [start, end] = [week[0].startOf('day').toDate(), week[1].endOf('day').toDate()]
  const querySnapshot = await weekPlannerQuery(userId, start, end)
  if (querySnapshot.empty) {
    const ref = doc(collection(db, collections.weeks)).withConverter(weekPlannerConverter)
    await setDoc(ref, {
      startDate: week[0],
      endDate: week[1],
      topThree: [],
      tracker: DEFAULT_TRACKER,
      mood: null,
      weekTasks: {},
      userId,
      updatedAt: localDayjs(),
    })
  }
}

export async function upsertWeeklyPlanner(
  week: Week,
  payload: PartialWithFieldValue<WeekPlanner>,
  userId?: string
) {
  if (!userId) throw new Error('Unauthenticated')
  const [start, end] = [week[0].startOf('day').toDate(), week[1].endOf('day').toDate()]
  const querySnapshot = await weekPlannerQuery(userId, start, end)
  if (querySnapshot.empty) {
    const ref = doc(collection(db, collections.weeks)).withConverter(weekPlannerConverter)
    await setDoc(ref, {
      startDate: week[0],
      endDate: week[1],
      topThree: (payload.topThree as FieldValue | WithFieldValue<TopTask[]>) ?? [],
      tracker: (payload.tracker as FieldValue | WithFieldValue<Tracker>) ?? DEFAULT_TRACKER,
      mood: payload.mood ?? null,
      weekTasks:
        (payload.weekTasks as FieldValue | WithFieldValue<{ [key: number]: string }>) ?? {},
      userId,
      updatedAt: localDayjs(),
    })
  } else {
    const doc = querySnapshot.docs[0]
    await update(doc.id, payload, collections.weeks, userId)
  }
}

/**
 * YEARLY PLANNER
 */

export async function setYearlyPlanner(userId?: string, year: number = localDayjs().year()) {
  if (!userId) throw new Error('Unauthenticated')
  const querySnapshot = await yearPlannerQuery(userId, year)
  if (querySnapshot.empty) {
    const ref = doc(collection(db, collections.years)).withConverter(yearPlannerConverter)
    await setDoc(ref, {
      year,
      entries: [],
      topFive: [],
      mood: null,
      userId,
      updatedAt: localDayjs(),
    })
  }
}
