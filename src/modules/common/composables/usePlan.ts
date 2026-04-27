import { ref, computed } from 'vue'
import { api } from '@/services/api'
import { useAuth } from '@/modules/auth/composables/useAuth'

// Estado global reactivo para el plan actual
const currentPlan = ref<'base' | 'pro'>('base')
const planLoaded = ref(false)

export function usePlan() {
  const { user } = useAuth()
  
  const fetchCurrentPlan = async () => {
    // Si no hay usuario o no es admin, no intentamos cargar settings protegidas
    const isAdmin = !!(user.value && user.value.roles && user.value.roles.some((r: any) => (r.name || '').toLowerCase() === 'admin'))
    
    if (!isAdmin) {
      currentPlan.value = 'base'
      planLoaded.value = true
      return
    }

    try {
      const res = await api.getSettings()
      if (res.success) {
        currentPlan.value = res.data.company_plan || 'base'
        planLoaded.value = true
      }
    } catch (e) {
      console.error('Error fetching plan:', e)
    }
  }

  const isPro = computed(() => currentPlan.value === 'pro')
  const isBase = computed(() => currentPlan.value === 'base')

  // Capacidades
  const canUseAI = computed(() => isPro.value)
  const canCustomBranding = computed(() => isPro.value)
  const vehicleLimit = computed(() => isPro.value ? Infinity : 50)

  return {
    currentPlan,
    planLoaded,
    isPro,
    isBase,
    canUseAI,
    canCustomBranding,
    vehicleLimit,
    fetchCurrentPlan
  }
}
