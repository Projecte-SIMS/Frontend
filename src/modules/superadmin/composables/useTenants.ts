import { ref } from 'vue'
import { centralApi, type Tenant, type CreateTenantRequest } from '@/services/centralApi'

export function useTenants() {
  const tenants = ref<Tenant[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTenants = async () => {
    loading.value = true
    error.value = null
    try {
      tenants.value = await centralApi.getTenants()
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar tenants'
      throw e
    } finally {
      loading.value = false
    }
  }

  const createTenant = async (data: CreateTenantRequest) => {
    loading.value = true
    error.value = null
    try {
      const response = await centralApi.createTenant(data)
      await fetchTenants()
      return response
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al crear tenant'
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteTenant = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await centralApi.deleteTenant(id)
      await fetchTenants()
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al eliminar tenant'
      throw e
    } finally {
      loading.value = false
    }
  }

  const resetAdminPassword = async (tenantId: string, newPassword?: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await centralApi.resetAdminPassword(tenantId, newPassword)
      return response
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al resetear contraseña'
      throw e
    } finally {
      loading.value = false
    }
  }

  const getBillingStatus = async (tenantId: string) => {
    loading.value = true
    error.value = null
    try {
      return await centralApi.getTenantBillingStatus(tenantId)
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar facturación'
      throw e
    } finally {
      loading.value = false
    }
  }

  const createCheckoutSession = async (tenantId: string, payload: {
    success_url: string
    cancel_url: string
    price_id?: string
  }) => {
    loading.value = true
    error.value = null
    try {
      return await centralApi.createTenantCheckoutSession(tenantId, payload)
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al iniciar checkout'
      throw e
    } finally {
      loading.value = false
    }
  }

  const createPortalSession = async (tenantId: string, payload: { return_url: string }) => {
    loading.value = true
    error.value = null
    try {
      return await centralApi.createTenantPortalSession(tenantId, payload)
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al abrir portal de pago'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateDemoBillingProfile = async (tenantId: string, payload: {
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
  }) => {
    loading.value = true
    error.value = null
    try {
      return await centralApi.updateTenantDemoBillingProfile(tenantId, payload)
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al actualizar datos de pago'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    tenants,
    loading,
    error,
    fetchTenants,
    createTenant,
    deleteTenant,
    resetAdminPassword,
    getBillingStatus,
    createCheckoutSession,
    createPortalSession,
    updateDemoBillingProfile
  }
}
