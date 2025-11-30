import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Ship, Lock, Mail, User, Phone, UserPlus, CheckCircle } from 'lucide-react'
import { register } from '../utils/auth'

const RegisterModal = ({ onClose, onSuccess, onLoginClick }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate password match
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır')
      return
    }

    setIsLoading(true)

    try {
      const data = await register(name, email, phone, password)
      console.log('Registration successful:', data)

      // Show success message
      setShowSuccess(true)

      // Wait 3 seconds then call onSuccess to switch to login
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
      }, 3000)
    } catch (error) {
      console.error('Registration failed:', error)
      setError(error.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      navigate('/')
    }
  }

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick()
    }
  }

  // Success screen
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-8">
            <div className="flex flex-col items-center text-white">
              <div className="bg-white bg-opacity-20 p-4 rounded-full mb-4">
                <CheckCircle className="w-16 h-16" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Kayıt Başarılı!</h2>
              <p className="text-green-100 text-center">
                Hesabınız başarıyla oluşturuldu.
              </p>
            </div>
          </div>
          <div className="p-6 text-center">
            <p className="text-gray-700 mb-4">
              Hesabınız yönetici onayı bekliyor. Onaylandıktan sonra giriş yapabileceksiniz.
            </p>
            <div className="animate-pulse text-adyk-ocean text-sm">
              Giriş sayfasına yönlendiriliyorsunuz...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-adyk-navy to-adyk-accent p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            aria-label="Kapat"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center">
            <div className="bg-white bg-opacity-20 p-3 rounded-full mb-3">
              <Ship className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">ADYK Online'a Kayıt Olun</h2>
            <p className="text-blue-100 text-sm">AIS Takip Sistemine Erişim</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Ad Soyad
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adyk-ocean focus:border-transparent transition-all"
                placeholder="Adınız Soyadınız"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-posta
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adyk-ocean focus:border-transparent transition-all"
                placeholder="ornek@email.com"
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Phone Input (Optional) */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Telefon <span className="text-gray-400 text-xs">(opsiyonel)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adyk-ocean focus:border-transparent transition-all"
                placeholder="5XX XXX XX XX"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adyk-ocean focus:border-transparent transition-all"
                placeholder="En az 6 karakter"
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Şifre Tekrar
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adyk-ocean focus:border-transparent transition-all"
                placeholder="Şifrenizi tekrar girin"
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-adyk-ocean hover:bg-adyk-accent text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Kayıt yapılıyor...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Kayıt Ol</span>
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="text-center pt-2">
            <p className="text-gray-600 text-sm">
              Hesabınız var mı?{' '}
              <button
                type="button"
                onClick={handleLoginClick}
                className="text-adyk-ocean hover:text-adyk-accent font-semibold transition-colors"
              >
                Giriş Yap
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterModal
