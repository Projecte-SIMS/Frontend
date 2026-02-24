<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6">
    <!-- Header + filtros (mismo estilo sencillo que otros CRUDs) -->
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Admin - Tickets</h1>
      <div class="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
        <span class="text-gray-500 dark:text-gray-400">Filter:</span>
        <select
          v-model="filterType"
          class="rounded-md bg-white px-3 py-1 text-sm text-gray-900 shadow-sm ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-900 dark:text-white dark:ring-gray-700"
        >
          <option value="all">All</option>
          <option value="user">By user</option>
        </select>
        <select
          v-if="filterType === 'user'"
          v-model="userFilter"
          class="rounded-md bg-white px-3 py-1 text-sm text-gray-900 shadow-sm ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-900 dark:text-white dark:ring-gray-700"
        >
          <option value="">-- Select user --</option>
          <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mt-6 text-sm text-gray-500 dark:text-gray-400">
      Loading tickets...
    </div>

    <!-- Contenido -->
    <div v-else class="mt-6 space-y-8">
      <!-- Activos -->
      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Active tickets</h2>
        <div class="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <div v-if="filteredActiveTickets.length === 0" class="text-gray-500 dark:text-gray-400 text-sm col-span-full">
            No tickets found.
          </div>

          <div
            v-for="t in filteredActiveTickets"
            :key="t.id"
            class="relative rounded-xl bg-white p-4 ring-1 ring-gray-200 text-sm flex flex-col gap-3 shadow-sm dark:bg-gray-900/60 dark:ring-white/10"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <div class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ t.subject || t.title || `Ticket #${t.id}` }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    • {{ t.created_at ? new Date(t.created_at).toLocaleString() : '' }}
                  </div>
                </div>

                <div class="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  <div class="text-xs text-gray-500 dark:text-gray-400">User</div>
                  <div class="truncate">
                    {{ t.user?.name || t.user_name || '-' }}
                    <span class="text-gray-500 dark:text-gray-400">
                      ({{ t.user?.email || t.user_email || '-' }})
                    </span>
                  </div>
                </div>

                <div class="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  <div class="text-xs text-gray-500 dark:text-gray-400">Last message</div>
                  <div class="mt-1 line-clamp-2">
                    {{ t.last_message?.content || t.message || t.description || '-' }}
                  </div>
                </div>
              </div>

              <div class="flex flex-col items-end gap-2">
                <button
                  @click.prevent="toggleExpand(t.id)"
                  class="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 dark:bg-gray-800 dark:text-indigo-300 dark:hover:bg-indigo-900 dark:hover:text-indigo-100 transition"
                >
                  {{ expanded[t.id] ? 'Hide' : 'View conversation' }}
                </button>
                <RouterLink
                  :to="`/admin/tickets/${t.id}`"
                  class="text-indigo-600 text-xs hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200"
                >
                  Open detail
                </RouterLink>
              </div>
            </div>

            <transition name="fade">
              <div v-if="expanded[t.id]" class="mt-3 rounded-md bg-gray-50 p-3 space-y-2 dark:bg-gray-950/60">
                <div v-if="loadingDetails[t.id]" class="text-gray-500 dark:text-gray-400 text-xs">
                  Loading conversation...
                </div>
                <div v-else class="space-y-2 max-h-48 overflow-y-auto text-sm">
                  <div
                    v-for="m in details[t.id] || []"
                    :key="m.id"
                    class="rounded-lg border border-gray-200 p-3 bg-gray-50 dark:bg-gray-900/80 dark:border-white/10 flex flex-col gap-1"
                  >
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ m.user?.name || (m.is_support ? 'Support' : 'User') }} •
                      {{ m.created_at ? new Date(m.created_at).toLocaleString() : '' }}
                    </div>
                    <div class="mt-1 text-sm text-gray-800 dark:text-gray-200">
                      {{ m.content || m.message || m.body || '' }}
                    </div>
                  </div>

                  <div class="pt-1 border-t border-gray-200 dark:border-white/10">
                    <textarea
                      v-model="replyForms[t.id]"
                      rows="2"
                      class="w-full rounded-lg bg-white p-2 text-sm text-gray-900 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-900/70 dark:text-gray-100 dark:ring-white/10"
                      placeholder="Write a reply..."
                    ></textarea>
                    <div class="mt-2 text-right">
                      <button
                        @click.prevent="sendReply(t.id)"
                        class="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </transition>

            <div class="absolute right-3 top-3">
              <span
                class="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                :class="t.active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300'"
              >
                {{ t.active ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Completados -->
      <section>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Completed</h2>
        <div class="mt-3 grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <div v-if="completedTickets.length === 0" class="text-gray-500 dark:text-gray-400 text-sm col-span-full">
            No completed tickets.
          </div>

          <div
            v-for="t in completedTickets"
            :key="'completed-' + t.id"
            class="relative rounded-xl bg-white p-4 ring-1 ring-gray-200 text-sm flex flex-col gap-3 shadow-sm dark:bg-gray-900/60 dark:ring-white/10"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <div class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ t.subject || t.title || `Ticket #${t.id}` }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    • {{ t.created_at ? new Date(t.created_at).toLocaleString() : '' }}
                  </div>
                </div>

                <div class="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  <div class="text-xs text-gray-500 dark:text-gray-400">User</div>
                  <div class="truncate">
                    {{ t.user?.name || t.user_name || '-' }}
                    <span class="text-gray-500 dark:text-gray-400">
                      ({{ t.user?.email || t.user_email || '-' }})
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex flex-col items-end gap-2">
                <RouterLink
                  :to="`/admin/tickets/${t.id}`"
                  class="text-indigo-600 text-xs hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200"
                >
                  Open detail
                </RouterLink>
              </div>
            </div>

            <div class="absolute right-3 top-3">
              <span class="inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300">Completed</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import apiClient from '@/services/api'
import { useToast } from '@/modules/common/composables/useToast'

const tickets = ref<any[]>([])
const loading = ref(false)
const toast = useToast()

// expanded state per ticket and cache for details
const expanded = ref<Record<string, boolean>>({})
const details = ref<Record<string, any[]>>({})
const loadingDetails = ref<Record<string, boolean>>({})
const replyForms = ref<Record<string, string>>({})

const filterType = ref('all') // 'all'|'user'
const userFilter = ref('')
const users = computed(() => {
  const map = new Map()
  ;(tickets.value || []).forEach((t: any) => {
    const uid = t.user?.id ?? t.user_id ?? t.user_email
    const name = t.user?.name ?? t.user_name ?? t.user_email ?? String(uid)
    if (uid) map.set(String(uid), name)
  })
  return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
})
const filteredActiveTickets = computed(() => {
  return (tickets.value || []).filter((t: any) => t.active && (filterType.value !== 'user' || !userFilter.value || String(t.user?.id ?? t.user_id ?? t.user_email) === String(userFilter.value)))
})
const completedTickets = computed(() => {
  return (tickets.value || []).filter((t: any) => !t.active && (filterType.value !== 'user' || !userFilter.value || String(t.user?.id ?? t.user_id ?? t.user_email) === String(userFilter.value)))
})

// Admin should call the general /tickets endpoint; backend will return all tickets if the user has tickets.manage
const load = async () => {
  loading.value = true
  try {
    const res = await apiClient.get('/tickets')
    tickets.value = res.data.data ?? res.data ?? []
  } catch (e: any) {
    console.error(e)
    toast.error('Error loading admin tickets')
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
    toast.error('Error loading ticket conversation')
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
      toast.success('Mensaje enviado')
    }
  } catch (e: any) {
    console.error(e)
    const resp = e?.response
    if (resp?.data) toast.error(JSON.stringify(resp.data))
    else toast.error('Error sending message')
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
