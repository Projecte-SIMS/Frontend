<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute -top-24 -right-24 size-96 bg-brand-primary-600/10 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -left-24 size-96 bg-brand-accent-600/10 rounded-full blur-3xl"></div>

    <div class="max-w-md w-full relative z-10 animate-fade-in">
      <div class="text-center mb-10">
        <div class="mx-auto mb-6 h-20 w-20 rounded-[2rem] bg-white p-1 shadow-2xl shadow-brand-primary-500/20 ring-1 ring-slate-200">
          <img src="/logo.png" alt="Fleetly Logo" class="h-full w-full object-contain" />
        </div>
        <h1 class="text-3xl font-black text-white uppercase tracking-tighter">SuperAdmin</h1>
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Control Central de Ecosistema</p>
      </div>

      <div class="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
        <form @submit.prevent="handleLogin" class="space-y-6 relative z-10">
          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Credenciales de Acceso</label>
            <div class="relative group">
              <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary-500 transition-colors text-xl">alternate_email</span>
              <input
                v-model="email"
                type="email"
                required
                class="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-primary-600 transition-all font-bold text-sm"
                placeholder="superadmin@sims.com"
              />
            </div>
          </div>

          <div class="space-y-2">
            <div class="relative group">
              <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary-500 transition-colors text-xl">lock</span>
              <input
                v-model="password"
                type="password"
                required
                class="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-primary-600 transition-all font-bold text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div v-if="error" class="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <span class="material-icons text-sm">error_outline</span>
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-4 bg-brand-primary-600 hover:bg-brand-primary-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-brand-primary-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="material-icons text-sm animate-spin">autorenew</span>
            <span v-else class="material-icons text-sm">vpn_key</span>
            {{ loading ? 'Autenticando...' : 'Acceder al Nodo Central' }}
          </button>
        </form>
        
        <!-- Decoration -->
        <div class="absolute -right-4 -bottom-4 size-24 bg-brand-primary-600/5 rounded-full blur-2xl"></div>
      </div>

      <div class="text-center mt-10">
        <router-link to="/login" class="text-[10px] font-black text-slate-500 hover:text-brand-primary-400 uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
          <span class="material-icons text-sm">arrow_back</span>
          Login de Empresa (Tenant)
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCentralAuth } from '../composables/useCentralAuth'

const route = useRoute()
const router = useRouter()
const { login, loading, error } = useCentralAuth()

const email = ref('')
const password = ref('')

onMounted(() => {
  if (route.query.expired === '1') {
    error.value = 'Tu sesión expiró. Inicia sesión de nuevo.'
  }
})

const handleLogin = async () => {
  try {
    await login(email.value, password.value)
    router.push('/superadmin/dashboard')
  } catch (e) {
    // Error handled in composable
  }
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
