<template>
  <div class="max-w-2xl mx-auto space-y-6 fleetly-fade-up pb-12">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
      <router-link
        to="/perfil"
        class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-primary-600 dark:text-gray-400 dark:hover:text-brand-primary-400 transition-colors mb-4"
      >
        <ArrowLeftIcon class="size-4" />
        {{ $t('profile.back_to_profile') }}
      </router-link>
      <h1 class="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
        {{ $t('profile.change_password') }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1 font-medium">
        {{ $t('profile.security_subtitle') }}
      </p>
    </div>

    <!-- Form Card -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <form @submit.prevent="submit" class="p-8 space-y-6">
        <div class="space-y-6">
          <!-- Password -->
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">{{ $t('profile.new_password') }}</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-primary-500 transition-colors">
                <LockClosedIcon class="size-5" />
              </div>
              <input
                v-model="form.password"
                type="password"
                required
                class="block w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-all outline-none"
                :placeholder="$t('profile.password_placeholder')"
              />
            </div>
            <p class="mt-2 text-[11px] text-gray-400 ml-1 italic">
              {{ $t('profile.password_length_hint') }}
            </p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">{{ $t('profile.confirm_new_password') }}</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-primary-500 transition-colors">
                <ShieldCheckIcon class="size-5" />
              </div>
              <input
                v-model="form.confirmPassword"
                type="password"
                required
                class="block w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-all outline-none"
                :placeholder="$t('profile.confirm_new_password')"
              />
            </div>
          </div>
        </div>

        <!-- Feedback Messages -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="error" class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-3 border border-red-100 dark:border-red-900/30">
            <ExclamationCircleIcon class="size-5 shrink-0" />
            {{ error }}
          </div>
          <div v-else-if="success" class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-3 border border-emerald-100 dark:border-emerald-900/30">
            <CheckCircleIcon class="size-5 shrink-0" />
            {{ $t('profile.update_success') }}
          </div>
        </Transition>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            :disabled="isLoading"
            class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-primary-600 text-white font-bold text-sm hover:bg-brand-primary-700 transition-all shadow-lg shadow-brand-primary-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon v-if="isLoading" class="size-5 animate-spin" />
            <KeyIcon v-else class="size-5" />
            {{ isLoading ? $t('profile.saving') : $t('profile.save_changes') }}
          </button>
          <button
            type="button"
            @click="cancel"
            class="px-6 py-3.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95 border border-gray-200 dark:border-gray-700"
          >
            {{ $t('common.cancel') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import apiClient from '@/services/api'
import { useI18n } from 'vue-i18n'
import {
  ArrowLeftIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  KeyIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const { fetchUser } = useAuth()
const { t } = useI18n()

const form = ref({
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const error = ref('')
const success = ref(false)

const submit = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = t('profile.errors.passwords_dont_match')
    return
  }

  if (form.value.password.length < 8) {
    error.value = t('profile.errors.password_too_short')
    return
  }

  isLoading.value = true
  error.value = ''
  success.value = false
  try {
    await apiClient.put('/users/me', {
      password: form.value.password
    })
    await fetchUser()
    success.value = true
    form.value.password = ''
    form.value.confirmPassword = ''
    
    setTimeout(() => {
      success.value = false
      router.push('/perfil')
    }, 2000)
  } catch (e: any) {
    error.value = e.response?.data?.message || t('profile.errors.update_failed')
  } finally {
    isLoading.value = false
  }
}

const cancel = () => {
  router.push('/perfil')
}
</script>
