<template>
  <div class="space-y-8 animate-fade-in">
    <PageHeading title="User Details" description="View user details.">
      <template #actions>
        <router-link
          to="/admin/users"
          class="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>Back</span>
        </router-link>
      </template>
    </PageHeading>

    <div
      v-if="loading"
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center"
    >
      <p class="text-slate-500 dark:text-slate-400">Loading user...</p>
    </div>

    <div
      v-else-if="error"
      class="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800/20 shadow-sm p-6"
    >
      <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <div
      v-else-if="user"
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div class="p-8">
        <dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Full name</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ user.name }}</dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Username</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ user.username || '-' }}</dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ user.email }}</dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Role</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              <span
                v-if="user?.roles && user.roles.length > 0"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="
                  user.roles[0].name === 'Admin'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                "
              >
                {{ user.roles[0].name }}
              </span>
              <span v-else class="text-gray-400">-</span>
            </dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              <span
                :class="[
                  'inline-flex rounded-full px-2 py-1 text-xs font-semibold',
                  user.active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                ]"
              >
                {{ user.active ? 'Active' : 'Inactive' }}
              </span>
            </dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Created at</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(user.created_at) }}</dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Updated at</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(user.updated_at) }}</dd>
          </div>
        </dl>
      </div>

      <div
        v-if="isCurrentUserAdmin"
        class="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/50 px-8 py-4 flex items-center justify-end gap-3 rounded-b-2xl"
      >
        <router-link
          :to="`/admin/users/${user.id}/edit`"
          class="flex items-center space-x-2 bg-indigo-600 text-white hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            ></path>
          </svg>
          <span>Edit</span>
        </router-link>
        <button
          @click="openDeleteModal"
          class="flex items-center space-x-2 bg-red-600 text-white hover:bg-red-700 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </div>

    <!-- Delete Modal -->
    <UserDeleteModal
      v-if="showDeleteModal"
      :user="user!"
      @confirmed="handleDeleteConfirmed"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import { useUsers } from '../composables/useUsers'
import { useToast } from '@/modules/common/composables/useToast'
import type { User } from '../interfaces/user.interface'
import UserDeleteModal from '../components/UserDeleteModal.vue'

const router = useRouter()
const route = useRoute()
const { getUser, isCurrentUserAdmin } = useUsers()
const toast = useToast()

const user = ref<User | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const showDeleteModal = ref(false)

const userId = computed(() => Number(route.params.id))

onMounted(async () => {
  await loadUser()
})

const loadUser = async () => {
  loading.value = true
  error.value = null
  try {
    user.value = await getUser(userId.value)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error loading user'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openDeleteModal = () => {
  showDeleteModal.value = true
}

const handleDeleteConfirmed = async () => {
  showDeleteModal.value = false
  router.push('/admin/users')
}
</script>
