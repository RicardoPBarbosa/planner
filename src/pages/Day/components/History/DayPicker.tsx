import type { Dayjs } from 'dayjs'
import 'react-day-picker/dist/style.css'
import { useEffect, useState } from 'react'
import { DayPicker as RDayPicker } from 'react-day-picker'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import localDayjs from 'lib/dayjs'
import { dailyPlanner } from 'database'
import useDayPlanner from 'hooks/useDayPlanner'
import { useAuthUser } from 'hooks/useAuthUser'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type Props = {
  back: () => void
  close: () => void
}

export default function DayPicker({ back, close }: Props) {
  const user = useAuthUser()
  const queryClient = useQueryClient()
  const { day, setDay } = useDayPlanner()
  const [selectedDay, setSelectedDay] = useState<Date>()
  const { data, isLoading } = useQuery(['all-days'], () => dailyPlanner.getAll(user?.uid), {
    enabled: !!user?.uid,
  })
  const existingDays = (data ?? []).map((day) => day.day)
  const { mutateAsync: addNewDayEntryIfNotExistent, isLoading: loadingNewEntry } = useMutation({
    mutationKey: ['add-day', day.format('DD/MM/YYYY')],
    mutationFn: ({ newDay }: { newDay: Dayjs }) => dailyPlanner.set(user?.uid, newDay),
    onSuccess: () => {
      queryClient.refetchQueries(['week', day.format('DD/MM/YYYY')])
    },
  })

  useEffect(() => {
    if (data && !selectedDay && existingDays.length > 0) {
      for (const existingDay of [...existingDays].reverse()) {
        const prevDay = existingDay.subtract(1, 'day')
        if (!existingDays.some((d) => d.isSame(prevDay))) {
          setSelectedDay(prevDay.toDate())
          break
        }
      }
    }
  }, [data, existingDays, selectedDay])

  async function submit() {
    if (selectedDay) {
      const newDay = localDayjs(selectedDay)
      await addNewDayEntryIfNotExistent({ newDay })
      setDay(newDay)
      close()
    }
  }

  function buildDisabledDays() {
    return existingDays.map((day) => day.toDate())
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <RDayPicker
        components={{
          DayContent: ({ date }) => <div className="text-lg font-body">{date.getDate()}</div>,
        }}
        className="!m-0 day-calendar"
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
        onDayClick={(date) => setSelectedDay(date)}
        toMonth={new Date()}
        selected={selectedDay}
        disabled={[
          {
            after: localDayjs().endOf('day').toDate(),
          },
          ...buildDisabledDays(),
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
