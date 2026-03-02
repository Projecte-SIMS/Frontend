import { ref, computed } from 'vue'
import apiClient from '@/services/api'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User, UserResponse } from '../interfaces/auth.interface'
import router from '@/router'
import showToast from '@/modules/common/composables/useToast'

const TOKEN_COOKIE_NAME = 'token'
const ACCOUNTS_STORAGE_KEY = 'sims_saved_accounts'

interface SavedAccount {
  id: number
  name: string
  email: string
  token: string
  avatar?: string
}

// Helper functions to manage cookies
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

function setCookie(name: string, value: string, days: number = 7): void {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`
}

// Deletes cookie by setting its expiration date in the past
function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}

// Global state shared across all useAuth() calls
const isLoading = ref(false)
const error = ref<string | null>(null)
const user = ref<User | null>(null)
const savedAccounts = ref<SavedAccount[]>(JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY) || '[]'))

const isAuthenticated = computed(() => !!user.value)

export function useAuth() {

  const getToken = (): string | null => {
    return getCookie(TOKEN_COOKIE_NAME)
  }

  const saveAccount = (userData: User, token: string) => {
    const account: SavedAccount = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      token: token
    }
    
    const index = savedAccounts.value.findIndex(a => a.id === account.id)
    if (index >= 0) {
      savedAccounts.value[index] = account
    } else {
      savedAccounts.value.push(account)
    }
    
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(savedAccounts.value))
  }

  const removeAccount = (accountId: number) => {
    savedAccounts.value = savedAccounts.value.filter(a => a.id !== accountId)
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(savedAccounts.value))
    
    // If the removed account is the current one, logout
    if (user.value?.id === accountId) {
      deleteCookie(TOKEN_COOKIE_NAME)
      user.value = null
      router.push('/login')
    }
  }

  const switchAccount = async (accountId: number): Promise<boolean> => {
    const account = savedAccounts.value.find(a => a.id === accountId)
    if (!account) return false
    
    setCookie(TOKEN_COOKIE_NAME, account.token)
    const success = await fetchUser()
    if (success) {
      // Refresh to ensure all states are clean
      window.location.reload()
      return true
    }
    return false
  }

  const fetchUser = async (): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get<UserResponse>('/users/me')
      user.value = response.data.user
      
      // Update saved accounts info if currently logged in
      const token = getToken()
      if (token && user.value) {
        saveAccount(user.value, token)
      }
      
      return true
    } catch (err: any) {
      if (err.response?.status === 401) {
        // Token is invalid or expired
        deleteCookie(TOKEN_COOKIE_NAME)
        user.value = null
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const loginData: LoginRequest = { email, password }
      const response = await apiClient.post<LoginResponse>('/login', loginData)

      const token = response.data.token
      
      if (token) {
        setCookie(TOKEN_COOKIE_NAME, token)
        const userFetched = await fetchUser()
        return userFetched
      } else {
        error.value = 'No token received from server'
        return false
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error logging in'
      error.value = msg
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      const accountId = user.value?.id
      await apiClient.post('/logout')
      deleteCookie(TOKEN_COOKIE_NAME)
      user.value = null
      
      if (accountId) {
        // We could keep it in savedAccounts for easy re-login if the token was still valid,
        // but since we called /logout, the token is revoked. 
        // We remove it to avoid confusion.
        savedAccounts.value = savedAccounts.value.filter(a => a.id !== accountId)
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(savedAccounts.value))
      }
    } catch (err: any) {
      // Even if logout fails on backend, we clear local session
      deleteCookie(TOKEN_COOKIE_NAME)
      user.value = null
      const errorMsg = err.response?.data?.message || 'Error during logout'
      showToast(errorMsg)
    }
  }

  const register = async (name: string, username: string, email: string, password: string) => {
    isLoading.value = true
    error.value = null
    try {
      const registerData: RegisterRequest = {
        name,
        username,
        email,
        password,
        role_id: 2
      }
      if (await apiClient.post<RegisterResponse>('/users', registerData)) router.push('/login')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error registering'
      showToast(msg)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    user,
    isAuthenticated,
    savedAccounts,
    getToken,
    fetchUser,
    login,
    register,
    logout,
    switchAccount,
    removeAccount
  }
}
