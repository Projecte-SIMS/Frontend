<template>
  <div class="mb-8">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ title }}
        </h1>
        <p
          v-if="description"
          class="mt-1 text-sm text-gray-500 dark:text-gray-400"
        >
          {{ description }}
        </p>
      </div>

      <div v-if="$slots.actions" class="mt-4 flex flex-shrink-0 gap-3 sm:mt-0 sm:ml-4">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>
