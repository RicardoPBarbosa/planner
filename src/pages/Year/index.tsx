import { Link } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { Suspense, lazy, useEffect } from 'react'
import { Redo, Settings2, Undo } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { yearlyPlanner } from 'database'
import { useAuthUser } from 'hooks/useAuthUser'
import useYearPlanner from 'hooks/useYearPlanner'
import LogoWithTitle from 'components/LogoWithTitle'
import Months from './components/Months'
const History = lazy(() => import('./components/History'))
const YearMood = lazy(() => import('./components/YearMood'))
const Top5Goals = lazy(() => import('./components/Top5Goals'))

export default function Year() {
  const user = useAuthUser()
  const queryClient = useQueryClient()
  const { year, setYear } = useYearPlanner()
  const { mutateAsync: addNewYearEntryIfNotExistent } = useMutation({
    mutationKey: ['add-year', year],
    mutationFn: ({ selectedYear }: { selectedYear: number }) =>
      yearlyPlanner.set(user?.uid, selectedYear),
    onSuccess: () => {
      queryClient.refetchQueries(['year', year])
    },
  })

  useEffect(() => {
    if (user?.uid) {
      addNewYearEntryIfNotExistent({ selectedYear: year })
    }
  }, [user])

  async function setNewYear(newYear: number) {
    await addNewYearEntryIfNotExistent({ selectedYear: newYear })
    setYear(newYear)
  }

  function YearNumber({ is }: { is: 'mobile' | 'desktop' }) {
    const styles =
      is === 'mobile' ? 'absolute right-0 flex py-1 sm:hidden -bottom-9' : 'hidden sm:flex'

    return (
      <span
        className={twMerge(
          'items-center px-3 text-xl font-body bg-tertiary font-semibold leading-tight text-white rounded-md',
          styles
        )}
      >
        {year}
      </span>
    )
  }

  return (
    <div className="px-1 pt-1 pb-24 mx-auto sm:pt-3 sm:px-4 max-w-screen-2xl">
      <div className="flex flex-wrap justify-center gap-y-6 gap-x-4">
        <header className="flex flex-col justify-between flex-grow w-full space-x-1 space-y-1 overflow-hidden md:w-auto sm:flex-row min-w-[90%] lg:min-w-[40%] md:space-x-5 lg:flex-nowrap">
          <div className="relative flex items-center gap-3 sm:gap-5 sm:flex-col">
            <LogoWithTitle type="yearly" />
            <div className="flex items-center justify-between flex-1 w-full gap-5 pr-1 md:justify-normal sm:flex-col">
              <div className="flex justify-center gap-1 sm:w-full sm:gap-2">
                <button
                  onClick={() => setNewYear(year - 1)}
                  className="grid flex-1 w-10 h-10 transition-colors rounded-lg place-content-center bg-zinc-50 text-zinc-500 hover:bg-zinc-200"
                >
                  <Undo size={20} />
                </button>
                <YearNumber is="desktop" />
                <button
                  onClick={() => setNewYear(year + 1)}
                  className="grid flex-1 w-10 h-10 transition-colors rounded-lg place-content-center bg-zinc-50 text-zinc-500 hover:bg-zinc-200"
                >
                  <Redo size={20} />
                </button>
              </div>
              <div className="flex gap-2 sm:flex-1 sm:w-full lg:flex-col">
                <Suspense>
                  <History />
                </Suspense>
                <Link
                  to="/settings"
                  className="grid flex-none sm:flex-1 w-12 h-12 max-w-[190px] grid-flow-col gap-3 transition-colors rounded-lg lg:w-full text-opacity-80 place-content-center bg-primary/10 text-primary hover:bg-primary/20"
                >
                  <Settings2 />
                  <span className="hidden font-semibold leading-[initial] lg:block font-body">
                    Settings
                  </span>
                </Link>
              </div>
            </div>
            <YearNumber is="mobile" />
          </div>
          <Suspense>
            <Top5Goals />
          </Suspense>
        </header>
        <Months />
      </div>
      <footer className="flex flex-wrap items-center justify-around mt-12 mb-5 gap-9">
        <Suspense>
          <YearMood />
        </Suspense>
      </footer>
    </div>
  )
}
