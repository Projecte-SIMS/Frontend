<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header Profesional -->
    <PageHeading
      title="Gestión de Roles"
      description="Control de perfiles de acceso y asignación de permisos"
    >
      <template #actions>
        <router-link
          to="/admin/roles/create"
          class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
        >
          <PlusIcon class="size-4" />
          Añadir Rol
        </router-link>
      </template>
    </PageHeading>

    <!-- Barra de Herramientas -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="relative flex-1 max-w-md">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <span class="material-icons text-lg">search</span>
        </span>
        <input
          v-model="filters.search"
          @input="handleSearch"
          type="text"
          placeholder="BUSCAR POR NOMBRE DE ROL..."
          class="block w-full rounded-xl border-0 bg-slate-50 dark:bg-slate-950 pl-11 pr-4 py-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 text-[10px] font-bold uppercase tracking-widest transition-all"
        />
      </div>
      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {{ pagination.total }} roles en el sistema
      </span>
    </div>

    <!-- Estados -->
    <div v-if="loading" class="py-20 flex flex-col items-center gap-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600/30"></div>
      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargando roles...</span>
    </div>
    <div v-else-if="error" class="p-6 text-center rounded-2xl bg-rose-50 border border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/20">
      <p class="text-[10px] font-black text-rose-600 uppercase tracking-widest">{{ error }}</p>
    </div>

    <!-- Tabla Maestra de Roles -->
    <div v-else class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th class="px-6 py-5">Nombre del Rol</th>
              <th class="px-6 py-5 text-center">Permisos Asignados</th>
              <th class="px-6 py-5">Fecha de Creación</th>
              <th class="px-6 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="role in roles" :key="role.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-500 dark:from-indigo-900/30 dark:to-indigo-900/50 dark:text-indigo-400 shadow-inner border border-indigo-100/50 dark:border-indigo-800/50">
                    <span class="material-icons text-lg">shield</span>
                  </div>
                  <div>
                    <span class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ role.name }}</span>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {{ role.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                  {{ role.permissions?.length || 0 }} permisos activos
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs font-semibold text-slate-600 dark:text-slate-400">{{ formatDate(role.created_at) }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end items-center gap-1">
                  <button
                    class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                    @click="navigateToDetail(role)"
                    title="Ver Permisos"
                  >
                    <span class="material-icons text-xl">visibility</span>
                  </button>
                  <button
                    v-if="role.name.toLowerCase() !== 'admin'"
                    class="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                    @click="navigateToEdit(role)"
                    title="Editar Rol"
                  >
                    <span class="material-icons text-xl">edit</span>
                  </button>
                  <button
                    v-if="role.name.toLowerCase() !== 'admin'"
                    class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                    @click="openDeleteModal(role)"
                    title="Eliminar Rol"
                  >
                    <span class="material-icons text-xl">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginación -->
    <div class="mt-6" v-if="roles.length > 0">
      <AdminPagination
        :page="pagination.current_page"
        :per-page="pagination.per_page"
        :total="pagination.total"
        @update:page="handlePageChange"
      />
    </div>

    <!-- Modal de Eliminación -->
    <RoleDeleteModal
      v-if="roleToDelete"
      :role="roleToDelete"
      @confirmed="handleDeleteConfirmed"
      @cancel="roleToDelete = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PlusIcon } from '@heroicons/vue/24/outline'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import AdminPagination from '@/modules/admin/components/AdminPagination.vue'
import RoleDeleteModal from '../components/RoleDeleteModal.vue'
import { useRoles } from '../composables/useRoles'
import type { Role, RoleFilters } from '../interfaces/role.interface'

const router = useRouter()
const { roles, loading, error, pagination, getRoles } = useRoles()
const roleToDelete = ref<Role | null>(null)
const filters = ref<RoleFilters>({ search: '' })
let searchTimeout: any = null

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

const loadRoles = (page = 1) => {
  getRoles(page, filters.value)
}

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.current_page = 1
    loadRoles()
  }, 500)
}

const handlePageChange = (page: number) => {
  pagination.value.current_page = page
  loadRoles(page)
}

const navigateToDetail = (role: Role) => router.push(`/admin/roles/${role.id}`)
const navigateToEdit = (role: Role) => router.push(`/admin/roles/${role.id}/edit`)
const openDeleteModal = (role: Role) => { roleToDelete.value = role }

const handleDeleteConfirmed = () => {
  roleToDelete.value = null
  loadRoles()
}

onMounted(() => {
  loadRoles()
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
