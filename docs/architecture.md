# Arquitectura Técnica y Decisiones (Sprint 5)

**Última actualización:** 2026-03-03

Este documento detalla la infraestructura tecnológica de SIMS Frontend y las decisiones de diseño que aseguran la mantenibilidad y el rendimiento del sistema en un entorno multitenant.

---

## 1. Stack Tecnológico (Versiones Verificadas en package.json)

| Componente | Versión | Propósito |
|------------|---------|-----------|
| Vue | 3.5.26 | Framework UI (Composition API) |
| TypeScript | 5.9.3 | Tipado estricto |
| Vite | 7.3.1 | Bundler y dev server |
| TailwindCSS | 4.1.18 | Framework CSS utilitario |
| Axios | 1.13.3 | Cliente HTTP |
| Vue Router | 4.6.4 | Enrutamiento SPA |
| Leaflet | 1.9.4 | Mapas interactivos |
| HeadlessUI | 1.7.23 | Componentes accesibles |
| HeroIcons | 2.2.0 | Iconos SVG |
| vue3-toastify | 0.2.8 | Notificaciones toast |

---

## 2. Arquitectura de Directorios Modular

El proyecto se organiza bajo el patrón **Modular por Dominios**:

```
src/
├── modules/
│   ├── admin/           # Panel de administración de tenant
│   │   ├── bookings/    # Gestión de reservas administrativas
│   │   ├── components/  # Componentes reutilizables admin
│   │   ├── layouts/     # AdminLayout.vue
│   │   ├── modules/     # Submódulos (users, vehicles, roles)
│   │   ├── pages/       # Dashboard, Map, FleetHealth, IoTDevices
│   │   └── tickets/     # Gestión tickets admin
│   ├── superadmin/      # Panel de control central (Landlord)
│   │   ├── components/  # Componentes de gestión de tenants
│   │   ├── layouts/     # SuperAdminLayout.vue
│   │   └── pages/       # TenantsPage, BillingPage, SuperAdminLogin
│   ├── auth/            # Login, registro, perfil (Tenant-aware)
│   │   ├── composables/ # useAuth.ts, useCentralAuth.ts
│   │   ├── interfaces/  # Tipos de auth
│   │   └── pages/       # LoginPage, RegisterPage, etc.
│   ├── bookings/        # Reservas de usuario final
│   │   ├── BookingsList.vue
│   │   └── pages/       # ActiveVehicleControlPage
│   ├── common/          # Componentes transversales
│   │   ├── components/  # Modales, UserMenu
│   │   ├── layouts/     # AppLayout.vue
│   │   └── pages/       # Home, Map, Chatbot, PublicMap
│   ├── map/             # Composables de mapas
│   │   └── composables/
│   └── tickets/         # Sistema de soporte usuario
│       └── pages/       # TicketsPage, CreateTicketPage, etc.
├── services/            # Clientes API
│   ├── api.ts           # Axios configurado para Tenants (apiClient)
│   ├── centralApi.ts    # Axios configurado para Landlord (centralApiClient)
│   └── iotService.ts    # Servicio IoT
├── router/              # Vue Router
│   └── index.ts
└── STYLE.css            # Estilos globales
```

---

## 3. Decisiones Técnicas Clave

### 3.1. Arquitectura Multitenant (Landlord vs Tenant)

El sistema opera bajo un modelo multitenant donde un único frontend sirve a múltiples organizaciones. Se distinguen dos contextos de ejecución:

1.  **Contexto Landlord (Superadmin):** Gestionado a través de `centralApi.ts`. Se utiliza para la creación de tenants, gestión de dominios y facturación global. No requiere la cabecera `X-Tenant`. El token se almacena en `localStorage` como `central_token`.
2.  **Contexto Tenant:** Gestionado a través de `api.ts`. Requiere la identificación del tenant mediante la cabecera `X-Tenant`. El token JWT de sesión se almacena en **Cookies** (`token`).

### 3.2. Identificación del Tenant (Lógica de X-Tenant)

La identificación del tenant se realiza dinámicamente en `src/services/api.ts` mediante la función `getCurrentTenant()` siguiendo este orden de prioridad:
1.  Parámetro de URL: `?tenant=slug` (se persiste inmediatamente en `localStorage`).
2.  Subdominio de la URL actual (ej. `acme.sims.com` -> `acme`).
3.  Valor persistido en `localStorage` bajo la clave `current_tenant`.

El `apiClient` inyecta automáticamente el valor obtenido en la cabecera `X-Tenant` para todas las peticiones que no sean hacia rutas de la central.

### 3.3. Gestión de Sesión (Cookies + Token)

El token JWT para tenants se almacena en **Cookies** (`token`). El archivo `src/services/api.ts` incluye un interceptor de Axios que extrae automáticamente el token para añadirlo a la cabecera `Authorization: Bearer <token>`.

```typescript
// src/services/api.ts
apiClient.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1]

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Inyección de X-Tenant
  const tenant = getCurrentTenant()
  if (tenant && !isSuperAdminRoute()) {
    config.headers['X-Tenant'] = tenant
  }
  
  return config
})
```

### 3.4. Redirección Basada en Autenticación (Router Guards)

En `src/router/index.ts`, los guards controlan el acceso según el contexto:
-   **Rutas Tenant:** Requieren `isAuthenticated`.
-   **Rutas Superadmin:** Requieren validación contra `centralApi.isAuthenticated()`.

```typescript
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, fetchUser, getToken } = useAuth()
  
  // Lógica para rutas de superadmin
  if (to.path.startsWith('/superadmin')) {
    const requiresCentralAuth = to.meta.requiresAuth !== false
    if (requiresCentralAuth && !centralApi.isAuthenticated()) {
      return next('/superadmin/login')
    }
    return next()
  }

  // Lógica para rutas de tenant
  if (getToken() && !isAuthenticated.value) {
    await fetchUser()
  }

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated.value) {
    next('/admin')
  } else {
    next()
  }
})
```

### 3.5. Mapas con Leaflet

Se utiliza Leaflet directamente sobre el DOM para máximo rendimiento con múltiples marcadores.

- `MapPage.vue` - Mapa autenticado con distancia Haversine
- `PublicMapPage.vue` - Mapa público sin login (requiere identificación de tenant vía URL)
- `VehicleMapPage.vue` - Mapa admin con telemetría IoT

### 3.6. Chatbot con Contexto por Rol

`ChatbotPage.vue` conecta con `/api/chatbot/chat`. El frontend calcula el rol del usuario y adapta el mensaje de bienvenida. La petición viaja con la cabecera `X-Tenant` para que el backend use el modelo configurado para el tenant específico.

### 3.7. Control de Vehículos IoT

`ActiveVehicleControlPage.vue` permite el control remoto de activos. Las peticiones POST a `/reservations/{id}/on` y `/reservations/{id}/off` incluyen el `X-Tenant` para asegurar que el comando se envía al microservicio correspondiente a la base de datos del tenant.

---

## 4. Servicios API

### api.ts (Tenant Client)
```typescript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://sims-backend-api-0b2w.onrender.com/api',
  withCredentials: true,
  headers: { 
    'Content-Type': 'application/json',
    'X-Tenant': getCurrentTenant()
  }
})
```

### centralApi.ts (Landlord Client)
```typescript
const centralApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://sims-backend-api-0b2w.onrender.com/api',
  withCredentials: true
})
```

---

## 5. Componentes Admin y Superadmin

| Módulo | Componente | Función |
|------------|---------|-----------|
| Admin | `AdminsTable.vue` | Gestión de flota y usuarios del tenant |
| Superadmin | `TenantsPage.vue` | CRUD de organizaciones y dominios |
| Superadmin | `BillingPage.vue` | Control de suscripciones y facturación |
| Common | `StatusBadge.vue` | Indicadores de estado visuales |

---

## 6. Layouts

| Layout | Ubicación | Uso |
|--------|-----------|-----|
| `AppLayout.vue` | `common/layouts/` | Usuarios finales del tenant |
| `AdminLayout.vue` | `admin/layouts/` | Administradores de la organización |
| `SuperAdminLayout.vue` | `superadmin/layouts/` | Administradores del sistema global |

---
