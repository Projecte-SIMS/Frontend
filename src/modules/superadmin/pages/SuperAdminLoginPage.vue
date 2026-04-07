<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white">🏢 Super Admin</h1>
        <p class="text-gray-400 mt-2">Panel de gestión de empresas</p>
      </div>

      <form @submit.prevent="handleLogin" class="bg-gray-800 rounded-xl p-8 shadow-xl">
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
          class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCentralAuth } from '../composables/useCentralAuth'

const router = useRouter()
const { login, loading, error } = useCentralAuth()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await login(email.value, password.value)
    router.push('/superadmin/dashboard')
  } catch (e) {
    // Error handled in composable
  }
}
</script>
