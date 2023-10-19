import { useState, useEffect } from 'react'

import { moods } from 'constants'
import Mood from 'components/Mood'
import Title from 'components/Title'
import useWeekPlanner from 'hooks/useWeekPlanner'

export default function WeekMood() {
  const { data, update } = useWeekPlanner()
  const [selectedMood, setSelectedMood] = useState(data?.mood)

  useEffect(() => {
    setSelectedMood(data?.mood)
  }, [data])

  return (
    <div className="flex flex-col items-center justify-center flex-1 space-y-8 lg:justify-start md:space-x-6 md:space-y-0 md:flex-row">
      <Title>This week was...</Title>
      <div className="flex justify-around space-x-6">
        {Object.entries(moods({ className: 'w-10 h-10 md:w-8 md:h-8 lg:w-10 lg:h-10' })).map(
          ([moodType, element]) => (
            <Mood
              key={moodType}
              onClick={() => update({ mood: Number(moodType) })}
              active={selectedMood === Number(moodType)}
            >
              {element}
            </Mood>
          )
        )}
      </div>
    </div>
  )
}
