import type { Dayjs } from 'dayjs'
import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, PencilLine, Calendar, LayoutGrid } from 'lucide-react'

import localDayjs from 'lib/dayjs'
import Select from 'components/Select'
import { categoriesColors } from 'constants'
import useYearPlanner from 'hooks/useYearPlanner'
import type { EntryCategory, YearEntry } from '@types'

type InputRowProps = {
  icon: ReactNode
  label: string
  children: ReactNode
}

function InputRow({ icon, label, children }: InputRowProps) {
  return (
    <label
      htmlFor={`input-${label}`}
      className="flex flex-col justify-between sm:items-center sm:flex-row gap-x-4 gap-y-2 sm:gap-y-0"
    >
      <div className="flex items-center gap-x-2 font-body text-slate-500">
        {icon}
        <span className="leading-[initial]">{label}</span>
      </div>
      {children}
    </label>
  )
}

type Props = {
  date: Dayjs
  children: ReactNode
}

export default function AddEvent({ date, children }: Props) {
  const { data, update } = useYearPlanner()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Omit<YearEntry, 'date'>>({
    category: 'vacation',
    text: '',
  })
  const [error, setError] = useState<{ [key in keyof typeof formData]: boolean }>({
    category: false,
    text: false,
  })

  useEffect(() => {
    if (error.text && !!formData.text) setError({ ...error, text: false })
    if (error.category && !!formData.category) setError({ ...error, category: false })
  }, [formData])

  async function handleSubmit() {
    const { category, text } = formData
    if (!category || !text) {
      setError({
        category: !category,
        text: !text,
      })
      return
    }
    await update({
      entries: [
        ...(data?.entries || []),
        {
          category,
          date,
          text,
        },
      ],
    })
    setFormData({ category: 'vacation', text: '' })
    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-slate-900/30 z-40 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[95vh] w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-tl-md rounded-tr-xl rounded-bl-xl rounded-br-md overflow-y-auto shadow-lg bg-white p-5 focus:outline-none z-50 border-2 border-tertiary">
          <Dialog.Title className="text-2xl pr-7 font-display text-primary">Add event</Dialog.Title>
          <Dialog.Description asChild>
            <div className="flex flex-col items-end gap-y-4">
              <div className="flex flex-col flex-1 w-full pt-4 gap-y-5">
                <InputRow icon={<Calendar size={20} />} label="Date">
                  <span className="w-full text-left flex items-center px-3 sm:max-w-[70%] bg-slate-100 h-12 rounded-md font-body text-lg tracking-wide font-medium text-slate-800">
                    {localDayjs(date).format('DD/MM/YYYY')}
                  </span>
                </InputRow>
                <InputRow icon={<PencilLine size={20} />} label="Title">
                  <input
                    id="input-Title"
                    autoFocus
                    type="text"
                    className={twMerge(
                      'flex-1 w-full sm:max-w-[70%] border-2 border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:border-secondary/80 focus:ring-transparent font-body text-lg',
                      error.text && 'border-red-400'
                    )}
                    onChange={({ target: { value } }) => {
                      setFormData({
                        ...formData,
                        text: value,
                      })
                    }}
                  />
                </InputRow>
                <InputRow icon={<LayoutGrid size={20} />} label="Category">
                  <Select<EntryCategory>
                    placeholder="Select a category..."
                    error={error.category}
                    defaultValue={formData.category}
                    items={Object.entries(categoriesColors).map(([category, color]) => ({
                      value: category,
                      label: (
                        <div className="flex items-center gap-x-2">
                          <span
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: `rgb(${color})` }}
                          />
                          <span className="capitalize">{category}</span>
                        </div>
                      ),
                    }))}
                    handleValueChange={(v) => {
                      setFormData({
                        ...formData,
                        category: v,
                      })
                    }}
                  />
                </InputRow>
              </div>
              <button
                className="h-10 px-8 text-lg tracking-wide transition-all rounded-md bg-primary font-display text-tertiary hover:bg-secondary"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
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
