<template>
  <div class="space-y-8 animate-fade-in">
    <PageHeading title="Editar Vehículo" description="Actualiza los detalles del vehículo.">
      <template #actions>
        <router-link
          to="/admin/vehicles"
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
      v-if="loadingVehicle"
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center"
    >
      <p class="text-slate-500 dark:text-slate-400">Cargando datos del vehículo...</p>
    </div>

    <div
      v-else
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <form @submit.prevent="handleSubmit">
        <div class="p-8 space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Matrícula" :error="errors.license_plate">
              <FormInput
                v-model="form.license_plate"
                placeholder="1234ABC"
                @input="validateField('license_plate')"
              />
            </FormField>

            <FormField label="Marca" :error="errors.brand">
              <FormInput v-model="form.brand" placeholder="p. ej., Toyota" @input="validateField('brand')" />
            </FormField>

            <FormField label="Modelo" :error="errors.model">
              <FormInput v-model="form.model" placeholder="p. ej., Corolla" @input="validateField('model')" />
            </FormField>

            <FormField label="Estado">
              <FormCheckbox v-model="form.active" label="Vehículo está activo" />
            </FormField>
          </div>
          <p v-if="error" class="mt-4 text-sm text-red-500">{{ error }}</p>
        </div>

        <div
          class="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/50 px-8 py-4 flex items-center justify-end gap-3 rounded-b-2xl"
        >
          <router-link
            :to="`/admin/vehicles/${vehicleId}`"
            class="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl"
          >
            <span>Cancelar</span>
          </router-link>
          <button
            type="submit"
            :disabled="loading"
            class="flex items-center space-x-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl"
          >
            <svg
              v-if="loading"
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
            <span>{{ loading ? 'Guardando...' : 'Guardar Cambios' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVehicles } from '../composables/useVehicles'
import type { VehicleForm } from '../interfaces/vehicle.interface'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import FormInput from '@/modules/admin/components/FormInput.vue'
import FormCheckbox from '@/modules/admin/components/FormCheckbox.vue'
import { getVehicleImage } from '@/modules/common/utils/vehicleImages'

const route = useRoute()
const router = useRouter()
const { getVehicle, updateVehicle, loading, error } = useVehicles()

const loadingVehicle = ref(true)
const vehicleId = Number(route.params.id)

const form = reactive<VehicleForm>({
  license_plate: '',
  brand: '',
  model: '',
  active: true
})

const errors = reactive<Record<string, string | null>>({
  license_plate: null,
  brand: null,
  model: null
})

const validateField = (field: keyof typeof errors) => {
  errors[field] = null
}

onMounted(async () => {
  try {
    const vehicle = await getVehicle(vehicleId)
    form.license_plate = vehicle.license_plate
    form.brand = vehicle.brand || ''
    form.model = vehicle.model || ''
    form.active = vehicle.active
  } catch {
    router.push('/admin/vehicles')
  } finally {
    loadingVehicle.value = false
  }
})

function validate(): boolean {
  let isValid = true
  errors.license_plate = null
  errors.brand = null
  errors.model = null

  if (!form.license_plate.trim()) {
    errors.license_plate = 'La matrícula es obligatoria.'
    isValid = false
  } else {
    const licensePlatePattern = /^\d{4}\s?[A-Z]{3}$/i
    if (!licensePlatePattern.test(form.license_plate.trim())) {
      errors.license_plate = 'Formato inválido. Usa: 1234ABC.'
      isValid = false
    }
  }

  if (!form.brand.trim()) {
    errors.brand = 'La marca es obligatoria.'
    isValid = false
  }
  if (!form.model.trim()) {
    errors.model = 'El modelo es obligatorio.'
    isValid = false
  }
  return isValid
}

async function handleSubmit() {
  if (!validate()) return

  try {
    await updateVehicle(vehicleId, { ...form })
    router.push(`/admin/vehicles/${vehicleId}`)
  } catch (err: any) {
    if (err.response?.status === 422 && err.response.data.errors) {
      const backendErrors = err.response.data.errors
      for (const key of Object.keys(backendErrors)) {
        if (key in errors) {
          errors[key] = backendErrors[key][0]
        }
      }
    }
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
