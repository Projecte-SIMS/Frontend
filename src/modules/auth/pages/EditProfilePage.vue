<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <router-link
        to="/perfil"
        class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors mb-4"
      >
        <ArrowLeftIcon class="size-4" />
        Volver al perfil
      </router-link>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Editar Perfil</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">Actualiza tu información personal y configuración de cuenta.</p>
    </div>

    <!-- Form Card -->
    <div class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <form @submit.prevent="submit" class="p-8 space-y-6">
        <div class="grid grid-cols-1 gap-6">
          <!-- Nombre -->
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Nombre Completo</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <UserIcon class="size-5" />
              </div>
              <input
                v-model="form.name"
                type="text"
                required
                class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                placeholder="Tu nombre"
              />
            </div>
          </div>

          <!-- Usuario -->
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Nombre de Usuario</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <AtSymbolIcon class="size-5" />
              </div>
              <input
                v-model="form.username"
                type="text"
                required
                class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                placeholder="username"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <EnvelopeIcon class="size-5" />
              </div>
              <input
                v-model="form.email"
                type="email"
                required
                class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <!-- Contraseña -->
          <div class="pt-4 border-t border-gray-100 dark:border-gray-800">
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Nueva Contraseña</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <LockClosedIcon class="size-5" />
              </div>
              <input
                v-model="form.password"
                type="password"
                class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                placeholder="Dejar en blanco para no cambiar"
              />
            </div>
            <p class="mt-2 text-[10px] text-gray-400 ml-1 italic">
              La contraseña debe tener al menos 8 caracteres si decides cambiarla.
            </p>
          </div>
        </div>

        <!-- Feedback Messages -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="error" class="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-3">
            <ExclamationCircleIcon class="size-5 shrink-0" />
            {{ error }}
          </div>
          <div v-else-if="success" class="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-3">
            <CheckCircleIcon class="size-5 shrink-0" />
            Perfil actualizado correctamente.
          </div>
        </Transition>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            :disabled="isLoading"
            class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon v-if="isLoading" class="size-5 animate-spin" />
            <CloudArrowUpIcon v-else class="size-5" />
            {{ isLoading ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
          <button
            type="button"
            @click="cancel"
            class="px-6 py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-all active:scale-95"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import apiClient from '@/services/api'
import {
  ArrowLeftIcon,
  UserIcon,
  AtSymbolIcon,
  EnvelopeIcon,
  LockClosedIcon,
  CloudArrowUpIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const { user, fetchUser } = useAuth()

const form = ref({
  name: user.value?.name || '',
  username: user.value?.username || '',
  email: user.value?.email || '',
  password: ''
})

const isLoading = ref(false)
const error = ref('')
const success = ref(false)

const submit = async () => {
  isLoading.value = true
  error.value = ''
  success.value = false
  try {
    const payload: any = {
      name: form.value.name,
      username: form.value.username,
      email: form.value.email
    }
    if (form.value.password) payload.password = form.value.password
    await apiClient.put('/users/me', payload)
    await fetchUser()
    success.value = true
    form.value.password = ''
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Error al actualizar el perfil'
  } finally {
    isLoading.value = false
  }
}

const cancel = () => {
  router.push('/perfil')
}
</script>
