import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { getCities, getDistricts } from '../data/turkeyLocations'

const SearchableSelect = ({ label, placeholder, value, options, onChange, disabled, error }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus()
    }
  }, [open])

  const filtered = options.filter((opt) =>
    opt.toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr'))
  )

  const handleSelect = (opt) => {
    onChange(opt)
    setOpen(false)
    setSearch('')
  }

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none text-left flex items-center justify-between
          focus:ring-2 focus:ring-adyk-ocean focus:border-adyk-ocean
          ${error ? 'border-red-400' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white cursor-pointer hover:border-gray-400'}
        `}
      >
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ara..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-adyk-ocean focus:border-adyk-ocean"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-sm text-gray-400 text-center">Sonuç bulunamadı</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-3 py-2.5 text-sm hover:bg-adyk-ocean/10 transition-colors
                    ${value === opt ? 'bg-adyk-ocean/15 text-adyk-navy font-medium' : 'text-gray-700'}
                  `}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

const AddressForm = ({ form, onChange, errors }) => {
  const cities = getCities()
  const districts = form.city ? getDistricts(form.city) : []

  const handleChange = (field) => (e) => {
    onChange({ ...form, [field]: e.target.value })
  }

  const handleCityChange = (city) => {
    onChange({ ...form, city, district: '' })
  }

  const handleDistrictChange = (district) => {
    onChange({ ...form, district })
  }

  const fieldClass = (field) =>
    `w-full px-3 py-2.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-adyk-ocean focus:border-adyk-ocean ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Teslimat Bilgileri</h3>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Ad Soyad</label>
        <input
          type="text"
          value={form.fullName}
          onChange={handleChange('fullName')}
          placeholder="Ad Soyad"
          className={fieldClass('fullName')}
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Telefon</label>
        <input
          type="tel"
          value={form.phone}
          readOnly
          disabled
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SearchableSelect
          label="İl"
          placeholder="İl seçin"
          value={form.city}
          options={cities}
          onChange={handleCityChange}
          error={errors.city}
        />
        <SearchableSelect
          label="İlçe"
          placeholder={form.city ? 'İlçe seçin' : 'Önce il seçin'}
          value={form.district}
          options={districts}
          onChange={handleDistrictChange}
          disabled={!form.city}
          error={errors.district}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Adres</label>
        <textarea
          value={form.address}
          onChange={handleChange('address')}
          placeholder="Açık adres"
          rows={3}
          className={fieldClass('address')}
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
      </div>
    </div>
  )
}

export default AddressForm
