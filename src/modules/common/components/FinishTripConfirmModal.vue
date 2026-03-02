<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog class="relative z-[100]" @close="close">
      <!-- Backdrop con desenfoque profundo -->
      <TransitionChild as="template" enter="transition-opacity ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-950/90 backdrop-blur-xl transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto font-sans">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <TransitionChild as="template" enter="transition ease-out duration-300 transform" enter-from="translate-y-8 opacity-0 scale-95" enter-to="translate-y-0 opacity-100 scale-100" leave="transition ease-in duration-200 transform" leave-from="translate-y-0 opacity-100 scale-100" leave-to="translate-y-8 opacity-0 scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-[3rem] bg-white dark:bg-gray-900 px-6 pt-10 pb-8 text-left shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] transition-all sm:my-8 sm:w-full sm:max-w-md border border-gray-100 dark:border-gray-800">
              
              <!-- Glow Effect -->
              <div class="absolute -top-32 -right-32 size-64 rounded-full bg-red-500/15 blur-3xl"></div>
              
              <div class="relative text-center">
                <!-- Icono animado -->
                <div class="mx-auto flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 mb-8 shadow-inner border border-red-100 dark:border-red-800/30 group">
                  <FlagIcon class="h-12 w-12 group-hover:scale-110 transition-transform duration-500" aria-hidden="true" />
                </div>
                
                <DialogTitle as="h3" class="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-none">¿Finalizar viaje?</DialogTitle>
                
                <div class="mt-6 px-4">
                  <p class="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    Al confirmar, el sistema <span class="font-bold text-red-500 uppercase">apagará el motor</span> de forma remota, bloqueará el vehículo y procesará el pago del trayecto.
                  </p>
                </div>

                <!-- Info Card -->
                <div v-if="vehicle" class="mt-8 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700/50 flex items-center justify-between shadow-inner">
                  <div class="flex items-center gap-4 text-left">
                    <div class="p-3 rounded-2xl bg-white dark:bg-gray-900 shadow-sm text-indigo-500">
                      <TruckIcon class="size-6" />
                    </div>
                    <div>
                      <p class="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Vehículo</p>
                      <p class="text-sm font-black text-gray-900 dark:text-white font-mono tracking-tighter">{{ vehicle.license_plate }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-[8px] font-black uppercase text-red-500 tracking-widest bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-lg">Cierre Seguro</p>
                  </div>
                </div>

                <!-- Warning Bullet Points -->
                <div class="mt-8 space-y-3 text-left px-2">
                  <div class="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <div class="size-1.5 rounded-full bg-red-500"></div>
                    Se desactivarán los relés de encendido
                  </div>
                  <div class="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <div class="size-1.5 rounded-full bg-red-500"></div>
                    El vehículo será visible para otros usuarios
                  </div>
                </div>

                <!-- Botones de Acción -->
                <div class="mt-10 flex flex-col gap-3">
                  <button
                    type="button"
                    :disabled="loading"
                    class="w-full inline-flex justify-center items-center gap-3 rounded-[1.5rem] bg-red-600 px-6 py-5 text-xs font-black uppercase tracking-[0.25em] text-white hover:bg-red-700 shadow-[0_20px_40px_-10px_rgba(220,38,38,0.4)] active:scale-95 transition-all disabled:opacity-50"
                    @click="confirm"
                  >
                    <ArrowPathIcon v-if="loading" class="size-5 animate-spin" />
                    Confirmar y Finalizar
                  </button>
                  <button
                    type="button"
                    class="w-full inline-flex justify-center rounded-[1.5rem] bg-gray-50 dark:bg-gray-800 px-6 py-5 text-xs font-black uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-750 transition-all active:scale-95 border border-gray-100 dark:border-gray-700"
                    @click="close"
                  >
                    Cancelar
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
  FlagIcon, 
  TruckIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

defineProps<{
  isOpen: boolean
  vehicle?: any
  loading?: boolean
}>()

const emit = defineEmits(['close', 'confirm'])

const close = () => emit('close')
const confirm = () => emit('confirm')
</script>
