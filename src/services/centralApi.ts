import axios from 'axios'

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

// API client para la central (gestión de tenants)
const centralApiClient = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para añadir token central
centralApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('central_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

centralApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const requestUrl = String(error?.config?.url || '')
    const isLoginRequest = requestUrl.includes('/central/login')
    const inSuperAdminArea = window.location.pathname.startsWith('/superadmin')

    if (inSuperAdminArea && status === 401 && !isLoginRequest) {
      localStorage.removeItem('central_token')
      localStorage.removeItem('central_user')
      if (window.location.pathname !== '/superadmin/login') {
        window.location.replace('/superadmin/login?expired=1')
      }
    }

    return Promise.reject(error)
  }
)

export interface Tenant {
  id: string
  domains: string[]
  admin_email: string
  admin_username: string
  created_at: string
  updated_at: string
}

export interface CreateTenantRequest {
  id: string
  domain: string
}

export const centralApi = {
  // Login como super admin
  async login(email: string, password: string) {
    const response = await centralApiClient.post('/central/login', { email, password })
    if (response.data.token) {
      localStorage.setItem('central_token', response.data.token)
    }
    return response.data
  },

  // Logout
  logout() {
    localStorage.removeItem('central_token')
    localStorage.removeItem('central_user')
  },

  // Check if logged in
  isAuthenticated(): boolean {
    return !!localStorage.getItem('central_token')
  },

  // Listar todos los tenants
  async getTenants(): Promise<Tenant[]> {
    const response = await centralApiClient.get('/tenants')
    return response.data.data
  },

  // Crear nuevo tenant
  async createTenant(data: CreateTenantRequest) {
    const response = await centralApiClient.post('/tenants', data)
    return response.data
  },

  // Ver tenant específico
  async getTenant(id: string): Promise<Tenant> {
    const response = await centralApiClient.get(`/tenants/${id}`)
    return response.data.data
  },

  // Añadir dominio a tenant
  async addDomain(tenantId: string, domain: string) {
    const response = await centralApiClient.post(`/tenants/${tenantId}/domains`, { domain })
    return response.data
  },

  // Resetear contraseña del admin de un tenant
  async resetAdminPassword(tenantId: string, newPassword?: string) {
    const response = await centralApiClient.post(`/tenants/${tenantId}/reset-password`, {
      password: newPassword
    })
    return response.data
  },

  // Eliminar tenant
  async deleteTenant(id: string) {
    const response = await centralApiClient.delete(`/tenants/${id}`)
    return response.data
  }
}

export default centralApiClient
