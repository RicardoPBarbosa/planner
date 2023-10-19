import { Redo } from 'lucide-react'

import Goal from 'components/Goal'
import Title from 'components/Title'
import type { TopTaskPositions } from '@types'
import useWeekPlanner from 'hooks/useWeekPlanner'

const availablePositions: TopTaskPositions[] = [1, 2, 3]

export default function Top3Goals() {
  const { data, update } = useWeekPlanner()

  function handleUpdate(position: TopTaskPositions, value: boolean | string) {
    let topThree = data?.topThree || []
    if (!data?.topThree.find((task) => task.position === position)) {
      topThree.push({
        position,
        status: typeof value === 'boolean' ? value : false,
        text: typeof value === 'string' ? value : '',
      })
    } else {
      topThree = topThree.map((tli) => {
        if (tli.position === position) {
          return {
            ...tli,
            ...(typeof value === 'boolean' ? { status: value } : { text: value }),
          }
        }
        return tli
      })
    }

    update({ topThree })
  }

  return (
    <div className="flex-1">
      <div className="relative w-min -z-10">
        <Title className="transform -rotate-2">TOP 3 GOALS for the week</Title>
        <Redo size={24} className="absolute transform rotate-90 text-tertiary top-3 -right-5" />
      </div>
      <div className="flex flex-col gap-3 mt-3">
        {availablePositions.map((taskNumber) => (
          <Goal
            key={`toptask-${taskNumber}`}
            number={taskNumber as TopTaskPositions}
            task={data?.topThree?.find((task) => task.position === taskNumber)}
            updateCheckbox={(value) => handleUpdate(taskNumber, value)}
            updateText={(value) => handleUpdate(taskNumber, value)}
          />
        ))}
      </div>
    </div>
  )
}
