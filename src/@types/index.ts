import type { Dayjs } from 'dayjs'

export enum MoodType {
  WASTED,
  SAD,
  OK,
  COOL,
  GREAT,
}

export type TopTaskPositions = 1 | 2 | 3
export type TopTask = {
  status: boolean
  text: string
  position: TopTaskPositions
}

export enum ModalViews {
  HISTORY,
  DAYPICKER,
  WEEKPICKER,
  YEARREVIEW,
  MONTHREVIEW,
  RETROSPECTIVE,
}

/**
 * Daily Planner
 */
export type RoutineItem = Omit<TopTask, 'position'> & {
  order: number
}
export enum HoursOfSleepEnum {
  LOW = '-7',
  MIDLOW = '7-8',
  MIDHIGH = '8-9',
  HIGH = '9+',
}
export type ToDoItem = {
  status: boolean
  text: string
  linkedTo?: number | null
}
export interface DayPlanner {
  id?: string
  day: Dayjs
  routine: RoutineItem[]
  sleepHours: HoursOfSleepEnum | null
  gratefulFor: string[]
  positiveAffirmation: string | null
  toDoList: ToDoItem[]
  litersOfWater: number
  mood: MoodType | null
  userId?: string
  updatedAt: Dayjs
}

/**
 * Weekly Planner
 */
export enum TrackingName {
  EXERCISE = 'Exercise',
  HEALTHY_EATING = 'Healthy eating',
  LITERS_OF_WATER = 'Liters of water',
}
export type Tracker = {
  [TrackingName.EXERCISE]: { [key: number]: boolean }
  [TrackingName.HEALTHY_EATING]: { [key: number]: boolean }
  [TrackingName.LITERS_OF_WATER]: { [key: number]: number }
}
export interface WeekPlanner {
  id?: string
  startDate: Dayjs
  endDate: Dayjs
  topThree: TopTask[]
  tracker: Tracker
  weekTasks: { [key: number]: string }
  mood: MoodType | null
  userId?: string
  updatedAt: Dayjs
}
export enum TrackingType {
  CHECKBOX,
  NUMBER,
}

export type WeekRange = { from: Date; to: Date }

export type Week = [Dayjs, Dayjs]

/**
 * Yearly Planner
 */
export type TopYearTaskPositions = 1 | 2 | 3 | 4 | 5
export type TopYearTask = Omit<TopTask, 'position'> & {
  position: TopYearTaskPositions
}

export type EntryCategory =
  | 'vacation'
  | 'work'
  | 'family'
  | 'friends'
  | 'home'
  | 'birthday'
  | 'project'
export type YearEntry = {
  id?: string
  date: Dayjs
  category: EntryCategory
  text: string
}

export type Question = {
  questionId: string
  answer: string
}
export type Retrospective = {
  categories?: Partial<Record<EntryCategory, string>>
  questionsAnswered?: Question[]
  text?: string
}

export interface YearPlanner {
  id?: string
  year: number
  entries: YearEntry[]
  topFive: TopYearTask[]
  mood: MoodType | null
  retrospective?: Retrospective
  userId?: string
  updatedAt: Dayjs
}
