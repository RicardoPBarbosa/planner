import { getAuth } from 'firebase/auth'

export async function getUserId() {
  return await new Promise<string | undefined>(function (resolve) {
    getAuth().onIdTokenChanged(async function (user) {
      if (!user) {
        resolve(undefined)
      } else {
        resolve(user.uid)
      }
    })
  })
}
