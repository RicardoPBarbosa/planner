import { useContext, useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'

import { yearlyPlanner } from 'database'
import type { YearPlanner } from '@types'
import { YearContext } from 'context/year'
import { useAuthUser } from './useAuthUser'
import { LoadingContext } from 'context/loading'

export default function useYearPlanner() {
  const user = useAuthUser()
  const { setIsLoading } = useContext(LoadingContext)
  const { selectedYear, setSelectedYear } = useContext(YearContext)
  const [localData, setLocalData] = useState<YearPlanner | null>(null)
  const {
    data,
    refetch,
    isLoading: loadingData,
  } = useQuery(['year', selectedYear], () => yearlyPlanner.get(selectedYear, user?.uid), {
    enabled: !!user?.uid,
  })
  const { mutateAsync: updateEntry, isLoading: loadingUpdate } = useMutation({
    mutationKey: ['update-year', selectedYear],
    mutationFn: ({ id, payload }: { id: string; payload: Partial<YearPlanner> }) =>
      yearlyPlanner.update(id, payload, user?.uid),
  })

  useEffect(() => {
    if (loadingUpdate) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [loadingUpdate])

  useEffect(() => {
    if (!loadingData && data) {
      setLocalData(data)
    }
  }, [data, loadingData])

  async function handleUpdate(payload: Partial<YearPlanner>, localOnly = false) {
    if (data?.id) {
      setLocalData((prev) => prev && { ...prev, ...payload, id: data.id })
      if (!localOnly) {
        await updateEntry({
          id: data.id,
          payload,
        })
        refetch()
      }
    }
  }

  return {
    year: selectedYear,
    data: localData,
    setYear: setSelectedYear,
    update: handleUpdate,
  }
}
