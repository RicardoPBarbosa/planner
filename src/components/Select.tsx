import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import * as RdSelect from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

type Item = {
  value: string
  label: ReactNode
}

type Props<T> = {
  defaultValue?: string
  placeholder?: string
  error?: boolean
  items: Item[]
  handleValueChange: (value: T) => void
}

export default function Select<T>({
  error,
  defaultValue,
  placeholder,
  items,
  handleValueChange,
}: Props<T>) {
  return (
    <RdSelect.Root
      defaultValue={defaultValue}
      onValueChange={(value) => handleValueChange(value as T)}
    >
      <RdSelect.Trigger
        className={twMerge(
          // eslint-disable-next-line max-len
          'flex items-center justify-between px-3 w-full sm:max-w-[70%] border-slate-300 focus:border-secondary/80 h-12 border-2 rounded-md font-body gap-1 bg-white text-slate-800 data-[placeholder]:text-slate-400 outline-none',
          error && 'border-red-400'
        )}
        aria-label="Food"
      >
        <RdSelect.Value placeholder={placeholder || 'Select an item...'} />
        <RdSelect.Icon>
          <ChevronDownIcon className="text-slate-600" />
        </RdSelect.Icon>
      </RdSelect.Trigger>
      <RdSelect.Portal>
        <RdSelect.Content className="z-50 overflow-hidden bg-white border-2 rounded-md shadow-lg border-tertiary">
          <RdSelect.ScrollUpButton className="flex items-center justify-center h-6 bg-white cursor-default text-slate-400">
            <ChevronUpIcon />
          </RdSelect.ScrollUpButton>
          <RdSelect.Viewport>
            {items.map((item) => (
              <RdSelect.Item
                key={item.value}
                className="font-body flex items-center h-10 pl-3 pr-8 relative select-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-secondary/20 data-[highlighted]:text-slate-800 text-slate-700"
                value={item.value}
              >
                <RdSelect.ItemText>{item.label}</RdSelect.ItemText>
                <RdSelect.ItemIndicator className="absolute right-2">
                  <CheckIcon size={14} />
                </RdSelect.ItemIndicator>
              </RdSelect.Item>
            ))}
          </RdSelect.Viewport>
          <RdSelect.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
            <ChevronDownIcon />
          </RdSelect.ScrollDownButton>
        </RdSelect.Content>
      </RdSelect.Portal>
    </RdSelect.Root>
  )
}
