import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Anchor, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import DeviceSelector from '../components/DeviceSelector'
import AddressForm from '../components/AddressForm'
import PayTRIframe from '../components/PayTRIframe'
import LoadingSpinner from '../components/LoadingSpinner'
import { getSubscriptionStatus, getPhoneNumber, createOrder, initPayment, logout } from '../utils/auth'

const Subscription = () => {
  const navigate = useNavigate()
  const [subStatus, setSubStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Device selection
  const [selectedDevice, setSelectedDevice] = useState('')
  const [tagSelected, setTagSelected] = useState(false)
  const [total, setTotal] = useState(0)

  // Address form
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: getPhoneNumber(),
    address: '',
    city: '',
    district: '',
  })
  const [addressErrors, setAddressErrors] = useState({})

  // Payment
  const [paytrToken, setPaytrToken] = useState('')

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await getSubscriptionStatus()
        setSubStatus(status)
        if (status.hasSubscription && (status.status === 'active' || status.status === 'grace')) {
          // User has active subscription - they can still view this page
        }
      } catch {
        // No subscription or error - show purchase form
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [])

  const validateAddress = () => {
    const errs = {}
    if (!addressForm.fullName.trim()) errs.fullName = 'Zorunlu alan'
    if (!addressForm.phone.trim()) errs.phone = 'Zorunlu alan'
    if (!addressForm.address.trim()) errs.address = 'Zorunlu alan'
    if (!addressForm.city.trim()) errs.city = 'Zorunlu alan'
    if (!addressForm.district.trim()) errs.district = 'Zorunlu alan'
    setAddressErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!selectedDevice) {
      setError('Lütfen bir cihaz seçin')
      return
    }
    if (!validateAddress()) {
      setError('Lütfen tüm alanları doldurun')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      const items = [{ type: selectedDevice, quantity: 1 }]
      if (tagSelected) {
        items.push({ type: 'tag', quantity: 1 })
      }

      const order = await createOrder({
        items,
        fullName: addressForm.fullName,
        phone: addressForm.phone,
        address: addressForm.address,
        city: addressForm.city,
        district: addressForm.district,
      })

      const payment = await initPayment(order.orderId || order.id)
      setPaytrToken(payment.token || payment.iframeToken)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Abonelik bilgileri yükleniyor..." />
      </div>
    )
  }

  // If PayTR iframe token is available, show payment iframe
  if (paytrToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <h2 className="text-xl font-bold text-adyk-navy text-center mb-4">Ödeme</h2>
          <PayTRIframe token={paytrToken} />
        </div>
      </div>
    )
  }

  const hasActive = subStatus?.hasSubscription && (subStatus.status === 'active' || subStatus.status === 'grace')
  const isExpired = subStatus?.hasSubscription && subStatus.status === 'expired'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-adyk-navy text-white px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Anchor className="w-6 h-6" />
          <span className="font-bold text-lg">ADYK</span>
        </div>
        <button onClick={handleLogout} className="text-sm text-adyk-light hover:underline">
          Çıkış Yap
        </button>
      </div>

      <div className="max-w-lg mx-auto p-4 py-8 space-y-6">
        {/* Active subscription info */}
        {hasActive && (
          <div className="bg-white rounded-xl border border-green-200 p-5 space-y-3">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <h2 className="font-semibold">Aktif Abonelik</h2>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Durum: <span className="font-medium text-green-700">
                {subStatus.status === 'active' ? 'Aktif' : 'Tolerans Süresi'}
              </span></p>
              {subStatus.endDate && (
                <p>Bitiş Tarihi: <span className="font-medium">
                  {new Date(subStatus.endDate).toLocaleDateString('tr-TR')}
                </span></p>
              )}
              {subStatus.daysRemaining != null && (
                <p>Kalan Gün: <span className="font-medium">{subStatus.daysRemaining}</span></p>
              )}
            </div>
            <button
              onClick={() => navigate('/ais')}
              className="w-full py-2.5 bg-adyk-ocean text-white font-semibold rounded-lg hover:bg-adyk-accent transition-colors"
            >
              Panele Git
            </button>
          </div>
        )}

        {/* Expired warning */}
        {isExpired && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Aboneliğiniz Sona Erdi</p>
              <p className="text-xs text-amber-700 mt-1">
                Panele erişmek için lütfen aboneliğinizi yenileyin.
              </p>
            </div>
          </div>
        )}

        {/* Purchase form - show when no active subscription */}
        {!hasActive && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-6">
            <h2 className="text-lg font-bold text-adyk-navy">Abonelik Satın Al</h2>

            <DeviceSelector
              selectedDevice={selectedDevice}
              onDeviceChange={setSelectedDevice}
              tagSelected={tagSelected}
              onTagChange={setTagSelected}
              total={total}
              onTotalChange={setTotal}
            />

            <div className="border-t border-gray-100 pt-4">
              <AddressForm
                form={addressForm}
                onChange={setAddressForm}
                errors={addressErrors}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 bg-adyk-ocean text-white font-semibold rounded-lg
                hover:bg-adyk-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Ödemeye Geç'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Subscription
