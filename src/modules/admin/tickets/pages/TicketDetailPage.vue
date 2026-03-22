<template>
  <div class="space-y-8 animate-fade-in" v-if="ticket.id">
    <PageHeading
      :title="`Detalle del Ticket #${ticket.id}`"
      :description="ticket.subject || ticket.title || 'Sin asunto'"
    >
      <template #actions>
        <div class="flex items-center gap-3">
          <span :class="[
            'inline-flex items-center rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border',
            ticket.active 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' 
              : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
          ]">
            {{ ticket.active ? 'Activo' : 'Cerrado' }}
          </span>
          <button
            v-if="ticket.active"
            @click="closeTicket"
            class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all"
          >
            Cerrar Ticket
          </button>
          <button
            v-else
            @click="reopenTicket"
            class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all"
          >
            Reabrir Ticket
          </button>
        </div>
      </template>
    </PageHeading>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-3">
      <!-- Conversación -->
      <div class="lg:col-span-2 space-y-6">
        <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8">
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-semibold dark:bg-slate-800 dark:text-slate-300">
              {{ getUserInitials(ticket.user?.name || ticket.user_name) }}
            </div>
            <div>
              <p class="font-bold text-slate-900 dark:text-white">{{ ticket.user?.name || ticket.user_name || 'Usuario' }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Mensaje original · {{ formatDateTime(ticket.created_at) }}</p>
              <p class="text-slate-700 dark:text-slate-300 mt-4 leading-relaxed font-medium">{{ ticket.description || ticket.message || '-' }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-4">
           <h3 class="px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Historial de la Conversación</h3>
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="[
              'rounded-2xl p-6 border transition-all',
              msg.is_support 
                ? 'bg-indigo-50/50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-800 ml-10' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 mr-10 shadow-sm'
            ]"
          >
            <div class="flex items-start gap-4">
              <div :class="[
                'flex h-9 w-9 items-center justify-center rounded-full text-xs font-black uppercase',
                msg.is_support 
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-400' 
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
              ]">
                {{ msg.is_support ? 'ST' : getUserInitials(msg.user?.name) }}
              </div>
              <div class="flex-1">
                <p :class="[
                  'text-sm font-bold uppercase tracking-tight',
                  msg.is_support ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-900 dark:text-white'
                ]">
                  {{ msg.is_support ? 'Soporte Técnico' : (msg.user?.name || 'Usuario') }}
                </p>
                <p class="text-[10px] font-medium text-slate-400">{{ formatDateTime(msg.created_at) }}</p>
                <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium mt-3">{{ msg.content || msg.message || msg.body }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="ticket.active" class="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Añadir Respuesta</h3>
          <textarea
            v-model="reply"
            rows="5"
            class="w-full rounded-xl border-0 bg-slate-50 dark:bg-slate-950 p-4 text-sm text-slate-900 dark:text-white shadow-inner ring-1 ring-inset ring-slate-200 dark:ring-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
            placeholder="Escribe una respuesta profesional y clara..."
          ></textarea>
          <div class="mt-4 flex justify-end">
            <button
              @click="sendReply"
              :disabled="!reply.trim() || sending"
              class="inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              <span v-if="sending" class="material-icons text-sm animate-spin">autorenew</span>
              <span>{{ sending ? 'ENVIANDO...' : 'Enviar Respuesta' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1 space-y-6">
        <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Información del Usuario</h3>
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-semibold dark:bg-slate-800 dark:text-slate-300 text-lg">
              {{ getUserInitials(ticket.user?.name || ticket.user_name) }}
            </div>
            <div>
              <p class="font-bold text-slate-900 dark:text-white">{{ ticket.user?.name || ticket.user_name || '-' }}</p>
              <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">{{ ticket.user?.email || ticket.user_email || '-' }}</p>
            </div>
          </div>
        </div>
        <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Detalles del Ticket</h3>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between items-center"><dt class="text-slate-500 dark:text-slate-400 font-medium">ID de Ticket</dt><dd class="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">#{{ ticket.id }}</dd></div>
            <div class="flex justify-between items-center"><dt class="text-slate-500 dark:text-slate-400 font-medium">Fecha Creación</dt><dd class="font-semibold text-slate-700 dark:text-slate-300">{{ formatDate(ticket.created_at) }}</dd></div>
            <div class="flex justify-between items-center"><dt class="text-slate-500 dark:text-slate-400 font-medium">Total Mensajes</dt><dd class="font-semibold text-slate-700 dark:text-slate-300">{{ messages.length + 1 }}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

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
