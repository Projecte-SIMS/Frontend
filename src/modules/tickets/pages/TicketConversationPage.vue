<template>
  <div class="p-6 max-w-4xl mx-auto font-sans min-h-[calc(100vh-8rem)] flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <router-link to="/tickets" class="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-brand-primary-600 transition-colors mb-3">
          <ArrowLeftIcon class="size-3" /> Volver a mis tickets
        </router-link>
        <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none">{{ ticket.subject || ticket.title || `Ticket #${ticket.id}` }}</h1>
        <div class="flex items-center gap-3 mt-3">
          <span :class="ticket.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'" class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
            {{ ticket.active ? 'Abierto' : 'Cerrado' }}
          </span>
          <span class="text-xs font-bold text-gray-400">·</span>
          <span class="text-xs font-bold text-gray-400">{{ formatDate(ticket.created_at) }}</span>
        </div>
      </div>
      <button @click="load" class="p-3 rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 text-gray-500 hover:text-brand-primary-600 transition-all active:scale-95">
        <ArrowPathIcon class="size-5" :class="{'animate-spin': loading}" />
      </button>
    </div>

    <!-- Messages -->
    <div class="flex-1 space-y-8 mb-8">
      <!-- Original Message -->
      <div class="bg-brand-primary-50/50 dark:bg-brand-primary-900/10 border border-brand-primary-100 dark:border-brand-primary-900/30 rounded-[2rem] p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <div class="size-8 rounded-full bg-brand-primary-100 dark:bg-brand-primary-900/50 flex items-center justify-center text-[10px] font-black text-brand-primary-600">
            {{ getInitials(ticket.user?.name) }}
          </div>
          <div>
            <p class="text-[10px] font-black text-brand-primary-400 uppercase tracking-widest leading-none">Descripción inicial</p>
            <p class="text-[9px] font-bold text-gray-400 uppercase mt-1">{{ formatDate(ticket.created_at) }}</p>
          </div>
        </div>
        <p class="text-gray-800 dark:text-gray-200 font-medium leading-relaxed italic">"{{ ticket.description || ticket.message }}"</p>
      </div>

      <!-- Chat Thread -->
      <div v-for="m in messages" :key="m.id" class="flex flex-col" :class="[m.user_id === currentUserId ? 'items-end' : 'items-start']">
        <div class="flex items-end gap-3 max-w-[85%]">
          <!-- Avatar (otros) -->
          <div v-if="m.user_id !== currentUserId" class="size-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0 border border-white dark:border-slate-700">
            {{ getInitials(m.user?.name) }}
          </div>

          <div 
            :class="[
              m.user_id === currentUserId
                ? 'bg-brand-primary-600 text-white rounded-2xl rounded-tr-none shadow-lg shadow-brand-primary-500/10' 
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm'
            ]"
            class="p-4"
          >
            <div class="flex items-center justify-between gap-6 mb-1.5">
              <span class="text-[10px] font-black uppercase tracking-widest" :class="m.user_id === currentUserId ? 'text-brand-primary-100' : 'text-brand-primary-600 dark:text-brand-primary-400'">
                {{ m.user_id === currentUserId ? 'Tú' : (m.user?.name || 'Soporte') }}
              </span>
              <span class="text-[9px] font-bold uppercase opacity-50">{{ formatTime(m.created_at) }}</span>
            </div>
            <p class="text-sm font-medium leading-relaxed">{{ m.content || m.message || m.body || '' }}</p>
          </div>

          <!-- Avatar (mí) -->
          <div v-if="m.user_id === currentUserId" class="size-9 rounded-full bg-brand-primary-100 dark:bg-brand-primary-900/50 flex items-center justify-center text-[10px] font-black text-brand-primary-600 shrink-0 border border-white dark:border-slate-700">
            {{ getInitials(m.user?.name || 'Tú') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Reply Area -->
    <div v-if="ticket.active" class="sticky bottom-4 bg-white dark:bg-gray-900 p-2 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800">
      <form @submit.prevent="sendMessage" class="flex items-end gap-2 p-2">
        <textarea 
          v-model="form.message" 
          rows="2" 
          class="flex-1 bg-gray-50 dark:bg-gray-950 border-0 focus:ring-2 focus:ring-brand-primary-500 rounded-2xl py-3 px-4 text-sm font-medium text-gray-900 dark:text-white resize-none" 
          placeholder="Escribe tu respuesta aquí..."
        ></textarea>
        <button 
          type="submit" 
          :disabled="sending || !form.message.trim()" 
          class="size-12 flex items-center justify-center rounded-2xl bg-brand-primary-600 text-white shadow-lg shadow-brand-primary-500/20 hover:bg-brand-primary-700 transition-all active:scale-95 disabled:opacity-50"
        >
          <PaperAirplaneIcon v-if="!sending" class="size-6 -rotate-45 -mr-1" />
          <ArrowPathIcon v-else class="size-6 animate-spin" />
        </button>
      </form>
    </div>
    <div v-else class="bg-gray-100 dark:bg-gray-800 p-6 rounded-3xl text-center space-y-4 shadow-inner">
      <p class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
        <LockClosedIcon class="size-4" /> Este ticket está cerrado
      </p>
      <button 
        @click="reopenTicket"
        class="px-6 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-[10px] font-black uppercase tracking-widest text-brand-primary-600 dark:text-brand-primary-400 hover:bg-brand-primary-50 transition-all shadow-sm active:scale-95"
      >
        Solicitar reapertura
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/services/api'
import showToast from '@/modules/common/composables/useToast'
import { 
  ArrowLeftIcon, 
  ArrowPathIcon, 
  PaperAirplaneIcon,
  LockClosedIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const id = route.params.id as string

const ticket = ref<any>({})
const messages = ref<any[]>([])
const loading = ref(false)
const sending = ref(false)
const form = ref({ message: '' })

const currentUserId = computed(() => {
  const authData = localStorage.getItem('auth_user')
  if (!authData) return null
  try {
    return JSON.parse(authData).id
  } catch {
    return null
  }
})

const getInitials = (name?: string) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const load = async () => {
  loading.value = true
  try {
    const res = await apiClient.get(`/tickets/${id}`)
    const data = res.data.data ?? res.data
    ticket.value = data
    messages.value = data.messages ?? data.data?.messages ?? []
  } catch (e) {
    console.error(e)
    showToast('Error al cargar la conversación', 'error')
  } finally {
    loading.value = false
  }
}

const sendMessage = async () => {
  if (!form.value.message.trim()) return
  sending.value = true
  try {
    const payload = { ticket_id: id, message: form.value.message }
    const res = await apiClient.post(`/tickets/${id}/messages`, payload)
    const newMsg = res.data.data ?? res.data
    if (newMsg) messages.value.push(newMsg)
    form.value.message = ''
    showToast('Mensaje enviado', 'success')
  } catch (e: any) {
    showToast('Error al enviar mensaje', 'error')
  } finally {
    sending.value = false
  }
}

const reopenTicket = async () => {
  try {
    await apiClient.put(`/tickets/${id}`, { active: true })
    ticket.value.active = true
    showToast('Ticket reabierto', 'success')
  } catch (e) {
    showToast('Error al reabrir ticket', 'error')
  }
}

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'
const formatTime = (d: string) => d ? new Date(d).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''

onMounted(load)
</script>
