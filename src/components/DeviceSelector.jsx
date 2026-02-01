import { useEffect, useState } from 'react'
import { Radio, Wifi, Tag } from 'lucide-react'
import { getPricing } from '../utils/auth'
import LoadingSpinner from './LoadingSpinner'

const DeviceSelector = ({ selectedDevice, onDeviceChange, tagSelected, onTagChange, total, onTotalChange }) => {
  const [pricing, setPricing] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const data = await getPricing()
        setPricing(Array.isArray(data) ? data : data.items || [])
      } catch (err) {
        setError('Fiyat bilgisi yüklenemedi')
      } finally {
        setLoading(false)
      }
    }
    fetchPricing()
  }, [])

  useEffect(() => {
    let sum = 0
    const device = pricing.find((p) => p.type === selectedDevice)
    if (device) sum += device.price
    if (tagSelected) {
      const tag = pricing.find((p) => p.type === 'tag')
      sum += tag ? tag.price : 700
    }
    onTotalChange(sum)
  }, [selectedDevice, tagSelected, pricing])

  if (loading) return <LoadingSpinner text="Fiyatlar yükleniyor..." />
  if (error) return <p className="text-red-500 text-sm">{error}</p>

  const devices = pricing.filter((p) => p.type === '2g' || p.type === '4g')
  const tagItem = pricing.find((p) => p.type === 'tag')

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Cihaz Seçimi</h3>
      <div className="space-y-2">
        {devices.map((device) => (
          <label
            key={device.type}
            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors
              ${selectedDevice === device.type
                ? 'border-adyk-ocean bg-adyk-light/30'
                : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            <input
              type="radio"
              name="device"
              value={device.type}
              checked={selectedDevice === device.type}
              onChange={(e) => onDeviceChange(e.target.value)}
              className="accent-adyk-ocean"
            />
            {device.type === '2g' ? (
              <Radio className="w-5 h-5 text-adyk-accent" />
            ) : (
              <Wifi className="w-5 h-5 text-adyk-accent" />
            )}
            <span className="flex-1 text-sm font-medium text-gray-800">{device.name}</span>
            <span className="text-sm font-semibold text-adyk-navy">{device.price.toLocaleString('tr-TR')} TL</span>
          </label>
        ))}
      </div>

      {tagItem && (
        <label
          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors
            ${tagSelected
              ? 'border-adyk-ocean bg-adyk-light/30'
              : 'border-gray-200 hover:border-gray-300'
            }`}
        >
          <input
            type="checkbox"
            checked={tagSelected}
            onChange={(e) => onTagChange(e.target.checked)}
            className="accent-adyk-ocean w-4 h-4"
          />
          <Tag className="w-5 h-5 text-adyk-accent" />
          <span className="flex-1 text-sm font-medium text-gray-800">{tagItem.name}</span>
          <span className="text-sm font-semibold text-adyk-navy">+{tagItem.price.toLocaleString('tr-TR')} TL</span>
        </label>
      )}

      {total > 0 && (
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-sm font-semibold text-gray-700">Toplam</span>
          <span className="text-lg font-bold text-adyk-navy">{total.toLocaleString('tr-TR')} TL</span>
        </div>
      )}
    </div>
  )
}

export default DeviceSelector
