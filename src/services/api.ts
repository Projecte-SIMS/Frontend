import axios from 'axios'
import showToast from '@/modules/common/composables/useToast'

// Get tenant from URL query param or localStorage
function getCurrentTenant(): string | null {
  // Check URL first
  const urlParams = new URLSearchParams(window.location.search)
  const tenantFromUrl = urlParams.get('tenant')
  
  if (tenantFromUrl) {
    localStorage.setItem('current_tenant', tenantFromUrl)
    return tenantFromUrl
  }
  
  // Fallback to localStorage
  return localStorage.getItem('current_tenant')
}

// Base URL de la API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor to add token and tenant to all requests
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

    // Add tenant header
    const tenant = getCurrentTenant()
    if (tenant) {
      config.headers['X-Tenant'] = tenant
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

export { getCurrentTenant }
export default apiClient
