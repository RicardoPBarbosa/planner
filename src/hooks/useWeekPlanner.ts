import { useContext, useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'

import { weeklyPlanner } from 'database'
import type { WeekPlanner } from '@types'
import { WeekContext } from 'context/week'
import { useAuthUser } from './useAuthUser'
import { setWeekQueryKey } from 'helpers/date'
import { LoadingContext } from 'context/loading'

export default function useWeekPlanner() {
  const user = useAuthUser()
  const { setIsLoading } = useContext(LoadingContext)
  const { selectedWeek, setSelectedWeek } = useContext(WeekContext)
  const [localData, setLocalData] = useState<WeekPlanner | null>(null)
  const {
    data,
    refetch,
    isLoading: loadingData,
  } = useQuery(
    ['week', ...setWeekQueryKey(selectedWeek)],
    () => weeklyPlanner.get(selectedWeek, user?.uid),
    {
      enabled: !!user?.uid,
    }
  )
  const { mutateAsync: updateEntry, isLoading: loadingUpdate } = useMutation({
    mutationKey: ['update-week', ...setWeekQueryKey(selectedWeek)],
    mutationFn: ({ id, payload }: { id: string; payload: Partial<WeekPlanner> }) =>
      weeklyPlanner.update(id, payload, user?.uid),
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

  async function handleUpdate(payload: Partial<WeekPlanner>, localOnly = false) {
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
    week: selectedWeek,
    data: localData,
    setWeek: setSelectedWeek,
    update: handleUpdate,
  }
}
