import type { RouteRecordRaw } from 'vue-router'

export const ticketsRoutes: RouteRecordRaw[] = [
  {
    path: '/tickets/create',
    name: 'CreateTicketMessage',
    component: () => import('../pages/CreateTicketMessagePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tickets/mine',
    name: 'TicketsList',
    component: () => import('../pages/TicketsListPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tickets/:id/view',
    name: 'UserTicketManage',
    component: () => import('../pages/UserTicketManagePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tickets/:id',
    name: 'AdminTicketManage',
    component: () => import('../pages/AdminTicketManagePage.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]
