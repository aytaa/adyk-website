import { useEffect, useState } from 'react'
import { Radio, Wifi, Tag, ShoppingCart } from 'lucide-react'
import { getPricing } from '../utils/auth'
import LoadingSpinner from './LoadingSpinner'

const formatPrice = (price) => {
  return parseFloat(price).toLocaleString('tr-TR')
}

const DeviceSelector = ({ selectedDevice, onDeviceChange, tagSelected, onTagChange, total, onTotalChange }) => {
  const [pricing, setPricing] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await getPricing()
        // API returns { success, data: [...] }
        const items = Array.isArray(res) ? res : (res.data || res.items || [])
        // Parse prices to numbers, filter active only
        const parsed = items
          .filter((item) => item.isActive !== false)
          .map((item) => ({
            ...item,
            price: parseFloat(item.price) || 0,
          }))
        setPricing(parsed)
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
  const selectedDeviceItem = pricing.find((p) => p.type === selectedDevice)

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Cihaz Seçimi</h3>

      {/* Tracker radio buttons */}
      <div className="space-y-2">
        {devices.map((device) => (
          <label
            key={device.type}
            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors
              ${selectedDevice === device.type
                ? 'border-adyk-ocean bg-adyk-light/30 shadow-sm'
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
              <Radio className="w-5 h-5 text-adyk-accent flex-shrink-0" />
            ) : (
              <Wifi className="w-5 h-5 text-adyk-accent flex-shrink-0" />
            )}
            <span className="flex-1 text-sm font-medium text-gray-800">{device.name}</span>
            <span className="text-sm font-semibold text-adyk-navy">{formatPrice(device.price)} TL</span>
          </label>
        ))}
      </div>

      {/* Tag checkbox */}
      {tagItem && (
        <label
          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors
            ${tagSelected
              ? 'border-adyk-ocean bg-adyk-light/30 shadow-sm'
              : 'border-gray-200 hover:border-gray-300'
            }`}
        >
          <input
            type="checkbox"
            checked={tagSelected}
            onChange={(e) => onTagChange(e.target.checked)}
            className="accent-adyk-ocean w-4 h-4"
          />
          <Tag className="w-5 h-5 text-adyk-accent flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-800">{tagItem.name}</span>
            <span className="text-xs text-gray-500 ml-1">(Opsiyonel)</span>
          </div>
          <span className="text-sm font-semibold text-adyk-navy">+{formatPrice(tagItem.price)} TL</span>
        </label>
      )}

      {/* Price breakdown */}
      {(selectedDeviceItem || tagSelected) && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="w-4 h-4 text-adyk-navy" />
            <span className="text-sm font-semibold text-adyk-navy">Seçilen Ürünler</span>
          </div>

          {selectedDeviceItem && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{selectedDeviceItem.name}</span>
              <span className="font-medium text-gray-800">{formatPrice(selectedDeviceItem.price)} TL</span>
            </div>
          )}

          {tagSelected && tagItem && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{tagItem.name}</span>
              <span className="font-medium text-gray-800">{formatPrice(tagItem.price)} TL</span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Toplam</span>
            <span className="text-lg font-bold text-adyk-navy">{formatPrice(total)} TL</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeviceSelector
