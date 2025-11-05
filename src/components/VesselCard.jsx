import { Ship, Navigation, Clock } from 'lucide-react'
import { formatTimeAgo, getStatusColor } from '../utils/helpers'

const VesselCard = ({ vessel, isSelected, onClick }) => {
  return (
    <div
      onClick={() => onClick(vessel)}
      className={`vessel-card p-2 bg-white rounded-lg border cursor-pointer transition-shadow ${
        isSelected
          ? 'border-adyk-ocean shadow-md'
          : 'border-gray-200 hover:border-adyk-ocean hover:shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-1.5 flex-1 min-w-0">
          <Ship className={`w-4 h-4 flex-shrink-0 ${
            vessel.speed > 1 ? 'text-adyk-ocean' : 'text-gray-400'
          }`} />
          <h3 className="text-sm font-semibold text-gray-900 truncate flex-1">
            {vessel.name}
          </h3>
          {vessel.flag === 'TR' && (
            <span className="text-base flex-shrink-0" title="Türk Bayraklı">
              🇹🇷
            </span>
          )}
        </div>
        <span className="text-xs font-medium text-gray-700 ml-2">
          {vessel.speed.toFixed(1)} kn
        </span>
      </div>

      {/* Info */}
      <div className="space-y-0.5">
        <p className="text-xs text-gray-600">
          MMSI: {vessel.mmsi}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {vessel.typeName}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getStatusColor(vessel.status)}`}>
            {vessel.statusName}
          </span>
        </div>

        {/* Destination */}
        {vessel.destination && (
          <div className="text-xs text-gray-600 truncate mt-1">
            <span className="font-medium">→</span> {vessel.destination}
          </div>
        )}

        {/* Last Update */}
        <div className="flex items-center space-x-1 text-[10px] text-gray-400 mt-1">
          <Clock className="w-3 h-3" />
          <span>{formatTimeAgo(vessel.lastUpdate)}</span>
        </div>
      </div>
    </div>
  )
}

export default VesselCard
