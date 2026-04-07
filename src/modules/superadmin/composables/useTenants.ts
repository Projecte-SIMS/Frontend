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

  return {
    tenants,
    loading,
    error,
    fetchTenants,
    createTenant,
    deleteTenant,
    resetAdminPassword
  }
}
