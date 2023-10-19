import { useMemo } from 'react'
import type { Dayjs } from 'dayjs'
import { CalendarPlus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { moods } from 'constants'
import { ModalViews } from '@types'
import { dailyPlanner } from 'database'
import { useAuthUser } from 'hooks/useAuthUser'
import useDayPlanner from 'hooks/useDayPlanner'
import type { MoodType, DayPlanner } from '@types'

type ItemProps = {
  day: string
  dayOfYear: number
  openDay: () => void
  isCurrentDay: boolean
  mood: MoodType | null
}

function HistoryItem({ day, dayOfYear, openDay, isCurrentDay, mood }: ItemProps) {
  return (
    <button
      onClick={() => (!isCurrentDay ? openDay() : {})}
      className={`flex overflow-hidden items-center justify-between bg-gray-100 py-3 px-4 rounded-lg space-x-8 transition-all ring-inset ring-secondary ${
        isCurrentDay ? 'opacity-50 grayscale cursor-default' : 'hover:ring-2 hover:bg-gray-50'
      }`}
    >
      <p className="text-gray-500 font-display">
        Day <b className="text-gray-800 font-body">{dayOfYear}</b>
      </p>
      <p className="flex-1 tracking-wide font-body">{day}</p>
      <div className="w-6">
        {mood !== null && <span className="emoji-splash">{moods()[mood]}</span>}
      </div>
    </button>
  )
}

type Props = {
  setCurrentView: (view: ModalViews, month?: Dayjs) => void
  close: () => void
}

export default function HistoryView({ close, setCurrentView }: Props) {
  const user = useAuthUser()
  const { day: currentDay, setDay } = useDayPlanner()
  const { data, isLoading } = useQuery(['all-days'], () => dailyPlanner.getAll(user?.uid), {
    enabled: !!user?.uid,
  })
  const formattedData = useMemo(() => {
    let month = currentDay.format('MM/YYYY')
    const result: { [key: string]: DayPlanner[] } = {}
    data?.forEach((item) => {
      const itemMonth = item.day.format('MM/YYYY')
      if (itemMonth !== month) {
        month = itemMonth
      }
      if (result[month]) {
        result[month].push(item)
      } else {
        result[month] = [item]
      }
    })
    return Object.entries(result).sort((a, b) => {
      const firstMonthYearNumber = a[0].split('/').reverse().join('')
      const lastMonthYearNumber = b[0].split('/').reverse().join('')
      return Number(lastMonthYearNumber) - Number(firstMonthYearNumber)
    })
  }, [data, currentDay])

  function handleOpenDay(day: Dayjs) {
    setDay(day)
    close()
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="relative z-10 h-8 -mb-8 bg-gradient-to-b from-white" />
      <div className="py-8 overflow-y-auto max-h-72 no-scrollbar">
        {formattedData.map(([month, items]) => (
          <div key={month}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-display text-secondary">
                {items[0].day.format('MMMM YYYY')}
              </h2>
              <button
                onClick={() => setCurrentView(ModalViews.MONTHREVIEW, items[0].day)}
                className="h-8 px-2 pt-1 font-semibold text-white transition-all rounded-tl-lg rounded-br-lg hover:bg-secondary rounded-tr-md rounded-bl-md font-body bg-primary"
              >
                Review month
              </button>
            </div>
            <div className="flex flex-col mb-4 space-y-3">
              {items
                .sort((a, b) => b.day.diff(a.day))
                .map((item) => (
                  <HistoryItem
                    key={item.day.format('YYYY-MM-DD')}
                    day={item.day.format('dddd, DD')}
                    dayOfYear={item.day.dayOfYear()}
                    mood={item.mood}
                    openDay={() => handleOpenDay(item.day)}
                    isCurrentDay={item.day.isSame(currentDay, 'day')}
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
          onClick={() => setCurrentView(ModalViews.DAYPICKER)}
        >
          <CalendarPlus size={20} />
          <span className="font-display">Create an entry in the past</span>
        </button>
      </div>
    </>
  )
}
