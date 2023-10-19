import type { PropsWithChildren } from 'react'

type MoodProps = {
  active: boolean
  onClick: () => void
}

export default function Mood({ children, onClick, active }: MoodProps & PropsWithChildren) {
  return (
    <button
      className={`transition-all ${active ? 'emoji-active' : 'hover:opacity-60'}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
