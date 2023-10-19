import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import type { FirebaseOptions } from 'firebase/app'
import { CACHE_SIZE_UNLIMITED, initializeFirestore, persistentLocalCache } from 'firebase/firestore'

const {
  VITE_CLIENT_FB_API_KEY,
  VITE_CLIENT_FB_AUTH_DOMAIN,
  VITE_CLIENT_FB_DB_URL,
  VITE_CLIENT_FB_PROJECT_ID,
  VITE_CLIENT_FB_STORAGE_BUCKET,
  VITE_CLIENT_FB_MESSAGING_SENDER_ID,
  VITE_CLIENT_FB_APP_ID,
} = import.meta.env

const firebaseConfig: FirebaseOptions = {
  apiKey: `${VITE_CLIENT_FB_API_KEY}`,
  authDomain: `${VITE_CLIENT_FB_AUTH_DOMAIN}`,
  databaseURL: `${VITE_CLIENT_FB_DB_URL}`,
  projectId: `${VITE_CLIENT_FB_PROJECT_ID}`,
  storageBucket: `${VITE_CLIENT_FB_STORAGE_BUCKET}`,
  messagingSenderId: `${VITE_CLIENT_FB_MESSAGING_SENDER_ID}`,
  appId: `${VITE_CLIENT_FB_APP_ID}`,
}

const firebase = initializeApp(firebaseConfig)

export const auth = getAuth(firebase)
const db = initializeFirestore(firebase, {
  localCache: persistentLocalCache({
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  }),
})

export { db }
