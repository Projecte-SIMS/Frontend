<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4 fleetly-fade-up">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <div class="mx-auto mb-4 h-16 w-16 rounded-2xl bg-white p-0.5 ring-1 ring-gray-100 shadow-xl shadow-indigo-500/30">
          <img src="/logo.png" alt="Fleetly Logo" class="h-full w-full object-contain" />
        </div>
        <h1 class="text-3xl font-bold text-white">Fleetly Super Admin</h1>
        <p class="text-gray-400 mt-2">Panel de gestión de empresas</p>
      </div>

      <form @submit.prevent="handleLogin" class="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700/70 fleetly-card-hover">
        <div class="mb-6">
          <label class="block text-gray-300 text-sm font-medium mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="superadmin@sims.com"
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-300 text-sm font-medium mb-2">Contraseña</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span v-if="loading">Iniciando sesión...</span>
          <span v-else>Iniciar Sesión</span>
        </button>
      </form>

      <p class="text-center mt-6 text-gray-500 text-sm">
        <router-link to="/login" class="text-blue-400 hover:underline">
          ← Volver al login de tenant
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCentralAuth } from '../composables/useCentralAuth'

const route = useRoute()
const router = useRouter()
const { login, loading, error } = useCentralAuth()

const email = ref('')
const password = ref('')

onMounted(() => {
  if (route.query.expired === '1') {
    error.value = 'Tu sesión expiró. Inicia sesión de nuevo.'
  }
})

const handleLogin = async () => {
  try {
    await login(email.value, password.value)
    router.push('/superadmin/dashboard')
  } catch (e) {
    // Error handled in composable
  }
}
</script>
