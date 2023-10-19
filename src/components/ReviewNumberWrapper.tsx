import type { ReactNode } from 'react'

export default function ReviewNumberWrapper({ children }: { children: ReactNode }) {
  return <strong className="px-2 text-lg tracking-wider bg-gray-100 rounded-md">{children}</strong>
}
