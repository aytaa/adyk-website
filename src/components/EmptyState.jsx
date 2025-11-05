import { SearchX } from 'lucide-react'

const EmptyState = ({ message = "Gemi bulunamadı", description = "Arama kriterlerinizi değiştirmeyi deneyin" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <SearchX className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{message}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
}

export default EmptyState
