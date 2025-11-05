import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ text = "Yükleniyor..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="w-8 h-8 text-adyk-ocean animate-spin" />
      <p className="mt-2 text-sm text-gray-600">{text}</p>
    </div>
  )
}

export default LoadingSpinner
