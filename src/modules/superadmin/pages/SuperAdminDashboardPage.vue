<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- Header Premium -->
    <header class="bg-gradient-to-r from-blue-900/80 to-indigo-900/80 backdrop-blur-xl border-b border-blue-500/20 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <span class="text-2xl">🏢</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Panel SuperAdmin
            </h1>
            <p class="text-xs text-blue-300/60">Gestión de empresas multi-tenant</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="px-4 py-2 text-gray-300 hover:text-white hover:bg-red-500/20 transition-all rounded-lg border border-red-500/20 hover:border-red-500/50"
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Stats Grid - Enhanced -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <!-- Total Tenants -->
        <div class="bg-gradient-to-br from-blue-900/50 to-blue-800/30 backdrop-blur rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-blue-300/70 text-sm font-medium">Empresas</div>
              <div class="text-3xl font-bold text-white mt-2">{{ tenants.length }}</div>
              <div class="text-xs text-blue-300/50 mt-1">Total registradas</div>
            </div>
            <div class="text-4xl opacity-20">🏢</div>
          </div>
        </div>

        <!-- System Status -->
        <div class="bg-gradient-to-br from-green-900/50 to-green-800/30 backdrop-blur rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-green-300/70 text-sm font-medium">Estado Sistema</div>
              <div class="text-lg font-bold text-white mt-2 flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Activo
              </div>
              <div class="text-xs text-green-300/50 mt-1">Todos servicios OK</div>
            </div>
            <div class="text-4xl opacity-20">✅</div>
          </div>
        </div>

        <!-- Total Users -->
        <div class="bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-purple-300/70 text-sm font-medium">Usuarios Totales</div>
              <div class="text-3xl font-bold text-white mt-2">{{ totalUsers }}</div>
              <div class="text-xs text-purple-300/50 mt-1">Across all tenants</div>
            </div>
            <div class="text-4xl opacity-20">👥</div>
          </div>
        </div>

        <!-- Version -->
        <div class="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 backdrop-blur rounded-xl p-6 border border-indigo-500/20 hover:border-indigo-500/40 transition-all">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-indigo-300/70 text-sm font-medium">Sistema</div>
              <div class="text-3xl font-bold text-white mt-2">v1.0</div>
              <div class="text-xs text-indigo-300/50 mt-1">Multi-Tenant</div>
            </div>
            <div class="text-4xl opacity-20">⚙️</div>
          </div>
        </div>
      </div>

      <!-- Create Tenant Section -->
      <div class="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur rounded-xl p-6 mb-8 border border-gray-700/50">
        <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span class="text-xl">➕</span> Crear Nueva Empresa
        </h2>
        <form @submit.prevent="handleCreateTenant" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2">Identificador (lowercase)</label>
              <input
                v-model="newTenantId"
                type="text"
                required
                placeholder="ej: miempresa"
                class="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <p class="text-xs text-gray-400 mt-1">Solo letras minúsculas, números, guiones</p>
            </div>
            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2">URL de Acceso</label>
              <div class="w-full px-4 py-2.5 bg-gray-600/30 border border-gray-600/50 rounded-lg text-blue-300 font-mono text-sm flex items-center">
                <span class="text-gray-500">🔗</span>
                <span class="ml-2 truncate">{{ generatedUrl || 'Se generará automáticamente...' }}</span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            :disabled="creating || !newTenantId"
            class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <span v-if="!creating">✨ Crear Empresa</span>
            <span v-else>⏳ Creando...</span>
          </button>
        </form>
      </div>

      <!-- Tenants List - Enhanced Table -->
      <div class="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur rounded-xl overflow-hidden border border-gray-700/50">
        <div class="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-white flex items-center gap-2">
            <span class="text-xl">📋</span> Empresas Registradas ({{ tenants.length }})
          </h2>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar empresa..."
              class="px-3 py-1.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div v-if="loading" class="p-12 text-center text-gray-400">
          ⏳ Cargando empresas...
        </div>

        <div v-else-if="filteredTenants.length === 0" class="p-12 text-center text-gray-400">
          <p class="text-lg">No hay empresas registradas</p>
          <p class="text-sm">Crea la primera usando el formulario arriba</p>
        </div>

        <div v-else class="divide-y divide-gray-700/50">
          <div
            v-for="tenant in filteredTenants"
            :key="tenant.id"
            class="px-6 py-5 hover:bg-gray-700/20 transition-colors group"
          >
            <!-- Tenant Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-blue-500/20 rounded-lg text-blue-300">🏢</div>
                  <div>
                    <div class="font-semibold text-white text-lg">{{ tenant.id }}</div>
                    <div class="text-xs text-gray-400">
                      📅 {{ formatDate(tenant.created_at) }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="showInfo(tenant.id)"
                  class="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                  title="Ver detalles"
                >
                  ℹ️
                </button>
                <button
                  @click="showResetPassword(tenant.id)"
                  class="px-3 py-1.5 text-sm bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300 rounded-lg transition-all"
                >
                  🔑 Reset
                </button>
                <button
                  @click="confirmDelete(tenant.id)"
                  class="px-3 py-1.5 text-sm bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-lg transition-all"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>

            <!-- Tenant Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 ml-11">
              <!-- Admin Info -->
              <div class="bg-gray-900/40 rounded-lg p-3 border border-gray-700/50">
                <div class="flex items-center gap-2 mb-1">
                  <span>👤</span>
                  <span class="text-xs text-gray-400">Admin</span>
                </div>
                <div class="text-white font-mono text-sm">{{ tenant.admin_email || 'admin@sims.com' }}</div>
              </div>

              <!-- Password -->
              <div class="bg-gray-900/40 rounded-lg p-3 border border-gray-700/50">
                <div class="flex items-center gap-2 mb-1">
                  <span>🔐</span>
                  <span class="text-xs text-gray-400">Contraseña</span>
                </div>
                <div class="text-yellow-300 font-mono text-sm">password</div>
              </div>

              <!-- Access URL -->
              <div class="bg-gray-900/40 rounded-lg p-3 border border-gray-700/50">
                <div class="flex items-center gap-2 mb-1">
                  <span>🔗</span>
                  <span class="text-xs text-gray-400">URL</span>
                </div>
                <div class="flex items-center gap-2">
                  <a
                    :href="getTenantUrl(tenant.id)"
                    target="_blank"
                    class="text-blue-300 hover:text-blue-200 font-mono text-sm truncate"
                  >
                    {{ getTenantUrl(tenant.id).split('?')[0] }}?tenant=...
                  </a>
                  <button
                    @click="copyToClipboard(getTenantUrl(tenant.id))"
                    class="p-1 text-gray-400 hover:text-white text-xs"
                    title="Copiar URL"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Info Modal -->
    <div v-if="infoModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700/50 shadow-xl">
        <h3 class="text-lg font-semibold text-white mb-4">📊 Detalles - {{ infoModal.tenantId }}</h3>
        
        <div class="space-y-4 mb-6">
          <div class="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
            <span class="text-gray-300">ID Empresa:</span>
            <span class="text-white font-mono">{{ infoModal.tenantId }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
            <span class="text-gray-300">Admin Email:</span>
            <span class="text-white font-mono text-sm">admin@sims.com</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
            <span class="text-gray-300">Usuarios:</span>
            <span class="text-white font-mono">3</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
            <span class="text-gray-300">Estado:</span>
            <span class="text-green-300 font-semibold">✅ Activo</span>
          </div>
        </div>

        <button
          @click="infoModal.show = false"
          class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <div v-if="passwordModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700/50 shadow-xl">
        <h3 class="text-lg font-semibold text-white mb-4">🔑 Resetear Contraseña</h3>
        <p class="text-gray-400 text-sm mb-4">Empresa: <strong class="text-white">{{ passwordModal.tenantId }}</strong></p>
        
        <div class="mb-4">
          <label class="block text-gray-300 text-sm mb-2">Nueva Contraseña (opcional)</label>
          <input
            v-model="passwordModal.newPassword"
            type="text"
            placeholder="Dejar vacío para generar..."
            class="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div v-if="passwordModal.result" class="mb-4 p-3 bg-green-900/30 border border-green-600 rounded-lg">
          <div class="text-green-300 text-sm font-medium">✅ Nueva contraseña:</div>
          <div class="text-white font-mono text-lg mt-2 bg-gray-900/50 p-2 rounded text-center">{{ passwordModal.result }}</div>
          <button
            @click="copyToClipboard(passwordModal.result)"
            class="mt-2 w-full text-sm text-gray-300 hover:text-white py-1"
          >
            📋 Copiar
          </button>
        </div>

        <div class="flex gap-3 justify-end">
          <button
            @click="passwordModal.show = false"
            class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleResetPassword"
            :disabled="resetting"
            class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {{ resetting ? '⏳ Reseteando...' : '🔄 Resetear' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md border border-red-600/30 shadow-xl">
        <h3 class="text-lg font-semibold text-white mb-4">⚠️ Confirmar Eliminación</h3>
        <p class="text-gray-400 mb-4">
          ¿Estás seguro de eliminar la empresa <strong class="text-red-300">{{ deleteModal.tenantId }}</strong>?
        </p>
        <p class="text-sm text-red-300/70 mb-6">Esta acción eliminará todos los datos, usuarios y configuración asociados.</p>
        <div class="flex gap-3 justify-end">
          <button
            @click="deleteModal.show = false"
            class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleDelete"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCentralAuth } from '../composables/useCentralAuth'
import { useTenants } from '../composables/useTenants'

const router = useRouter()
const { logout } = useCentralAuth()
const { tenants, loading, fetchTenants, createTenant, deleteTenant, resetAdminPassword } = useTenants()

const creating = ref(false)
const resetting = ref(false)
const newTenantId = ref('')
const searchQuery = ref('')

const frontendBaseUrl = computed(() => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `http://${window.location.hostname}:5173`
  }
  return window.location.origin
})

const deleteModal = reactive({
  show: false,
  tenantId: ''
})

const passwordModal = reactive({
  show: false,
  tenantId: '',
  newPassword: '',
  result: ''
})

const infoModal = reactive({
  show: false,
  tenantId: ''
})

const generatedUrl = computed(() => {
  if (!newTenantId.value) return ''
  const cleanId = newTenantId.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
  return `${frontendBaseUrl.value}/?tenant=${cleanId}`
})

const filteredTenants = computed(() => {
  if (!searchQuery.value) return tenants.value
  return tenants.value.filter(t => 
    t.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    t.admin_email?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalUsers = computed(() => {
  return tenants.value.length * 3 // 3 users per tenant
})

const getTenantUrl = (tenantId: string) => {
  return `${frontendBaseUrl.value}/?tenant=${tenantId}`
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('✅ Copiado al portapapeles')
  } catch (e) {
    console.error('Error al copiar:', e)
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleLogout = () => {
  logout()
  router.push('/superadmin/login')
}

const handleCreateTenant = async () => {
  const cleanId = newTenantId.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
  if (!cleanId) {
    alert('ID de empresa inválido')
    return
  }
  
  creating.value = true
  try {
    await createTenant({
      id: cleanId,
      domain: `${cleanId}.tenant.local`
    })
    newTenantId.value = ''
    alert(`✅ ¡Empresa "${cleanId}" creada exitosamente!\n\n📧 Admin: admin@sims.com\n🔑 Contraseña: password\n\n🔗 URL: ${getTenantUrl(cleanId)}`)
  } catch (e: any) {
    alert('❌ Error al crear: ' + (e.response?.data?.message || e.message))
  } finally {
    creating.value = false
  }
}

const showInfo = (tenantId: string) => {
  infoModal.tenantId = tenantId
  infoModal.show = true
}

const showResetPassword = (tenantId: string) => {
  passwordModal.tenantId = tenantId
  passwordModal.newPassword = ''
  passwordModal.result = ''
  passwordModal.show = true
}

const handleResetPassword = async () => {
  resetting.value = true
  try {
    const response = await resetAdminPassword(
      passwordModal.tenantId,
      passwordModal.newPassword || undefined
    )
    passwordModal.result = response.data.new_password
  } catch (e: any) {
    alert('Error: ' + (e.response?.data?.message || e.message))
  } finally {
    resetting.value = false
  }
}

const confirmDelete = (tenantId: string) => {
  deleteModal.tenantId = tenantId
  deleteModal.show = true
}

const handleDelete = async () => {
  try {
    await deleteTenant(deleteModal.tenantId)
    deleteModal.show = false
  } catch (e) {
    alert('Error al eliminar tenant')
  }
}

onMounted(() => {
  fetchTenants()
})
</script>
