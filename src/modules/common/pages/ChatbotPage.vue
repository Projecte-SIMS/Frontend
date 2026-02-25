<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue"
import apiClient from "@/services/api"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

const messages = ref<Message[]>([
  {
    role: "system",
    content: "Eres el asistente AI de SIMS, una empresa de carsharing. Responde en español y ayuda a los usuarios con reservas, vehículos y preguntas sobre SIMS."
  },
  { role: "assistant", content: "¡Hola! Soy el asistente AI de SIMS. ¿En qué puedo ayudarte hoy?" }
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
      messages: messages.value
    })

    const aiResponse = response.data.choices[0].message.content
    messages.value.push({ role: "assistant", content: aiResponse })
  } catch (error: any) {
    console.error(error)
    let errorMsg = "Sorry, something went wrong. Please check your API key configuration."
    if (error.response && error.response.status === 401) {
      errorMsg = "You need to be logged in to use the chatbot."
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
          <h1 class="text-2xl font-bold text-indigo-400">AI Assistant</h1>
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
            placeholder="Type your message..."
            class="flex-1 rounded-lg bg-gray-700 text-white p-3 border border-white/10 focus:outline-none focus:border-indigo-400"
            :disabled="isLoading"
          />
          <button
            type="submit"
            class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
            :disabled="isLoading || !userInput.trim()"
          >
            Send
          </button>
        </form>
      </div>
    </transition>
  </div>
</template>