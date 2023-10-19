import { useEffect, useState } from 'react'

import useDayPlanner from 'hooks/useDayPlanner'

export default function PositiveAffirmation() {
  const { data, update } = useDayPlanner()
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(data?.positiveAffirmation || '')
  }, [data])

  return (
    <div
      id="affirmation"
      className="bg-[#ECFFB9] px-2 pt-3 pb-5 rounded-tl-sm rounded-tr-xl rounded-br-md rounded-bl-xl"
    >
      <div className="font-display text-tertiary">Write a positive affirmation:</div>
      <textarea
        className="w-full px-1 bg-transparent border-none focus-within:ring-0 line-bg"
        rows={3}
        value={value}
        onChange={({ target: { value } }) => setValue(value)}
        onBlur={({ target: { value } }) =>
          value !== data?.positiveAffirmation &&
          update({
            positiveAffirmation: value,
          })
        }
      />
    </div>
  )
}
