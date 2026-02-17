<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
    <div class="flex flex-col gap-4">
      <!-- Cabecera -->
      <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ ticket.subject || ticket.title || `Ticket #${ticket.id}` }}
          </h2>
          <div class="mt-1 text-xs text-gray-600 dark:text-gray-300">
            Usuario:
            {{ ticket.user?.name || ticket.user_name || '-' }}
            —
            {{ ticket.user?.email || ticket.user_email || '-' }}
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ ticket.created_at ? new Date(ticket.created_at).toLocaleString() : '' }}
          </div>
          <select
            v-model="ticket.active"
            class="rounded-md bg-white px-3 py-1 text-sm text-gray-900 shadow-sm ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-900 dark:text-white dark:ring-gray-700"
            @change="updateStatus"
          >
            <option :value="true">Active</option>
            <option :value="false">Inactive</option>
          </select>
        </div>
      </div>

      <!-- Descripción -->
      <div class="text-sm text-gray-700 dark:text-gray-300">
        {{ ticket.description || ticket.message || '-' }}
      </div>

      <!-- Mensajes -->
      <div class="space-y-2">
        <div
          v-for="m in messages"
          :key="m.id"
          class="rounded-md bg-gray-50 px-4 py-2 dark:bg-gray-900/80"
        >
          <div class="text-xs text-gray-600 dark:text-gray-400">
            {{ m.user?.name || (m.is_support ? 'Support' : 'User') }} •
            {{ m.created_at ? new Date(m.created_at).toLocaleString() : '' }}
          </div>
          <div class="mt-1 text-sm text-gray-800 dark:text-gray-100">
            {{ m.content || m.message || m.body || '' }}
          </div>
        </div>
      </div>

      <!-- Respuesta -->
      <div class="mt-4">
        <textarea
          v-model="reply"
          rows="3"
          class="w-full rounded-md bg-white p-2 text-sm text-gray-900 shadow-sm ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700"
          placeholder="Reply..."
        ></textarea>
        <div class="mt-2 text-right">
          <button
            @click="sendReply"
            class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import apiClient from '@/services/api'
import { useToast } from '@/modules/common/composables/useToast'

const route = useRoute()
const id = route.params.id as string

const ticket = ref<any>({})
const messages = ref<any[]>([])
const reply = ref('')
const loading = ref(false)
const toast = useToast()

const load = async () => {
  loading.value = true
  try {
    const res = await apiClient.get(`/tickets/${id}`)
    const data = res.data.data ?? res.data
    ticket.value = data
    // normalize active as boolean
    ticket.value.active = !!(data.active)
    messages.value = data.messages ?? data.data?.messages ?? []
  } catch (e) {
    console.error(e)
    toast.error('Error loading ticket')
  } finally {
    loading.value = false
  }
}

const sendReply = async () => {
  if (!reply.value) return
  try {
    const payload = { ticket_id: id, message: reply.value }
    const res = await apiClient.post(`/tickets/${id}/messages`, payload)
    const newMsg = res.data.data ?? res.data
    if (newMsg) messages.value.push(newMsg)
    reply.value = ''
    toast.success('Message sent')
  } catch (e: any) {
    console.error(e)
    const resp = e?.response
    if (resp?.data) toast.error(JSON.stringify(resp.data))
    else toast.error('Error sending message')
  }
}

const updateStatus = async () => {
  try {
    const payload = { active: !!ticket.value.active }
    const res = await apiClient.put(`/tickets/${id}`, payload)
    ticket.value = res.data.data ?? res.data ?? ticket.value
    // normalize
    ticket.value.active = !!(ticket.value.active)
    toast.success('Status updated')
  } catch (e) {
    console.error(e)
    toast.error('Error updating status')
  }
}

onMounted(load)
</script>
