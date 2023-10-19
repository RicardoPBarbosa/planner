import { Redo } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { PropsWithChildren } from 'react'

import useWeekPlanner from 'hooks/useWeekPlanner'
import PrepareNextWeek from './PrepareNextWeek'

function DayTitle({ children }: PropsWithChildren) {
  return (
    <div className="relative px-2 -mt-4 -ml-2 text-lg tracking-wide w-fit bg-secondary text-tertiary font-display rounded-tl-md rounded-tr-xl rounded-bl-xl rounded-br-md">
      {children}
    </div>
  )
}

function NotesTitle({ children }: PropsWithChildren) {
  return (
    <div className="relative z-0 w-min">
      <div className="px-2 -mt-3 -ml-2 tracking-wide text-white transform bg-primary font-display w-max rounded-tl-md rounded-tr-xl rounded-bl-xl rounded-br-md -rotate-6">
        {children}
      </div>
      <Redo size={20} className="absolute transform rotate-[70deg] top-1 text-tertiary -right-5" />
    </div>
  )
}

type Props = {
  index: number
  title: string
}

export default function WeekDay({ index, title }: Props) {
  const { data, update } = useWeekPlanner()
  const [text, setText] = useState<string>('')
  const isSunday = index === 6
  const isNotesBlock = index === 7
  const dayData = data?.weekTasks[index]

  useEffect(() => {
    setText(dayData || '')
  }, [dayData])

  function handleSubmitWeekDay() {
    update({ weekTasks: { ...data?.weekTasks, [index]: text.trim() } })
  }

  return (
    <div
      className={`border-2 border-tertiary rounded-br-md h-52 ${
        isNotesBlock ? 'dot-bg' : 'flex flex-col line-bg'
      }`}
    >
      {isNotesBlock ? <NotesTitle>{title}</NotesTitle> : <DayTitle>{title}</DayTitle>}
      <textarea
        className="flex-1 w-full h-full px-1 py-3 -mt-3 bg-transparent border-none resize-none font-body focus:ring-primary focus:ring-2 focus:border-transparent"
        onChange={({ target: { value } }) => setText(value)}
        onBlur={handleSubmitWeekDay}
        value={text}
      />
      {isSunday && <PrepareNextWeek />}
    </div>
  )
}
