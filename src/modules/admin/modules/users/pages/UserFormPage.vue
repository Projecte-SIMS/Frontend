<template>
  <div class="space-y-8 animate-fade-in">
    <PageHeading
      :title="isEditMode ? 'Editar Usuario' : 'Crear Usuario'"
      :description="isEditMode ? 'Actualiza los datos del usuario.' : 'Crea un nuevo usuario.'"
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
          <span>Volver</span>
        </router-link>
      </template>
    </PageHeading>

    <div
      v-if="loading && isEditMode"
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center"
    >
      <p class="text-slate-500 dark:text-slate-400">Cargando datos del usuario...</p>
    </div>

    <div
      v-else
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <form @submit.prevent="handleSubmit">
        <div class="p-8 space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Nombre completo">
              <FormInput v-model="formData.name" type="text" placeholder="Nombre completo" required />
            </FormField>
            <FormField label="Nombre de usuario">
              <FormInput v-model="formData.username" type="text" placeholder="Nombre de usuario" required />
            </FormField>
            <FormField label="Correo electrónico">
              <FormInput v-model="formData.email" type="email" placeholder="correo@ejemplo.com" required />
            </FormField>
            <FormField :label="isEditMode ? 'Contraseña (opcional)' : 'Contraseña'">
              <FormInput
                v-model="formData.password"
                type="password"
                :placeholder="isEditMode ? 'Deja en blanco para mantener la actual' : 'Contraseña'"
                :required="!isEditMode"
              />
            </FormField>

            <FormField v-if="isCurrentUserAdmin" label="Rol">
              <FormSelect v-model="formData.role_id" :options="roleOptions" placeholder="Seleccionar rol" />
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Los administradores pueden asignar roles a los usuarios.
              </p>
            </FormField>
            <FormField label="Estado">
              <FormCheckbox v-model="formData.active" label="Usuario está activo" />
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
            <span>Cancelar</span>
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
            <span>{{ isSaving ? 'Guardando...' : 'Guardar' }}</span>
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
  { label: 'Cliente', value: '1' },
  { label: 'Administrador', value: '2' }
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
      toast.error('Error al cargar los datos del usuario.')
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
      toast.success('Usuario actualizado correctamente.')
    } else {
      await createUser(submitData as UserForm)
      toast.success('Usuario creado correctamente.')
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push('/admin/users')
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Ocurrió un error.'
    toast.error(errorMessage)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
