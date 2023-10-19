import { Redo } from 'lucide-react'

import Goal from 'components/Goal'
import Title from 'components/Title'
import useYearPlanner from 'hooks/useYearPlanner'
import type { TopYearTaskPositions } from '@types'

export default function Top5Goals() {
  const { data, update } = useYearPlanner()

  return (
    <div className="flex-1">
      <div className="relative w-min -z-10">
        <Title className="transform -rotate-2">TOP 5 GOALS for the year</Title>
        <Redo size={24} className="absolute transform rotate-90 text-tertiary top-3 -right-5" />
      </div>
      <div className="flex flex-col gap-3 mt-3">
        {[1, 2, 3, 4, 5].map((taskNumber) => (
          <Goal
            key={`toptask-${taskNumber}`}
            number={taskNumber as TopYearTaskPositions}
            task={data?.topFive?.find((task) => task.position === taskNumber)}
            updateCheckbox={(value) =>
              update({
                topFive: data?.topFive?.length
                  ? data?.topFive.map((tli, idx) => {
                      if (idx === taskNumber - 1) {
                        return {
                          ...tli,
                          status: value,
                        }
                      }
                      return tli
                    })
                  : [{ status: true, position: taskNumber as TopYearTaskPositions, text: '' }],
              })
            }
            updateText={(value) =>
              value !== data?.topFive[taskNumber - 1]?.text &&
              update({
                topFive: data?.topFive?.[taskNumber - 1]
                  ? data?.topFive.map((tli, idx) => {
                      if (idx === taskNumber - 1) {
                        return {
                          ...tli,
                          text: value,
                        }
                      }
                      return tli
                    })
                  : [
                      ...(data?.topFive || []),
                      { status: false, position: taskNumber as TopYearTaskPositions, text: value },
                    ],
              })
            }
          />
        ))}
      </div>
    </div>
  )
}
