<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8 fleetly-fade-up">
    <div class="max-w-3xl mx-auto">
      <div class="mb-5 flex items-center justify-between gap-3">
        <button
          @click="router.push('/superadmin/dashboard')"
          class="px-3 py-2 rounded-lg border border-slate-600/70 text-slate-200 hover:bg-slate-800/70 transition-colors text-sm"
        >
          ← Volver al panel
        </button>
      </div>

      <section class="rounded-2xl border border-slate-700/70 bg-slate-800/55 backdrop-blur p-6 md:p-8">
        <div class="flex items-center gap-4">
          <div class="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-lg font-bold flex items-center justify-center">
            {{ initials }}
          </div>
          <div>
            <h1 class="text-xl md:text-2xl font-bold text-white">Mi perfil</h1>
            <p class="text-sm text-slate-400">Información de la sesión de superadministrador</p>
          </div>
        </div>

        <div class="mt-6 grid gap-3">
          <div class="rounded-lg border border-slate-700/70 bg-slate-900/45 p-4">
            <p class="text-xs uppercase tracking-widest text-slate-500 font-black">Nombre</p>
            <p class="mt-1 text-white font-semibold">{{ displayName }}</p>
          </div>
          <div class="rounded-lg border border-slate-700/70 bg-slate-900/45 p-4">
            <p class="text-xs uppercase tracking-widest text-slate-500 font-black">Email</p>
            <p class="mt-1 text-white font-semibold">{{ displayEmail }}</p>
          </div>
          <div class="rounded-lg border border-slate-700/70 bg-slate-900/45 p-4">
            <p class="text-xs uppercase tracking-widest text-slate-500 font-black">Rol</p>
            <p class="mt-1 text-white font-semibold">Super Admin</p>
          </div>
        </div>

        <button
          @click="handleLogout"
          class="mt-6 px-4 py-2 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/10 transition-colors text-sm"
        >
          Cerrar sesión
        </button>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCentralAuth } from '../composables/useCentralAuth'

const router = useRouter()
const { user, logout, checkAuth } = useCentralAuth()

const displayName = computed(() => user.value?.name || 'Super Admin')
const displayEmail = computed(() => user.value?.email || 'superadmin@sims.com')
const initials = computed(() =>
  displayName.value
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
)

const handleLogout = () => {
  logout()
  router.replace('/superadmin/login')
}

onMounted(() => {
  if (!checkAuth()) {
    logout()
    router.replace({ path: '/superadmin/login', query: { expired: '1' } })
  }
})
</script>
