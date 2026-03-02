<template>
  <div class="p-6 max-w-4xl mx-auto font-sans min-h-[calc(100vh-8rem)] flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <router-link to="/tickets" class="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition-colors mb-3">
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
      <button @click="load" class="p-3 rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 text-gray-500 hover:text-indigo-600 transition-all active:scale-95">
        <ArrowPathIcon class="size-5" :class="{'animate-spin': loading}" />
      </button>
    </div>

    <!-- Messages -->
    <div class="flex-1 space-y-6 mb-8">
      <!-- Original Message -->
      <div class="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-[2rem] p-6">
        <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Descripción inicial</p>
        <p class="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{{ ticket.description || ticket.message }}</p>
      </div>

      <!-- Chat Thread -->
      <div v-for="m in messages" :key="m.id" :class="['flex w-full', m.is_support ? 'justify-start' : 'justify-end']">
        <div 
          :class="[
            m.is_support 
              ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm' 
              : 'bg-indigo-600 text-white rounded-2xl rounded-tr-none shadow-lg shadow-indigo-500/10'
          ]"
          class="max-w-[85%] p-4"
        >
          <div class="flex items-center gap-3 mb-2">
            <span class="text-[10px] font-black uppercase tracking-widest opacity-60">
              {{ m.is_support ? 'Soporte SIMS' : 'Tú' }}
            </span>
            <span class="text-[9px] font-bold opacity-40 uppercase">{{ formatTime(m.created_at) }}</span>
          </div>
          <p class="text-sm font-medium leading-relaxed">{{ m.content || m.message || m.body || '' }}</p>
        </div>
      </div>
    </div>

    <!-- Reply Area -->
    <div v-if="ticket.active" class="sticky bottom-4 bg-white dark:bg-gray-900 p-2 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800">
      <form @submit.prevent="sendMessage" class="flex items-end gap-2 p-2">
        <textarea 
          v-model="form.message" 
          rows="2" 
          class="flex-1 bg-gray-50 dark:bg-gray-950 border-0 focus:ring-2 focus:ring-indigo-500 rounded-2xl py-3 px-4 text-sm font-medium text-gray-900 dark:text-white resize-none" 
          placeholder="Escribe tu respuesta aquí..."
        ></textarea>
        <button 
          type="submit" 
          :disabled="sending || !form.message.trim()" 
          class="size-12 flex items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
        >
          <PaperAirplaneIcon v-if="!sending" class="size-6 -rotate-45 -mr-1" />
          <ArrowPathIcon v-else class="size-6 animate-spin" />
        </button>
      </form>
    </div>
    <div v-else class="bg-gray-100 dark:bg-gray-800 p-6 rounded-3xl text-center">
      <p class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
        <LockClosedIcon class="size-4" /> Este ticket está cerrado
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'
const formatTime = (d: string) => d ? new Date(d).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''

onMounted(load)
</script>
