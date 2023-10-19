import { CloudMoon } from 'lucide-react'

import { HoursOfSleepEnum } from '@types'
import useDayPlanner from 'hooks/useDayPlanner'

export default function HoursOfSleep() {
  const { data, update } = useDayPlanner()

  return (
    <div
      id="hoursleep"
      className="p-2 text-white rounded-tl-lg rounded-tr-lg rounded-br-xl bg-tertiary h-fit rounded-bl-md"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="tracking-wide font-display">Hours of sleep</span>
        <CloudMoon size={24} className="opacity-70" />
      </div>
      <div className="flex justify-around w-full mb-1">
        {Object.values(HoursOfSleepEnum).map((hours) => (
          <button
            key={hours}
            className={`px-1.5 pt-2 pb-1 text-lg font-medium leading-none tracking-wider rounded-lg font-body disabled:opacity-70 ${
              data?.sleepHours === hours ? 'bg-white text-tertiary' : 'bg-white/20'
            }`}
            onClick={() => update({ sleepHours: hours })}
          >
            {hours}
          </button>
        ))}
      </div>
    </div>
  )
}
