import { Link, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import { weeklyPlanner } from 'database'
import GoalNumber from 'components/GoalNumber'
import useDayPlanner from 'hooks/useDayPlanner'
import { useAuthUser } from 'hooks/useAuthUser'
import { useMediaQuery } from 'hooks/useMediaQuery'
import type { ToDoItem as ToDoItemType, WeekPlanner } from '@types'

type LinkToWeekGoalProps = {
  loading: boolean
  hasLink: boolean
  data: WeekPlanner | null | undefined
  setLink: (id: number | null) => void
}

function LinkToWeekGoal({ setLink, data, hasLink, loading }: LinkToWeekGoalProps) {
  const matches = useMediaQuery('(max-width: 360px)')
  const hasGoals = !loading && !!data?.topThree?.length

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center justify-center w-7 h-7 gap-1 transition-all border rounded-md border-slate-300 hover:bg-slate-100 data-[state=open]:bg-secondary/50 text-tertiary">
          <Link size={12} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side={matches ? 'top' : 'left'}
          className="w-full max-w-xs lg:max-w-sm p-2 z-50 bg-white border-2 border-tertiary rounded-lg shadow-md shadow-slate-200 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade flex flex-col gap-1"
        >
          <DropdownMenu.Label className="tracking-wider font-display text-tertiary">
            Link this to-do with a weekly goal
          </DropdownMenu.Label>
          {loading && <div>Loading...</div>}
          {hasGoals &&
            data.topThree
              .sort((a, b) => a.position - b.position)
              .map((item) =>
                item.text.length > 0 ? (
                  <DropdownMenu.Item
                    key={item.position}
                    className="flex gap-2 px-1 py-2 rounded-lg cursor-pointer hover:bg-slate-50"
                    onClick={() => setLink(item.position)}
                  >
                    <GoalNumber number={item.position} />{' '}
                    <span className="flex-1">{item.text}</span>
                  </DropdownMenu.Item>
                ) : null
              )}
          {!hasGoals && (
            <p className="py-1 font-medium text-center font-body text-slate-600">
              No weekly goals set 🥲
            </p>
          )}
          {hasLink && (
            <DropdownMenu.Item
              className="flex items-center gap-2 px-1 py-2 text-sm font-semibold rounded-lg cursor-pointer bg-slate-100 hover:bg-slate-50"
              onClick={() => setLink(null)}
            >
              <div className="flex items-center justify-center w-6 h-6 text-white rounded-lg bg-tertiary">
                <Trash size={14} />
              </div>
              Remove link
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

function parseLinkedTo(item: ToDoItemType, weekData: WeekPlanner | null | undefined) {
  const position = item.linkedTo
  if (typeof position !== 'number') return null
  return weekData?.topThree?.find((item) => item.position === position)?.text || null
}

type Props = {
  index: number
}

export default function ToDoItem({ index }: Props) {
  const user = useAuthUser()
  const [value, setValue] = useState('')
  const { data, update, day: selectedDay } = useDayPlanner()
  const item = data?.toDoList?.[index]
  const { data: weekData, isLoading } = useQuery(
    ['week-from-day', selectedDay.format('DD/MM/YYYY')],
    () => weeklyPlanner.getWeeklyPlannerFromDay(selectedDay, user?.uid),
    {
      enabled: !!user?.uid,
    }
  )
  const goalLinkedTo = item?.linkedTo ? parseLinkedTo(item, weekData) : null

  useEffect(() => {
    setValue(item?.text || '')
  }, [item])

  function findEntryAndUpdate(index: number, payload: Partial<ToDoItemType>) {
    update({
      toDoList: data?.toDoList?.[index]
        ? data?.toDoList.map((tli, idx) => {
            if (idx === index) {
              return {
                ...tli,
                ...payload,
              }
            }
            return tli
          })
        : [...(data?.toDoList || []), { status: !!payload.status, text: value, ...payload }],
    })
  }

  return (
    <div className="flex items-center gap-2 py-1">
      <input
        type="checkbox"
        checked={Boolean(item?.status)}
        className="w-6 h-6 border-2 rounded-full text-secondary focus:ring-primary border-tertiary"
        onChange={() => findEntryAndUpdate(index, { status: !item?.status })}
      />
      {goalLinkedTo && (
        <span className="no-scrollbar max-w-[40%] max-h-10 overflow-y-auto bg-secondary/30 rounded-md px-2 py-1 ring-2 ring-inset ring-primary text-sm text-tertiary font-semibold flex gap-1">
          <Link size={10} className="flex-initial mt-1.5" />{' '}
          <span className="flex-1">{goalLinkedTo}</span>
        </span>
      )}
      <input
        type="text"
        className="flex-1 w-full px-1 py-1 border-t-0 border-b-2 border-zinc-300 border-x-0 focus:border-secondary focus:ring-transparent"
        value={value}
        onChange={({ target: { value } }) => setValue(value)}
        onBlur={({ target: { value } }) =>
          value !== item?.text && findEntryAndUpdate(index, { text: value })
        }
      />
      <LinkToWeekGoal
        loading={isLoading}
        data={weekData}
        hasLink={!!goalLinkedTo}
        setLink={(linkId) =>
          goalLinkedTo !== linkId && findEntryAndUpdate(index, { linkedTo: linkId })
        }
      />
    </div>
  )
}
