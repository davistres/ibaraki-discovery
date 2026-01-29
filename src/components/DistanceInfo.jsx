import { MapPin, Clock } from 'lucide-react'
import { formatDistance, formatDuration } from '../utils/distanceUtils'

const DistanceInfo = ({ distance, className = '' }) => {
  if (!distance) return null

  return (
    <div className={`flex items-center gap-3 text-sm text-gray-600 ${className}`}>
      <div className="flex items-center gap-1">
        <MapPin className="w-4 h-4" />
        <span>{formatDistance(distance.distanceKm)}</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4" />
        <span>{formatDuration(distance.durationMinutes)}</span>
      </div>
    </div>
  )
}

export default DistanceInfo

