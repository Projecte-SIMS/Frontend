import axios from 'axios'

// API client para la central (gestión de tenants)
const centralApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
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
