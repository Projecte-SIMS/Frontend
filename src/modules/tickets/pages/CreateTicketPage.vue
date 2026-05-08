<template>
  <div class="p-6 max-w-2xl mx-auto font-sans">
    <div class="mb-8">
      <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none">{{ $t('tickets.create_title') }}</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">{{ $t('tickets.create_subtitle') }}</p>
    </div>

    <div class="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 space-y-6">
      <div>
        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{{ $t('tickets.subject_label') }}</label>
        <input 
          v-model="form.title" 
          class="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none font-medium" 
          :placeholder="$t('tickets.subject_placeholder')" 
        />
      </div>

      <div>
        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{{ $t('tickets.description_label') }}</label>
        <textarea 
          v-model="form.description" 
          rows="6" 
          class="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none font-medium resize-none" 
          :placeholder="$t('tickets.description_placeholder')"
        ></textarea>
      </div>

      <div class="pt-4">
        <button 
          @click="createTicket" 
          :disabled="creating || !form.title.trim()" 
          class="w-full py-4 rounded-2xl bg-brand-primary-600 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-primary-500/30 hover:bg-brand-primary-700 active:scale-95 transition-all disabled:opacity-50"
        >
          <ArrowPathIcon v-if="creating" class="size-5 animate-spin mx-auto" />
          <span v-else>{{ $t('tickets.send_ticket') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import apiClient from '@/services/api'
import showToast from '@/modules/common/composables/useToast'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const { t } = useI18n()
const form = ref({ title: '', description: '' })
const creating = ref(false)

const createTicket = async () => {
  if (!form.value.title) return
  creating.value = true
  try {
    const payload = { title: form.value.title, description: form.value.description }
    const res = await apiClient.post('/tickets', payload)
    const newTicket = res.data.data ?? res.data
    showToast(t('tickets.success.ticket_created'), 'success')
    router.push(`/tickets/${newTicket.id}`)
  } catch (e: any) {
    console.error(e)
    const resp = e?.response
    if (resp?.data?.message) showToast(resp.data.message, 'error')
    else showToast(t('tickets.errors.create_failed'), 'error')
  } finally {
    creating.value = false
  }
}
</script>
