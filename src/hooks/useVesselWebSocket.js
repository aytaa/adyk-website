import { useEffect, useState, useRef } from 'react'
import { getAccessToken } from '../utils/auth'

const WS_URL = 'wss://ws.adyk.online'
const RECONNECT_DELAY = 5000 // 5 seconds

// Map AIS type to vessel type name
const getVesselTypeName = (aisType) => {
  const typeMap = {
    30: 'Balıkçı',
    31: 'Römorkör',
    32: 'Römorkör',
    33: 'Draga',
    34: 'Dalış',
    35: 'Askeri',
    36: 'Yelkenli',
    37: 'Eğlence Teknesi',
    50: 'Pilot',
    51: 'Arama Kurtarma',
    52: 'Römorkör',
    53: 'Liman',
    60: 'Yolcu Gemisi',
    70: 'Kargo Gemisi',
    80: 'Tanker',
    90: 'Diğer'
  }

  if (aisType >= 60 && aisType < 70) return 'Yolcu Gemisi'
  if (aisType >= 70 && aisType < 80) return 'Kargo Gemisi'
  if (aisType >= 80 && aisType < 90) return 'Tanker'

  return typeMap[aisType] || 'Bilinmiyor'
}

// Map navigation status code to Turkish name
const getNavigationStatus = (navStatus) => {
  const statusMap = {
    0: 'Seyirde',
    1: 'Demirde',
    2: 'Kontrol Yok',
    3: 'Manevrabilite Kısıtlı',
    4: 'Su Çekimi Kısıtlı',
    5: 'Yanaşık',
    6: 'Karaya Oturmuş',
    7: 'Balık Avlıyor',
    8: 'Yelkenle Seyirde',
    15: 'Tanımsız'
  }
  return statusMap[navStatus] || 'Bilinmiyor'
}

// Transform WebSocket vessel data to match app format
const transformVesselData = (wsVessel) => {
  return {
    mmsi: wsVessel.mmsi,
    imo: wsVessel.vessel?.imo || null,
    name: wsVessel.name || 'Bilinmiyor',
    callsign: wsVessel.vessel?.callsign || null,
    type: wsVessel.vessel?.aisType || 0,
    typeName: wsVessel.vessel?.shipType || getVesselTypeName(wsVessel.vessel?.aisType),
    status: wsVessel.vessel?.navStatus || 0,
    statusName: getNavigationStatus(wsVessel.vessel?.navStatus || 0),
    position: {
      lat: wsVessel.gps?.latitude || 0,
      lon: wsVessel.gps?.longitude || 0,
      accuracy: true
    },
    speed: wsVessel.gps?.speed || 0,
    course: wsVessel.gps?.direction || 0,
    heading: wsVessel.gps?.direction || 0,
    destination: wsVessel.vessel?.destination || null,
    eta: null,
    draught: null,
    length: null,
    width: null,
    flag: wsVessel.vessel?.flag || 'TR',
    lastUpdate: wsVessel.timestamp || new Date().toISOString(),
    photo: null,
    // Additional fields from WebSocket
    currentPort: wsVessel.vessel?.currentPort || null,
    lastPort: wsVessel.vessel?.lastPort || null
  }
}

export const useVesselWebSocket = () => {
  const [vessels, setVessels] = useState([])
  const [trackers, setTrackers] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [error, setError] = useState(null)
  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttemptsRef = useRef(0)

  const connect = () => {
    try {
      const token = getAccessToken()
      const wsUrlWithToken = token ? `${WS_URL}?token=${token}` : WS_URL
      console.log('🔌 Connecting to WebSocket:', wsUrlWithToken)
      setError(null)

      const ws = new WebSocket(wsUrlWithToken)

      ws.onopen = () => {
        console.log('✅ WebSocket connected')
        setIsConnected(true)
        setError(null)
        reconnectAttemptsRef.current = 0
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('📦 Received data:', {
            vessels: data.vessels?.length || 0,
            trackers: data.trackers?.length || 0,
            timestamp: data.timestamp
          })

          // Transform and set vessels
          if (data.vessels && Array.isArray(data.vessels)) {
            const transformedVessels = data.vessels.map(transformVesselData)
            setVessels(transformedVessels)
          }

          // Set trackers (if any)
          if (data.trackers && Array.isArray(data.trackers)) {
            setTrackers(data.trackers)
          }

          // Update last update timestamp
          if (data.timestamp) {
            setLastUpdate(new Date(data.timestamp))
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error)
          setError('Veri işlenirken hata oluştu')
        }
      }

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
        setIsConnected(false)
        setError('Bağlantı hatası')
      }

      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected', event.code, event.reason)
        setIsConnected(false)

        // Auto-reconnect with exponential backoff (max 30 seconds)
        reconnectAttemptsRef.current += 1
        const delay = Math.min(RECONNECT_DELAY * reconnectAttemptsRef.current, 30000)

        console.log(`⏳ Reconnecting in ${delay / 1000}s... (attempt ${reconnectAttemptsRef.current})`)

        reconnectTimeoutRef.current = setTimeout(() => {
          connect()
        }, delay)
      }

      wsRef.current = ws
    } catch (error) {
      console.error('❌ Error creating WebSocket:', error)
      setIsConnected(false)
      setError('Bağlantı kurulamadı')

      // Retry connection
      reconnectTimeoutRef.current = setTimeout(() => {
        connect()
      }, RECONNECT_DELAY)
    }
  }

  useEffect(() => {
    connect()

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up WebSocket connection')
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  return {
    vessels,
    trackers,
    isConnected,
    lastUpdate,
    error,
    totalCount: vessels.length + trackers.length,
    vesselsCount: vessels.length,
    trackersCount: trackers.length
  }
}
