import { Calendar } from 'lucide-react'

import useDayPlanner from 'hooks/useDayPlanner'

export default function CurrentDay() {
  const { data } = useDayPlanner()

  return (
    <div
      id="date"
      className="flex items-center justify-between h-full px-2 rounded-tr-lg rounded-bl-lg sgap-1 sm:px-3 sm:gap-2 gradient-to-l rounded-tl-md rounded-br-md"
    >
      <Calendar size={22} className="text-white" />
      <span className="leading-[initial] text-right text-lg font-display text-tertiary">
        <span className="block md:hidden">{data?.day.format('ddd, DD MMM YYYY')}</span>
        <span className="hidden md:block">{data?.day.format('dddd, DD MMM YYYY')}</span>
      </span>
    </div>
  )
}
