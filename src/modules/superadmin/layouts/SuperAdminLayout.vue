<template>
  <div class="min-h-screen bg-slate-950 font-sans flex">
    <!-- Sidebar -->
    <aside class="w-72 bg-slate-900 border-r border-slate-800 flex flex-col fixed inset-y-0 z-50">
      <div class="p-8 border-b border-slate-800 flex items-center gap-4">
        <div class="h-12 w-12 rounded-2xl bg-white p-0.5 shadow-xl shadow-brand-primary-500/20">
          <img src="/logo.png" alt="Fleetly Logo" class="h-full w-full object-contain" />
        </div>
        <div>
          <h1 class="text-lg font-black text-white leading-none uppercase tracking-tighter">SuperAdmin</h1>
          <p class="text-[10px] font-black text-brand-primary-400 uppercase tracking-widest mt-1">SIMS Hub</p>
        </div>
      </div>

      <nav class="flex-1 p-6 space-y-2 overflow-y-auto">
        <p class="px-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Administración</p>
        
        <router-link 
          v-for="item in navItems" 
          :key="item.to" 
          :to="item.to"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group"
          :class="[
            route.path === item.to 
              ? 'bg-brand-primary-600 text-white shadow-lg shadow-brand-primary-500/20' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          ]"
        >
          <span class="material-icons text-xl">{{ item.icon }}</span>
          <span class="text-sm font-bold uppercase tracking-tight">{{ item.name }}</span>
        </router-link>
      </nav>

      <div class="p-6 border-t border-slate-800 space-y-4">
        <!-- Central Theme Selection -->
        <div class="px-2">
          <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Marca del Panel</p>
          <div class="flex items-center gap-3 pb-2 overflow-visible">
            <button
              v-for="t in themes"
              :key="t.id"
              type="button"
              @click="updateCentralTheme(t.id)"
              :class="[
                brandTheme === t.id ? 'ring-2 ring-brand-primary-500 ring-offset-2 ring-offset-slate-900 scale-110' : 'hover:scale-110 opacity-60 hover:opacity-100',
                t.color,
                'shrink-0 size-5 rounded-full transition-all shadow-sm'
              ]"
              :title="t.name"
            ></button>
          </div>
        </div>

        <div class="flex items-center gap-3 px-2">
          <div class="size-10 rounded-full bg-gradient-to-br from-brand-primary-500 to-brand-accent-600 flex items-center justify-center text-xs font-black text-white shadow-lg border-2 border-slate-800">
            {{ userInitials }}
          </div>
          <div class="min-w-0">
            <p class="text-xs font-black text-white truncate uppercase">{{ userDisplayName }}</p>
            <p class="text-[10px] text-slate-500 truncate">{{ userDisplayEmail }}</p>
          </div>
        </div>
        
        <button 
          @click="handleLogout"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 text-rose-400 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 hover:text-rose-300 transition-all border border-slate-700"
        >
          <span class="material-icons text-sm">logout</span>
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 ml-72 p-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
      <div class="max-w-6xl mx-auto">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCentralAuth } from '../composables/useCentralAuth'
import { useTheme } from '@/modules/common/composables/useTheme'

const route = useRoute()
const router = useRouter()
const { logout, user } = useCentralAuth()
const { initTheme, brandTheme, updateCentralTheme } = useTheme()

const themes = [
  { id: 'indigo', name: 'Crimson', color: 'bg-[#ef4444]' },
  { id: 'ocean', name: 'Ocean', color: 'bg-blue-600' },
  { id: 'sunset', name: 'Sunset', color: 'bg-amber-500' },
  { id: 'nature', name: 'Nature', color: 'bg-emerald-600' },
  { id: 'royal', name: 'Royal', color: 'bg-purple-600' },
  { id: 'baltic', name: 'Baltic', color: 'bg-[#26619C]' },
]

onMounted(() => {
  initTheme()
})

const navItems = [
  { name: 'Resumen', to: '/superadmin/dashboard', icon: 'dashboard' },
  { name: 'Empresas', to: '/superadmin/tenants', icon: 'business' },
  { name: 'Gestión IoT', to: '/superadmin/fleet', icon: 'sensors' },
  { name: 'Mi Perfil', to: '/superadmin/profile', icon: 'person' },
]

const userDisplayName = computed(() => user.value?.name || 'Super Admin')
const userDisplayEmail = computed(() => user.value?.email || 'superadmin@sims.com')
const userInitials = computed(() => 
  userDisplayName.value.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
)

const handleLogout = () => {
  logout()
  router.push('/superadmin/login')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
