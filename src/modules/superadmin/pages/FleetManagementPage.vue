<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
      <div class="relative z-10">
        <h2 class="text-3xl font-black text-white uppercase tracking-tight leading-none mb-3">Gestión de Flota IoT</h2>
        <p class="text-sm text-slate-400 font-medium max-w-xl">Control centralizado de Raspberries. Detección automática vía WebSockets y despliegue masivo.</p>
      </div>
      <div class="relative z-10 flex gap-3">
        <button 
          @click="discoverNewDevices"
          :disabled="discovering"
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all border border-slate-700 active:scale-95"
        >
          <span class="material-icons text-base" :class="{'animate-spin': discovering}">radar</span>
          {{ discovering ? 'Escaneando...' : 'Descubrir Dispositivos' }}
        </button>
        <button 
          @click="showAddModal = true"
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary-700 transition-all shadow-lg active:scale-95"
        >
          <span class="material-icons text-base">add</span>
          Registro Manual
        </button>
      </div>
    </div>

    <!-- Sección de Descubrimiento Automático (WebSockets) -->
    <div v-if="discoveredDevices.filter(d => d.online && !d.is_registered).length > 0" class="space-y-4">
      <div class="flex items-center gap-3 px-4">
        <span class="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Dispositivos detectados vía WebSocket</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="d in discoveredDevices.filter(d => d.online && !d.is_registered)" :key="d.hardware_id" 
             class="p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col justify-between group hover:border-emerald-500/50 transition-all">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="material-icons text-emerald-500">sensors</span>
              <span class="text-[8px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded uppercase">Online</span>
            </div>
            <p class="text-sm font-black text-slate-900 dark:text-white uppercase truncate">{{ d.hardware_id }}</p>
            <p class="text-[10px] font-mono text-slate-400 mt-1">{{ d.ip_address }}</p>
          </div>
          <div class="mt-6">
            <button 
              v-if="!d.is_registered"
              @click="prepareAddFromDiscovery(d)"
              class="w-full py-2.5 rounded-xl bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
            >
              Vincular al Sistema
            </button>
            <div v-else class="flex items-center justify-center gap-2 py-2.5 text-[9px] font-black text-emerald-600 uppercase">
              <span class="material-icons text-sm">check_circle</span>
              Registrado
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Inventario Oficial -->
    <div class="space-y-4">
      <div class="px-4">
        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Inventario de Flota</h3>
      </div>
      <div class="grid grid-cols-1 gap-4">
        <div v-if="loading && devices.length === 0" class="flex flex-col items-center justify-center p-20 bg-slate-900/50 rounded-[2.5rem] border border-slate-800 border-dashed">
          <span class="material-icons text-5xl text-slate-700 animate-spin mb-4">sync</span>
          <p class="text-slate-500 font-black uppercase text-[10px] tracking-widest">Cargando...</p>
        </div>

        <div v-else-if="devices.length === 0" class="flex flex-col items-center justify-center p-20 bg-slate-900/50 rounded-[2.5rem] border border-slate-800 border-dashed">
          <span class="material-icons text-5xl text-slate-700 mb-4">inventory</span>
          <p class="text-slate-500 font-black uppercase text-[10px] tracking-widest mb-2">No hay dispositivos vinculados</p>
        </div>

        <div v-for="device in devices" :key="device.id" class="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-primary-500/30 transition-all group">
          <div class="flex items-center gap-6">
            <div class="size-14 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-brand-primary-500 transition-colors">
              <span class="material-icons text-3xl">memory</span>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-lg font-black text-slate-900 dark:text-white uppercase leading-none">{{ device.display_name }}</h3>
                <span class="px-2 py-0.5 rounded text-[8px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-widest">{{ device.hardware_id }}</span>
              </div>
              <p class="text-[10px] font-mono text-slate-400">{{ device.ssh_user }}@{{ device.ip_address }}</p>
              <p class="text-[9px] font-black text-brand-primary-500 uppercase mt-2">Empresa: {{ device.tenant_id || 'Global' }}</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <p class="text-[8px] font-black text-slate-400 uppercase mb-1">Último Status</p>
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full" :class="{
                  'bg-emerald-500': device.last_status?.includes('Online') && device.last_status?.includes('Active'),
                  'bg-amber-500': device.last_status?.includes('Online') && !device.last_status?.includes('Active'),
                  'bg-slate-400': !device.last_status?.includes('Online')
                }"></span>
                <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate max-w-[120px]">{{ device.last_status || 'Offline' }}</span>
              </div>
            </div>

            <div class="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
              <button @click="runAction(device, 'status')" :disabled="syncing[device.id]" class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-primary-500 transition-all"><span class="material-icons text-xl" :class="{'animate-spin': syncing[device.id] === 'status'}">refresh</span></button>
              <button @click="runAction(device, 'deploy')" :disabled="syncing[device.id]" class="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest">Deploy</button>
              <button @click="runAction(device, 'update-keys')" :disabled="syncing[device.id]" class="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest">Keys</button>
              <button @click="deleteDevice(device.id)" class="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"><span class="material-icons text-xl">delete</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Añadir -->
    <div v-if="showAddModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden animate-fleetly-fade-up">
        <div class="p-8 border-b border-slate-100 dark:border-slate-800">
           <h3 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Vincular Raspberry</h3>
           <p class="text-xs text-slate-500 mt-1 uppercase font-bold">Configurar acceso SSH y empresa propietaria</p>
        </div>
        <div class="p-8 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-slate-400 uppercase ml-1">Nombre Visual</label>
              <input v-model="newDevice.display_name" type="text" placeholder="Coche 01" class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 ring-brand-primary-500 outline-none" />
            </div>
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-slate-400 uppercase ml-1">Hardware ID</label>
              <input v-model="newDevice.hardware_id" type="text" readonly class="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-500 cursor-not-allowed outline-none" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-slate-400 uppercase ml-1">Dirección IP</label>
              <input v-model="newDevice.ip_address" type="text" placeholder="192.168.1.xxx" class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 ring-brand-primary-500 outline-none" />
            </div>
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-slate-400 uppercase ml-1">Usuario SSH</label>
              <input v-model="newDevice.ssh_user" type="text" placeholder="pi" class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 ring-brand-primary-500 outline-none" />
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-[9px] font-black text-slate-400 uppercase ml-1">Asignar a Empresa (Tenant ID)</label>
            <input v-model="newDevice.tenant_id" type="text" placeholder="slug-empresa" class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 ring-brand-primary-500 outline-none" />
          </div>
        </div>
        <div class="p-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <button @click="showAddModal = false" class="px-6 py-3 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">Cancelar</button>
          <button @click="saveDevice" class="px-8 py-3 rounded-xl bg-brand-primary-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95">Finalizar Vínculo</button>
        </div>
      </div>
    </div>

    <!-- Consola modal -->
    <div v-if="outputModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
      <div class="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div class="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900">
           <div>
             <h3 class="text-lg font-black text-white uppercase tracking-tight">Fleet Console</h3>
             <p class="text-[10px] text-emerald-400 font-mono uppercase">Remote process output</p>
           </div>
           <button @click="outputModal = null" class="p-2 rounded-lg hover:bg-slate-800 text-slate-500"><span class="material-icons">close</span></button>
        </div>
        <div class="p-8 overflow-y-auto bg-black flex-1 font-mono text-[11px] leading-relaxed">
          <pre class="text-slate-300 whitespace-pre-wrap">{{ outputModal }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { centralApi } from '@/services/centralApi'
import { useToast } from '@/modules/common/composables/useToast'

const toast = useToast()
const devices = ref<any[]>([])
const discoveredDevices = ref<any[]>([])
const loading = ref(false)
const discovering = ref(false)
const showAddModal = ref(false)
const syncing = ref<Record<string, string | null>>({})
const outputModal = ref<string | null>(null)

const newDevice = ref({
  display_name: '',
  hardware_id: '',
  ip_address: '',
  ssh_user: 'pi',
  tenant_id: '',
  use_docker: true
})

const fetchDevices = async () => {
  loading.value = true
  try {
    devices.value = await centralApi.getFleetDevices()
  } catch (e) { console.error(e) } 
  finally { loading.value = false }
}

const discoverNewDevices = async () => {
  discovering.value = true
  try {
    discoveredDevices.value = await centralApi.discoverDevices()
    toast.success(`${discoveredDevices.value.length} dispositivos en red detectados`)
  } catch (e) {
    toast.error('Error al escanear WebSockets')
  } finally {
    discovering.value = false
  }
}

const prepareAddFromDiscovery = (d: any) => {
  newDevice.value = {
    display_name: `Coche ${d.hardware_id.substring(d.hardware_id.length - 4)}`,
    hardware_id: d.hardware_id,
    ip_address: d.ip_address === '::ffff:127.0.0.1' || d.ip_address === '127.0.0.1' ? 'localhost' : d.ip_address,
    ssh_user: 'pi',
    tenant_id: d.tenant_id === 'default' ? '' : d.tenant_id,
    use_docker: true
  }
  showAddModal.value = true
}

const saveDevice = async () => {
  try {
    await centralApi.addFleetDevice(newDevice.value)
    toast.success('Dispositivo vinculado correctamente')
    showAddModal.value = false
    
    // Limpiar descubiertos localmente para que desaparezca inmediatamente
    discoveredDevices.value = discoveredDevices.value.filter(d => d.hardware_id !== newDevice.value.hardware_id)
    
    await fetchDevices()
    await discoverNewDevices() // Refresh discovery list from server
    newDevice.value = { display_name: '', hardware_id: '', ip_address: '', ssh_user: 'pi', tenant_id: '', use_docker: true }
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error al guardar')
  }
}

const runAction = async (device: any, action: string) => {
  syncing.value[device.id] = action
  try {
    const res = await centralApi.executeFleetAction(device.id, action)
    if (res.success) {
      toast.success(`Acción ${action} completada`)
      outputModal.value = res.output || 'Finalizado sin errores'
      fetchDevices()
    }
  } catch (e: any) {
    toast.error('Error en ejecución remota')
    outputModal.value = e.response?.data?.error || e.response?.data?.output || 'Error de conexión'
  } finally {
    syncing.value[device.id] = null
  }
}

const deleteDevice = async (id: number) => {
  if (!confirm('¿Desvincular esta unidad? El hardware seguirá funcionando pero no será gestionable desde aquí.')) return
  try {
    await centralApi.deleteFleetDevice(id)
    toast.success('Desvinculado')
    fetchDevices()
    discoverNewDevices()
  } catch (e) { toast.error('Error') }
}

onMounted(() => {
  fetchDevices()
  discoverNewDevices()
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>