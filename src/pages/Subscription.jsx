import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Anchor, CheckCircle, AlertTriangle, Loader2, Check, Clock } from 'lucide-react'
import DeviceSelector from '../components/DeviceSelector'
import AddressForm from '../components/AddressForm'
import LoadingSpinner from '../components/LoadingSpinner'
import { getSubscriptionStatus, getPhoneNumber, createOrder, getMyOrders, getAccessToken, logout } from '../utils/auth'

const API_URL = 'https://api.adyk.online'

const Subscription = () => {
  const navigate = useNavigate()
  const [subStatus, setSubStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitStep, setSubmitStep] = useState('')
  const [error, setError] = useState('')

  // Tracker question (renamed from hasGozcu)
  const [hasTracker, setHasTracker] = useState(null)

  // Gözcü (tag) check from API
  const [hasGozcu, setHasGozcu] = useState(false)

  // Bank transfer modal
  const [bankInfo, setBankInfo] = useState(null)
  const [showBankModal, setShowBankModal] = useState(false)
  const [orderId, setOrderId] = useState(null)

  // Device selection
  const [selectedDevice, setSelectedDevice] = useState('')
  const [tagSelected, setTagSelected] = useState(false)
  const [total, setTotal] = useState(0)

  // Vessel name
  const [vesselName, setVesselName] = useState('')

  // Address form
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: getPhoneNumber(),
    address: '',
    city: '',
    district: '',
  })
  const [addressErrors, setAddressErrors] = useState({})

  // Success modal (free subscription)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Pending order
  const [pendingOrder, setPendingOrder] = useState(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await getSubscriptionStatus()
        setSubStatus(status)

        // Check for pending orders
        try {
          const ordersRes = await getMyOrders()
          const orders = Array.isArray(ordersRes) ? ordersRes : (ordersRes.data || [])
          if (orders.length > 0) {
            const pending = orders.find(o =>
              ['pending', 'pending_transfer', 'paid', 'shipped'].includes(o.status)
            )
            if (pending) {
              setPendingOrder(pending)
            }
          }
        } catch {
          // No orders or error - ignore
        }
      } catch {
        // No subscription or error - show purchase form
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [])

  // Check if user already has a Gözcü tag
  useEffect(() => {
    const checkGozcu = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/has-gozcu`, {
          headers: { Authorization: `Bearer ${getAccessToken()}` }
        })
        const data = await response.json()
        setHasGozcu(data.hasGozcu)
      } catch (error) {
        console.error('Gözcü check error:', error)
      }
    }
    checkGozcu()
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
    if (hasTracker === null) {
      setError('Lütfen mevcut cihaz durumunuzu seçin')
      return
    }
    if (!hasTracker && !selectedDevice) {
      setError('Lütfen bir takip cihazı seçin')
      return
    }
    if (selectedDevice && !vesselName.trim()) {
      setError('Lütfen tekne ismini girin')
      return
    }
    if (!validateAddress()) {
      setError('Lütfen tüm alanları doldurun')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      // Step 1: Create order
      setSubmitStep('Sipariş oluşturuluyor...')

      const items = []
      if (selectedDevice) {
        items.push({ type: selectedDevice })
      }
      if (tagSelected && !hasGozcu) {
        items.push({ type: 'tag' })
      }

      const orderRes = await createOrder({
        items,
        vesselName: vesselName.trim(),
        fullName: addressForm.fullName,
        phone: addressForm.phone,
        address: addressForm.address,
        city: addressForm.city,
        district: addressForm.district,
        paymentMethod: 'bank_transfer',
        hasTracker,
      })

      // API returns { success, data: { orderId } }
      const resOrderId = orderRes.data?.orderId || orderRes.orderId || orderRes.id
      if (!resOrderId) {
        throw new Error('Sipariş oluşturulamadı: orderId alınamadı')
      }

      // CHECK: If free subscription (hasTracker with no device, totalAmount = 0)
      const resStatus = orderRes.data?.status
      const resTotalAmount = parseFloat(orderRes.data?.totalAmount ?? -1)
      if (resStatus === 'paid' && resTotalAmount === 0) {
        setSubmitting(false)
        setShowSuccessModal(true)
        setSuccessMessage('Aboneliğiniz ücretsiz olarak aktif edildi!')
        setTimeout(() => {
          navigate('/ais')
        }, 2000)
        return
      }

      // Always bank transfer
      setBankInfo(orderRes.data?.bankInfo)
      setOrderId(resOrderId)
      setShowBankModal(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
      setSubmitStep('')
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

  const hasActive = subStatus?.hasSubscription && (subStatus.status === 'active' || subStatus.status === 'grace')
  const isExpired = subStatus?.hasSubscription && subStatus.status === 'expired'

  const orderStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Ödeme Bekleniyor'
      case 'pending_transfer': return 'Havale Bekleniyor'
      case 'paid': return 'Ödendi - Hazırlanıyor'
      case 'shipped': return 'Kargoya Verildi'
      default: return status
    }
  }

  const orderStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600'
      case 'pending_transfer': return 'text-orange-600'
      case 'paid': return 'text-blue-600'
      case 'shipped': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-adyk-navy text-white px-4 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <Anchor className="w-6 h-6" />
          <span className="font-bold text-lg">ADYK</span>
        </div>
        <button onClick={handleLogout} className="text-sm text-adyk-light hover:underline">
          Çıkış Yap
        </button>
      </div>

      <div className="max-w-lg mx-auto p-4 pt-20 pb-8 space-y-6">
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

        {/* Pending order info */}
        {!hasActive && pendingOrder && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-adyk-navy">Siparişiniz İşleniyor</h2>
              <p className="text-gray-600 mt-2 text-sm">Mevcut bir siparişiniz bulunmaktadır.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sipariş No:</span>
                <span className="font-bold text-adyk-ocean">{pendingOrder.orderId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Durum:</span>
                <span className={`font-medium ${orderStatusColor(pendingOrder.status)}`}>
                  {orderStatusLabel(pendingOrder.status)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tutar:</span>
                <span className="font-bold">{parseFloat(pendingOrder.totalAmount).toLocaleString('tr-TR')} TL</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tarih:</span>
                <span>{new Date(pendingOrder.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>

            {pendingOrder.status === 'pending_transfer' && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Havale Bilgileri:</strong><br/>
                  Banka: ALTERNATİF İNŞAAT TAAHHÜT DENİZCİLİK SAN TİC LTD ŞTİ<br/>
                  IBAN: TR89 0006 4000 0011 1480 9657 92<br/>
                  Açıklama: Cep telefonu numaranız
                </p>
              </div>
            )}

            <button
              onClick={() => navigate('/ais')}
              className="w-full py-2.5 bg-adyk-ocean text-white rounded-lg font-medium hover:bg-adyk-accent transition"
            >
              Haritaya Git
            </button>
          </div>
        )}

        {/* Purchase form - show when no active subscription and no pending order */}
        {!hasActive && !pendingOrder && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-6">
            <h2 className="text-lg font-bold text-adyk-navy">Abonelik Satın Al</h2>

            {/* Mevcut Cihaz Durumu Sorusu */}
            <div className="mb-6">
              <h3 className="font-semibold text-adyk-navy mb-3">Mevcut Cihaz Durumu</h3>
              <p className="text-sm text-gray-600 mb-4">Başka firmadan takip cihazınız var mı?</p>
              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="hasTracker"
                    checked={hasTracker === true}
                    onChange={() => {
                      setHasTracker(true)
                      setSelectedDevice('')
                      setTagSelected(false)
                    }}
                    className="w-4 h-4 text-adyk-ocean"
                  />
                  <div className="ml-3">
                    <span className="font-medium">Evet, takip cihazım var</span>
                    <p className="text-sm text-green-600">İndirimli fiyattan yararlanın</p>
                  </div>
                </label>
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="hasTracker"
                    checked={hasTracker === false}
                    onChange={() => {
                      setHasTracker(false)
                      setSelectedDevice('')
                      setTagSelected(false)
                    }}
                    className="w-4 h-4 text-adyk-ocean"
                  />
                  <div className="ml-3">
                    <span className="font-medium">Hayır, takip cihazım yok</span>
                    <p className="text-sm text-gray-500">Standart fiyat uygulanır</p>
                  </div>
                </label>
              </div>
            </div>

            {hasTracker !== null && (
              <DeviceSelector
                selectedDevice={selectedDevice}
                onDeviceChange={(val) => { setSelectedDevice(val); setError('') }}
                tagSelected={tagSelected}
                onTagChange={setTagSelected}
                total={total}
                onTotalChange={setTotal}
                hasTracker={hasTracker}
                hasGozcu={hasGozcu}
              />
            )}

            <div className="border-t border-gray-100 pt-4">
              <AddressForm
                form={addressForm}
                onChange={setAddressForm}
                errors={addressErrors}
              />

              {/* Vessel Name - after phone, before address */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tekne İsmi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={vesselName}
                  onChange={(e) => setVesselName(e.target.value.toUpperCase())}
                  placeholder="Örn: MAVI RÜYA"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adyk-ocean"
                  required
                />
              </div>
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
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{submitStep}</span>
                </>
              ) : (
                hasTracker && !selectedDevice
                  ? 'Aboneliği Aktif Et'
                  : 'Siparişi Tamamla'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Bank Transfer Modal */}
      {showBankModal && bankInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-adyk-navy">Siparişiniz Oluşturuldu</h2>
              <p className="text-gray-600 text-sm mt-2">Aşağıdaki hesaba havale/EFT yapınız</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-6">
              <div>
                <span className="text-sm text-gray-500">Banka</span>
                <p className="font-medium">{bankInfo.bankName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">IBAN</span>
                <p className="font-medium font-mono text-sm">{bankInfo.iban}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Hesap Sahibi</span>
                <p className="font-medium">{bankInfo.accountHolder}</p>
              </div>
              <div className="border-t pt-3">
                <span className="text-sm text-gray-500">Açıklama (Dekonta yazın)</span>
                <p className="font-bold text-adyk-ocean text-lg">{bankInfo.description}</p>
              </div>
              <div className="border-t pt-3">
                <span className="text-sm text-gray-500">Tutar</span>
                <p className="font-bold text-xl text-adyk-navy">{total.toLocaleString('tr-TR')} TL</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Önemli:</strong> Havale açıklamasına cep telefonu numaranızı (<strong>{bankInfo.description}</strong>) yazmayı unutmayınız.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(bankInfo.iban.replace(/\s/g, ''))
                }}
                className="flex-1 py-2.5 border border-adyk-ocean text-adyk-ocean rounded-lg font-medium hover:bg-adyk-light transition"
              >
                IBAN Kopyala
              </button>
              <button
                onClick={() => navigate('/ais')}
                className="flex-1 py-2.5 bg-adyk-ocean text-white rounded-lg font-medium hover:bg-adyk-accent transition"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Free Subscription Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-adyk-navy mb-2">Tebrikler!</h2>
            <p className="text-gray-600 mb-4">{successMessage}</p>
            <p className="text-sm text-gray-500">Harita sayfasına yönlendiriliyorsunuz...</p>
            <div className="mt-4">
              <div className="animate-spin w-6 h-6 border-2 border-adyk-ocean border-t-transparent rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Subscription
