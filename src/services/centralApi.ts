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

export interface TenantOwnerProfile {
  id: number
  tenant_id: string
  owner_name: string
  owner_email: string
  entity_type: string
  company_name?: string
  tax_id?: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  created_at: string
  updated_at: string
}

export interface Tenant {
  id: string
  domains: string[]
  admin_email: string
  admin_username: string
  created_at: string
  updated_at: string
  company_plan?: string
  company_theme?: string
  owner_profile?: TenantOwnerProfile
  billing?: BillingSnapshot
  stats?: {
    vehicles_count: number
    reservations_count: number
    tickets_count: number
  }
}

export interface BillingSnapshot {
  provider: string | null
  status: string
  customer_id: string | null
  subscription_id: string | null
  price_id: string | null
  currency: string
  monthly_amount_cents: number
  mrr_amount_cents: number
  arr_amount_cents: number
  current_period_end: string | null
  last_invoice_at: string | null
  last_invoice_status: string | null
  demo_profile?: DemoBillingProfile | null
  access?: BillingAccessStatus
}

export interface BillingAccessStatus {
  is_suspended: boolean
  overdue_days: number
  grace_days: number
  reference_date: string | null
  status_trigger: string
  reason: string | null
}

export interface DemoBillingProfile {
  billing_name: string
  billing_email: string
  payment_method: 'card' | 'sepa' | 'transfer' | 'wallet'
  card_last4?: string
  expiry_month?: number
  expiry_year?: number
  country: string
  city?: string
  postal_code?: string
  address_line?: string
  vat_number?: string
  updated_at?: string
}

export interface CreateTenantRequest {
  id: string
  domain: string
}

export interface DemoTenantOnboardingRequest {
  company_name: string
  company_slug?: string
  admin_name: string
  admin_email: string
  admin_password: string
  plan: 'base' | 'pro'
  theme?: string
  entity_type: 'individual' | 'company'
  tax_id: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  payment_demo_confirmed: true
  billing_name?: string
  billing_email?: string
  payment_method?: 'card' | 'sepa' | 'transfer' | 'wallet'
  country?: string
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

  async updateTenantTheme(tenantId: string, theme: string) {
    const response = await centralApiClient.patch(`/tenants/${tenantId}/theme`, { theme })
    return response.data
  },

  // Eliminar tenant
  async deleteTenant(id: string) {
    const response = await centralApiClient.delete(`/tenants/${id}`)
    return response.data
  },

  async getTenantBillingStatus(tenantId: string): Promise<BillingSnapshot> {
    const response = await centralApiClient.get(`/tenants/${tenantId}/billing/status`)
    return response.data.data
  },

  async createTenantCheckoutSession(tenantId: string, payload: {
    success_url: string
    cancel_url: string
    price_id?: string
  }) {
    const response = await centralApiClient.post(`/tenants/${tenantId}/billing/checkout-session`, payload)
    return response.data
  },

  async createTenantPortalSession(tenantId: string, payload: {
    return_url: string
  }) {
    const response = await centralApiClient.post(`/tenants/${tenantId}/billing/portal-session`, payload)
    return response.data
  },

  async updateTenantDemoBillingProfile(tenantId: string, payload: {
    billing_name: string
    billing_email: string
    payment_method: 'card' | 'sepa' | 'transfer' | 'wallet'
    card_last4?: string
    expiry_month?: number
    expiry_year?: number
    country: string
    city?: string
    postal_code?: string
    address_line?: string
    vat_number?: string
  }) {
    const response = await centralApiClient.post(`/tenants/${tenantId}/billing/demo-profile`, payload)
    return response.data
  },

  async completeDemoTenantOnboarding(payload: DemoTenantOnboardingRequest) {
    const response = await centralApiClient.post('/public/tenant-onboarding/demo-complete', payload)
    return response.data
  },

  async getTenantSettings(tenantId: string) {
    const response = await centralApiClient.get(`/public/tenants/${tenantId}/settings`)
    return response.data
  },

  async getCentralSettings() {
    const response = await centralApiClient.get('/public/settings')
    return response.data
  },

  async updateCentralSetting(key: string, value: string) {
    const response = await centralApiClient.post('/settings/update', { key, value })
    return response.data
  }
}

export default centralApiClient
