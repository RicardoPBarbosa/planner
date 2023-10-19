import type { Dayjs } from 'dayjs'
import { twMerge } from 'tailwind-merge'
import type { ReactElement } from 'react'
import { HistoryIcon, X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { lazy, useEffect, useState } from 'react'

import { ModalViews } from '@types'
const DayPicker = lazy(() => import('./DayPicker'))
const MonthReview = lazy(() => import('./MonthReview'))
const HistoryView = lazy(() => import('./HistoryView'))

export default function History() {
  const [open, setOpen] = useState(false)
  const [reviewMonth, setReviewMonth] = useState<Dayjs>()
  const [currentView, setCurrentView] = useState<ModalViews>(ModalViews.HISTORY)

  useEffect(() => {
    // reset view
    if (!open) {
      setCurrentView(ModalViews.HISTORY)
    }
  }, [open])

  const render: {
    [key: number]: {
      title: string
      content: ReactElement | null
      styles?: string
      titleStyles?: string
    }
  } = {
    [ModalViews.HISTORY]: {
      title: 'History',
      content: (
        <HistoryView
          close={() => setOpen(false)}
          setCurrentView={(view, month) => {
            setCurrentView(view)
            if (month) {
              setReviewMonth(month)
            }
          }}
        />
      ),
    },
    [ModalViews.DAYPICKER]: {
      title: 'Select day',
      content: (
        <DayPicker back={() => setCurrentView(ModalViews.HISTORY)} close={() => setOpen(false)} />
      ),
    },
    [ModalViews.MONTHREVIEW]: {
      title: `Your month of ${reviewMonth?.format('MMMM YYYY')}`,
      content: reviewMonth ? (
        <MonthReview back={() => setCurrentView(ModalViews.HISTORY)} reviewMonth={reviewMonth} />
      ) : null,
      styles: 'max-w-lg',
      titleStyles: 'text-xl',
    },
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex max-w-[190px] sm:w-full justify-center items-center gap-3 px-3 transition-colors rounded-lg h-12 lg:h-11 bg-slate-100 text-slate-500 hover:bg-slate-200">
          <HistoryIcon />{' '}
          <span className="hidden font-semibold leading-[initial] sm:block font-body">History</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-slate-900/30 z-40 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content
          className={twMerge(
            // eslint-disable-next-line max-len
            'data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] sm:max-h-[95vh] w-[95vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-tl-md rounded-tr-xl rounded-bl-xl rounded-br-md overflow-y-auto shadow-lg bg-white p-5 focus:outline-none z-50 border-2 border-tertiary',
            render[currentView].styles || ''
          )}
        >
          <Dialog.Title
            className={twMerge(
              'text-2xl pr-7 font-display text-primary',
              render[currentView].titleStyles || ''
            )}
          >
            {render[currentView].title}
          </Dialog.Title>
          <Dialog.Description asChild>{render[currentView].content}</Dialog.Description>
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
