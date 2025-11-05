import { createPortal } from 'react-dom'
import { X, Ship, Compass, Navigation, MapPin, Anchor, Calendar, Ruler, Clock } from 'lucide-react'
import { formatDateTime, formatCoordinates, getStatusColor } from '../utils/helpers'

const VesselDetailModal = ({ vessel, onClose }) => {
  if (!vessel) return null

  const InfoRow = ({ icon: Icon, label, value, iconColor = "text-adyk-ocean" }) => (
    <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg">
      <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-600">{label}</div>
        <div className="text-sm font-medium text-gray-900 break-words">
          {value || 'Bilinmiyor'}
        </div>
      </div>
    </div>
  )

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const modalContent = (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[9998] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="relative bg-white rounded-lg shadow-2xl max-w-xl w-full max-h-[80vh] overflow-hidden flex flex-col z-[9999]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-slate-700 p-4 text-white rounded-t-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1.5">
                <Ship className="w-5 h-5" />
                <h2 className="text-xl font-bold">{vessel.name}</h2>
                {vessel.flag === 'TR' && <span className="text-xl">🇹🇷</span>}
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-gray-300">
                <span>MMSI: {vessel.mmsi}</span>
                <span>IMO: {vessel.imo}</span>
                {vessel.callsign && <span>Çağrı İşareti: {vessel.callsign}</span>}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
          {/* Vessel Photo Placeholder */}
          <div className="mb-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg h-40 flex items-center justify-center">
            <Ship className="w-16 h-16 text-adyk-ocean opacity-30" />
          </div>

          {/* Status Badge */}
          <div className="mb-3 flex items-center justify-between">
            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(vessel.status)}`}>
              {vessel.statusName}
            </span>
            <span className="text-xs text-gray-500">
              {vessel.typeName}
            </span>
          </div>

          {/* Information Grid */}
          <div className="space-y-3">
            {/* Position Information */}
            <div>
              <h3 className="text-base font-bold text-adyk-navy mb-2 flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Konum Bilgileri</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                <InfoRow
                  icon={MapPin}
                  label="Koordinatlar"
                  value={formatCoordinates(vessel.position.lat, vessel.position.lon)}
                />
                <InfoRow
                  icon={Navigation}
                  label="Hız"
                  value={`${vessel.speed.toFixed(1)} knot`}
                />
                <InfoRow
                  icon={Compass}
                  label="Rota (COG)"
                  value={`${vessel.course}°`}
                />
                <InfoRow
                  icon={Compass}
                  label="Başlangıç (HDG)"
                  value={`${vessel.heading}°`}
                />
              </div>
            </div>

            {/* Voyage Information */}
            <div>
              <h3 className="text-base font-bold text-adyk-navy mb-2 flex items-center space-x-2">
                <Ship className="w-4 h-4" />
                <span>Seyir Bilgileri</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                {vessel.destination && (
                  <InfoRow
                    icon={MapPin}
                    label="Hedef Liman"
                    value={vessel.destination}
                    iconColor="text-green-600"
                  />
                )}
                {vessel.eta && (
                  <InfoRow
                    icon={Calendar}
                    label="Tahmini Varış"
                    value={formatDateTime(vessel.eta)}
                  />
                )}
                <InfoRow
                  icon={Anchor}
                  label="Draft (Su Çekimi)"
                  value={`${vessel.draught} m`}
                />
                <InfoRow
                  icon={Clock}
                  label="Son Güncelleme"
                  value={formatDateTime(vessel.lastUpdate)}
                />
              </div>
            </div>

            {/* Vessel Dimensions */}
            <div>
              <h3 className="text-base font-bold text-adyk-navy mb-2 flex items-center space-x-2">
                <Ruler className="w-4 h-4" />
                <span>Gemi Boyutları</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                <InfoRow
                  icon={Ruler}
                  label="Uzunluk"
                  value={`${vessel.length} m`}
                />
                <InfoRow
                  icon={Ruler}
                  label="Genişlik"
                  value={`${vessel.width} m`}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 pt-3 border-t border-gray-200 flex flex-wrap gap-2">
            <button className="flex-1 btn-secondary text-sm py-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Haritada Göster
            </button>
            <button className="flex-1 btn-secondary text-sm py-2">
              <Navigation className="w-4 h-4 inline mr-1" />
              Rotayı Göster
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default VesselDetailModal
