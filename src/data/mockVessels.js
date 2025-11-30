// Mock vessel data - Ready for MyShipTracking API integration
// Data structure matches typical AIS API responses

// Legacy numeric vessel types (for old format)
const vesselTypesLegacy = {
  70: 'Kargo Gemisi',
  80: 'Tanker',
  60: 'Yolcu Gemisi',
  30: 'Balıkçı',
  36: 'Yelkenli',
  37: 'Eğlence Teknesi',
  52: 'Römorkör'
}

// NEW FORMAT: String-based vessel types
const vesselTypes = [
  'Motorlu',
  'Yelkenli',
  'Balıkçı',
  'Kargo',
  'Yolcu',
  'Unknown'
]

// Legacy numeric navigation status
const navigationStatus = {
  0: 'Seyirde',
  1: 'Demirde',
  2: 'Kontrol Yok',
  5: 'Yanaşık',
  8: 'Yelkenle Seyirde'
}

// NEW FORMAT: String-based status options
const statusOptions = [
  { value: 'online', label: 'Çevrimiçi' },
  { value: 'stale', label: 'Belirsiz' },
  { value: 'offline', label: 'Çevrimdışı' }
]

// Turkish coastal coordinates
const turkishCoordinates = [
  { lat: 41.0082, lon: 28.9784 }, // İstanbul
  { lat: 40.9631, lon: 27.5855 }, // Çanakkale
  { lat: 38.4189, lon: 27.1287 }, // İzmir
  { lat: 36.8969, lon: 30.7133 }, // Antalya
  { lat: 36.3356, lon: 33.8319 }, // Mersin
  { lat: 41.2867, lon: 36.3300 }, // Samsun
  { lat: 40.7606, lon: 31.5656 }, // Zonguldak
  { lat: 37.8746, lon: 27.2663 }, // Kuşadası
]

// Generate random vessel data (legacy format)
const generateVessel = (mmsi, index) => {
  const coord = turkishCoordinates[index % turkishCoordinates.length]
  const randomOffset = () => (Math.random() - 0.5) * 2 // Random offset within ~100km

  const typeKey = Object.keys(vesselTypesLegacy)[Math.floor(Math.random() * Object.keys(vesselTypesLegacy).length)]
  const statusKey = Object.keys(navigationStatus)[Math.floor(Math.random() * Object.keys(navigationStatus).length)]

  return {
    mmsi: mmsi,
    imo: 9000000 + Math.floor(Math.random() * 999999),
    name: `${['M/V', 'M/T', 'S/Y', 'F/V'][Math.floor(Math.random() * 4)]} ${['MARMARA', 'EGE', 'AKDENIZ', 'KARADENIZ', 'BOSPHORUS', 'ANATOLIA', 'ISTANBUL', 'ANKARA'][Math.floor(Math.random() * 8)]} ${Math.floor(Math.random() * 100)}`,
    callsign: `TC${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1000 + Math.random() * 9000)}`,
    type: parseInt(typeKey),
    typeName: vesselTypesLegacy[typeKey],
    status: parseInt(statusKey),
    statusName: navigationStatus[statusKey],
    position: {
      lat: coord.lat + randomOffset(),
      lon: coord.lon + randomOffset(),
      accuracy: Math.random() > 0.5
    },
    speed: parseFloat((Math.random() * 18).toFixed(1)), // 0-18 knots
    course: Math.floor(Math.random() * 360),
    heading: Math.floor(Math.random() * 360),
    destination: ['İSTANBUL', 'İZMİR', 'ANTALYA', 'MERSİN', 'SAMSUN', 'GEMLİK', 'ALİAĞA', 'AMBARLΙ'][Math.floor(Math.random() * 8)],
    eta: new Date(Date.now() + Math.random() * 172800000).toISOString(), // Next 48 hours
    draught: parseFloat((5 + Math.random() * 10).toFixed(1)),
    length: Math.floor(50 + Math.random() * 250),
    width: Math.floor(10 + Math.random() * 40),
    flag: 'TR',
    lastUpdate: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Last hour
    photo: null // Placeholder for vessel photo
  }
}

// Sample MMSI numbers (Turkish vessels typically start with 271)
const mmsiList = [
  271000001, 271000002, 271000003, 271000004, 271000005,
  271000006, 271000007, 271000008, 271000009, 271000010,
  271000011, 271000012, 271000013, 271000014, 271000015,
  271000016, 271000017, 271000018, 271000019, 271000020,
  271000021, 271000022, 271000023, 271000024, 271000025,
  271000026, 271000027, 271000028, 271000029, 271000030,
  271000031, 271000032, 271000033, 271000034, 271000035,
  271000036, 271000037, 271000038, 271000039, 271000040,
  271000041, 271000042, 271000043, 271000044, 271000045,
  271000046, 271000047, 271000048, 271000049, 271000050,
  271000051, 271000052, 271000053
]

export const mockVessels = mmsiList.map((mmsi, index) => generateVessel(mmsi, index))

export { vesselTypes, vesselTypesLegacy, navigationStatus, statusOptions }
