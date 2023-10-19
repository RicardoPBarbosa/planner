import { Redo, Undo, X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useMemo, useState } from 'react'

import localDayjs from 'lib/dayjs'
import type { YearEntry } from '@types'
import useYearPlanner from 'hooks/useYearPlanner'
import { buildEntriesByDayOfMonth } from 'helpers/entries'
import EntryItem from './EntryItem'

type DayEventsProps = {
  label: string
  entries: YearEntry[]
  deleteRequest?: string
  setDeleteRequest: (id?: string) => void
}

function DayEvents({ label, entries, deleteRequest, setDeleteRequest }: DayEventsProps) {
  return (
    <div className="pt-2">
      <span className="text-lg tracking-wide font-display text-slate-500">{label}</span>
      <div className="flex flex-col w-full gap-1">
        {entries.map((entry) => (
          <EntryItem
            key={entry.id}
            entry={entry}
            deleteRequest={deleteRequest}
            setDeleteRequest={setDeleteRequest}
          />
        ))}
      </div>
    </div>
  )
}

type Props = {
  number: number
  name: string
  entries: Record<number, YearEntry[]>
}

export default function MonthEventsDialog({ number, name, entries }: Props) {
  const { year, data } = useYearPlanner()
  const allEntries = data?.entries ?? []
  const [open, setOpen] = useState(false)
  const [deleteRequest, setDeleteRequest] = useState<string>()
  const [selectedMonth, setSelectedMonth] = useState(localDayjs())
  const selectedMonthEntries = useMemo(() => {
    if (selectedMonth.month() === number) {
      return entries
    }
    return buildEntriesByDayOfMonth(
      allEntries.filter((entry) => entry.date.month() === selectedMonth.month())
    )
  }, [allEntries, selectedMonth, name, entries])

  useEffect(() => {
    if (!open) {
      setDeleteRequest(undefined)
    }
    setSelectedMonth(localDayjs(new Date(year, number, 1)))
  }, [open, year, number])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="relative flex px-2 py-1 -mt-6 -ml-2 text-lg tracking-wide uppercase transition-colors md:-mt-4 md:py-0 w-min bg-secondary text-tertiary font-display rounded-tl-md rounded-tr-xl rounded-bl-xl rounded-br-md hover:bg-primary">
          {name}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-slate-900/30 z-40 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[95vh] w-[95vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-tl-md rounded-tr-xl rounded-bl-xl rounded-br-md overflow-y-auto shadow-lg bg-white p-5 focus:outline-none z-50 border-2 border-tertiary">
          <Dialog.Title asChild>
            <div className="w-full pt-3 text-center font-display">
              <h2 className="text-lg leading-none text-primary">{year}</h2>
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() =>
                    setSelectedMonth((prev) => {
                      if (prev.month() === 0) return prev
                      return prev.subtract(1, 'month')
                    })
                  }
                  className="grid w-8 h-8 transition-colors rounded-md place-content-center hover:text-zinc-400 text-zinc-500"
                >
                  <Undo size={20} />
                </button>
                <h3 className="text-3xl text-tertiary">{selectedMonth.format('MMMM')}</h3>
                <button
                  onClick={() =>
                    setSelectedMonth((prev) => {
                      if (prev.month() === 11) return prev
                      return prev.add(1, 'month')
                    })
                  }
                  className="grid w-8 h-8 transition-colors rounded-md place-content-center hover:text-zinc-400 text-zinc-500"
                >
                  <Redo size={20} />
                </button>
              </div>
            </div>
          </Dialog.Title>
          <Dialog.Description asChild>
            {Object.keys(selectedMonthEntries).length === 0 ? (
              <p className="px-3 py-2 mt-3 text-sm font-medium tracking-wide text-center rounded-md font-body text-slate-500 bg-slate-100">
                No entries for this month
              </p>
            ) : (
              <>
                <div className="relative z-10 h-8 -mb-8 bg-gradient-to-b from-white" />
                <div className="pt-4 overflow-y-auto pb-7 max-h-72 no-scrollbar">
                  {Object.entries(selectedMonthEntries).map(([day, dayEntries]) => (
                    <DayEvents
                      key={`${selectedMonth.format('MMM')}-${day}`}
                      label={`${selectedMonth.format('MMM')}, ${day}`}
                      entries={dayEntries}
                      deleteRequest={deleteRequest}
                      setDeleteRequest={setDeleteRequest}
                    />
                  ))}
                </div>
                <div className="relative z-10 h-8 -mt-8 bg-gradient-to-t from-white" />
              </>
            )}
          </Dialog.Description>
          <Dialog.Close asChild>
            <button
              className="absolute flex items-center justify-center w-8 h-8 transition-all top-2 right-2 hover:opacity-60"
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
