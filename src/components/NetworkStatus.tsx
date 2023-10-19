import { CloudOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(!window.navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
    }
    const handleOffline = () => {
      setIsOffline(true)
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOffline
    ? createPortal(
        <div className="fixed z-50 flex items-center justify-center h-10 gap-2 px-10 text-white -translate-x-1/2 rounded-full shadow-lg xs:-translate-x-0 xs:px-0 xs:h-16 xs:w-16 bottom-20 xs:bottom-4 left-1/2 xs:left-4 bg-slate-500 ring-inset ring-2 ring-white">
          <CloudOff size={30} />
          <span className="block text-lg font-display xs:hidden">Offline</span>
        </div>,
        document.body
      )
    : null
}
