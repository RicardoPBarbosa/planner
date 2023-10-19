import type { Dayjs } from 'dayjs'
import { Link } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { Redo, Settings2, Undo } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { dailyPlanner } from 'database'
import { useAuthUser } from 'hooks/useAuthUser'
import useDayPlanner from 'hooks/useDayPlanner'
import CurrentDay from './components/CurrentDay'
import LogoWithTitle from 'components/LogoWithTitle'
const DayMood = lazy(() => import('./components/DayMood'))
const History = lazy(() => import('./components/History'))
const ToDoList = lazy(() => import('./components/ToDoList'))
const GratefulFor = lazy(() => import('./components/GratefulFor'))
const HoursOfSleep = lazy(() => import('./components/HoursOfSleep'))
const LitersOfWater = lazy(() => import('./components/LitersOfWater'))
const MorningRoutine = lazy(() => import('./components/MorningRoutine'))
const PositiveAffirmation = lazy(() => import('./components/PositiveAffirmation'))

type HeaderProps = {
  prev: () => void
  next: () => void
}

function Header({ prev, next }: HeaderProps) {
  return (
    <div
      id="header"
      className="flex items-center justify-between gap-1 pr-1 -mb-3 sm:justify-start sm:gap-3 sm:flex-col"
    >
      <div className="flex items-center gap-3 sm:gap-5 sm:flex-col">
        <LogoWithTitle type="daily" />
        <div className="flex justify-center flex-1 w-full gap-1 sm:gap-2">
          <button
            onClick={prev}
            className="grid flex-1 w-10 h-10 transition-colors rounded-lg place-content-center bg-zinc-50 text-zinc-500 hover:bg-zinc-200"
          >
            <Undo size={20} />
          </button>
          <button
            onClick={next}
            className="grid flex-1 w-10 h-10 transition-colors rounded-lg place-content-center bg-zinc-50 text-zinc-500 hover:bg-zinc-200"
          >
            <Redo size={20} />
          </button>
        </div>
      </div>
      <div className="flex gap-2 max-w-[190px] sm:w-full sm:gap-3 sm:flex-col">
        <Suspense>
          <History />
        </Suspense>
        <Link
          to="/settings"
          className="grid flex-none w-12 h-12 grid-flow-col gap-3 transition-colors rounded-lg sm:w-full text-opacity-80 place-content-center bg-primary/10 text-primary hover:bg-primary/20"
        >
          <Settings2 />
          <span className="hidden font-semibold leading-[initial] sm:block font-body">
            Settings
          </span>
        </Link>
      </div>
    </div>
  )
}

export default function Day() {
  const user = useAuthUser()
  const queryClient = useQueryClient()
  const { day, setDay } = useDayPlanner()
  const { mutateAsync: addNewDayEntryIfNotExistent } = useMutation({
    mutationKey: ['add-day', day.format('DD/MM/YYYY')],
    mutationFn: ({ selectedDay }: { selectedDay: Dayjs }) =>
      dailyPlanner.set(user?.uid, selectedDay),
    onSuccess: () => {
      queryClient.refetchQueries(['day', day.format('DD/MM/YYYY')])
    },
  })

  useEffect(() => {
    if (user?.uid) {
      addNewDayEntryIfNotExistent({ selectedDay: day })
    }
  }, [user])

  async function setNewDay(newDay: Dayjs) {
    await addNewDayEntryIfNotExistent({ selectedDay: newDay })
    setDay(newDay)
  }

  return (
    <div className="px-1 pt-1 pb-24 sm:pt-5 sm:px-4 day-layout">
      <Header
        prev={() => setNewDay(day.subtract(1, 'day'))}
        next={() => setNewDay(day.add(1, 'day'))}
      />
      <CurrentDay />
      <Suspense>
        <HoursOfSleep />
      </Suspense>
      <Suspense>
        <MorningRoutine />
      </Suspense>
      <Suspense>
        <ToDoList />
      </Suspense>
      <Suspense>
        <GratefulFor />
      </Suspense>
      <Suspense>
        <LitersOfWater />
      </Suspense>
      <Suspense>
        <DayMood />
      </Suspense>
      <Suspense>
        <PositiveAffirmation />
      </Suspense>
    </div>
  )
}
