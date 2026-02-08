import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import VesselSidebar from '../components/VesselSidebar'
import MapView from '../components/MapView'
import VesselDetailModal from '../components/VesselDetailModal'
import useVesselWebSocket from '../hooks/useVesselWebSocket'
import { logout, getSubscriptionStatus, getUser } from '../utils/auth'
import { filterVessels } from '../utils/helpers'
import { statusOptions } from '../data/mockVessels'
import { LogOut, Loader2, Anchor, Check, User, Smartphone, CreditCard, ChevronDown } from 'lucide-react'

const AIS = () => {
  const navigate = useNavigate()
  const [selectedVessel, setSelectedVessel] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [subLoading, setSubLoading] = useState(true)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)
  const user = getUser()

  // Lifted filter state — shared between sidebar and map
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({})

  const displayName = user?.fullName || user?.name || user?.phone || ''
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?'

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Use WebSocket hook for real-time data
  const { vessels, connected, loading, lastUpdate, error } = useVesselWebSocket()

  const isConnected = connected
  const isLoading = loading

  // Derive vessel types from actual data
  const vesselTypes = useMemo(() => {
    const types = [...new Set(vessels.map(v => v.vesselType).filter(Boolean))]
    return types.sort()
  }, [vessels])

  // Single filtered list used by both sidebar and map
  const filteredVessels = useMemo(() => {
    return filterVessels(vessels, searchQuery, filters)
  }, [vessels, searchQuery, filters])

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
      {/* Navbar - z-[10000] to stay above all map fixed controls */}
      <div className="bg-slate-700 shadow-lg relative z-[10000]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Logo matching Navbar style — clickable link to homepage */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Anchor className="w-6 h-6 text-white transform group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-wide">
                  ADYK Online
                </h1>
                <p className="text-[10px] text-gray-300 -mt-0.5">
                  AIS Takip Sistemi
                </p>
              </div>
            </Link>

            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-all duration-200 font-medium text-sm"
              >
                <div className="w-6 h-6 bg-adyk-ocean rounded-full flex items-center justify-center text-xs font-bold">
                  {initial}
                </div>
                <span className="max-w-[120px] truncate hidden sm:inline">{displayName}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg py-2 z-[10000]">
                  <Link
                    to="/profile"
                    onClick={(e) => { e.stopPropagation(); setTimeout(() => setShowMenu(false), 100); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    Profilim
                  </Link>
                  <Link
                    to="/my-devices"
                    onClick={(e) => { e.stopPropagation(); setTimeout(() => setShowMenu(false), 100); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <Smartphone className="w-4 h-4 text-gray-500" />
                    Cihazlarım
                  </Link>
                  <Link
                    to="/my-subscriptions"
                    onClick={(e) => { e.stopPropagation(); setTimeout(() => setShowMenu(false), 100); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    Aboneliklerim
                  </Link>
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
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
            {filteredVessels.length} gemi
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
          filteredVessels={filteredVessels}
          totalCount={vessels.length}
          selectedVessel={selectedVessel}
          onVesselSelect={handleVesselSelect}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFilterChange={setFilters}
          vesselTypes={vesselTypes}
          statusOptions={statusOptions}
        />

        {/* Map Area — receives filtered vessels */}
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
              vessels={filteredVessels}
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
