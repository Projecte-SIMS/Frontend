<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header -->
    <header class="bg-gray-800 border-b border-gray-700">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🏢</span>
          <h1 class="text-xl font-bold text-white">Super Admin Panel</h1>
        </div>
        <button
          @click="handleLogout"
          class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-gray-800 rounded-xl p-6">
          <div class="text-gray-400 text-sm">Total Empresas</div>
          <div class="text-3xl font-bold text-white mt-1">{{ tenants.length }}</div>
        </div>
        <div class="bg-gray-800 rounded-xl p-6">
          <div class="text-gray-400 text-sm">Estado Sistema</div>
          <div class="text-3xl font-bold text-green-400 mt-1">Activo</div>
        </div>
        <div class="bg-gray-800 rounded-xl p-6">
          <div class="text-gray-400 text-sm">Versión</div>
          <div class="text-3xl font-bold text-white mt-1">1.0</div>
        </div>
      </div>

      <!-- Create Tenant Form -->
      <div class="bg-gray-800 rounded-xl p-6 mb-8">
        <h2 class="text-lg font-semibold text-white mb-4">➕ Crear Nueva Empresa</h2>
        <form @submit.prevent="handleCreateTenant" class="flex flex-wrap gap-4 items-end">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-gray-400 text-sm mb-1">Nombre de Empresa (ID)</label>
            <input
              v-model="newTenantId"
              type="text"
              required
              placeholder="miempresa"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <p class="text-xs text-gray-500 mt-1">Solo letras minúsculas, números, guiones</p>
          </div>
          <div class="flex-1 min-w-[300px]">
            <label class="block text-gray-400 text-sm mb-1">URL de Acceso (automática)</label>
            <div class="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-blue-400 font-mono text-sm">
              {{ generatedUrl || 'Escribe el nombre...' }}
            </div>
          </div>
          <div>
            <button
              type="submit"
              :disabled="creating || !newTenantId"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {{ creating ? 'Creando...' : 'Crear Empresa' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Tenants List -->
      <div class="bg-gray-800 rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-700">
          <h2 class="text-lg font-semibold text-white">📋 Empresas Registradas</h2>
        </div>

        <div v-if="loading" class="p-8 text-center text-gray-400">
          Cargando empresas...
        </div>

        <div v-else-if="tenants.length === 0" class="p-8 text-center text-gray-400">
          No hay empresas registradas. Crea la primera arriba.
        </div>

        <div v-else class="divide-y divide-gray-700">
          <div
            v-for="tenant in tenants"
            :key="tenant.id"
            class="px-6 py-4 hover:bg-gray-700/50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-white text-lg">{{ tenant.id }}</div>
                <div class="text-xs text-gray-500 mt-1">
                  Creado: {{ formatDate(tenant.created_at) }}
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="showResetPassword(tenant.id)"
                  class="px-3 py-1 text-sm bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 rounded transition-colors"
                >
                  🔑 Reset Pass
                </button>
                <button
                  @click="confirmDelete(tenant.id)"
                  class="px-3 py-1 text-sm bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
            
            <!-- Admin Info -->
            <div class="mt-3 p-3 bg-gray-900 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div class="text-xs text-gray-500 mb-1">👤 Admin Usuario:</div>
                  <div class="text-white font-mono text-sm">{{ tenant.admin_email || 'admin@sims.com' }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 mb-1">🔐 Password por defecto:</div>
                  <div class="text-yellow-400 font-mono text-sm">password</div>
                </div>
              </div>
            </div>

            <!-- Access URL -->
            <div class="mt-3 p-3 bg-gray-900 rounded-lg">
              <div class="text-xs text-gray-500 mb-1">🔗 URL de Acceso:</div>
              <div class="flex items-center gap-2 flex-wrap">
                <a
                  :href="getTenantUrl(tenant.id)"
                  target="_blank"
                  class="text-blue-400 hover:underline font-mono text-sm break-all"
                >
                  {{ getTenantUrl(tenant.id) }}
                </a>
                <button
                  @click="copyToClipboard(getTenantUrl(tenant.id))"
                  class="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Reset Password Modal -->
    <div v-if="passwordModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-white mb-4">🔑 Resetear Contraseña Admin</h3>
        <p class="text-gray-400 text-sm mb-4">Empresa: <strong class="text-white">{{ passwordModal.tenantId }}</strong></p>
        
        <div class="mb-4">
          <label class="block text-gray-400 text-sm mb-1">Nueva Contraseña (dejar vacío para generar)</label>
          <input
            v-model="passwordModal.newPassword"
            type="text"
            placeholder="Generar automáticamente..."
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div v-if="passwordModal.result" class="mb-4 p-3 bg-green-900/30 border border-green-600 rounded-lg">
          <div class="text-green-400 text-sm">✅ Nueva contraseña:</div>
          <div class="text-white font-mono text-lg mt-1">{{ passwordModal.result }}</div>
        </div>

        <div class="flex gap-3 justify-end">
          <button
            @click="passwordModal.show = false"
            class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cerrar
          </button>
          <button
            @click="handleResetPassword"
            :disabled="resetting"
            class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {{ resetting ? 'Reseteando...' : 'Resetear' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-white mb-4">⚠️ Confirmar Eliminación</h3>
        <p class="text-gray-400 mb-4">
          ¿Estás seguro de eliminar la empresa <strong class="text-white">{{ deleteModal.tenantId }}</strong>?
          Esta acción eliminará todos los datos asociados.
        </p>
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

// Base URL del frontend - usar el origen actual para flexibilidad
const frontendBaseUrl = computed(() => {
  // En desarrollo local
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `http://${window.location.hostname}:5173`
  }
  // En producción, usar el origin actual (Vercel)
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

// Genera la URL automáticamente basada en el ID
const generatedUrl = computed(() => {
  if (!newTenantId.value) return ''
  const cleanId = newTenantId.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
  return `${frontendBaseUrl}/?tenant=${cleanId}`
})

// Obtiene la URL de acceso para un tenant
const getTenantUrl = (tenantId: string) => {
  return `${frontendBaseUrl}/?tenant=${tenantId}`
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('URL copiada!')
  } catch (e) {
    console.error('Error al copiar:', e)
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
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
    const response = await createTenant({
      id: cleanId,
      domain: `${cleanId}.tenant.local`
    })
    newTenantId.value = ''
    alert(`✅ Empresa "${cleanId}" creada!\n\n📧 Admin: admin@sims.com\n🔑 Password: password\n\n🔗 URL: ${getTenantUrl(cleanId)}`)
  } catch (e: any) {
    alert('Error al crear: ' + (e.response?.data?.message || e.message))
  } finally {
    creating.value = false
  }
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
