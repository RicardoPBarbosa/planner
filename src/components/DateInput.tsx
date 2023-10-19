import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { DayPicker } from 'react-day-picker'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import localDayjs from 'lib/dayjs'

type Props = {
  date: Date
  setDate: (date: Date) => void
  error?: boolean
}

export default function DateInput({ date, setDate, error }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={twMerge(
            'w-full text-left px-3 sm:max-w-[70%] border-slate-300 focus:border-secondary/80 h-12 border-2 rounded-md font-body text-lg tracking-wide font-medium text-slate-800',
            error && 'border-red-400'
          )}
        >
          {localDayjs(date).format('DD/MM/YYYY')}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-[calc(100vw-40px)] lg:w-[280px] p-3 z-50 bg-white border-2 border-tertiary rounded-lg shadow-md will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade flex flex-col gap-1"
          sideOffset={3}
        >
          <DayPicker
            components={{
              DayContent: ({ date }) => <div className="font-body">{date.getDate()}</div>,
            }}
            className="!m-0 day-calendar"
            classNames={{
              caption: 'flex w-full justify-between mb-1',
              caption_label: 'font-display text-lg text-tertiary',
              table: 'w-full',
              nav: 'flex items-center gap-1',
              month: 'overflow-x-auto',
              day_disabled: 'opacity-50 cursor-not-allowed',
              months: 'mx-auto',
              button_reset: 'w-full h-9',
              head_cell: 'tracking-wide font-display text-sm text-slate-500',
            }}
            weekStartsOn={1}
            showOutsideDays
            onDayClick={(day) => {
              setOpen(false)
              setDate(day)
            }}
            selected={date}
            disabled={[
              {
                after: localDayjs().endOf('day').toDate(),
              },
            ]}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
