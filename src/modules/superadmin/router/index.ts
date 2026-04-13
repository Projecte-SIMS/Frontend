import type { RouteRecordRaw } from 'vue-router'

export const superAdminRoutes: RouteRecordRaw[] = [
  {
    path: '/superadmin/login',
    name: 'SuperAdminLogin',
    component: () => import('../pages/SuperAdminLoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/superadmin/dashboard',
    name: 'SuperAdminDashboard',
    component: () => import('../pages/SuperAdminDashboardPage.vue'),
    meta: { requiresAuth: false, requiresCentralAuth: true }
  },
  {
    path: '/superadmin/profile',
    name: 'SuperAdminProfile',
    component: () => import('../pages/SuperAdminProfilePage.vue'),
    meta: { requiresAuth: false, requiresCentralAuth: true }
  },
  {
    path: '/superadmin',
    redirect: '/superadmin/login'
  }
]
