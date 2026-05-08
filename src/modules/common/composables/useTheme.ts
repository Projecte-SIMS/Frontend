import { ref } from 'vue'
import { centralApi } from '@/services/centralApi'
import { getCurrentTenant } from '@/services/api'

// Intentamos leer del localStorage inmediatamente para evitar el delay asíncrono
const isDark = ref(localStorage.getItem('theme') !== 'light')
const brandTheme = ref(localStorage.getItem('brand_theme') || 'indigo')

export function useTheme() {
  const applyTheme = () => {
    // Dark mode
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      document.documentElement.style.colorScheme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.style.colorScheme = 'light'
    }

    // Brand theme
    document.documentElement.classList.forEach(cls => {
      if (cls.startsWith('theme-')) {
        document.documentElement.classList.remove(cls)
      }
    })
    
    if (brandTheme.value && brandTheme.value !== 'indigo') {
      document.documentElement.classList.add(`theme-${brandTheme.value}`)
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  const setBrandTheme = (theme: string) => {
    brandTheme.value = theme
    // Guardamos siempre en local para carga instantánea en la próxima visita
    localStorage.setItem('brand_theme', theme)
    applyTheme()
  }

  const fetchAndApplyTenantTheme = async () => {
    const isSuperAdminRoute = window.location.pathname.startsWith('/superadmin')
    
    if (isSuperAdminRoute) {
        return fetchAndApplyCentralTheme()
    }

    const tenantId = getCurrentTenant()
    if (!tenantId || tenantId === 'central') {
        return fetchAndApplyCentralTheme()
    }

    try {
      const response = await centralApi.getTenantSettings(tenantId)
      if (response.success && response.data.theme) {
        // Solo actualizamos si el valor es realmente distinto para evitar parpadeos
        // y guardamos en localStorage para que la próxima carga sea rápida
        if (brandTheme.value !== response.data.theme) {
            brandTheme.value = response.data.theme
            localStorage.setItem('brand_theme', response.data.theme)
            applyTheme()
        }
      }
    } catch (e: any) {
      // 404 is common for non-existent tenants during typing or stale localStorage
      if (e.response?.status === 404) {
        console.debug(`Tenant "${tenantId}" not found. Clearing from localStorage and falling back to central theme.`)
        localStorage.removeItem('current_tenant')
        return fetchAndApplyCentralTheme()
      }
      console.warn('Could not fetch tenant theme:', e)
    }
  }

  const fetchAndApplyCentralTheme = async () => {
    try {
      const response = await centralApi.getCentralSettings()
      const theme = response.data?.superadmin_theme
      if (theme && brandTheme.value !== theme) {
        brandTheme.value = theme
        localStorage.setItem('brand_theme', theme)
        applyTheme()
      }
    } catch (e) {
      console.warn('Could not fetch central theme:', e)
    }
  }

  const updateCentralTheme = async (theme: string) => {
    try {
      // 1. Aplicación instantánea (Optimistic UI)
      setBrandTheme(theme)
      
      // 2. Guardado persistente en DB
      await centralApi.updateCentralSetting('superadmin_theme', theme)
      return true
    } catch (e) {
      console.error('Error updating central theme:', e)
      return false
    }
  }

  const initTheme = () => {
    // 1. Aplicación inmediata de lo que haya en caché (CERO DELAY)
    applyTheme()

    // 2. Manejo de URL (Prioridad máxima para tests)
    const urlParams = new URLSearchParams(window.location.search)
    const themeFromUrl = urlParams.get('theme')
    
    if (themeFromUrl) {
      brandTheme.value = themeFromUrl
      applyTheme()
    } else {
      // 3. Sincronización asíncrona con el servidor en segundo plano
      fetchAndApplyTenantTheme()
    }
  }

  return {
    isDark,
    brandTheme,
    toggleTheme,
    setBrandTheme,
    initTheme,
    fetchAndApplyTenantTheme,
    fetchAndApplyCentralTheme,
    updateCentralTheme
  }
}
