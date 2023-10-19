import { useContext, useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'

import { dailyPlanner } from 'database'
import { DayContext } from 'context/day'
import type { DayPlanner } from '@types'
import { useAuthUser } from './useAuthUser'
import { LoadingContext } from 'context/loading'

export default function useDayPlanner() {
  const user = useAuthUser()
  const { setIsLoading } = useContext(LoadingContext)
  const { selectedDay, setSelectedDay } = useContext(DayContext)
  const [localData, setLocalData] = useState<DayPlanner | null>(null)
  const {
    data,
    refetch,
    isLoading: loadingData,
  } = useQuery(
    ['day', selectedDay.format('DD/MM/YYYY')],
    () => dailyPlanner.get(selectedDay, user?.uid),
    {
      enabled: !!user?.uid,
    }
  )
  const { mutateAsync: updateEntry, isLoading: loadingUpdate } = useMutation({
    mutationKey: ['update-day', selectedDay.format('DD/MM/YYYY')],
    mutationFn: ({ id, payload }: { id: string; payload: Partial<DayPlanner> }) =>
      dailyPlanner.update(id, payload, user?.uid),
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

  async function handleUpdate(payload: Partial<DayPlanner>, localOnly = false) {
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
    day: selectedDay,
    data: localData,
    setDay: setSelectedDay,
    update: handleUpdate,
  }
}
