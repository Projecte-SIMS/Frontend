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
          <div class="text-gray-400 text-sm">Dominios Activos</div>
          <div class="text-3xl font-bold text-white mt-1">{{ totalDomains }}</div>
        </div>
        <div class="bg-gray-800 rounded-xl p-6">
          <div class="text-gray-400 text-sm">Estado</div>
          <div class="text-3xl font-bold text-green-400 mt-1">Activo</div>
        </div>
      </div>

      <!-- Create Tenant Form -->
      <div class="bg-gray-800 rounded-xl p-6 mb-8">
        <h2 class="text-lg font-semibold text-white mb-4">➕ Crear Nueva Empresa</h2>
        <form @submit.prevent="handleCreateTenant" class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-gray-400 text-sm mb-1">ID de Empresa</label>
            <input
              v-model="newTenant.id"
              type="text"
              required
              pattern="[a-z0-9_-]+"
              placeholder="mi-empresa"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <p class="text-xs text-gray-500 mt-1">Solo letras minúsculas, números, guiones</p>
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-gray-400 text-sm mb-1">Dominio</label>
            <input
              v-model="newTenant.domain"
              type="text"
              required
              placeholder="miempresa.fleetlee-app.com"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div class="flex items-end">
            <button
              type="submit"
              :disabled="creating"
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
            class="px-6 py-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
          >
            <div>
              <div class="font-medium text-white">{{ tenant.id }}</div>
              <div class="text-sm text-gray-400 mt-1">
                <span v-for="(domain, i) in tenant.domains" :key="domain">
                  <a
                    :href="'https://' + domain"
                    target="_blank"
                    class="text-blue-400 hover:underline"
                  >
                    {{ domain }}
                  </a>
                  <span v-if="i < tenant.domains.length - 1">, </span>
                </span>
              </div>
              <div class="text-xs text-gray-500 mt-1">
                Creado: {{ formatDate(tenant.created_at) }}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="showAddDomain(tenant.id)"
                class="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
              >
                + Dominio
              </button>
              <button
                @click="confirmDelete(tenant.id)"
                class="px-3 py-1 text-sm bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add Domain Modal -->
    <div v-if="domainModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-white mb-4">Añadir Dominio</h3>
        <p class="text-gray-400 text-sm mb-4">Tenant: {{ domainModal.tenantId }}</p>
        <input
          v-model="domainModal.domain"
          type="text"
          placeholder="nuevo-dominio.fleetlee-app.com"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 mb-4"
        />
        <div class="flex gap-3 justify-end">
          <button
            @click="domainModal.show = false"
            class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleAddDomain"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-white mb-4">⚠️ Confirmar Eliminación</h3>
        <p class="text-gray-400 mb-4">
          ¿Estás seguro de eliminar el tenant <strong class="text-white">{{ deleteModal.tenantId }}</strong>?
          Esta acción eliminará la base de datos y todos los datos asociados.
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
const { tenants, loading, fetchTenants, createTenant, deleteTenant, addDomain } = useTenants()

const creating = ref(false)
const newTenant = reactive({ id: '', domain: '' })

const domainModal = reactive({
  show: false,
  tenantId: '',
  domain: ''
})

const deleteModal = reactive({
  show: false,
  tenantId: ''
})

const totalDomains = computed(() => {
  return tenants.value.reduce((sum, t) => sum + t.domains.length, 0)
})

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
  creating.value = true
  try {
    await createTenant({
      id: newTenant.id,
      domain: newTenant.domain
    })
    newTenant.id = ''
    newTenant.domain = ''
  } catch (e) {
    alert('Error al crear tenant')
  } finally {
    creating.value = false
  }
}

const showAddDomain = (tenantId: string) => {
  domainModal.tenantId = tenantId
  domainModal.domain = ''
  domainModal.show = true
}

const handleAddDomain = async () => {
  try {
    await addDomain(domainModal.tenantId, domainModal.domain)
    domainModal.show = false
  } catch (e) {
    alert('Error al añadir dominio')
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
