<template>
  <div class="space-y-8 animate-fade-in">
    <PageHeading
      v-if="currentRole"
      :title="`${currentRole.name} Role Details`"
      description="View full information and assigned permissions for this role."
    >
      <template #actions>
        <router-link
          to="/admin/roles"
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
          <span>Back to Roles</span>
        </router-link>
      </template>
    </PageHeading>

    <div
      v-if="loading"
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center"
    >
      <p class="text-slate-500 dark:text-slate-400">Loading role details...</p>
    </div>

    <div
      v-else-if="error"
      class="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800/20 shadow-sm p-6"
    >
      <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <div
      v-else-if="currentRole"
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div class="p-8">
        <dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Role Name</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ currentRole.name }}</dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Permissions</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ currentRole.permissions?.length || 0 }}
            </dd>
          </div>
        </dl>
      </div>

      <div class="border-t border-slate-200 dark:border-slate-800 p-8">
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Assigned Permissions</h4>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead class="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Module
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  View
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Manage
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Delete
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
              <tr v-for="module in permissionModules" :key="module.module">
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                >
                  {{ module.module }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    v-if="module.view && hasPermission(module.view.id)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    ✓
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    v-if="module.manage && hasPermission(module.manage.id)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    ✓
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    v-if="module.delete && hasPermission(module.delete.id)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    ✓
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        class="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/50 px-8 py-4 flex items-center justify-end gap-3 rounded-b-2xl"
      >
        <router-link
          :to="`/admin/roles/${currentRole.id}/edit`"
          v-if="currentRole.name.toLowerCase() !== 'admin'"
          class="flex items-center space-x-2 bg-indigo-600 text-white hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl"
        >
          <span>Edit Role</span>
        </router-link>
        <button
          v-if="currentRole.name.toLowerCase() !== 'admin'"
          @click="openDeleteModal"
          class="flex items-center space-x-2 bg-red-600 text-white hover:bg-red-700 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl"
        >
          <span>Delete Role</span>
        </button>
        <span v-else class="text-slate-500 text-sm italic">System role - cannot be edited or deleted.</span>
      </div>
    </div>

    <RoleDeleteModal
      v-if="showDeleteModal && currentRole"
      :role="currentRole"
      @confirmed="handleDeleteConfirmed"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import RoleDeleteModal from '../components/RoleDeleteModal.vue'
import { useRoles } from '../composables/useRoles'
import { usePermissions } from '../composables/usePermissions'

const router = useRouter()
const route = useRoute()
const { currentRole, loading, error, getRole } = useRoles()
const { permissionModules, getPermissions } = usePermissions()

const showDeleteModal = ref(false)
const rolePermissionIds = computed(() => currentRole.value?.permissions?.map((p) => p.id) || [])

const hasPermission = (permissionId: number) => {
  return rolePermissionIds.value.includes(permissionId)
}

const openDeleteModal = () => {
  showDeleteModal.value = true
}

const handleDeleteConfirmed = async () => {
  showDeleteModal.value = false
  router.push('/admin/roles')
}

onMounted(async () => {
  const roleId = Number(route.params.id)
  await getRole(roleId)
  await getPermissions()
})
</script>
