<template>
  <td :class="classes">
    <slot />
  </td>
</template>

<script setup lang="ts">
const props = defineProps<{
  variant?: 'primary' | 'muted' | 'actions'
  first?: boolean
}>()

const base = 'py-4 text-sm whitespace-nowrap'
const first = 'pl-6 pr-3'
const middle = 'px-3'
const actions = 'pl-3 pr-6 text-right'

const classes =
  props.variant === 'actions'
    ? `${base} ${actions}`
    : props.first
      ? `${base} ${first} ${props.variant === 'primary' ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`
      : `${base} ${middle} ${props.variant === 'primary' ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`
</script>
