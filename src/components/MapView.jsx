import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { Layers, Maximize, Minimize, Crosshair, Heart, Check } from 'lucide-react'
import { formatCoordinates, formatTimeAgo } from '../utils/helpers'

// Fix Leaflet default icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Map tile layer configurations
const MAP_LAYERS = {
  standard: {
    name: 'Standart',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  satellite: {
    name: 'Uydu',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri'
  },
  dark: {
    name: 'Karanlık',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  osm: {
    name: 'Denizcilik',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }
}

// Helper function to convert decimal coordinates to degrees/minutes/seconds
const toDegreesMinutesSeconds = (coordinate, isLat) => {
  const absolute = Math.abs(coordinate)
  const degrees = Math.floor(absolute)
  const minutesNotTruncated = (absolute - degrees) * 60
  const minutes = Math.floor(minutesNotTruncated)
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2)

  const direction = isLat
    ? (coordinate >= 0 ? 'N' : 'S')
    : (coordinate >= 0 ? 'E' : 'W')

  return `${degrees}° ${minutes}' ${seconds}" ${direction}`
}

// Create custom vessel icon - green triangular arrow
const createVesselIcon = (vessel) => {
  const direction = vessel.gps?.direction || vessel.heading || vessel.course || 0

  return L.divIcon({
    html: `
      <div class="ship-marker" style="transform: rotate(${direction}deg);">
        ▲
      </div>
    `,
    className: 'vessel-marker-container',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

// Component to handle map updates
const MapUpdater = ({ center, zoom, selectedVessel, isModalOpen }) => {
  const map = useMap()

  useEffect(() => {
    if (selectedVessel) {
      map.setView(
        [selectedVessel.position.lat, selectedVessel.position.lon],
        12,
        { animate: true, duration: 1 }
      )
    }
  }, [selectedVessel, map])

  // Disable/enable map interactions based on modal state
  useEffect(() => {
    if (isModalOpen) {
      map.dragging.disable()
      map.touchZoom.disable()
      map.doubleClickZoom.disable()
      map.scrollWheelZoom.disable()
      map.boxZoom.disable()
      map.keyboard.disable()
    } else {
      map.dragging.enable()
      map.touchZoom.enable()
      map.doubleClickZoom.enable()
      map.scrollWheelZoom.enable()
      map.boxZoom.enable()
      map.keyboard.enable()
    }
  }, [isModalOpen, map])

  return null
}

// Component to track mouse coordinates
const MapEvents = ({ setMouseCoords }) => {
  useMapEvents({
    mousemove: (e) => {
      setMouseCoords({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      })
    }
  })
  return null
}

// Right Tool Menu Component
const RightToolMenu = ({ currentLayer, onLayerChange }) => {
  const [showLayerMenu, setShowLayerMenu] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const map = useMap()

  // Center on Turkey handler
  const handleCenterTurkey = () => {
    map.flyTo([39.0, 35.0], 6, {
      duration: 1.5,
      easeLinearity: 0.5
    })
  }

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <>
      {/* Container for toolbar and layer menu */}
      <div className="fixed top-20 right-4 z-[1000]">
        {/* Layer Menu - Separate from toolbar */}
        {showLayerMenu && (
          <>
            {/* Backdrop to close menu */}
            <div
              className="fixed inset-0 z-[9997]"
              onClick={() => setShowLayerMenu(false)}
            />

            {/* Layer Menu Dropdown */}
            <div className="fixed top-20 right-[60px] bg-white rounded-lg shadow-2xl p-3 w-52 border-2 border-gray-300 z-[9998]">
              <h3 className="text-sm font-bold text-gray-900 mb-2 pb-2 border-b">Harita Tipi</h3>
              <div className="space-y-1">
                {Object.entries(MAP_LAYERS).map(([key, layer]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onLayerChange(key)
                      setShowLayerMenu(false)
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                      currentLayer === key
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-900 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{layer.name}</span>
                      {currentLayer === key && (
                        <Check className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Toolbar Buttons */}
        <div className="bg-slate-700 rounded-lg shadow-xl">
          {/* Layers */}
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`w-11 h-11 flex items-center justify-center text-white hover:bg-slate-600 transition-colors relative ${
              showLayerMenu ? 'bg-slate-600' : ''
            }`}
            title="Katman Seçici"
          >
            <Layers className="w-5 h-5" />
            {showLayerMenu && (
              <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>

          {/* Center Turkey */}
          <button
            onClick={handleCenterTurkey}
            className="w-11 h-11 flex items-center justify-center text-white hover:bg-slate-600 transition-colors"
            title="Türkiye'ye Odaklan"
          >
            <Crosshair className="w-5 h-5" />
          </button>

          {/* Favorites - Login Required */}
          <button
            onClick={() => setShowLoginModal(true)}
            className="w-11 h-11 flex items-center justify-center text-white hover:bg-slate-600 transition-colors"
            title="Favoriler"
          >
            <Heart className="w-5 h-5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="w-11 h-11 flex items-center justify-center text-white hover:bg-slate-600 transition-colors"
            title="Tam Ekran"
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 z-[9998] flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="bg-slate-700 text-white p-4 rounded-t-lg">
              <h3 className="text-lg font-semibold">Üyelik Gerekli</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-700 mb-4">Favori eklemek için üye olmanız gerekiyor.</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                  Giriş Yap
                </button>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Custom Zoom Control Component with Coordinate Display
const CustomZoomControl = ({ mouseCoords }) => {
  const map = useMap()

  return (
    <div className="fixed bottom-4 right-4 z-[1000] flex items-end gap-2">
      {/* Coordinate Display */}
      {mouseCoords && (
        <div className="bg-slate-700 text-white px-3 py-2 rounded-lg shadow-xl font-mono">
          <div className="text-xs leading-tight">
            <div>{toDegreesMinutesSeconds(mouseCoords.lat, true)}</div>
            <div>{toDegreesMinutesSeconds(mouseCoords.lng, false)}</div>
            <div className="text-gray-300 text-[10px] mt-0.5">
              ({mouseCoords.lat.toFixed(6)}, {mouseCoords.lng.toFixed(6)})
            </div>
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="flex flex-col gap-0.5">
        <button
          onClick={() => map.zoomIn()}
          className="w-10 h-10 bg-slate-700 text-white flex items-center justify-center text-2xl font-bold hover:bg-slate-600 rounded-t-lg shadow-xl transition-colors"
          title="Yakınlaştır"
        >
          +
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="w-10 h-10 bg-slate-700 text-white flex items-center justify-center text-2xl font-bold hover:bg-slate-600 rounded-b-lg shadow-xl transition-colors"
          title="Uzaklaştır"
        >
          −
        </button>
      </div>
    </div>
  )
}

const MapView = ({ vessels, selectedVessel, onVesselClick, isModalOpen = false }) => {
  const mapRef = useRef(null)
  const [currentLayer, setCurrentLayer] = useState('standard')
  const [mouseCoords, setMouseCoords] = useState(null)

  // Center on Turkish waters (between Istanbul and Izmir)
  const defaultCenter = [39.5, 30.0]
  const defaultZoom = 6

  const selectedLayerConfig = MAP_LAYERS[currentLayer]

  return (
    <div className="w-full h-full relative map-container">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="w-full h-full"
        ref={mapRef}
        zoomControl={false}
        scrollWheelZoom={true}
        maxZoom={19}
      >
        {/* Map tiles with dynamic layer */}
        <TileLayer
          key={currentLayer}
          attribution={selectedLayerConfig.attribution}
          url={selectedLayerConfig.url}
          maxZoom={19}
        />

        {/* Vessel Markers */}
        {vessels.map((vessel) => (
          <Marker
            key={vessel.mmsi}
            position={[vessel.position.lat, vessel.position.lon]}
            icon={createVesselIcon(vessel)}
            bubblingMouseEvents={false}
          >
            <Popup>
              <div className="p-2 min-w-[180px]">
                <h3 className="font-bold text-sm text-gray-900 mb-1.5 flex items-center gap-1">
                  <span>{vessel.name}</span>
                  {vessel.flag === 'TR' && <span className="text-base">🇹🇷</span>}
                </h3>

                <div className="space-y-0.5 text-xs mb-2">
                  <p className="text-gray-600">
                    <span className="font-medium">MMSI:</span> {vessel.mmsi}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Hız:</span> {vessel.speed.toFixed(1)} knot
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Durum:</span> {vessel.statusName}
                  </p>
                  {vessel.destination && (
                    <p className="text-gray-600 truncate">
                      <span className="font-medium">Hedef:</span> {vessel.destination}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onVesselClick(vessel)}
                  className="w-full bg-blue-600 text-white text-xs py-1.5 rounded hover:bg-blue-700 transition-colors font-medium"
                >
                  Detay Gör
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Map updater for selected vessel */}
        <MapUpdater
          center={defaultCenter}
          zoom={defaultZoom}
          selectedVessel={selectedVessel}
          isModalOpen={isModalOpen}
        />

        {/* Custom Zoom Control with Coordinate Display */}
        <CustomZoomControl mouseCoords={mouseCoords} />

        {/* Right Tool Menu */}
        <RightToolMenu currentLayer={currentLayer} onLayerChange={setCurrentLayer} />

        {/* Map Events for Coordinate Tracking */}
        <MapEvents setMouseCoords={setMouseCoords} />
      </MapContainer>
    </div>
  )
}

export default MapView
