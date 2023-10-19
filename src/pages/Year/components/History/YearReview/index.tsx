import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { moods } from 'constants'
import { yearlyPlanner } from 'database'
import { useAuthUser } from 'hooks/useAuthUser'
import type { EntryCategory, YearEntry } from '@types'
import ReviewNumberWrapper from 'components/ReviewNumberWrapper'
import EventsByCategory from './EventsByCategory'

type Props = {
  back: () => void
  reviewYear: number
}

export default function YearReview({ back, reviewYear }: Props) {
  const user = useAuthUser()
  const { data: allData, isLoading } = useQuery(
    ['all-years'],
    () => yearlyPlanner.getAll(user?.uid),
    {
      enabled: !!user?.uid,
    }
  )
  const data = useMemo(() => {
    return allData?.find((item) => item.year === reviewYear)
  }, [allData, reviewYear])

  const entriesByCategory = useMemo(() => {
    const categoriesWithEntries: Record<string, YearEntry[]> = {}
    data?.entries.forEach((item) => {
      if (categoriesWithEntries[item.category]) {
        if (!categoriesWithEntries[item.category].some((e) => e.text === item.text)) {
          categoriesWithEntries[item.category].push(item)
        }
      } else {
        categoriesWithEntries[item.category] = [item]
      }
    })
    return categoriesWithEntries
  }, [data])

  const goalsTracker = useMemo(() => {
    const validGoals = data?.topFive.filter((goal) => !!goal.text.trim().length) || []
    const total = validGoals.length
    const achieved = validGoals.filter((item) => item.status).length
    const percentage = total > 0 ? Number(((achieved / total) * 100).toFixed(1)) : 0

    return {
      achieved,
      total,
      percentage,
    }
  }, [data])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="w-full mt-1 mb-3">
        <h2 className="text-xl font-display text-tertiary">Events by category</h2>
        <EventsByCategory
          events={Object.entries(entriesByCategory) as [EntryCategory, YearEntry[]][]}
        />
        <h2 className="text-xl font-display text-tertiary">Year Goals</h2>
        <div className="flex gap-2 mb-5">
          <div
            className="w-16 h-16 bg-gray-100 rounded-full"
            style={{
              background: `conic-gradient(#5AC596 0% ${goalsTracker.percentage}%, #F3F4F6 ${goalsTracker.percentage}% 100%)`,
            }}
          />
          <div className="flex flex-col justify-between py-1 font-body">
            <p>
              Achieved <ReviewNumberWrapper>{goalsTracker.achieved}</ReviewNumberWrapper> of a total
              of <ReviewNumberWrapper>{goalsTracker.total}</ReviewNumberWrapper> goals
            </p>
            <p className="text-tertiary">
              <ReviewNumberWrapper>{goalsTracker.percentage}% success rate</ReviewNumberWrapper>
            </p>
          </div>
        </div>
        {data?.mood && (
          <div className="flex justify-between flex-1 w-full p-4 pr-2 mx-auto rounded-tl-lg rounded-br-lg sm:w-1/2 bg-opacity-10 rounded-bl-2xl rounded-tr-2xl bg-secondary">
            <span className="text-lg font-display text-primary">This year was...</span>
            <span className="emoji-splash pt-1 [&:before]:-top-4">{moods()[data.mood]}</span>
          </div>
        )}
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
