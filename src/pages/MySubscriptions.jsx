import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CreditCard } from 'lucide-react'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import { getMySubscriptions, getMyOrders } from '../utils/auth'

const subTypeLabel = (type) => {
  switch (type) {
    case '2g': return '2G Tracker Aboneliği'
    case '4g': return '4G Tracker Aboneliği'
    case 'tag': return 'Tag Aboneliği'
    case 'gozcu': return 'Gözcü Aboneliği'
    default: return 'Abonelik'
  }
}

const statusBadge = (status) => {
  switch (status) {
    case 'active':
      return <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Aktif</span>
    case 'grace':
      return <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">Ek Süre</span>
    case 'expired':
      return <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">Süresi Doldu</span>
    default:
      return <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">{status}</span>
  }
}

const orderStatusBadge = (status) => {
  const styles = {
    completed: 'bg-green-100 text-green-800',
    paid: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    pending: 'bg-yellow-100 text-yellow-800',
    pending_transfer: 'bg-orange-100 text-orange-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  const labels = {
    completed: 'Tamamlandı',
    paid: 'Ödendi',
    shipped: 'Kargoda',
    pending: 'Beklemede',
    pending_transfer: 'Havale Bekleniyor',
    cancelled: 'İptal',
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {labels[status] || status}
    </span>
  )
}

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, orderRes] = await Promise.allSettled([
          getMySubscriptions(),
          getMyOrders(),
        ])

        if (subRes.status === 'fulfilled') {
          const subs = Array.isArray(subRes.value) ? subRes.value : (subRes.value.data || [])
          setSubscriptions(subs)
        }

        if (orderRes.status === 'fulfilled') {
          const ords = Array.isArray(orderRes.value) ? orderRes.value : (orderRes.value.data || [])
          setOrders(ords)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-adyk-light">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <LoadingSpinner text="Abonelikler yükleniyor..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-adyk-light">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/ais" className="text-adyk-ocean hover:text-adyk-accent transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-adyk-navy">Aboneliklerim</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Subscriptions */}
        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Aktif aboneliğiniz bulunmuyor</p>
            <Link to="/subscription" className="text-adyk-ocean hover:underline text-sm">
              Abonelik Satın Al
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((sub) => {
              const now = new Date()
              const endDate = new Date(sub.endDate)
              const startDate = new Date(sub.startDate)
              const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
              const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
              const progress = totalDays > 0 ? Math.max(0, Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100)) : 100

              return (
                <div key={sub.id || sub._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-adyk-navy">{subTypeLabel(sub.type)}</h3>
                      {sub.orderId && <p className="text-sm text-gray-500">Sipariş: {sub.orderId}</p>}
                    </div>
                    {statusBadge(sub.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Başlangıç:</span>
                      <p className="font-medium">{startDate.toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Bitiş:</span>
                      <p className="font-medium">{endDate.toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Kalan Süre</span>
                      <span className={`font-medium ${daysRemaining < 30 ? 'text-orange-600' : 'text-gray-700'}`}>
                        {daysRemaining > 0 ? `${daysRemaining} gün` : 'Süresi doldu'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${daysRemaining < 30 ? 'bg-orange-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.max(0, 100 - progress)}%` }}
                      ></div>
                    </div>
                  </div>

                  {daysRemaining > 0 && daysRemaining < 30 && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-800">
                        Aboneliğiniz {daysRemaining} gün içinde sona erecek
                      </p>
                    </div>
                  )}

                  {sub.status === 'expired' && (
                    <Link
                      to="/subscription"
                      className="mt-4 block w-full py-2.5 bg-adyk-ocean text-white text-center font-semibold rounded-lg hover:bg-adyk-accent transition-colors"
                    >
                      Aboneliği Yenile
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Order History */}
        {orders.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-adyk-navy mb-4">Sipariş Geçmişi</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sipariş No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr key={order.orderId || order.id || order._id}>
                        <td className="px-4 py-3 text-sm font-medium text-adyk-ocean">{order.orderId || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('tr-TR') : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {order.totalAmount != null ? `${parseFloat(order.totalAmount).toLocaleString('tr-TR')} TL` : '-'}
                        </td>
                        <td className="px-4 py-3">{orderStatusBadge(order.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MySubscriptions
