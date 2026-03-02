<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <PageHeading
      title="Tickets de Soporte"
      description="Gestión de tickets y soporte al cliente"
    />

    <!-- Filtros y estadísticas -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-wrap items-center gap-3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por asunto o usuario..."
          class="block w-full sm:w-64 rounded-lg border-0 px-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
        />
        <select
          v-model="statusFilter"
          class="rounded-lg border-0 px-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="closed">Cerrados</option>
        </select>
      </div>
      
      <div class="flex items-center gap-4 text-sm">
        <span class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-green-500"></span>
          <span class="text-gray-600 dark:text-gray-400">{{ activeCount }} activos</span>
        </span>
        <span class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-gray-400"></span>
          <span class="text-gray-600 dark:text-gray-400">{{ closedCount }} cerrados</span>
        </span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-gray-500 dark:text-gray-400">Cargando tickets...</div>
    </div>

    <!-- Tabla de tickets -->
    <AdminsTable
      v-else
      :columns="columns"
      :empty="filteredTickets.length === 0"
    >
      <template #empty>
        No se encontraron tickets
      </template>

      <tr 
        v-for="ticket in filteredTickets" 
        :key="ticket.id"
        class="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
        @click="openTicketDetail(ticket.id)"
      >
        <AdminTd first variant="primary">
          <div class="flex items-center gap-3">
            <div :class="[
              'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold',
              ticket.active 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            ]">
              #{{ ticket.id }}
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ ticket.subject || ticket.title || `Ticket #${ticket.id}` }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {{ ticket.message || ticket.description || '-' }}
              </p>
            </div>
          </div>
        </AdminTd>

        <AdminTd variant="muted">
          <div>
            <p class="text-gray-900 dark:text-white">{{ ticket.user?.name || ticket.user_name || '-' }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ ticket.user?.email || ticket.user_email || '-' }}</p>
          </div>
        </AdminTd>

        <AdminTd variant="muted">
          <span :class="[
            'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
            ticket.active 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
          ]">
            {{ ticket.active ? 'Activo' : 'Cerrado' }}
          </span>
        </AdminTd>

        <AdminTd variant="muted">
          <div class="text-sm">
            <p class="text-gray-900 dark:text-white">{{ formatDate(ticket.created_at) }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(ticket.created_at) }}</p>
          </div>
        </AdminTd>

        <AdminTd variant="muted">
          <span v-if="ticket.messages && ticket.messages.length > 0" class="text-gray-600 dark:text-gray-400">
            {{ ticket.messages.length }} mensajes
          </span>
          <span v-else class="text-gray-400">Sin mensajes</span>
        </AdminTd>

        <AdminTd variant="actions">
          <div class="flex items-center gap-2" @click.stop>
            <button
              @click="openTicketDetail(ticket.id)"
              class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              title="Ver detalle"
            >
              <span class="material-icons text-xl">visibility</span>
            </button>
            <button
              v-if="ticket.active"
              @click="closeTicket(ticket.id)"
              class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              title="Cerrar ticket"
            >
              <span class="material-icons text-xl">check_circle</span>
            </button>
            <button
              v-else
              @click="reopenTicket(ticket.id)"
              class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors"
              title="Reabrir ticket"
            >
              <span class="material-icons text-xl">refresh</span>
            </button>
          </div>
        </AdminTd>
      </tr>
    </AdminsTable>

    <!-- Modal de detalle -->
    <Modal :show="showDetailModal" @close="closeDetailModal" size="lg">
      <template #header>
        <div class="flex items-center gap-3">
          <div :class="[
            'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold',
            selectedTicket?.active 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-500'
          ]">
            #{{ selectedTicket?.id }}
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ selectedTicket?.subject || selectedTicket?.title || `Ticket #${selectedTicket?.id}` }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ selectedTicket?.user?.name }} · {{ formatDate(selectedTicket?.created_at) }}
            </p>
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <!-- Mensaje original -->
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Mensaje original:</p>
          <p class="text-gray-900 dark:text-white">{{ selectedTicket?.message || selectedTicket?.description || '-' }}</p>
        </div>

        <!-- Conversación -->
        <div v-if="loadingMessages" class="text-center py-4 text-gray-500">
          Cargando mensajes...
        </div>
        <div v-else class="space-y-3 max-h-64 overflow-y-auto">
          <div
            v-for="msg in ticketMessages"
            :key="msg.id"
            :class="[
              'rounded-lg p-3',
              msg.is_support 
                ? 'bg-indigo-50 dark:bg-indigo-900/20 ml-4' 
                : 'bg-gray-50 dark:bg-gray-800 mr-4'
            ]"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium" :class="msg.is_support ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'">
                {{ msg.is_support ? 'Soporte' : (msg.user?.name || 'Usuario') }}
              </span>
              <span class="text-xs text-gray-500">{{ formatDateTime(msg.created_at) }}</span>
            </div>
            <p class="text-sm text-gray-800 dark:text-gray-200">{{ msg.content || msg.message || msg.body }}</p>
          </div>
        </div>

        <!-- Responder -->
        <div v-if="selectedTicket?.active" class="border-t pt-4 dark:border-gray-700">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Responder como soporte
          </label>
          <textarea
            v-model="replyMessage"
            rows="3"
            class="w-full rounded-lg border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
            placeholder="Escribe tu respuesta..."
          ></textarea>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-between w-full">
          <div>
            <button
              v-if="selectedTicket?.active"
              @click="closeTicketFromModal"
              class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cerrar ticket
            </button>
          </div>
          <div class="flex gap-3">
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              @click="closeDetailModal"
            >
              Cerrar
            </button>
            <button
              v-if="selectedTicket?.active"
              type="button"
              :disabled="!replyMessage.trim() || sendingReply"
              class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="sendReplyFromModal"
            >
              {{ sendingReply ? 'Enviando...' : 'Enviar respuesta' }}
            </button>
          </div>
        </div>
      </template>
    </Modal>

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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/services/api'
import AdminsTable from '@/modules/admin/components/AdminsTable.vue'
import AdminTd from '@/modules/admin/components/AdminTd.vue'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import Modal from '@/modules/admin/components/Modal.vue'

const router = useRouter()

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

// Table columns
const columns = [
  { key: 'ticket', label: 'Ticket' },
  { key: 'user', label: 'Usuario' },
  { key: 'status', label: 'Estado' },
  { key: 'created', label: 'Creado' },
  { key: 'messages', label: 'Mensajes' },
  { key: 'actions', label: 'Acciones', srOnly: true }
]

// Computed
const filteredTickets = computed(() => {
  let result = tickets.value

  if (statusFilter.value === 'active') {
    result = result.filter(t => t.active)
  } else if (statusFilter.value === 'closed') {
    result = result.filter(t => !t.active)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t => 
      (t.subject || t.title || '').toLowerCase().includes(query) ||
      (t.user?.name || t.user_name || '').toLowerCase().includes(query) ||
      (t.user?.email || t.user_email || '').toLowerCase().includes(query)
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
    const res = await apiClient.get('/tickets')
    tickets.value = res.data.data ?? res.data ?? []
  } catch (e) {
    console.error(e)
    showToast('Error al cargar tickets', 'error')
  } finally {
    loading.value = false
  }
}

const openTicketDetail = async (ticketId: number) => {
  selectedTicket.value = tickets.value.find(t => t.id === ticketId)
  showDetailModal.value = true
  replyMessage.value = ''
  
  // Load messages
  loadingMessages.value = true
  try {
    const res = await apiClient.get(`/tickets/${ticketId}`)
    const data = res.data.data ?? res.data
    ticketMessages.value = data.messages ?? []
  } catch (e) {
    console.error(e)
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
      showToast('Respuesta enviada', 'success')
    }
  } catch (e: any) {
    console.error(e)
    showToast('Error al enviar respuesta', 'error')
  } finally {
    sendingReply.value = false
  }
}

const closeTicket = async (ticketId: number) => {
  try {
    await apiClient.put(`/admin/tickets/${ticketId}`, { active: false })
    const ticket = tickets.value.find(t => t.id === ticketId)
    if (ticket) ticket.active = false
    showToast('Ticket cerrado', 'success')
  } catch (e) {
    console.error(e)
    showToast('Error al cerrar ticket', 'error')
  }
}

const closeTicketFromModal = async () => {
  if (!selectedTicket.value) return
  await closeTicket(selectedTicket.value.id)
  selectedTicket.value.active = false
}

const reopenTicket = async (ticketId: number) => {
  try {
    await apiClient.put(`/admin/tickets/${ticketId}`, { active: true })
    const ticket = tickets.value.find(t => t.id === ticketId)
    if (ticket) ticket.active = true
    showToast('Ticket reabierto', 'success')
  } catch (e) {
    console.error(e)
    showToast('Error al reabrir ticket', 'error')
  }
}

// Formatters
const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatTime = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

const formatDateTime = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('es-ES', { 
    day: '2-digit', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

onMounted(loadTickets)
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
