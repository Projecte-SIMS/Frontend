<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-950 font-sans lg:p-6">
    <div class="mx-auto grid min-h-screen max-w-7xl grid-cols-1 overflow-hidden lg:min-h-0 lg:grid-cols-2 lg:rounded-[2.5rem] lg:border lg:border-gray-200 lg:bg-white lg:shadow-2xl lg:shadow-brand-primary-500/10 dark:lg:border-gray-800 dark:lg:bg-gray-900">
      
      <!-- Lado Izquierdo: Formulario -->
      <section class="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
        <div class="w-full max-w-md">
          <div class="mb-8">
            <div class="mb-5 flex items-center gap-3">
              <div class="h-14 w-14 rounded-2xl bg-white p-0.5 ring-1 ring-gray-100 shadow-xl shadow-brand-primary-500/30">
                <img src="/logo.png" alt="Fleetly Logo" class="h-full w-full object-contain" />
              </div>
              <div>
                <p class="text-xs font-black uppercase tracking-[0.16em] text-brand-primary-500">Únete a la flota</p>
                <h1 class="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                  Crea tu cuenta
                  <span v-if="isAutoTenant" class="inline-flex items-center rounded-lg bg-brand-primary-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-brand-primary-600 ring-1 ring-inset ring-brand-primary-500/20 dark:bg-brand-primary-500/10 dark:text-brand-primary-400">
                    {{ tenant }}
                  </span>
                </h1>
              </div>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Empieza a gestionar tu movilidad inteligente con Fleetly.
            </p>
          </div>

          <div class="bg-white dark:bg-gray-900 py-8 px-7 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-[2rem]">
            <form class="space-y-5" @submit.prevent="handleSubmit" novalidate>
              <!-- Empresa (Tenant) -->
              <div v-if="!isAutoTenant">
                <label for="tenant" class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Empresa</label>
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
                    placeholder="nombre-empresa"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <!-- Nombre Completo -->
                <div>
                  <label for="name" class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nombre</label>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-primary-500 transition-colors">
                      <UserIcon class="size-5" />
                    </div>
                    <input
                      id="name"
                      v-model="name"
                      type="text"
                      :disabled="isLoading"
                      class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none"
                      placeholder="Tu nombre"
                    />
                  </div>
                </div>

                <!-- Usuario -->
                <div>
                  <label for="username" class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Usuario</label>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-primary-500 transition-colors">
                      <AtSymbolIcon class="size-5" />
                    </div>
                    <input
                      id="username"
                      v-model="username"
                      type="text"
                      :disabled="isLoading"
                      class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none"
                      placeholder="juanperez"
                    />
                  </div>
                </div>
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Correo Electrónico</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-primary-500 transition-colors">
                    <EnvelopeIcon class="size-5" />
                  </div>
                  <input
                    id="email"
                    v-model="email"
                    type="text"
                    :disabled="isLoading"
                    class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <!-- Password -->
              <div>
                <label for="password" class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Contraseña</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-primary-500 transition-colors">
                    <LockClosedIcon class="size-5" />
                  </div>
                  <input
                    id="password"
                    v-model="password"
                    type="password"
                    :disabled="isLoading"
                    class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary-500 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <!-- Honeypot (Anti-bot) -->
              <div class="hidden" aria-hidden="true">
                <input v-model="website" type="text" name="website" tabindex="-1" autocomplete="off" />
              </div>

              <div class="pt-2">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="flex w-full justify-center items-center gap-2 rounded-2xl bg-brand-primary-600 px-4 py-3.5 text-sm font-black uppercase tracking-widest text-white hover:bg-brand-primary-700 shadow-xl shadow-brand-primary-500/30 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  <ArrowPathIcon v-if="isLoading" class="size-5 animate-spin" />
                  {{ isLoading ? 'Procesando...' : 'Registrarme' }}
                </button>
              </div>
            </form>

            <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <p class="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                ¿Ya tienes cuenta?
                <RouterLink to="/login" class="font-bold text-brand-primary-600 dark:text-brand-primary-400 hover:underline">Inicia sesión</RouterLink>
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Lado Derecho: Imagen (Hidden on mobile) -->
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
            <p class="text-[10px] font-black uppercase tracking-[0.16em] text-brand-primary-100/90">Smart Mobility</p>
            <p class="text-xl font-black text-white leading-none">Fleetly</p>
          </div>
        </div>
        <div class="absolute left-8 right-8 bottom-8 rounded-2xl border border-white/15 bg-black/25 p-6 backdrop-blur-sm">
          <h2 class="text-2xl font-black text-white leading-tight">Únete a la revolución de la movilidad.</h2>
          <p class="mt-2 text-sm text-brand-primary-100/90">Regístrate y accede a toda nuestra flota de vehículos inteligentes al instante.</p>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { getCurrentTenant } from '@/services/api'
import showToast from '@/modules/common/composables/useToast'
import {
  UserIcon,
  AtSymbolIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BuildingOfficeIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const { register, isLoading } = useAuth()

const tenant = ref('')
const isAutoTenant = ref(false)
const website = ref('') // Honeypot field
const name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')

onMounted(() => {
  const currentTenant = getCurrentTenant()
  if (currentTenant) {
    tenant.value = currentTenant
    isAutoTenant.value = true
  }
})

const handleSubmit = async () => {
  // Honeypot check: if 'website' is filled, it's likely a bot
  if (website.value) {
    console.warn('Bot detected via honeypot')
    return
  }

  if (!tenant.value.trim()) return showToast('Especifica tu empresa', 'error')
  if (!name.value.trim()) return showToast('El nombre es obligatorio', 'error')
  if (!username.value.trim()) return showToast('El usuario es obligatorio', 'error')
  
  if (!email.value.trim()) {
    return showToast('El email es obligatorio', 'error')
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    return showToast('El formato del email no es válido', 'error')
  }

  if (!password.value.trim()) return showToast('La contraseña es obligatoria', 'error')
  if (password.value.length < 6) return showToast('La contraseña debe tener al menos 6 caracteres', 'error')

  await register(
    name.value,
    username.value,
    email.value,
    password.value,
    tenant.value.toLowerCase().trim()
  )
}
</script>
