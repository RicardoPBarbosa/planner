import { twMerge } from 'tailwind-merge'
import type { PropsWithChildren } from 'react'

export default function Title({ children, className }: { className?: string } & PropsWithChildren) {
  return (
    <div
      className={twMerge(
        'w-max bg-gradient-to-r from-secondary to-primary rounded-tl-md rounded-tr-xl rounded-bl-xl rounded-br-md !leading-8 px-3 font-display text-lg tracking-wide text-tertiary',
        className
      )}
    >
      {children}
    </div>
  )
}
