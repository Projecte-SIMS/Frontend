<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header Profesional -->
    <PageHeading
      title="Centro de Soporte"
      description="Gestión centralizada de incidencias y comunicación con usuarios"
    >
      <template #actions>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-6 px-6 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ activeCount }} Activos</span>
            </div>
            <div class="w-px h-4 bg-slate-200 dark:bg-slate-800"></div>
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full bg-slate-300"></span>
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ closedCount }} Cerrados</span>
            </div>
          </div>
        </div>
      </template>
    </PageHeading>

    <!-- Barra de Herramientas -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="flex flex-1 items-center gap-3 max-w-2xl">
        <div class="relative flex-1">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <span class="material-icons text-lg">search</span>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="BUSCAR POR ASUNTO O USUARIO..."
            class="block w-full rounded-xl border-0 pl-11 pr-4 py-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 text-[10px] font-bold uppercase tracking-widest dark:bg-slate-950 transition-all"
          />
        </div>
        <select
          v-model="statusFilter"
          class="rounded-xl border-0 px-4 py-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-indigo-600 text-[10px] font-bold uppercase tracking-widest dark:bg-slate-950 transition-all cursor-pointer"
        >
          <option value="all">TODOS LOS ESTADOS</option>
          <option value="active">SOLO ACTIVOS</option>
          <option value="closed">SOLO CERRADOS</option>
        </select>
      </div>
    </div>

    <!-- Lista de Tickets -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sincronizando incidencias...</span>
    </div>

    <div v-else class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th class="px-6 py-5">Ref / Asunto</th>
              <th class="px-6 py-5">Usuario</th>
              <th class="px-6 py-5 text-center">Estado</th>
              <th class="px-6 py-5">Última Actividad</th>
              <th class="px-6 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr 
              v-for="ticket in filteredTickets" 
              :key="ticket.id"
              class="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all group"
              @click="openTicketDetail(ticket.id)"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div :class="[
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[10px] font-black shadow-sm',
                    ticket.active 
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
                      : 'bg-slate-50 text-slate-400 dark:bg-slate-800'
                  ]">
                    #{{ ticket.id }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">
                      {{ ticket.subject || ticket.title || `Ticket #${ticket.id}` }}
                    </p>
                    <p class="text-[10px] font-bold text-slate-400 line-clamp-1 uppercase tracking-tighter">
                      {{ ticket.message || ticket.description || 'SIN DESCRIPCIÓN' }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                    {{ (ticket.user?.name || 'U').charAt(0) }}
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">{{ ticket.user?.name || 'Usuario' }}</p>
                    <p class="text-[10px] font-medium text-slate-400 lowercase">{{ ticket.user?.email || '-' }}</p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 text-center">
                <span :class="[
                  'inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border',
                  ticket.active 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' 
                    : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                ]">
                  {{ ticket.active ? 'Activo' : 'Cerrado' }}
                </span>
              </td>

              <td class="px-6 py-4">
                <div class="text-[10px] font-black uppercase tracking-tight">
                  <p class="text-slate-900 dark:text-white">{{ formatDate(ticket.created_at) }}</p>
                  <p class="text-slate-400 mt-0.5">{{ formatTime(ticket.created_at) }}</p>
                </div>
              </td>

              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2" @click.stop>
                  <button
                    @click="openTicketDetail(ticket.id)"
                    class="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                  >
                    <span class="material-icons text-xl">visibility</span>
                  </button>
                  <button
                    v-if="ticket.active"
                    @click="closeTicket(ticket.id)"
                    class="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                  >
                    <span class="material-icons text-xl">block</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredTickets.length === 0" class="py-20 text-center">
          <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
            <span class="material-icons text-3xl text-slate-200">search_off</span>
          </div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">No se encontraron incidencias</p>
        </div>
      </div>
    </div>

    <!-- Modal de detalle -->
    <Modal :show="showDetailModal" @close="closeDetailModal" size="lg">
      <template #header>
        <div class="flex items-center gap-4">
          <div :class="[
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[10px] font-black shadow-sm',
            selectedTicket?.active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
          ]">
            #{{ selectedTicket?.id }}
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {{ selectedTicket?.subject || selectedTicket?.title || `Ticket #${selectedTicket?.id}` }}
            </h3>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {{ selectedTicket?.user?.name }} · {{ formatDate(selectedTicket?.created_at) }}
            </p>
          </div>
        </div>
      </template>

      <div class="space-y-6">
        <div class="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <p class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">Asunto Original</p>
          <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {{ selectedTicket?.message || selectedTicket?.description || '-' }}
          </p>
        </div>

        <div class="space-y-4">
          <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Conversación</h4>
          
          <div v-if="loadingMessages" class="flex justify-center py-6">
            <div class="animate-pulse flex gap-2">
              <div class="h-1.5 w-1.5 rounded-full bg-slate-300"></div>
              <div class="h-1.5 w-1.5 rounded-full bg-slate-300"></div>
              <div class="h-1.5 w-1.5 rounded-full bg-slate-300"></div>
            </div>
          </div>

          <div v-else class="space-y-4 max-h-[40vh] overflow-y-auto px-2 custom-scrollbar">
            <div
              v-for="msg in ticketMessages"
              :key="msg.id"
              :class="[
                'rounded-2xl p-4 border transition-all',
                msg.is_support 
                  ? 'bg-indigo-50/50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-800 ml-8' 
                  : 'bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800 mr-8 shadow-sm'
              ]"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-black uppercase tracking-widest" :class="msg.is_support ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'">
                  {{ msg.is_support ? 'Soporte' : (msg.user?.name || 'Cliente') }}
                </span>
                <span class="text-[10px] font-bold text-slate-400 uppercase">{{ formatDateTime(msg.created_at) }}</span>
              </div>
              <p class="text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">{{ msg.content || msg.message || msg.body }}</p>
            </div>
          </div>
        </div>

        <div v-if="selectedTicket?.active" class="border-t border-slate-100 dark:border-slate-800 pt-6">
          <textarea
            v-model="replyMessage"
            rows="4"
            class="w-full rounded-2xl border-0 bg-slate-50 dark:bg-slate-950 p-4 text-sm text-slate-900 dark:text-white shadow-inner ring-1 ring-inset ring-slate-200 dark:ring-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 transition-all"
            placeholder="Escribe tu respuesta..."
          ></textarea>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-between w-full">
          <button
            v-if="selectedTicket?.active"
            @click="closeTicketFromModal"
            class="text-[10px] font-black text-slate-400 hover:text-rose-600 uppercase tracking-widest"
          >
            Cerrar Ticket
          </button>
          <div v-else></div>

          <div class="flex gap-3">
            <button
              type="button"
              class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
              @click="closeDetailModal"
            >
              Cerrar
            </button>
            <button
              v-if="selectedTicket?.active"
              type="button"
              :disabled="!replyMessage.trim() || sendingReply"
              class="px-8 py-2.5 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-200 transition-all active:scale-95"
              @click="sendReplyFromModal"
            >
              {{ sendingReply ? 'ENVIANDO...' : 'ENVIAR RESPUESTA' }}
            </button>
          </div>
        </div>
      </template>
    </Modal>

    <!-- Toast Simplificado -->
    <Transition name="fade">
      <div 
        v-if="toastMessage" 
        class="fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-2xl z-50 text-[10px] font-black uppercase tracking-widest"
        :class="toastType === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'"
      >
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import apiClient from '@/services/api'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import Modal from '@/modules/admin/components/Modal.vue'

// State
const tickets = ref<any[]>([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')

// Modal state
const showDetailModal = ref(false)
const selectedTicket = ref<any>(null)
const ticketMessages = ref<any[]>([])
const loadingMessages = ref(false)
const replyMessage = ref('')
const sendingReply = ref(false)

// Toast
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => { toastMessage.value = '' }, 3000)
}

// Computed
const filteredTickets = computed(() => {
  let result = tickets.value
  if (statusFilter.value === 'active') result = result.filter(t => t.active)
  else if (statusFilter.value === 'closed') result = result.filter(t => !t.active)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t => 
      (t.subject || t.title || '').toLowerCase().includes(query) ||
      (t.user?.name || '').toLowerCase().includes(query)
    )
  }
  return result
})

const activeCount = computed(() => tickets.value.filter(t => t.active).length)
const closedCount = computed(() => tickets.value.filter(t => !t.active).length)

// Methods
const loadTickets = async () => {
  loading.value = true
  try {
    const res = await apiClient.get('/admin/tickets')
    tickets.value = res.data.data ?? res.data ?? []
  } catch (e) {
    showToast('Error de conexión', 'error')
  } finally {
    loading.value = false
  }
}

const openTicketDetail = async (ticketId: number) => {
  selectedTicket.value = tickets.value.find(t => t.id === ticketId)
  showDetailModal.value = true
  loadingMessages.value = true
  try {
    const res = await apiClient.get(`/tickets/${ticketId}`)
    const data = res.data.data ?? res.data
    ticketMessages.value = data.messages ?? []
  } catch (e) {
    ticketMessages.value = []
  } finally {
    loadingMessages.value = false
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedTicket.value = null
  ticketMessages.value = []
  replyMessage.value = ''
}

const sendReplyFromModal = async () => {
  if (!replyMessage.value.trim() || !selectedTicket.value) return
  sendingReply.value = true
  try {
    const res = await apiClient.post(`/tickets/${selectedTicket.value.id}/messages`, {
      message: replyMessage.value,
      ticket_id: selectedTicket.value.id
    })
    const newMsg = res.data.data ?? res.data
    if (newMsg) {
      ticketMessages.value.push(newMsg)
      replyMessage.value = ''
      showToast('Mensaje enviado', 'success')
    }
  } catch (e) {
    showToast('Error al enviar', 'error')
  } finally {
    sendingReply.value = false
  }
}

const closeTicket = async (ticketId: number) => {
  try {
    await apiClient.put(`/admin/tickets/${ticketId}`, { active: false })
    const ticket = tickets.value.find(t => t.id === ticketId)
    if (ticket) ticket.active = false
    showToast('Ticket finalizado', 'success')
  } catch (e) {
    showToast('Error al cerrar', 'error')
  }
}

const closeTicketFromModal = async () => {
  if (!selectedTicket.value) return
  await closeTicket(selectedTicket.value.id)
  selectedTicket.value.active = false
}

// Formatters
const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}
const formatTime = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}
const formatDateTime = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

onMounted(loadTickets)
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
