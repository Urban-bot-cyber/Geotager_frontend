import { UserType } from 'models/auth'
import moment from 'moment'

const USER_KEY = 'auth_user'
const TOKEN_KEY = 'auth_token'
const TOKEN_TYPE_KEY = 'auth_token_type'
const TOKEN_EXPIRY_KEY = 'auth_token_expires_at'

const userStorage = {
  // User Data
  getUser: (): UserType | null => {
    if (typeof window === 'undefined') return null
    const userData = window.localStorage.getItem(USER_KEY)
    if (!userData) return null
    try {
      return JSON.parse(userData) as UserType
    } catch (error) {
      console.error('Failed to parse user data from localStorage:', error)
      return null
    }
  },
  setUser: (user: UserType): void => {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  clearUser: (): void => {
    window.localStorage.removeItem(USER_KEY)
  },

  // Access Token
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(TOKEN_KEY)
  },
  setToken: (token: string): void => {
    window.localStorage.setItem(TOKEN_KEY, token)
  },
  clearToken: (): void => {
    window.localStorage.removeItem(TOKEN_KEY)
  },

  // Token Type
  getTokenType: (): string | null => {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(TOKEN_TYPE_KEY)
  },
  setTokenType: (tokenType: string): void => {
    window.localStorage.setItem(TOKEN_TYPE_KEY, tokenType)
  },
  clearTokenType: (): void => {
    window.localStorage.removeItem(TOKEN_TYPE_KEY)
  },

  // Token Expiry
  getTokenExpiry: (): string | null => {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(TOKEN_EXPIRY_KEY)
  },
  setTokenExpiry: (expiry: string): void => {
    window.localStorage.setItem(TOKEN_EXPIRY_KEY, expiry)
  },
  clearTokenExpiry: (): void => {
    window.localStorage.removeItem(TOKEN_EXPIRY_KEY)
  },

  // Clear All Authentication Data
  clearAll: (): void => {
    userStorage.clearUser()
    userStorage.clearToken()
    userStorage.clearTokenType()
    userStorage.clearTokenExpiry()
  },
  
  // Token Expiry Check using Moment.js
  isTokenExpired: (): boolean => {
    const expiry = userStorage.getTokenExpiry()
    if (!expiry) return true
    return moment().isAfter(moment(expiry)) // Moment.js for expiry check
  },
}

export { userStorage }