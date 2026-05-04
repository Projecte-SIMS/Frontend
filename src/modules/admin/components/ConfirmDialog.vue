<template>
  <TransitionRoot as="template" :show="visible">
    <Dialog class="relative z-[100]" @close="onCancel">
      <TransitionChild as="template" enter="transition-opacity ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-950/90 backdrop-blur-xl transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto font-sans">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <TransitionChild as="template" enter="transition ease-out duration-300 transform" enter-from="translate-y-8 opacity-0 scale-95" enter-to="translate-y-0 opacity-100 scale-100" leave="transition ease-in duration-200 transform" leave-from="translate-y-0 opacity-100 scale-100" leave-to="translate-y-8 opacity-0 scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-[3rem] bg-white dark:bg-gray-900 px-6 pt-10 pb-8 text-left shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] transition-all sm:my-8 sm:w-full sm:max-w-md border border-gray-100 dark:border-gray-800">
              
              <!-- Decoration Glow Danger -->
              <div class="absolute -top-32 -right-32 size-64 rounded-full bg-rose-500/15 blur-3xl"></div>

              <div class="relative text-center">
                <!-- Icono principal -->
                <div class="mx-auto flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 mb-8 shadow-inner border border-rose-100 dark:border-rose-800/30 group">
                  <ExclamationTriangleIcon class="h-12 w-12 group-hover:scale-110 transition-transform duration-500" aria-hidden="true" />
                </div>

                <DialogTitle as="h3" class="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-none">
                  {{ title || '¿Estás seguro?' }}
                </DialogTitle>
                
                <div class="mt-6 px-4">
                  <p class="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    {{ message || 'Esta acción no se puede deshacer.' }}
                  </p>
                </div>

                <!-- Botones de Acción -->
                <div class="mt-10 flex flex-col gap-3">
                  <button
                    type="button"
                    class="w-full inline-flex justify-center items-center gap-3 rounded-[1.5rem] bg-rose-600 px-6 py-5 text-xs font-black uppercase tracking-[0.25em] text-white hover:bg-rose-700 shadow-[0_20px_40px_-10px_rgba(225,29,72,0.4)] active:scale-95 transition-all"
                    @click="onConfirm"
                  >
                    Confirmar Acción
                  </button>
                  <button
                    type="button"
                    class="w-full inline-flex justify-center rounded-[1.5rem] bg-gray-50 dark:bg-gray-800 px-6 py-5 text-xs font-black uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-750 transition-all active:scale-95 border border-gray-100 dark:border-gray-700"
                    @click="onCancel"
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
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

defineProps<{
  visible: boolean
  title?: string
  message?: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function onConfirm() { emit('confirm') }
function onCancel() { emit('cancel') }
</script>
