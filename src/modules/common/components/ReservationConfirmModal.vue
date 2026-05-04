<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog class="relative z-[100]" @close="close">
      <TransitionChild as="template" enter="transition-opacity ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-950/90 backdrop-blur-xl transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto font-sans">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <TransitionChild as="template" enter="transition ease-out duration-300 transform" enter-from="translate-y-8 opacity-0 scale-95" enter-to="translate-y-0 opacity-100 scale-100" leave="transition ease-in duration-200 transform" leave-from="translate-y-0 opacity-100 scale-100" leave-to="translate-y-8 opacity-0 scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-[3rem] bg-white dark:bg-gray-900 px-6 pt-10 pb-8 text-left shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] transition-all sm:my-8 sm:w-full sm:max-w-md border border-gray-100 dark:border-gray-800">
              
              <!-- Decoration Glow -->
              <div class="absolute -top-32 -right-32 size-64 rounded-full bg-brand-primary-500/15 blur-3xl"></div>
              
              <div class="relative text-center">
                <!-- Icono principal -->
                <div class="mx-auto flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-brand-primary-50 dark:bg-brand-primary-900/20 text-brand-primary-600 dark:text-brand-primary-400 mb-8 shadow-inner border border-brand-primary-100 dark:border-brand-primary-800/30 group">
                  <CalendarDaysIcon class="h-12 w-12 group-hover:scale-110 transition-transform duration-500" aria-hidden="true" />
                </div>
                
                <DialogTitle as="h3" class="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-none">Confirmar Reserva</DialogTitle>
                
                <div class="mt-6 px-4">
                  <p class="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    Estás a punto de vincular este vehículo a tu cuenta. El sistema te otorgará acceso exclusivo durante los próximos <span class="font-bold text-brand-primary-600 dark:text-brand-primary-400">10 minutos</span>.
                  </p>
                </div>

                <!-- Info Card -->
                <div v-if="vehicle" class="mt-8 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700/50 flex items-center gap-5 shadow-inner text-left">
                  <div class="size-20 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
                    <img :src="getVehicleImage(vehicle.brand, vehicle.model)" class="size-full object-cover" />
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-lg font-black text-gray-900 dark:text-white truncate tracking-tight">{{ vehicle.brand }} {{ vehicle.model }}</h4>
                    <p class="text-brand-primary-600 dark:text-brand-primary-400 font-mono font-black text-xs uppercase tracking-tighter">{{ vehicle.license_plate || vehicle.plate }}</p>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/30">0.15€ / Min</span>
                    </div>
                  </div>
                </div>

                <!-- Warning Bullet Points -->
                <div class="mt-8 space-y-3 text-left px-2">
                  <div class="flex items-start gap-3">
                    <div class="size-1.5 rounded-full bg-brand-primary-500 mt-1.5 shrink-0"></div>
                    <p class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Reserva garantizada por 10 minutos</p>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="size-1.5 rounded-full bg-brand-primary-500 mt-1.5 shrink-0"></div>
                    <p class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Vínculo de telemetría directo con la App</p>
                  </div>
                </div>

                <!-- Botones de Acción -->
                <div class="mt-10 flex flex-col gap-3">
                  <button
                    type="button"
                    :disabled="loading"
                    class="w-full inline-flex justify-center items-center gap-3 rounded-[1.5rem] bg-brand-primary-600 px-6 py-5 text-xs font-black uppercase tracking-[0.25em] text-white hover:bg-brand-primary-700 shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] active:scale-95 transition-all disabled:opacity-50"
                    @click="confirm"
                  >
                    <ArrowPathIcon v-if="loading" class="size-5 animate-spin" />
                    Solicitar Reserva
                  </button>
                  <button
                    type="button"
                    class="w-full inline-flex justify-center rounded-[1.5rem] bg-gray-50 dark:bg-gray-800 px-6 py-5 text-xs font-black uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-750 transition-all active:scale-95 border border-gray-100 dark:border-gray-700"
                    @click="close"
                  >
                    Volver al mapa
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { 
  Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot 
} from '@headlessui/vue'
import { 
  CalendarDaysIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'
import { getVehicleImage } from '@/modules/common/utils/vehicleImages'

defineProps<{
  isOpen: boolean
  vehicle: any
  loading?: boolean
}>()

const emit = defineEmits(['close', 'confirm'])

const close = () => emit('close')
const confirm = () => emit('confirm')
</script>
