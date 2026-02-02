<template>
  <div class="p-6 max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Crear primer mensaje de ticket</h1>
      <router-link to="/dashboard" class="text-sm font-medium text-indigo-400 hover:text-indigo-200">Volver al dashboard</router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium">Asunto</label>
        <input v-model="title" required class="w-full rounded p-2 bg-white/5" />
      </div>

      <div>
        <label class="block text-sm font-medium">Mensaje</label>
        <textarea v-model="message" rows="6" required class="w-full rounded p-2 bg-white/5"></textarea>
      </div>

      <div>
        <button :disabled="loading" class="px-4 py-2 bg-indigo-500 text-white rounded">
          {{ loading ? 'Enviando...' : 'Crear ticket' }}
        </button>
      </div>

      <div v-if="error" class="text-red-400">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/modules/auth/composables/useAuth'
import apiClient from '@/services/api'

const router = useRouter()
const { user } = useAuth()
const title = ref('')
const message = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    // Create ticket
    if (!user?.value?.id) throw new Error('User not authenticated')
    const ticketResp = await apiClient.post('/tickets', { title: title.value, user_id: user.value.id })
    // support different response shapes
    const ticketId = ticketResp.data.id || ticketResp.data.ticket?.id || ticketResp.data.data?.id

    if (!ticketId) throw new Error('Ticket id not returned by API')

    // Create first message (include ticket_id if backend expects it)
    const msgResp = await apiClient.post(`/tickets/${ticketId}/messages`, { message: message.value, user_id: user.value.id, ticket_id: ticketId })
    // notify ticket list about new message
    window.dispatchEvent(new CustomEvent('ticket-updated', { detail: { ticketId, count: 1 } }))

    router.push(`/tickets/${ticketId}`)
  } catch (err: any) {
    console.error('create ticket error:', err)
    const apiData = err.response?.data
    error.value = apiData?.message || JSON.stringify(apiData) || err.message || 'Error creando ticket'
  } finally {
    loading.value = false
  }
}
</script>
