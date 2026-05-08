<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-950 font-sans lg:p-6">
    <div class="mx-auto grid min-h-screen max-w-7xl grid-cols-1 overflow-hidden lg:min-h-0 lg:grid-cols-2 lg:rounded-[2.5rem] lg:border lg:border-gray-200 lg:bg-white lg:shadow-2xl lg:shadow-brand-primary-500/10 dark:lg:border-gray-800 dark:lg:bg-gray-900">
      <!-- Lado Izquierdo: Contenido -->
      <section class="relative flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
        <!-- Language Switcher Outermost in this section -->
        <div class="absolute top-8 right-8 z-10">
          <LanguageSwitcher />
        </div>

        <div class="w-full max-w-md">
          <div class="mb-8">
            <div class="mb-5 flex items-center gap-3">
              <div class="h-14 w-14 rounded-2xl bg-white p-0.5 ring-1 ring-gray-100 shadow-xl shadow-brand-primary-500/30">
                <img src="/logo.png" alt="Fleetly Logo" class="h-full w-full object-contain" />
              </div>
              <div>
                <p class="text-xs font-black uppercase tracking-[0.16em] text-brand-primary-500">{{ $t('auth.welcome_back') }}</p>
                <h1 class="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                  {{ $t('auth.login_title') }}
                  <span v-if="isAutoTenant" class="inline-flex items-center rounded-lg bg-brand-primary-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-brand-primary-600 ring-1 ring-inset ring-brand-primary-500/20 dark:bg-brand-primary-500/10 dark:text-brand-primary-400">
                    {{ tenant }}
                  </span>
                </h1>
              </div>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ $t('auth.login_subtitle') }}
            </p>
          </div>

          <div class="relative bg-white dark:bg-gray-900 py-8 px-7 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-[2rem]">
            <form class="space-y-5" @submit.prevent="handleSubmit" novalidate>
              <div v-if="!isAutoTenant">
                <label for="tenant" class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{{ $t('auth.company') }}</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-primary-500 transition-colors">
                    <BuildingOfficeIcon class="size-5" />
                  </div>
                  <input
                    id="tenant"
                    v-model="tenant"
                    type="text"
                    :disabled="isLoading"
                    class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none"
                    :placeholder="$t('auth.company_placeholder')"
                  />
                </div>
              </div>

              <div>
                <label for="email" class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{{ $t('auth.email') }}</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-primary-500 transition-colors">
                    <EnvelopeIcon class="size-5" />
                  </div>
                  <input
                    id="email"
                    v-model="email"
                    type="text"
                    autocomplete="email"
                    :disabled="isLoading"
                    class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none"
                    :placeholder="$t('auth.email_placeholder')"
                  />
                </div>
              </div>

              <div>
                <label for="password" class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{{ $t('auth.password') }}</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-primary-500 transition-colors">
                    <LockClosedIcon class="size-5" />
                  </div>
                  <input
                    id="password"
                    v-model="password"
                    type="password"
                    autocomplete="current-password"
                    :disabled="isLoading"
                    class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none"
                    :placeholder="$t('auth.password_placeholder')"
                  />
                </div>
              </div>

              <div v-if="error" class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
                <ExclamationCircleIcon class="size-4" />
                {{ error }}
              </div>

              <button
                type="submit"
                :disabled="isLoading"
                class="flex w-full justify-center items-center gap-2 rounded-2xl bg-brand-primary-600 px-4 py-3.5 text-sm font-black uppercase tracking-widest text-white hover:bg-brand-primary-700 shadow-xl shadow-brand-primary-500/30 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
              >
                <ArrowPathIcon v-if="isLoading" class="size-5 animate-spin" />
                {{ isLoading ? $t('auth.logging_in') : $t('auth.login_button') }}
              </button>
            </form>

            <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <p class="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ $t('auth.no_account') }}
                  <RouterLink to="/register" class="font-bold text-brand-primary-600 dark:text-brand-primary-400 hover:underline">{{ $t('auth.register_link') }}</RouterLink>
                </p>
                <p class="mt-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                  {{ $t('auth.no_company') }}
                  <RouterLink to="/empresa/alta" class="font-bold text-brand-secondary-600 dark:text-brand-secondary-400 hover:underline">{{ $t('auth.create_tenant') }}</RouterLink>
                </p>
              </div>
          </div>
        </div>
      </section>

      <section class="relative hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1600&q=80"
          alt="Fleetly mobility"
          class="h-full w-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-br from-brand-primary-900/75 via-brand-primary-800/45 to-brand-highlight-900/70"></div>
        <div class="absolute left-8 top-8 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
          <div class="h-12 w-12 rounded-xl bg-white p-0.5 shadow-lg">
            <img src="/logo.png" alt="Fleetly Logo" class="h-full w-full object-contain" />
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.16em] text-brand-primary-100/90">{{ $t('auth.smart_mobility') }}</p>
            <p class="text-xl font-black text-white leading-none">Fleetly</p>
          </div>
        </div>
        <div class="absolute left-8 right-8 bottom-8 rounded-2xl border border-white/15 bg-black/25 p-6 backdrop-blur-sm">
          <h2 class="text-2xl font-black text-white leading-tight">{{ $t('auth.login_hero_title') }}</h2>
          <p class="mt-2 text-sm text-brand-primary-100/90">{{ $t('auth.login_hero_subtitle') }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { getCurrentTenant } from '@/services/api'
import { useTheme } from '@/modules/common/composables/useTheme'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/modules/common/components/LanguageSwitcher.vue'
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  BuildingOfficeIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const { login, isLoading, error, user } = useAuth()
const { initTheme, fetchAndApplyTenantTheme } = useTheme()
const { t } = useI18n()

const tenant = ref('')
const isAutoTenant = ref(false)
const email = ref('')
const password = ref('')

onMounted(() => {
  // Pre-fill tenant from URL or localStorage
  const currentTenant = getCurrentTenant()
  if (currentTenant) {
    tenant.value = currentTenant
    isAutoTenant.value = true
    // initTheme() already called in main.ts, which triggers fetchAndApplyTenantTheme()
  }

  if (typeof route.query.email === 'string' && route.query.email) {
    email.value = route.query.email
  }
})

const handleSubmit = async () => {
  error.value = ''
  
  if (!tenant.value.trim()) {
    error.value = t('auth.errors.company_required')
    return
  }
  
  if (!email.value.trim()) {
    error.value = t('auth.errors.email_required')
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    error.value = t('auth.errors.email_invalid')
    return
  }
  
  if (!password.value) {
    error.value = t('auth.errors.password_required')
    return
  }

  // Save tenant to localStorage before login
  localStorage.setItem('current_tenant', tenant.value.toLowerCase().trim())
  
  const success = await login(email.value, password.value)
  if (success) {
    const isAdmin = user.value?.roles?.some((r: any) => (r.name || '').toLowerCase() === 'admin')
    if (isAdmin) router.push('/admin')
    else router.push('/')
  }
}
</script>
