import { createContext, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

import type { Week } from '@types'
import { DEFAULT_WEEK } from 'constants'

type WeekContextType = {
  selectedWeek: Week
  setSelectedWeek: Dispatch<SetStateAction<Week>>
}

export const WeekContext = createContext<WeekContextType>({
  selectedWeek: DEFAULT_WEEK,
  setSelectedWeek: () => {},
})

export function WeekProvider({ children }: { children: ReactNode }) {
  const [selectedWeek, setSelectedWeek] = useState(DEFAULT_WEEK)

  return (
    <WeekContext.Provider
      value={{
        selectedWeek,
        setSelectedWeek,
      }}
    >
      {children}
    </WeekContext.Provider>
  )
}
