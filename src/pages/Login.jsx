import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Anchor, Loader2, UserPlus, Clock, ShieldCheck } from 'lucide-react'
import PhoneInput, { sortedCountries } from '../components/PhoneInput'
import OTPInput from '../components/OTPInput'
import { sendOTP, verifyOTP, isAuthenticated, sendRegistrationCode, verifyAndRegister } from '../utils/auth'

const Login = () => {
  const navigate = useNavigate()
  const [selectedCountry, setSelectedCountry] = useState(sortedCountries[0]) // Turkey
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [registrationOtp, setRegistrationOtp] = useState('')
  const [step, setStep] = useState('phone') // 'phone' | 'otp' | 'register_otp' | 'register' | 'pending'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [isDoctor, setIsDoctor] = useState(false)
  const [isDiver, setIsDiver] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/ais', { replace: true })
    }
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const getFullPhone = () => {
    const digits = phone.replace(/\D/g, '')
    return selectedCountry.dialCode + digits
  }

  const handleSendCode = async (e) => {
    e.preventDefault()
    const digits = phone.replace(/\D/g, '')
    if (digits.length < selectedCountry.maxLength) {
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
      const msg = (err.message || '').toLowerCase()
      if (
        msg.includes('kayıtlı değil') ||
        msg.includes('bulunamadı') ||
        msg.includes('not found') ||
        msg.includes('kullanıcı bulunamadı')
      ) {
        try {
          await sendRegistrationCode(getFullPhone())
          setStep('register_otp')
          setCountdown(60)
          setError('')
        } catch (regErr) {
          setError(regErr.message)
        }
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyRegistrationOtp = (e) => {
    e.preventDefault()
    if (registrationOtp.length < 6) {
      setError('6 haneli kodu girin')
      return
    }
    setError('')
    setStep('register')
  }

  const handleResendRegistrationCode = async () => {
    if (countdown > 0) return
    setError('')
    setLoading(true)
    try {
      await sendRegistrationCode(getFullPhone())
      setCountdown(60)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setError('Ad Soyad zorunludur')
      return
    }

    setError('')
    setLoading(true)

    try {
      await verifyAndRegister(
        getFullPhone(),
        registrationOtp,
        fullName.trim(),
        email.trim() || undefined,
        isDoctor,
        isDiver
      )
      setStep('pending')
    } catch (err) {
      setError(err.message || 'Kayıt sırasında bir hata oluştu')
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
      navigate('/ais', { replace: true })
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

        {step === 'phone' && (
          <form onSubmit={handleSendCode} className="space-y-5">
            <PhoneInput
              value={phone}
              onChange={setPhone}
              disabled={loading}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
            />

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

            <p className="text-center text-sm text-gray-500">
              Hesabınız yok mu?{' '}
              <button
                type="button"
                onClick={async () => {
                  const digits = phone.replace(/\D/g, '')
                  if (digits.length < selectedCountry.maxLength) {
                    setError('Önce geçerli bir telefon numarası girin')
                    return
                  }
                  setError('')
                  setLoading(true)
                  try {
                    await sendRegistrationCode(getFullPhone())
                    setStep('register_otp')
                    setCountdown(60)
                  } catch (err) {
                    setError(err.message)
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
                className="text-adyk-ocean hover:text-adyk-accent font-semibold transition-colors"
              >
                Kayıt Ol
              </button>
            </p>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Doğrulama Kodu
              </label>
              <p className="text-xs text-gray-500 text-center mb-4">
                {getFullPhone()} numarasına gönderilen 6 haneli kodu girin
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

        {step === 'register_otp' && (
          <form onSubmit={handleVerifyRegistrationOtp} className="space-y-5">
            <div className="text-center mb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-adyk-ocean/10 rounded-full mb-3">
                <ShieldCheck className="w-6 h-6 text-adyk-ocean" />
              </div>
              <h2 className="text-xl font-semibold text-adyk-navy">Kayıt Doğrulama</h2>
              <p className="text-xs text-gray-500 mt-2">
                {getFullPhone()} numarasına gönderilen 6 haneli doğrulama kodunu girin
              </p>
            </div>

            <OTPInput value={registrationOtp} onChange={setRegistrationOtp} disabled={loading} />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || registrationOtp.length < 6}
              className="w-full py-3 bg-adyk-ocean text-white font-semibold rounded-lg
                hover:bg-adyk-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Doğrula ve Devam Et'
              )}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => { setStep('phone'); setRegistrationOtp(''); setError('') }}
                className="text-adyk-ocean hover:underline"
              >
                Numarayı Değiştir
              </button>
              <button
                type="button"
                onClick={handleResendRegistrationCode}
                disabled={countdown > 0}
                className="text-adyk-ocean hover:underline disabled:text-gray-400 disabled:no-underline"
              >
                {countdown > 0 ? `Tekrar gönder (${countdown}s)` : 'Tekrar Gönder'}
              </button>
            </div>
          </form>
        )}

        {step === 'register' && (
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="text-center mb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-adyk-ocean/10 rounded-full mb-3">
                <UserPlus className="w-6 h-6 text-adyk-ocean" />
              </div>
              <h2 className="text-xl font-semibold text-adyk-navy">Kayıt Ol</h2>
              <p className="text-sm text-gray-500 mt-1">
                Bu telefon numarası kayıtlı değil. Lütfen bilgilerinizi girin.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <div className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-600 text-sm">
                {getFullPhone()}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Adınız Soyadınız"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-adyk-ocean focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-posta <span className="text-gray-400 text-xs">(opsiyonel)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-adyk-ocean focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meslek <span className="text-gray-400 text-xs">(opsiyonel)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsDoctor(!isDoctor)}
                  disabled={loading}
                  className={`flex items-center gap-3 px-4 py-3 border rounded-lg transition-all disabled:opacity-50
                    ${isDoctor
                      ? 'border-adyk-ocean bg-adyk-ocean/5 ring-2 ring-adyk-ocean'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${isDoctor ? 'bg-adyk-ocean border-adyk-ocean' : 'border-gray-300'}`}
                  >
                    {isDoctor && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${isDoctor ? 'text-adyk-navy' : 'text-gray-700'}`}>
                    Doktor
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDiver(!isDiver)}
                  disabled={loading}
                  className={`flex items-center gap-3 px-4 py-3 border rounded-lg transition-all disabled:opacity-50
                    ${isDiver
                      ? 'border-adyk-ocean bg-adyk-ocean/5 ring-2 ring-adyk-ocean'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${isDiver ? 'bg-adyk-ocean border-adyk-ocean' : 'border-gray-300'}`}
                  >
                    {isDiver && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${isDiver ? 'text-adyk-navy' : 'text-gray-700'}`}>
                    Dalgic
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !fullName.trim()}
              className="w-full py-3 bg-adyk-ocean text-white font-semibold rounded-lg
                hover:bg-adyk-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Kayıt Ol ve Devam Et
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setStep('phone'); setError(''); setFullName(''); setEmail(''); setIsDoctor(false); setIsDiver(false); setRegistrationOtp('') }}
              className="w-full text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              ← Telefon numarasını değiştir
            </button>
          </form>
        )}

        {step === 'pending' && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-adyk-navy">Kayıt Başarılı!</h2>
            <p className="text-sm text-gray-500">
              Hesabınız yönetici onayı bekliyor. Onaylandığında telefon numaranızla giriş yapabileceksiniz.
            </p>
            <button
              onClick={() => { setStep('phone'); setError(''); setFullName(''); setEmail(''); setIsDoctor(false); setIsDiver(false); setRegistrationOtp('') }}
              className="text-adyk-ocean hover:text-adyk-accent font-medium transition-colors"
            >
              Giriş sayfasına dön
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
