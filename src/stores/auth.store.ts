import { makeAutoObservable } from 'mobx'
import moment from 'moment' // Import moment.js for expiration checking
import { UserType } from 'models/auth'
import { userStorage } from 'utils/localStorage'
import { AuthData } from 'contexts/AuthContextType' // Adjust the import path if needed

class AuthStore {
  user: UserType | null = userStorage.getUser() || null
  token: string | null = userStorage.getToken() || null
  tokenType: string | null = userStorage.getTokenType() || 'Bearer' // Default to 'Bearer' if null
  expiresAt: string | null = userStorage.getTokenExpiry() || null

  constructor() {
    makeAutoObservable(this)
  }

  /**
   * Login and store user authentication data
   */
  login(authData: AuthData) {
    this.user = authData.user
    this.token = authData.token
    this.tokenType = authData.tokenType || 'Bearer' // Ensure token type defaults to 'Bearer'
    this.expiresAt = authData.expiresAt

    // Store in localStorage
    userStorage.setUser(authData.user)
    userStorage.setToken(authData.token)
    userStorage.setTokenType(authData.tokenType || 'Bearer')
    userStorage.setTokenExpiry(authData.expiresAt)
  }

  /**
   * Logout the user, clear token, and local storage
   */
  signout() {
    this.user = null
    this.token = null
    this.tokenType = null
    this.expiresAt = null

    userStorage.clearAll() // Clear all authentication-related data
  }

  /**
   * Check if user is authenticated (token exists and is not expired)
   */
  isAuthenticated(): boolean {
    if (!this.token || !this.expiresAt) return false
    return moment().isBefore(moment(this.expiresAt)) // Returns true if token is still valid
  }

  /**
   * Get full authorization header for API requests
   */
  getAuthHeader(): string | null {
    return this.token ? `${this.tokenType} ${this.token}` : null
  }
}

const authStore = new AuthStore()
export default authStore