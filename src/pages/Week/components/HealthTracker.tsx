import { Undo } from 'lucide-react'
import { useState, useEffect } from 'react'

import Title from 'components/Title'
import type { Tracker } from '@types'
import { DEFAULT_TRACKER } from 'constants'
import useWeekPlanner from 'hooks/useWeekPlanner'
import { TrackingName, TrackingType } from '@types'
import TrackingItem from './TrackingItem'

export default function HealthTracker() {
  const { data, update } = useWeekPlanner()
  const [trackingInfo, setTrackingInfo] = useState<Tracker>(DEFAULT_TRACKER)

  useEffect(() => {
    setTrackingInfo((prev) => data?.tracker ?? prev)
  }, [data?.tracker])

  const handleTrackerChange = (
    trackName: TrackingName,
    changes: { [key: number]: number | boolean }
  ) => {
    const updatedTracker = { ...trackingInfo, [trackName]: changes }
    update({ tracker: updatedTracker })
    setTrackingInfo(updatedTracker)
  }

  return (
    <div className="flex flex-col items-start flex-1 max-w-sm min-w-full pb-4 space-y-3 overflow-x-auto overflow-y-hidden lg:min-w-max sm:pb-0">
      <div className="relative w-min -z-10">
        <Title className="transform -rotate-2">Health tracker</Title>
        <Undo
          size={24}
          className="absolute w-6 h-6 transform -rotate-[150deg] xs:-bottom-6 xs:-right-4 -right-0"
        />
      </div>
      <TrackingItem
        name={TrackingName.EXERCISE}
        week={trackingInfo[TrackingName.EXERCISE]}
        onChange={(changes) => handleTrackerChange(TrackingName.EXERCISE, changes)}
        type={TrackingType.CHECKBOX}
      />
      <TrackingItem
        name={TrackingName.HEALTHY_EATING}
        week={trackingInfo[TrackingName.HEALTHY_EATING]}
        onChange={(changes) => handleTrackerChange(TrackingName.HEALTHY_EATING, changes)}
        type={TrackingType.CHECKBOX}
      />
      <TrackingItem
        name={TrackingName.LITERS_OF_WATER}
        week={trackingInfo[TrackingName.LITERS_OF_WATER]}
        onChange={(changes) => handleTrackerChange(TrackingName.LITERS_OF_WATER, changes)}
        type={TrackingType.NUMBER}
      />
    </div>
  )
}
