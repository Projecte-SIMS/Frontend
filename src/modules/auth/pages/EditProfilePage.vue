<template>
  <div class="min-h-screen bg-gray-900 p-8 flex flex-col items-center">
    <div class="w-full max-w-lg bg-gray-800/50 rounded-lg p-8">
      <h2 class="mb-6 text-2xl font-bold text-white">Editar Perfil</h2>
      <form @submit.prevent="submit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-200">Nombre</label>
          <input v-model="form.name" type="text" class="mt-1 block w-full rounded-md bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-200">Usuario</label>
          <input v-model="form.username" type="text" class="mt-1 block w-full rounded-md bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-200">Email</label>
          <input v-model="form.email" type="email" class="mt-1 block w-full rounded-md bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-200">Nueva contraseña</label>
          <input v-model="form.password" type="password" class="mt-1 block w-full rounded-md bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div class="flex gap-4 mt-6">
          <button type="submit" :disabled="isLoading" class="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:opacity-50">Guardar</button>
          <button type="button" @click="cancel" class="px-4 py-2 rounded bg-gray-700 text-gray-200 font-semibold hover:bg-gray-600">Cancelar</button>
        </div>
        <div v-if="error" class="text-red-400 mt-2">{{ error }}</div>
        <div v-if="success" class="text-green-400 mt-2">Perfil actualizado correctamente.</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import apiClient from '@/services/api'

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
