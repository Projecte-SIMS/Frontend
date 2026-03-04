<template>
  <div v-if="loadingVehicle" class="flex items-center justify-center min-h-[400px]">
    <div class="text-center">
      <ArrowPathIcon class="size-12 animate-spin text-indigo-600 mx-auto mb-4" />
      <p class="text-gray-500 font-medium">Preparando editor...</p>
    </div>
  </div>

  <div v-else class="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12 font-sans px-4 sm:px-6 lg:px-8">
    <!-- Header with Breadcrumbs -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <nav class="flex mb-2" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-gray-400">
            <li><router-link to="/admin/vehicles" class="hover:text-indigo-600">Vehículos</router-link></li>
            <li><ChevronRightIcon class="size-3" /></li>
            <li><router-link :to="`/admin/vehicles/${vehicleId}`" class="hover:text-indigo-600">{{ form.license_plate }}</router-link></li>
            <li><ChevronRightIcon class="size-3" /></li>
            <li class="text-indigo-600">Edición</li>
          </ol>
        </nav>
        <h1 class="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
          Editar Vehículo
        </h1>
      </div>
      <router-link
        to="/admin/vehicles"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
      >
        <ArrowLeftIcon class="size-4" />
        Volver
      </router-link>
    </div>

    <div class="bg-white dark:bg-gray-900 rounded-[3rem] p-8 md:p-12 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
      <!-- Decoration -->
      <div class="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
        <PencilIcon class="size-40 text-gray-400" />
      </div>

      <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10">Parámetros de la Unidad</h3>

      <form @submit.prevent="handleSubmit" class="space-y-8 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <FormInput
              v-model="form.license_plate"
              label="Matrícula Oficial"
              placeholder="1234ABC"
              :error="errors.license_plate"
              class="custom-form-input"
            />

            <FormInput
              v-model="form.brand"
              label="Marca del Fabricante"
              placeholder="Ej: Toyota"
              :error="errors.brand"
            />

            <FormInput
              v-model="form.model"
              label="Modelo del Vehículo"
              placeholder="Ej: Corolla"
              :error="errors.model"
            />
          </div>

          <div class="space-y-6">
            <div class="p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
              <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Estado del Sistema</h4>
              <FormCheckbox
                v-model="form.active"
                label="Vehículo Ocupado / En Uso"
              />
              <p class="mt-2 text-[10px] text-gray-500 italic">
                * Si se marca como ocupado (True), el vehículo no estará disponible para nuevos clientes.
              </p>
            </div>
            
            <div class="p-6 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30">
               <h4 class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Previsualización</h4>
               <div class="flex items-center gap-4">
                 <div class="size-16 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-indigo-100 dark:border-indigo-800">
                    <img :src="getVehicleImage(form.brand, form.model)" class="size-full object-cover opacity-80" />
                 </div>
                 <div>
                   <p class="text-sm font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-tight">{{ form.brand || '---' }} {{ form.model || '---' }}</p>
                   <p class="text-[10px] font-bold text-indigo-400 font-mono">{{ form.license_plate || 'SIN MATRÍCULA' }}</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-4 pt-8 border-t border-gray-50 dark:border-gray-800">
          <router-link
            :to="`/admin/vehicles/${vehicleId}`"
            class="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-700 transition-all"
          >
            Cancelar
          </router-link>
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:grayscale"
          >
            <span v-if="loading" class="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ loading ? 'Sincronizando...' : 'Actualizar Unidad' }}
          </button>
        </div>

        <div v-if="error" class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 flex items-center gap-3">
          <ExclamationCircleIcon class="size-5 text-red-600" />
          <p class="text-xs font-bold text-red-700 dark:text-red-400">{{ error }}</p>
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
import FormInput from '@/modules/admin/components/FormInput.vue'
import FormCheckbox from '@/modules/admin/components/FormCheckbox.vue'
import { getVehicleImage } from '@/modules/common/utils/vehicleImages'
import {
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  PencilIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

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
  let valid = true
  errors.license_plate = null
  errors.brand = null
  errors.model = null

  if (!form.license_plate.trim()) {
    errors.license_plate = 'La matrícula es obligatoria'
    valid = false
  } else {
    const licensePlatePattern = /^\d{4}\s?[A-Z]{3}$/i
    if (!licensePlatePattern.test(form.license_plate.trim())) {
      errors.license_plate = 'Formato incorrecto (Ej: 1234ABC)'
      valid = false
    }
  }

  if (!form.brand.trim()) {
    errors.brand = 'La marca es obligatoria'
    valid = false
  }
  if (!form.model.trim()) {
    errors.model = 'El modelo es obligatorio'
    valid = false
  }
  return valid
}

async function handleSubmit() {
  if (!validate()) return

  try {
    await updateVehicle(vehicleId, { ...form })
    router.push(`/admin/vehicles/${vehicleId}`)
  } catch (err: any) {
    if (err.response?.status === 422) {
      const backendErrors = err.response.data.errors || {}
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
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
