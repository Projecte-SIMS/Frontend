import { ref, computed } from 'vue'
import { centralApi } from '@/services/centralApi'

const isAuthenticated = ref(centralApi.isAuthenticated())
const user = ref<{ name: string; email: string; role: string } | null>(null)

export function useCentralAuth() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await centralApi.login(email, password)
      user.value = response.user
      isAuthenticated.value = true
      return response
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error de autenticación'
      throw e
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    centralApi.logout()
    isAuthenticated.value = false
    user.value = null
  }

  const checkAuth = () => {
    isAuthenticated.value = centralApi.isAuthenticated()
    return isAuthenticated.value
  }

  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    user: computed(() => user.value),
    loading,
    error,
    login,
    logout,
    checkAuth
  }
}
