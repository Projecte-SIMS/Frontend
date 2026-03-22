<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header Profesional -->
    <PageHeading
      :title="isEditMode ? 'Editar Rol' : 'Nuevo Rol'"
      description="Configuración de nombre y asignación de permisos"
    >
      <template #actions>
        <router-link
          to="/admin/roles"
          class="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <span class="material-icons text-base">arrow_back</span>
          Volver a Roles
        </router-link>
      </template>
    </PageHeading>

    <!-- Formulario Principal -->
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Nombre del Rol -->
      <div class="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Identificación del Rol</h3>
        <FormInput
          v-model="form.name"
          label="NOMBRE DEL ROL (EN MINÚSCULAS)"
          placeholder="ej. editor"
          required
          :disabled="isAdminRole"
          @invalid="validationErrors.name = 'Este campo es obligatorio.'"
          @input="validationErrors.name = ''"
        />
        <p v-if="validationErrors.name" class="mt-2 text-xs text-rose-600 dark:text-rose-400 font-medium">
          {{ validationErrors.name }}
        </p>
      </div>

      <!-- Tabla de Permisos -->
      <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="p-8 border-b border-slate-100 dark:border-slate-800">
          <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">Matriz de Permisos</h3>
          <p class="text-sm text-slate-500 mt-1 font-medium">Asigna qué acciones puede realizar este rol en cada módulo.</p>
        </div>

        <div v-if="permissionModules.length === 0" class="py-20 text-center">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargando módulos...</span>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th class="px-6 py-5 text-left">Módulo del Sistema</th>
                <th class="px-6 py-5 text-center">Ver</th>
                <th class="px-6 py-5 text-center">Gestionar</th>
                <th class="px-6 py-5 text-center">Eliminar</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr
                v-for="module in permissionModules"
                :key="module.module"
                class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
              >
                <td class="px-6 py-4 text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {{ module.module }}
                </td>
                <td class="px-6 py-4 text-center">
                  <PermissionCheckbox v-if="module.view" :permission="module.view" :is-admin-role="isAdminRole" v-model="form.permissions" />
                  <span v-else class="text-slate-200 dark:text-slate-700 font-black text-lg">-</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <PermissionCheckbox v-if="module.manage" :permission="module.manage" :is-admin-role="isAdminRole" v-model="form.permissions" />
                  <span v-else class="text-slate-200 dark:text-slate-700 font-black text-lg">-</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <PermissionCheckbox v-if="module.delete" :permission="module.delete" :is-admin-role="isAdminRole" v-model="form.permissions" />
                  <span v-else class="text-slate-200 dark:text-slate-700 font-black text-lg">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mensaje de Rol Protegido -->
      <div v-if="isAdminRole" class="mt-8 p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 size-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <span class="material-icons text-base">lock</span>
          </div>
          <div>
            <h4 class="text-sm font-black text-amber-800 dark:text-amber-300 uppercase tracking-tight">Rol de Administrador Protegido</h4>
            <p class="text-sm font-medium text-amber-700/80 dark:text-amber-400/80 mt-1">El rol 'admin' tiene todos los permisos asignados por defecto y no puede ser modificado para garantizar la seguridad del sistema.</p>
          </div>
        </div>
      </div>

      <!-- Acciones del Formulario -->
      <div class="flex gap-4 pt-4 mt-8 border-t border-slate-200 dark:border-slate-800">
        <router-link
          to="/admin/roles"
          class="flex-1 sm:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 text-center transition-all"
        >
          Cancelar
        </router-link>
        <button
          type="submit"
          :disabled="isSaving || isAdminRole"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          <span v-if="isSaving" class="material-icons text-sm animate-spin">autorenew</span>
          <span>{{ isSaving ? 'GUARDANDO...' : (isEditMode ? 'Guardar Cambios' : 'Crear Rol') }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import FormInput from '@/modules/admin/components/FormInput.vue'
import PermissionCheckbox from '../components/PermissionCheckbox.vue'
import { useRoles } from '../composables/useRoles'
import { usePermissions } from '../composables/usePermissions'
import type { RoleForm } from '../interfaces/role.interface'

const router = useRouter()
const route = useRoute()
const { currentRole, loading, getRole, createRole, updateRole, isAdminRole } = useRoles()
const { permissionModules, getPermissions } = usePermissions()

const isEditMode = computed(() => route.params.id !== undefined)

const form = reactive<RoleForm>({
  name: '',
  permissions: [],
})

const validationErrors = reactive({ name: '' })
const isSaving = ref(false)

const handleSubmit = async () => {
  if (!form.name.trim()) {
    validationErrors.name = 'El nombre del rol es obligatorio.'
    return
  }
  isSaving.value = true
  const success = isEditMode.value
    ? await updateRole(Number(route.params.id), form)
    : await createRole(form)
  
  isSaving.value = false
  if (success) {
    router.push('/admin/roles')
  }
}

onMounted(async () => {
  await getPermissions()
  if (isEditMode.value) {
    await getRole(Number(route.params.id))
    if (currentRole.value) {
      form.name = currentRole.value.name
      form.permissions = currentRole.value.permissions?.map((p) => p.id) || []
    } else {
      router.push('/admin/roles')
    }
  }
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
