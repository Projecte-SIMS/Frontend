<template>
  <div class="max-w-5xl mx-auto space-y-6 fleetly-fade-up pb-12">
    <!-- Header Section: Clean, Professional -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm relative overflow-hidden">
      <!-- Decorative background accent -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-primary-50 to-transparent dark:from-brand-primary-900/20 rounded-bl-full opacity-50 pointer-events-none"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
        <!-- Avatar -->
        <div class="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-brand-primary-100 dark:bg-brand-primary-900/30 text-brand-primary-700 dark:text-brand-primary-400 text-3xl font-light tracking-wider ring-4 ring-white dark:ring-gray-900 shadow-sm">
          {{ userInitials }}
        </div>
        
        <!-- User Identity -->
        <div class="flex-1 space-y-1">
          <h1 class="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
            {{ user?.name }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
            @{{ user?.username }}
            <span class="inline-block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            <span class="text-sm">{{ user?.email }}</span>
          </p>
          <div class="pt-2 flex flex-wrap gap-2">
            <span v-for="role in user?.roles" :key="role.id" class="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium tracking-wide">
              {{ role.name }}
            </span>
            <span v-if="user?.active" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs font-medium tracking-wide border border-emerald-100 dark:border-emerald-800/30">
              <span class="size-1.5 rounded-full bg-emerald-500"></span>
              {{ $t('profile.status_active') }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex md:flex-col gap-3 mt-4 md:mt-0">
          <button
            @click="router.push('/perfil/editar')"
            class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary-600 text-white font-medium text-sm hover:bg-brand-primary-700 transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500"
          >
            <PencilSquareIcon class="size-4" />
            {{ $t('profile.edit_profile_button') }}
          </button>
          <button
            @click="handleLogout"
            class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <ArrowRightOnRectangleIcon class="size-4 text-gray-400" />
            {{ $t('profile.logout') }}
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Main Content Column -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Booking Dashboard -->
        <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ClipboardDocumentListIcon class="size-6 text-brand-primary-500" />
              {{ $t('profile.recent_activity') }}
            </h2>
            <button 
              @click="router.push('/bookings')"
              class="text-xs font-bold text-brand-primary-600 hover:text-brand-primary-700 dark:text-brand-primary-400 uppercase tracking-widest"
            >
              {{ $t('profile.view_all_history') }} &rarr;
            </button>
          </div>

          <div v-if="loadingBookings" class="flex flex-col items-center justify-center py-12 space-y-3">
            <ArrowPathIcon class="size-8 text-gray-300 animate-spin" />
            <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">{{ $t('common.searching') }}</p>
          </div>

          <div v-else-if="bookings.length === 0" class="flex flex-col items-center justify-center py-12 text-center bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <div class="p-4 bg-white dark:bg-gray-900 rounded-full shadow-sm mb-4">
              <MapIcon class="size-8 text-gray-300 dark:text-gray-600" />
            </div>
            <p class="text-sm font-bold text-gray-900 dark:text-white">{{ $t('profile.no_activity_title') }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">{{ $t('profile.no_activity_subtitle') }}</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="booking in recentBookings" 
              :key="booking.id"
              class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
            >
              <!-- Vehicle Mini Thumb -->
              <div class="size-12 rounded-lg bg-gray-100 dark:bg-gray-950 overflow-hidden shrink-0">
                <img :src="getVehicleImage(booking.vehicle?.brand, booking.vehicle?.model)" class="size-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {{ booking.vehicle?.brand }} {{ booking.vehicle?.model }}
                  </h4>
                  <span 
                    class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider"
                    :class="getStatusBadgeClass(booking.status)"
                  >
                    {{ getStatusLabel(booking.status) }}
                  </span>
                </div>
                <div class="flex items-center gap-3 mt-0.5">
                  <span class="text-[11px] text-gray-500 flex items-center gap-1">
                    <CalendarDaysIcon class="size-3" />
                    {{ formatDate(booking.created_at) }}
                  </span>
                  <span v-if="booking.total_cost" class="text-[11px] text-gray-500 font-bold">
                    {{ booking.total_cost.toFixed(2) }}€
                  </span>
                </div>
              </div>

              <!-- Action -->
              <div class="shrink-0">
                <ChevronRightIcon class="size-5 text-gray-300 group-hover:text-brand-primary-500 transition-colors" />
              </div>
            </div>
          </div>
        </section>

        <!-- Account Details -->
        <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UserCircleIcon class="size-5 text-gray-400" />
              {{ $t('profile.account_details') }}
            </h2>
          </div>
          
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <div class="space-y-1.5">
              <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ $t('profile.full_name') }}</dt>
              <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ user?.name || '-' }}</dd>
            </div>
            <div class="space-y-1.5">
              <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ $t('profile.email') }}</dt>
              <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ user?.email || '-' }}</dd>
            </div>
            <div class="space-y-1.5">
              <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ $t('profile.username') }}</dt>
              <dd class="text-sm font-medium text-gray-900 dark:text-white">@{{ user?.username || '-' }}</dd>
            </div>
            <div class="space-y-1.5">
              <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ $t('common.language') }}</dt>
              <dd class="text-sm font-medium text-gray-900 dark:text-white">
                <LanguageSwitcher />
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <!-- Sidebar Column -->
      <div class="space-y-6">
        
        <!-- Stats Summary -->
        <section class="bg-brand-primary-600 rounded-2xl p-6 shadow-lg shadow-brand-primary-500/10 text-white overflow-hidden relative group">
          <div class="absolute -right-4 -top-4 size-24 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
          
          <h3 class="text-xs font-bold text-brand-primary-100 uppercase tracking-widest mb-6 flex items-center gap-2">
            <ChartBarIcon class="size-4" />
            {{ $t('profile.my_stats') }}
          </h3>

          <div class="grid grid-cols-2 gap-4 relative z-10">
            <div class="space-y-1">
              <p class="text-2xl font-black">{{ totalTrips }}</p>
              <p class="text-[10px] font-bold text-brand-primary-100 uppercase tracking-widest">{{ $t('profile.total_trips') }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-2xl font-black">{{ totalSpent.toFixed(1) }}€</p>
              <p class="text-[10px] font-bold text-brand-primary-100 uppercase tracking-widest">{{ $t('profile.total_spent') }}</p>
            </div>
          </div>
        </section>

        <!-- Account Status & Security -->
        <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">{{ $t('profile.security') }}</h3>
          
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="mt-0.5 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                <CheckBadgeIcon class="size-4" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ $t('profile.account_active') }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ $t('profile.account_good_standing') }}</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <div class="mt-0.5 p-2 bg-brand-primary-50 dark:bg-brand-primary-900/20 rounded-lg text-brand-primary-600 dark:text-brand-primary-400">
                <KeyIcon class="size-4" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ $t('profile.password_settings') }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2">{{ $t('profile.password_manage') }}</p>
                <button
                  @click="router.push('/perfil/password')"
                  class="text-xs font-medium text-brand-primary-600 hover:text-brand-primary-700 dark:text-brand-primary-400 hover:underline"
                >
                  {{ $t('profile.change_password_button') }} &rarr;
                </button>
              </div>
            </div>
          </div>
        </section>
        
        <!-- System Info -->
        <section class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ServerIcon class="size-4 text-gray-400" />
            {{ $t('profile.system_information') }}
          </h3>
          <ul class="space-y-3 text-sm">
            <li class="flex justify-between items-center">
              <span class="text-gray-500 dark:text-gray-400">{{ $t('profile.environment') }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ $t('profile.production') }}</span>
            </li>
            <li class="flex justify-between items-center">
              <span class="text-gray-500 dark:text-gray-400">{{ $t('profile.user_id') }}</span>
              <span class="font-mono text-xs text-gray-600 dark:text-gray-300">{{ user?.id || '---' }}</span>
            </li>
            <li v-if="user?.created_at" class="flex justify-between items-center">
              <span class="text-gray-500 dark:text-gray-400">{{ $t('profile.member_since') }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ new Date(user.created_at).toLocaleDateString() }}</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import useBookingsUser from '@/modules/bookings/composables/useBookingsUser'
import LanguageSwitcher from '@/modules/common/components/LanguageSwitcher.vue'
import { getVehicleImage } from '@/modules/common/utils/vehicleImages'
import { useI18n } from 'vue-i18n'
import {
  PencilSquareIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  CheckBadgeIcon,
  KeyIcon,
  ServerIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  MapIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const { user, logout } = useAuth()
const { bookings, loading: loadingBookings, getBookings } = useBookingsUser()
const { t } = useI18n()

onMounted(() => {
  getBookings()
})

const userInitials = computed(() => {
  const name = user.value?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
})

const recentBookings = computed(() => {
  return [...bookings.value]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
})

const totalTrips = computed(() => bookings.value.length)
const totalSpent = computed(() => bookings.value.reduce((acc, b) => acc + (b.total_cost || 0), 0))

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: t('bookings.status_active'),
    pending: t('bookings.status_pending'),
    completed: t('bookings.status_completed'),
    cancelled: t('bookings.status_cancelled'),
    expired: t('bookings.status_expired')
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'active': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'completed': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    default: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
