<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <!-- Top Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-3">
          <div class="px-2 py-1 rounded bg-brand-primary-500 text-[8px] font-black text-white uppercase tracking-tighter">Central Node</div>
          <h2 class="text-3xl font-black text-white uppercase tracking-tight leading-none">SIMS Cloud Intelligence</h2>
        </div>
        <p class="text-sm text-slate-400 font-medium max-w-xl">Monitorización global de infraestructura, facturación y rendimiento de flota multitenant.</p>
      </div>
      <div class="relative z-10">
        <button 
          @click="syncAll" 
          :disabled="loading || syncing"
          class="group flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          <span class="material-icons text-base" :class="{'animate-spin': loading || syncing}">refresh</span>
          {{ syncing ? 'Escaneando...' : 'Sincronizar Ecosistema' }}
        </button>
      </div>
      <div class="absolute -right-20 -top-20 size-64 bg-brand-primary-600/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Fila 1: KPIs Principales (TOTALMENTE REALES) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="kpi in kpis" :key="kpi.label" class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div :class="kpi.color" class="size-10 rounded-xl flex items-center justify-center">
            <span class="material-icons text-xl">{{ kpi.icon }}</span>
          </div>
          <span class="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Real-Time</span>
        </div>
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{{ kpi.label }}</p>
        <p class="text-3xl font-black text-slate-900 dark:text-white tabular-nums">{{ kpi.value }}</p>
        <p class="text-[9px] text-slate-500 mt-2 font-medium leading-relaxed">{{ kpi.desc }}</p>
      </div>
    </div>

    <!-- Estatus de Nodos e Información Real -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        
        <!-- Monitor de Nodos -->
        <div class="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-sm font-black text-white uppercase tracking-widest">Estatus de Microservicios</h3>
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Infraestructura OK</span>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="node in nodes" :key="node.name" class="p-5 rounded-2xl bg-white/5 border border-white/10 group hover:border-brand-primary-500/30 transition-all">
              <div class="flex items-center justify-between mb-4">
                <span class="material-icons" :class="node.iconColor">{{ node.icon }}</span>
                <span class="text-[9px] font-mono text-emerald-400">{{ node.status }}</span>
              </div>
              <p class="text-[10px] font-black text-white uppercase mb-1">{{ node.name }}</p>
              <p class="text-[9px] text-slate-500 leading-relaxed">{{ node.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Mejores Tenants (TOP DATA) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Top Vehículos -->
          <div class="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="flex items-center gap-3 mb-6">
              <span class="material-icons text-blue-500">directions_car</span>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mayor Flota Activa</p>
            </div>
            <div v-if="globalStats.top_tenant_by_vehicles" class="flex items-center justify-between">
              <div>
                <p class="text-2xl font-black text-slate-900 dark:text-white uppercase">{{ globalStats.top_tenant_by_vehicles.id }}</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase">Tenant Leader</p>
              </div>
              <div class="text-right">
                <p class="text-3xl font-black text-blue-500 tabular-nums">{{ globalStats.top_tenant_by_vehicles.count }}</p>
                <p class="text-[8px] font-black text-slate-400 uppercase">Unidades</p>
              </div>
            </div>
          </div>

          <!-- Top Usuarios -->
          <div class="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="flex items-center gap-3 mb-6">
              <span class="material-icons text-brand-primary-500">groups</span>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mayor Masa Crítica</p>
            </div>
            <div v-if="globalStats.top_tenant_by_users" class="flex items-center justify-between">
              <div>
                <p class="text-2xl font-black text-slate-900 dark:text-white uppercase">{{ globalStats.top_tenant_by_users.id }}</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase">Tenant Popular</p>
              </div>
              <div class="text-right">
                <p class="text-3xl font-black text-brand-primary-500 tabular-nums">{{ globalStats.top_tenant_by_users.count }}</p>
                <p class="text-[8px] font-black text-slate-400 uppercase">Usuarios</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Market Share & Billing -->
      <div class="space-y-8">
        <!-- Gráfico Circular Real -->
        <div class="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="text-center mb-8">
            <h3 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Market Share</h3>
            <p class="text-[9px] text-slate-500 font-bold uppercase mt-1">Distribución de Planes Real</p>
          </div>
          
          <div class="relative size-48 mx-auto mb-8">
            <svg class="size-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" class="text-slate-100 dark:text-slate-800" stroke="currentColor" stroke-width="4" />
              <circle 
                cx="18" cy="18" r="16" fill="none" 
                class="text-brand-primary-500 transition-all duration-1000" 
                stroke="currentColor" stroke-width="4" 
                stroke-linecap="round"
                :stroke-dasharray="`${proPercentage} 100`" 
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-black text-slate-900 dark:text-white leading-none">{{ proPercentage }}%</span>
              <span class="text-[8px] font-black text-brand-primary-500 uppercase tracking-widest mt-1">PRO ADOPTION</span>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between p-4 rounded-2xl bg-brand-primary-50/50 dark:bg-brand-primary-900/10 border border-brand-primary-100 dark:border-brand-primary-800/50">
              <div class="flex flex-col">
                <span class="text-[10px] font-black text-brand-primary-700 dark:text-brand-primary-400 uppercase leading-none mb-1">Pro Business</span>
                <span class="text-[8px] text-slate-400 font-bold uppercase tracking-tight">Full Features</span>
              </div>
              <span class="text-xl font-black text-brand-primary-700 dark:text-brand-primary-400">{{ planStats.pro }}</span>
            </div>
            <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <div class="flex flex-col">
                <span class="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase leading-none mb-1">Hub Basic</span>
                <span class="text-[8px] text-slate-400 font-bold uppercase tracking-tight">Standard Only</span>
              </div>
              <span class="text-xl font-black text-slate-700 dark:text-white">{{ planStats.base }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTenants } from '../composables/useTenants'
import { centralApi } from '@/services/centralApi'

const { tenants, loading, fetchTenants } = useTenants()
const syncing = ref(false)
const apiLatency = ref(0)

const globalStats = ref<any>({
  total_tenants: 0,
  total_users: 0,
  total_vehicles: 0,
  total_reservations: 0,
  total_tickets: 0,
  total_mrr_cents: 0,
  top_tenant_by_vehicles: null,
  top_tenant_by_users: null,
})

const syncAll = async () => {
  syncing.value = true
  const start = performance.now()
  try {
    // 1. Cargar lista de tenants (proporciona datos para plan distro y ranking)
    await fetchTenants()
    // 2. Cargar estadísticas globales reales del backend
    const res = await centralApi.getGlobalStats()
    globalStats.value = res
    // 3. Calcular latencia
    apiLatency.value = Math.round(performance.now() - start)
  } catch (e) {
    console.error('Error in synchronization:', e)
  } finally {
    setTimeout(() => { syncing.value = false }, 600)
  }
}

const kpis = computed(() => [
  { 
    label: 'Total Tenants', 
    value: tenants.value.length, 
    icon: 'business', 
    color: 'bg-brand-primary-50 text-brand-primary-600', 
    desc: 'Empresas con aislamiento de datos.' 
  },
  { 
    label: 'Gente Registrada', 
    value: globalStats.value.total_users || 0, 
    icon: 'people', 
    color: 'bg-emerald-50 text-emerald-600', 
    desc: 'Total de usuarios en todos los inquilinos.' 
  },
  { 
    label: 'Flota Global', 
    value: globalStats.value.total_vehicles || 0, 
    icon: 'directions_car', 
    color: 'bg-blue-50 text-blue-600', 
    desc: 'Vehículos con telemetría activa.' 
  },
  { 
    label: 'MRR Acumulado', 
    value: formatCurrency((globalStats.value.total_mrr_cents || 0) / 100), 
    icon: 'payments', 
    color: 'bg-amber-50 text-amber-600', 
    desc: 'Ingresos mensuales recurrentes totales.' 
  }
])

const nodes = computed(() => [
  { name: 'Broker MQTT', icon: 'sensors', status: 'Online', iconColor: 'text-blue-400', desc: 'Protocolo IoT central operativo.' },
  { name: 'Central API', icon: 'dns', status: apiLatency.value + 'ms', iconColor: 'text-brand-primary-400', desc: 'Núcleo lógico y seguridad multitenant.' },
  { name: 'Cluster DB', icon: 'storage', status: tenants.value.length + ' Dbs', iconColor: 'text-amber-400', desc: 'Esquemas PostgreSQL independientes.' }
])

const planStats = computed(() => {
  const stats = { pro: 0, base: 0 }
  tenants.value.forEach(t => {
    const isPro = t.company_plan === 'pro' || t.billing?.price_id?.toLowerCase().includes('pro')
    isPro ? stats.pro++ : stats.base++
  })
  return stats
})

const proPercentage = computed(() => tenants.value.length ? Math.round((planStats.value.pro / tenants.value.length) * 100) : 0)

const formatCurrency = (val: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val)

onMounted(syncAll)
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>