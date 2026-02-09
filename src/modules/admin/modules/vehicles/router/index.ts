import type { RouteRecordRaw } from 'vue-router'

export const vehicleRoutes: RouteRecordRaw[] = [
  { path: 'vehicles', 
    name: 'AdminVehicles',
    component: () => import('../pages/VehiclesPage.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
},
]
