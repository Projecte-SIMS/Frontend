<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog class="relative z-[100]" @close="close">
      <TransitionChild as="template" enter="transition-opacity ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="transition ease-out duration-300 transform" enter-from="translate-y-4 opacity-0 scale-95" enter-to="translate-y-0 opacity-100 scale-100" leave="transition ease-in duration-200 transform" leave-from="translate-y-0 opacity-100 scale-100" leave-to="translate-y-4 opacity-0 scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-gray-900 px-4 pt-5 pb-4 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-8 border border-gray-100 dark:border-gray-800">
              
              <!-- Decoration -->
              <div class="absolute -top-24 -right-24 size-48 rounded-full bg-indigo-500/10 blur-3xl"></div>
              
              <div class="relative">
                <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 mb-6">
                  <CalendarIcon class="h-8 w-8" aria-hidden="true" />
                </div>
                
                <div class="text-center sm:text-left mb-8">
                  <DialogTitle as="h3" class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Confirmar Reserva</DialogTitle>
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Estás a punto de reservar el siguiente vehículo:</p>
                </div>

                <!-- Vehicle Brief -->
                <div v-if="vehicle" class="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-5 border border-gray-100 dark:border-gray-700/50 mb-8 flex items-center gap-5">
                  <div class="size-20 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                    <img :src="'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400'" class="size-full object-cover" />
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-lg font-bold text-gray-900 dark:text-white truncate">{{ vehicle.brand }} {{ vehicle.model }}</h4>
                    <p class="text-indigo-600 dark:text-indigo-400 font-mono font-bold text-sm">{{ vehicle.plate || vehicle.license_plate }}</p>
                    <div class="flex items-center gap-3 mt-2">
                      <span class="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1">
                        <CurrencyEuroIcon class="size-3" /> 0.15€/min
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Rules Warning -->
                <div class="space-y-4 mb-8">
                  <div class="flex gap-4">
                    <div class="shrink-0 size-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50">
                      <ClockIcon class="size-5" />
                    </div>
                    <div>
                      <p class="text-sm font-bold text-gray-900 dark:text-white">Ventana de 10 minutos</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Tendrás 10 minutos para llegar al vehículo y activarlo. Si no lo haces, la reserva se cancelará automáticamente.</p>
                    </div>
                  </div>
                  <div class="flex gap-4">
                    <div class="shrink-0 size-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                      <ShieldCheckIcon class="size-5" />
                    </div>
                    <div>
                      <p class="text-sm font-bold text-gray-900 dark:text-white">Reserva exclusiva</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Solo tú podrás ver y utilizar este vehículo mientras la reserva esté activa.</p>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    :disabled="loading"
                    class="flex-1 inline-flex justify-center items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 active:scale-95 transition-all disabled:opacity-50"
                    @click="confirm"
                  >
                    <ArrowPathIcon v-if="loading" class="size-5 animate-spin" />
                    Confirmar ahora
                  </button>
                  <button
                    type="button"
                    class="flex-1 inline-flex justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 px-6 py-4 text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
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
  CalendarIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  CurrencyEuroIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

defineProps<{
  isOpen: boolean
  vehicle: any
  loading?: boolean
}>()

const emit = defineEmits(['close', 'confirm'])

const close = () => emit('close')
const confirm = () => emit('confirm')
</script>
