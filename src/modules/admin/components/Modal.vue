<template>
  <div class="modal-backdrop" v-if="show">
    <div class="modal-panel" @click.stop>
      <header class="modal-header">
        <slot name="header" />
        <button aria-label="Close" class="close-btn" @click="$emit('close')">✕</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer">
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

<style scoped>
.modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:50 }
.modal-panel { background:white; width:100%; max-width:720px; border-radius:8px; overflow:hidden }
.modal-header { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid #eee }
.modal-body { padding:16px }
.modal-footer { padding:12px 16px; border-top:1px solid #eee; text-align:right }
.close-btn { background:transparent; border:none; font-size:16px; cursor:pointer }
</style>
