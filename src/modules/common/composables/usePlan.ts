import { ref, computed } from 'vue'
import { api } from '@/services/api'

// Estado global reactivo para el plan actual
const currentPlan = ref<'base' | 'pro'>('base')
const planLoaded = ref(false)

export function usePlan() {
  
  const fetchCurrentPlan = async () => {
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
