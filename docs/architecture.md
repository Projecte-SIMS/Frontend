# Arquitectura Técnica y Decisiones (Sprint 5)

**Última actualización:** 2026-03-03

Este documento detalla la infraestructura tecnológica de SIMS Frontend y las decisiones de diseño que aseguran la mantenibilidad y el rendimiento del sistema.

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
| Leaflet MarkerCluster | 1.5.3 | Agrupación de marcadores |
| HeadlessUI | 1.7.23 | Componentes accesibles |
| HeroIcons | 2.2.0 | Iconos SVG |
| vue3-toastify | 0.2.8 | Notificaciones toast |

---

## 2. Arquitectura de Directorios Modular

El proyecto se organiza bajo el patrón **Modular por Dominios**:

```
src/
├── modules/
│   ├── admin/           # Panel de administración central
│   │   ├── bookings/    # Gestión de reservas administrativas
│   │   ├── components/  # 12 componentes reutilizables admin
│   │   ├── layouts/     # AdminLayout.vue
│   │   ├── modules/     # Submódulos (users, vehicles, roles)
│   │   ├── pages/       # Dashboard, Map, FleetHealth, IoTDevices
│   │   └── tickets/     # Gestión tickets admin
│   ├── auth/            # Login, registro, perfil
│   │   ├── composables/ # useAuth.ts
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
│   ├── api.ts           # Axios configurado
│   └── iotService.ts    # Servicio IoT
├── router/              # Vue Router
│   └── index.ts
├── composables/         # Composables globales (vacío actualmente)
├── types/               # Tipos globales (vacío actualmente)
└── STYLE.css            # Estilos globales
```

---

## 3. Decisiones Técnicas Clave

### 3.1. Gestión de Sesión (Cookies + Token)

El token JWT se almacena en **Cookies** (`token`). El archivo `src/services/api.ts` incluye un interceptor de Axios que extrae automáticamente el token para añadirlo a la cabecera `Authorization: Bearer <token>`.

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
  return config
})
```

### 3.2. Redirección Basada en Roles (Router Guards)

En `src/router/index.ts`, un guard global detecta si el usuario tiene rol "Admin" para redirigir a `/admin`. Los usuarios normales van a `/`.

```typescript
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, fetchUser, getToken } = useAuth()
  
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

### 3.3. Mapas con Leaflet y Clustering

Se utiliza Leaflet directamente sobre el DOM para máximo rendimiento con múltiples marcadores. Se implementa MarkerCluster para agrupación automática.

- `MapPage.vue` - Mapa autenticado con distancia Haversine
- `PublicMapPage.vue` - Mapa público sin login
- `VehicleMapPage.vue` - Mapa admin con telemetría IoT

### 3.4. Chatbot con Contexto por Rol

`ChatbotPage.vue` conecta con `/api/chatbot/chat`. El backend inyecta automáticamente un prompt según el rol del usuario. El frontend:
- Muestra el rol actual en la interfaz
- Envía solo mensajes user/assistant
- Presenta mensajes de bienvenida personalizados

**Nota:** No es un sistema RAG puro con embeddings, sino un chatbot con contexto inyectado.

### 3.5. Control de Vehículos IoT

`ActiveVehicleControlPage.vue` permite encender/apagar vehículos desde una reserva activa usando el servicio `iotService.ts`.

---

## 4. Servicios API

### api.ts
```typescript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
})
```

### iotService.ts
```typescript
export const iotService = {
  getDevices(): Promise<IoTDevice[]>,
  getDevice(id: string): Promise<IoTDevice | null>,
  pingDevice(id: string): Promise<boolean>,
  turnOn(id: string): Promise<CommandResult>,
  turnOff(id: string): Promise<CommandResult>,
  sendCommand(id: string, action: string, relay?: number): Promise<CommandResult>,
  getUnlinkedDevices(): Promise<IoTDevice[]>,
  getAvailableVehicles(): Promise<Vehicle[]>,
  linkDeviceToVehicle(deviceId: string, vehicleId: number): Promise<LinkResult>,
  healthCheck(): Promise<{ ok: boolean }>
}
```

---

## 5. Componentes Admin Principales

| Componente | Función |
|------------|---------|
| `AdminsTable.vue` | Tabla reactiva con paginación |
| `AdminPagination.vue` | Controles de paginación |
| `Modal.vue` | Contenedor para modales |
| `ConfirmDialog.vue` | Diálogo de confirmación |
| `FormField.vue` | Wrapper de campos de formulario |
| `FormInput.vue` | Input estilizado |
| `FormSelect.vue` | Select estilizado |
| `FormCheckbox.vue` | Checkbox estilizado |
| `StatusBadge.vue` | Badge de estado con colores |
| `PageHeading.vue` | Encabezado de página |
| `AdminTd.vue` | Celda de tabla estilizada |

---

## 6. Layouts

| Layout | Ubicación | Uso |
|--------|-----------|-----|
| `AppLayout.vue` | `common/layouts/` | Usuarios normales - navbar, sidebar, chatbot |
| `AdminLayout.vue` | `admin/layouts/` | Administradores - sidebar fijo con menú admin |

---
