import { Filter, X } from 'lucide-react'
import { useState } from 'react'

const FilterPanel = ({ filters, onFilterChange, vesselTypes = [], statusOptions = [] }) => {
  const [isOpen, setIsOpen] = useState(false)

  // NEW FORMAT: Single select for vessel type
  const handleVesselTypeChange = (vesselType) => {
    onFilterChange({ ...filters, vesselType: vesselType || undefined })
  }

  // NEW FORMAT: Single select for status
  const handleStatusChange = (status) => {
    onFilterChange({ ...filters, status: status || undefined })
  }

  const clearFilters = () => {
    onFilterChange({})
  }

  const hasActiveFilters = () => {
    return filters.vesselType ||
           filters.status ||
           filters.minSpeed !== undefined ||
           filters.maxSpeed !== undefined
  }

  return (
    <div>
      {/* Filter Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:border-adyk-ocean transition-colors duration-200"
      >
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-adyk-ocean" />
          <span className="font-medium text-sm text-gray-700">Filtreler</span>
          {hasActiveFilters() && (
            <span className="bg-adyk-ocean text-white text-[10px] px-1.5 py-0.5 rounded-full">
              Aktif
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                clearFilters()
              }}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Temizle
            </button>
          )}
          <span className="text-gray-400 text-xs">{isOpen ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Filter Content */}
      {isOpen && (
        <div className="mt-2 p-2 bg-white border border-gray-200 rounded-lg space-y-3">
          {/* Vessel Type Filter - NEW FORMAT (dropdown) */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-1.5">Gemi Tipi</h4>
            <select
              value={filters.vesselType || ''}
              onChange={(e) => handleVesselTypeChange(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-adyk-ocean"
            >
              <option value="">Tümü</option>
              {vesselTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Status Filter - NEW FORMAT (dropdown) */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-1.5">Durum</h4>
            <select
              value={filters.status || ''}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-adyk-ocean"
            >
              <option value="">Tümü</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          {/* Speed Filter */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-1.5">Hız (knot)</h4>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minSpeed || ''}
                onChange={(e) => onFilterChange({
                  ...filters,
                  minSpeed: e.target.value ? parseFloat(e.target.value) : undefined
                })}
                className="w-16 h-8 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-adyk-ocean"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxSpeed || ''}
                onChange={(e) => onFilterChange({
                  ...filters,
                  maxSpeed: e.target.value ? parseFloat(e.target.value) : undefined
                })}
                className="w-16 h-8 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-adyk-ocean"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterPanel
