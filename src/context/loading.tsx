import { createContext, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

type LoadingContextType = {
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

export const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
})

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}
