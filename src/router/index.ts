import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuth } from '@/modules/auth/composables/useAuth'
import { authRoutes } from '@/modules/auth/router'
import AppLayout from '@/modules/common/layouts/AppLayout.vue'
import AdminLayout from '@/modules/admin/layouts/AdminLayout.vue'
import NotFoundPage from '@/modules/common/pages/NotFoundPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', component: () => import('@/modules/common/pages/LandingPage.vue') },
       { path: 'vehicles-map', component: () => import('@/modules/common/pages/MapPage.vue') },
      { path: 'reservas', component: () => import('@/modules/auth/pages/DashboardPage.vue') },
      { path: 'favoritos', component: () => import('@/modules/auth/pages/DashboardPage.vue') },
      { path: 'perfil', component: () => import('@/modules/auth/pages/DashboardPage.vue') },

    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', component: () => import('@/modules/auth/pages/DashboardPage.vue') },
      {
        path: 'map',
        name: 'AdminVehicleMap',
        component: () => import('@/modules/admin/pages/VehicleMapPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },

    ]
  },
  
  ...authRoutes,

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard global
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, fetchUser, getToken } = useAuth()
  const requiresAuth = to.meta.requiresAuth

  // If there's a token but no user data, try to fetch user
  if (getToken() && !isAuthenticated.value) {
    await fetchUser()
  }

  if (requiresAuth && !isAuthenticated.value) {
    // Protected route and not authenticated -> go to login
    next('/login')
  } else if (to.path === '/login' && isAuthenticated.value) {
    // Already authenticated attempting to go to login -> go to dashboard
    next('/dashboard')
  } else {
    // All good
    next()
  }
})

export default router
