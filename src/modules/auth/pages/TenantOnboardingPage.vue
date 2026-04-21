<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-950 font-sans lg:p-6">
    <div class="mx-auto grid min-h-screen max-w-7xl grid-cols-1 overflow-hidden lg:min-h-0 lg:grid-cols-2 lg:rounded-[2.5rem] lg:border lg:border-gray-200 lg:bg-white lg:shadow-2xl lg:shadow-brand-primary-500/10 dark:lg:border-gray-800 dark:lg:bg-gray-900">
      
      <!-- Lado Izquierdo: Contenido -->
      <section class="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12 overflow-y-auto">
        <div class="w-full max-w-md">
          <!-- Header -->
          <div class="mb-8">
            <div class="mb-5 flex items-center gap-3">
              <div class="h-14 w-14 rounded-2xl bg-white p-0.5 ring-1 ring-gray-100 shadow-xl shadow-brand-primary-500/30">
                <img src="/logo.png" alt="Fleetly Logo" class="h-full w-full object-contain" />
              </div>
              <div>
                <p class="text-xs font-black uppercase tracking-[0.16em] text-brand-primary-500">Business Solutions</p>
                <h1 class="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Alquila tu tenant</h1>
              </div>
            </div>
            
            <!-- Progress Indicator -->
            <div class="flex items-center gap-2 mb-6">
              <div v-for="i in 3" :key="i" class="h-1.5 flex-1 rounded-full transition-all duration-500" :class="[step >= i ? 'bg-brand-primary-500' : 'bg-gray-200 dark:bg-gray-800']"></div>
            </div>
          </div>

          <!-- Step 1: Empresa y Plan -->
          <div v-if="step === 1" class="bg-white dark:bg-gray-900 py-8 px-7 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-[2rem] fleetly-fade-up">
            <form class="space-y-5" @submit.prevent="goToPersonalInfoStep" novalidate>
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nombre empresa</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-primary-500 transition-colors">
                    <BuildingOfficeIcon class="size-5" />
                  </div>
                  <input
                    v-model="form.company_name"
                    type="text"
                    class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none"
                    placeholder="Fleetly Solutions S.L."
                  />
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Administrador (Nombre)</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-primary-500 transition-colors">
                    <UserIcon class="size-5" />
                  </div>
                  <input
                    v-model="form.admin_name"
                    type="text"
                    class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none"
                    placeholder="Juan Pérez"
                  />
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email corporativo</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-primary-500 transition-colors">
                    <EnvelopeIcon class="size-5" />
                  </div>
                  <input
                    v-model="form.admin_email"
                    type="text"
                    class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none"
                    placeholder="admin@tuempresa.com"
                  />
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Contraseña de acceso</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-primary-500 transition-colors">
                    <LockClosedIcon class="size-5" />
                  </div>
                  <input
                    v-model="form.admin_password"
                    type="password"
                    class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Plan</label>
                  <select v-model="form.plan" class="block w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none">
                    <option value="base">Base · 49€</option>
                    <option value="pro">Pro · 79€</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Pago (Demo)</label>
                  <select v-model="form.payment_method" class="block w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none">
                    <option value="card">Tarjeta</option>
                    <option value="wallet">Wallet</option>
                  </select>
                </div>
              </div>

              <!-- Theme Selection -->
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Tema de marca</label>
                <div class="grid grid-cols-5 gap-3">
                  <button
                    v-for="t in themes"
                    :key="t.id"
                    type="button"
                    @click="form.theme = t.id"
                    :class="[
                      form.theme === t.id ? 'ring-2 ring-brand-primary-500 ring-offset-2 dark:ring-offset-gray-900 scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'
                    ]"
                    class="group relative flex flex-col items-center transition-all"
                  >
                    <div :class="t.color" class="size-10 rounded-xl shadow-lg mb-1"></div>
                    <span class="text-[8px] font-black uppercase tracking-tighter text-gray-400 group-hover:text-gray-600 transition-colors">{{ t.name }}</span>
                  </button>
                </div>
              </div>

              <div class="pt-2">
                <button
                  type="submit"
                  class="flex w-full justify-center items-center gap-2 rounded-2xl bg-brand-primary-600 px-4 py-3.5 text-sm font-black uppercase tracking-widest text-white hover:bg-brand-primary-700 shadow-xl shadow-brand-primary-500/30 active:scale-95 transition-all"
                >
                  Siguiente paso
                </button>
              </div>
            </form>
          </div>

          <!-- Step 2: Información Personal/Fiscal -->
          <div v-else-if="step === 2" class="bg-white dark:bg-gray-900 py-8 px-7 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-[2rem] fleetly-fade-up">
            <h2 class="text-xl font-black text-gray-900 dark:text-white mb-4">Datos del titular</h2>
            
            <form class="space-y-4" @submit.prevent="goToPaymentStep" novalidate>
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Tipo de entidad</label>
                <div class="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    @click="form.entity_type = 'individual'"
                    :class="[form.entity_type === 'individual' ? 'bg-brand-primary-500 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-950 text-gray-500 border border-gray-100 dark:border-gray-800']"
                    class="py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Particular
                  </button>
                  <button 
                    type="button"
                    @click="form.entity_type = 'company'"
                    :class="[form.entity_type === 'company' ? 'bg-brand-primary-500 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-950 text-gray-500 border border-gray-100 dark:border-gray-800']"
                    class="py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Empresa
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  {{ form.entity_type === 'individual' ? 'NIF / DNI' : 'CIF Empresa' }}
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-primary-500 transition-colors">
                    <IdentificationIcon class="size-5" />
                  </div>
                  <input
                    v-model="form.tax_id"
                    type="text"
                    class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none"
                    placeholder="B12345678"
                  />
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Teléfono de contacto</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-primary-500 transition-colors">
                    <PhoneIcon class="size-5" />
                  </div>
                  <input
                    v-model="form.phone"
                    type="tel"
                    class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none"
                    placeholder="+34 600 000 000"
                  />
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Dirección fiscal</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-primary-500 transition-colors">
                    <MapPinIcon class="size-5" />
                  </div>
                  <input
                    v-model="form.address"
                    type="text"
                    class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none"
                    placeholder="Calle Principal 123"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Ciudad</label>
                  <input
                    v-model="form.city"
                    type="text"
                    class="block w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none"
                    placeholder="Madrid"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Código Postal</label>
                  <input
                    v-model="form.postal_code"
                    type="text"
                    class="block w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none"
                    placeholder="28001"
                  />
                </div>
              </div>

              <div class="pt-2 flex gap-3">
                <button
                  type="button"
                  @click="step = 1"
                  class="flex-1 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  class="flex-[2] justify-center items-center gap-2 rounded-2xl bg-brand-primary-600 px-4 py-3.5 text-sm font-black uppercase tracking-widest text-white hover:bg-brand-primary-700 shadow-xl shadow-brand-primary-500/30 active:scale-95 transition-all"
                >
                  Continuar al pago
                </button>
              </div>
            </form>
          </div>

          <!-- Step 3: Confirmación Pago -->
          <div v-else-if="step === 3" class="bg-white dark:bg-gray-900 py-8 px-7 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-[2rem] fleetly-fade-up">
            <h2 class="text-xl font-black text-gray-900 dark:text-white mb-2">Simulación de pago</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Revisa los datos antes de crear el entorno.</p>

            <div class="space-y-3 mb-8 bg-brand-primary-50/50 dark:bg-brand-primary-500/5 p-5 rounded-2xl border border-brand-primary-100 dark:border-brand-primary-500/20">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500 dark:text-gray-400 font-medium">Empresa</span>
                <span class="text-gray-900 dark:text-white font-black uppercase">{{ form.company_name }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500 dark:text-gray-400 font-medium">Titular</span>
                <span class="text-gray-900 dark:text-white font-bold">{{ form.admin_name }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500 dark:text-gray-400 font-medium">Plan</span>
                <span class="text-brand-primary-600 dark:text-brand-primary-400 font-black uppercase">{{ form.plan === 'pro' ? 'PROFESIONAL' : 'BÁSICO' }}</span>
              </div>
              <div class="border-t border-brand-primary-100 dark:border-brand-primary-500/20 pt-3 flex justify-between items-center">
                <span class="text-gray-900 dark:text-white font-bold">Total a pagar</span>
                <span class="text-lg font-black text-gray-900 dark:text-white">{{ form.plan === 'pro' ? '79,00€' : '49,00€' }}</span>
              </div>
            </div>

            <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
              <ExclamationCircleIcon class="size-4 shrink-0" />
              {{ error }}
            </div>

            <div class="space-y-3">
              <button
                @click="completeDemoPayment"
                :disabled="loading"
                class="flex w-full justify-center items-center gap-2 rounded-2xl bg-brand-secondary-600 px-4 py-3.5 text-sm font-black uppercase tracking-widest text-white hover:bg-brand-secondary-700 shadow-xl shadow-brand-secondary-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                <ArrowPathIcon v-if="loading" class="size-5 animate-spin" />
                {{ loading ? 'Procesando creación...' : 'Confirmar pago y crear' }}
              </button>
              <button
                @click="step = 2"
                :disabled="loading"
                class="w-full text-center py-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                Volver a edición
              </button>
            </div>
          </div>

          <!-- Step 4: Éxito -->
          <div v-else class="bg-white dark:bg-gray-900 py-10 px-7 text-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-none border border-brand-secondary-100 dark:border-brand-secondary-500/20 rounded-[2rem] fleetly-fade-up">
            <div class="size-20 bg-brand-secondary-100 dark:bg-brand-secondary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon class="size-10 text-brand-secondary-600 dark:text-brand-secondary-400" />
            </div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-2">¡Tenant activado!</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Tu entorno exclusivo ha sido creado con éxito. Ya puedes empezar a gestionar tu flota.
            </p>

            <div class="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 text-left mb-8 space-y-2">
              <p class="text-xs text-gray-400 font-black uppercase tracking-widest mb-3">Acceso directo</p>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Tenant ID:</span>
                <span class="font-black text-brand-primary-600 dark:text-brand-primary-400">{{ result?.tenant_id }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Email:</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ result?.login?.email }}</span>
              </div>
            </div>

            <button
              @click="goToLogin"
              class="flex w-full justify-center items-center gap-2 rounded-2xl bg-brand-primary-600 px-4 py-3.5 text-sm font-black uppercase tracking-widest text-white hover:bg-brand-primary-700 shadow-xl shadow-brand-primary-500/30 active:scale-95 transition-all"
            >
              Ir a mi panel de control
            </button>
          </div>

          <div class="mt-8 text-center">
            <RouterLink to="/login" class="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-brand-primary-500 transition-colors">
              Volver al inicio
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- Lado Derecho: Imagen -->
      <section class="relative hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80"
          alt="Fleetly Enterprise"
          class="h-full w-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-br from-brand-primary-900/80 via-brand-primary-800/50 to-brand-secondary-900/70"></div>
        <div class="absolute left-8 top-8 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
          <div class="h-12 w-12 rounded-xl bg-white p-0.5 shadow-lg">
            <img src="/logo.png" alt="Fleetly Logo" class="h-full w-full object-contain" />
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.16em] text-brand-primary-100/90">Enterprise Cloud</p>
            <p class="text-xl font-black text-white leading-none">Fleetly Hub</p>
          </div>
        </div>
        <div class="absolute left-8 right-8 bottom-8 rounded-2xl border border-white/15 bg-black/25 p-6 backdrop-blur-sm">
          <h2 class="text-2xl font-black text-white leading-tight">Escala tu negocio de movilidad.</h2>
          <p class="mt-2 text-sm text-brand-primary-100/90">Infraestructura multi-inquilino robusta, segura y lista para operar en minutos.</p>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { centralApi } from '@/services/centralApi'
import { useToast } from '@/modules/common/composables/useToast'
import { useTheme } from '@/modules/common/composables/useTheme'
import {
  BuildingOfficeIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  IdentificationIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const toast = useToast()
const { setBrandTheme } = useTheme()
const step = ref<1 | 2 | 3 | 4>(1)
const loading = ref(false)
const error = ref('')
const result = ref<any>(null)

const form = reactive({
  company_name: '',
  company_slug: '',
  admin_name: '',
  admin_email: '',
  admin_password: '',
  website: '', // Honeypot
  plan: 'base' as 'base' | 'pro',
  theme: 'indigo',
  payment_method: 'card' as 'card' | 'sepa' | 'transfer' | 'wallet',
  // New personal/legal info fields
  entity_type: 'company' as 'individual' | 'company',
  tax_id: '',
  phone: '',
  address: '',
  city: '',
  postal_code: '',
})

const themes = [
  { id: 'indigo', name: 'Crimson', color: 'bg-[#ef4444]' },
  { id: 'ocean', name: 'Ocean', color: 'bg-blue-600' },
  { id: 'sunset', name: 'Sunset', color: 'bg-amber-500' },
  { id: 'nature', name: 'Nature', color: 'bg-emerald-600' },
  { id: 'royal', name: 'Royal', color: 'bg-purple-600' },
  { id: 'baltic', name: 'Baltic', color: 'bg-[#26619C]' },
]

// Instant theme preview
watch(() => form.theme, (newTheme) => {
  setBrandTheme(newTheme)
})

const goToPersonalInfoStep = () => {
  // Honeypot check
  if (form.website) return

  // Basic validations for Step 1
  if (!form.company_name.trim()) return toast.error('El nombre de la empresa es obligatorio')
  if (!form.admin_name.trim()) return toast.error('El nombre del administrador es obligatorio')
  if (!form.admin_email.trim()) return toast.error('El email es obligatorio')
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.admin_email)) return toast.error('El formato del email no es válido')
  
  if (!form.admin_password || form.admin_password.length < 8) {
    return toast.error('La contraseña debe tener al menos 8 caracteres')
  }

  step.value = 2
}

const goToPaymentStep = () => {
  if (!form.tax_id.trim()) return toast.error('El NIF/CIF es obligatorio')
  step.value = 3
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
      theme: form.theme,
      entity_type: form.entity_type,
      tax_id: form.tax_id,
      phone: form.phone,
      address: form.address,
      city: form.city,
      postal_code: form.postal_code,
      payment_demo_confirmed: true,
      billing_name: form.company_name,
      billing_email: form.admin_email,
      payment_method: form.payment_method,
      country: 'ES',
    })
    result.value = response.data
    step.value = 4
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
