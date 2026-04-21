<template>
  <div class="space-y-8 animate-fade-in pb-20">
    <!-- Header Profesional -->
    <PageHeading
      title="Configuración de Unidad"
      :description="`Gestionando ${form.brand} ${form.model} [${form.license_plate}]`"
    >
      <template #actions>
        <router-link
          to="/admin/vehicles"
          class="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <span class="material-icons text-base text-slate-400">arrow_back</span>
          Volver al Listado
        </router-link>
      </template>
    </PageHeading>

    <div
      v-if="loadingVehicle"
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-20 text-center flex flex-col items-center gap-4"
    >
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary-600"></div>
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando ficha de unidad...</p>
    </div>

    <div
      v-else
      class="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <!-- Lado Izquierdo: Formulario de Edición -->
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div class="size-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 shadow-inner">
              <img 
                v-if="form.brand"
                :src="getVehicleImage(form.brand, form.model)" 
                :alt="form.brand"
                class="h-full w-full object-cover"
              />
              <span v-else class="material-icons text-3xl text-slate-300">directions_car</span>
            </div>
            <div class="text-left">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">Información Técnica</h3>
              <p class="text-sm text-slate-500 mt-1 font-medium">Especificaciones base del vehículo en el inventario.</p>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="p-8 space-y-8 text-left">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <FormField label="MATRÍCULA / LICENSE PLATE" :error="errors.license_plate">
                <input
                  v-model="form.license_plate"
                  type="text"
                  placeholder="1234ABC"
                  @input="validateField('license_plate')"
                  class="block w-full rounded-xl border-0 px-4 py-3 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-brand-primary-600 text-sm font-bold uppercase tracking-widest outline-none transition-all"
                />
              </FormField>

              <FormField label="MARCA" :error="errors.brand">
                <input
                  v-model="form.brand"
                  type="text"
                  placeholder="Toyota"
                  @input="validateField('brand')"
                  class="block w-full rounded-xl border-0 px-4 py-3 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-brand-primary-600 text-sm font-medium outline-none transition-all"
                />
              </FormField>

              <FormField label="MODELO" :error="errors.model">
                <input
                  v-model="form.model"
                  type="text"
                  placeholder="Yaris"
                  @input="validateField('model')"
                  class="block w-full rounded-xl border-0 px-4 py-3 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-brand-primary-600 text-sm font-medium outline-none transition-all"
                />
              </FormField>

              <FormField label="PRECIO POR MINUTO (€)" :error="errors.price_per_minute">
                <input
                  v-model.number="form.price_per_minute"
                  type="number"
                  step="0.01"
                  placeholder="0.15"
                  @input="validateField('price_per_minute')"
                  class="block w-full rounded-xl border-0 px-4 py-3 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-brand-primary-600 text-sm font-bold outline-none transition-all"
                />
              </FormField>

              <FormField label="ESTADO ADMIN">
                <div class="flex items-center gap-4 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <FormCheckbox v-model="form.active" />
                  <div class="text-left">
                    <p class="text-xs font-black uppercase tracking-tight" :class="form.active ? 'text-rose-600' : 'text-emerald-600'">
                      {{ form.active ? 'MANTENIMIENTO' : 'HABILITADO' }}
                    </p>
                    <p class="text-[10px] text-slate-400 font-medium leading-none mt-1">
                      {{ form.active ? 'No apto para reservas' : 'Visible para clientes' }}
                    </p>
                  </div>
                </div>
              </FormField>
            </div>

            <div class="flex items-center justify-end gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
              <router-link
                to="/admin/vehicles"
                class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                Cancelar
              </router-link>
              <button
                type="submit"
                :disabled="loading"
                class="inline-flex items-center gap-2 rounded-xl bg-brand-primary-600 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-brand-primary-200 dark:shadow-none hover:bg-brand-primary-700 transition-all active:scale-95 disabled:opacity-50"
              >
                <span v-if="loading" class="material-icons text-sm animate-spin">autorenew</span>
                <span>{{ loading ? 'Sincronizando...' : 'Actualizar Unidad' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Lado Derecho: IoT Status & Stats -->
      <div class="space-y-8">
        <!-- IoT Link Status Card -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">Enlace IoT</h3>
            <span 
              v-if="iotDevice" 
              class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border"
              :class="iotDevice.online ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'"
            >
              {{ iotDevice.online ? 'En Línea' : 'Desconectado' }}
            </span>
          </div>

          <div v-if="iotDevice" class="space-y-6">
            <div class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <div class="size-10 rounded-xl bg-brand-primary-50 dark:bg-brand-primary-900/30 text-brand-primary-600 flex items-center justify-center">
                <span class="material-icons">settings_remote</span>
              </div>
              <div class="text-left overflow-hidden">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hardware ID</p>
                <p class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 truncate">{{ iotDevice.id }}</p>
              </div>
            </div>

            <div v-if="iotDevice.telemetry" class="grid grid-cols-2 gap-4">
              <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-left">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Batería</p>
                <p class="text-sm font-black text-slate-900 dark:text-white tracking-tight">{{ iotDevice.telemetry.battery_voltage?.toFixed(1) }}V</p>
              </div>
              <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-left">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Velocidad</p>
                <p class="text-sm font-black text-slate-900 dark:text-white tracking-tight">{{ iotDevice.telemetry.speed?.toFixed(0) }} km/h</p>
              </div>
            </div>

            <div class="pt-4 flex flex-col gap-3">
              <router-link
                :to="`/admin/map?select=${vehicleId}`"
                class="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand-primary-50 dark:bg-brand-primary-900/20 text-brand-primary-600 dark:text-brand-primary-400 text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary-100 transition-all"
              >
                <span class="material-icons text-base">gps_fixed</span>
                Rastrear en Mapa
              </router-link>
              <button
                @click="refreshIoT"
                :disabled="refreshingIoT"
                class="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all disabled:opacity-50"
              >
                <span class="material-icons text-base" :class="{'animate-spin': refreshingIoT}">sync</span>
                Refrescar Telemetría
              </button>
            </div>
          </div>

          <div v-else class="text-center py-10 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <span class="material-icons text-slate-300 text-4xl mb-3">cloud_off</span>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 leading-relaxed">Sin dispositivo IoT vinculado o fuera de cobertura</p>
          </div>
        </div>

        <!-- Security Info Card -->
        <div class="p-6 bg-brand-primary-600 rounded-3xl text-white shadow-xl shadow-brand-primary-200 dark:shadow-none relative overflow-hidden text-left">
          <div class="relative z-10">
            <h4 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-4">Información de Sistema</h4>
            <div class="space-y-4 text-left">
              <div class="flex items-start gap-3">
                <span class="material-icons text-brand-primary-200 text-lg">security</span>
                <p class="text-xs font-medium leading-relaxed">
                  Los cambios en la matrícula se sincronizan automáticamente con el microservicio de geolocalización.
                </p>
              </div>
              <div class="flex items-start gap-3">
                <span class="material-icons text-brand-primary-200 text-lg">info</span>
                <p class="text-xs font-medium leading-relaxed">
                  Poner un vehículo en 'Mantenimiento' lo ocultará inmediatamente de las búsquedas de los clientes.
                </p>
              </div>
            </div>
          </div>
          <div class="absolute -right-4 -bottom-4 size-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVehicles } from '../composables/useVehicles'
import iotService, { type IoTDevice } from '@/services/iotService'
import type { VehicleForm } from '../interfaces/vehicle.interface'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import FormField from '@/modules/admin/components/FormField.vue'
import FormCheckbox from '@/modules/admin/components/FormCheckbox.vue'
import { getVehicleImage } from '@/modules/common/utils/vehicleImages'
import { useToast } from '@/modules/common/composables/useToast'

const route = useRoute()
const router = useRouter()
const { getVehicle, updateVehicle, loading } = useVehicles()
const toast = useToast()

const loadingVehicle = ref(true)
const refreshingIoT = ref(false)
const vehicleId = Number(route.params.id)
const iotDevice = ref<IoTDevice | null>(null)

const form = reactive<VehicleForm>({
  license_plate: '',
  brand: '',
  model: '',
  active: true,
  price_per_minute: 0.15
})

const errors = reactive<Record<string, string | null>>({
  license_plate: null,
  brand: null,
  model: null,
  price_per_minute: null
})

const validateField = (field: keyof typeof errors) => {
  errors[field] = null
}

const refreshIoT = async () => {
  if (!form.license_plate) return
  refreshingIoT.value = true
  try {
    const devices = await iotService.getDevices()
    const match = devices.find(d => d.license_plate === form.license_plate)
    if (match) {
      iotDevice.value = match
    } else {
      iotDevice.value = null
    }
  } catch (e) {
    console.error('Error fetching IoT status', e)
  } finally {
    refreshingIoT.value = false
  }
}

onMounted(async () => {
  try {
    const vehicle = await getVehicle(vehicleId)
    form.license_plate = vehicle.license_plate
    form.brand = vehicle.brand || ''
    form.model = vehicle.model || ''
    form.active = vehicle.active
    form.price_per_minute = vehicle.price_per_minute ?? 0.15
    
    // Una vez cargado el vehículo, buscamos su estado IoT
    await refreshIoT()
  } catch {
    toast.error('Error al cargar la información del vehículo')
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
  errors.price_per_minute = null

  if (!form.license_plate.trim()) {
    errors.license_plate = 'La matrícula es obligatoria.'
    isValid = false
  }

  if (!form.brand.trim()) {
    errors.brand = 'La marca es obligatoria.'
    isValid = false
  }
  if (!form.model.trim()) {
    errors.model = 'El modelo es obligatorio.'
    isValid = false
  }
  if (form.price_per_minute === null || form.price_per_minute === undefined || form.price_per_minute < 0) {
    errors.price_per_minute = 'El precio debe ser un número positivo.'
    isValid = false
  }
  return isValid
}

async function handleSubmit() {
  if (!validate()) return

  try {
    await updateVehicle(vehicleId, { ...form })
    toast.success('Vehículo actualizado correctamente')
    router.push('/admin/vehicles')
  } catch (err: any) {
    const msg = err.response?.data?.message || 'Error al guardar los cambios'
    toast.error(msg)
    
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
