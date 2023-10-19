import { createContext, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

import localDayjs from 'lib/dayjs'

const DEFAULT_YEAR = localDayjs().year()

type YearContextType = {
  selectedYear: number
  setSelectedYear: Dispatch<SetStateAction<number>>
}

export const YearContext = createContext<YearContextType>({
  selectedYear: DEFAULT_YEAR,
  setSelectedYear: () => {},
})

export function YearProvider({ children }: { children: ReactNode }) {
  const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR)

  return (
    <YearContext.Provider
      value={{
        selectedYear,
        setSelectedYear,
      }}
    >
      {children}
    </YearContext.Provider>
  )
}
