import { useEffect, useState, useRef } from 'react'
import { getAccessToken } from '../utils/auth'

const WS_URL = 'wss://ws.adyk.online'
const RECONNECT_DELAY = 3000 // 3 seconds

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

// Transform WebSocket vessel data to match app format - NEW FORMAT
const transformVesselData = (vessel) => {
  return {
    // Core identification
    id: vessel.id,
    imei: vessel.imei,
    mmsi: vessel.mmsi,
    name: vessel.name || 'Bilinmiyor',
    callsign: vessel.callSign || null,

    // Vessel details
    type: 0, // Not in new format
    typeName: vessel.vesselType || 'Bilinmiyor',
    status: vessel.status || 0,
    statusName: getNavigationStatus(vessel.status || 0),
    flag: vessel.flag || 'TR',

    // Position data
    position: {
      lat: vessel.position?.latitude || 0,
      lon: vessel.position?.longitude || 0,
      accuracy: true
    },
    speed: vessel.position?.speed || 0,
    course: vessel.position?.direction || 0,
    heading: vessel.position?.direction || 0,

    // Additional data
    destination: null,
    eta: null,
    draught: null,
    length: null,
    width: null,
    lastUpdate: vessel.lastUpdate || new Date().toISOString(),
    photo: null,

    // User tracking info
    userId: vessel.userId,
    userName: vessel.userName,
    mapped: vessel.mapped
  }
}

export const useVesselWebSocket = () => {
  const [vessels, setVessels] = useState([])
  const [trackers, setTrackers] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [hasReceivedData, setHasReceivedData] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [error, setError] = useState(null)
  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttemptsRef = useRef(0)

  const connect = () => {
    try {
      const token = getAccessToken()

      if (!token) {
        console.error('❌ No token found')
        setError('Token bulunamadı')
        setHasReceivedData(true) // Prevent infinite loading
        return
      }

      const wsUrlWithToken = `${WS_URL}?token=${token}`
      console.log('🔌 Connecting to WebSocket')
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

          // Handle authentication response
          if (data.type === 'auth') {
            if (data.success) {
              console.log('[WS] ✅ Authenticated')
            } else {
              console.error('[WS] ❌ Authentication failed:', data.message)
              setError('Kimlik doğrulama hatası')
            }
            return
          }

          // Handle vessel data update - NEW FORMAT
          if (data.type === 'update') {
            const allVessels = data.data || []
            const mappedVessels = allVessels.filter(v => v.mapped === true)

            console.log('📦 Received update:', {
              total: allVessels.length,
              mapped: mappedVessels.length,
              timestamp: data.timestamp
            })

            // Mark that we've received initial data
            setHasReceivedData(true)

            // Transform vessels to app format
            const transformedVessels = mappedVessels.map(transformVesselData)
            setVessels(transformedVessels)

            // Update trackers (unmapped vessels)
            const unmappedVessels = allVessels.filter(v => v.mapped === false)
            setTrackers(unmappedVessels)

            // Update last update timestamp
            if (data.timestamp) {
              setLastUpdate(new Date(data.timestamp))
            }

            return
          }

          // Log unknown message types
          console.log('⚠️ Unknown message type:', data.type)
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

        // Don't reconnect on authentication errors
        if (event.code === 4001 || event.code === 4002) {
          console.error('❌ Authentication error - not reconnecting')
          setError('Oturum hatası')
          setHasReceivedData(true) // Prevent infinite loading
          return
        }

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
    hasReceivedData,
    lastUpdate,
    error,
    totalCount: vessels.length + trackers.length,
    vesselsCount: vessels.length,
    trackersCount: trackers.length
  }
}
