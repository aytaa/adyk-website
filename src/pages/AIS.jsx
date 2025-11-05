import { useState } from 'react'
import Navbar from '../components/Navbar'
import VesselSidebar from '../components/VesselSidebar'
import MapView from '../components/MapView'
import VesselDetailModal from '../components/VesselDetailModal'
import { useVesselWebSocket } from '../hooks/useVesselWebSocket'
import { Radio } from 'lucide-react'

const AIS = () => {
  const [selectedVessel, setSelectedVessel] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Use WebSocket hook for real-time data
  const { vessels, isConnected, lastUpdate, error, vesselsCount } = useVesselWebSocket()

  // Loading state based on connection and initial data
  const isLoading = !isConnected && vessels.length === 0

  // Handle vessel selection from sidebar or map
  const handleVesselSelect = (vessel) => {
    setSelectedVessel(vessel)
    setShowDetailModal(true)
  }

  // Handle map marker click
  const handleMapVesselClick = (vessel) => {
    setSelectedVessel(vessel)
    setShowDetailModal(true)
  }

  // Close modal
  const handleCloseModal = () => {
    setShowDetailModal(false)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar title="ADYK AIS Takip" />

      {/* Mobile Connection Status Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs font-medium text-gray-700">
              {isConnected ? 'Canlı' : 'Bağlanıyor...'}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {vessels.length} gemi
          </span>
          {lastUpdate && (
            <span className="text-xs text-gray-400">
              {lastUpdate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <VesselSidebar
          vessels={vessels}
          selectedVessel={selectedVessel}
          onVesselSelect={handleVesselSelect}
          isLoading={isLoading}
        />

        {/* Map Area */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-blue-50">
              <div className="text-center">
                <div className="inline-block w-16 h-16 border-4 border-adyk-ocean border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-adyk-navy font-medium">Harita yükleniyor...</p>
              </div>
            </div>
          ) : (
            <MapView
              vessels={vessels}
              selectedVessel={selectedVessel}
              onVesselClick={handleMapVesselClick}
              isModalOpen={showDetailModal}
            />
          )}
        </div>
      </div>

      {/* Vessel Detail Modal */}
      {showDetailModal && selectedVessel && (
        <VesselDetailModal
          vessel={selectedVessel}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default AIS
