import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuth } from '@/modules/auth/composables/useAuth'
import { authRoutes } from '@/modules/auth/router'

const routes: RouteRecordRaw[] = [
  ...authRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard global
router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth()
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !isAuthenticated()) {
    // Protected route and not authenticated -> go to login
    next('/login')
  } else if (to.path === '/login' && isAuthenticated()) {
    // Already authenticated attempting to go to login -> go to dashboard
    next('/dashboard')
  } else {
    // All good
    next()
  }
})

export default router
