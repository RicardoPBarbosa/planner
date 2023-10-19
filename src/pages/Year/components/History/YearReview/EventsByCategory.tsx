import { useState } from 'react'
import { ArrowDown } from 'lucide-react'

import { categoriesColors } from 'constants'
import type { EntryCategory, YearEntry } from '@types'

type Props = {
  events: [EntryCategory, YearEntry[]][]
}

export default function EventsByCategory({ events }: Props) {
  const [openCategory, setOpenCategory] = useState<EntryCategory>()

  return (
    <div className="grid grid-cols-1 gap-2 mt-1 mb-5 xs:grid-cols-2">
      {events.map(([category, entries]) => (
        <div
          key={category}
          className="self-start rounded-md"
          style={{
            backgroundColor: `rgba(${categoriesColors[category]}, 0.15)`,
          }}
        >
          <button
            onClick={() => setOpenCategory((prev) => (prev === category ? undefined : category))}
            className="flex items-center justify-between w-full px-2 py-1 rounded-md"
          >
            <p className="flex items-center gap-1 font-semibold font-body text-slate-600">
              <span
                className="grid w-6 h-6 text-lg bg-white rounded-full place-content-center pt-0.5 text-white"
                style={{
                  backgroundColor: `rgba(${categoriesColors[category]}, 1)`,
                }}
              >
                {entries.length}
              </span>{' '}
              <span
                className="text-lg capitalize font-display"
                style={{
                  color: `rgb(${categoriesColors[category]})`,
                }}
              >
                {category}
              </span>{' '}
              events
            </p>
            <span
              className="flex items-center justify-center transition-all rounded-full w-7 h-7"
              style={{
                transform: openCategory === category ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <ArrowDown
                size={16}
                style={{
                  color: `rgba(${categoriesColors[category]}, 0.7)`,
                }}
              />
            </span>
          </button>
          {openCategory === category && (
            <div
              className="pb-2 mt-2 overflow-y-auto max-h-24 custom-scrollbar"
              style={{
                color: `rgb(${categoriesColors[category]})`,
              }}
            >
              <ul className="pl-2 list-disc list-inside font-body text-slate-800">
                {entries.map((entry) => (
                  <li key={entry.id}>{entry.text}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
