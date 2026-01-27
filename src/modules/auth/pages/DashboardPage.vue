<template>
  <div>
    <h1>XAVIER QUE ME VA LO FRONTEND</h1>
    <button @click="handleLogout">Logout</button>
    <p>Token: {{ token }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { logout, getToken } = useAuth()

const token = getToken()

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>
