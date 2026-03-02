<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Mis Tickets</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Gestiona tus consultas y reportes de soporte.</p>
      </div>
      <router-link
        to="/tickets/create"
        class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 active:scale-95"
      >
        <PlusIcon class="size-5" />
        Nuevo Ticket
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <ArrowPathIcon class="size-10 text-indigo-500 animate-spin mb-4" />
      <p class="text-gray-500 font-medium tracking-wide">Cargando tus tickets...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="tickets.length === 0" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm text-center px-6">
      <div class="size-20 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-6">
        <TicketIcon class="size-10 text-indigo-500" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No tienes tickets todavía</h3>
      <p class="text-gray-500 max-w-sm mb-8">¿Necesitas ayuda con algo? Crea un ticket y nuestro equipo de soporte te atenderá lo antes posible.</p>
      <router-link
        to="/tickets/create"
        class="px-8 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
      >
        Crear mi primer ticket
      </router-link>
    </div>

    <!-- Tickets List -->
    <div v-else class="space-y-8">
      <!-- Active Tickets Section -->
      <section v-if="activeTickets.length > 0">
        <h2 class="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Tickets Activos</h2>
        <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div 
            v-for="t in activeTickets" 
            :key="t.id"
            class="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                  <ChatBubbleLeftRightIcon class="size-5" />
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {{ t.subject || t.title || `Ticket #${t.id}` }}
                  </h3>
                  <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    {{ formatDate(t.created_at) }}
                  </p>
                </div>
              </div>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-black uppercase tracking-widest">
                <span class="size-1 rounded-full bg-green-500 animate-pulse"></span>
                Abierto
              </span>
            </div>

            <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 flex-grow">
              {{ t.description || t.last_message?.content || 'Sin descripción adicional' }}
            </p>

            <div class="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800 mt-auto">
              <div class="flex items-center gap-2 text-xs font-bold text-gray-400">
                <EnvelopeOpenIcon class="size-4" />
                {{ t.messages_count || t.messages?.length || 0 }} mensajes
              </div>
              <router-link 
                :to="`/tickets/${t.id}`"
                class="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Ver conversación
                <ChevronRightIcon class="size-4" />
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- Completed Tickets Section -->
      <section v-if="completedTickets.length > 0">
        <h2 class="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Historial / Completados</h2>
        <div class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <table class="w-full text-left">
            <thead class="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th class="px-6 py-4">Ticket</th>
                <th class="px-6 py-4 hidden sm:table-cell">Fecha</th>
                <th class="px-6 py-4">Estado</th>
                <th class="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
              <tr v-for="t in completedTickets" :key="t.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                <td class="px-6 py-4">
                  <p class="font-bold text-gray-900 dark:text-white">{{ t.subject || t.title }}</p>
                  <p class="text-xs text-gray-400 sm:hidden">{{ formatDate(t.created_at) }}</p>
                </td>
                <td class="px-6 py-4 hidden sm:table-cell text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {{ formatDate(t.created_at) }}
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    Cerrado
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <router-link 
                    :to="`/tickets/${t.id}`"
                    class="text-indigo-600 dark:text-indigo-400 font-bold text-sm"
                  >
                    Ver
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import apiClient from '@/services/api'
import showToast from '@/modules/common/composables/useToast'
import {
  PlusIcon,
  ArrowPathIcon,
  TicketIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeOpenIcon,
  ChevronRightIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

const tickets = ref<any[]>([])
const loading = ref(false)

const activeTickets = computed(() => tickets.value.filter((t: any) => t.active))
const completedTickets = computed(() => tickets.value.filter((t: any) => !t.active))

const formatDate = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const load = async () => {
  loading.value = true
  try {
    const res = await apiClient.get('/tickets')
    tickets.value = res.data.data ?? res.data ?? []
  } catch (e) {
    console.error(e)
    showToast('Error al cargar tus tickets', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
