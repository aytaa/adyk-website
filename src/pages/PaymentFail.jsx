import { useNavigate } from 'react-router-dom'
import { XCircle, RefreshCw } from 'lucide-react'

const PaymentFail = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-adyk-navy via-adyk-accent to-adyk-ocean flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-adyk-navy">Ödeme Başarısız</h1>
          <p className="text-gray-600 mt-2">
            Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.
          </p>
        </div>

        <button
          onClick={() => navigate('/subscription', { replace: true })}
          className="w-full py-3 bg-adyk-ocean text-white font-semibold rounded-lg
            hover:bg-adyk-accent transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Tekrar Dene
        </button>
      </div>
    </div>
  )
}

export default PaymentFail
