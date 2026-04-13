<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 fleetly-fade-up">
    <!-- Header Premium -->
    <header class="bg-gradient-to-r from-blue-900/80 to-indigo-900/80 backdrop-blur-xl border-b border-blue-500/20 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 py-4 space-y-3">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-4">
            <div class="h-14 w-14 rounded-xl bg-white p-0.5 ring-1 ring-gray-100 shadow-lg shadow-indigo-500/25">
              <img src="/logo.png" alt="Fleetly Logo" class="h-full w-full object-contain" />
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Panel SuperAdmin
              </h1>
              <p class="text-xs text-blue-300/60">Gestión de empresas multi-tenant</p>
            </div>
          </div>
          <div class="relative superadmin-user-menu">
            <button
              @click.stop="showUserMenu = !showUserMenu"
              class="px-3 py-2 text-gray-200 hover:text-white bg-slate-900/35 hover:bg-slate-900/50 transition-all rounded-lg border border-blue-500/20 hover:border-blue-400/40 flex items-center gap-2"
            >
              <span class="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold flex items-center justify-center">
                {{ userInitials }}
              </span>
              <span class="hidden sm:flex flex-col items-start leading-tight">
                <span class="text-xs font-semibold">{{ userDisplayName }}</span>
                <span class="text-[10px] text-blue-200/80">{{ userDisplayEmail }}</span>
              </span>
              <svg class="w-4 h-4 text-blue-200/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-56 rounded-xl border border-slate-700/80 bg-slate-900/95 backdrop-blur shadow-xl overflow-hidden z-50"
            >
              <div class="px-3 py-2 border-b border-slate-700/70">
                <p class="text-xs font-semibold text-white truncate">{{ userDisplayName }}</p>
                <p class="text-[11px] text-slate-400 truncate">{{ userDisplayEmail }}</p>
              </div>
              <button
                @click="goToProfile"
                class="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800/80 transition-colors flex items-center gap-2"
              >
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Mi perfil
              </button>
              <button
                @click="handleLogout"
                class="w-full px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-7.5a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 006 21h7.5a2.25 2.25 0 002.25-2.25V15m-7.5-3h12m0 0l-3-3m3 3l-3 3" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            @click="activeTab = 'overview'"
            :class="[
              'px-3 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all',
              activeTab === 'overview'
                ? 'text-blue-100 bg-blue-700/50 border border-blue-400/40'
                : 'text-slate-300 bg-slate-900/40 border border-slate-700/60 hover:bg-slate-700/40'
            ]"
          >
            Resumen general
          </button>
          <button
            @click="activeTab = 'tenants'"
            :class="[
              'px-3 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all',
              activeTab === 'tenants'
                ? 'text-sky-100 bg-sky-700/50 border border-sky-400/40'
                : 'text-slate-300 bg-slate-900/40 border border-slate-700/60 hover:bg-slate-700/40'
            ]"
          >
            Gestionar empresas
          </button>
          <button
            @click="activeTab = 'create'"
            :class="[
              'px-3 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-lg',
              activeTab === 'create'
                ? 'text-white bg-gradient-to-r from-indigo-600 to-blue-600 border border-indigo-300/40 shadow-indigo-900/50 scale-[1.01]'
                : 'text-indigo-100 bg-gradient-to-r from-indigo-700/50 to-blue-700/40 border border-indigo-500/40 hover:from-indigo-600/60 hover:to-blue-600/50 hover:border-indigo-300/50'
            ]"
          >
            Crear empresa
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div
        v-if="billingNotice"
        class="rounded-xl border border-emerald-500/40 bg-emerald-900/20 px-4 py-3 flex items-start justify-between gap-3"
      >
        <div>
          <p class="text-sm font-semibold text-emerald-200">{{ billingNotice }}</p>
          <p class="text-xs text-emerald-300/80 mt-1">La información de facturación se ha actualizado en el panel.</p>
        </div>
        <button
          @click="billingNotice = ''"
          class="text-emerald-300/80 hover:text-emerald-100 transition-colors"
          title="Cerrar aviso"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Overview -->
      <section id="superadmin-overview" v-show="activeTab === 'overview'">
        <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 class="text-xl font-black text-white">Resumen general</h2>
            <p class="text-sm text-slate-400">Control ejecutivo de operación, crecimiento y facturación.</p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/40 bg-emerald-900/25 text-emerald-300">
            Sistema operativo
          </span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div class="bg-gradient-to-br from-blue-900/50 to-blue-800/25 backdrop-blur rounded-2xl p-5 border border-blue-500/25 hover:border-blue-400/45 transition-all fleetly-card-hover">
              <p class="text-xs font-black uppercase tracking-widest text-blue-300/70">Empresas activas</p>
              <p class="mt-2 text-4xl font-black text-white">{{ tenants.length }}</p>
              <p class="text-xs text-blue-200/60 mt-1">Tenants registrados en plataforma</p>
            </div>
            <div class="bg-gradient-to-br from-purple-900/50 to-purple-800/25 backdrop-blur rounded-2xl p-5 border border-purple-500/25 hover:border-purple-400/45 transition-all fleetly-card-hover">
              <p class="text-xs font-black uppercase tracking-widest text-purple-300/70">Usuarios estimados</p>
              <p class="mt-2 text-4xl font-black text-white">{{ totalUsers }}</p>
              <p class="text-xs text-purple-200/60 mt-1">Métrica operativa global</p>
            </div>
            <div class="bg-gradient-to-br from-emerald-900/50 to-emerald-800/25 backdrop-blur rounded-2xl p-5 border border-emerald-500/25 hover:border-emerald-400/45 transition-all fleetly-card-hover">
              <p class="text-xs font-black uppercase tracking-widest text-emerald-300/70">MRR estimado</p>
              <p class="mt-2 text-4xl font-black text-white">{{ formatCents(estimatedMRR) }}</p>
              <p class="text-xs text-emerald-200/60 mt-1">{{ planPriceLabel }} por empresa/mes</p>
            </div>
            <div class="bg-gradient-to-br from-indigo-900/50 to-indigo-800/25 backdrop-blur rounded-2xl p-5 border border-indigo-500/25 hover:border-indigo-400/45 transition-all fleetly-card-hover">
              <p class="text-xs font-black uppercase tracking-widest text-indigo-300/70">Estado de infraestructura</p>
              <p class="mt-2 text-lg font-bold text-white flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Operativa
              </p>
              <p class="text-xs text-indigo-200/60 mt-2">Servicios centrales sin incidencias</p>
            </div>
        </div>
      </section>

      <!-- Create Tenant Section -->
      <section id="superadmin-create" v-show="activeTab === 'create'" class="space-y-3">
        <div>
          <h2 class="text-xl font-black text-white">Crear nueva empresa</h2>
          <p class="text-sm text-slate-400">Onboarding profesional de nuevas compañías con estructura SaaS.</p>
        </div>
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div class="xl:col-span-2 xl:order-2 bg-gradient-to-br from-gray-800/65 to-gray-900/70 backdrop-blur rounded-2xl p-6 border border-gray-700/60 fleetly-card-hover">
            <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.5H9a1 1 0 100 2h2a1 1 0 100-2h-1V7z" clip-rule="evenodd"/>
              </svg>
              Alta de empresa
            </h2>
            <form @submit.prevent="showCreateModal" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-300 text-sm font-medium mb-2">Identificador (lowercase)</label>
                  <input
                    v-model="newTenantId"
                    type="text"
                    required
                    placeholder="ej: miempresa"
                    class="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <p class="text-xs text-gray-400 mt-1">Solo letras minúsculas, números y guiones</p>
                </div>
                <div>
                  <label class="block text-gray-300 text-sm font-medium mb-2">URL de Acceso</label>
                  <div class="w-full px-4 py-2.5 bg-gray-600/30 border border-gray-600/50 rounded-lg text-blue-300 font-mono text-sm flex items-center">
                    <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M12.586 4.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM9.172 9.172a2 2 0 012.828 0l.793-.793a4 4 0 00-5.656 0l.793.793zm6.364-1.414a2 2 0 012.828 2.828l-.793.793 2.828 2.828-.793.793a4 4 0 01-5.656-5.656l.793-.793z"/>
                    </svg>
                    <span class="ml-2 truncate">{{ generatedUrl || 'Se generará automáticamente...' }}</span>
                  </div>
                </div>
              </div>

              <div class="rounded-lg border border-amber-500/30 bg-amber-900/20 px-3 py-2 text-xs text-amber-200 flex items-center justify-between gap-2">
                <span class="font-semibold">Credenciales iniciales:</span>
                <span class="font-mono">admin@sims.com / password</span>
              </div>

              <button
                type="submit"
                :disabled="creating || !newTenantId"
                class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <svg v-if="!creating" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.5H9a1 1 0 100 2h2a1 1 0 100-2h-1V7z" clip-rule="evenodd"/>
                </svg>
                <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ creating ? 'Creando...' : 'Crear empresa ahora' }}
              </button>
            </form>
          </div>

          <div class="space-y-4 xl:order-1">
            <div class="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4">
              <h3 class="text-sm font-black uppercase tracking-widest text-slate-300">Onboarding checklist</h3>
              <div class="mt-3 space-y-2 text-sm text-slate-300/85">
                <p>1. Crear tenant y validar URL.</p>
                <p>2. Entregar credenciales iniciales.</p>
                <p>3. Confirmar primer login del cliente.</p>
              </div>
            </div>
            <div class="rounded-2xl border border-emerald-500/35 bg-emerald-900/20 p-4">
              <h3 class="text-sm font-black uppercase tracking-widest text-emerald-200">Facturación recomendada</h3>
              <p class="mt-2 text-sm text-emerald-100/85">Cobro mensual por tenant con pasarela Stripe y bloqueo por impago.</p>
              <div class="mt-3 rounded-lg bg-emerald-950/40 border border-emerald-700/50 p-3">
                <p class="text-xs text-emerald-300/80">Precio base sugerido</p>
                <p class="text-xl font-black text-white">{{ planPriceLabel }} <span class="text-sm font-semibold text-emerald-200/80">/ mes</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Company Summary -->
      <section v-show="activeTab === 'overview'" class="space-y-3">
        <div>
          <h2 class="text-lg font-black text-white">Resumen por empresa</h2>
          <p class="text-sm text-slate-400">Indicadores operativos y de ingresos estimados para priorizar gestión.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          <div
            v-for="tenant in companySnapshots"
            :key="`summary-${tenant.id}`"
            class="rounded-xl border border-slate-700/70 bg-slate-800/50 p-4 hover:border-blue-500/40 transition-all fleetly-card-hover"
          >
            <div class="flex items-center justify-between gap-3">
              <h3 class="font-bold text-white truncate">{{ tenant.id }}</h3>
              <div class="flex items-center gap-1.5">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-emerald-900/40 text-emerald-300 border border-emerald-700/50">Activo</span>
                <span :class="getPaymentBadgeClass(tenant)" class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border">{{ getPaymentStatus(tenant) }}</span>
              </div>
            </div>
            <div class="mt-3 grid grid-cols-2 gap-2">
              <div class="rounded-lg bg-slate-900/50 p-2 border border-slate-700/50">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">Usuarios</p>
                <p class="text-sm font-bold text-white">{{ getTenantUsersEstimate(tenant.id) }}</p>
              </div>
              <div class="rounded-lg bg-slate-900/50 p-2 border border-slate-700/50">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">MRR</p>
                <p class="text-sm font-bold text-emerald-300">{{ formatCents(getTenantMonthlyRevenueCents(tenant)) }}</p>
              </div>
              <div class="rounded-lg bg-slate-900/50 p-2 border border-slate-700/50">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">ARR</p>
                <p class="text-sm font-bold text-sky-300">{{ formatCents(getTenantAnnualRevenueCents(tenant)) }}</p>
              </div>
              <div class="rounded-lg bg-slate-900/50 p-2 border border-slate-700/50">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">Alta</p>
                <p class="text-sm font-bold text-white">{{ formatDateShort(tenant.created_at) }}</p>
              </div>
              <div class="rounded-lg bg-slate-900/50 p-2 border border-slate-700/50">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">Última factura</p>
                <p class="text-sm font-bold text-white">{{ getLastInvoiceDate(tenant) }}</p>
              </div>
              <div class="rounded-lg bg-slate-900/50 p-2 border border-slate-700/50">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">Salud</p>
                <p class="text-sm font-bold" :class="getHealthClass(tenant)">{{ getTenantHealth(tenant) }}</p>
              </div>
            </div>
            <div class="mt-3">
              <a :href="getTenantUrl(tenant.id)" target="_blank" class="text-[11px] font-mono text-blue-300 hover:text-blue-200 break-all">
                {{ getTenantUrl(tenant.id) }}
              </a>
              <p class="mt-1 text-[11px] text-slate-400">
                {{ getTenantDemoPaymentSummary(tenant) }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Tenants List -->
      <section id="superadmin-tenants" v-show="activeTab === 'tenants'" class="space-y-3">
        <div>
          <h2 class="text-xl font-black text-white">Gestionar empresas</h2>
          <p class="text-sm text-slate-400">Centro operativo para gestionar acceso, seguridad y ciclo de vida de tenants.</p>
        </div>
      <div class="bg-gradient-to-br from-gray-800/60 to-gray-900/65 backdrop-blur rounded-2xl overflow-hidden border border-gray-700/60 fleetly-card-hover">
        <div class="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div v-if="filteredTenants.length > 0" class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="selectAll"
                @change="toggleSelectAll"
                class="w-4 h-4 rounded"
                title="Seleccionar todas"
              />
            </div>
            <h2 class="text-lg font-semibold text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
              Empresas Registradas ({{ tenants.length }})
            </h2>
            <div v-if="selectedTenants.size > 0" class="text-sm text-yellow-300">
              {{ selectedTenants.size }} seleccionada(s)
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar empresa..."
                class="px-3 py-1.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div v-if="loading" class="p-12 text-center text-gray-400 flex items-center justify-center gap-2">
          <svg class="w-4 h-4 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Cargando empresas...
        </div>

        <div v-else-if="filteredTenants.length === 0" class="p-12 text-center text-gray-400 fleetly-empty-state">
          <p class="text-lg">No hay empresas registradas</p>
          <button
            @click="activeTab = 'create'"
            class="mt-3 px-3 py-2 rounded-lg border border-indigo-500/40 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-200 text-sm transition-colors"
          >
            Ir a Crear empresa
          </button>
        </div>

        <div v-else class="p-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
          <article
            v-for="tenant in filteredTenants"
            :key="tenant.id"
            @click="toggleTenantExpanded(tenant.id)"
            class="rounded-xl border border-gray-700/70 bg-slate-800/50 p-4 transition-all cursor-pointer hover:border-blue-500/40"
            :class="{ 'ring-1 ring-blue-500/40 border-blue-500/60': isTenantExpanded(tenant.id) }"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3 min-w-0">
                <input
                  type="checkbox"
                  :checked="selectedTenants.has(tenant.id)"
                  @click.stop
                  @change="toggleTenantSelect(tenant.id)"
                  class="mt-1 w-4 h-4 rounded"
                />
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="font-bold text-white text-base">{{ tenant.id }}</h3>
                    <span :class="getPaymentBadgeClass(tenant)" class="inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded border">
                      {{ getPaymentStatus(tenant) }}
                    </span>
                    <span :class="getAccessBadgeClass(tenant)" class="inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded border">
                      {{ getTenantAccessLabel(tenant) }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-400 mt-1">{{ formatDate(tenant.created_at) }}</p>
                  <p class="text-xs text-indigo-300/90 mt-1">{{ getTenantDemoPaymentSummary(tenant) }}</p>
                </div>
              </div>
              <button
                @click.stop="toggleTenantExpanded(tenant.id)"
                class="text-xs px-2 py-1 rounded-md border border-slate-600/70 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
              >
                {{ isTenantExpanded(tenant.id) ? 'Ocultar' : 'Ver más' }}
              </button>
            </div>

            <div class="mt-3 flex flex-wrap items-center gap-2">
              <button
                @click.stop="openCheckoutForTenant(tenant.id)"
                :disabled="billingLoadingByTenant[tenant.id] === 'checkout'"
                class="px-3 py-1.5 text-sm bg-emerald-600/20 hover:bg-emerald-600/40 disabled:opacity-60 text-emerald-300 rounded-lg transition-all flex items-center gap-1.5"
                title="Cobrar suscripción"
              >
                Cobrar
              </button>
              <button
                @click.stop="simulateBillingUpdateForTenant(tenant)"
                :disabled="billingLoadingByTenant[tenant.id] === 'demo_update'"
                class="px-3 py-1.5 text-sm bg-indigo-600/20 hover:bg-indigo-600/40 disabled:opacity-60 text-indigo-300 rounded-lg transition-all flex items-center gap-1.5"
                title="Simular actualización desde billing"
              >
                {{ billingLoadingByTenant[tenant.id] === 'demo_update' ? 'Actualizando…' : 'Actualizar pago (demo)' }}
              </button>
              <button
                @click.stop="showResetPassword(tenant.id)"
                class="px-3 py-1.5 text-sm bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300 rounded-lg transition-all"
                title="Cambiar contraseña"
              >
                Password
              </button>
              <button
                @click.stop="confirmDelete(tenant.id)"
                class="px-3 py-1.5 text-sm bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-lg transition-all"
                title="Eliminar empresa"
              >
                Eliminar
              </button>
            </div>

            <div v-if="isTenantExpanded(tenant.id)" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div class="rounded-lg bg-slate-900/50 border border-slate-700/60 p-3">
                <p class="text-[11px] uppercase tracking-widest text-slate-500 font-black mb-1">URL tenant</p>
                <a
                  :href="getTenantUrl(tenant.id)"
                  target="_blank"
                  class="text-blue-300 hover:text-blue-200 font-mono break-all"
                  @click.stop
                >
                  {{ getTenantUrl(tenant.id) }}
                </a>
                <button
                  @click.stop="copyToClipboard(getTenantUrl(tenant.id))"
                  class="mt-2 text-xs text-gray-400 hover:text-white"
                >
                  Copiar URL
                </button>
              </div>
              <div class="rounded-lg bg-slate-900/50 border border-slate-700/60 p-3">
                <p class="text-[11px] uppercase tracking-widest text-slate-500 font-black mb-1">Facturación</p>
                <p class="text-slate-200">Proveedor: {{ tenant.billing?.provider || '—' }}</p>
                <p class="text-slate-200">Estado: {{ tenant.billing?.status || 'inactive' }}</p>
                <p class="text-slate-200">MRR: {{ formatCents(getTenantMonthlyRevenueCents(tenant)) }}</p>
                <p class="text-slate-200">Acceso: <span :class="getAccessTextClass(tenant)">{{ getTenantAccessLabel(tenant) }}</span></p>
              </div>
              <div class="rounded-lg bg-slate-900/50 border border-slate-700/60 p-3">
                <p class="text-[11px] uppercase tracking-widest text-slate-500 font-black mb-1">Referencias billing</p>
                <p class="text-slate-300 break-all">Customer: {{ tenant.billing?.customer_id || '—' }}</p>
                <p class="text-slate-300 break-all">Subscription: {{ tenant.billing?.subscription_id || '—' }}</p>
              </div>
              <div class="rounded-lg bg-slate-900/50 border border-slate-700/60 p-3">
                <p class="text-[11px] uppercase tracking-widest text-slate-500 font-black mb-1">Ciclo de cobro</p>
                <p class="text-slate-200">Última factura: {{ getLastInvoiceDate(tenant) }}</p>
                <p class="text-slate-200">Resultado: {{ tenant.billing?.last_invoice_status || '—' }}</p>
                <p class="text-slate-200">Salud: <span :class="getHealthClass(tenant)">{{ getTenantHealth(tenant) }}</span></p>
              </div>
            </div>
          </article>
        </div>

        <!-- Delete Selected Button -->
        <div v-if="selectedTenants.size > 0" class="px-6 py-4 border-t border-gray-700/50 bg-gray-900/40 flex items-center justify-between">
          <div class="text-sm text-gray-300">
            {{ selectedTenants.size }} empresa(s) seleccionada(s)
          </div>
          <div class="flex gap-2">
            <button
              @click="clearSelection"
              class="px-3 py-2 text-sm bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            >
              Limpiar Selección
            </button>
            <button
              @click="confirmDeleteMultiple"
              class="px-3 py-2 text-sm bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-lg transition-all flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              Eliminar {{ selectedTenants.size }} Empresa(s)
            </button>
          </div>
        </div>
      </div>
      </section>
    </main>

    <!-- Delete Multiple Confirmation Modal -->
    <div v-if="deleteMultipleModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md border border-red-600/30 shadow-xl">
        <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          Confirmar Eliminación Múltiple
        </h3>
        <p class="text-gray-400 mb-4">
          ¿Estás seguro de eliminar <strong class="text-red-300">{{ selectedTenants.size }} empresa(s)</strong>?
        </p>
        <div class="bg-gray-900/40 rounded-lg p-3 mb-4 max-h-48 overflow-y-auto">
          <div class="text-sm text-gray-300 space-y-1">
            <div v-for="tenantId of selectedTenants" :key="tenantId" class="text-gray-400">
              • {{ tenantId }}
            </div>
          </div>
        </div>
        <p class="text-sm text-red-300/70 mb-6">Esta acción eliminará todos los datos, usuarios y configuración asociados.</p>
        <div class="flex gap-3 justify-end">
          <button
            @click="deleteMultipleModal.show = false"
            class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleDeleteMultiple"
            :disabled="deletingMultiple"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg v-if="!deletingMultiple" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ deletingMultiple ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Create Tenant Modal -->
    <div v-if="createModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700/50 shadow-xl">
        <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.5H9a1 1 0 100 2h2a1 1 0 100-2h-1V7z" clip-rule="evenodd"/>
          </svg>
          Confirmar Creación
        </h3>
        
        <p class="text-gray-400 text-sm mb-6">
          La empresa <strong class="text-white">{{ newTenantId }}</strong> se creará con los siguientes datos:
        </p>

        <div class="space-y-3 mb-6 bg-gray-700/30 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <span class="text-gray-400">Admin Email:</span>
            <span class="text-white font-mono text-sm">admin@sims.com</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-400">Contraseña:</span>
            <span class="text-gray-400 font-mono text-sm">(defecto del sistema)</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-400">URL:</span>
            <span class="text-blue-300 font-mono text-xs truncate max-w-xs">{{ getTenantUrl(newTenantId) }}</span>
          </div>
        </div>

        <p class="text-xs text-gray-500 mb-4">Los detalles de acceso se mostrarán una vez creada.</p>

        <div class="flex gap-3 justify-end">
          <button
            @click="createModal.show = false"
            class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleCreateTenant"
            :disabled="creating"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg v-if="!creating" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.5H9a1 1 0 100 2h2a1 1 0 100-2h-1V7z" clip-rule="evenodd"/>
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ creating ? 'Creando...' : 'Crear Empresa' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="successModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-xl p-6 w-full max-w-md border border-green-500/30 shadow-xl">
        <h3 class="text-lg font-semibold text-green-300 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          ¡Éxito!
        </h3>
        
        <p class="text-gray-300 text-sm mb-4">
          La empresa <strong class="text-white">{{ successModal.tenantId }}</strong> ha sido creada.
        </p>

        <div class="space-y-3 mb-6 bg-gray-900/40 p-4 rounded-lg">
          <div>
            <div class="text-xs text-gray-400 mb-1">URL de Acceso:</div>
            <div class="flex items-center gap-2">
              <input
                type="text"
                :value="getTenantUrl(successModal.tenantId)"
                readonly
                class="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded text-white text-sm font-mono"
              />
              <button
                @click="copyToClipboard(getTenantUrl(successModal.tenantId))"
                class="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 rounded transition-colors"
                title="Copiar URL"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V4z"/>
                  <path d="M9 2H7a1 1 0 00-1 1v1h4V3a1 1 0 00-1-1z" fill="white" opacity="0.3"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <button
          @click="successModal.show = false; newTenantId = ''"
          class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>

    <!-- Info Modal -->
    <div v-if="infoModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700/50 shadow-xl">
        <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
          </svg>
          Detalles de {{ infoModal.tenantId }}
        </h3>
        
        <div class="space-y-3 mb-6">
          <div class="bg-gradient-to-r from-blue-900/30 to-blue-800/20 rounded-lg p-4 border border-blue-500/20">
            <div class="text-xs text-blue-300/70 mb-1">ID de Empresa</div>
            <div class="text-white font-mono text-sm font-semibold">{{ infoModal.tenantId }}</div>
          </div>
          <div class="bg-gradient-to-r from-purple-900/30 to-purple-800/20 rounded-lg p-4 border border-purple-500/20">
            <div class="text-xs text-purple-300/70 mb-1">Email Administrador</div>
            <div class="text-white font-mono text-sm">admin@sims.com</div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gradient-to-r from-green-900/30 to-green-800/20 rounded-lg p-4 border border-green-500/20">
              <div class="text-xs text-green-300/70 mb-1">Usuarios</div>
              <div class="text-white font-semibold text-lg">3</div>
            </div>
            <div class="bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 rounded-lg p-4 border border-emerald-500/20">
              <div class="text-xs text-emerald-300/70 mb-1">Estado</div>
              <div class="text-emerald-300 font-semibold flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Activo
              </div>
            </div>
          </div>
        </div>

        <button
          @click="infoModal.show = false"
          class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          Cerrar
        </button>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <div v-if="passwordModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700/50 shadow-xl">
        <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
          </svg>
          Cambiar Contraseña
        </h3>
        <p class="text-gray-400 text-sm mb-4">Empresa: <strong class="text-white">{{ passwordModal.tenantId }}</strong></p>
        
        <div class="mb-4">
          <label class="block text-gray-300 text-sm mb-2">Nueva Contraseña (opcional)</label>
          <input
            v-model="passwordModal.newPassword"
            type="text"
            placeholder="Dejar vacío para generar..."
            class="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div v-if="passwordModal.result" class="mb-4 p-3 bg-green-900/30 border border-green-600 rounded-lg">
          <div class="text-green-300 text-sm font-medium flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            Nueva contraseña:
          </div>
          <div class="text-white font-mono text-lg mt-2 bg-gray-900/50 p-2 rounded text-center">{{ passwordModal.result }}</div>
          <button
            @click="copyToClipboard(passwordModal.result)"
            class="mt-2 w-full text-sm text-gray-300 hover:text-white py-1 flex items-center justify-center gap-1"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V4z"/>
              <path d="M9 2H7a1 1 0 00-1 1v1h4V3a1 1 0 00-1-1z" fill="white" opacity="0.3"/>
            </svg>
            Copiar
          </button>
        </div>

        <div class="flex gap-3 justify-end">
          <button
            @click="passwordModal.show = false"
            class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleResetPassword"
            :disabled="resetting"
            class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg v-if="!resetting" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"/>
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ resetting ? 'Reseteando...' : 'Resetear' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md border border-red-600/30 shadow-xl">
        <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          Confirmar Eliminación
        </h3>
        <p class="text-gray-400 mb-4">
          ¿Estás seguro de eliminar la empresa <strong class="text-red-300">{{ deleteModal.tenantId }}</strong>?
        </p>
        <p class="text-sm text-red-300/70 mb-6">Esta acción eliminará todos los datos, usuarios y configuración asociados.</p>
        <div class="flex gap-3 justify-end">
          <button
            @click="deleteModal.show = false"
            class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleDelete"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCentralAuth } from '../composables/useCentralAuth'
import { useTenants } from '../composables/useTenants'
import type { Tenant } from '@/services/centralApi'

const route = useRoute()
const router = useRouter()
const { logout, checkAuth, user } = useCentralAuth()
const { tenants, loading, fetchTenants, createTenant, deleteTenant, resetAdminPassword, createCheckoutSession, updateDemoBillingProfile } = useTenants()

const creating = ref(false)
const resetting = ref(false)
const deletingMultiple = ref(false)
const newTenantId = ref('')
const showUserMenu = ref(false)
const activeTab = ref<'overview' | 'create' | 'tenants'>('overview')
const searchQuery = ref('')
const selectAll = ref(false)
const selectedTenants = ref(new Set<string>())
const expandedTenants = ref(new Set<string>())
const billingLoadingByTenant = ref<Record<string, 'checkout' | 'portal' | 'demo_update' | undefined>>({})
const billingNotice = ref('')

const userDisplayName = computed(() => user.value?.name || 'Super Admin')
const userDisplayEmail = computed(() => user.value?.email || 'superadmin@sims.com')
const userInitials = computed(() => {
  const source = userDisplayName.value.trim()
  return source
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})

const frontendBaseUrl = computed(() => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `http://${window.location.hostname}:5173`
  }
  return window.location.origin
})

const deleteModal = reactive({
  show: false,
  tenantId: ''
})

const deleteMultipleModal = reactive({
  show: false
})

const passwordModal = reactive({
  show: false,
  tenantId: '',
  newPassword: '',
  result: ''
})

const infoModal = reactive({
  show: false,
  tenantId: ''
})

const createModal = reactive({
  show: false
})

const successModal = reactive({
  show: false,
  tenantId: ''
})

const generatedUrl = computed(() => {
  if (!newTenantId.value) return ''
  const cleanId = newTenantId.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
  return `${frontendBaseUrl.value}/?tenant=${cleanId}`
})

const filteredTenants = computed(() => {
  if (!searchQuery.value) return tenants.value
  return tenants.value.filter(t => 
    t.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    t.admin_email?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const companySnapshots = computed(() => {
  return [...filteredTenants.value].slice(0, 6)
})

const totalUsers = computed(() => {
  return tenants.value.reduce((acc, tenant) => acc + getTenantUsersEstimate(tenant.id), 0)
})

const basePlanPrice = 49
const estimatedMRR = computed(() => {
  return tenants.value.reduce((acc, tenant) => acc + getTenantMonthlyRevenueCents(tenant), 0)
})
const planPriceLabel = computed(() =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(basePlanPrice)
)

const formatCents = (amountCents: number, currency: string = 'EUR') =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency, maximumFractionDigits: 0 }).format((amountCents || 0) / 100)

const getTenantUsersEstimate = (tenantId: string) => 8 + (getTenantHash(tenantId) % 42)

const getTenantHash = (tenantId: string) =>
  tenantId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

const getTenantMonthlyRevenueCents = (tenant: Tenant) => {
  const fromBilling = tenant.billing?.mrr_amount_cents || tenant.billing?.monthly_amount_cents || 0
  if (fromBilling > 0) return fromBilling
  return basePlanPrice * 100
}

const getTenantAnnualRevenueCents = (tenant: Tenant) => {
  const fromBilling = tenant.billing?.arr_amount_cents || 0
  if (fromBilling > 0) return fromBilling
  return getTenantMonthlyRevenueCents(tenant) * 12
}

const hasConfiguredPaymentMethod = (tenant: Tenant) =>
  Boolean(tenant.billing?.demo_profile?.payment_method || tenant.billing?.customer_id)

const getPaymentStatus = (tenant: Tenant) =>
  hasConfiguredPaymentMethod(tenant) ? 'método configurado' : 'sin método'

const getPaymentBadgeClass = (tenant: Tenant) => {
  const status = getPaymentStatus(tenant)
  if (status === 'método configurado') return 'text-emerald-300 border-emerald-700/50 bg-emerald-900/35'
  if (status === 'sin método') return 'text-red-300 border-red-700/50 bg-red-900/35'
  return 'text-slate-300 border-slate-600/60 bg-slate-800/60'
}

const getLastInvoiceDate = (tenant: Tenant) => {
  const date = tenant.billing?.last_invoice_at
  if (!date) return '—'
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

const getTenantHealth = (tenant: Tenant) => {
  if (tenant.billing?.access?.is_suspended) return 'Crítica'
  if (!hasConfiguredPaymentMethod(tenant)) return 'Atención'
  const invoiceStatus = tenant.billing?.last_invoice_status
  if (['open', 'uncollectible', 'void'].includes(String(invoiceStatus || '').toLowerCase())) return 'Atención'
  return 'Estable'
}

const getHealthClass = (tenant: Tenant) => {
  const state = getTenantHealth(tenant)
  if (state === 'Estable') return 'text-emerald-300'
  if (state === 'Atención') return 'text-amber-300'
  return 'text-red-300'
}

const getTenantAccessLabel = (tenant: Tenant) =>
  tenant.billing?.access?.is_suspended ? 'suspendido temporalmente' : 'acceso habilitado'

const getAccessBadgeClass = (tenant: Tenant) =>
  tenant.billing?.access?.is_suspended
    ? 'text-red-300 border-red-700/50 bg-red-900/35'
    : 'text-emerald-300 border-emerald-700/50 bg-emerald-900/35'

const getAccessTextClass = (tenant: Tenant) =>
  tenant.billing?.access?.is_suspended ? 'text-red-300' : 'text-emerald-300'

const paymentMethodLabel = (method?: string) => {
  if (method === 'card') return 'Tarjeta'
  if (method === 'sepa') return 'SEPA'
  if (method === 'transfer') return 'Transferencia'
  if (method === 'wallet') return 'Wallet'
  return 'Sin método'
}

const getTenantDemoPaymentSummary = (tenant: Tenant) => {
  const profile = tenant.billing?.demo_profile
  if (!profile) {
    if (tenant.billing?.customer_id) return 'Método gestionado en billing (sin detalle local)'
    return 'Sin método de pago configurado'
  }
  const method = paymentMethodLabel(profile.payment_method)
  const suffix = profile.card_last4 ? ` · ****${profile.card_last4}` : ''
  const owner = profile.billing_name ? ` · ${profile.billing_name}` : ''
  return `${method}${suffix}${owner}`
}

const isTenantExpanded = (tenantId: string) => expandedTenants.value.has(tenantId)

const toggleTenantExpanded = (tenantId: string) => {
  if (expandedTenants.value.has(tenantId)) {
    expandedTenants.value.delete(tenantId)
  } else {
    expandedTenants.value.add(tenantId)
  }
}

const openCheckoutForTenant = async (tenantId: string) => {
  billingLoadingByTenant.value[tenantId] = 'checkout'
  try {
    const response = await createCheckoutSession(tenantId, {
      success_url: `${window.location.origin}/superadmin/dashboard?billing=success`,
      cancel_url: `${window.location.origin}/superadmin/dashboard?billing=cancel`,
    })
    const checkoutUrl = response?.data?.url
    if (!checkoutUrl) {
      throw new Error('No se recibió URL de checkout')
    }
    window.location.href = checkoutUrl
  } catch (e: any) {
    if (isCentralAuthError(e)) {
      handleCentralSessionExpired()
      return
    }
    alert('Error al iniciar checkout: ' + (e.response?.data?.message || e.message))
  } finally {
    delete billingLoadingByTenant.value[tenantId]
  }
}

const simulateBillingUpdateForTenant = async (tenant: Tenant) => {
  billingLoadingByTenant.value[tenant.id] = 'demo_update'
  try {
    const currentYear = new Date().getFullYear() + 2
    const hash = getTenantHash(tenant.id)
    const generatedLast4 = String(1000 + (hash % 9000))
    const generatedMonth = (hash % 12) + 1
    const generatedMethod = ['card', 'sepa', 'wallet', 'transfer'][hash % 4] as 'card' | 'sepa' | 'wallet' | 'transfer'

    await updateDemoBillingProfile(tenant.id, {
      billing_name: tenant.billing?.demo_profile?.billing_name || `${tenant.id.toUpperCase()} Fleet`,
      billing_email: tenant.billing?.demo_profile?.billing_email || `billing+${tenant.id}@fleetly.demo`,
      payment_method: generatedMethod,
      card_last4: generatedMethod === 'card' ? generatedLast4 : undefined,
      expiry_month: generatedMethod === 'card' ? generatedMonth : undefined,
      expiry_year: generatedMethod === 'card' ? currentYear : undefined,
      country: tenant.billing?.demo_profile?.country || 'ES',
      city: tenant.billing?.demo_profile?.city || 'Madrid',
      postal_code: tenant.billing?.demo_profile?.postal_code || '28001',
      address_line: tenant.billing?.demo_profile?.address_line || 'Calle Demo 123',
      vat_number: tenant.billing?.demo_profile?.vat_number || `ESB${generatedLast4}Z`,
    })

    await fetchTenants()
    billingNotice.value = `Pago simulado como actualizado desde billing para ${tenant.id}.`
  } catch (e: any) {
    if (isCentralAuthError(e)) {
      handleCentralSessionExpired()
      return
    }
    alert('No se pudo simular la actualización de pago: ' + (e.response?.data?.message || e.message))
  } finally {
    delete billingLoadingByTenant.value[tenant.id]
  }
}

const getTenantUrl = (tenantId: string) => {
  return `${frontendBaseUrl.value}/?tenant=${tenantId}`
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // Show toast notification (optional)
  } catch (e) {
    console.error('Error al copiar:', e)
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateShort = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

const isCentralAuthError = (e: any) => e?.response?.status === 401 || e?.response?.status === 403

const handleCentralSessionExpired = () => {
  logout()
  router.replace({ path: '/superadmin/login', query: { expired: '1' } })
}

const handleLogout = () => {
  showUserMenu.value = false
  logout()
  router.push('/superadmin/login')
}

const goToProfile = () => {
  showUserMenu.value = false
  router.push('/superadmin/profile')
}

const handleClickOutsideMenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.superadmin-user-menu')) {
    showUserMenu.value = false
  }
}

const consumeBillingQuery = async () => {
  const billingDemo = String(route.query.billing_demo || '')
  const billing = String(route.query.billing || '')
  if (!billingDemo && !billing) return

  if (billingDemo === 'payment_info_updated') {
    billingNotice.value = 'Pago actualizado correctamente (modo demo).'
    activeTab.value = 'tenants'
  } else if (billingDemo === 'checkout_success' || billing === 'success') {
    billingNotice.value = 'Suscripción/cobro actualizado correctamente.'
    activeTab.value = 'tenants'
  } else if (billing === 'cancel') {
    billingNotice.value = 'Proceso de cobro cancelado.'
  }

  try {
    await fetchTenants()
  } catch {
    // handled elsewhere
  }

  const nextQuery = { ...route.query } as Record<string, any>
  delete nextQuery.billing_demo
  delete nextQuery.billing
  router.replace({ path: route.path, query: nextQuery })
}

const showCreateModal = () => {
  if (!newTenantId.value) {
    alert('Por favor ingresa un ID para la empresa')
    return
  }
  createModal.show = true
}

const handleCreateTenant = async () => {
  const cleanId = newTenantId.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
  if (!cleanId) {
    alert('ID de empresa inválido')
    return
  }
  
  creating.value = true
  try {
    await createTenant({
      id: cleanId,
      domain: `${cleanId}.tenant.local`
    })
    successModal.tenantId = cleanId
    createModal.show = false
    successModal.show = true
    await fetchTenants()
  } catch (e: any) {
    if (isCentralAuthError(e)) {
      handleCentralSessionExpired()
      return
    }
    alert('❌ Error al crear: ' + (e.response?.data?.message || e.message))
    createModal.show = false
  } finally {
    creating.value = false
  }
}

const showInfo = (tenantId: string) => {
  infoModal.tenantId = tenantId
  infoModal.show = true
}

const showResetPassword = (tenantId: string) => {
  passwordModal.tenantId = tenantId
  passwordModal.newPassword = ''
  passwordModal.result = ''
  passwordModal.show = true
}

const handleResetPassword = async () => {
  resetting.value = true
  try {
    const response = await resetAdminPassword(
      passwordModal.tenantId,
      passwordModal.newPassword || undefined
    )
    passwordModal.result = response.data.new_password
  } catch (e: any) {
    if (isCentralAuthError(e)) {
      handleCentralSessionExpired()
      return
    }
    alert('Error: ' + (e.response?.data?.message || e.message))
  } finally {
    resetting.value = false
  }
}

const confirmDelete = (tenantId: string) => {
  deleteModal.tenantId = tenantId
  deleteModal.show = true
}

const handleDelete = async () => {
  try {
    await deleteTenant(deleteModal.tenantId)
    deleteModal.show = false
    await fetchTenants()
  } catch (e: any) {
    if (isCentralAuthError(e)) {
      handleCentralSessionExpired()
      return
    }
    alert('Error al eliminar tenant')
  }
}

const toggleTenantSelect = (tenantId: string) => {
  if (selectedTenants.value.has(tenantId)) {
    selectedTenants.value.delete(tenantId)
  } else {
    selectedTenants.value.add(tenantId)
  }
  updateSelectAll()
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedTenants.value.clear()
    filteredTenants.value.forEach(t => selectedTenants.value.add(t.id))
  } else {
    selectedTenants.value.clear()
  }
}

const updateSelectAll = () => {
  selectAll.value = filteredTenants.value.length > 0 && 
                    filteredTenants.value.every(t => selectedTenants.value.has(t.id))
}

const clearSelection = () => {
  selectedTenants.value.clear()
  selectAll.value = false
}

const confirmDeleteMultiple = () => {
  deleteMultipleModal.show = true
}

const handleDeleteMultiple = async () => {
  deletingMultiple.value = true
  try {
    const tenantIds = Array.from(selectedTenants.value)
    const results = await Promise.allSettled(
      tenantIds.map(tenantId => deleteTenant(tenantId))
    )
    
    const failed = results.filter(r => r.status === 'rejected')
    if (failed.length > 0) {
      alert(`Error al eliminar ${failed.length} de ${tenantIds.length} tenants. Por favor, intenta de nuevo.`)
    }
    
    deleteMultipleModal.show = false
    selectedTenants.value.clear()
    selectAll.value = false
    await fetchTenants()
  } catch (e: any) {
    if (isCentralAuthError(e)) {
      handleCentralSessionExpired()
      return
    }
    alert('Error al eliminar tenants')
  } finally {
    deletingMultiple.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutsideMenu)

  if (!checkAuth()) {
    handleCentralSessionExpired()
    return
  }

  try {
    await fetchTenants()
    await consumeBillingQuery()
  } catch (e: any) {
    if (isCentralAuthError(e)) {
      handleCentralSessionExpired()
    }
  }
})

watch(
  () => route.query,
  async () => {
    await consumeBillingQuery()
  }
)

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideMenu)
})
</script>
