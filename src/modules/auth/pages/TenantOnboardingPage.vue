<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-950 font-sans py-8 px-4">
    <div class="mx-auto max-w-3xl">
      <div class="mb-6 text-center">
        <h1 class="text-3xl font-black text-gray-900 dark:text-white">Alquila tu tenant Fleetly</h1>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Completa tus datos de empresa y simula el pago para crear tu entorno.
        </p>
      </div>

      <div v-if="step === 1" class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl">
        <h2 class="text-lg font-black text-gray-900 dark:text-white mb-4">Datos de empresa</h2>

        <form class="grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent="goToPaymentStep">
          <div class="md:col-span-2">
            <label class="block text-xs uppercase tracking-widest font-black text-gray-400 mb-1">Nombre empresa</label>
            <input v-model="form.company_name" required class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-xs uppercase tracking-widest font-black text-gray-400 mb-1">Slug tenant (opcional)</label>
            <input v-model="form.company_slug" placeholder="mi-empresa" class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white" />
          </div>

          <div>
            <label class="block text-xs uppercase tracking-widest font-black text-gray-400 mb-1">Administrador</label>
            <input v-model="form.admin_name" required class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest font-black text-gray-400 mb-1">Email admin</label>
            <input v-model="form.admin_email" required type="email" class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white" />
          </div>

          <div>
            <label class="block text-xs uppercase tracking-widest font-black text-gray-400 mb-1">Contraseña inicial</label>
            <input v-model="form.admin_password" required minlength="8" type="password" class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest font-black text-gray-400 mb-1">Plan</label>
            <select v-model="form.plan" class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
              <option value="base">Base · 49€/mes</option>
              <option value="pro">Pro · 79€/mes</option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label class="block text-xs uppercase tracking-widest font-black text-gray-400 mb-1">Método de pago (demo)</label>
            <select v-model="form.payment_method" class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
              <option value="card">Tarjeta</option>
              <option value="sepa">SEPA</option>
              <option value="transfer">Transferencia</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>

          <div class="md:col-span-2 flex justify-end">
            <button type="submit" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
              Ir a pago demo
            </button>
          </div>
        </form>
      </div>

      <div v-else-if="step === 2" class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl">
        <h2 class="text-lg font-black text-gray-900 dark:text-white mb-3">Pago y creación (modo demo)</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Simula el checkout de billing. Al confirmar, se crea el tenant y se configura el método de pago demo.
        </p>

        <div class="rounded-xl border border-indigo-300/40 bg-indigo-50 dark:bg-indigo-900/20 p-4 text-sm mb-5">
          <p><strong>Empresa:</strong> {{ form.company_name }}</p>
          <p><strong>Administrador:</strong> {{ form.admin_email }}</p>
          <p><strong>Plan:</strong> {{ form.plan === 'pro' ? 'Pro · 79€/mes' : 'Base · 49€/mes' }}</p>
          <p><strong>Método:</strong> {{ form.payment_method }}</p>
        </div>

        <div v-if="error" class="mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-3 text-sm font-semibold">
          {{ error }}
        </div>

        <div class="flex flex-wrap gap-3 justify-end">
          <button @click="step = 1" class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200">
            Volver
          </button>
          <button
            @click="completeDemoPayment"
            :disabled="loading"
            class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-60"
          >
            {{ loading ? 'Procesando…' : 'Pagar en modo demo y crear tenant' }}
          </button>
        </div>
      </div>

      <div v-else class="bg-white dark:bg-gray-900 rounded-3xl border border-emerald-300/40 p-6 shadow-xl">
        <h2 class="text-lg font-black text-emerald-600 dark:text-emerald-300 mb-2">Tenant creado correctamente</h2>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Ya puedes iniciar sesión con tu empresa.
        </p>
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-4 text-sm mb-4">
          <p><strong>Tenant:</strong> {{ result.tenant_id }}</p>
          <p><strong>Dominio:</strong> {{ result.tenant_domain }}</p>
          <p><strong>Email admin:</strong> {{ result.login?.email }}</p>
        </div>
        <button @click="goToLogin" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
          Ir al login de mi tenant
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { centralApi } from '@/services/centralApi'

const router = useRouter()
const step = ref<1 | 2 | 3>(1)
const loading = ref(false)
const error = ref('')
const result = ref<any>(null)

const form = reactive({
  company_name: '',
  company_slug: '',
  admin_name: '',
  admin_email: '',
  admin_password: '',
  plan: 'base' as 'base' | 'pro',
  payment_method: 'card' as 'card' | 'sepa' | 'transfer' | 'wallet',
})

const goToPaymentStep = () => {
  error.value = ''
  step.value = 2
}

const completeDemoPayment = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await centralApi.completeDemoTenantOnboarding({
      company_name: form.company_name,
      company_slug: form.company_slug || undefined,
      admin_name: form.admin_name,
      admin_email: form.admin_email,
      admin_password: form.admin_password,
      plan: form.plan,
      payment_demo_confirmed: true,
      billing_name: form.company_name,
      billing_email: form.admin_email,
      payment_method: form.payment_method,
      country: 'ES',
    })
    result.value = response.data
    step.value = 3
  } catch (e: any) {
    error.value = e.response?.data?.message || 'No se pudo completar el pago demo'
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  if (!result.value?.login?.tenant) {
    router.push('/login')
    return
  }
  router.push({
    path: '/login',
    query: {
      tenant: result.value.login.tenant,
      email: result.value.login.email || '',
    },
  })
}
</script>

