<template>
  <div>
    <h1>JEJEJEJE Frontend, Edu la chupa</h1>
    
    <div v-if="user">
      <h2>{{ user.name }}</h2>
      <p><strong>Email:</strong> {{ user.email }}</p>
      
      <div v-if="user.roles && user.roles.length > 0">
        <h3>Roles:</h3>
        <ul>
          <li v-for="role in user.roles" :key="role.id">
            {{ role.name }}
            <ul v-if="role.permissions && role.permissions.length > 0">
              <li v-for="permission in role.permissions" :key="permission.id">
                {{ permission.name }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    
    <div v-else>
      <p>Loading user...</p>
    </div>
    
    <button @click="handleLogout" :disabled="isLoading">
      {{ isLoading ? 'Closing...' : 'Logout' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { user, isLoading, logout } = useAuth()

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
