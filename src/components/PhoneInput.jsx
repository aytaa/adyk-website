import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'

const countries = [
  { code: 'TR', name: 'Türkiye', dialCode: '+90', mask: 'XXX XXX XX XX', placeholder: '532 123 45 67', maxLength: 10 },
  { code: 'US', name: 'ABD', dialCode: '+1', mask: 'XXX XXX XXXX', placeholder: '555 123 4567', maxLength: 10 },
  { code: 'GB', name: 'İngiltere', dialCode: '+44', mask: 'XXXX XXXXXX', placeholder: '7911 123456', maxLength: 10 },
  { code: 'DE', name: 'Almanya', dialCode: '+49', mask: 'XXX XXXXXXXX', placeholder: '151 12345678', maxLength: 11 },
  { code: 'FR', name: 'Fransa', dialCode: '+33', mask: 'X XX XX XX XX', placeholder: '6 12 34 56 78', maxLength: 9 },
  { code: 'IT', name: 'İtalya', dialCode: '+39', mask: 'XXX XXX XXXX', placeholder: '312 345 6789', maxLength: 10 },
  { code: 'ES', name: 'İspanya', dialCode: '+34', mask: 'XXX XXX XXX', placeholder: '612 345 678', maxLength: 9 },
  { code: 'NL', name: 'Hollanda', dialCode: '+31', mask: 'X XXXXXXXX', placeholder: '6 12345678', maxLength: 9 },
  { code: 'BE', name: 'Belçika', dialCode: '+32', mask: 'XXX XX XX XX', placeholder: '470 12 34 56', maxLength: 9 },
  { code: 'AT', name: 'Avusturya', dialCode: '+43', mask: 'XXX XXXXXXX', placeholder: '664 1234567', maxLength: 10 },
  { code: 'CH', name: 'İsviçre', dialCode: '+41', mask: 'XX XXX XX XX', placeholder: '79 123 45 67', maxLength: 9 },
  { code: 'GR', name: 'Yunanistan', dialCode: '+30', mask: 'XXX XXX XXXX', placeholder: '691 234 5678', maxLength: 10 },
  { code: 'PT', name: 'Portekiz', dialCode: '+351', mask: 'XXX XXX XXX', placeholder: '912 345 678', maxLength: 9 },
  { code: 'PL', name: 'Polonya', dialCode: '+48', mask: 'XXX XXX XXX', placeholder: '512 345 678', maxLength: 9 },
  { code: 'SE', name: 'İsveç', dialCode: '+46', mask: 'XX XXX XX XX', placeholder: '70 123 45 67', maxLength: 9 },
  { code: 'NO', name: 'Norveç', dialCode: '+47', mask: 'XXX XX XXX', placeholder: '412 34 567', maxLength: 8 },
  { code: 'DK', name: 'Danimarka', dialCode: '+45', mask: 'XX XX XX XX', placeholder: '20 12 34 56', maxLength: 8 },
  { code: 'FI', name: 'Finlandiya', dialCode: '+358', mask: 'XX XXXXXXX', placeholder: '40 1234567', maxLength: 9 },
  { code: 'RU', name: 'Rusya', dialCode: '+7', mask: 'XXX XXX XX XX', placeholder: '912 345 67 89', maxLength: 10 },
  { code: 'UA', name: 'Ukrayna', dialCode: '+380', mask: 'XX XXX XX XX', placeholder: '50 123 45 67', maxLength: 9 },
  { code: 'AE', name: 'BAE', dialCode: '+971', mask: 'XX XXX XXXX', placeholder: '50 123 4567', maxLength: 9 },
  { code: 'SA', name: 'Suudi Arabistan', dialCode: '+966', mask: 'XX XXX XXXX', placeholder: '50 123 4567', maxLength: 9 },
  { code: 'EG', name: 'Mısır', dialCode: '+20', mask: 'XXX XXX XXXX', placeholder: '100 123 4567', maxLength: 10 },
  { code: 'AU', name: 'Avustralya', dialCode: '+61', mask: 'XXX XXX XXX', placeholder: '412 345 678', maxLength: 9 },
  { code: 'JP', name: 'Japonya', dialCode: '+81', mask: 'XX XXXX XXXX', placeholder: '90 1234 5678', maxLength: 10 },
  { code: 'CN', name: 'Çin', dialCode: '+86', mask: 'XXX XXXX XXXX', placeholder: '131 1234 5678', maxLength: 11 },
  { code: 'IN', name: 'Hindistan', dialCode: '+91', mask: 'XXXXX XXXXX', placeholder: '98765 43210', maxLength: 10 },
  { code: 'BR', name: 'Brezilya', dialCode: '+55', mask: 'XX XXXXX XXXX', placeholder: '11 91234 5678', maxLength: 11 },
  { code: 'MX', name: 'Meksika', dialCode: '+52', mask: 'XX XXXX XXXX', placeholder: '55 1234 5678', maxLength: 10 },
  { code: 'CA', name: 'Kanada', dialCode: '+1', mask: 'XXX XXX XXXX', placeholder: '416 123 4567', maxLength: 10 },
  { code: 'AZ', name: 'Azerbaycan', dialCode: '+994', mask: 'XX XXX XX XX', placeholder: '50 123 45 67', maxLength: 9 },
  { code: 'GE', name: 'Gürcistan', dialCode: '+995', mask: 'XXX XX XX XX', placeholder: '555 12 34 56', maxLength: 9 },
  { code: 'KZ', name: 'Kazakistan', dialCode: '+7', mask: 'XXX XXX XX XX', placeholder: '701 123 45 67', maxLength: 10 },
  { code: 'BG', name: 'Bulgaristan', dialCode: '+359', mask: 'XX XXX XXXX', placeholder: '88 123 4567', maxLength: 9 },
  { code: 'RO', name: 'Romanya', dialCode: '+40', mask: 'XXX XXX XXX', placeholder: '721 123 456', maxLength: 9 },
  { code: 'HR', name: 'Hırvatistan', dialCode: '+385', mask: 'XX XXX XXXX', placeholder: '91 234 5678', maxLength: 9 },
  { code: 'CY', name: 'Kıbrıs', dialCode: '+357', mask: 'XX XXXXXX', placeholder: '96 123456', maxLength: 8 },
  { code: 'MT', name: 'Malta', dialCode: '+356', mask: 'XXXX XXXX', placeholder: '9900 1234', maxLength: 8 },
  { code: 'IL', name: 'İsrail', dialCode: '+972', mask: 'XX XXX XXXX', placeholder: '50 123 4567', maxLength: 9 },
]

const turkey = countries.find((c) => c.code === 'TR')
const sortedCountries = [
  turkey,
  ...countries.filter((c) => c.code !== 'TR').sort((a, b) => a.name.localeCompare(b.name, 'tr')),
]

const getFlagEmoji = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

const formatWithMask = (digits, mask) => {
  let formatted = ''
  let digitIndex = 0
  for (const char of mask) {
    if (digitIndex >= digits.length) break
    if (char === 'X') {
      formatted += digits[digitIndex]
      digitIndex++
    } else {
      formatted += char
    }
  }
  return formatted
}

const PhoneInput = ({ value, onChange, disabled, selectedCountry, onCountryChange }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  const searchRef = useRef(null)

  const country = selectedCountry || turkey

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus()
  }, [open])

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, country.maxLength)
    const formatted = formatWithMask(digits, country.mask)
    onChange(formatted)
  }

  const handleCountrySelect = (c) => {
    onCountryChange(c)
    onChange('')
    setOpen(false)
    setSearch('')
  }

  const filtered = sortedCountries.filter(
    (c) =>
      c.name.toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr')) ||
      c.dialCode.includes(search)
  )

  return (
    <div className="space-y-3">
      {/* Country selector */}
      <div ref={ref} className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">Ülke</label>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-left text-sm
            focus:ring-2 focus:ring-adyk-ocean focus:border-adyk-ocean
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'}
          `}
        >
          <span className="flex items-center gap-2">
            <span className="text-lg leading-none">{getFlagEmoji(country.code)}</span>
            <span className="text-gray-800">{country.name}</span>
            <span className="text-gray-400">{country.dialCode}</span>
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ülke ara..."
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-adyk-ocean focus:border-adyk-ocean"
                />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-3 py-4 text-sm text-gray-400 text-center">Sonuç bulunamadı</div>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.code + c.dialCode}
                    type="button"
                    onClick={() => handleCountrySelect(c)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-adyk-ocean/10 transition-colors
                      ${country.code === c.code ? 'bg-adyk-ocean/15 font-medium' : ''}
                    `}
                  >
                    <span className="text-lg leading-none">{getFlagEmoji(c.code)}</span>
                    <span className="flex-1 text-gray-800">{c.name}</span>
                    <span className="text-gray-400 text-xs">{c.dialCode}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Phone input with dial code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon Numarası</label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-adyk-ocean focus-within:border-adyk-ocean">
          <div className="flex items-center gap-1.5 px-3 py-3 bg-gray-50 border-r border-gray-300 text-sm font-medium text-gray-600 select-none">
            <span className="text-base leading-none">{getFlagEmoji(country.code)}</span>
            <span>{country.dialCode}</span>
          </div>
          <input
            type="tel"
            value={value}
            onChange={handlePhoneChange}
            disabled={disabled}
            placeholder={country.placeholder}
            className="flex-1 px-3 py-3 text-sm outline-none disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
      </div>
    </div>
  )
}

export { sortedCountries, getFlagEmoji }
export default PhoneInput
