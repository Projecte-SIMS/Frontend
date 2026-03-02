<template>
  <div
    class="mt-6 flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/10"
    aria-label="Pagination"
  >
    <!-- Info -->
    <div class="hidden sm:block">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Mostrando
        <span class="font-semibold text-gray-900 dark:text-white">{{ from }}</span>
        a
        <span class="font-semibold text-gray-900 dark:text-white">{{ to }}</span>
        de
        <span class="font-semibold text-gray-900 dark:text-white">{{ total }}</span>
        resultados
      </p>
    </div>

    <!-- Page indicator mobile -->
    <div class="sm:hidden">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Página <span class="font-semibold">{{ page }}</span> de <span class="font-semibold">{{ totalPages }}</span>
      </p>
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors
               text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
               dark:text-gray-300 dark:hover:bg-gray-700"
        :disabled="page <= 1"
        @click="emit('update:page', page - 1)"
      >
        <svg class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Anterior
      </button>

      <div class="hidden sm:flex items-center gap-1">
        <button
          v-for="p in visiblePages"
          :key="p"
          type="button"
          class="inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors"
          :class="p === page 
            ? 'bg-indigo-600 text-white' 
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
          @click="emit('update:page', p)"
        >
          {{ p }}
        </button>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors
               text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
               dark:text-gray-300 dark:hover:bg-gray-700"
        :disabled="page >= totalPages"
        @click="emit('update:page', page + 1)"
      >
        Siguiente
        <svg class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  perPage: number
  total: number
}>()

const emit = defineEmits<{
  (e: 'update:page', value: number): void
}>()

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / props.perPage))
)

const from = computed(() =>
  props.total === 0 ? 0 : (props.page - 1) * props.perPage + 1
)

const to = computed(() =>
  Math.min(props.page * props.perPage, props.total)
)

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = props.page
  
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, 5)
    } else {
      start = Math.max(1, total - 4)
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})
</script>
