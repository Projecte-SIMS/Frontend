<template>
  <div class="h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-6 sm:px-6 lg:px-8 font-sans overflow-hidden">
    <div class="sm:mx-auto sm:w-full sm:max-w-md shrink-0">
      <!-- Logo -->
      <div class="flex justify-center mb-4">
        <div class="h-10 w-10 rounded-2xl bg-white p-1 shadow-xl shadow-indigo-500/30">
          <img src="/logo.png" alt="SIMS Logo" class="h-full w-full object-contain" />
        </div>
      </div>
      <h2 class="text-center text-2xl font-black tracking-tight text-gray-900 dark:text-white leading-none">Crear cuenta</h2>
      <p class="mt-2 text-center text-xs text-gray-500 dark:text-gray-400 font-medium">
        Únete a SIMS y empieza a moverte.
      </p>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 overflow-y-auto custom-scrollbar pb-6">
      <div class="bg-white dark:bg-gray-900 py-8 px-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-[2.5rem]">
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <!-- Nombre Completo -->
          <div>
            <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nombre Completo</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <UserIcon class="size-4" />
              </div>
              <input
                id="name"
                v-model="name"
                type="text"
                required
                :disabled="isLoading"
                class="block w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="Juan Pérez"
              />
            </div>
          </div>

          <!-- Usuario -->
          <div>
            <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nombre de Usuario</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <AtSymbolIcon class="size-4" />
              </div>
              <input
                id="username"
                v-model="username"
                type="text"
                required
                :disabled="isLoading"
                class="block w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="juanperez"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <EnvelopeIcon class="size-4" />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                :disabled="isLoading"
                class="block w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="juan@ejemplo.com"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Contraseña</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <LockClosedIcon class="size-4" />
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                :disabled="isLoading"
                class="block w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div v-if="error" class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <ExclamationCircleIcon class="size-4 shrink-0" />
            {{ error }}
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full justify-center items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3.5 text-[11px] font-black uppercase tracking-widest text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
            >
              <ArrowPathIcon v-if="isLoading" class="size-4 animate-spin" />
              {{ isLoading ? 'Procesando...' : 'Registrarme' }}
            </button>
          </div>
        </form>

        <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
            ¿Ya tienes cuenta?
            <RouterLink to="/login" class="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Inicia sesión</RouterLink>
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
  UserIcon,
  AtSymbolIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ArrowPathIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const { register, isLoading, error } = useAuth()

const name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  await register(
    name.value,
    username.value,
    email.value,
    password.value,
  )
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
</style>