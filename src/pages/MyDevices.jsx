import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Smartphone, Radio, Wifi, Tag } from 'lucide-react'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import { getMyDevices } from '../utils/auth'

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const deviceIcon = (type) => {
  switch (type) {
    case '2g': return <Radio className="w-5 h-5 text-adyk-accent" />
    case '4g': return <Wifi className="w-5 h-5 text-adyk-accent" />
    case 'tag': return <Tag className="w-5 h-5 text-adyk-accent" />
    default: return <Smartphone className="w-5 h-5 text-adyk-accent" />
  }
}

const MyDevices = () => {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await getMyDevices()
        const items = Array.isArray(res) ? res : (res.data || [])
        setDevices(items)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDevices()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-adyk-light">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <LoadingSpinner text="Cihazlar yükleniyor..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-adyk-light">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/ais" className="text-adyk-ocean hover:text-adyk-accent transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-adyk-navy">Cihazlarım</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {devices.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Smartphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Henüz cihazınız bulunmuyor</p>
            <Link to="/subscription" className="text-adyk-ocean hover:underline text-sm">
              Cihaz Satın Al
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {devices.map((device) => (
              <div key={device.id || device._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {deviceIcon(device.type)}
                    <div>
                      <h3 className="font-semibold text-adyk-navy">{device.name || 'Cihaz'}</h3>
                      <p className="text-xs text-gray-500">IMEI: {device.imei || '-'}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    device.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {device.isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-1 mb-3">
                  <p>Tür: {device.type === 'tag' ? 'Tag' : device.type === '4g' ? '4G Tracker' : device.type === '2g' ? '2G Tracker' : 'Tracker'}</p>
                  <p>Son Güncelleme: {formatDate(device.lastUpdate || device.updatedAt)}</p>
                </div>

                <Link
                  to={`/ais?vessel=${device.id || device._id}`}
                  className="text-adyk-ocean text-sm hover:underline font-medium"
                >
                  Haritada Göster →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyDevices
