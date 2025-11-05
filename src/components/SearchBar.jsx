import { Search, X } from 'lucide-react'

const SearchBar = ({ value, onChange, placeholder = "Gemi adı veya MMSI ara..." }) => {
  const handleClear = () => {
    onChange('')
  }

  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 pl-8 pr-8 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-adyk-ocean transition-colors duration-200 text-sm"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default SearchBar
