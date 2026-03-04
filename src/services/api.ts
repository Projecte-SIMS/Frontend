import axios from 'axios'
import showToast from '@/modules/common/composables/useToast'

// NOTE: previous comment contained Spanish/Catalan; translated to English
// This file configures axios to use the API based on cookies.
// If stronger security is required, httpOnly cookies would be preferable,
// but then the frontend cannot access the token to add it to requests.
// For now the token is read from cookies and added to request headers.
// Improve security later as needed.

// URL Base dinámica para multitenancy
const getBaseUrl = () => {
  const host = window.location.hostname
  const subdomain = host.split('.')[0]
  const envApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

  // Si estamos en localhost (sin subdominio) o es el dominio principal, usamos la URL base del .env
  if (subdomain === 'localhost' || subdomain === 'api' || host.split('.').length < 2) {
    return envApiUrl
  }

  // Si hay un subdominio (ej: 'cliente1'), construimos la URL dinámica:
  // Ejemplo: http://cliente1.localhost:8000/api
  const protocol = window.location.protocol
  const port = '8000' // Puerto por defecto de tu Laravel en Docker
  return `${protocol}//${subdomain}.localhost:${port}/api`
}

const apiClient = axios.create({
  baseURL: getBaseUrl(),
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
    const msg = error?.message || 'Request error'
    try {
      showToast(msg)
    } catch (e) {
      console.error(e)
    }
    return Promise.reject(error)
  }
)
export default apiClient
