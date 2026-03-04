import axios from 'axios'
import showToast from '@/modules/common/composables/useToast'

// Base URL de la API (Vercel la lee de VITE_API_URL en el panel)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor to add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1]

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    const msg = error?.message || 'Error en la petición'
    try {
      showToast(msg)
    } catch (e) {
      console.error(e)
    }
    return Promise.reject(error)
  }
)
export default apiClient
