<template>
  <div class="h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans overflow-hidden">
    <div class="sm:mx-auto sm:w-full sm:max-w-md shrink-0">
      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <div class="h-12 w-12 rounded-2xl bg-white p-1.5 shadow-xl shadow-indigo-500/30">
          <img src="/logo.png" alt="SIMS Logo" class="h-full w-full object-contain" />
        </div>
      </div>
      <h2 class="text-center text-3xl font-black tracking-tight text-gray-900 dark:text-white">Bienvenido</h2>
      <p class="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
        Accede a tu cuenta de SIMS.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
      <div class="bg-white dark:bg-gray-900 py-10 px-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-[2.5rem]">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Email -->
          <div>
            <label for="email" class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Correo Electrónico</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <EnvelopeIcon class="size-5" />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                :disabled="isLoading"
                class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Contraseña</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <LockClosedIcon class="size-5" />
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                required
                :disabled="isLoading"
                class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div v-if="error" class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
            <ExclamationCircleIcon class="size-4" />
            {{ error }}
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full justify-center items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
            >
              <ArrowPathIcon v-if="isLoading" class="size-5 animate-spin" />
              {{ isLoading ? 'Entrando...' : 'Entrar' }}
            </button>
          </div>
        </form>

        <div class="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
          <p class="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            ¿No tienes una cuenta?
            <RouterLink to="/register" class="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Regístrate gratis</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowPathIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const { login, isLoading, error, user } = useAuth()

const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  const success = await login(email.value, password.value)
  if (success) {
    const isAdmin = user.value?.roles?.some((r: any) => (r.name || '').toLowerCase() === 'admin')
    if (isAdmin) router.push('/admin')
    else router.push('/')
  }
}
</script>
