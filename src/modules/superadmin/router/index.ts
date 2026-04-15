import type { RouteRecordRaw } from 'vue-router'

export const superAdminRoutes: RouteRecordRaw[] = [
  {
    path: '/superadmin/login',
    name: 'SuperAdminLogin',
    component: () => import('../pages/SuperAdminLoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/superadmin',
    component: () => import('../layouts/SuperAdminLayout.vue'),
    meta: { requiresAuth: false, requiresCentralAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'SuperAdminDashboard',
        component: () => import('../pages/SuperAdminOverviewPage.vue'),
      },
      {
        path: 'tenants',
        name: 'SuperAdminTenants',
        component: () => import('../pages/TenantsPage.vue'),
      },
      {
        path: 'profile',
        name: 'SuperAdminProfile',
        component: () => import('../pages/SuperAdminProfilePage.vue'),
      },
      {
        path: '',
        redirect: '/superadmin/dashboard'
      }
    ]
  }
]
