<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden">
    <!-- Topbar principal -->
    <header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80 transition-colors duration-300 shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-[68px] items-center justify-between gap-3">
          
          <!-- Logo y Navegación Desktop -->
          <div class="flex items-center gap-6">
            <router-link to="/" class="flex items-center gap-2.5 group transition-transform active:scale-95">
              <div class="h-11 w-11 rounded-xl bg-white p-0.5 ring-1 ring-gray-100 shadow-lg shadow-brand-primary-500/20 group-hover:scale-105 transition-all duration-300">
                <img src="/logo.png" alt="Fleetly Logo" class="h-full w-full object-contain" />
              </div>
              <span class="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-brand-primary-600 dark:group-hover:text-brand-primary-400 transition-colors">Fleetly</span>
            </router-link>
            <div class="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-primary-50 dark:bg-brand-primary-900/25 border border-brand-primary-100 dark:border-brand-primary-800/50 max-w-56">
              <BuildingOffice2Icon class="size-4 text-gray-500 dark:text-gray-400 shrink-0" />
              <span class="text-[10px] font-black uppercase tracking-widest text-brand-primary-700 dark:text-brand-primary-300 truncate">{{ currentTenantLabel }}</span>
            </div>

            <!-- Nav Links Desktop -->
            <nav class="hidden md:flex items-center gap-1.5">
              <router-link 
                v-for="item in navigation" 
                :key="item.name" 
                :to="item.to"
                :class="[
                  isActive(item.to) 
                    ? 'bg-brand-primary-50 text-brand-primary-700 dark:bg-brand-primary-900/30 dark:text-brand-primary-300 border-brand-primary-200/70 dark:border-brand-primary-800/70 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-brand-primary-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
                  'px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ease-out active:scale-95 border border-transparent'
                ]"
              >
                {{ item.name }}
              </router-link>
            </nav>
          </div>

          <!-- Acciones Derecha -->
          <div class="flex items-center gap-2">
            <!-- BOTÓN DESTACADO: CONTROL DE VEHÍCULO (Solo si hay viaje activo) -->
            <Transition
              enter-active-class="transition ease-out duration-300"
              enter-from-class="opacity-0 scale-90 translate-x-4"
              enter-to-class="opacity-100 scale-100 translate-x-0"
            >
              <router-link 
                v-if="hasActiveBooking"
                to="/active-vehicle"
                :class="[
                  route.path === '/active-vehicle' 
                    ? 'bg-green-600 text-white shadow-green-500/40' 
                    : 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/20'
                ]"
                class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-xl animate-pulse-gentle"
              >
                <div class="size-2 rounded-full bg-white animate-ping"></div>
                {{ t('layout.in_trip') }}
              </router-link>
            </Transition>

            <!-- Selector de Tema -->
              <button 
              @click="toggleTheme" 
              class="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-all active:scale-75"
              :title="t('layout.change_theme')"
            >
              <SunIcon v-if="isDark" class="size-5" />
              <MoonIcon v-else class="size-5" />
            </button>

            <!-- Botón Admin -->
            <router-link 
              v-if="isAdmin" 
              to="/admin" 
              class="group hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 dark:hover:from-amber-900/35 dark:hover:to-orange-900/35 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md border border-amber-200/60 dark:border-amber-900/60 hover:-translate-y-0.5"
            >
              <span class="relative flex size-2">
                <span class="absolute inline-flex h-full w-full rounded-full bg-amber-500/70 animate-ping"></span>
                <span class="relative inline-flex size-2 rounded-full bg-amber-500"></span>
              </span>
              <ShieldCheckIcon class="size-3.5 group-hover:scale-110 transition-transform" />
              {{ t('layout.admin_panel') }}
            </router-link>

            <div class="transition-all active:scale-95 duration-200">
              <UserMenu />
            </div>

            <button 
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="p-2 rounded-xl text-gray-500 md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 active:scale-75"
            >
              <Bars3Icon v-if="!mobileMenuOpen" class="size-6" />
              <XMarkIcon v-else class="size-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Navegación Móvil -->
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="mobileMenuOpen" class="md:hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-2 shadow-2xl">
          <div class="mb-2 px-4 py-2 rounded-xl bg-brand-primary-50 dark:bg-brand-primary-900/25 border border-brand-primary-100 dark:border-brand-primary-800/50">
            <p class="text-[9px] font-black uppercase tracking-widest text-gray-400">{{ t('layout.current_company') }}</p>
            <p class="text-xs font-black uppercase tracking-wider text-brand-primary-700 dark:text-brand-primary-300 truncate mt-1">{{ currentTenantLabel }}</p>
          </div>

          <!-- Link destacado en móvil -->
          <router-link 
            v-if="hasActiveBooking"
            to="/active-vehicle"
            @click="mobileMenuOpen = false"
            class="block px-4 py-4 rounded-2xl bg-green-500 text-white text-base font-black uppercase tracking-widest shadow-lg shadow-green-500/20 mb-4"
          >
            <div class="flex items-center gap-4">
              <div class="p-2 rounded-xl bg-white/20">
                <TruckIcon class="size-6" />
              </div>
              {{ t('layout.control_trip') }}
            </div>
          </router-link>

          <router-link 
            v-for="item in navigation" 
            :key="item.name" 
            :to="item.to"
            @click="mobileMenuOpen = false"
            :class="[
              isActive(item.to) 
                ? 'bg-brand-primary-50 text-brand-primary-600 dark:bg-brand-primary-900/20 dark:text-brand-primary-400' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
              'block px-4 py-3.5 rounded-2xl text-base font-bold transition-all active:scale-[0.98]'
            ]"
          >
            <div class="flex items-center gap-4">
              <div :class="[isActive(item.to) ? 'bg-brand-primary-600 text-white shadow-lg shadow-brand-primary-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400']" class="p-2 rounded-xl transition-all">
                <component :is="item.icon" class="size-5" />
              </div>
              {{ item.name }}
            </div>
          </router-link>
        </div>
      </Transition>
    </header>

    <!-- Contenido principal -->
    <main class="relative">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in" appear>
          <div :key="route.path" :class="[isFullPage ? 'fleetly-fade-up' : 'fleetly-fade-up py-6 sm:py-8 lg:py-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8']">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
      <ChatbotPage v-if="canUseAI" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Bars3Icon, 
  XMarkIcon, 
  MapIcon, 
  TruckIcon, 
  TicketIcon, 
  CalendarDaysIcon, 
  UserIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  SunIcon,
  MoonIcon
} from '@heroicons/vue/24/outline'
import { useAuth } from '@/modules/auth/composables/useAuth'
import { usePlan } from '@/modules/common/composables/usePlan'
import UserMenu from '@/modules/common/components/UserMenu.vue'
import ChatbotPage from '@/modules/common/pages/ChatbotPage.vue'
import useBookingsUser from '@/modules/bookings/composables/useBookingsUser'
import { getCurrentTenant } from '@/services/api'
import { useTheme } from '@/modules/common/composables/useTheme'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const { user } = useAuth()
const { canUseAI, fetchCurrentPlan } = usePlan()
const { getBookings, hasActiveBooking } = useBookingsUser()
const { isDark, toggleTheme, initTheme, fetchAndApplyTenantTheme } = useTheme()
const mobileMenuOpen = ref(false)

const isFullPage = computed(() => route.path === '/vehicles/map')

const isActive = (path: string) => {
  if (path === route.path) return true
  if (path === '/vehicles' && route.path.startsWith('/vehicles') && route.path !== '/vehicles/map') return true
  return false
}

const isAdmin = computed(() => 
  user.value?.roles?.some((r: any) => (r.name || '').toLowerCase() === 'admin')
)

const currentTenantLabel = computed(() => {
  route.fullPath
  const tenant = getCurrentTenant()?.trim()
  return tenant || 'sin-tenant'
})

const navigation = computed(() => [
  { name: t('nav.map'), to: '/vehicles/map', icon: MapIcon },
  { name: t('nav.vehicles'), to: '/vehicles', icon: TruckIcon },
  { name: t('nav.bookings'), to: '/bookings', icon: CalendarDaysIcon },
])

// Polling global para detectar si el usuario inicia un viaje
let pollInterval: any = null
onMounted(() => {
  initTheme()
  fetchAndApplyTenantTheme()
  fetchCurrentPlan()
  getBookings()
  pollInterval = setInterval(getBookings, 10000) // Cada 10s verificamos estado de viaje
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-enter-from { opacity: 0; transform: translateY(10px); }
.page-leave-to { opacity: 0; transform: translateY(-10px); }

.animate-pulse-gentle {
  animation: pulse-gentle 2s infinite;
}

@keyframes pulse-gentle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.02); }
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark ::-webkit-scrollbar-thumb { background: #1e293b; }
</style>
