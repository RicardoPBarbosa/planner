import { Trash } from 'lucide-react'

import type { YearEntry } from '@types'
import { categoriesColors } from 'constants'
import RemoveEvent from './RemoveEvent'

type Props = {
  entry: YearEntry
  deleteRequest?: string
  setDeleteRequest: (id?: string) => void
}

export default function EntryItem({ entry, deleteRequest, setDeleteRequest }: Props) {
  return (
    <div className="relative flex items-center justify-between h-12 gap-2 pl-2 overflow-hidden rounded-lg bg-slate-50">
      <RemoveEvent
        enabled={!!entry.id && deleteRequest === entry.id}
        id={entry.id}
        close={() => setDeleteRequest(undefined)}
      />
      <div className="flex items-center h-full gap-2">
        <div
          className="flex-none w-1 rounded-full h-3/4"
          style={{
            backgroundColor: `rgb(${categoriesColors[entry.category]})`,
          }}
        />
        <div className="flex flex-col justify-center h-full font-body">
          <span className="text-xs leading-none capitalize text-slate-500">{entry.category}</span>
          <span className="font-semibold leading-none text-slate-900">{entry.text}</span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setDeleteRequest(entry.id)
        }}
        className="flex items-center justify-center w-8 h-full transition-colors rounded-r-lg hover:bg-red-100"
      >
        <Trash size={16} className="text-red-500" />
      </button>
    </div>
  )
}
