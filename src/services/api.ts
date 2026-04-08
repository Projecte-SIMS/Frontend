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

// Check if we're in superadmin routes (don't need tenant)
function isSuperAdminRoute(): boolean {
  return window.location.pathname.startsWith('/superadmin')
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

    // Add tenant header (skip for superadmin/central routes)
    if (!isSuperAdminRoute() && !config.url?.includes('/central/')) {
      const tenant = getCurrentTenant()
      if (tenant) {
        config.headers['X-Tenant'] = tenant
      } else {
        // No tenant specified - show warning
        console.warn('No tenant specified. Add ?tenant=yourcompany to the URL')
      }
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

export { getCurrentTenant, isSuperAdminRoute }
export default apiClient
