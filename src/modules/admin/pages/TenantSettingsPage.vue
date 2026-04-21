<template>
  <div class="space-y-8 fleetly-fade-up">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Opciones del Servidor</h2>
        <p class="text-sm text-slate-500 font-medium">Personaliza la identidad visual y configuración técnica de tu entorno.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Lado Izquierdo: Formulario de Marca -->
      <div class="lg:col-span-2 space-y-8">
        <section class="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="flex items-center gap-3 mb-8">
            <div class="size-10 rounded-2xl bg-brand-primary-50 dark:bg-brand-primary-900/20 text-brand-primary-600 flex items-center justify-center">
              <span class="material-icons">palette</span>
            </div>
            <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Identidad Visual</h3>
          </div>

          <div class="space-y-10">
            <!-- Theme Selection -->
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Color de Marca</p>
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <button
                  v-for="t in themes"
                  :key="t.id"
                  type="button"
                  @click="handleUpdateTheme(t.id)"
                  :disabled="updating"
                  :class="[
                    brandTheme === t.id ? 'ring-2 ring-brand-primary-500 ring-offset-4 dark:ring-offset-slate-900 scale-105 shadow-xl' : 'hover:scale-105 opacity-60 hover:opacity-100'
                  ]"
                  class="group flex flex-col items-center gap-2 p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 transition-all disabled:opacity-50"
                >
                  <div :class="t.color" class="size-10 rounded-2xl shadow-lg"></div>
                  <span class="text-[9px] font-black uppercase tracking-tighter text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{{ t.name }}</span>
                </button>
              </div>
            </div>

            <!-- Preview Card -->
            <div class="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Vista Previa de Componentes</p>
              <div class="flex flex-wrap gap-4">
                <button class="px-6 py-2.5 rounded-xl bg-brand-primary-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary-500/20">Botón Primario</button>
                <button class="px-6 py-2.5 rounded-xl border border-brand-primary-200 dark:border-brand-primary-800 text-brand-primary-600 dark:text-brand-primary-400 text-[10px] font-black uppercase tracking-widest">Botón Outline</button>
                <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary-50 dark:bg-brand-primary-900/30 text-brand-primary-600 dark:text-brand-primary-400 text-[10px] font-black border border-brand-primary-100 dark:border-brand-primary-800/50">
                  <span class="size-1.5 rounded-full bg-brand-primary-500 animate-pulse"></span>
                  Badge Activo
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Placeholder for future relevant options -->
        <section class="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm opacity-60 grayscale cursor-not-allowed">
           <div class="flex items-center justify-between mb-6">
             <div class="flex items-center gap-3">
                <div class="size-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                  <span class="material-icons">notifications_active</span>
                </div>
                <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Notificaciones del Sistema</h3>
             </div>
             <span class="px-3 py-1 rounded-lg bg-amber-50 text-amber-600 text-[8px] font-black uppercase tracking-widest border border-amber-100">Próximamente</span>
           </div>
           <p class="text-xs text-slate-500">Configura avisos automáticos por email para mantenimiento y alertas de flota.</p>
        </section>
      </div>

      <!-- Lado Derecho: Info Técnica (No editable) -->
      <div class="space-y-8">
        <section class="p-8 rounded-[2.5rem] bg-slate-900 dark:bg-slate-950 text-white shadow-xl shadow-slate-900/10 border border-slate-800">
          <div class="flex items-center gap-3 mb-8">
            <span class="material-icons text-brand-primary-400">dns</span>
            <h3 class="text-xs font-black uppercase tracking-[0.2em]">Detalles del Entorno</h3>
          </div>

          <div class="space-y-6">
            <div>
              <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Identificador del Tenant</p>
              <p class="text-sm font-bold font-mono text-brand-primary-400">{{ settings.id }}</p>
              <p class="text-[9px] text-slate-500 mt-1 italic">Este ID es la base de tu URL y no se puede cambiar por seguridad.</p>
            </div>

            <div class="pt-4 border-t border-slate-800">
              <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Plan de Servicio</p>
              <div class="flex items-center gap-2">
                <span class="text-sm font-black text-white uppercase">{{ settings.company_plan === 'pro' ? 'Profesional (Enterprise)' : 'Básico (Hub)' }}</span>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-800">
              <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Activo desde</p>
              <p class="text-sm font-bold text-slate-300">{{ formatDate(settings.created_at) }}</p>
            </div>
            
            <div class="pt-6">
               <div class="p-4 rounded-2xl bg-brand-primary-500/10 border border-brand-primary-500/20">
                 <p class="text-[10px] font-bold text-brand-primary-300 leading-relaxed">
                   Si necesitas cambiar el nombre legal o migrar tu ID, contacta con soporte@fleetly.com
                 </p>
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import { useTheme } from '@/modules/common/composables/useTheme'
import { useToast } from '@/modules/common/composables/useToast'

const { brandTheme, updateCentralTheme, setBrandTheme } = useTheme()
const toast = useToast()
const updating = ref(false)
const settings = ref<any>({
  id: 'Cargando...',
  company_plan: 'base',
  created_at: new Date().toISOString()
})

const themes = [
  { id: 'indigo', name: 'Crimson', color: 'bg-[#ef4444]' },
  { id: 'ocean', name: 'Ocean', color: 'bg-blue-600' },
  { id: 'sunset', name: 'Sunset', color: 'bg-amber-500' },
  { id: 'nature', name: 'Nature', color: 'bg-emerald-600' },
  { id: 'royal', name: 'Royal', color: 'bg-purple-600' },
  { id: 'baltic', name: 'Baltic', color: 'bg-[#26619C]' },
]

const loadSettings = async () => {
  try {
    const res = await api.getSettings()
    if (res.success) {
      settings.value = res.data
    }
  } catch (e) {
    console.error('Error loading settings:', e)
  }
}

const handleUpdateTheme = async (themeId: string) => {
  updating.value = true
  // 1. Guardamos el estado anterior por si falla la API
  const prevTheme = brandTheme.value
  
  try {
    // 2. Aplicación instantánea en UI y Cache Local
    setBrandTheme(themeId)
    
    // 3. Guardado permanente en base de datos
    const res = await api.updateSettings({ company_theme: themeId })
    if (res.success) {
      toast.success('Marca actualizada correctamente')
    }
  } catch (e) {
    // Revertir en local si el servidor da error
    setBrandTheme(prevTheme)
    toast.error('No se pudo guardar la configuración')
  } finally {
    updating.value = false
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  })
}

onMounted(loadSettings)
</script>
