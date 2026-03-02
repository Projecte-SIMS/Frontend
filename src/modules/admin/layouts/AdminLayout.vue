<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="" leave="transition-opacity ease-linear duration-300" leave-from="" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80"></div>
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="" leave="ease-in-out duration-300" leave-from="" leave-to="opacity-0">
                <div class="absolute top-0 left-full flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>

              <!-- Mobile Sidebar -->
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
                      <!-- Mobile User Menu -->
                      <div class="relative user-menu-container">
                        <button 
                          @click.stop="showUserMenuMobile = !showUserMenuMobile"
                          class="w-full flex items-center gap-x-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold dark:bg-indigo-900/30 dark:text-indigo-400">
                            {{ userInitials }}
                          </div>
                          <div class="flex-1 min-w-0 text-left">
                            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ user?.name || 'Admin' }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ user?.email || '' }}</p>
                          </div>
                          <ChevronUpIcon :class="['size-5 text-gray-400 transition-transform', showUserMenuMobile ? 'rotate-180' : '']" />
                        </button>
                        
                        <!-- Mobile Dropdown -->
                        <Transition
                          enter-active-class="transition ease-out duration-100"
                          enter-from-class="transform opacity-0 scale-95"
                          enter-to-class="transform opacity-100 scale-100"
                          leave-active-class="transition ease-in duration-75"
                          leave-from-class="transform opacity-100 scale-100"
                          leave-to-class="transform opacity-0 scale-95"
                        >
                          <div v-if="showUserMenuMobile" class="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10 overflow-hidden">
                            <button
                              @click="openProfileModal(); showUserMenuMobile = false"
                              class="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <UserCircleIcon class="size-5 text-gray-400" />
                              Mi perfil
                            </button>
                            <button
                              @click="handleLogout"
                              class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <ArrowRightOnRectangleIcon class="size-5" />
                              Cerrar sesión
                            </button>
                          </div>
                        </Transition>
                      </div>
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
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4 dark:border-gray-800 dark:bg-gray-900">
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
              <!-- Desktop User Menu -->
              <div class="relative user-menu-container">
                <button 
                  @click.stop="showUserMenu = !showUserMenu"
                  class="w-full flex items-center gap-x-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold dark:bg-indigo-900/30 dark:text-indigo-400">
                    {{ userInitials }}
                  </div>
                  <div class="flex-1 min-w-0 text-left">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ user?.name || 'Admin' }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ user?.email || '' }}</p>
                  </div>
                  <ChevronUpIcon :class="['size-5 text-gray-400 transition-transform', showUserMenu ? 'rotate-180' : '']" />
                </button>
                
                <!-- Desktop Dropdown -->
                <Transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <div v-if="showUserMenu" class="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10 overflow-hidden">
                    <button
                      @click="openProfileModal(); showUserMenu = false"
                      class="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <UserCircleIcon class="size-5 text-gray-400" />
                      Mi perfil
                    </button>
                    <button
                      @click="handleLogout"
                      class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <ArrowRightOnRectangleIcon class="size-5" />
                      Cerrar sesión
                    </button>
                  </div>
                </Transition>
              </div>
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
      <button 
        @click="openProfileModal"
        class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold dark:bg-indigo-900/30 dark:text-indigo-400"
      >
        {{ userInitials }}
      </button>
    </div>

    <main class="py-8 lg:pl-72">
      <div class="px-4 sm:px-6 lg:px-8">
        <div v-if="isAdmin || isLoading">
          <router-view />
        </div>
        <div v-else class="p-8 text-center text-gray-500">
          <h2 class="text-lg font-semibold mb-2">Not authorized</h2>
          <p>Your account does not have permission to access the admin area.</p>
        </div>
      </div>
    </main>

    <!-- Profile Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showProfileModal"
          class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="showProfileModal = false"
        >
          <div class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
            <!-- Header -->
            <div class="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
              <button
                @click="showProfileModal = false"
                class="absolute top-4 right-4 rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                <XMarkIcon class="size-5" />
              </button>
              <div class="flex items-center gap-4">
                <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white">
                  {{ userInitials }}
                </div>
                <div>
                  <h2 class="text-xl font-bold text-white">{{ user?.name || 'Usuario' }}</h2>
                  <p class="text-indigo-100">{{ user?.email || '' }}</p>
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="px-6 py-6 space-y-6">
              <!-- Info básica -->
              <div>
                <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Información de la cuenta</h3>
                <dl class="space-y-3">
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">ID de usuario</dt>
                    <dd class="text-sm font-medium text-gray-900 dark:text-white">#{{ user?.id }}</dd>
                  </div>
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Nombre de usuario</dt>
                    <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ user?.username || '-' }}</dd>
                  </div>
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Email</dt>
                    <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ user?.email }}</dd>
                  </div>
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Estado</dt>
                    <dd>
                      <span :class="[
                        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                        user?.active 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      ]">
                        {{ user?.active ? 'Activo' : 'Inactivo' }}
                      </span>
                    </dd>
                  </div>
                  <div class="flex justify-between py-2">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Miembro desde</dt>
                    <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(user?.created_at) }}</dd>
                  </div>
                </dl>
              </div>

              <!-- Roles -->
              <div>
                <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Roles</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="role in user?.roles || []"
                    :key="role.id"
                    class="inline-flex items-center rounded-lg bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                  >
                    <ShieldCheckIcon class="size-4 mr-1.5" />
                    {{ role.name }}
                  </span>
                  <span v-if="!user?.roles?.length" class="text-sm text-gray-500">Sin roles asignados</span>
                </div>
              </div>

              <!-- Permisos -->
              <div v-if="userPermissions.length > 0">
                <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Permisos</h3>
                <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  <span
                    v-for="permission in userPermissions"
                    :key="permission"
                    class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  >
                    {{ permission }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
              <button
                @click="handleLogout"
                class="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <ArrowRightOnRectangleIcon class="size-4" />
                Cerrar sesión
              </button>
              <button
                @click="showProfileModal = false"
                class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
  ChevronUpIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const { user, isLoading, logout } = useAuth()

// User menu state
const showUserMenu = ref(false)
const showUserMenuMobile = ref(false)
const showProfileModal = ref(false)

const userInitials = computed(() => {
  const name = user.value?.name || 'Admin'
  return name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
})

const userPermissions = computed(() => {
  const permissions: string[] = []
  if (user.value?.roles) {
    user.value.roles.forEach((role: any) => {
      if (role.permissions) {
        role.permissions.forEach((p: any) => {
          if (!permissions.includes(p.name)) {
            permissions.push(p.name)
          }
        })
      }
    })
  }
  return permissions.sort()
})

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

const sidebarOpen = ref(false)
const isAdmin = computed(() => !!(user.value && user.value.roles && user.value.roles.some((r: any) => (r.name || '').toLowerCase() === 'admin')))

const openProfileModal = () => {
  showProfileModal.value = true
  showUserMenu.value = false
  showUserMenuMobile.value = false
}

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (e) {
    console.error('Error logging out', e)
  }
}

const formatDate = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.user-menu-container')) {
    showUserMenu.value = false
    showUserMenuMobile.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>