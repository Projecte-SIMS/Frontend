<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header Profesional -->
    <PageHeading
      title="Directorio de Usuarios"
      description="Administración de accesos, roles y perfiles del ecosistema"
    >
      <template #actions>
        <router-link
          to="/admin/users/create"
          class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
        >
          <PlusIcon class="size-4" />
          Registrar Usuario
        </router-link>
      </template>
    </PageHeading>

    <!-- Barra de Búsqueda y Filtros -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="relative flex-1 max-w-xl">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <span class="material-icons text-lg">search</span>
        </span>
        <input
          v-model="filters.search"
          @input="handleSearch"
          type="text"
          placeholder="BUSCAR POR NOMBRE, EMAIL O USERNAME..."
          class="block w-full rounded-xl border-0 bg-slate-50 dark:bg-slate-950 pl-11 pr-4 py-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 text-[10px] font-bold uppercase tracking-widest transition-all"
        />
      </div>
      <div class="flex items-center gap-3">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {{ pagination.total }} registros encontrados
        </span>
      </div>
    </div>

    <!-- Estado de Carga -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sincronizando directorio...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="p-8 text-center rounded-2xl bg-rose-50 border border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/20">
      <p class="text-xs font-bold text-rose-600 uppercase tracking-widest">{{ error }}</p>
    </div>

    <!-- Tabla Maestra -->
    <div v-else class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th class="px-6 py-5">Identidad</th>
              <th class="px-6 py-5">Contacto</th>
              <th class="px-6 py-5 text-center">Rol Asignado</th>
              <th class="px-6 py-5 text-center">Estado</th>
              <th class="px-6 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-500 flex items-center justify-center text-[10px] font-black shadow-inner border border-white/50 dark:border-slate-700">
                    {{ getInitials(user.name) }}
                  </div>
                  <div>
                    <div class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ user.name }}</div>
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">@{{ user.username || 'sin-username' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-xs font-medium text-slate-600 dark:text-slate-400">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 text-center">
                <span 
                  v-if="user?.roles && user.roles.length > 0" 
                  class="inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800"
                >
                  {{ user?.roles?.[0]?.name }}
                </span>
                <span v-else class="text-[10px] font-black text-slate-300 uppercase">Sin Rol</span>
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  :class="[
                    'inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border',
                    user.active 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' 
                      : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  ]"
                >
                  {{ user.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end items-center gap-1">
                  <button
                    @click="navigateToDetail(user)"
                    class="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                    title="Detalles"
                  >
                    <span class="material-icons text-xl">visibility</span>
                  </button>
                  <button
                    v-if="isCurrentUserAdmin"
                    @click="navigateToEdit(user)"
                    class="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
                    title="Editar"
                  >
                    <span class="material-icons text-xl">edit</span>
                  </button>
                  <button
                    v-if="isCurrentUserAdmin"
                    @click="openDeleteModal(user)"
                    class="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                    title="Eliminar"
                  >
                    <span class="material-icons text-xl">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="users.length === 0" class="py-20 text-center">
          <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
            <span class="material-icons text-3xl text-slate-200">person_off</span>
          </div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">No se encontraron usuarios</p>
        </div>
      </div>
    </div>

    <!-- Paginación Profesional -->
    <div class="mt-6">
      <AdminPagination
        v-if="pagination.total > 0"
        :page="pagination.current_page"
        :per-page="pagination.per_page"
        :total="pagination.total"
        @update:page="handlePageChange"
      />
    </div>

    <!-- Modales -->
    <UserDeleteModal
      v-if="userToDelete"
      :user="userToDelete"
      @confirmed="handleDeleteConfirmed"
      @cancel="userToDelete = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useUsers } from '../composables/useUsers'
import type { User, UserFilters } from '../interfaces/user.interface'
import AdminPagination from '@/modules/admin/components/AdminPagination.vue'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import UserDeleteModal from '../components/UserDeleteModal.vue'

const router = useRouter()
const { users, loading, error, pagination, getUsers, isCurrentUserAdmin } = useUsers()

const getInitials = (name?: string) =>
  name
    ? name.split(' ').map((x) => x[0]).join('').substring(0, 2).toUpperCase()
    : '??'

const filters = ref<UserFilters>({ search: '' })
const userToDelete = ref<User | null>(null)
let searchTimeout: any = null

onMounted(() => loadUsers())

const loadUsers = () => getUsers(pagination.value.current_page, filters.value)

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.current_page = 1
    loadUsers()
  }, 500)
}

const handlePageChange = (page: number) => {
  pagination.value.current_page = page
  loadUsers()
}

const navigateToDetail = (user: User) => router.push(`/admin/users/${user.id}`)
const navigateToEdit = (user: User) => router.push(`/admin/users/${user.id}/edit`)
const openDeleteModal = (user: User) => { userToDelete.value = user }

const handleDeleteConfirmed = () => {
  userToDelete.value = null
  loadUsers()
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
