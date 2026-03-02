<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from "vue"
import apiClient from "@/services/api"
import { useAuth } from "@/modules/auth/composables/useAuth"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

const { user } = useAuth()

// Get user's primary role name
const userRole = computed(() => {
  if (user.value?.roles && user.value.roles.length > 0) {
    return user.value.roles[0].name || 'Client'
  }
  return 'Client'
})

// Role-specific welcome messages
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
    // Send only user and assistant messages, backend will inject role-specific system prompt
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
  <div>
    <button @click="isOpen = !isOpen" class="fixed bottom-6 right-6 z-50 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full shadow-lg">
      {{ isOpen ? 'Cerrar Asistente' : 'Abrir Asistente' }}
    </button>
    <transition name="fade">
      <div v-if="isOpen" class="fixed bottom-20 right-6 z-50 w-96 max-w-full bg-gray-900 text-white rounded-xl shadow-2xl border border-white/10 p-4 md:p-6 flex flex-col" style="height: 500px;">
        <div class="mb-4 flex items-center justify-between">
          <h1 class="text-2xl font-bold text-indigo-400">Asistente SIMS</h1>
          <span class="text-xs text-gray-400">{{ userRole }}</span>
        </div>
        <div 
          ref="chatBox"
          class="flex-grow overflow-y-auto space-y-4 p-4 bg-gray-800 rounded-xl shadow-inner border border-white/10 mb-4 scrollbar-thin scrollbar-thumb-gray-600"
        >
          <div v-for="(msg, index) in messages.filter(m => m && m.role !== 'system')" :key="index" :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']">
            <div class="p-3 rounded-lg" :class="msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-indigo-200'">
              {{ msg.content }}
            </div>
          </div>
        </div>
        <form @submit.prevent="sendMessage" class="flex gap-2 mt-4">
          <input
            v-model="userInput"
            type="text"
            placeholder="Escribe tu mensaje..."
            class="flex-1 rounded-lg bg-gray-700 text-white p-3 border border-white/10 focus:outline-none focus:border-indigo-400"
            :disabled="isLoading"
          />
          <button
            type="submit"
            class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
            :disabled="isLoading || !userInput.trim()"
          >
            Enviar
          </button>
        </form>
      </div>
    </transition>
  </div>
</template>