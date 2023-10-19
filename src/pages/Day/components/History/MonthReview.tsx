import { useMemo } from 'react'
import type { Dayjs } from 'dayjs'
import { CornerDownRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { moods } from 'constants'
import { dailyPlanner } from 'database'
import { useAuthUser } from 'hooks/useAuthUser'
import { HoursOfSleepEnum, MoodType } from '@types'
import type { ToDoItem, RoutineItem } from '@types'
import ReviewNumberWrapper from 'components/ReviewNumberWrapper'

function isValidTodo(todo: ToDoItem) {
  return todo.text.trim().length > 0
}

type Props = {
  back: () => void
  reviewMonth: Dayjs
}

export default function MonthReview({ back, reviewMonth }: Props) {
  const user = useAuthUser()
  const { data: allData, isLoading } = useQuery(
    ['all-days'],
    () => dailyPlanner.getAll(user?.uid),
    {
      enabled: !!user?.uid,
    }
  )
  const data = useMemo(() => {
    return allData?.filter((item) => item.day.isSame(reviewMonth, 'month'))
  }, [allData, reviewMonth])

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

  const dailyTodosCounter = useMemo((): { achieved: number; total: number; percentage: number } => {
    const total =
      data?.reduce((prev, curr) => prev + curr.toDoList.filter(isValidTodo).length, 0) || 0
    const achieved =
      data?.reduce(
        (prev, curr) =>
          prev + curr.toDoList.filter((task) => isValidTodo(task) && !!task.status).length,
        0
      ) || 0
    const percentage = total > 0 ? Number(((achieved / total) * 100).toFixed(1)) : 0

    return {
      achieved,
      total,
      percentage,
    }
  }, [data])

  const totalDaysTracked = data?.length || 0

  const morningRoutineCounter = useMemo(() => {
    const counter: (RoutineItem & { count: number; percentage: number })[] = []
    data?.forEach(({ routine }) => {
      routine.forEach((routineItem) => {
        const existing = counter.find((item) => item.text === routineItem.text)
        const routineDone = !!routineItem.status
        if (existing) {
          existing.count += routineDone ? 1 : 0
          existing.percentage = Number(
            ((existing.count / (totalDaysTracked || 1)) * 100).toFixed(1)
          )
        } else {
          const count = routineDone ? 1 : 0
          counter.push({
            ...routineItem,
            count,
            percentage: Number(((count / (totalDaysTracked || 1)) * 100).toFixed(1)),
          })
        }
      })
    })
    return counter
  }, [data])

  const hoursOfSleepCounter = useMemo(() => {
    const hoursEnum = Object.values(HoursOfSleepEnum)
    const counter: { [key: string]: number } = {}
    hoursEnum.forEach((hour) => {
      counter[hour] = 0
    })
    data
      ?.filter((i) => !!i.sleepHours)
      .forEach((item) => {
        if (item.sleepHours) {
          counter[item.sleepHours] += 1
        }
      })
    return counter
  }, [data])

  const litersOfWaterCounter = useMemo(() => {
    return data?.reduce((prev, curr) => prev + curr.litersOfWater, 0) || 0
  }, [data])
  const oneLiterOrMoreCounter = useMemo(() => {
    return data?.filter((item) => item.litersOfWater >= 1).length || 0
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
        <h2 className="text-xl font-display text-tertiary">Daily Todos</h2>
        <div className="flex gap-2 mb-4">
          <div
            className="w-16 h-16 bg-gray-100 rounded-full"
            style={{
              background: `conic-gradient(#5AC596 0% ${dailyTodosCounter.percentage}%, #F3F4F6 ${dailyTodosCounter.percentage}% 100%)`,
            }}
          />
          <div className="flex flex-col justify-between py-1 font-body">
            <p>
              Achieved <ReviewNumberWrapper>{dailyTodosCounter.achieved}</ReviewNumberWrapper> of a
              total of <ReviewNumberWrapper>{dailyTodosCounter.total}</ReviewNumberWrapper> todos
            </p>
            <p className="text-tertiary">
              <ReviewNumberWrapper>
                {dailyTodosCounter.percentage}% success rate
              </ReviewNumberWrapper>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-display">
            <span className="text-tertiary">Tracker </span>
            <small className="font-body">
              (for a total of <ReviewNumberWrapper>{totalDaysTracked}</ReviewNumberWrapper> days)
            </small>
          </h2>
          {morningRoutineCounter
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <div
                key={item.order}
                className="flex items-center justify-between px-2 py-1 rounded-md font-body bg-slate-50"
              >
                <span className="text-lg">{item.text}</span>
                <div className="flex items-center gap-2">
                  <span className={item.percentage < 50 ? 'text-red-400' : 'text-green-600'}>
                    {item.percentage} %
                  </span>
                  <ReviewNumberWrapper>{item.count}</ReviewNumberWrapper>
                </div>
              </div>
            ))}
          <div className="mt-2">
            <h2 className="text-tertiary font-display">Hours of sleep</h2>
            <div className="flex flex-row flex-wrap justify-around gap-2">
              {Object.entries(hoursOfSleepCounter).map(([hour, count]) => (
                <div
                  key={hour}
                  className="flex items-center justify-between flex-1 w-full gap-2 p-4 text-white rounded-lg bg-tertiary font-body"
                >
                  <span className="text-xl w-max">{hour}</span>
                  <span className="px-2 py-1 rounded-md bg-white/20">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-2 font-body">
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
