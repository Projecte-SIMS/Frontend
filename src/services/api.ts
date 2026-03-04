import axios from 'axios'
import showToast from '@/modules/common/composables/useToast'

// Función para obtener la URL base de la API de forma dinámica
const getBaseUrl = () => {
  const host = window.location.hostname
  const parts = host.split('.')
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1')
  
  // URL base del backend en Render (SIN el /api al final para poder añadir el subdominio)
  // IMPORTANTE: Cambia esto por tu URL real de Render si es distinta
  const renderBaseUrl = 'sims-backend-api.onrender.com'
  
  // 1. Caso: Desarrollo Local (localhost)
  if (isLocal) {
    const subdomain = parts[0]
    if (subdomain === 'localhost' || parts.length < 2) {
      return 'http://localhost:8000/api'
    }
    return `http://${subdomain}.localhost:8000/api`
  }

  // 2. Caso: Producción (Vercel)
  // Si la URL tiene más de 2 partes (ej: cliente1.frontend.vercel.app)
  // El primer elemento es nuestro Tenant ID.
  if (parts.length > 3 || (parts.length === 3 && !host.includes('vercel.app'))) {
    const tenantId = parts[0]
    return `https://${tenantId}.${renderBaseUrl}/api`
  }

  // 3. Caso: Dominio principal de Vercel (Sin tenant)
  return `https://${renderBaseUrl}/api`
}

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para añadir el token (mantenemos tu lógica original)
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
    try { showToast(msg) } catch (e) { console.error(e) }
    return Promise.reject(error)
  }
)

export default apiClient
