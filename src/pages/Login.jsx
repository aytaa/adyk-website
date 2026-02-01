import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Anchor, Loader2 } from 'lucide-react'
import PhoneInput from '../components/PhoneInput'
import OTPInput from '../components/OTPInput'
import { sendOTP, verifyOTP, isAuthenticated, getSubscriptionStatus } from '../utils/auth'

const Login = () => {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('phone') // 'phone' | 'otp'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (isAuthenticated()) {
      routeBySubscription()
    }
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const getFullPhone = () => {
    return '+90' + phone.replace(/\s/g, '')
  }

  const routeBySubscription = async () => {
    try {
      const status = await getSubscriptionStatus()
      if (status.hasSubscription && (status.status === 'active' || status.status === 'grace')) {
        navigate('/ais', { replace: true })
      } else {
        navigate('/subscription', { replace: true })
      }
    } catch {
      navigate('/subscription', { replace: true })
    }
  }

  const handleSendCode = async (e) => {
    e.preventDefault()
    const digits = phone.replace(/\s/g, '')
    if (digits.length < 10) {
      setError('Geçerli bir telefon numarası girin')
      return
    }

    setError('')
    setLoading(true)
    try {
      await sendOTP(getFullPhone())
      setStep('otp')
      setCountdown(60)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (otp.length < 6) {
      setError('6 haneli kodu girin')
      return
    }

    setError('')
    setLoading(true)
    try {
      await verifyOTP(getFullPhone(), otp)
      await routeBySubscription()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return
    setError('')
    setLoading(true)
    try {
      await sendOTP(getFullPhone())
      setCountdown(60)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-adyk-navy via-adyk-accent to-adyk-ocean flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-adyk-navy rounded-full flex items-center justify-center mb-4">
            <Anchor className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-adyk-navy">ADYK</h1>
          <p className="text-sm text-gray-500 mt-1">Deniz Takip Sistemi</p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendCode} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon Numarası</label>
              <PhoneInput value={phone} onChange={setPhone} disabled={loading} />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-adyk-ocean text-white font-semibold rounded-lg
                hover:bg-adyk-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Kod Gönder'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Doğrulama Kodu
              </label>
              <p className="text-xs text-gray-500 text-center mb-4">
                +90 {phone} numarasına gönderilen 6 haneli kodu girin
              </p>
              <OTPInput value={otp} onChange={setOtp} disabled={loading} />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-adyk-ocean text-white font-semibold rounded-lg
                hover:bg-adyk-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Giriş Yap'
              )}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => { setStep('phone'); setOtp(''); setError('') }}
                className="text-adyk-ocean hover:underline"
              >
                Numarayı Değiştir
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0}
                className="text-adyk-ocean hover:underline disabled:text-gray-400 disabled:no-underline"
              >
                {countdown > 0 ? `Tekrar gönder (${countdown}s)` : 'Tekrar Gönder'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login
