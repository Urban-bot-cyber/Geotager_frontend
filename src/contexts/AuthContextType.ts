// AuthContextType.ts
import { UserType } from 'models/auth'

export interface AuthContextType {
  user: UserType | null
  token: string | null
  tokenType: string | null
  expiresAt: string | null
  login: (authData: AuthData) => void
  signout: () => void
}

export interface AuthData {
  user: UserType
  token: string
  tokenType: string
  expiresAt: string
}