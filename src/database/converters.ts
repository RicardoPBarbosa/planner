import { v4 as uuid } from 'uuid'
import type {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from 'firebase/firestore'

import localDayjs from 'lib/dayjs'
import type { DayPlanner, WeekPlanner, YearPlanner, YearEntry } from '@types'

export const dayPlannerConverter = {
  toFirestore(dayPlanner: DayPlanner): DocumentData {
    return {
      ...dayPlanner,
      ...(dayPlanner.day && { day: dayPlanner.day.toDate() }),
      updatedAt: new Date(),
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): DayPlanner {
    const plannerRow = snapshot.data(options)
    return {
      id: snapshot.id,
      day: localDayjs(plannerRow.day.toDate()),
      routine: plannerRow.routine,
      sleepHours: plannerRow.sleepHours,
      mood: plannerRow.mood,
      gratefulFor: plannerRow.gratefulFor,
      positiveAffirmation: plannerRow.positiveAffirmation,
      toDoList: plannerRow.toDoList,
      litersOfWater: plannerRow.litersOfWater,
      updatedAt: localDayjs(plannerRow.updatedAt.toDate()),
    }
  },
}

export const weekPlannerConverter = {
  toFirestore(weekPlanner: WeekPlanner): DocumentData {
    return {
      ...weekPlanner,
      updatedAt: weekPlanner.updatedAt ? weekPlanner.updatedAt.toDate() : new Date(),
      ...(weekPlanner.startDate && { startDate: weekPlanner.startDate.toDate() }),
      ...(weekPlanner.endDate && { endDate: weekPlanner.endDate.toDate() }),
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): WeekPlanner {
    const plannerRow = snapshot.data(options)
    return {
      id: snapshot.id,
      mood: plannerRow.mood,
      userId: plannerRow.userId,
      tracker: plannerRow.tracker,
      topThree: plannerRow.topThree,
      weekTasks: plannerRow.weekTasks,
      updatedAt: localDayjs(plannerRow.updatedAt.toDate()),
      startDate: localDayjs(plannerRow.startDate.toDate()),
      endDate: localDayjs(plannerRow.endDate.toDate()),
    }
  },
}

export const yearPlannerConverter = {
  toFirestore: (plannerRow: YearPlanner) => {
    return {
      ...plannerRow,
      ...(plannerRow.entries && {
        entries: plannerRow.entries.map((entry) => ({
          ...(!entry.id && { id: uuid() }),
          ...entry,
          date: entry.date.toDate(),
        })),
      }),
      updatedAt: new Date(),
    }
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): YearPlanner => {
    const plannerRow = snapshot.data(options)
    return {
      id: snapshot.id,
      year: plannerRow.year,
      mood: plannerRow.mood,
      topFive: plannerRow.topFive,
      userId: plannerRow.userId,
      retrospective: plannerRow.retrospective,
      entries: plannerRow.entries.map((entry: Omit<YearEntry, 'date'> & { date: Timestamp }) => ({
        ...entry,
        date: localDayjs(entry.date.toDate()),
      })),
      updatedAt: localDayjs(plannerRow.updatedAt.toDate()),
    }
  },
}
