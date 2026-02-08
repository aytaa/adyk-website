import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import { getProfile, updateProfile, getPhoneNumber } from '../utils/auth'

const Profile = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState(getPhoneNumber())

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile()
        const profile = res.data || res
        setFullName(profile.fullName || profile.name || '')
        setEmail(profile.email || '')
        setPhone(profile.phone || getPhoneNumber())
      } catch {
        // Use localStorage fallback
        try {
          const userStr = localStorage.getItem('user')
          if (userStr) {
            const user = JSON.parse(userStr)
            setFullName(user.fullName || user.name || '')
            setEmail(user.email || '')
            setPhone(user.phone || getPhoneNumber())
          }
        } catch {
          // ignore
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setError('Ad Soyad zorunludur')
      return
    }

    setError('')
    setSuccess('')
    setSaving(true)

    try {
      await updateProfile({ fullName: fullName.trim(), email: email.trim() })
      setSuccess('Profil başarıyla güncellendi')
      // Update localStorage
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        user.fullName = fullName.trim()
        user.name = fullName.trim()
        user.email = email.trim()
        localStorage.setItem('user', JSON.stringify(user))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-adyk-light">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <LoadingSpinner text="Profil yükleniyor..." />
        </div>
      </div>
    )
  }

  const initial = fullName ? fullName.charAt(0).toUpperCase() : '?'

  return (
    <div className="min-h-screen bg-adyk-light">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/ais" className="text-adyk-ocean hover:text-adyk-accent transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-adyk-navy">Profilim</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {/* Profile Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-adyk-ocean rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {initial}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-adyk-navy">{fullName || '-'}</h2>
              <p className="text-gray-500 text-sm">{phone}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adyk-ocean focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adyk-ocean focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input
                type="text"
                value={phone}
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Telefon numarası değiştirilemez</p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-adyk-ocean text-white font-semibold rounded-lg hover:bg-adyk-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                'Kaydet'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
