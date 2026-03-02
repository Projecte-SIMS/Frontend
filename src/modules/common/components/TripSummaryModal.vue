<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog class="relative z-[110]" @close="close">
      <TransitionChild as="template" enter="transition-opacity ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-950/90 backdrop-blur-xl transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto font-sans">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <TransitionChild as="template" enter="transition ease-out duration-300 transform" enter-from="translate-y-8 opacity-0 scale-95" enter-to="translate-y-0 opacity-100 scale-100" leave="transition ease-in duration-200 transform" leave-from="translate-y-0 opacity-100 scale-100" leave-to="translate-y-8 opacity-0 scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-[3rem] bg-white dark:bg-gray-900 px-6 pt-10 pb-8 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-gray-100 dark:border-gray-800">
              
              <div class="relative text-center">
                <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 mb-6 shadow-inner border border-green-100 dark:border-green-800/30">
                  <CheckBadgeIcon class="h-10 w-10" />
                </div>
                
                <DialogTitle as="h3" class="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-none">Viaje Finalizado</DialogTitle>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">Resumen de tu trayecto</p>

                <div class="mt-8 grid grid-cols-3 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-700/50">
                    <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Duración</p>
                    <p class="text-xl font-black text-gray-900 dark:text-white">{{ summaryData.minutes }} min</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-700/50">
                    <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Velocidad Med.</p>
                    <p class="text-xl font-black text-gray-900 dark:text-white">{{ summaryData.summary?.avg_speed || 0 }} km/h</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-700/50">
                    <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Coste Total</p>
                    <p class="text-xl font-black text-indigo-600 dark:text-indigo-400">{{ summaryData.cost }}</p>
                  </div>
                </div>

                <!-- Route Map -->
                <div class="mt-6 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 h-64 relative bg-gray-50 dark:bg-gray-950 shadow-inner">
                  <div ref="summaryMapContainer" class="absolute inset-0"></div>
                  <div v-if="!hasPoints" class="absolute inset-0 flex items-center justify-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                    Sin datos de ruta disponibles
                  </div>
                </div>

                <div class="mt-10">
                  <button
                    type="button"
                    class="w-full inline-flex justify-center rounded-[1.5rem] bg-indigo-600 px-6 py-5 text-xs font-black uppercase tracking-[0.25em] text-white hover:bg-indigo-700 shadow-xl active:scale-95 transition-all"
                    @click="close"
                  >
                    Entendido, gracias
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
import { ref, watch, onMounted, nextTick } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { CheckBadgeIcon } from '@heroicons/vue/24/outline'
import L from 'leaflet'

const props = defineProps<{
  isOpen: boolean
  summaryData: any
}>()

const emit = defineEmits(['close'])
const summaryMapContainer = ref<HTMLElement | null>(null)
const summaryMap = ref<L.Map | null>(null)
const hasPoints = ref(false)

const close = () => emit('close')

const initSummaryMap = async () => {
  if (!summaryMapContainer.value || !props.summaryData.summary?.points?.length) {
    hasPoints.value = false
    return
  }
  
  hasPoints.value = true
  await nextTick()
  
  if (summaryMap.value) summaryMap.value.remove()
  
  summaryMap.value = L.map(summaryMapContainer.value, { zoomControl: false, attributionControl: false })
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(summaryMap.value)
  
  const points = props.summaryData.summary.points.map((p: any) => [p.lat, p.lon] as L.LatLngExpression)
  
  // Draw path
  const polyline = L.polyline(points, { color: '#4f46e5', weight: 5, opacity: 0.8 }).addTo(summaryMap.value)
  
  // Add markers for start and end
  L.circleMarker(points[0], { radius: 6, color: '#22c55e', fillOpacity: 1 }).addTo(summaryMap.value)
  L.circleMarker(points[points.length-1], { radius: 6, color: '#ef4444', fillOpacity: 1 }).addTo(summaryMap.value)
  
  summaryMap.value.fitBounds(polyline.getBounds(), { padding: [30, 30] })
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    setTimeout(initSummaryMap, 300)
  }
})
</script>
