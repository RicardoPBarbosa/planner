import type { Dayjs } from 'dayjs'
import { twMerge } from 'tailwind-merge'
import { useEffect, useState } from 'react'
import { CalendarPlus, X } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import type { YearEntry } from '@types'
import { categoriesColors } from 'constants'
import { useMediaQuery } from 'hooks/useMediaQuery'
import AddEvent from './AddEvent'
import EntryItem from './EntryItem'

type Props = {
  isWeekend: boolean
  date?: Dayjs
  entries: YearEntry[]
}

export default function DayItem({ isWeekend, entries, date }: Props) {
  const [open, setOpen] = useState(false)
  const [deleteRequest, setDeleteRequest] = useState<string>()
  const matches = useMediaQuery('(max-width: 395px)')
  const dots = [...new Set(entries.map((entry) => categoriesColors[entry.category]))]
  const widthPercentagePerDot = 60 / dots.length

  useEffect(() => {
    if (!open) {
      setDeleteRequest(undefined)
    }
  }, [open])

  return (
    <td
      className={twMerge(
        'font-medium h-[49px] text-center text-slate-800 font-body whitespace-nowrap',
        isWeekend && 'bg-primary/10'
      )}
    >
      {date && (
        <DropdownMenu.Root open={open} onOpenChange={setOpen}>
          <DropdownMenu.Trigger
            onClick={() => setOpen(true)}
            onPointerDown={(e) => e.preventDefault()}
            asChild
          >
            <button className="flex flex-col items-center justify-center w-full h-full group data-[state=open]:bg-primary rounded-lg">
              <span
                className={twMerge(
                  'grid content-center w-[70%] transition-colors rounded-full h-[70%] md:group-hover:bg-slate-200',
                  isWeekend && 'group-hover:bg-primary/60'
                )}
              >
                {date.format('D')}
              </span>
              <div className="flex w-full justify-evenly h-fit">
                {dots.map((dot) => (
                  <span
                    key={dot}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: `rgb(${dot})`, width: `${widthPercentagePerDot}%` }}
                  />
                ))}
              </div>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              side={matches ? 'top' : 'left'}
              align="start"
              className="min-w-[220px] w-full max-w-xs lg:max-w-sm p-3 z-40 bg-white border-2 border-tertiary rounded-lg shadow-md shadow-slate-200 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade flex flex-col"
            >
              <DropdownMenu.Label className="flex items-center justify-between pb-1 gap-x-4">
                <AddEvent date={date}>
                  <button className="flex items-center justify-center w-8 h-8 text-3xl transition-all hover:text-secondary text-primary">
                    <CalendarPlus size={22} />
                  </button>
                </AddEvent>
                <div className="flex flex-col items-center font-display">
                  <span className="tracking-wider text-slate-400">{date.format('dddd')}</span>
                  <span className="text-3xl text-tertiary">{date.format('D')}</span>
                </div>
                <button
                  className="flex items-center justify-center w-8 h-8 transition-all hover:opacity-60"
                  onClick={() => setOpen(false)}
                >
                  <X size={22} />
                </button>
              </DropdownMenu.Label>
              <div className="p-1 overflow-y-auto no-scrollbar max-h-64">
                <div className="flex flex-col gap-2">
                  {entries.map((entry) => (
                    <DropdownMenu.Item key={entry.id} asChild>
                      <EntryItem
                        entry={entry}
                        deleteRequest={deleteRequest}
                        setDeleteRequest={setDeleteRequest}
                      />
                    </DropdownMenu.Item>
                  ))}
                </div>
              </div>
              {!entries.length && (
                <p className="px-3 py-2 text-sm font-medium tracking-wide text-center rounded-md font-body text-slate-500 bg-slate-100">
                  No entries for this day
                </p>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </td>
  )
}
