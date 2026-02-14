<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Tickets</h1>
      <button @click="showForm = !showForm" class="px-3 py-1 rounded bg-indigo-600 text-white">New Ticket</button>
    </div>

    <div v-if="showForm" class="mb-4 bg-gray-800 p-4 rounded">
      <input v-model="form.title" placeholder="Asunto" class="w-full mb-2 p-2 rounded bg-gray-900 border border-white/10" />
      <textarea v-model="form.message" placeholder="Descripción" class="w-full mb-2 p-2 rounded bg-gray-900 border border-white/10" rows="4"></textarea>
      <div class="text-right">
        <button @click="createTicket" :disabled="creating" class="px-3 py-1 rounded bg-green-600 text-white">{{ creating ? 'Creando...' : 'Crear ticket' }}</button>
      </div>
    </div>

    <div>
      <div v-if="loading">Loading tickets...</div>
      <ul v-else class="space-y-2">
        <li v-for="t in tickets" :key="t.id" class="p-3 bg-gray-800 rounded">
          <RouterLink :to="`/tickets/${t.id}`" class="block">
            <div class="flex justify-between">
              <div>
                <div class="font-semibold">{{ t.subject || t.title || `Ticket #${t.id}` }}</div>
                <div class="text-sm text-gray-400">{{ t.created_at ? new Date(t.created_at).toLocaleString() : '' }}</div>
              </div>
              <div class="text-sm text-gray-300">{{ t.status || '-' }}</div>
            </div>
            <div class="mt-2 text-gray-300">{{ t.description || t.last_message?.content || t.message || '' }}</div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/services/api'
import showToast from '@/modules/common/composables/useToast'

const tickets = ref<any[]>([])
const loading = ref(false)
const creating = ref(false)
const showForm = ref(false)
const form = ref({ title: '', message: '' })

const load = async () => {
  loading.value = true
  try {
    const res = await apiClient.get('/tickets')
    // Support paginated or plain array responses
    tickets.value = res.data.data ?? res.data ?? []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const createTicket = async () => {
  if (!form.value.title || !form.value.message) return
  creating.value = true
  try {
    // send multiple possible field names to satisfy different backend expectations
    const payload = {
      subject: form.value.title,
      title: form.value.title,
      description: form.value.message,
      message: form.value.message,
    }
    const res = await apiClient.post('/tickets', payload)
    const newTicket = res.data.data ?? res.data
    if (newTicket) tickets.value.unshift(newTicket)
    form.value.title = ''
    form.value.message = ''
    showForm.value = false
  } catch (e) {
    console.error(e)
  } finally {
    creating.value = false
  }
}

onMounted(load)
</script>
