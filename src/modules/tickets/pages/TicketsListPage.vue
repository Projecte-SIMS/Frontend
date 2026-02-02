<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Mis tickets</h1>
      <router-link to="/dashboard" class="text-sm font-medium text-indigo-400 hover:text-indigo-200">Volver al dashboard</router-link>
    </div>

    <div v-if="loading" class="text-gray-400">Cargando...</div>

    <div v-else>
      <div v-if="tickets.length === 0" class="text-gray-300">No tienes tickets todavía.</div>
      <ul>
        <li v-for="t in tickets" :key="t.id" class="border rounded p-4 my-2 bg-white/5 flex justify-between items-center">
          <div>
            <div class="font-semibold text-white">{{ t.title || 'Sin asunto' }}</div>
            <div class="text-sm text-gray-400">ID: {{ t.id }} • {{ t.status || 'abierto' }}</div>
          </div>
          <div class="flex gap-2 items-center">
            <span class="inline-flex items-center rounded-full bg-gray-700 px-3 py-1 text-xs font-medium text-gray-200">{{ t._message_count ?? t.messages?.length ?? t.message_count ?? 0 }}</span>
            <router-link :to="`/tickets/${t.id}/view`" class="px-3 py-1 bg-indigo-500 text-white rounded">Ver</router-link>
            <router-link :to="`/tickets/${t.id}`" v-if="isAdmin" class="px-3 py-1 bg-gray-600 text-white rounded">Gestionar (Admin)</router-link>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="error" class="text-red-400 mt-4">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuth } from '@/modules/auth/composables/useAuth'
import apiClient from '@/services/api'

const { user } = useAuth()
const tickets = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const isAdmin = computed(() => !!user?.value?.roles?.find((r: any) => r.name.toLowerCase() === 'admin'))

const fetchTickets = async () => {
  loading.value = true
  error.value = null
  try {
    if (!user?.value?.id) throw new Error('User not authenticated')
    const resp = await apiClient.get(`/tickets?user_id=${user.value.id}`)
    const data = resp.data.tickets || resp.data || []
    // ensure message counts
    tickets.value = data.map((t: any) => ({
      ...t,
      _message_count: t.messages ? (Array.isArray(t.messages) ? t.messages.length : t.messages.length || 0) : (t.message_count ?? 0)
    }))
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error cargando tickets'
  } finally {
    loading.value = false
  }
}

const onTicketUpdated = (e: any) => {
  const detail = e.detail || {}
  const ticketId = detail.ticketId
  const count = detail.count
  if (!ticketId) return
  const t = tickets.value.find((x: any) => String(x.id) === String(ticketId))
  if (t) {
    if (typeof count === 'number') t._message_count = count
    else t._message_count = (t._message_count || 0) + 1
  } else {
    // refetch if ticket not in list
    fetchTickets()
  }
}

onMounted(() => {
  fetchTickets()
  window.addEventListener('ticket-updated', onTicketUpdated)
})

onUnmounted(() => {
  window.removeEventListener('ticket-updated', onTicketUpdated)
})
</script>