import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import VesselSidebar from '../components/VesselSidebar'
import MapView from '../components/MapView'
import VesselDetailModal from '../components/VesselDetailModal'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal'
import { useVesselWebSocket } from '../hooks/useVesselWebSocket'
import { isAuthenticated, logout } from '../utils/auth'
import { LogOut } from 'lucide-react'

const AIS = () => {
  const navigate = useNavigate()
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const authenticated = isAuthenticated()
    setIsUserAuthenticated(authenticated)
    if (!authenticated) {
      setShowLoginModal(true)
    }
  }, [])

  // Handle login success
  const handleLoginSuccess = () => {
    setIsUserAuthenticated(true)
    setShowLoginModal(false)
    // Force re-render to reconnect WebSocket with token
    window.location.reload()
  }

  // Handle register success
  const handleRegisterSuccess = () => {
    setShowRegisterModal(false)
    setShowLoginModal(true)
  }

  // Handle modal close (redirect to home)
  const handleModalClose = () => {
    navigate('/')
  }

  // Handle switch from login to register
  const handleSwitchToRegister = () => {
    setShowLoginModal(false)
    setShowRegisterModal(true)
  }

  // Handle switch from register to login
  const handleSwitchToLogin = () => {
    setShowRegisterModal(false)
    setShowLoginModal(true)
  }

  // Handle logout
  const handleLogout = () => {
    logout()
    setIsUserAuthenticated(false)
    navigate('/')
  }

  // If not authenticated, show only modals with dark background
  if (!isUserAuthenticated) {
    return (
      <>
        {showLoginModal && (
          <LoginModal
            onLoginSuccess={handleLoginSuccess}
            onClose={handleModalClose}
            onRegisterClick={handleSwitchToRegister}
          />
        )}
        {showRegisterModal && (
          <RegisterModal
            onSuccess={handleRegisterSuccess}
            onClose={handleModalClose}
            onLoginClick={handleSwitchToLogin}
          />
        )}
        {/* Dark background */}
        <div className="min-h-screen bg-gray-900" />
      </>
    )
  }

  // If authenticated, render the authenticated component
  return <AuthenticatedAIS onLogout={handleLogout} />
}

// Separate component for authenticated view with WebSocket
const AuthenticatedAIS = ({ onLogout }) => {
  const [selectedVessel, setSelectedVessel] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Use WebSocket hook for real-time data (only called when authenticated)
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
      <div className="bg-slate-700 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="text-lg font-bold text-white">ADYK Online - AIS Takip</div>
            <button
              onClick={onLogout}
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
