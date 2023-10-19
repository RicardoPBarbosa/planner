import { Redo } from 'lucide-react'
import type { PropsWithChildren } from 'react'

import useWeekPlanner from 'hooks/useWeekPlanner'

function DateNumber({ children }: PropsWithChildren) {
  return (
    <span className="px-2 text-xl leading-5 border-b-2 border-primary font-body">{children}</span>
  )
}

function DateSlash() {
  return <span className="text-xl leading-6 font-display text-tertiary">/</span>
}

export default function CurrentWeekDate() {
  const { week: selectedWeek } = useWeekPlanner()
  const week = {
    start: selectedWeek[0].format('DD MM').split(' '),
    end: selectedWeek[1].format('DD MM').split(' '),
  }

  return (
    <div className="flex flex-wrap items-end justify-center gap-2 md:justify-end sm:flex-nowrap">
      <h2 className="text-lg font-display text-tertiary">Date</h2>
      <div className="flex">
        <DateNumber>{week.start?.[0]}</DateNumber>
        <DateSlash />
        <DateNumber>{week.start?.[1]}</DateNumber>
        <Redo className="self-start w-4 h-4 -mt-1 transform rotate-12 text-secondary" />
        <DateNumber>{week.end?.[0]}</DateNumber>
        <DateSlash />
        <DateNumber>{week.end?.[1]}</DateNumber>
      </div>
      <h2 className="text-lg w-max font-display text-tertiary">Week nº</h2>
      <DateNumber>{selectedWeek[0].week()}</DateNumber>
    </div>
  )
}
