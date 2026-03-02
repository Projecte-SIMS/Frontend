<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <!-- Header Section -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 px-8 py-6 text-white shadow-xl shadow-indigo-500/10">
      <div class="relative z-10 flex flex-col md:flex-row items-center gap-5">
        <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold backdrop-blur-md">
          {{ userInitials }}
        </div>
        <div class="text-center md:text-left">
          <h1 class="text-2xl font-bold">{{ user?.name }}</h1>
          <p class="text-indigo-100 text-sm flex items-center justify-center md:justify-start gap-1.5 opacity-90">
            <UserIcon class="size-3.5" />
            @{{ user?.username }}
          </p>
          <div class="mt-2.5 flex flex-wrap justify-center md:justify-start gap-2">
            <span v-for="role in user?.roles" :key="role.id" class="px-2.5 py-0.5 rounded-lg bg-white/15 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
              {{ role.name }}
            </span>
          </div>
        </div>
        <div class="md:ml-auto">
          <button
            @click="router.push('/perfil/editar')"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-all shadow-md active:scale-95"
          >
            <PencilSquareIcon class="size-4" />
            Editar Perfil
          </button>
        </div>
      </div>
      
      <!-- Abstract Background Shapes -->
      <div class="absolute -right-10 -top-10 size-48 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -left-10 -bottom-10 size-48 rounded-full bg-purple-500/20 blur-3xl"></div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Info Col -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Account Details -->
        <section class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <IdentificationIcon class="size-6 text-indigo-500" />
            Detalles de la cuenta
          </h2>
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <div class="space-y-1 border-b border-gray-50 dark:border-gray-800 pb-4">
              <dt class="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre Completo</dt>
              <dd class="text-gray-900 dark:text-white font-medium">{{ user?.name }}</dd>
            </div>
            <div class="space-y-1 border-b border-gray-50 dark:border-gray-800 pb-4">
              <dt class="text-xs font-bold text-gray-400 uppercase tracking-widest">Correo Electrónico</dt>
              <dd class="text-gray-900 dark:text-white font-medium">{{ user?.email }}</dd>
            </div>
            <div class="space-y-1 border-b border-gray-50 dark:border-gray-800 pb-4">
              <dt class="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre de Usuario</dt>
              <dd class="text-gray-900 dark:text-white font-medium">@{{ user?.username }}</dd>
            </div>
            <div class="space-y-1 border-b border-gray-50 dark:border-gray-800 pb-4">
              <dt class="text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</dt>
              <dd class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
                <span class="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Activo
              </dd>
            </div>
          </dl>
        </section>

        <!-- Permissions Section -->
        <section class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <KeyIcon class="size-6 text-indigo-500" />
            Permisos Activos
          </h2>
          <div v-if="userPermissions.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="permission in userPermissions"
              :key="permission"
              class="inline-flex items-center rounded-xl bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50"
            >
              {{ permission }}
            </span>
          </div>
          <div v-else class="text-center py-6 text-gray-500 italic">
            No tienes permisos específicos asignados.
          </div>
        </section>
      </div>

      <!-- Sidebar Col -->
      <div class="space-y-8">
        <!-- Stats/Actions -->
        <section class="bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl p-8 border border-indigo-100 dark:border-indigo-900/30">
          <h3 class="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-4">Seguridad</h3>
          <p class="text-sm text-indigo-700/70 dark:text-indigo-400/70 mb-6">
            Mantén tu cuenta protegida cambiando tu contraseña regularmente.
          </p>
          <button
            @click="router.push('/perfil/editar')"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <ShieldCheckIcon class="size-5" />
            Seguridad de la cuenta
          </button>
          
          <div class="mt-8 pt-8 border-t border-indigo-200 dark:border-indigo-900/50">
            <button
              @click="handleLogout"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-all active:scale-95 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <ArrowRightOnRectangleIcon class="size-5" />
              Cerrar Sesión
            </button>
          </div>
        </section>

        <!-- Quick Info -->
        <section class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Token de Acceso</h3>
          <div class="bg-gray-50 dark:bg-gray-950 rounded-xl p-4 font-mono text-[10px] break-all text-gray-500 dark:text-gray-400 max-h-32 overflow-y-auto border border-gray-100 dark:border-gray-800 custom-scrollbar">
            {{ token }}
          </div>
          <p class="mt-3 text-[10px] text-gray-400 text-center">
            Este token es sensible. No lo compartas con nadie.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import {
  UserIcon,
  PencilSquareIcon,
  IdentificationIcon,
  KeyIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const { user, isLoading, logout, getToken } = useAuth()
const token = getToken()

const userInitials = computed(() => {
  const name = user.value?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
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

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
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
