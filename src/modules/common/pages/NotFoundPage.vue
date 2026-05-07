<template>
  <main class="grid min-h-screen place-items-center bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
    <div class="text-center">
      <p class="text-base font-semibold text-brand-primary-400">404</p>
      <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">{{ t('not_found.title') }}</h1>
      <p class="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">{{ t('not_found.subtitle') }}</p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <router-link to="/" class="rounded-md bg-brand-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-brand-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-500">{{ t('not_found.back_home') }}</router-link>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
/* Keep visual styles to utility classes; add tiny fallback if needed */
:root { color-scheme: dark; }
</style>
