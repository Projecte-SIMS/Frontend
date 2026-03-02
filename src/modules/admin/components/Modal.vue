<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="$emit('close')"
      >
        <div
          :class="[
            'w-full overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900',
            sizeClass
          ]"
          @click.stop
        >
          <header
            class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4
                   dark:border-gray-700 dark:bg-gray-800"
          >
            <slot name="header" />
            <button
              aria-label="Cerrar"
              class="ml-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none
                     dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
              @click="$emit('close')"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <section class="bg-white px-6 py-5 dark:bg-gray-900 max-h-[70vh] overflow-y-auto">
            <slot />
          </section>

          <footer
            v-if="$slots.footer"
            class="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4
                   dark:border-gray-700 dark:bg-gray-800"
          >
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  show: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'max-w-md'
    case 'lg': return 'max-w-4xl'
    case 'xl': return 'max-w-6xl'
    default: return 'max-w-2xl'
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>
