import { useRef, useEffect } from 'react'

const OTPInput = ({ value, onChange, length = 6, disabled }) => {
  const inputs = useRef([])

  useEffect(() => {
    if (!disabled && inputs.current[0]) {
      inputs.current[0].focus()
    }
  }, [disabled])

  const handleChange = (index, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    const newValue = value.split('')
    newValue[index] = char
    const joined = newValue.join('').slice(0, length)
    onChange(joined.padEnd(length, ' ').trimEnd())

    if (char && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasted)
    const focusIndex = Math.min(pasted.length, length - 1)
    inputs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-11 h-13 text-center text-xl font-semibold border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-adyk-ocean focus:border-adyk-ocean outline-none
            disabled:bg-gray-100 disabled:text-gray-500"
        />
      ))}
    </div>
  )
}

export default OTPInput
