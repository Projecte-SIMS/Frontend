<template>
  <div class="mt-6 flow-root">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div class="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/10">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th
                  v-for="(col, idx) in columns"
                  :key="col.key"
                  scope="col"
                  :class="thClass(idx)"
                >
                  <span v-if="col.srOnly" class="sr-only">{{ col.label }}</span>
                  <span v-else>{{ col.label }}</span>
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-700/50">
              <slot />
            </tbody>
          </table>

          <div
            v-if="empty"
            class="py-12 text-center text-sm text-gray-500 dark:text-gray-400"
          >
            <slot name="empty">No hay resultados.</slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Column = {
  key: string
  label: string
  srOnly?: boolean
}

const props = defineProps<{
  columns: Column[]
  empty?: boolean
}>()

function thClass(idx: number) {
  const base = 'py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
  const first = 'pl-6 pr-3'
  const middle = 'px-3'
  const last = 'pl-3 pr-6 text-right'

  if (idx === 0) return `${base} ${first}`
  if (idx === props.columns.length - 1) return `${base} ${last}`
  return `${base} ${middle}`
}
</script>
