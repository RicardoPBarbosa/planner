import { useQuery } from '@tanstack/react-query'

import { moods } from 'constants'
import { ModalViews } from '@types'
import { yearlyPlanner } from 'database'
import { useAuthUser } from 'hooks/useAuthUser'
import useYearPlanner from 'hooks/useYearPlanner'
import { ExternalLink } from 'lucide-react'

type Props = {
  setCurrentView: (view: ModalViews, year?: number) => void
  close: () => void
}

export default function HistoryView({ close, setCurrentView }: Props) {
  const user = useAuthUser()
  const { year, setYear } = useYearPlanner()
  const { data, isLoading } = useQuery(['all-years'], () => yearlyPlanner.getAll(user?.uid), {
    enabled: !!user?.uid,
  })

  const handleOpenYear = (year: number) => {
    setYear(year)
    close()
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="relative z-10 h-8 -mb-8 bg-gradient-to-b from-white" />
      <div className="py-8 overflow-y-auto max-h-72 no-scrollbar">
        {data?.map((yearPlanner) => (
          <div
            key={yearPlanner.year}
            className="flex items-center justify-between gap-2 mb-2 rounded-lg bg-gray-50 h-14 sm:gap-4"
          >
            <button
              onClick={() => (year !== yearPlanner.year ? handleOpenYear(yearPlanner.year) : {})}
              className={`flex relative flex-1 overflow-hidden items-center justify-between h-full pl-2 pr-4 space-x-8 rounded-lg ring-inset ring-secondary ${
                year === yearPlanner.year ? 'opacity-50 grayscale cursor-default' : 'group'
              }`}
            >
              <b className="text-xl transition-colors text-tertiary group-hover:text-primary font-display">
                {yearPlanner.year}
              </b>
              <div className="w-6">
                {yearPlanner.mood !== null && (
                  <span className="emoji-splash">{moods()[yearPlanner.mood]}</span>
                )}
              </div>
              <span className="absolute top-0 right-0 flex items-center justify-end w-full h-full pr-4 transition-opacity opacity-0 bg-gradient-to-l from-gray-50 to-transparent group-hover:opacity-100 text-slate-700">
                <ExternalLink size={20} />
              </span>
            </button>
            <button
              onClick={() => setCurrentView(ModalViews.RETROSPECTIVE, yearPlanner.year)}
              className="h-full px-2 text-sm font-semibold transition-all rounded-lg text-slate-500 font-body hover:text-slate-900 hover:underline"
            >
              Retrospective
            </button>
            <button
              onClick={() => setCurrentView(ModalViews.YEARREVIEW, yearPlanner.year)}
              className="px-4 pt-2.5 pb-2 font-semibold leading-none transition-all bg-primary text-white font-body mr-2 rounded-tl-lg rounded-br-lg rounded-tr-md rounded-bl-md hover:bg-secondary"
            >
              Review
            </button>
          </div>
        ))}
        {!data?.length && <p className="text-xl text-gray-800 font-display">No entries found</p>}
      </div>
      <div className="relative z-10 h-8 -mt-8 bg-gradient-to-t from-white" />
    </>
  )
}
