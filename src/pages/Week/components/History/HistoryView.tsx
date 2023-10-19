import { useMemo } from 'react'
import { CalendarPlus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { moods } from 'constants'
import localDayjs from 'lib/dayjs'
import { ModalViews } from '@types'
import { weeklyPlanner } from 'database'
import { isSameWeek } from 'helpers/date'
import { useAuthUser } from 'hooks/useAuthUser'
import useWeekPlanner from 'hooks/useWeekPlanner'
import type { MoodType, Week, WeekPlanner } from '@types'

type ItemProps = {
  weekNumber: number
  weekStart: string
  weekEnd: string
  openWeek: () => void
  isCurrentWeek: boolean
  mood: MoodType | null
}

function HistoryItem({ weekNumber, weekStart, weekEnd, openWeek, isCurrentWeek, mood }: ItemProps) {
  return (
    <button
      onClick={() => (!isCurrentWeek ? openWeek() : {})}
      className={`flex overflow-hidden items-center justify-between bg-gray-100 py-3 px-4 rounded-lg space-x-8 transition-all ring-inset ring-secondary ${
        isCurrentWeek ? 'opacity-50 grayscale cursor-default' : 'hover:ring-2 hover:bg-gray-50'
      }`}
    >
      <p className="text-gray-500 font-display">
        Week <b className="text-gray-800 font-body">{weekNumber}</b>
      </p>
      <p className="flex-1 text-lg tracking-wider font-body">
        {weekStart} <span className="mx-2 text-lg font-display text-secondary">-&gt;</span>{' '}
        {weekEnd}
      </p>
      <div className="w-6">
        {mood !== null && <span className="emoji-splash">{moods()[mood]}</span>}
      </div>
    </button>
  )
}

type Props = {
  setCurrentView: (view: ModalViews, year?: number) => void
  close: () => void
}

export default function HistoryView({ close, setCurrentView }: Props) {
  const user = useAuthUser()
  const { week: currentWeek, setWeek } = useWeekPlanner()
  const { data, isLoading } = useQuery(['all-weeks'], () => weeklyPlanner.getAll(user?.uid), {
    enabled: !!user?.uid,
  })
  const formattedData = useMemo(() => {
    const weekNumberFix = localDayjs(currentWeek[0]).subtract(1, 'day')
    let year = weekNumberFix.year()
    const result: { [key: number]: WeekPlanner[] } = {}
    data?.forEach((item) => {
      const itemYear = item.startDate.year()
      if (itemYear !== year) {
        year = itemYear
      }
      if (result[year]) {
        result[year].push(item)
      } else {
        result[year] = [item]
      }
    })
    return Object.entries(result).sort((a, b) => Number(b[0]) - Number(a[0]))
  }, [data, currentWeek])

  const handleOpenWeek = (week: Week) => {
    setWeek([localDayjs(week[0]), localDayjs(week[1])])
    close()
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="relative z-10 h-8 -mb-8 bg-gradient-to-b from-white" />
      <div className="py-8 overflow-y-auto max-h-72 no-scrollbar">
        {formattedData.map(([year, items]) => (
          <div key={year}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-3xl font-display text-secondary">{year}</h2>
              <button
                onClick={() => setCurrentView(ModalViews.YEARREVIEW, Number(year))}
                className="h-8 px-2 pt-1 font-semibold text-white transition-all rounded-tl-lg rounded-br-lg hover:bg-secondary rounded-tr-md rounded-bl-md font-body bg-primary"
              >
                Review year
              </button>
            </div>
            <div className="flex flex-col mb-4 space-y-3">
              {items
                .sort((a, b) => b.startDate.diff(a.startDate))
                .map((item) => (
                  <HistoryItem
                    key={item.startDate.format('YYYY-MM-DD')}
                    weekNumber={item.startDate.week()}
                    weekStart={item.startDate.format('DD/MM')}
                    weekEnd={item.endDate.format('DD/MM')}
                    mood={item.mood}
                    openWeek={() => handleOpenWeek([item.startDate, item.endDate])}
                    isCurrentWeek={isSameWeek([item.startDate, item.endDate], currentWeek)}
                  />
                ))}
            </div>
          </div>
        ))}
        {!Object.keys(formattedData).length && (
          <p className="text-xl text-gray-800 font-display">No entries found</p>
        )}
      </div>
      <div className="relative z-10 h-8 -mt-8 bg-gradient-to-t from-white" />
      <div className="flex justify-center">
        <button
          className="flex items-start px-4 pt-3 pb-2 space-x-2 bg-gradient-to-r from-secondary to-primary rounded-tl-md rounded-tr-xl rounded-bl-xl rounded-br-md text-tertiary hover:from-primary hover:to-secondary"
          onClick={() => setCurrentView(ModalViews.WEEKPICKER)}
        >
          <CalendarPlus size={20} />
          <span className="font-display">Create an entry in the past</span>
        </button>
      </div>
    </>
  )
}
