import { useState } from 'react'
import { X, Menu } from 'lucide-react'
import SearchBar from './SearchBar'
import FilterPanel from './FilterPanel'
import VesselCard from './VesselCard'
import LoadingSpinner from './LoadingSpinner'
import EmptyState from './EmptyState'
import { filterVessels } from '../utils/helpers'
import { vesselTypes } from '../data/mockVessels'

const VesselSidebar = ({ vessels, selectedVessel, onVesselSelect, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({})
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const filteredVessels = filterVessels(vessels, searchQuery, filters)

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="p-2 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-adyk-navy">
            Gemiler
            <span className="ml-1 text-xs font-normal text-gray-500">
              ({filteredVessels.length})
            </span>
          </h2>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Gemi veya MMSI ara..."
        />
      </div>

      {/* Filters */}
      <div className="p-2 bg-white border-b border-gray-200">
        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          vesselTypes={vesselTypes}
        />
      </div>

      {/* Vessel List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {isLoading ? (
          <LoadingSpinner text="Gemiler yükleniyor..." />
        ) : filteredVessels.length === 0 ? (
          <EmptyState
            message="Gemi bulunamadı"
            description="Arama kriterlerinizi değiştirmeyi deneyin"
          />
        ) : (
          filteredVessels.map((vessel) => (
            <VesselCard
              key={vessel.mmsi}
              vessel={vessel}
              isSelected={selectedVessel?.mmsi === vessel.mmsi}
              onClick={onVesselSelect}
            />
          ))
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-14 left-4 z-40 bg-white p-3 rounded-lg shadow-lg border-2 border-adyk-ocean hover:bg-gray-50 transition-colors duration-200"
      >
        <Menu className="w-6 h-6 text-adyk-ocean" />
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-72 border-r border-gray-200 h-full">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="md:hidden fixed inset-y-0 left-0 w-72 max-w-full z-50 shadow-2xl">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  )
}

export default VesselSidebar
