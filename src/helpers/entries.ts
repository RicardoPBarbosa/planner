import type { YearEntry } from '@types'

export function buildEntriesByDayOfMonth(monthEntries: YearEntry[]) {
  return monthEntries.reduce((acc, entry) => {
    const day = entry.date.date()
    if (!acc[day]) {
      acc[day] = []
    }
    acc[day].push(entry)
    return acc
  }, {} as Record<number, YearEntry[]>)
}
