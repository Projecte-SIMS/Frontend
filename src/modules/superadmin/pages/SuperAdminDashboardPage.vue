<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- Header Premium -->
    <header class="bg-gradient-to-r from-blue-900/80 to-indigo-900/80 backdrop-blur-xl border-b border-blue-500/20 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V7M10.5 1.5v4.5h4.5M10.5 1.5L14 5"/>
            </svg>
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
          class="px-4 py-2 text-gray-300 hover:text-white hover:bg-red-500/20 transition-all rounded-lg border border-red-500/20 hover:border-red-500/50 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4.75A2.75 2.75 0 015.75 2h8.5A2.75 2.75 0 0117 4.75v10.5A2.75 2.75 0 0114.25 18h-8.5A2.75 2.75 0 013 15.25V4.75zm9.25 10a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5zm2-4a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" clip-rule="evenodd"/>
          </svg>
          Cerrar Sesión
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
            <svg class="w-10 h-10 text-blue-500/20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V7M10.5 1.5v4.5h4.5M10.5 1.5L14 5"/>
            </svg>
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
            <svg class="w-10 h-10 text-green-500/20" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
            </svg>
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
            <svg class="w-10 h-10 text-purple-500/20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
            </svg>
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
            <svg class="w-10 h-10 text-indigo-500/20" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.533 1.533 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.533 1.533 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Default Credentials -->
      <div class="bg-gradient-to-r from-amber-900/40 to-orange-900/40 backdrop-blur rounded-lg p-3 mb-6 border border-amber-500/20">
        <div class="flex items-center gap-3 flex-wrap">
          <svg class="w-3.5 h-3.5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
          </svg>
          <span class="text-xs font-medium text-amber-300">Credenciales por defecto:</span>
          <span class="text-xs text-white font-mono">admin@sims.com</span>
          <span class="text-xs text-gray-400">/</span>
          <span class="text-xs text-white font-mono">password</span>
          <button
            @click="copyToClipboard('admin@sims.com')"
            class="text-amber-300/50 hover:text-amber-300 transition-colors"
            title="Copiar email"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM15 7a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM4.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
            </svg>
          </button>
          <button
            @click="copyToClipboard('password')"
            class="text-amber-300/50 hover:text-amber-300 transition-colors"
            title="Copiar password"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM15 7a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM4.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Create Tenant Section -->
      <div class="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur rounded-xl p-6 mb-8 border border-gray-700/50">
        <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.5H9a1 1 0 100 2h2a1 1 0 100-2h-1V7z" clip-rule="evenodd"/>
          </svg>
          Crear Nueva Empresa
        </h2>
        <form @submit.prevent="showCreateModal" class="space-y-4">
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
                <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12.586 4.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM9.172 9.172a2 2 0 012.828 0l.793-.793a4 4 0 00-5.656 0l.793.793zm6.364-1.414a2 2 0 012.828 2.828l-.793.793 2.828 2.828-.793.793a4 4 0 01-5.656-5.656l.793-.793z"/>
                </svg>
                <span class="ml-2 truncate">{{ generatedUrl || 'Se generará automáticamente...' }}</span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            :disabled="creating || !newTenantId"
            class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg v-if="!creating" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.5H9a1 1 0 100 2h2a1 1 0 100-2h-1V7z" clip-rule="evenodd"/>
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ creating ? 'Creando...' : 'Crear Empresa' }}
          </button>
        </form>
      </div>

      <!-- Tenants List - Enhanced Table -->
      <div class="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur rounded-xl overflow-hidden border border-gray-700/50">
        <div class="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div v-if="filteredTenants.length > 0" class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="selectAll"
                @change="toggleSelectAll"
                class="w-4 h-4 rounded"
                title="Seleccionar todas"
              />
              <span class="text-xs text-gray-400">Todas</span>
            </div>
            <h2 class="text-lg font-semibold text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
              Empresas Registradas ({{ tenants.length }})
            </h2>
            <div v-if="selectedTenants.size > 0" class="text-sm text-yellow-300">
              {{ selectedTenants.size }} seleccionada(s)
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar empresa..."
                class="px-3 py-1.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div v-if="loading" class="p-12 text-center text-gray-400">
          Cargando empresas...
        </div>

        <div v-else-if="filteredTenants.length === 0" class="p-12 text-center text-gray-400">
          <p class="text-lg">No hay empresas registradas</p>
          <p class="text-sm">Crea la primera usando el formulario arriba</p>
        </div>

        <div v-else class="divide-y divide-gray-700/50">
          <div
            v-for="tenant in filteredTenants"
            :key="tenant.id"
            class="px-6 py-4 hover:bg-gray-700/20 transition-colors group"
            :class="{ 'bg-blue-900/10': selectedTenants.has(tenant.id) }"
          >
            <!-- Tenant Header with Info -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex-1 flex items-center gap-4">
                <input
                  type="checkbox"
                  :checked="selectedTenants.has(tenant.id)"
                  @change="toggleTenantSelect(tenant.id)"
                  class="w-4 h-4 rounded"
                />
                <div class="flex items-center gap-3 flex-1">
                  <div class="p-2 bg-blue-500/20 rounded-lg">
                    <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V7M10.5 1.5v4.5h4.5M10.5 1.5L14 5"/>
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <div class="font-semibold text-white text-base">{{ tenant.id }}</div>
                      <span class="inline-block px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded">
                        admin@sims.com
                      </span>
                    </div>
                    <div class="text-xs text-gray-400 mt-1">
                      {{ formatDate(tenant.created_at) }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="showInfo(tenant.id)"
                  class="p-2 text-gray-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                  title="Ver detalles"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 100 2v3a1 1 0 100-2V9z" clip-rule="evenodd"/>
                  </svg>
                </button>
                <button
                  @click="showResetPassword(tenant.id)"
                  class="px-3 py-1.5 text-sm bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300 rounded-lg transition-all flex items-center gap-1.5"
                  title="Resetear contraseña"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"/>
                  </svg>
                  Reset
                </button>
                <button
                  @click="confirmDelete(tenant.id)"
                  class="px-3 py-1.5 text-sm bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-lg transition-all flex items-center gap-1.5"
                  title="Eliminar empresa"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>

            <!-- Compact Info Line -->
            <div class="ml-11 text-sm text-gray-400">
              <a
                :href="getTenantUrl(tenant.id)"
                target="_blank"
                class="text-blue-300 hover:text-blue-200 font-mono break-all"
              >
                {{ getTenantUrl(tenant.id) }}
              </a>
              <button
                @click="copyToClipboard(getTenantUrl(tenant.id))"
                class="ml-2 text-gray-500 hover:text-gray-300 transition-colors"
                title="Copiar URL"
              >
                <svg class="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM15 7a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM4.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Delete Selected Button -->
        <div v-if="selectedTenants.size > 0" class="px-6 py-4 border-t border-gray-700/50 bg-gray-900/40 flex items-center justify-between">
          <div class="text-sm text-gray-300">
            {{ selectedTenants.size }} empresa(s) seleccionada(s)
          </div>
          <div class="flex gap-2">
            <button
              @click="clearSelection"
              class="px-3 py-2 text-sm bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            >
              Limpiar Selección
            </button>
            <button
              @click="confirmDeleteMultiple"
              class="px-3 py-2 text-sm bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-lg transition-all flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              Eliminar {{ selectedTenants.size }} Empresa(s)
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Delete Multiple Confirmation Modal -->
    <div v-if="deleteMultipleModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md border border-red-600/30 shadow-xl">
        <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          Confirmar Eliminación Múltiple
        </h3>
        <p class="text-gray-400 mb-4">
          ¿Estás seguro de eliminar <strong class="text-red-300">{{ selectedTenants.size }} empresa(s)</strong>?
        </p>
        <div class="bg-gray-900/40 rounded-lg p-3 mb-4 max-h-48 overflow-y-auto">
          <div class="text-sm text-gray-300 space-y-1">
            <div v-for="tenantId of selectedTenants" :key="tenantId" class="text-gray-400">
              • {{ tenantId }}
            </div>
          </div>
        </div>
        <p class="text-sm text-red-300/70 mb-6">Esta acción eliminará todos los datos, usuarios y configuración asociados.</p>
        <div class="flex gap-3 justify-end">
          <button
            @click="deleteMultipleModal.show = false"
            class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleDeleteMultiple"
            :disabled="deletingMultiple"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg v-if="!deletingMultiple" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ deletingMultiple ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Create Tenant Modal -->
    <div v-if="createModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700/50 shadow-xl">
        <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.5H9a1 1 0 100 2h2a1 1 0 100-2h-1V7z" clip-rule="evenodd"/>
          </svg>
          Confirmar Creación
        </h3>
        
        <p class="text-gray-400 text-sm mb-6">
          La empresa <strong class="text-white">{{ newTenantId }}</strong> se creará con los siguientes datos:
        </p>

        <div class="space-y-3 mb-6 bg-gray-700/30 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <span class="text-gray-400">Admin Email:</span>
            <span class="text-white font-mono text-sm">admin@sims.com</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-400">Contraseña:</span>
            <span class="text-gray-400 font-mono text-sm">(defecto del sistema)</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-400">URL:</span>
            <span class="text-blue-300 font-mono text-xs truncate max-w-xs">{{ getTenantUrl(newTenantId) }}</span>
          </div>
        </div>

        <p class="text-xs text-gray-500 mb-4">Los detalles de acceso se mostrarán una vez creada.</p>

        <div class="flex gap-3 justify-end">
          <button
            @click="createModal.show = false"
            class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleCreateTenant"
            :disabled="creating"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg v-if="!creating" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.5H9a1 1 0 100 2h2a1 1 0 100-2h-1V7z" clip-rule="evenodd"/>
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ creating ? 'Creando...' : 'Crear Empresa' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="successModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-xl p-6 w-full max-w-md border border-green-500/30 shadow-xl">
        <h3 class="text-lg font-semibold text-green-300 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          ¡Éxito!
        </h3>
        
        <p class="text-gray-300 text-sm mb-4">
          La empresa <strong class="text-white">{{ successModal.tenantId }}</strong> ha sido creada.
        </p>

        <div class="space-y-3 mb-6 bg-gray-900/40 p-4 rounded-lg">
          <div>
            <div class="text-xs text-gray-400 mb-1">URL de Acceso:</div>
            <div class="flex items-center gap-2">
              <input
                type="text"
                :value="getTenantUrl(successModal.tenantId)"
                readonly
                class="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded text-white text-sm font-mono"
              />
              <button
                @click="copyToClipboard(getTenantUrl(successModal.tenantId))"
                class="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 rounded transition-colors"
                title="Copiar URL"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM15 7a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM4.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <button
          @click="successModal.show = false; newTenantId = ''"
          class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>

    <!-- Info Modal -->
    <div v-if="infoModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700/50 shadow-xl">
        <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 100 2v3a1 1 0 100-2V9z" clip-rule="evenodd"/>
          </svg>
          Detalles - {{ infoModal.tenantId }}
        </h3>
        
        <div class="space-y-3 mb-6">
          <div class="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
            <span class="text-gray-300">ID Empresa:</span>
            <span class="text-white font-mono text-sm">{{ infoModal.tenantId }}</span>
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
            <span class="text-green-300 font-semibold flex items-center gap-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Activo
            </span>
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
        <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"/>
          </svg>
          Resetear Contraseña
        </h3>
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
          <div class="text-green-300 text-sm font-medium flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            Nueva contraseña:
          </div>
          <div class="text-white font-mono text-lg mt-2 bg-gray-900/50 p-2 rounded text-center">{{ passwordModal.result }}</div>
          <button
            @click="copyToClipboard(passwordModal.result)"
            class="mt-2 w-full text-sm text-gray-300 hover:text-white py-1 flex items-center justify-center gap-1"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM15 7a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM4.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
            </svg>
            Copiar
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
            class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg v-if="!resetting" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"/>
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ resetting ? 'Reseteando...' : 'Resetear' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md border border-red-600/30 shadow-xl">
        <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          Confirmar Eliminación
        </h3>
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
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
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
const deletingMultiple = ref(false)
const newTenantId = ref('')
const searchQuery = ref('')
const selectAll = ref(false)
const selectedTenants = ref(new Set<string>())

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

const deleteMultipleModal = reactive({
  show: false
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

const createModal = reactive({
  show: false
})

const successModal = reactive({
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
    // Show toast notification (optional)
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

const showCreateModal = () => {
  if (!newTenantId.value) {
    alert('Por favor ingresa un ID para la empresa')
    return
  }
  createModal.show = true
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
    successModal.tenantId = cleanId
    createModal.show = false
    successModal.show = true
    await fetchTenants()
  } catch (e: any) {
    alert('❌ Error al crear: ' + (e.response?.data?.message || e.message))
    createModal.show = false
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
    await fetchTenants()
  } catch (e) {
    alert('Error al eliminar tenant')
  }
}

const toggleTenantSelect = (tenantId: string) => {
  if (selectedTenants.value.has(tenantId)) {
    selectedTenants.value.delete(tenantId)
  } else {
    selectedTenants.value.add(tenantId)
  }
  updateSelectAll()
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedTenants.value.clear()
    filteredTenants.value.forEach(t => selectedTenants.value.add(t.id))
  } else {
    selectedTenants.value.clear()
  }
}

const updateSelectAll = () => {
  selectAll.value = filteredTenants.value.length > 0 && 
                    filteredTenants.value.every(t => selectedTenants.value.has(t.id))
}

const clearSelection = () => {
  selectedTenants.value.clear()
  selectAll.value = false
}

const confirmDeleteMultiple = () => {
  deleteMultipleModal.show = true
}

const handleDeleteMultiple = async () => {
  deletingMultiple.value = true
  try {
    const tenantIds = Array.from(selectedTenants.value)
    for (const tenantId of tenantIds) {
      await deleteTenant(tenantId)
    }
    deleteMultipleModal.show = false
    selectedTenants.value.clear()
    selectAll.value = false
    await fetchTenants()
  } catch (e) {
    alert('Error al eliminar tenants')
  } finally {
    deletingMultiple.value = false
  }
}

onMounted(() => {
  fetchTenants()
})
</script>
