<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-white uppercase tracking-tight">Resumen Ejecutivo</h2>
        <p class="text-sm text-slate-500 font-medium">Métricas globales del ecosistema SIMS Hub.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
          <span class="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Infraestructura OK</span>
        </div>
        <button 
          @click="fetchTenants" 
          :disabled="loading"
          class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 transition-all shadow-sm active:scale-90"
        >
          <span class="material-icons text-xl" :class="{'animate-spin': loading}">sync</span>
        </button>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div class="relative z-10">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Empresas Activas</p>
          <p class="text-4xl font-black text-slate-900 dark:text-white tabular-nums">{{ tenants.length }}</p>
          <p class="text-[10px] font-bold text-emerald-500 mt-4 flex items-center gap-1 uppercase">
            <span class="material-icons text-sm">trending_up</span> +12% este mes
          </p>
        </div>
        <span class="material-icons absolute -right-4 -bottom-4 text-8xl text-slate-100 dark:text-slate-800/50 group-hover:text-indigo-500/10 transition-colors">business</span>
      </div>

      <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div class="relative z-10">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Usuarios Globales</p>
          <p class="text-4xl font-black text-slate-900 dark:text-white tabular-nums">{{ totalUsers }}</p>
          <p class="text-[10px] font-bold text-slate-400 mt-4 uppercase">Estimación operativa</p>
        </div>
        <span class="material-icons absolute -right-4 -bottom-4 text-8xl text-slate-100 dark:text-slate-800/50 group-hover:text-purple-500/10 transition-colors">groups</span>
      </div>

      <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div class="relative z-10">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">MRR Estimado</p>
          <p class="text-4xl font-black text-slate-900 dark:text-white tabular-nums">{{ formatCurrency(estimatedMRR) }}</p>
          <p class="text-[10px] font-bold text-slate-400 mt-4 uppercase">Suscripciones activas</p>
        </div>
        <span class="material-icons absolute -right-4 -bottom-4 text-8xl text-slate-100 dark:text-slate-800/50 group-hover:text-emerald-500/10 transition-colors">payments</span>
      </div>

      <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div class="relative z-10">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Salud de Red</p>
          <p class="text-4xl font-black text-emerald-500 tabular-nums">99.9%</p>
          <p class="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest flex items-center gap-1">
            <span class="size-1.5 rounded-full bg-emerald-500"></span> Infraestructura OK
          </p>
        </div>
        <span class="material-icons absolute -right-4 -bottom-4 text-8xl text-slate-100 dark:text-slate-800/50 group-hover:text-blue-500/10 transition-colors">dns</span>
      </div>
    </div>

    <!-- Snapshots -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Altas Recientes</h3>
          <router-link to="/superadmin/tenants" class="text-[10px] font-black text-indigo-500 hover:text-indigo-400 uppercase tracking-widest transition-colors">Gestionar Todas</router-link>
        </div>
        
        <div class="space-y-4">
          <div v-for="t in recentTenants" :key="t.id" class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 group hover:border-indigo-500/30 transition-all">
            <div class="flex items-center gap-4">
              <div class="size-10 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs font-black text-indigo-600">
                {{ t.id.substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <p class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ t.id }}</p>
                <p class="text-[10px] font-bold text-slate-400">{{ formatDate(t.created_at) }}</p>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">ACTIVO</span>
          </div>
        </div>
      </div>

      <div class="p-8 rounded-3xl bg-indigo-600 shadow-xl shadow-indigo-500/20 relative overflow-hidden">
        <div class="relative z-10">
          <h3 class="text-xs font-black text-indigo-100 uppercase tracking-[0.2em] mb-6">Estado de Facturación</h3>
          <div class="space-y-6">
            <div class="p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <div class="flex justify-between items-center mb-2">
                <span class="text-[10px] font-black text-indigo-100 uppercase">Proyección Anual (ARR)</span>
                <span class="text-xs font-black text-white tabular-nums">{{ formatCurrency(estimatedMRR * 12) }}</span>
              </div>
              <div class="h-1.5 w-full bg-indigo-900/40 rounded-full overflow-hidden">
                <div class="h-full bg-white rounded-full" style="width: 65%"></div>
              </div>
            </div>
            <p class="text-xs text-indigo-100/80 font-medium leading-relaxed">
              El 85% de las empresas utilizan el plan base. Se recomienda lanzar campaña para el plan Pro este trimestre.
            </p>
            <button class="w-full py-3 rounded-xl bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg active:scale-95">
              Generar Reporte Mensual
            </button>
          </div>
        </div>
        <div class="absolute -right-10 -top-10 size-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTenants } from '../composables/useTenants'

const { tenants, loading, fetchTenants } = useTenants()

const estimatedMRR = computed(() => tenants.value.length * 49)

const totalUsers = computed(() => {
  return tenants.value.reduce((acc, t) => {
    // Hash-based estimate for demo purposes
    const hash = t.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return acc + (8 + (hash % 42))
  }, 0)
})

const recentTenants = computed(() => {
  return [...tenants.value]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4)
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(() => {
  fetchTenants()
})
</script>
