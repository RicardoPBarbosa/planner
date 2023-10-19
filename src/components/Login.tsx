import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import { auth } from 'lib/firebase'
import { useAuthUser } from 'hooks/useAuthUser'

export default function Login() {
  useAuthUser()

  function signIn() {
    signInWithPopup(auth, new GoogleAuthProvider())
  }

  return (
    <div className="grid w-screen h-screen place-content-center">
      <button
        onClick={signIn}
        className="px-4 py-2 border rounded-md border-zinc-400 bg-zinc-100 text-zinc-700"
      >
        Login
      </button>
    </div>
  )
}
