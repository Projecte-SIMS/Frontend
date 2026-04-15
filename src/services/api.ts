import axios from 'axios'
import showToast from '@/modules/common/composables/useToast'

// Determine API URL - supports multiple environments
function getApiUrl(): string {
  // Try environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Fallback based on current hostname
  const hostname = window.location.hostname
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000/api'
  }
  
  // Production - use Render backend
  return 'https://sims-backend-api-0b2w.onrender.com/api'
}

// Get tenant from URL query param or localStorage
function getCurrentTenant(): string | null {
  // Check URL query first
  const urlParams = new URLSearchParams(window.location.search)
  const tenantFromUrl = urlParams.get('tenant')

  if (tenantFromUrl) {
    localStorage.setItem('current_tenant', tenantFromUrl)
    return tenantFromUrl
  }

  // Fallback to subdomain (e.g. ibm.fleetly.com -> ibm)
  const hostname = window.location.hostname
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'

  if (!isLocalhost) {
    // Basic subdomain extraction for production
    // e.g. "tenant.sims.com" -> "tenant"
    const parts = hostname.split('.')
    if (parts.length > 2) {
      const subdomain = parts[0]
      if (subdomain && subdomain !== 'www' && subdomain !== 'app' && subdomain !== 'admin') {
        localStorage.setItem('current_tenant', subdomain)
        return subdomain
      }
    }
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
  baseURL: getApiUrl(),
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
