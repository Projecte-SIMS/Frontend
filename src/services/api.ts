import axios from 'axios'
import showToast from '@/modules/common/composables/useToast'

// URL Base de la API estándar (Vercel la leerá de VITE_API_URL)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para añadir el token de las cookies
apiClient.interceptors.request.use(
  (config) => {
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
