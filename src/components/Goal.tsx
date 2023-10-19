import { useEffect, useState } from 'react'

import type { TopTask, TopTaskPositions, TopYearTask, TopYearTaskPositions } from '@types'
import GoalNumber from './GoalNumber'

type GoalProps = {
  updateText: (value: string) => void
  updateCheckbox?: (value: boolean) => void
  disabled?: boolean
} & (
  | {
      number: TopTaskPositions
      task?: TopTask
    }
  | {
      number: TopYearTaskPositions
      task?: TopYearTask
    }
)

export default function Goal({ number, task, updateCheckbox, updateText, disabled }: GoalProps) {
  const [goalText, setGoalText] = useState<string>(task?.text || '')

  useEffect(() => {
    setGoalText(task?.text || '')
  }, [task])

  return (
    <div className="flex items-end mr-1 space-x-2 xs:mr-0">
      <GoalNumber number={number} />
      <input
        type="text"
        disabled={disabled}
        className="flex-1 w-full px-1 py-1 border-t-0 border-b-2 border-zinc-300 border-x-0 focus:border-secondary focus:ring-transparent"
        onChange={({ target: { value } }) => setGoalText(value)}
        onBlur={({ target: { value } }) => updateText(value)}
        value={goalText}
      />
      {updateCheckbox && (
        <input
          type="checkbox"
          disabled={disabled}
          className="border-2 rounded-br-lg w-7 h-7 text-secondary focus:ring-primary border-tertiary rounded-tl-md rounded-tr-md rounded-bl-md"
          onChange={({ target: { checked } }) => updateCheckbox(checked)}
          checked={!!task?.status}
        />
      )}
    </div>
  )
}
