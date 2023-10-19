import { collection, doc, getDocs, query, where, writeBatch } from 'firebase/firestore'

import { db } from 'lib/firebase'
import localDayjs from 'lib/dayjs'
import { collections } from 'constants'
import type { WeekPlanner } from '@types'
import { weekPlannerConverter } from './converters'
import { getAllDailyPlanners, getAllWeeklyPlanners, getAllYearlyPlanners } from './getters'

const oldCollectionName = 'planners'

type OldWeekPlanner = Omit<WeekPlanner, 'startDate' | 'endDate' | 'updatedAt'> & {
  updatedAt: string
  week: [string, string]
}

export async function migrateOldPlanners(userId?: string) {
  if (!userId) return
  const q = query(collection(db, oldCollectionName), where('userId', '==', userId))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.empty) return

  const data: WeekPlanner[] = querySnapshot.docs.map((doc) => {
    const planner = doc.data() as OldWeekPlanner
    const [startDate, endDate] = [
      localDayjs(planner.week[0]).startOf('day'),
      localDayjs(planner.week[1]).endOf('day'),
    ]

    return {
      id: doc.id,
      userId: planner.userId,
      updatedAt: localDayjs(planner.updatedAt),
      startDate,
      endDate,
      topThree: planner.topThree,
      tracker: planner.tracker,
      weekTasks: planner.weekTasks,
      mood: planner.mood || null,
    }
  })

  const batch = writeBatch(db)
  data.forEach((planner) => {
    const ref = doc(collection(db, collections.weeks)).withConverter(weekPlannerConverter)
    batch.set(ref, planner)
  })
  await batch.commit()
}

export async function exportData(userId: string) {
  const [daily, weekly, yearly] = await Promise.all([
    getAllDailyPlanners(userId),
    getAllWeeklyPlanners(userId),
    getAllYearlyPlanners(userId),
  ])

  return {
    daily: daily || [],
    weekly: weekly || [],
    yearly: yearly || [],
  }
}
