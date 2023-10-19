import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { PartialWithFieldValue } from 'firebase/firestore'

import { weeklyPlanner } from 'database'
import { setWeekQueryKey } from 'helpers/date'
import { useAuthUser } from 'hooks/useAuthUser'
import useWeekPlanner from 'hooks/useWeekPlanner'
import type { TopTask, TopTaskPositions, Week, WeekPlanner } from '@types'
import Goal from '../../../components/Goal'

type ContentProps = {
  loading: boolean
  submit: (goals: TopTask[]) => void
  data: WeekPlanner | null | undefined
}

function Content({ loading, submit, data }: ContentProps) {
  const [goals, setGoals] = useState<TopTask[]>([])

  useEffect(() => {
    if (data?.topThree) setGoals(data.topThree)
  }, [data])

  function handleTextChange(taskNumber: TopTaskPositions, text: string) {
    const goalIndex = goals.findIndex((g) => g.position === taskNumber)
    const clone = [...goals]

    if (goalIndex > -1) {
      clone[goalIndex].text = text
    } else {
      clone.push({ position: taskNumber, text, status: false })
    }
    return setGoals(clone)
  }

  return (
    <>
      <div className="my-5">
        {[1, 2, 3].map((taskNumber) => (
          <Goal
            key={`next-toptask-${taskNumber}`}
            task={goals[taskNumber - 1]}
            disabled={loading}
            number={taskNumber as TopTaskPositions}
            updateText={(value) => handleTextChange(taskNumber as TopTaskPositions, value)}
          />
        ))}
      </div>
      <div className="flex items-center justify-between w-full pt-3">
        <Dialog.Close asChild>
          <button
            className="px-3 py-1 text-lg tracking-wide transition-all border-2 rounded-md border-tertiary disabled:border-slate-400 disabled:text-slate-400 font-display text-tertiary hover:bg-primary hover:bg-opacity-20"
            disabled={loading}
          >
            X Cancel
          </button>
        </Dialog.Close>
        <button
          className="h-10 px-3 py-1 text-lg tracking-wide transition-all rounded-md bg-secondary font-display disabled:bg-slate-200 disabled:text-slate-500 text-tertiary hover:bg-primary"
          onClick={() => submit(goals)}
          disabled={loading}
        >
          Submit -&gt;
        </button>
      </div>
    </>
  )
}

export default function PrepareNextWeek() {
  const user = useAuthUser()
  const { week } = useWeekPlanner()
  const [open, setOpen] = useState(false)
  const nextWeek = [
    week[0].add(1, 'week').startOf('day'),
    week[1].add(1, 'week').endOf('day'),
  ] as Week
  const {
    data,
    refetch: refetchNextWeek,
    isLoading,
  } = useQuery(
    ['next-week', ...setWeekQueryKey(nextWeek)],
    () => weeklyPlanner.get(nextWeek, user?.uid),
    {
      enabled: !!user?.uid,
    }
  )
  const { mutateAsync: upsertWeek, isLoading: loadingAddWeek } = useMutation({
    mutationKey: ['upsert-week', ...setWeekQueryKey(nextWeek)],
    mutationFn: (payload: PartialWithFieldValue<WeekPlanner>) =>
      weeklyPlanner.upsert(nextWeek, payload, user?.uid),
    onSuccess: () => {
      refetchNextWeek()
    },
  })

  async function submit(goals: TopTask[]) {
    await upsertWeek({
      topThree: goals,
    })
    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="w-full rounded-br-sm group hover:bg-gradient-to-r from-secondary to-primary">
          <p className="text-lg text-center text-transparent transition-all font-display bg-clip-text bg-gradient-to-r from-secondary to-primary group-hover:text-white">
            Prepare next week -&gt;
          </p>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-slate-900/30 z-40 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-tl-md rounded-tr-xl rounded-bl-xl rounded-br-md shadow-lg bg-white p-5 focus:outline-none z-50 border-2 border-tertiary">
          <Dialog.Title className="text-2xl pr-7 font-display text-primary">
            {"Choose next weeks' goals"}
          </Dialog.Title>
          <Dialog.Description asChild>
            <Content data={data} loading={isLoading || loadingAddWeek} submit={submit} />
          </Dialog.Description>
          <Dialog.Close asChild>
            <button
              className="absolute flex items-center justify-center w-8 h-8 transition-all top-5 right-4 hover:opacity-60"
              aria-label="Close"
            >
              <X size={22} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
