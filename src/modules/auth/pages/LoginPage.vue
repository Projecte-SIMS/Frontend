<template>
  <div>
    <h1>Login</h1>
    
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          :disabled="isLoading"
        />
      </div>

      <div>
        <label for="password">Password:</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          :disabled="isLoading"
        />
      </div>

      <div v-if="error">
        Error: {{ error }}
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Loading...' : 'Login' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login, isLoading, error } = useAuth()

const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  const success = await login(email.value, password.value)
  
  if (success) {
    router.push('/dashboard')
  }
}
</script>
