<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-white uppercase tracking-tight">Mi Perfil</h2>
        <p class="text-sm text-slate-500 font-medium">Información de seguridad y acceso administrativo.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Información Personal</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-slate-500 uppercase ml-1">Nombre Completo</label>
              <div class="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
                {{ displayName }}
              </div>
            </div>
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-slate-500 uppercase ml-1">Correo Electrónico</label>
              <div class="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
                {{ displayEmail }}
              </div>
            </div>
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-slate-500 uppercase ml-1">Nivel de Acceso</label>
              <div class="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                <span class="material-icons text-sm">verified_user</span>
                Super Administrador
              </div>
            </div>
          </div>
        </div>

        <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 text-left">Seguridad</h3>
          <p class="text-sm text-slate-500 mb-6 text-left">Para cambiar tu contraseña o email, por favor contacta con el administrador de sistemas o utiliza la consola central.</p>
          <div class="flex justify-start">
            <button class="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest cursor-not-allowed">
              Cambiar Contraseña (Bloqueado)
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-8">
        <div class="p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 text-center text-white shadow-xl shadow-indigo-500/20">
          <div class="size-24 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/20 flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-2xl">
            {{ initials }}
          </div>
          <h3 class="text-lg font-black uppercase tracking-tight">{{ displayName }}</h3>
          <p class="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mt-1">SIMS Ecosystem Root</p>
          
          <div class="mt-8 pt-8 border-t border-white/10 space-y-4">
            <div class="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-100">
              <span>Sesión activa</span>
              <span class="text-white">Ahora</span>
            </div>
            <div class="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-100">
              <span>IP Origen</span>
              <span class="text-white">Registrada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCentralAuth } from '../composables/useCentralAuth'

const { user } = useCentralAuth()

const displayName = computed(() => user.value?.name || 'Super Admin')
const displayEmail = computed(() => user.value?.email || 'superadmin@sims.com')
const initials = computed(() =>
  displayName.value.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
)
</script>
