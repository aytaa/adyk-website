const AddressForm = ({ form, onChange, errors }) => {
  const handleChange = (field) => (e) => {
    onChange({ ...form, [field]: e.target.value })
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
          onChange={handleChange('phone')}
          placeholder="Telefon numarası"
          className={fieldClass('phone')}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">İl</label>
          <input
            type="text"
            value={form.city}
            onChange={handleChange('city')}
            placeholder="İl"
            className={fieldClass('city')}
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">İlçe</label>
          <input
            type="text"
            value={form.district}
            onChange={handleChange('district')}
            placeholder="İlçe"
            className={fieldClass('district')}
          />
          {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
        </div>
      </div>
    </div>
  )
}

export default AddressForm
