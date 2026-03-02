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

              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 dark:bg-gray-900">
                <div class="flex h-16 shrink-0 items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                    <span class="text-xl font-bold text-white">S</span>
                  </div>
                  <span class="text-xl font-bold text-gray-900 dark:text-white">SIMS Admin</span>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <router-link :to="item.href" :class="[item.current ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white', 'group flex gap-x-3 rounded-xl p-3 text-sm font-semibold transition-colors']">
                            <component :is="item.icon" :class="[item.current ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white', 'size-5 shrink-0']" aria-hidden="true" />
                            {{ item.name }}
                          </router-link>
                        </li>
                      </ul>
                    </li>
                    <li class="mt-auto">
                      <UserMenu :mobile="true" placement="bottom" />
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
      <div class="flex grow flex-col gap-y-5 border-r border-gray-200 bg-white px-6 pb-4 dark:border-gray-800 dark:bg-gray-900 overflow-visible">
        <div class="flex h-16 shrink-0 items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
            <span class="text-xl font-bold text-white">S</span>
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">SIMS Admin</span>
        </div>
        <nav class="flex flex-1 flex-col overflow-visible">
          <ul role="list" class="flex flex-1 flex-col gap-y-7 overflow-visible">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <router-link :to="item.href" :class="[item.current ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white', 'group flex gap-x-3 rounded-xl p-3 text-sm font-semibold transition-colors']">
                    <component :is="item.icon" :class="[item.current ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white', 'size-5 shrink-0']" aria-hidden="true" />
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="mt-4">
              <router-link to="/" class="flex items-center gap-x-3 rounded-xl p-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 transition-colors">
                <HomeIcon class="size-5" />
                Volver a la App
              </router-link>
            </li>

            <li class="mt-auto">
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
      <div class="flex-1 flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
          <span class="text-sm font-bold text-white">S</span>
        </div>
        <span class="text-sm font-semibold text-gray-900 dark:text-white">SIMS Admin</span>
      </div>
    </div>

    <main class="py-8 lg:pl-72 relative">
      <div class="px-4 sm:px-6 lg:px-8">
        <div v-if="isAdmin || isLoading">
          <router-view />
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
} from '@heroicons/vue/24/outline'
import UserMenu from '@/modules/common/components/UserMenu.vue'

const route = useRoute()
const { user, isLoading } = useAuth()
const sidebarOpen = ref(false)

const isAdmin = computed(() => !!(user.value && user.value.roles && user.value.roles.some((r: any) => (r.name || '').toLowerCase() === 'admin')))

const navigationItems = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Mapa', href: '/admin/map', icon: MapIcon },
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