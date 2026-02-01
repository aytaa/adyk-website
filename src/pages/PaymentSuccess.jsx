import { useNavigate } from 'react-router-dom'
import { CheckCircle, Anchor } from 'lucide-react'

const PaymentSuccess = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-adyk-navy via-adyk-accent to-adyk-ocean flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-adyk-navy">Ödeme Başarılı</h1>
          <p className="text-gray-600 mt-2">
            Ödemeniz başarıyla alındı. Aboneliğiniz aktif edildi.
          </p>
        </div>

        <button
          onClick={() => navigate('/ais', { replace: true })}
          className="w-full py-3 bg-adyk-ocean text-white font-semibold rounded-lg
            hover:bg-adyk-accent transition-colors flex items-center justify-center gap-2"
        >
          <Anchor className="w-5 h-5" />
          Panele Git
        </button>
      </div>
    </div>
  )
}

export default PaymentSuccess
