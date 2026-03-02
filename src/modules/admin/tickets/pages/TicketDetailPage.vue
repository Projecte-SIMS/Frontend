<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <!-- Header con navegación -->
    <div class="mb-6">
      <router-link 
        to="/admin/tickets" 
        class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver a tickets
      </router-link>
      
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex items-start gap-4">
          <div :class="[
            'flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold',
            ticket.active 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
          ]">
            #{{ ticket.id }}
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ ticket.subject || ticket.title || `Ticket #${ticket.id}` }}
            </h1>
            <div class="mt-1 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span>{{ ticket.user?.name || ticket.user_name || '-' }}</span>
              <span>·</span>
              <span>{{ ticket.user?.email || ticket.user_email || '-' }}</span>
              <span>·</span>
              <span>{{ formatDateTime(ticket.created_at) }}</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <span :class="[
            'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
            ticket.active 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
          ]">
            {{ ticket.active ? 'Activo' : 'Cerrado' }}
          </span>
          <button
            v-if="ticket.active"
            @click="closeTicket"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cerrar ticket
          </button>
          <button
            v-else
            @click="reopenTicket"
            class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
          >
            Reabrir ticket
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Conversación -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Mensaje original -->
        <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/10">
          <div class="flex items-center gap-3 mb-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold dark:bg-gray-700 dark:text-gray-300">
              {{ getUserInitials(ticket.user?.name || ticket.user_name) }}
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ ticket.user?.name || ticket.user_name || 'Usuario' }}</p>
              <p class="text-xs text-gray-500">Mensaje original · {{ formatDateTime(ticket.created_at) }}</p>
            </div>
          </div>
          <p class="text-gray-700 dark:text-gray-300">{{ ticket.description || ticket.message || '-' }}</p>
        </div>

        <!-- Mensajes -->
        <div class="space-y-3">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="[
              'rounded-xl p-4 shadow-sm',
              msg.is_support 
                ? 'bg-indigo-50 dark:bg-indigo-900/20 ml-8 ring-1 ring-indigo-200 dark:ring-indigo-800' 
                : 'bg-white dark:bg-gray-800 mr-8 ring-1 ring-gray-900/5 dark:ring-white/10'
            ]"
          >
            <div class="flex items-center gap-3 mb-2">
              <div :class="[
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                msg.is_support 
                  ? 'bg-indigo-200 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-300' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              ]">
                {{ msg.is_support ? 'S' : getUserInitials(msg.user?.name) }}
              </div>
              <div class="flex-1">
                <p :class="[
                  'text-sm font-medium',
                  msg.is_support ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-900 dark:text-white'
                ]">
                  {{ msg.is_support ? 'Soporte' : (msg.user?.name || 'Usuario') }}
                </p>
                <p class="text-xs text-gray-500">{{ formatDateTime(msg.created_at) }}</p>
              </div>
            </div>
            <p class="text-gray-700 dark:text-gray-300 ml-11">{{ msg.content || msg.message || msg.body }}</p>
          </div>
        </div>

        <!-- Responder -->
        <div v-if="ticket.active" class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/10">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Responder como soporte
          </label>
          <textarea
            v-model="reply"
            rows="4"
            class="w-full rounded-lg border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-900 dark:text-white dark:ring-gray-700"
            placeholder="Escribe tu respuesta..."
          ></textarea>
          <div class="mt-3 flex justify-end">
            <button
              @click="sendReply"
              :disabled="!reply.trim() || sending"
              class="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ sending ? 'Enviando...' : 'Enviar respuesta' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar con información -->
      <div class="space-y-4">
        <!-- Info del ticket -->
        <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/10">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Información</h3>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between">
              <dt class="text-gray-500 dark:text-gray-400">ID</dt>
              <dd class="font-medium text-gray-900 dark:text-white">#{{ ticket.id }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500 dark:text-gray-400">Estado</dt>
              <dd>
                <span :class="[
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                  ticket.active 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                ]">
                  {{ ticket.active ? 'Activo' : 'Cerrado' }}
                </span>
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500 dark:text-gray-400">Creado</dt>
              <dd class="font-medium text-gray-900 dark:text-white">{{ formatDate(ticket.created_at) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500 dark:text-gray-400">Mensajes</dt>
              <dd class="font-medium text-gray-900 dark:text-white">{{ messages.length + 1 }}</dd>
            </div>
          </dl>
        </div>

        <!-- Info del usuario -->
        <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/10">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Usuario</h3>
          <div class="flex items-center gap-3 mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold dark:bg-gray-700 dark:text-gray-300">
              {{ getUserInitials(ticket.user?.name || ticket.user_name) }}
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ ticket.user?.name || ticket.user_name || '-' }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ ticket.user?.email || ticket.user_email || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div 
      v-if="toastMessage" 
      class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in"
      :class="toastType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/services/api'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const ticket = ref<any>({})
const messages = ref<any[]>([])
const reply = ref('')
const loading = ref(false)
const sending = ref(false)

// Toast
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => { toastMessage.value = '' }, 3000)
}

const load = async () => {
  loading.value = true
  try {
    const res = await apiClient.get(`/tickets/${id}`)
    const data = res.data.data ?? res.data
    ticket.value = data
    ticket.value.active = !!(data.active)
    messages.value = data.messages ?? data.data?.messages ?? []
  } catch (e) {
    console.error(e)
    showToast('Error al cargar ticket', 'error')
  } finally {
    loading.value = false
  }
}

const sendReply = async () => {
  if (!reply.value.trim()) return
  sending.value = true
  try {
    const payload = { ticket_id: id, message: reply.value }
    const res = await apiClient.post(`/tickets/${id}/messages`, payload)
    const newMsg = res.data.data ?? res.data
    if (newMsg) messages.value.push(newMsg)
    reply.value = ''
    showToast('Respuesta enviada', 'success')
  } catch (e: any) {
    console.error(e)
    showToast('Error al enviar respuesta', 'error')
  } finally {
    sending.value = false
  }
}

const closeTicket = async () => {
  try {
    await apiClient.put(`/admin/tickets/${id}`, { active: false })
    ticket.value.active = false
    showToast('Ticket cerrado', 'success')
  } catch (e) {
    console.error(e)
    showToast('Error al cerrar ticket', 'error')
  }
}

const reopenTicket = async () => {
  try {
    await apiClient.put(`/admin/tickets/${id}`, { active: true })
    ticket.value.active = true
    showToast('Ticket reabierto', 'success')
  } catch (e) {
    console.error(e)
    showToast('Error al reabrir ticket', 'error')
  }
}

const getUserInitials = (name?: string) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const formatDateTime = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('es-ES', { 
    day: '2-digit', 
    month: 'short',
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short',
    year: 'numeric'
  })
}

onMounted(load)
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
