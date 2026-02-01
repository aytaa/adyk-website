import { Phone } from 'lucide-react'

const PhoneInput = ({ value, onChange, disabled }) => {
  const formatPhone = (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 10)
    let formatted = ''
    if (digits.length > 0) formatted += digits.slice(0, 3)
    if (digits.length > 3) formatted += ' ' + digits.slice(3, 6)
    if (digits.length > 6) formatted += ' ' + digits.slice(6, 8)
    if (digits.length > 8) formatted += ' ' + digits.slice(8, 10)
    return formatted
  }

  const handleChange = (e) => {
    const formatted = formatPhone(e.target.value)
    onChange(formatted)
  }

  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-adyk-ocean focus-within:border-adyk-ocean">
      <div className="flex items-center gap-1.5 px-3 py-3 bg-gray-50 border-r border-gray-300 text-sm font-medium text-gray-700 select-none">
        <Phone className="w-4 h-4 text-gray-400" />
        <span>+90</span>
      </div>
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="5XX XXX XX XX"
        className="flex-1 px-3 py-3 text-sm outline-none disabled:bg-gray-100 disabled:text-gray-500"
      />
    </div>
  )
}

export default PhoneInput
