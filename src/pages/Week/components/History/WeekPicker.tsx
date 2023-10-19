import 'react-day-picker/dist/style.css'
import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import type { DayModifiers } from 'react-day-picker'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import localDayjs from 'lib/dayjs'
import { weeklyPlanner } from 'database'
import type { Week, WeekRange } from '@types'
import { useAuthUser } from 'hooks/useAuthUser'
import useWeekPlanner from 'hooks/useWeekPlanner'
import { isDuringWeek, getWeekDays, getWeekRange, setWeekQueryKey, isSameWeek } from 'helpers/date'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type Props = {
  back: () => void
  close: () => void
}

export default function WeekPicker({ back, close }: Props) {
  const user = useAuthUser()
  const queryClient = useQueryClient()
  const { week, setWeek } = useWeekPlanner()
  const [hoverRange, setHoverRange] = useState<WeekRange>()
  const [selectedWeek, setSelectedWeek] = useState<Date[] | undefined>()
  const { data, isLoading } = useQuery(['all-weeks'], () => weeklyPlanner.getAll(user?.uid), {
    enabled: !!user?.uid,
  })
  const existingWeeks = (data ?? []).map((week) => [week.startDate, week.endDate]) as Week[]
  const { mutateAsync: addNewWeekEntryIfNotExistent, isLoading: loadingNewEntry } = useMutation({
    mutationKey: ['add-week', ...setWeekQueryKey(week)],
    mutationFn: ({ newWeek }: { newWeek: Week }) => weeklyPlanner.set(user?.uid, newWeek),
    onSuccess: () => {
      queryClient.refetchQueries(['week', ...setWeekQueryKey(week)])
    },
  })

  useEffect(() => {
    if (data && !selectedWeek && existingWeeks.length > 0) {
      for (const week of [...existingWeeks].reverse()) {
        const prevWeek = [week[0].subtract(1, 'week'), week[1].subtract(1, 'week')] satisfies Week
        if (!existingWeeks.some((w) => isSameWeek(w, prevWeek))) {
          setSelectedWeek([prevWeek[0].toDate(), prevWeek[1].toDate()])
          break
        }
      }
    }
  }, [data, existingWeeks, selectedWeek])

  function handleWeekClick(date: Date) {
    if (existingWeeks.some((week) => isDuringWeek(localDayjs(date), week))) {
      return
    }
    if (localDayjs(date).isBefore(localDayjs().startOf('week'))) {
      setSelectedWeek([
        localDayjs(date).startOf('week').toDate(),
        localDayjs(date).endOf('week').toDate(),
      ])
    }
  }

  const modifiers: DayModifiers = {
    ...(hoverRange && { hoverRange }),
    ...(selectedWeek && { selectedRange: selectedWeek }),
    ...(hoverRange && { hoverRangeStart: hoverRange.from }),
    ...(hoverRange && { hoverRangeEnd: hoverRange.to }),
  }

  async function submit() {
    if (selectedWeek) {
      const newWeek = [localDayjs(selectedWeek[0]), localDayjs(selectedWeek[1])] satisfies Week
      await addNewWeekEntryIfNotExistent({ newWeek })
      setWeek(newWeek)
      close()
    }
  }

  function buildDisabledWeeks() {
    return existingWeeks.map((week) => ({
      from: localDayjs(week[0]).toDate(),
      to: localDayjs(week[1]).toDate(),
    }))
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <DayPicker
        components={{
          DayContent: ({ date }) => <div className="text-lg font-body">{date.getDate()}</div>,
        }}
        className="!m-0"
        classNames={{
          month: 'overflow-x-auto',
          months: 'mx-auto',
          head_cell: 'tracking-wide font-display text-sm text-slate-500',
        }}
        formatters={{
          formatWeekdayName: (weekday) => weekDays[weekday.getDay()].slice(0, 3),
        }}
        weekStartsOn={1}
        showOutsideDays
        modifiers={modifiers}
        onDayClick={handleWeekClick}
        onDayMouseEnter={(date) => setHoverRange(getWeekRange(date))}
        onDayMouseLeave={() => setHoverRange(undefined)}
        toMonth={new Date()}
        selected={selectedWeek ? getWeekDays(selectedWeek[0]) : []}
        disabled={[
          {
            after: localDayjs().subtract(1, 'week').endOf('week').toDate(),
          },
          ...buildDisabledWeeks(),
        ]}
      />
      <div className="flex items-center justify-between w-full pt-4">
        <button
          className="h-10 px-3 text-lg tracking-wide transition-all border-2 rounded-md border-tertiary font-display text-tertiary hover:bg-primary hover:bg-opacity-20"
          onClick={back}
          disabled={loadingNewEntry}
        >
          &lt;- Go back
        </button>
        <button
          className="h-10 px-3 text-lg tracking-wide transition-all rounded-md bg-secondary font-display text-tertiary hover:bg-primary"
          onClick={submit}
          disabled={loadingNewEntry}
        >
          Continue -&gt;
        </button>
      </div>
    </div>
  )
}
