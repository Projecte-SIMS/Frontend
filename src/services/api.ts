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

  // Do NOT extract subdomain from Vercel or Render domains
  const isCloudProvider = hostname.includes('vercel.app') || hostname.includes('onrender.com')

  if (!isLocalhost && !isCloudProvider) {
    // Basic subdomain extraction for production custom domains
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
  const storedTenant = localStorage.getItem('current_tenant')
  if (storedTenant && (storedTenant.includes('vercel') || storedTenant.includes('onrender'))) {
    localStorage.removeItem('current_tenant')
    return null
  }
  return storedTenant
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
        // Debug: Log the tenant being used in production
        if (import.meta.env.PROD) {
          console.log(`[API] Using tenant: ${tenant}`)
        }
      } else {
        // No tenant specified - show warning
        console.warn('No tenant specified. Add ?tenant=yourcompany to the URL')
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor to handle responses and global errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null
    let msg = 'Error de conexión con el servidor'

    if (status === 502) {
      msg = 'El servidor está reiniciando o temporalmente fuera de servicio. Reintentando...'
    } else if (status === 401) {
      msg = 'Sesión expirada. Por favor, inicia sesión de nuevo.'
    } else if (error.response?.data?.message) {
      msg = error.response.data.message
    }

    // Only show toast for critical or unexpected errors
    if (status !== 404 && status !== 422) {
      try {
        showToast(msg, 'error')
      } catch (e) {
        console.error('Toast error:', e)
      }
    }

    return Promise.reject(error)
  }
)

const api = {
  // Configuración del servidor (Tenant)
  getSettings: () => apiClient.get('/admin/settings').then(res => res.data),
  updateSettings: (data: any) => apiClient.patch('/admin/settings', data).then(res => res.data),

  // Cartera (Wallet)
  getWallet: () => apiClient.get('/wallet').then(res => res.data),
  initTopUp: (amountCents: number) => apiClient.post('/wallet/topup', {
    amount_cents: amountCents,
    success_url: window.location.origin + '/wallet?success=true',
    cancel_url: window.location.origin + '/wallet?cancel=true'
  }).then(res => res.data),
  openPortal: () => apiClient.post('/wallet/portal', {
    return_url: window.location.origin + '/wallet'
  }).then(res => res.data),
}

export { getCurrentTenant, isSuperAdminRoute, api }
export default apiClient
