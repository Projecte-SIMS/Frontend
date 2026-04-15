<template>
  <div class="flex items-center justify-center">
    <input
      type="checkbox"
      :checked="isChecked"
      @change="handleChange"
      :disabled="isAdminRole"
      class="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer transition-all"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Permission } from '../interfaces/role.interface'

const props = defineProps<{
  modelValue: number[]
  permission: Permission
  isAdminRole?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void
}>()

const isChecked = computed(() => {
  if (props.isAdminRole) return true
  return props.modelValue.includes(props.permission.id)
})

const handleChange = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  let newValue = [...props.modelValue]

  if (checked) {
    if (!newValue.includes(props.permission.id)) {
      newValue.push(props.permission.id)
    }
  } else {
    newValue = newValue.filter((id) => id !== props.permission.id)
  }

  emit('update:modelValue', newValue)
}
</script>
