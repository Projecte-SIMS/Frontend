<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 p-8 sm:p-12">
      <div class="mb-10 text-center">
        <div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary-50 dark:bg-brand-primary-900/20 text-brand-primary-600 mb-6">
          <span class="material-icons text-3xl">Gavel</span>
        </div>
        <h1 class="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{{ t('terms.title') }}</h1>
        <p class="text-sm text-gray-500 mt-2 italic">{{ t('terms.updated_at') }}</p>
      </div>

      <div class="prose dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-400 leading-relaxed">
        <section>
          <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">{{ t('terms.section1_title') }}</h2>
          <p>{{ t('terms.section1_body') }}</p>
        </section>

        <section>
          <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">{{ t('terms.section2_title') }}</h2>
          <p class="font-bold text-rose-600 dark:text-rose-400">{{ t('terms.section2_body_highlight') }}</p>
          <p>{{ t('terms.section2_body') }}</p>
        </section>

        <section>
          <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">{{ t('terms.section3_title') }}</h2>
          <p>{{ t('terms.section3_body') }}</p>
        </section>

        <section>
          <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">{{ t('terms.section4_title') }}</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>{{ t('terms.section4_item1') }}</li>
            <li>{{ t('terms.section4_item2') }}</li>
            <li>{{ t('terms.section4_item3') }}</li>
          </ul>
        </section>
      </div>

      <div class="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
        <router-link to="/login" class="text-brand-primary-600 font-black text-xs uppercase tracking-widest hover:underline">{{ t('common.back_home') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
