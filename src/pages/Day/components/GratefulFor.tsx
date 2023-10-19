import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'

import useDayPlanner from 'hooks/useDayPlanner'

export default function GratefulFor() {
  const { data, update } = useDayPlanner()
  const [values, setValues] = useState<string[]>([])

  useEffect(() => {
    setValues(data?.gratefulFor || [])
  }, [data])

  function handleValueChange(val: string, index: number) {
    setValues((prev) => {
      const newValues = [...prev]
      newValues[index] = val
      return newValues
    })
  }

  return (
    <div
      id="grateful"
      className="relative px-2 py-3 mt-3 border-2 rounded-tr-lg rounded-bl-lg rounded-tl-md rounded-br-xl border-[#C7E671] h-fit"
    >
      <div className="absolute -top-4 -left-0.5 px-3 py-1 rounded-tl-lg rounded-br-xl rounded-bl-md rounded-tr-lg bg-[#C7E671] text-tertiary w-fit font-display leading-[initial] tracking-wider">
        Things I&apos;m grateful for
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`grateful-${i}`} className="flex items-center gap-2">
            <Heart size={18} className="text-secondary" />
            <input
              type="text"
              className="flex-1 w-full px-1 py-1 border-t-0 border-b-2 border-zinc-300 border-x-0 focus:border-secondary focus:ring-transparent"
              value={values[i] || ''}
              onChange={({ target: { value } }) => handleValueChange(value, i)}
              onBlur={({ target: { value } }) =>
                value !== data?.gratefulFor[i] &&
                update({
                  gratefulFor:
                    data?.gratefulFor?.[i] !== undefined
                      ? data?.gratefulFor.map((tli, idx) => {
                          if (idx === i) {
                            return value
                          }
                          return tli
                        })
                      : [...(data?.gratefulFor || []), value],
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  )
}
