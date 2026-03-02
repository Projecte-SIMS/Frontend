<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
    <!-- Topbar principal -->
    <header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between gap-4">
          
          <!-- Logo y Navegación Desktop -->
          <div class="flex items-center gap-8">
            <router-link to="/" class="flex items-center gap-2.5 group">
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <span class="text-lg font-bold text-white">S</span>
              </div>
              <span class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">SIMS</span>
            </router-link>

            <!-- Nav Links Desktop -->
            <nav class="hidden md:flex items-center gap-1">
              <router-link 
                v-for="item in navigation" 
                :key="item.name" 
                :to="item.to"
                :class="[
                  isActive(item.to) 
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
                  'px-3 py-2 rounded-lg text-sm font-semibold transition-all'
                ]"
              >
                {{ item.name }}
              </router-link>
            </nav>
          </div>

          <!-- Acciones Derecha (User Menu) -->
          <div class="flex items-center gap-3">
            <!-- Botón Admin (si aplica) -->
            <router-link 
              v-if="isAdmin" 
              to="/admin" 
              class="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 hover:bg-amber-100 dark:text-amber-400 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
            >
              <ShieldCheckIcon class="size-4" />
              Admin
            </router-link>

            <!-- Menú de Usuario -->
            <UserMenu />

            <!-- Menú Móvil (Hamburguesa) -->
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="p-2 rounded-lg text-gray-500 md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bars3Icon v-if="!mobileMenuOpen" class="size-6" />
              <XMarkIcon v-else class="size-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Navegación Móvil (Desplegable) -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileMenuOpen" class="md:hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 space-y-1 shadow-xl">
          <router-link 
            v-for="item in navigation" 
            :key="item.name" 
            :to="item.to"
            @click="mobileMenuOpen = false"
            :class="[
              isActive(item.to) 
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' 
                : 'text-gray-600 dark:text-gray-400',
              'block px-4 py-3 rounded-xl text-base font-semibold'
            ]"
          >
            <div class="flex items-center gap-3">
              <component :is="item.icon" class="size-5" />
              {{ item.name }}
            </div>
          </router-link>
          
          <router-link 
            v-if="isAdmin" 
            to="/admin" 
            @click="mobileMenuOpen = false"
            class="block px-4 py-3 rounded-xl text-base font-semibold text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20"
          >
            <div class="flex items-center gap-3">
              <ShieldCheckIcon class="size-5" />
              Panel de Administración
            </div>
          </router-link>
        </div>
      </Transition>
    </header>

    <!-- Contenido principal -->
    <main class="relative py-6 sm:py-8 lg:py-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <router-view />
      </div>
      <ChatbotPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

const route = useRoute()
const { user } = useAuth()
const mobileMenuOpen = ref(false)

const isActive = (path: string) => {
  if (path === '/' && route.path === '/') return true
  if (path !== '/' && route.path.startsWith(path)) return true
  return false
}

const isAdmin = computed(() => 
  user.value?.roles?.some((r: any) => (r.name || '').toLowerCase() === 'admin')
)

const navigation = [
  { name: 'Mapa', to: '/vehicles/map', icon: MapIcon },
  { name: 'Vehículos', to: '/vehicles', icon: TruckIcon },
  { name: 'Reservas', to: '/bookings', icon: CalendarDaysIcon },
  { name: 'Tickets', to: '/tickets', icon: TicketIcon },
  { name: 'Perfil', to: '/perfil', icon: UserIcon },
]
</script>