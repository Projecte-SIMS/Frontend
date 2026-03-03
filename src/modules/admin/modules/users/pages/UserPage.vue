<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <PageHeading
      title="Usuarios"
      description="Gestión de usuarios del sistema"
    >
      <template #actions>
        <router-link
          to="/admin/users/create"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Añadir usuario
        </router-link>
      </template>
    </PageHeading>

    <!-- Filters and Stats -->
    <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <input
        v-model="filters.search"
        @input="handleSearch"
        type="text"
        placeholder="Buscar por nombre, email o usuario..."
        class="block w-full max-w-md rounded-lg border-0 px-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
      />
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ pagination.total }} usuarios
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="mt-8 text-center text-gray-500 dark:text-gray-400">
      Cargando usuarios...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="mt-8 text-center text-red-500">
      {{ error }}
    </div>

    <!-- Table -->
    <AdminsTable
      v-else
      :columns="columns"
      :empty="!users"
    >
      <template #empty>
        No hay usuarios disponibles
      </template>

      <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <AdminTd first variant="muted">
          {{ user.id }}
        </AdminTd>
        <AdminTd variant="primary">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center text-sm font-semibold">
              {{ getInitials(user.name) }}
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">@{{ user.username || '-' }}</div>
            </div>
          </div>
        </AdminTd>
        <AdminTd variant="muted">
          {{ user.email }}
        </AdminTd>
        <AdminTd variant="muted">
          <span 
            v-if="user?.roles && user.roles.length > 0" 
            class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
          >
            {{ user?.roles?.[0]?.name || '' }}
          </span>
          <span v-else class="text-gray-400">-</span>
        </AdminTd>
        <AdminTd variant="muted">
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
              user.active 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            ]"
          >
            {{ user.active ? 'Activo' : 'Inactivo' }}
          </span>
        </AdminTd>
        <AdminTd variant="actions">
          <div class="flex gap-2">
            <button
              v-if="isCurrentUserAdmin"
              class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              @click="navigateToDetail(user)"
              title="Ver"
            >
              <span class="material-icons text-xl">visibility</span>
              <span class="sr-only">Ver, {{ user.name }}</span>
            </button>
            <button
              v-if="isCurrentUserAdmin"
              class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
              @click="navigateToEdit(user)"
              title="Editar"
            >
              <span class="material-icons text-xl">edit</span>
              <span class="sr-only">Editar, {{ user.name }}</span>
            </button>
            <button
              v-if="isCurrentUserAdmin"
              class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              @click="openDeleteModal(user)"
              title="Eliminar"
            >
              <span class="material-icons text-xl">delete</span>
              <span class="sr-only">Eliminar, {{ user.name }}</span>
            </button>
          </div>
        </AdminTd>
      </tr>
    </AdminsTable>

    <!-- Pagination -->
    <AdminPagination
      v-if="pagination.total > 0"
      :page="pagination.current_page"
      :per-page="pagination.per_page"
      :total="pagination.total"
      @update:page="handlePageChange"
    />

    <!-- Delete Modal -->
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
import { useUsers } from '../composables/useUsers'
import { useToast } from '@/modules/common/composables/useToast'
import type { User, UserFilters } from '../interfaces/user.interface'
import AdminsTable from '@/modules/admin/components/AdminsTable.vue'
import AdminTd from '@/modules/admin/components/AdminTd.vue'
import AdminPagination from '@/modules/admin/components/AdminPagination.vue'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import UserDeleteModal from '../components/UserDeleteModal.vue'

const router = useRouter()
const { users, loading, error, pagination, getUsers, isCurrentUserAdmin } = useUsers()
const toast = useToast()

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Usuario' },
  { key: 'email', label: 'Email' },
  { key: 'roles', label: 'Rol' },
  { key: 'active', label: 'Estado' },
  { key: 'actions', label: 'Acciones', srOnly: true }
]

const getInitials = (name?: string) =>
  name
    ? name
        .split(' ')
        .map((x) => x[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : '??'

const filters = ref<UserFilters>({
  search: ''
})

const userToDelete = ref<User | null>(null)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  loadUsers()
})

const loadUsers = () => {
  getUsers(pagination.value.current_page, filters.value)
}

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

const navigateToDetail = (user: User) => {
  router.push(`/admin/users/${user.id}`)
}

const navigateToEdit = (user: User) => {
  router.push(`/admin/users/${user.id}/edit`)
}

const openDeleteModal = (user: User) => {
  userToDelete.value = user
}

const handleDeleteConfirmed = () => {
  userToDelete.value = null
  loadUsers()
}
</script>
