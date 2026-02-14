<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-4">Admin - Tickets</h1>
    <div v-if="loading">Loading tickets...</div>
    <div v-else>
      <table class="min-w-full table-auto text-left">
        <thead>
          <tr class="text-sm text-gray-400">
            <th class="px-3 py-2">ID</th>
            <th class="px-3 py-2">Subject</th>
            <th class="px-3 py-2">User</th>
            <th class="px-3 py-2">Email</th>
            <th class="px-3 py-2">Status</th>
            <th class="px-3 py-2">Created</th>
            <th class="px-3 py-2">Last message</th>
            <th class="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-for="t in tickets" :key="t.id" class="text-sm">
            <td class="px-3 py-2">{{ t.id }}</td>
            <td class="px-3 py-2">{{ t.subject || t.title || '-' }}</td>
            <td class="px-3 py-2">{{ t.user?.name || t.user_name || '-' }}</td>
            <td class="px-3 py-2">{{ t.user?.email || t.user_email || '-' }}</td>
            <td class="px-3 py-2">{{ t.status || '-' }}</td>
            <td class="px-3 py-2">{{ t.created_at ? new Date(t.created_at).toLocaleString() : '' }}</td>
            <td class="px-3 py-2">{{ t.last_message?.content || t.message || t.description || '' }}</td>
            <td class="px-3 py-2">
              <button @click.prevent="toggleExpand(t.id)" class="text-indigo-400">{{ expanded[t.id] ? 'Hide' : 'View' }}</button>
            </td>
          </tr>
          <template v-for="t in tickets" :key="t.id">
            <tr class="text-sm">
              <td class="px-3 py-2">{{ t.id }}</td>
              <td class="px-3 py-2">{{ t.subject || t.title || '-' }}</td>
              <td class="px-3 py-2">{{ t.user?.name || t.user_name || '-' }}</td>
              <td class="px-3 py-2">{{ t.user?.email || t.user_email || '-' }}</td>
              <td class="px-3 py-2">{{ t.status || '-' }}</td>
              <td class="px-3 py-2">{{ t.created_at ? new Date(t.created_at).toLocaleString() : '' }}</td>
              <td class="px-3 py-2">{{ t.last_message?.content || t.message || t.description || '' }}</td>
              <td class="px-3 py-2">
                <button @click.prevent="toggleExpand(t.id)" class="text-indigo-400">{{ expanded[t.id] ? 'Hide' : 'View' }}</button>
              </td>
            </tr>
            <tr v-if="expanded[t.id]" class="bg-gray-900">
              <td colspan="8" class="p-4">
                <div v-if="loadingDetails[t.id]">Loading conversation...</div>
                <div v-else>
                  <div v-for="m in details[t.id] || []" :key="m.id" class="p-2 border-b border-white/5">
                    <div class="text-sm text-gray-400">{{ m.user?.name || (m.is_support ? 'Support' : 'User') }} • {{ m.created_at ? new Date(m.created_at).toLocaleString() : '' }}</div>
                    <div class="mt-1">{{ m.content || m.message || m.body || '' }}</div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/services/api'
import showToast from '@/modules/common/composables/useToast'

const tickets = ref<any[]>([])
const loading = ref(false)

// expanded state per ticket and cache for details
const expanded = ref<Record<string, boolean>>({})
const details = ref<Record<string, any[]>>({})
const loadingDetails = ref<Record<string, boolean>>({})
const replyForms = ref<Record<string, string>>({})

// Admin should call the general /tickets endpoint; backend will return all tickets if the user has tickets.manage
const load = async () => {
  loading.value = true
  try {
    const res = await apiClient.get('/tickets')
    tickets.value = res.data.data ?? res.data ?? []
  } catch (e: any) {
    console.error(e)
    showToast('Error loading admin tickets', 'error')
  } finally {
    loading.value = false
  }
}

const loadDetails = async (ticketId: string | number) => {
  loadingDetails.value = { ...(loadingDetails.value || {}), [ticketId]: true }
  try {
    // use /tickets/{id} which returns ticket with user and messages
    const res = await apiClient.get(`/tickets/${ticketId}`)
    const data = res.data.data ?? res.data
    details.value = { ...(details.value || {}), [ticketId]: data.messages ?? data.data?.messages ?? [] }
  } catch (e) {
    console.error(e)
    showToast('Error loading ticket conversation', 'error')
  } finally {
    loadingDetails.value = { ...(loadingDetails.value || {}), [ticketId]: false }
  }
}

const sendReply = async (ticketId: string | number) => {
  const idStr = String(ticketId)
  const text = (replyForms.value || {})[idStr] || ''
  if (!text) return
  try {
    const payload = { ticket_id: ticketId, message: text }
    const res = await apiClient.post(`/tickets/${ticketId}/messages`, payload)
    const newMsg = res.data.data ?? res.data
    if (newMsg) {
      const arr = details.value[idStr] || []
      arr.push(newMsg)
      details.value = { ...(details.value || {}), [idStr]: arr }
      replyForms.value = { ...(replyForms.value || {}), [idStr]: '' }
      showToast('Mensaje enviado')
    }
  } catch (e: any) {
    console.error(e)
    const resp = e?.response
    if (resp?.data) showToast(JSON.stringify(resp.data), 'error')
    else showToast('Error enviando mensaje', 'error')
  }
}

const toggleExpand = async (ticketId: string | number) => {
  const idStr = String(ticketId)
  const isExpanded = !!expanded.value[idStr]
  expanded.value = { ...(expanded.value || {}), [idStr]: !isExpanded }
  if (!isExpanded && !(details.value && details.value[idStr])) {
    await loadDetails(idStr)
  }
}

onMounted(load)
</script>
