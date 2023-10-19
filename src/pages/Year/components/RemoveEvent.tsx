import { Check, X } from 'lucide-react'

import useYearPlanner from 'hooks/useYearPlanner'

type Props = {
  id?: string
  enabled: boolean
  close: () => void
}

export default function RemoveEvent({ id, enabled, close }: Props) {
  const { data, update } = useYearPlanner()
  const entries = data?.entries || []

  function handleDeletion(id?: string) {
    if (!id) return
    update({
      entries: entries.filter((entry) => entry.id !== id),
    })
    close()
  }

  if (!enabled) return null

  return (
    <div className="absolute top-0 left-0 flex items-center justify-between w-full h-full gap-1 pl-2 text-white bg-red-500">
      <span className="text-sm font-medium font-body">Are you sure?</span>
      <div className="flex items-center flex-1 h-full">
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDeletion(id)
          }}
          className="flex items-center justify-center flex-1 h-full text-xs transition-colors hover:bg-red-600"
        >
          <Check size={14} /> Yes
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            close()
          }}
          className="flex items-center justify-center flex-1 h-full text-xs transition-colors bg-red-400 hover:bg-red-600"
        >
          <X size={14} /> No
        </button>
      </div>
    </div>
  )
}
