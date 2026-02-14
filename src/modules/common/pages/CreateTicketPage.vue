<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">Crear nuevo ticket</h1>
    <div class="bg-gray-800 p-4 rounded">
      <label class="text-sm text-gray-400">Título</label>
      <input v-model="form.title" class="w-full p-2 mt-1 mb-2 rounded bg-gray-900 border border-white/10" placeholder="Título (requerido)" />
      <label class="text-sm text-gray-400">Descripción</label>
      <textarea v-model="form.description" rows="6" class="w-full p-2 mt-1 mb-2 rounded bg-gray-900 border border-white/10" placeholder="Describe tu incidencia..."></textarea>
      <div class="text-right">
        <button @click="createTicket" :disabled="creating" class="px-3 py-1 rounded bg-indigo-600 text-white">{{ creating ? 'Creando...' : 'Crear ticket' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import apiClient from '@/services/api'
import showToast from '@/modules/common/composables/useToast'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({ title: '', description: '' })
const creating = ref(false)

const createTicket = async () => {
  if (!form.value.title) return
  creating.value = true
  try {
    const payload = { title: form.value.title, description: form.value.description }
    const res = await apiClient.post('/tickets', payload)
    const newTicket = res.data.data ?? res.data
    showToast('Ticket creado')
    // Navigate to ticket conversation
    router.push(`/tickets/${newTicket.id}`)
  } catch (e: any) {
    console.error(e)
    const resp = e?.response
    if (resp?.data) showToast(JSON.stringify(resp.data), 'error')
    else showToast('Error creando ticket', 'error')
  } finally {
    creating.value = false
  }
}
</script>
