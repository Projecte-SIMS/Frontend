<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden">
    <!-- Topbar principal -->
    <header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80 transition-colors duration-300 shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between gap-4">
          
          <!-- Logo y Navegación Desktop -->
          <div class="flex items-center gap-8">
            <router-link to="/" class="flex items-center gap-2.5 group transition-transform active:scale-95">
              <div class="h-9 w-9 rounded-xl bg-white p-1 shadow-lg shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <img src="/logo.png" alt="SIMS Logo" class="h-full w-full object-contain" />
              </div>
              <span class="text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">SIMS</span>
            </router-link>

            <!-- Nav Links Desktop -->
            <nav class="hidden md:flex items-center gap-1">
              <router-link 
                v-for="item in navigation" 
                :key="item.name" 
                :to="item.to"
                :class="[
                  isActive(item.to) 
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 shadow-sm scale-105' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
                  'px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ease-out active:scale-90 hover:-translate-y-0.5'
                ]"
              >
                {{ item.name }}
              </router-link>
            </nav>
          </div>

          <!-- Acciones Derecha -->
          <div class="flex items-center gap-3">
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
                class="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-xl animate-pulse-gentle"
              >
                <div class="size-2 rounded-full bg-white animate-ping"></div>
                En viaje
              </router-link>
            </Transition>

            <!-- Botón Admin -->
            <router-link 
              v-if="isAdmin" 
              to="/admin" 
              class="hidden sm:flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 hover:bg-amber-100 dark:text-amber-400 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 rounded-xl transition-all hover:-translate-y-0.5 active:scale-90 shadow-sm border border-amber-200/50 dark:border-amber-900/50"
            >
              <ShieldCheckIcon class="size-3.5" />
              Admin
            </router-link>

            <div class="transition-all hover:scale-105 active:scale-95 duration-200">
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
              Controlar mi viaje
            </div>
          </router-link>

          <router-link 
            v-for="item in navigation" 
            :key="item.name" 
            :to="item.to"
            @click="mobileMenuOpen = false"
            :class="[
              isActive(item.to) 
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
              'block px-4 py-3.5 rounded-2xl text-base font-bold transition-all active:scale-[0.98]'
            ]"
          >
            <div class="flex items-center gap-4">
              <div :class="[isActive(item.to) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400']" class="p-2 rounded-xl transition-all">
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
          <div :key="route.path" :class="[isFullPage ? '' : 'py-6 sm:py-8 lg:py-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8']">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
      
      <ChatbotPage />
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
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'
import { useAuth } from '@/modules/auth/composables/useAuth'
import UserMenu from '@/modules/common/components/UserMenu.vue'
import ChatbotPage from '@/modules/common/pages/ChatbotPage.vue'
import useBookingsUser from '@/modules/bookings/composables/useBookingsUser'

const route = useRoute()
const { user } = useAuth()
const { getBookings, hasActiveBooking } = useBookingsUser()
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

const navigation = [
  { name: 'Mapa', to: '/vehicles/map', icon: MapIcon },
  { name: 'Vehículos', to: '/vehicles', icon: TruckIcon },
  { name: 'Reservas', to: '/bookings', icon: CalendarDaysIcon },
]

// Polling global para detectar si el usuario inicia un viaje
let pollInterval: any = null
onMounted(() => {
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