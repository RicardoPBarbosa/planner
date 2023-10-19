import { Suspense, lazy } from 'react'

import localDayjs from 'lib/dayjs'
import useYearPlanner from 'hooks/useYearPlanner'
const MonthItem = lazy(() => import('./MonthItem'))

function Skeleton() {
  return (
    <div className="h-[364px] rounded-br-md mt-4 w-full md:w-[320px] mx-4 sm:mx-16 md:mx-0 lg:w-[364px] bg-slate-100 animate-pulse" />
  )
}

export default function Months() {
  const { data } = useYearPlanner()
  const entries = data?.entries ?? []

  return (
    <>
      {localDayjs.months().map((monthName, monthNumber) => (
        <Suspense key={monthName} fallback={<Skeleton />}>
          <MonthItem
            number={monthNumber}
            name={monthName}
            monthEntries={entries.filter((entry) => entry.date.month() === monthNumber)}
          />
        </Suspense>
      ))}
    </>
  )
}
