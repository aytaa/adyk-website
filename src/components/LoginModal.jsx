import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Ship, Lock, Mail, LogIn } from 'lucide-react'
import { login } from '../utils/auth'

const LoginModal = ({ onLoginSuccess, onClose, onRegisterClick }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const data = await login(email, password)
      console.log('Login successful:', data)

      // Call success callback
      if (onLoginSuccess) {
        onLoginSuccess(data)
      }
    } catch (error) {
      console.error('Login failed:', error)
      setError(error.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.')
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
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
            <h2 className="text-2xl font-bold text-white mb-1">ADYK Online'a Giriş Yapın</h2>
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
                placeholder="••••••••"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-adyk-ocean hover:bg-adyk-accent text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Giriş yapılıyor...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Giriş Yap</span>
              </>
            )}
          </button>

          {/* Register Link */}
          <div className="text-center pt-2">
            <p className="text-gray-600 text-sm">
              Hesabınız yok mu?{' '}
              <button
                type="button"
                onClick={onRegisterClick}
                className="text-adyk-ocean hover:text-adyk-accent font-semibold transition-colors"
              >
                Kayıt Ol
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginModal
