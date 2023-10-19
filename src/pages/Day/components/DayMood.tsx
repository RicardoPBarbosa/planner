import Mood from 'components/Mood'
import { moods } from 'constants'
import useDayPlanner from 'hooks/useDayPlanner'

export default function DayMood() {
  const { data, update } = useDayPlanner()

  return (
    <div
      id="mood"
      className="relative px-2 mt-3 border-2 rounded-tl-lg py-7 rounded-bl-xl rounded-br-md rounded-tr-xl border-primary h-fit"
    >
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-tl-lg rounded-br-lg rounded-bl-md rounded-tr-xl gradient-to-r text-tertiary w-max font-display leading-[initial] tracking-wider">
        My mood
      </div>
      <div className="flex justify-around">
        {Object.entries(moods({ className: 'w-10 h-10 sm:w-8 sm:h-8 lg:w-10 lg:h-10' })).map(
          ([moodType, element]) => (
            <Mood
              key={moodType}
              onClick={() => update({ mood: Number(moodType) })}
              active={data?.mood === Number(moodType)}
            >
              {element}
            </Mood>
          )
        )}
      </div>
    </div>
  )
}
