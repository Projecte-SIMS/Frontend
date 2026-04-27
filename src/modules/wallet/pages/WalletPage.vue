<template>
  <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mi Cartera</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Gestiona tu saldo y revisa tu historial de pagos.
      </p>
    </div>

    <!-- Saldo Actual Card -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
      <div class="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Saldo Disponible</p>
          <div class="mt-2 flex items-baseline">
            <span class="text-5xl font-black text-slate-900 dark:text-white">{{ formattedBalance }}</span>
            <div class="ml-4 flex flex-col">
              <span v-if="walletData?.balance < 0" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                Deuda Pendiente
              </span>
              <span v-if="walletData?.has_payment_method" class="mt-1 text-xs text-slate-500 flex items-center gap-1">
                <CreditCardIcon class="size-3" />
                Tarjeta vinculada activa
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-3">
          <button 
            v-if="walletData?.has_payment_method"
            @click="openStripePortal"
            :disabled="loading"
            class="inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-sm font-bold rounded-xl shadow-sm text-slate-700 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
          >
            Gestionar Tarjeta
          </button>
          <button 
            @click="initTopUp(1000)" 
            :disabled="loading"
            class="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-bold rounded-xl shadow-sm text-white bg-brand-primary-600 hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 disabled:opacity-50 transition-all"
          >
            Recargar 10€
          </button>
          <button 
            @click="initTopUp(2000)" 
            :disabled="loading"
            class="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-bold rounded-xl shadow-sm text-white bg-brand-primary-600 hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 disabled:opacity-50 transition-all"
          >
            Recargar 20€
          </button>
          <button 
            @click="initTopUp(5000)" 
            :disabled="loading"
            class="inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-sm font-bold rounded-xl shadow-sm text-slate-700 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none transition-all"
          >
            Otra Cantidad
          </button>
        </div>
      </div>
      
      <div v-if="successMsg" class="bg-emerald-50 dark:bg-emerald-900/20 p-4 border-t border-emerald-100 dark:border-emerald-800">
        <div class="flex">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="h-5 w-5 text-emerald-400" aria-hidden="true" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-emerald-800 dark:text-emerald-300">{{ successMsg }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Historial de Transacciones -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Historial de Transacciones</h3>
        <button @click="fetchWallet" class="text-slate-400 hover:text-brand-primary-600 transition-colors">
          <ArrowPathIcon :class="{'animate-spin': loading}" class="h-5 w-5" />
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800/50">
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fecha</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Descripción</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Importe</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
            <tr v-for="tx in walletData?.transactions" :key="tx.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                {{ formatDate(tx.created_at) }}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                {{ tx.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-bold" :class="tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
                {{ tx.type === 'credit' ? '+' : '-' }}{{ formatCurrency(tx.amount_cents) }}
              </td>
            </tr>
            <tr v-if="!walletData?.transactions?.length">
              <td colspan="3" class="px-6 py-10 text-center text-sm text-slate-500 italic">
                No hay transacciones registradas aún.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/services/api'
import { CheckCircleIcon, ArrowPathIcon, CreditCardIcon } from '@heroicons/vue/24/outline'
import showToast from '@/modules/common/composables/useToast'

const route = useRoute()
const walletData = ref<any>(null)
const loading = ref(false)
const successMsg = ref('')

const formattedBalance = computed(() => {
  if (!walletData.value) return '0,00 €'
  return formatCurrency(walletData.value.balance)
})

const fetchWallet = async () => {
  loading.value = true
  try {
    const res = await api.getWallet()
    walletData.value = res
  } catch (error) {
    console.error('Error fetching wallet:', error)
    showToast('No se pudo cargar la información de la cartera.', 'error')
  } finally {
    loading.value = false
  }
}

const initTopUp = async (amountCents: number) => {
  loading.value = true
  try {
    const res = await api.initTopUp(amountCents)
    if (res.checkout_url) {
      window.location.href = res.checkout_url
    }
  } catch (error) {
    showToast('Error al iniciar la recarga. Inténtalo de nuevo.', 'error')
  } finally {
    loading.value = false
  }
}

const openStripePortal = async () => {
  loading.value = true
  try {
    const res = await api.openPortal()
    if (res.url) {
      window.location.href = res.url
    }
  } catch (error: any) {
    showToast(error.response?.data?.message || 'Error al abrir el portal de pagos.', 'error')
  } finally {
    loading.value = false
  }
}

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchWallet()
  if (route.query.success) {
    showToast('¡Recarga completada con éxito!', 'success')
    // Limpiar query params sin recargar
    window.history.replaceState({}, '', window.location.pathname)
  }
  if (route.query.cancel) {
    showToast('La recarga ha sido cancelada.', 'info')
    window.history.replaceState({}, '', window.location.pathname)
  }
})
</script>
