import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import VesselSidebar from '../components/VesselSidebar'
import MapView from '../components/MapView'
import VesselDetailModal from '../components/VesselDetailModal'
import useVesselWebSocket from '../hooks/useVesselWebSocket'
import { logout, getSubscriptionStatus } from '../utils/auth'
import { LogOut, Loader2, Anchor, Check } from 'lucide-react'

const AIS = () => {
  const navigate = useNavigate()
  const [selectedVessel, setSelectedVessel] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [subLoading, setSubLoading] = useState(true)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)

  // Use WebSocket hook for real-time data
  const { vessels, connected, loading, lastUpdate, error } = useVesselWebSocket()

  const isConnected = connected
  const isLoading = loading

  // Check subscription on mount
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await getSubscriptionStatus()
        const data = res.data || res
        const active = data.hasSubscription && ['active', 'grace'].includes(data.status)
        setHasActiveSubscription(active)
      } catch (err) {
        console.error('Subscription check failed:', err)
        setHasActiveSubscription(false)
      } finally {
        setSubLoading(false)
      }
    }
    checkSubscription()
  }, [])

  const handleVesselSelect = (vessel) => {
    setSelectedVessel(vessel)
    setShowDetailModal(true)
  }

  const handleMapVesselClick = (vessel) => {
    setSelectedVessel(vessel)
    setShowDetailModal(true)
  }

  const handleCloseModal = () => {
    setShowDetailModal(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Loading state while checking subscription
  if (subLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-adyk-ocean animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-600">Abonelik kontrol ediliyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navbar - always above modal overlay */}
      <div className="bg-slate-700 shadow-lg relative z-[60]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="text-lg font-bold text-white">ADYK Online - AIS Takip</div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Çıkış</span>
            </button>
          </div>
        </div>
      </div>

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
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <VesselSidebar
          vessels={vessels}
          selectedVessel={selectedVessel}
          onVesselSelect={handleVesselSelect}
          isLoading={isLoading}
        />

        {/* Map Area */}
        <div className={`flex-1 relative ${!hasActiveSubscription ? 'filter blur-md pointer-events-none' : ''}`}>
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

        {/* Subscription required overlay */}
        {!hasActiveSubscription && (
          <div className="fixed top-12 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm mx-4 text-center shadow-2xl">
              <div className="w-16 h-16 bg-adyk-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Anchor className="w-8 h-8 text-adyk-ocean" />
              </div>
              <h2 className="text-xl font-bold text-adyk-navy mb-3">
                Aboneliğinizi Aktif Edin
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Tüm özelliklere erişim için abonelik gereklidir:
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-2 mb-5">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Gerçek zamanlı tekne takibi
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Geofence alarm bildirimleri
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Hareket ve sintine sensörleri
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  7/24 konum geçmişi
                </li>
              </ul>
              <button
                onClick={() => navigate('/subscription')}
                className="w-full bg-adyk-ocean text-white py-2.5 px-5 rounded-lg font-medium hover:bg-adyk-accent transition-colors text-sm"
              >
                Abonelik Satın Al
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vessel Detail Modal */}
      {hasActiveSubscription && showDetailModal && selectedVessel && (
        <VesselDetailModal
          vessel={selectedVessel}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default AIS
