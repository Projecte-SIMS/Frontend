<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Mobile sidebar -->
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute top-0 left-full flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>

              <div class="flex grow flex-col gap-y-3 overflow-y-auto bg-white px-4 pb-3 pt-3 dark:bg-gray-900">
                <div class="flex h-14 shrink-0 items-center gap-3">
                  <div class="h-12 w-12 rounded-xl bg-white p-0.5 ring-1 ring-gray-100 shadow-md">
                    <img src="/logo.png" alt="Fleetly Logo" class="h-full w-full object-contain" />
                  </div>
                  <div class="min-w-0">
                    <span class="text-xl font-bold text-gray-900 dark:text-white block">Fleetly Admin</span>
                    <p class="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-300 truncate">{{ currentTenantLabel }}</p>
                  </div>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-4">
                    <li>
                      <p class="px-1 mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">Navegación</p>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <router-link :to="item.href" :class="[item.current ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/80' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white border-transparent', 'group relative flex items-center gap-x-2.5 rounded-xl p-2.5 text-sm font-semibold transition-all border']">
                            <span :class="[item.current ? 'opacity-100' : 'opacity-0 group-hover:opacity-70', 'absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-indigo-500 transition-opacity']"></span>
                            <span :class="[item.current ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-gray-100 text-gray-400 group-hover:text-indigo-600 dark:bg-gray-800 dark:text-gray-500 dark:group-hover:text-white', 'flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors']">
                              <component :is="item.icon" class="size-[18px]" aria-hidden="true" />
                            </span>
                            {{ item.name }}
                          </router-link>
                        </li>
                      </ul>
                    </li>
                    <li class="mt-auto space-y-2">
                      <router-link to="/" class="group relative flex items-center gap-x-2 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200/70 dark:border-indigo-900/70 bg-indigo-50/70 dark:bg-indigo-900/15 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all">
                        <span class="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-500/80 opacity-70"></span>
                        <span class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                          <HomeIcon class="size-[18px]" />
                        </span>
                        Volver a la App
                      </router-link>
                      <UserMenu :mobile="true" placement="top" />
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div class="admin-sidebar flex grow flex-col gap-y-3 border-r border-gray-200 bg-white px-4 pb-3 pt-3 dark:border-gray-800 dark:bg-gray-900 overflow-visible">
        <div class="flex h-14 shrink-0 items-center gap-3">
          <div class="h-11 w-11 rounded-xl bg-white p-0.5 ring-1 ring-gray-100 shadow-md">
            <img src="/logo.png" alt="Fleetly Logo" class="h-full w-full object-contain" />
          </div>
          <div class="min-w-0">
            <span class="text-xl font-bold text-gray-900 dark:text-white block leading-none">Fleetly Admin</span>
            <p class="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-300 truncate mt-1">{{ currentTenantLabel }}</p>
          </div>
        </div>
        <nav class="flex flex-1 flex-col min-h-0">
          <ul role="list" class="flex flex-1 flex-col gap-y-3">
            <li>
              <p class="px-1 mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">Navegación</p>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <router-link :to="item.href" :class="[item.current ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/80' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white border-transparent', 'nav-link group relative flex items-center gap-x-2.5 rounded-lg px-2.5 py-2.5 text-sm font-semibold transition-all border']">
                    <span :class="[item.current ? 'opacity-100' : 'opacity-0 group-hover:opacity-70', 'absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-indigo-500 transition-opacity']"></span>
                    <span :class="[item.current ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-gray-100 text-gray-400 group-hover:text-indigo-600 dark:bg-gray-800 dark:text-gray-500 dark:group-hover:text-white', 'flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors']">
                      <component :is="item.icon" class="size-[18px]" aria-hidden="true" />
                    </span>
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="mt-auto space-y-3">
              <router-link to="/" class="group relative flex items-center gap-x-2.5 rounded-lg px-2.5 py-2.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200/70 dark:border-indigo-900/70 bg-indigo-50/70 dark:bg-indigo-900/15 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all">
                <span class="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-indigo-500/80 opacity-70"></span>
                <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                  <HomeIcon class="size-[18px]" />
                </span>
                Volver a la App
              </router-link>
              <UserMenu placement="right" />
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Mobile header -->
    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden dark:bg-gray-900 dark:shadow-none dark:border-b dark:border-gray-800">
      <button type="button" class="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden dark:text-gray-400 dark:hover:text-white" @click="sidebarOpen = true">
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="size-6" aria-hidden="true" />
      </button>
      <div class="flex-1 flex items-center gap-2 text-left">
        <div class="h-11 w-11 rounded-lg bg-white p-0.5 ring-1 ring-gray-100 shadow-sm">
          <img src="/logo.png" alt="Fleetly Logo" class="h-full w-full object-contain" />
        </div>
        <div class="min-w-0">
          <span class="text-sm font-semibold text-gray-900 dark:text-white text-left block">Fleetly Admin</span>
          <p class="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-300 truncate">{{ currentTenantLabel }}</p>
        </div>
      </div>
    </div>

    <main class="py-8 lg:pl-72 relative">
      <div :class="[isFullPage ? '' : 'px-4 sm:px-6 lg:px-8']">
        <div v-if="isAdmin || isLoading">
          <router-view v-if="isFullPage" />
          <router-view v-else v-slot="{ Component }">
            <transition name="admin-page" mode="out-in" appear>
              <div :key="route.path" class="fleetly-fade-up">
                <component :is="Component" />
              </div>
            </transition>
          </router-view>
        </div>
        <div v-else class="p-8 text-center text-gray-500">
          <h2 class="text-lg font-semibold mb-2">No autorizado</h2>
          <p>Tu cuenta no tiene permisos para acceder al área de administración.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/modules/auth/composables/useAuth'
import { getCurrentTenant } from '@/services/api'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  Bars3Icon,
  HomeIcon,
  UsersIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  TruckIcon,
  TicketIcon,
  MapIcon,
  XMarkIcon,
  CpuChipIcon,
  HeartIcon,
} from '@heroicons/vue/24/outline'
import UserMenu from '@/modules/common/components/UserMenu.vue'

const route = useRoute()
const { user, isLoading } = useAuth()
const sidebarOpen = ref(false)

const isFullPage = computed(() => ['/admin/map', '/admin/iot-devices'].includes(route.path))

const isAdmin = computed(() => !!(user.value && user.value.roles && user.value.roles.some((r: any) => (r.name || '').toLowerCase() === 'admin')))

const currentTenantLabel = computed(() => {
  route.fullPath
  const tenant = getCurrentTenant()?.trim()
  return tenant || 'sin-tenant'
})

const navigationItems = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Mapa de Flota', href: '/admin/map', icon: MapIcon },
  { name: 'Salud de Flota', href: '/admin/fleet-health', icon: HeartIcon },
  { name: 'Dispositivos IoT', href: '/admin/iot-devices', icon: CpuChipIcon },
  { name: 'Usuarios', href: '/admin/users', icon: UsersIcon },
  { name: 'Roles', href: '/admin/roles', icon: ShieldCheckIcon },
  { name: 'Reservas', href: '/admin/bookings', icon: CalendarDaysIcon },
  { name: 'Vehículos', href: '/admin/vehicles', icon: TruckIcon },
  { name: 'Tickets', href: '/admin/tickets', icon: TicketIcon },
]

const navigation = computed(() => 
  navigationItems.map(item => ({
    ...item,
    current: route.path === item.href || (item.href !== '/admin' && route.path.startsWith(item.href))
  }))
)
</script>

<style scoped>
.admin-page-enter-active,
.admin-page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.admin-page-enter-from,
.admin-page-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-height: 860px) {
  .admin-sidebar {
    gap: 0.25rem;
    padding-bottom: 0.4rem;
  }

  .admin-sidebar .nav-link {
    padding-top: 0.38rem;
    padding-bottom: 0.38rem;
    font-size: 12px;
  }
}
</style>
