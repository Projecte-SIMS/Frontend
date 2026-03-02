<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from "vue"
import apiClient from "@/services/api"
import { useAuth } from "@/modules/auth/composables/useAuth"
import { 
  ChatBubbleLeftEllipsisIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  SparklesIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

const { user } = useAuth()

const userRole = computed(() => {
  if (user.value?.roles && user.value.roles.length > 0) {
    return user.value.roles[0].name || 'Client'
  }
  return 'Client'
})

const getWelcomeMessage = () => {
  const role = userRole.value
  switch (role) {
    case 'Admin':
      return '¡Hola Admin! Soy el asistente AI de SIMS. Puedo ayudarte con la gestión de usuarios, vehículos, reservas y configuración del sistema. ¿Qué necesitas?'
    case 'Maintenance':
      return '¡Hola! Soy el asistente de SIMS para el equipo de mantenimiento. Puedo ayudarte con información técnica de vehículos y procedimientos. ¿En qué puedo asistirte?'
    default:
      return '¡Hola! Soy el asistente AI de SIMS. Puedo ayudarte a reservar vehículos, resolver dudas sobre el servicio y gestionar tus reservas. ¿En qué puedo ayudarte hoy?'
  }
}

const messages = ref<Message[]>([
  { role: "assistant", content: getWelcomeMessage() }
])

const userInput = ref("")
const isLoading = ref(false)
const chatBox = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const scrollToBottom = async () => {
  await nextTick()
  if (chatBox.value) {
    chatBox.value.scrollTop = chatBox.value.scrollHeight
  }
}

const sendMessage = async () => {
  const text = userInput.value.trim()
  if (!text || isLoading.value) return

  messages.value.push({ role: "user", content: text })
  userInput.value = ""
  isLoading.value = true
  await scrollToBottom()

  try {
    const response = await apiClient.post("/chatbot/chat", {
      messages: messages.value.filter(m => m.role !== 'system')
    })

    const aiResponse = response.data.choices[0].message.content
    messages.value.push({ role: "assistant", content: aiResponse })
  } catch (error: any) {
    console.error(error)
    let errorMsg = "Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo."
    if (error.response && error.response.status === 401) {
      errorMsg = "Necesitas iniciar sesión para usar el asistente."
    }
    messages.value.push({ role: "assistant", content: errorMsg })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="fixed bottom-6 right-6 z-[100]">
    <!-- Floating Action Button -->
    <button 
      @click="isOpen = !isOpen" 
      :class="[
        isOpen 
          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 rotate-90' 
          : 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-indigo-500/40 hover:scale-110'
      ]"
      class="group relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-2xl transition-all duration-300 active:scale-95"
    >
      <div v-if="!isOpen" class="absolute -inset-1 animate-pulse rounded-2xl bg-indigo-500/20 blur-lg group-hover:bg-indigo-500/40 transition-all"></div>
      
      <XMarkIcon v-if="isOpen" class="size-6 transition-all" />
      <div v-else class="relative flex items-center justify-center">
        <ChatBubbleLeftEllipsisIcon class="size-7" />
        <span class="absolute -top-1 -right-1 flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
        </span>
      </div>
    </button>

    <!-- Chat Window -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform opacity-0 translate-y-4"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 translate-y-4"
    >
      <div v-if="isOpen" class="absolute bottom-20 right-0 w-[calc(100vw-2.5rem)] sm:w-[400px] max-w-none bg-white dark:bg-gray-900 rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden will-change-transform" style="height: 550px; max-height: calc(100vh - 8rem);">
        <!-- Header -->
        <div class="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white relative shrink-0">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <SparklesIcon class="size-6" />
            </div>
            <div>
              <h2 class="text-base font-black tracking-tight leading-none">Asistente SIMS</h2>
              <div class="flex items-center gap-1.5 mt-1.5">
                <span class="size-1.5 rounded-full bg-green-400 animate-pulse"></span>
                <span class="text-[10px] font-bold uppercase tracking-widest opacity-80">AI Online · {{ userRole }}</span>
              </div>
            </div>
          </div>
          <div class="absolute -right-4 -top-4 size-24 rounded-full bg-white/10 blur-2xl"></div>
        </div>

        <!-- Messages Area -->
        <div 
          ref="chatBox"
          class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-gray-950/20 custom-scrollbar"
        >
          <div v-for="(msg, index) in messages" :key="index" :class="['flex w-full', msg.role === 'user' ? 'justify-end' : 'justify-start animate-fade-in']">
            <div 
              :class="[
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none shadow-lg shadow-indigo-500/10' 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700'
              ]"
              class="max-w-[85%] p-4 text-sm font-medium leading-relaxed"
            >
              {{ msg.content }}
            </div>
          </div>
          
          <!-- Loading Indicator -->
          <div v-if="isLoading" class="flex justify-start animate-fade-in">
            <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700">
              <div class="flex gap-1">
                <span class="size-1.5 rounded-full bg-indigo-400 animate-bounce"></span>
                <span class="size-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
                <span class="size-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
          <form @submit.prevent="sendMessage" class="flex items-end gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-1.5 border border-gray-100 dark:border-gray-700/50 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <textarea
              v-model="userInput"
              rows="1"
              placeholder="Escribe un mensaje..."
              class="flex-1 bg-transparent border-0 focus:ring-0 text-sm font-medium text-gray-900 dark:text-white py-2.5 px-3 resize-none custom-scrollbar"
              :disabled="isLoading"
              @keydown.enter.prevent="sendMessage"
            ></textarea>
            <button
              type="submit"
              class="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:grayscale"
              :disabled="isLoading || !userInput.trim()"
            >
              <PaperAirplaneIcon v-if="!isLoading" class="size-5 -rotate-45 -mr-0.5" />
              <ArrowPathIcon v-else class="size-5 animate-spin" />
            </button>
          </form>
          <p class="text-[9px] text-center text-gray-400 mt-2 font-bold uppercase tracking-widest">Powered by Project SIMS AI</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>
