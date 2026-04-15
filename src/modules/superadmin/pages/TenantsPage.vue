<template>
  <div class="space-y-8 animate-fade-in relative min-h-screen">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-white uppercase tracking-tight">Gestión de Inquilinos</h2>
        <p class="text-sm text-slate-500 font-medium">Control total sobre las empresas y bases de datos del sistema.</p>
      </div>
      <button 
        @click="showCreateForm = !showCreateForm"
        class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
      >
        <span class="material-icons text-sm">{{ showCreateForm ? 'close' : 'add' }}</span>
        {{ showCreateForm ? 'Cancelar Alta' : 'Nueva Empresa' }}
      </button>
    </div>

    <!-- Create Form (Inline) -->
    <transition name="fade">
      <div v-if="showCreateForm" class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Formulario de Alta</h3>
        <form @submit.prevent="handleCreateTenant" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-[10px] font-black text-slate-500 uppercase ml-1">Identificador Único (Tenant ID)</label>
            <input 
              v-model="newTenant.id"
              type="text"
              placeholder="ej: miempresa"
              class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
            />
          </div>
          <div class="space-y-2">
            <label class="block text-[10px] font-black text-slate-500 uppercase ml-1">Dominio de Acceso</label>
            <input 
              v-model="newTenant.domain"
              type="text"
              placeholder="ej: miempresa.tenant.local"
              class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
            />
          </div>
          <div class="md:col-span-2 flex justify-end gap-4 mt-2">
            <button 
              type="submit"
              :disabled="creating || !newTenant.id"
              class="px-8 py-3 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {{ creating ? 'Procesando Creación...' : 'Confirmar y Crear Empresa' }}
            </button>
          </div>
        </form>
      </div>
    </transition>

    <!-- Toolbar -->
    <div class="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="flex-1 max-w-md relative">
        <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar por ID o Email..."
          class="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border-0 text-xs font-medium text-slate-900 dark:text-white ring-1 ring-inset ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
        />
      </div>
      <div class="flex items-center gap-3">
        <button 
          v-if="selectedTenants.size > 0"
          @click="confirmDeleteMultiple"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-800 hover:bg-rose-100 transition-all"
        >
          <span class="material-icons text-sm">delete</span>
          Eliminar ({{ selectedTenants.size }})
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <tr>
            <th class="px-6 py-5 text-center">
              <input 
                type="checkbox" 
                :checked="allSelected" 
                @click.stop="toggleAll" 
                class="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
              />
            </th>
            <th class="px-6 py-5">Empresa / ID</th>
            <th class="px-6 py-5 text-center">Facturación</th>
            <th class="px-6 py-5">Alta</th>
            <th class="px-6 py-5 text-center">Estado</th>
            <th class="px-6 py-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr 
            v-for="t in filteredTenants" 
            :key="t.id" 
            @click="openDetails(t)"
            class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer"
          >
            <td class="px-6 py-4 text-center" @click.stop>
              <input type="checkbox" :checked="selectedTenants.has(t.id)" @change="toggleSelect(t.id)" class="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-4">
                <div class="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-xs font-black uppercase shadow-inner border border-indigo-100 dark:border-indigo-800/50">
                  {{ t.id.substring(0, 2) }}
                </div>
                <div>
                  <p class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ t.id }}</p>
                  <p class="text-[10px] font-mono text-indigo-500 font-bold mt-0.5 truncate max-w-[150px]">{{ t.domains?.[0] || 'S/N' }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="text-xs font-black text-slate-700 dark:text-slate-300">{{ formatCents(t.billing?.monthly_amount_cents || 4900) }}</div>
              <p class="text-[9px] text-slate-400 mt-0.5 uppercase tracking-tighter">{{ t.billing?.status || 'inactive' }}</p>
            </td>
            <td class="px-6 py-4">
              <p class="text-xs font-medium text-slate-600 dark:text-slate-400">{{ formatDate(t.created_at) }}</p>
            </td>
            <td class="px-6 py-4 text-center">
              <span 
                :class="[
                  'inline-flex items-center rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border',
                  t.billing?.access?.is_suspended 
                    ? 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                ]"
              >
                {{ t.billing?.access?.is_suspended ? 'SUSPENDIDO' : 'ACTIVO' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right" @click.stop>
              <div class="flex items-center justify-end gap-1">
                <button @click="handleResetPassword(t.id)" class="p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all" title="Resetear Password">
                  <span class="material-icons text-xl">key</span>
                </button>
                <button @click="confirmDelete(t.id)" class="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all" title="Eliminar Empresa">
                  <span class="material-icons text-xl">delete_outline</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredTenants.length === 0" class="py-20 text-center">
        <span class="material-icons text-4xl text-slate-200 mb-4">business_off</span>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">No hay inquilinos registrados</p>
      </div>
    </div>

    <!-- Tenant Details Slide-over -->
    <transition name="slide">
      <div v-if="selectedDetail" class="fixed inset-0 z-[110] flex justify-end overflow-hidden">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="selectedDetail = null"></div>
        
        <!-- Drawer -->
        <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full animate-slide-in border-l border-slate-200 dark:border-slate-800">
          <!-- Header Slide-over -->
          <div class="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-4 text-left">
              <div class="size-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-lg">
                {{ selectedDetail.id.substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <h3 class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ selectedDetail.id }}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <span :class="[
                    'px-2 py-0.5 rounded text-[9px] font-black uppercase border',
                    selectedDetail.billing?.access?.is_suspended ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  ]">
                    {{ selectedDetail.billing?.access?.is_suspended ? 'Cuenta Suspendida' : 'Operativo' }}
                  </span>
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {{ selectedDetail.id }}</span>
                </div>
              </div>
            </div>
            <button @click="selectedDetail = null" class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all shadow-sm">
              <span class="material-icons">close</span>
            </button>
          </div>

          <!-- Content Slide-over -->
          <div class="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar text-left">
            
            <!-- Section: General -->
            <section class="space-y-6">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-icons text-indigo-500 text-lg">info</span>
                <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Información General</h4>
              </div>
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Dominio Principal</p>
                  <a :href="`https://${selectedDetail.domains?.[0]}`" target="_blank" class="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1.5">
                    {{ selectedDetail.domains?.[0] || 'Sin dominio' }}
                    <span class="material-icons text-xs">open_in_new</span>
                  </a>
                </div>
                <div>
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Fecha de Registro</p>
                  <p class="text-sm font-bold text-slate-900 dark:text-white">{{ formatDateFull(selectedDetail.created_at) }}</p>
                </div>
              </div>
            </section>

            <!-- Section: Personal / Admin -->
            <section class="space-y-6">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-icons text-indigo-500 text-lg">person</span>
                <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Administración de Cuenta</h4>
              </div>
              <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Email del Administrador</p>
                    <p class="text-sm font-bold text-slate-900 dark:text-white">{{ selectedDetail.admin_email }}</p>
                  </div>
                  <button @click="handleResetPassword(selectedDetail.id)" class="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm">
                    Resetear Clave
                  </button>
                </div>
                <div class="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Username Inicial</p>
                  <p class="text-sm font-bold text-slate-900 dark:text-white">{{ selectedDetail.admin_username }}</p>
                </div>
              </div>
            </section>

            <!-- Section: Billing -->
            <section class="space-y-6">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-icons text-indigo-500 text-lg">payments</span>
                <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Facturación y Planes</h4>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                  <p class="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Ingreso Mensual (MRR)</p>
                  <p class="text-2xl font-black text-emerald-700 dark:text-emerald-400">{{ formatCents(selectedDetail.billing?.monthly_amount_cents || 4900) }}</p>
                </div>
                <div class="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
                  <p class="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Plan Contratado</p>
                  <p class="text-lg font-black text-indigo-700 dark:text-indigo-400 uppercase">{{ selectedDetail.billing?.price_id?.includes('pro') ? 'PRO BUSINESS' : 'HUB BASIC' }}</p>
                </div>
              </div>

              <div v-if="selectedDetail.billing?.demo_profile" class="mt-6 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Perfil de Facturación</h5>
                <div class="grid grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <p class="text-[9px] font-black text-slate-400 uppercase">Razón Social</p>
                    <p class="text-xs font-bold text-slate-900 dark:text-white">{{ selectedDetail.billing.demo_profile.billing_name }}</p>
                  </div>
                  <div>
                    <p class="text-[9px] font-black text-slate-400 uppercase">CIF/VAT</p>
                    <p class="text-xs font-bold text-slate-900 dark:text-white font-mono">{{ selectedDetail.billing.demo_profile.vat_number || 'No especificado' }}</p>
                  </div>
                  <div class="col-span-2">
                    <p class="text-[9px] font-black text-slate-400 uppercase">Dirección</p>
                    <p class="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                      {{ selectedDetail.billing.demo_profile.address_line }}, {{ selectedDetail.billing.demo_profile.postal_code }}<br>
                      {{ selectedDetail.billing.demo_profile.city }}, {{ selectedDetail.billing.demo_profile.country }}
                    </p>
                  </div>
                  <div>
                    <p class="text-[9px] font-black text-slate-400 uppercase">Método de Pago</p>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="material-icons text-slate-400 text-sm">credit_card</span>
                      <p class="text-xs font-bold text-slate-900 dark:text-white uppercase">
                        {{ selectedDetail.billing.demo_profile.payment_method }} 
                        <span v-if="selectedDetail.billing.demo_profile.card_last4" class="font-mono text-slate-400">****{{ selectedDetail.billing.demo_profile.card_last4 }}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section: System Health -->
            <section class="space-y-6">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-icons text-indigo-500 text-lg">dns</span>
                <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado del Ecosistema</h4>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center">
                  <p class="text-[9px] font-black text-slate-400 uppercase mb-1">Vehículos</p>
                  <p class="text-lg font-black text-slate-900 dark:text-white">--</p>
                </div>
                <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center">
                  <p class="text-[9px] font-black text-slate-400 uppercase mb-1">Reservas</p>
                  <p class="text-lg font-black text-slate-900 dark:text-white">--</p>
                </div>
                <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center">
                  <p class="text-[9px] font-black text-slate-400 uppercase mb-1">Soporte</p>
                  <p class="text-lg font-black text-slate-900 dark:text-white">--</p>
                </div>
              </div>
            </section>
          </div>

          <!-- Footer Slide-over -->
          <div class="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0 flex items-center justify-between">
            <button @click="confirmDelete(selectedDetail.id)" class="px-6 py-3 rounded-xl bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest border border-rose-100 hover:bg-rose-100 transition-all">
              Eliminar Permanentemente
            </button>
            <div class="flex gap-3">
              <a :href="`${frontendBaseUrl}/?tenant=${selectedDetail.id}`" target="_blank" class="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
                Ir al Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Confirm Multiple Delete -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="showDeleteModal = false"></div>
      <div class="relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 max-w-md w-full shadow-2xl">
        <div class="size-16 rounded-3xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 flex items-center justify-center mb-6">
          <span class="material-icons text-3xl">report_problem</span>
        </div>
        <h3 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Eliminación Permanente</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          Estás a punto de eliminar <span class="text-rose-600 font-black">{{ deleteIds.length }} empresa(s)</span>. 
          Esta acción destruirá todas las bases de datos y esquemas asociados de forma irreversible.
        </p>
        
        <div class="mt-8 flex flex-col gap-3">
          <button 
            @click="processDelete"
            :disabled="deleting"
            class="w-full py-4 rounded-2xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200 dark:shadow-none hover:bg-rose-700 transition-all disabled:opacity-50"
          >
            {{ deleting ? 'Borrando Esquemas...' : 'Sí, Eliminar Todo' }}
          </button>
          <button 
            @click="showDeleteModal = false"
            :disabled="deleting"
            class="w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useTenants } from '../composables/useTenants'
import { useToast } from '@/modules/common/composables/useToast'
import type { Tenant } from '@/services/centralApi'

const { tenants, loading, fetchTenants, createTenant, deleteTenant, resetAdminPassword } = useTenants()
const toast = useToast()

const showCreateForm = ref(false)
const creating = ref(false)
const deleting = ref(false)
const showDeleteModal = ref(false)
const searchQuery = ref('')
const selectedTenants = ref(new Set<string>())
const deleteIds = ref<string[]>([])
const selectedDetail = ref<Tenant | null>(null)

const newTenant = reactive({
  id: '',
  domain: ''
})

const frontendBaseUrl = computed(() => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `http://${window.location.hostname}:5173`
  }
  return window.location.origin
})

const filteredTenants = computed(() => {
  if (!searchQuery.value.trim()) return tenants.value
  const q = searchQuery.value.toLowerCase()
  return tenants.value.filter(t => t.id.includes(q) || t.admin_email?.toLowerCase().includes(q))
})

const allSelected = computed(() => {
  return filteredTenants.value.length > 0 && selectedTenants.value.size === filteredTenants.value.length
})

const toggleSelect = (id: string) => {
  const newSet = new Set(selectedTenants.value)
  if (newSet.has(id)) newSet.delete(id)
  else newSet.add(id)
  selectedTenants.value = newSet
}

const toggleAll = () => {
  if (allSelected.value) {
    selectedTenants.value = new Set()
  } else {
    selectedTenants.value = new Set(filteredTenants.value.map(t => t.id))
  }
}

const openDetails = (tenant: Tenant) => {
  selectedDetail.value = tenant
}

const confirmDelete = (id: string) => {
  deleteIds.value = [id]
  showDeleteModal.value = true
}

const confirmDeleteMultiple = () => {
  deleteIds.value = Array.from(selectedTenants.value)
  showDeleteModal.value = true
}

const processDelete = async () => {
  deleting.value = true
  let count = 0
  
  for (const id of deleteIds.value) {
    try {
      await deleteTenant(id)
      count++
      // Pequeña pausa para no saturar DB
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (e) {
      console.error(`Error al borrar ${id}`, e)
    }
  }
  
  if (count > 0) {
    toast.success(`Se han eliminado ${count} empresa(s)`)
    if (selectedDetail.value && deleteIds.value.includes(selectedDetail.value.id)) {
      selectedDetail.value = null
    }
  }
  
  showDeleteModal.value = false
  selectedTenants.value.clear()
  deleteIds.value = []
  deleting.value = false
  fetchTenants()
}

const handleCreateTenant = async () => {
  if (!newTenant.id) return
  creating.value = true
  try {
    const domain = newTenant.domain || `${newTenant.id.toLowerCase()}.tenant.local`
    await createTenant({ id: newTenant.id.toLowerCase(), domain })
    toast.success('Empresa creada correctamente')
    newTenant.id = ''
    newTenant.domain = ''
    showCreateForm.value = false
    fetchTenants()
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error al crear empresa')
  } finally {
    creating.value = false
  }
}

const handleResetPassword = async (id: string) => {
  try {
    const res = await resetAdminPassword(id)
    const newPass = res.data.data.new_password
    await navigator.clipboard.writeText(newPass)
    toast.success(`Nueva clave copiada: ${newPass}`)
  } catch (e) {
    toast.error('Error al resetear password')
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

const formatDateFull = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCents = (cents: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

onMounted(fetchTenants)
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Slide-over animations */
.slide-enter-active, .slide-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-slide-in {
  animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
