<template>
  <div class="space-y-8 animate-fade-in">
    <PageHeading
      :title="isEditMode ? 'Edit User' : 'Create User'"
      :description="isEditMode ? 'Update user details.' : 'Create a new user.'"
    >
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
      v-if="loading && isEditMode"
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center"
    >
      <p class="text-slate-500 dark:text-slate-400">Loading user data...</p>
    </div>

    <div
      v-else
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <form @submit.prevent="handleSubmit">
        <div class="p-8 space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Full name">
              <FormInput v-model="formData.name" type="text" placeholder="Full name" required />
            </FormField>
            <FormField label="Username">
              <FormInput v-model="formData.username" type="text" placeholder="Username" required />
            </FormField>
            <FormField label="Email">
              <FormInput v-model="formData.email" type="email" placeholder="email@example.com" required />
            </FormField>
            <FormField :label="isEditMode ? 'Password (optional)' : 'Password'">
              <FormInput
                v-model="formData.password"
                type="password"
                :placeholder="isEditMode ? 'Leave blank to keep current' : 'Password'"
                :required="!isEditMode"
              />
            </FormField>

            <FormField v-if="isCurrentUserAdmin" label="Role">
              <FormSelect v-model="formData.role_id" :options="roleOptions" placeholder="Select role" />
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Admins can assign roles to users.
              </p>
            </FormField>
            <FormField label="Status">
              <FormCheckbox v-model="formData.active" label="User is active" />
            </FormField>
          </div>
        </div>

        <div
          class="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/50 px-8 py-4 flex items-center justify-end gap-3 rounded-b-2xl"
        >
          <router-link
            to="/admin/users"
            class="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl"
          >
            <span>Cancel</span>
          </router-link>
          <button
            type="submit"
            :disabled="isSaving"
            class="flex items-center space-x-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl"
          >
            <svg
              v-if="isSaving"
              class="animate-spin h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            <span>{{ isSaving ? 'Saving...' : 'Save' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUsers } from '../composables/useUsers'
import { useToast } from '@/modules/common/composables/useToast'
import type { User, UserForm } from '../interfaces/user.interface'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import FormField from '@/modules/admin/components/FormField.vue'
import FormInput from '@/modules/admin/components/FormInput.vue'
import FormSelect from '@/modules/admin/components/FormSelect.vue'
import FormCheckbox from '@/modules/admin/components/FormCheckbox.vue'

const router = useRouter()
const route = useRoute()
const { getUser, createUser, updateUser, isCurrentUserAdmin, loading } = useUsers()
const toast = useToast()

const userId = computed(() => (route.params.id ? Number(route.params.id) : null))
const isEditMode = computed(() => !!userId.value)

const formData = reactive<Partial<UserForm>>({
  name: '',
  username: '',
  email: '',
  password: '',
  active: true,
  role_id: null
})

const isSaving = ref(false)

const roleOptions = [
  { label: 'Client', value: '1' },
  { label: 'Admin', value: '2' }
]

onMounted(async () => {
  if (isEditMode.value && userId.value) {
    try {
      const user = await getUser(userId.value)
      if (user) {
        formData.name = user.name || ''
        formData.username = user.username || ''
        formData.email = user.email || ''
        formData.active = user.active ?? true
        if (user.roles && user.roles.length > 0) {
          formData.role_id = user.roles[0].id
        }
      }
    } catch (err) {
      toast.error('Error loading user data.')
      router.push('/admin/users')
    }
  }
})

const handleSubmit = async () => {
  try {
    isSaving.value = true

    const submitData: Partial<UserForm> = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      active: formData.active,
      role_id: formData.role_id
    }

    if (formData.password) {
      submitData.password = formData.password
    }

    if (isEditMode.value && userId.value) {
      await updateUser(userId.value, submitData)
      toast.success('User updated successfully.')
    } else {
      await createUser(submitData as UserForm)
      toast.success('User created successfully.')
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push('/admin/users')
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'An error occurred.'
    toast.error(errorMessage)
  } finally {
    isSaving.value = false
  }
}
</script>
