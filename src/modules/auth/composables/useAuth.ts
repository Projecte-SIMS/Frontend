import { ref } from 'vue'
import apiClient from '@/services/api'
import type { LoginRequest, LoginResponse } from '../interfaces/auth.interface'

const TOKEN_COOKIE_NAME = 'token'

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
  document.cookie = `${name}=${value};${expires};path=/`
}

// Deletes cookie by setting its expiration date in the past
function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}

export function useAuth() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = (): boolean => {
    return !!getCookie(TOKEN_COOKIE_NAME)
  }

  const getToken = (): string | null => {
    return getCookie(TOKEN_COOKIE_NAME)
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
        return true
      } else {
        error.value = 'No token received from server'
        return false
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error logging in'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = (): void => {
    deleteCookie(TOKEN_COOKIE_NAME)
  }

  return {
    isLoading,
    error,
    isAuthenticated,
    getToken,
    login,
    logout
  }
}
