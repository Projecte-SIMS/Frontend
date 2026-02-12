<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  >
    <div
      class="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl
             dark:bg-gray-900"
      @click.stop
    >
      <header
        class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4
               dark:border-gray-700 dark:bg-gray-900"
      >
        <slot name="header" />
        <button
          aria-label="Close"
          class="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none
                 dark:text-gray-500 dark:hover:text-gray-300"
          @click="$emit('close')"
        >
          ✕
        </button>
      </header>

      <section class="bg-white px-6 py-4 dark:bg-gray-900">
        <slot />
      </section>

      <footer
        class="flex items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4
               dark:border-gray-700 dark:bg-gray-900"
      >
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>
