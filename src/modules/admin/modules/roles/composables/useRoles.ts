import { ref, computed } from 'vue'
import { useToast } from '@/modules/common/composables/useToast'
import api from '@/services/api'
import type { Role, RoleForm, RoleFilters } from '../interfaces/role.interface'

export const useRoles = () => {
  const { success, error: showError } = useToast()

  const roles = ref<Role[]>([])
  const currentRole = ref<Role | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  })

  const isAdminRole = computed(() => {
    return currentRole.value?.name.toLowerCase() === 'admin'
  })

  const getRoles = async (page = 1, filters: RoleFilters = {}) => {
    loading.value = true
    error.value = null

    try {
      let url = `/admin/roles?page=${page}`
      if (filters.search) {
        url += `&search=${encodeURIComponent(filters.search)}`
      }

      const response = await api.get(url)
      const data = response.data

      roles.value = data.data || data
      
      if (data.current_page) {
        pagination.value = {
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total,
        }
      }
    } catch (err) {
      error.value = 'Error al cargar roles'
      showError('Error al cargar roles')
    } finally {
      loading.value = false
    }
  }

  const getRole = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/admin/roles/${id}`)
      currentRole.value = response.data
    } catch (err) {
      error.value = 'Error al cargar el rol'
      showError('Error al cargar rol')
    } finally {
      loading.value = false
    }
  }

  const createRole = async (data: RoleForm) => {
    loading.value = true
    error.value = null

    try {
      const payload = {
        name: data.name,
        permissions: data.permissions,
      }

      await api.post('/admin/roles', payload)
      success('Rol creado exitosamente')
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'No se pudo crear el rol'
      showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  const updateRole = async (id: number, data: RoleForm) => {
    loading.value = true
    error.value = null

    try {
      // Prevent editing admin role
      if (isAdminRole.value) {
        showError('No puedes editar el rol Admin')
        return false
      }

      const payload = {
        name: data.name,
        permissions: data.permissions,
      }

      await api.put(`/admin/roles/${id}`, payload)
      success('Rol actualizado exitosamente')
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'No se pudo actualizar el rol'
      showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteRole = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      // Prevent deleting admin role
      if (isAdminRole.value) {
        showError('No puedes eliminar el rol Admin')
        return false
      }

      await api.delete(`/admin/roles/${id}`)
      success('Rol eliminado exitosamente')
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'No se pudo eliminar el rol'
      showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    roles,
    currentRole,
    loading,
    error,
    pagination,
    isAdminRole,
    getRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole,
  }
}
