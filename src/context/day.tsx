import type { Dayjs } from 'dayjs'
import { createContext, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

import localDayjs from 'lib/dayjs'

type DayContextType = {
  selectedDay: Dayjs
  setSelectedDay: Dispatch<SetStateAction<Dayjs>>
}

export const DayContext = createContext<DayContextType>({
  selectedDay: localDayjs(),
  setSelectedDay: () => {},
})

export function DayProvider({ children }: { children: ReactNode }) {
  const [selectedDay, setSelectedDay] = useState(localDayjs())

  return (
    <DayContext.Provider
      value={{
        selectedDay,
        setSelectedDay,
      }}
    >
      {children}
    </DayContext.Provider>
  )
}
