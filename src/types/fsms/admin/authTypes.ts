export type AuthInfo = {
  isLoggedIn: boolean
  authSttus?: {
    authorities: string[]
    exp: number
    iat: number
    iss: string
    lgnId: string
    userNm: string
  }
  message?: string
}
