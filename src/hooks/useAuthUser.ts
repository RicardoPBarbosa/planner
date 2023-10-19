import type { User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export function useAuthUser() {
  const auth = getAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>()

  useEffect(() => {
    const listener = onAuthStateChanged(auth, function (user) {
      setUser(user)
      if (!user) {
        return navigate('/login')
      }
      if (user && location.pathname.includes('login')) {
        return navigate('/')
      }
    })

    return () => {
      listener()
    }
  }, [])

  return user
}
