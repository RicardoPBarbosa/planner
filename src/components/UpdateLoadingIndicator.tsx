import { useContext } from 'react'
import { UploadCloud } from 'lucide-react'

import { LoadingContext } from 'context/loading'

export default function UpdateLoadingIndicator() {
  const { isLoading } = useContext(LoadingContext)

  if (!isLoading) return null

  return (
    <div className="fixed z-50 grid text-white bg-white rounded-full shadow-lg w-14 h-14 place-content-center bottom-4 md:bottom-2 left-4 gradient-to-b ring-inset ring-2 animate-bounce ring-white">
      <UploadCloud size={26} />
    </div>
  )
}
