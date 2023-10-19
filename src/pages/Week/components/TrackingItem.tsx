import type { FocusEvent, PropsWithChildren } from 'react'

import { WEEK_DAYS } from 'constants'
import { TrackingName, TrackingType } from '@types'

function Name({ children }: PropsWithChildren) {
  return (
    <div className="px-4 leading-8 tracking-wide text-white bg-tertiary font-display rounded-tl-md rounded-tr-xl rounded-bl-xl rounded-br-md w-max">
      {children}
    </div>
  )
}

const weekDaysFirstLetter = WEEK_DAYS.map((day) => day[0])

type Props = {
  name: string
  week: { [key: number]: boolean | number }
  type: TrackingType
  onChange: (changes: { [key: number]: boolean | number }) => void
}

export default function TrackingItem({ name, week, type, onChange }: Props) {
  function handleChange(weekDay: number, value: string) {
    const clone = { ...week }
    if (type === TrackingType.CHECKBOX) {
      clone[weekDay] = !clone[weekDay]
    } else {
      const numeric = value.trim().length ? parseFloat(value.replace(/[^0-9]/g, '')) : 0
      if (!isNaN(numeric)) {
        clone[weekDay] = Number((numeric / 10).toFixed(1))
      }
    }
    onChange(clone)
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    return event.target.select()
  }

  return (
    <div className="flex items-center">
      <div className="w-36 xs:w-44">
        <Name>{name}</Name>
      </div>
      {Object.entries(week).map(([weekDay, value], i) => (
        <div
          key={`${name}-${weekDay}`}
          className={i + 1 === Object.entries(week).length ? 'lg:mr-4' : 'mr-2.5 xs:mr-4'}
        >
          {name === TrackingName.EXERCISE && (
            <div
              className={`font-display text-xl -mt-7 mb-1 text-center ${
                Number(weekDay) > 4 ? 'text-secondary' : 'text-primary'
              }`}
            >
              {weekDaysFirstLetter[Number(weekDay)]}
            </div>
          )}
          {type === TrackingType.CHECKBOX ? (
            <input
              type="checkbox"
              checked={Boolean(value)}
              className="w-6 h-6 border-2 rounded-full text-secondary focus:ring-primary border-tertiary"
              onChange={(event) => handleChange(Number(weekDay), event.target.value)}
            />
          ) : (
            <input
              onFocus={handleFocus}
              value={value as number}
              className="p-0 mt-2 -ml-1 overflow-hidden text-sm font-semibold text-center -rotate-45 border-2 rounded-full rounded-tr-none w-7 h-7 font-body text-tertiary border-tertiary focus:shadow-none focus:ring-primary focus:ring-2 focus:border-tertiary"
              onChange={(event) => handleChange(Number(weekDay), event.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  )
}
