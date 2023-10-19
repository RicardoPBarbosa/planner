import { Link } from 'react-router-dom'
import { Suspense, lazy, useEffect, useMemo } from 'react'
import { Redo, Settings2, Undo } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { WEEK_DAYS } from 'constants'
import { weeklyPlanner } from 'database'
import type { Week as WeekType } from '@types'
import { setWeekQueryKey, getWeekDays } from 'helpers/date'
import { useAuthUser } from 'hooks/useAuthUser'
import useWeekPlanner from 'hooks/useWeekPlanner'
import LogoWithTitle from 'components/LogoWithTitle'
import localDayjs from 'lib/dayjs'
const History = lazy(() => import('./components/History'))
const WeekDay = lazy(() => import('./components/WeekDay'))
const WeekMood = lazy(() => import('./components/WeekMood'))
const Top3Goals = lazy(() => import('./components/Top3Goals'))
const HealthTracker = lazy(() => import('./components/HealthTracker'))
const CurrentWeekDate = lazy(() => import('./components/CurrentWeekDate'))

export default function Week() {
  const user = useAuthUser()
  const queryClient = useQueryClient()
  const { week, setWeek } = useWeekPlanner()
  const { mutateAsync: addNewWeekEntryIfNotExistent } = useMutation({
    mutationKey: ['add-week', ...setWeekQueryKey(week)],
    mutationFn: ({ selectedWeek }: { selectedWeek: WeekType }) =>
      weeklyPlanner.set(user?.uid, selectedWeek),
    onSuccess: () => {
      queryClient.refetchQueries(['week', ...setWeekQueryKey(week)])
    },
  })
  const weekDaysNumbers = useMemo(() => {
    const weekDaysDates = getWeekDays(week[0].toDate())
    return weekDaysDates.map((day) => localDayjs(day).format('D'))
  }, [week])

  useEffect(() => {
    if (user?.uid) {
      addNewWeekEntryIfNotExistent({ selectedWeek: week })
    }
  }, [user])

  async function setNewWeek(newWeek: WeekType) {
    await addNewWeekEntryIfNotExistent({ selectedWeek: newWeek })
    setWeek(newWeek)
  }

  const navigateWeeksElement = (footer = false) => (
    <div
      className={`flex justify-center  gap-1 sm:w-full sm:gap-2${
        footer ? ' order-2 xs:order-none' : ''
      }`}
    >
      <button
        onClick={() => setNewWeek([week[0].subtract(1, 'week'), week[1].subtract(1, 'week')])}
        className="grid flex-1 w-10 h-10 transition-colors rounded-lg place-content-center bg-zinc-50 text-zinc-500 hover:bg-zinc-200"
      >
        <Undo size={20} />
      </button>
      <button
        onClick={() => setNewWeek([week[0].add(1, 'week'), week[1].add(1, 'week')])}
        className="grid flex-1 w-10 h-10 transition-colors rounded-lg place-content-center bg-zinc-50 text-zinc-500 hover:bg-zinc-200"
      >
        <Redo size={20} />
      </button>
    </div>
  )

  return (
    <div className="min-h-screen px-1 pt-1 pb-24 mx-auto sm:pt-3 sm:px-4 max-w-screen-2xl">
      <header className="flex flex-col justify-between space-x-1 space-y-1 overflow-hidden lg:items-center sm:flex-row md:space-x-5 lg:flex-nowrap">
        <div className="flex items-center gap-3 sm:gap-5 sm:flex-col">
          <LogoWithTitle type="weekly" />
          <div className="flex items-center justify-between flex-1 w-full gap-2 pr-1 sm:justify-normal lg:hidden sm:flex-col lg:flex-row">
            {navigateWeeksElement()}
            <div className="flex gap-2 sm:w-full sm:flex-col">
              <Suspense>
                <History />
              </Suspense>
              <Link
                to="/settings"
                className="grid flex-none w-12 h-12 max-w-[190px] grid-flow-col gap-3 transition-colors rounded-lg sm:w-full text-opacity-80 place-content-center bg-primary/10 text-primary hover:bg-primary/20"
              >
                <Settings2 />
                <span className="hidden font-semibold leading-[initial] sm:block font-body">
                  Settings
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-5 lg:flex-row">
          <Suspense>
            <Top3Goals />
          </Suspense>
          <Suspense>
            <HealthTracker />
          </Suspense>
        </div>
      </header>
      <main className="relative grid grid-flow-row grid-cols-1 grid-rows-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-5 mt-9">
        {WEEK_DAYS.map((day, index) => (
          <Suspense key={day}>
            <WeekDay index={index} title={`${day}, ${weekDaysNumbers[index]}`} />
          </Suspense>
        ))}
        <Suspense>
          <WeekDay index={WEEK_DAYS.length} title="Notes" />
        </Suspense>
      </main>
      <footer className="flex flex-wrap items-center justify-around mb-5 gap-9 mt-9">
        <Suspense>
          <WeekMood />
        </Suspense>
        <Suspense>
          <div className="flex flex-wrap justify-center gap-2 sm:flex-nowrap">
            {navigateWeeksElement(true)}
            <CurrentWeekDate />
          </div>
        </Suspense>
        <div className="hidden gap-3 lg:flex">
          <Suspense>
            <History />
          </Suspense>
          <Link
            to="/settings"
            className="items-center hidden gap-3 px-3 transition-colors rounded-lg lg:flex h-11 bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Settings2 />
            <span className="hidden font-semibold leading-[initial] sm:block font-body">
              Settings
            </span>
          </Link>
        </div>
      </footer>
    </div>
  )
}
