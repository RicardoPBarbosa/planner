import { twMerge } from 'tailwind-merge'
import { Suspense, lazy, useMemo } from 'react'

import localDayjs from 'lib/dayjs'
import { WEEK_DAYS } from 'constants'
import type { YearEntry } from '@types'
import useYearPlanner from 'hooks/useYearPlanner'
import { buildEntriesByDayOfMonth } from 'helpers/entries'
import DayItem from './DayItem'
const MonthEvents = lazy(() => import('./MonthEventsDialog'))

type Props = {
  number: number
  name: string
  monthEntries: YearEntry[]
}

export default function MonthItem({ number, name, monthEntries }: Props) {
  const { year } = useYearPlanner()
  const entries = useMemo(() => buildEntriesByDayOfMonth(monthEntries), [monthEntries])

  const calendarGrid = useMemo(() => {
    const firstDayOfMonth = localDayjs(new Date(year, number, 1))
    const daysInMonth = firstDayOfMonth.daysInMonth()
    const firstDayNumber = firstDayOfMonth.day() === 0 ? 7 : firstDayOfMonth.day() % 7
    let currentWeek: (number | null)[] = []
    const calendarGrid: (number | null)[][] = []

    // Add empty cells for the days before the first day of the month
    for (let i = 1; i < firstDayNumber; i += 1) {
      currentWeek.push(null)
    }

    // Populate the calendar grid with the days of the month
    Array.from({ length: daysInMonth }).forEach((_, dayIndex) => {
      currentWeek.push(dayIndex + 1)
      // If the week already has 7 days, start a new row
      if (currentWeek.length === 7) {
        // first entry of the week is the week number
        calendarGrid.push([localDayjs(new Date(year, number, dayIndex + 1)).week(), ...currentWeek])
        currentWeek = []
      }
    })

    // last week to the calendar grid
    if (currentWeek.length > 0) {
      // Add empty cells until the end of the week
      while (currentWeek.length < 7) {
        currentWeek.push(null)
      }
      // first entry of the week is the week number
      calendarGrid.push([localDayjs(new Date(year, number, daysInMonth)).week(), ...currentWeek])
    }
    while (calendarGrid.length < 6) {
      calendarGrid.push([null, ...Array.from({ length: 7 }, () => null)])
    }

    return calendarGrid
  }, [year, number])

  return (
    <div className="border-2 h-fit border-tertiary rounded-br-md mt-4 w-full md:w-[320px] mx-4 sm:mx-16 md:mx-0 lg:w-[364px]">
      <Suspense>
        <MonthEvents number={number} name={name} entries={entries} />
      </Suspense>
      <div className="w-full -mt-3 overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="bg-slate-50 w-7" />
              {WEEK_DAYS.map((day, i) => (
                <th
                  scope="col"
                  className={twMerge(
                    'text-slate-400 pt-3 font-display',
                    i > 4 && 'text-primary bg-primary/10'
                  )}
                  key={day}
                >
                  {day[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-200">
            {calendarGrid.map((week, rowIndex) => (
              <tr key={rowIndex}>
                {week.map((day, colIndex) =>
                  colIndex === 0 ? (
                    // first column is the week number
                    <td
                      key={colIndex}
                      className="font-medium text-center w-7 bg-slate-50 text-slate-300 font-body whitespace-nowrap"
                    >
                      {day}
                    </td>
                  ) : (
                    <DayItem
                      key={`${number}-${day || colIndex + 50}`}
                      isWeekend={colIndex > 5}
                      date={day ? localDayjs(new Date(year, number, day)) : undefined}
                      entries={day ? entries[day] || [] : []}
                    />
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
