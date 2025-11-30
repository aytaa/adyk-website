// Helper functions for the ADYK AIS application

/**
 * Format timestamp to Turkish locale
 */
export const formatDateTime = (isoString) => {
  if (!isoString) return 'Bilinmiyor'
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Format time ago in Turkish
 */
export const formatTimeAgo = (isoString) => {
  if (!isoString) return 'Bilinmiyor'
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Şimdi'
  if (diffMins < 60) return `${diffMins} dk önce`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} saat önce`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} gün önce`
}

/**
 * Format coordinates
 */
export const formatCoordinates = (lat, lon) => {
  if (lat === undefined || lon === undefined) return 'Bilinmiyor'

  const latDir = lat >= 0 ? 'K' : 'G'
  const lonDir = lon >= 0 ? 'D' : 'B'

  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`
}

/**
 * Get status color class - NEW FORMAT
 */
export const getStatusColor = (status) => {
  // New status format: 'online', 'stale', 'offline'
  if (typeof status === 'string') {
    const colors = {
      online: 'text-green-600 bg-green-50',
      stale: 'text-yellow-600 bg-yellow-50',
      offline: 'text-red-600 bg-red-50'
    }
    return colors[status] || 'text-gray-600 bg-gray-50'
  }

  // Legacy numeric status
  const colors = {
    0: 'text-green-600 bg-green-50', // Seyirde
    1: 'text-blue-600 bg-blue-50', // Demirde
    2: 'text-red-600 bg-red-50', // Kontrol Yok
    5: 'text-purple-600 bg-purple-50', // Yanaşık
    8: 'text-teal-600 bg-teal-50' // Yelkenle
  }
  return colors[status] || 'text-gray-600 bg-gray-50'
}

/**
 * Get vessel type icon color
 */
export const getTypeColor = (type) => {
  if (type >= 70 && type < 80) return 'text-orange-600' // Kargo
  if (type >= 80 && type < 90) return 'text-red-600' // Tanker
  if (type >= 60 && type < 70) return 'text-blue-600' // Yolcu
  if (type >= 30 && type < 40) return 'text-green-600' // Balıkçı
  return 'text-gray-600' // Diğer
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3440.065 // Earth radius in nautical miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return (R * c).toFixed(1)
}

/**
 * Filter vessels by search query - NEW FORMAT
 */
export const filterVessels = (vessels, searchQuery, filters = {}) => {
  let filtered = vessels

  // Text search - NEW FIELDS
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(vessel =>
      vessel.name?.toLowerCase().includes(query) ||
      vessel.mmsi?.toString().includes(query) ||
      vessel.imei?.toLowerCase().includes(query) ||
      vessel.callSign?.toLowerCase().includes(query) ||
      vessel.userName?.toLowerCase().includes(query) ||
      vessel.destination?.toLowerCase().includes(query)
    )
  }

  // Vessel type filter - NEW FORMAT (string instead of number)
  if (filters.vesselType) {
    filtered = filtered.filter(vessel => vessel.vesselType === filters.vesselType)
  }

  // Status filter - NEW FORMAT ('online', 'stale', 'offline')
  if (filters.status) {
    filtered = filtered.filter(vessel => vessel.status === filters.status)
  }

  // Speed filter
  if (filters.minSpeed !== undefined) {
    filtered = filtered.filter(vessel => vessel.speed >= filters.minSpeed)
  }
  if (filters.maxSpeed !== undefined) {
    filtered = filtered.filter(vessel => vessel.speed <= filters.maxSpeed)
  }

  return filtered
}

/**
 * Get status display name
 */
export const getStatusDisplayName = (status) => {
  const statusMap = {
    online: 'Çevrimiçi',
    stale: 'Belirsiz',
    offline: 'Çevrimdışı'
  }
  return statusMap[status] || status
}
