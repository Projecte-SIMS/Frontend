<template>
  <div class="relative user-menu-container">
    <button 
      @click.stop="showMenu = !showMenu"
      class="flex items-center gap-x-2.5 rounded-xl bg-gray-50/50 dark:bg-gray-800/40 px-3 py-1.5 border border-gray-100 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-all cursor-pointer group w-full"
    >
      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-sm">
        {{ userInitials }}
      </div>
      <div class="flex-1 text-left overflow-hidden">
        <p class="text-xs font-bold text-gray-900 dark:text-white truncate leading-tight">{{ user?.name || 'Usuario' }}</p>
        <p class="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate leading-tight">{{ user?.email || '' }}</p>
      </div>
      <component 
        :is="placement === 'right' ? ChevronRightIcon : ChevronDownIcon" 
        :class="['size-3.5 text-gray-400 transition-transform duration-200 group-hover:text-gray-600 dark:group-hover:text-gray-300', showMenu ? (placement === 'right' ? 'rotate-180' : 'rotate-180') : '']" 
      />
    </button>
    
    <!-- Dropdown Dinámico -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      :enter-from-class="getTransitionFrom"
      enter-to-class="transform opacity-100 scale-100 translate-x-0 translate-y-0"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100 translate-x-0 translate-y-0"
      :leave-to-class="getTransitionFrom"
    >
      <div 
        v-if="showMenu" 
        :class="[
          getPositionClasses,
          'absolute z-[60] w-72 rounded-2xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10 overflow-hidden border border-gray-100 dark:border-gray-700'
        ]"
      >
        <!-- Accounts Section -->
        <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Cuentas guardadas</p>
        </div>
        
        <div class="max-h-60 overflow-y-auto custom-scrollbar">
          <div 
            v-for="account in savedAccounts" 
            :key="account.id"
            class="group flex items-center gap-3 px-4 py-3 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors cursor-pointer"
            @click="handleSwitch(account.id)"
          >
            <div :class="[user?.id === account.id ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800' : '']" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold">
              {{ getInitials(account.name) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ account.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ account.email }}</p>
            </div>
            <div v-if="user?.id === account.id" class="size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <button 
              v-else
              @click.stop="removeAccount(account.id)"
              class="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
              title="Eliminar cuenta"
            >
              <XMarkIcon class="size-4" />
            </button>
          </div>
        </div>

        <div class="p-2 border-t border-gray-100 dark:border-gray-700">
          <button
            @click="handleAddAccount"
            class="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors"
          >
            <PlusIcon class="size-5" />
            Añadir otra cuenta
          </button>
        </div>

        <div class="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30">
          <button
            @click="openProfile"
            class="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <UserCircleIcon class="size-5 text-gray-400" />
            Mi perfil
          </button>
          <button
            @click="handleLogout"
            class="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <ArrowRightOnRectangleIcon class="size-5" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/modules/auth/composables/useAuth'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const props = withDefaults(defineProps<{
  placement?: 'top' | 'bottom' | 'right'
}>(), {
  placement: 'bottom'
})

const router = useRouter()
const { user, logout, savedAccounts, switchAccount, removeAccount } = useAuth()
const showMenu = ref(false)

const userInitials = computed(() => getInitials(user.value?.name || 'Usuario'))

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const getPositionClasses = computed(() => {
  switch (props.placement) {
    case 'top': return 'bottom-full right-0 mb-2'
    case 'right': return 'left-full bottom-0 ml-4'
    case 'bottom':
    default: return 'top-full right-0 mt-2'
  }
})

const getTransitionFrom = computed(() => {
  switch (props.placement) {
    case 'top': return 'transform opacity-0 scale-95 translate-y-2'
    case 'right': return 'transform opacity-0 scale-95 -translate-x-2'
    case 'bottom':
    default: return 'transform opacity-0 scale-95 -translate-y-2'
  }
})

const handleSwitch = async (accountId: number) => {
  if (user.value?.id === accountId) return
  await switchAccount(accountId)
}

const handleAddAccount = () => {
  showMenu.value = false
  document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
  window.location.href = '/login'
}

const openProfile = () => {
  showMenu.value = false
  router.push('/perfil')
}

const handleLogout = async () => {
  showMenu.value = false
  await logout()
  router.push('/login')
}

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.user-menu-container')) {
    showMenu.value = false
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
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>