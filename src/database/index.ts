import type { PartialWithFieldValue } from 'firebase/firestore'

import { collections } from 'constants'
import type { DayPlanner, WeekPlanner, YearPlanner } from '@types'
import { migrateOldPlanners, exportData } from './scripts'
import {
  getDailyPlanner,
  getAllDailyPlanners,
  getWeeklyPlanner,
  getAllWeeklyPlanners,
  getWeeklyPlannerFromDay,
  getWeeklyPlannersOfYear,
  getYearlyPlanner,
  getAllYearlyPlanners,
} from './getters'
import {
  setWeeklyPlanner,
  setDailyPlanner,
  upsertWeeklyPlanner,
  setYearlyPlanner,
  update,
} from './setters'

export const dailyPlanner = {
  get: getDailyPlanner,
  getAll: getAllDailyPlanners,
  set: setDailyPlanner,
  update: (id: string, payload: PartialWithFieldValue<DayPlanner>, userId?: string) =>
    update(id, payload, collections.days, userId),
}

export const weeklyPlanner = {
  get: getWeeklyPlanner,
  getAll: getAllWeeklyPlanners,
  set: setWeeklyPlanner,
  update: (id: string, payload: PartialWithFieldValue<WeekPlanner>, userId?: string) =>
    update(id, payload, collections.weeks, userId),
  upsert: upsertWeeklyPlanner,
  getWeeklyPlannerFromDay,
  getWeeklyPlannersOfYear,
}

export const yearlyPlanner = {
  get: getYearlyPlanner,
  getAll: getAllYearlyPlanners,
  set: setYearlyPlanner,
  update: (id: string, payload: PartialWithFieldValue<YearPlanner>, userId?: string) =>
    update(id, payload, collections.years, userId),
}

export const scripts = {
  migrateOldPlanners,
  exportData,
}
