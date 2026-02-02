<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Ticket</h1>
      <router-link to="/tickets/mine" class="text-sm font-medium text-indigo-400 hover:text-indigo-200">Back to my tickets</router-link>
    </div>

    <div v-if="loading" class="text-gray-400">Loading...</div>

    <div v-else>
      <div class="mb-4">
        <h2 class="text-xl font-semibold">{{ ticket.title }}</h2>
        <p class="text-sm text-gray-400">ID: {{ ticket.id }}</p>
      </div>

      <div class="mb-6">
        <h3 class="font-medium">Messages</h3>
        <ul>
          <li v-for="msg in messages" :key="msg.id" class="border rounded p-3 my-2 bg-white/5">
            <div class="flex justify-between">
              <div>
                <div class="text-sm text-gray-300">{{ msg.authorName || msg.author?.name }} • {{ new Date(msg.createdAt || msg.created_at).toLocaleString() }}</div>
                <div class="mt-2">{{ msg.message || msg.body }}</div>
              </div>
              <div>
                <button v-if="canDelete(msg)" @click="deleteMessage(msg.id)" class="text-red-400">Delete</button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="mb-6">
        <h3 class="font-medium">Add reply</h3>
        <textarea v-model="newMessage" rows="4" class="w-full rounded p-2 bg-white/5"></textarea>
        <div class="mt-2">
          <button @click="postMessage" :disabled="posting" class="px-3 py-1 bg-indigo-500 text-white rounded">{{ posting ? 'Sending...' : 'Send' }}</button>
        </div>
      </div>
    </div>

    <div v-if="error" class="text-red-400">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/modules/auth/composables/useAuth'
import apiClient from '@/services/api'

const route = useRoute()
const router = useRouter()
const { user } = useAuth()
const ticketId = route.params.id as string

const ticket = ref<any>({})
const messages = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const newMessage = ref('')
const posting = ref(false)

const canDelete = (msg: any) => {
  if (!user?.value) return false
  // allow if admin or message author
  const isAdmin = !!user.value.roles?.find((r: any) => r.name.toLowerCase() === 'admin')
  const isAuthor = msg.user_id === user.value.id || msg.author?.id === user.value.id
  return isAdmin || isAuthor
}

const fetchTicket = async () => {
  loading.value = true
  error.value = null
  try {
    const resp = await apiClient.get(`/tickets/${ticketId}`)
    ticket.value = resp.data.ticket || resp.data || {}
    const fetchedMessages = ticket.value.messages || resp.data.messages || []

    // normalize messages so authorName and createdAt always exist
    messages.value = fetchedMessages.map((m: any) => {
      if (typeof m === 'string') {
        return {
          id: Date.now() + Math.floor(Math.random() * 1000),
          message: m,
          createdAt: new Date().toISOString(),
          authorName: user?.value?.name || user?.value?.email || 'Usuario',
          user_id: user?.value?.id
        }
      }

      if (!m.createdAt && m.created_at) m.createdAt = m.created_at
      if (!m.createdAt) m.createdAt = new Date().toISOString()
      if (!m.message && m.body) m.message = m.body

      if (m.author && (m.author.name || m.author.first_name)) {
        m.authorName = m.author.name || m.author.first_name
      }

      if (!m.authorName) {
        if (m.user_id && user?.value?.id && m.user_id === user.value.id) {
          m.authorName = user.value.name || user.value.email || 'Usuario'
        } else {
          m.authorName = m.user_id ? `Usuario ${m.user_id}` : (m.author?.id ? `Usuario ${m.author.id}` : 'Usuario desconocido')
        }
      }

      return m
    })
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error loading ticket'
  } finally {
    loading.value = false
  }
}

const postMessage = async () => {
  if (!newMessage.value) return
  posting.value = true
  try {
    const resp = await apiClient.post(`/tickets/${ticketId}/messages`, { message: newMessage.value, user_id: user?.value?.id, ticket_id: ticketId })
    let newMsg: any = resp.data.message || resp.data
    // If API returns a simple string, wrap into an object
    if (typeof newMsg === 'string') {
      newMsg = {
        id: Date.now(),
        message: newMsg,
        createdAt: new Date().toISOString(),
        authorName: user?.value?.name || user?.value?.email || 'You',
        user_id: user?.value?.id
      }
    }
    // normalize timestamp and message fields to avoid Invalid Date and missing body
    if (!newMsg.createdAt && newMsg.created_at) newMsg.createdAt = newMsg.created_at
    if (!newMsg.createdAt) newMsg.createdAt = new Date().toISOString()
    if (!newMsg.message && newMsg.body) newMsg.message = newMsg.body
    messages.value.push(newMsg)
    // notify list that ticket updated
    window.dispatchEvent(new CustomEvent('ticket-updated', { detail: { ticketId, count: messages.value.length } }))
    newMessage.value = ''
  } catch (err: any) {
    console.error('postMessage error:', err)
    const apiData = err.response?.data
    error.value = apiData?.message || JSON.stringify(apiData) || err.message || 'Error posteando mensaje'
  } finally {
    posting.value = false
  }
}

const deleteMessage = async (messageId: number) => {
  try {
    await apiClient.delete(`/tickets/${ticketId}/messages/${messageId}`)
    messages.value = messages.value.filter(m => m.id !== messageId)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error deleting message'
  }
}

onMounted(() => {
  if (!ticketId) {
    router.push('/tickets/mine')
  } else {
    fetchTicket()
  }
})
</script>