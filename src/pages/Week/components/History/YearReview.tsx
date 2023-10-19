import { useMemo } from 'react'
import { CornerDownRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { moods } from 'constants'
import { MoodType } from '@types'
import localDayjs from 'lib/dayjs'
import { weeklyPlanner } from 'database'
import { useAuthUser } from 'hooks/useAuthUser'
import ReviewNumberWrapper from 'components/ReviewNumberWrapper'

type Props = {
  back: () => void
  reviewYear: number
}

export default function YearReview({ back, reviewYear }: Props) {
  const user = useAuthUser()
  const { data: allData, isLoading } = useQuery(
    ['all-weeks'],
    () => weeklyPlanner.getAll(user?.uid),
    {
      enabled: !!user?.uid,
    }
  )
  const data = useMemo(() => {
    return allData?.filter((item) => localDayjs(item.startDate).year() === reviewYear)
  }, [allData, reviewYear])

  const moodCounter = useMemo(() => {
    const moodsWithCount = {
      [MoodType.GREAT]: 0,
      [MoodType.COOL]: 0,
      [MoodType.OK]: 0,
      [MoodType.SAD]: 0,
      [MoodType.WASTED]: 0,
    }
    data?.forEach((item) => {
      if (item.mood !== null) {
        moodsWithCount[item.mood] = (moodsWithCount[item.mood] || 0) + 1
      }
    })
    return moodsWithCount
  }, [data])

  const weekGoalsCounter = useMemo((): { achieved: number; total: number; percentage: number } => {
    const total = data?.reduce((prev, curr) => prev + curr.topThree.length, 0) || 1
    const achieved =
      data?.reduce(
        (prev, curr) => prev + curr.topThree.filter((task) => !!task.status).length,
        0
      ) || 0
    const percentage = Number(((achieved / total) * 100).toFixed(1))

    return {
      achieved,
      total,
      percentage,
    }
  }, [data])

  const totalDaysTracked = (data?.length || 0) * 7

  const exerciseCounter = useMemo(() => {
    return data?.reduce(
      (prev, curr) => prev + Object.values(curr.tracker.Exercise).filter((val) => !!val).length,
      0
    )
  }, [data])

  const healthyEatingCounter = useMemo(() => {
    return data?.reduce(
      (prev, curr) =>
        prev + Object.values(curr.tracker['Healthy eating']).filter((val) => !!val).length,
      0
    )
  }, [data])

  const litersOfWaterCounter = useMemo(() => {
    return (
      data?.reduce(
        (prev, curr) =>
          prev + Object.values(curr.tracker['Liters of water']).reduce((p, c) => p + c, 0),
        0
      ) || 0
    )
  }, [data])

  const oneLiterOrMoreCounter = useMemo(() => {
    return data?.reduce(
      (prev, curr) =>
        prev + Object.values(curr.tracker['Liters of water']).filter((val) => val >= 1).length,
      0
    )
  }, [data])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="w-full mt-1 mb-3">
        <h2 className="mb-1 text-xl font-display text-tertiary">Moods</h2>
        <div className="flex flex-row flex-wrap gap-2 mb-4">
          {Object.entries(moodCounter).map(([mood, count]) => (
            <div
              key={mood}
              className="flex justify-between flex-1 w-full p-4 pr-2 rounded-tl-lg rounded-br-lg bg-opacity-10 rounded-bl-2xl rounded-tr-2xl bg-secondary"
            >
              <span className="emoji-splash">{moods()[mood as unknown as MoodType]}</span>
              <span className="ml-6 text-xl font-semibold font-body text-tertiary">{count}</span>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-display text-tertiary">Week Goals</h2>
        <div className="flex gap-2 mb-4">
          <div
            className="w-16 h-16 bg-gray-100 rounded-full"
            style={{
              background: `conic-gradient(#5AC596 0% ${weekGoalsCounter.percentage}%, #F3F4F6 ${weekGoalsCounter.percentage}% 100%)`,
            }}
          />
          <div className="flex flex-col justify-between py-1 font-body">
            <p>
              Achieved <ReviewNumberWrapper>{weekGoalsCounter.achieved}</ReviewNumberWrapper> of a
              total of <ReviewNumberWrapper>{weekGoalsCounter.total}</ReviewNumberWrapper> goals
            </p>
            <p className="text-tertiary">
              <ReviewNumberWrapper>{weekGoalsCounter.percentage}% success rate</ReviewNumberWrapper>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-display">
            Health Tracker Stats{' '}
            <small className="font-body">
              (for a total of <ReviewNumberWrapper>{totalDaysTracked}</ReviewNumberWrapper> days)
            </small>
          </h2>
          <p className="font-body">
            Exercised <ReviewNumberWrapper>{exerciseCounter}</ReviewNumberWrapper> times
          </p>
          <p className="font-body">
            Ate healthy <ReviewNumberWrapper>{healthyEatingCounter}</ReviewNumberWrapper> times
          </p>
          <p className="font-body">
            Drank{' '}
            <ReviewNumberWrapper>{Number(litersOfWaterCounter.toFixed(1))}</ReviewNumberWrapper>{' '}
            liters of water
            <br />
            <span className="flex flex-row flex-wrap items-center gap-1">
              <CornerDownRight size={14} /> and reached the{' '}
              <b>
                <ReviewNumberWrapper>
                  1L<small>+</small> / day
                </ReviewNumberWrapper>
              </b>
              mark <ReviewNumberWrapper>{oneLiterOrMoreCounter}</ReviewNumberWrapper> times
            </span>
          </p>
        </div>
      </div>
      <button
        className="px-3 py-1 text-lg tracking-wide transition-all border-2 rounded-md border-tertiary font-display text-tertiary hover:bg-primary hover:bg-opacity-20"
        onClick={back}
      >
        &lt;- Go back
      </button>
    </>
  )
}
