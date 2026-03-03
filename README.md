# SIMS – Frontend Vue (Sistema de Movilidad Sostenible)

**Versión:** Sprint 5 – Producción  
**Fecha:** 2026-03-03  
**Última actualización:** 2026-03-03

---

## Descripción General

SIMS es una plataforma avanzada diseñada para la gestión de servicios de movilidad sostenible (carsharing eléctrico). Este repositorio contiene el frontend desarrollado en **Vue 3**, enfocado en la eficiencia operativa y una experiencia de usuario intuitiva apoyada por Inteligencia Artificial.

---

## Índice de Documentación

| Documento | Descripción |
|-----------|-------------|
| [**Manual de Usuario**](docs/MANUAL_USUARIO.md) | Guía completa por rol |
| [Guía de Despliegue](docs/deployment.md) | Instalación y despliegue |
| [Arquitectura Técnica](docs/architecture.md) | Stack tecnológico y decisiones |
| [Catálogo de Componentes](docs/components.md) | Librería de UI personalizada |
| [Especificaciones Funcionales](docs/functionality.md) | Roles y flujos de negocio |
| [Calidad y QA](docs/qa.md) | Herramientas de depuración |

---

## Stack Tecnológico (Verificado)

| Componente | Versión |
|------------|---------|
| Vue | 3.5.26 |
| TypeScript | 5.9.3 |
| Vite | 7.3.1 |
| TailwindCSS | 4.1.18 |
| Axios | 1.13.3 |
| Vue Router | 4.6.4 |
| Leaflet | 1.9.4 |
| Leaflet MarkerCluster | 1.5.3 |
| HeadlessUI | 1.7.23 |
| HeroIcons | 2.2.0 |
| vue3-toastify | 0.2.8 |

---

## Estructura del Proyecto

```
src/
├── modules/
│   ├── admin/                      # Panel administrativo
│   │   ├── bookings/               # Gestión reservas admin
│   │   │   └── pages/              # BookingsPage, BookingDetailPage, BookingFormPage
│   │   ├── components/             # 12 componentes reutilizables
│   │   ├── layouts/
│   │   │   └── AdminLayout.vue
│   │   ├── modules/
│   │   │   ├── users/              # CRUD usuarios
│   │   │   ├── vehicles/           # CRUD vehículos
│   │   │   ├── roles/              # CRUD roles
│   │   │   └── tickets/            # (vacío - usa tickets/)
│   │   ├── pages/
│   │   │   ├── AdminDashboardPage.vue
│   │   │   ├── VehicleMapPage.vue
│   │   │   ├── FleetHealthPage.vue
│   │   │   └── IoTDevicesPage.vue
│   │   └── tickets/
│   │       └── pages/              # TicketsPage, TicketDetailPage
│   │
│   ├── auth/                       # Autenticación
│   │   ├── composables/
│   │   │   └── useAuth.ts
│   │   └── pages/
│   │       ├── LoginPage.vue
│   │       ├── RegisterPage.vue
│   │       ├── DashboardPage.vue
│   │       └── EditProfilePage.vue
│   │
│   ├── bookings/                   # Reservas usuario
│   │   ├── BookingsList.vue
│   │   └── pages/
│   │       └── ActiveVehicleControlPage.vue
│   │
│   ├── common/                     # Componentes compartidos
│   │   ├── components/
│   │   │   ├── FinishTripConfirmModal.vue
│   │   │   ├── ReservationConfirmModal.vue
│   │   │   ├── TripSummaryModal.vue
│   │   │   └── UserMenu.vue
│   │   ├── layouts/
│   │   │   └── AppLayout.vue
│   │   └── pages/
│   │       ├── HomePage.vue
│   │       ├── MapPage.vue
│   │       ├── PublicMapPage.vue
│   │       ├── VehiclesListPage.vue
│   │       ├── ChatbotPage.vue
│   │       └── NotFoundPage.vue
│   │
│   ├── map/                        # Composables de mapas
│   │   └── composables/
│   │
│   └── tickets/                    # Sistema de soporte
│       └── pages/
│           ├── TicketsPage.vue
│           ├── CreateTicketPage.vue
│           ├── TicketConversationPage.vue
│           └── ...
│
├── services/
│   ├── api.ts                      # Cliente Axios configurado
│   └── iotService.ts               # Servicio IoT
│
├── router/
│   └── index.ts                    # Configuración de rutas
│
└── STYLE.css                       # Estilos globales
```

---

## Estado Actual del Frontend

### ✅ Completado

| Funcionalidad | Estado |
|---------------|--------|
| Login y registro de usuarios | ✅ |
| Dashboard de usuario | ✅ |
| Edición de perfil | ✅ |
| Mapa de vehículos (Leaflet) | ✅ |
| Mapa público sin autenticación | ✅ |
| Lista de vehículos | ✅ |
| Sistema de reservas | ✅ |
| Control de vehículo activo (on/off) | ✅ |
| Sistema de tickets/soporte | ✅ |
| Chatbot con contexto por rol | ✅ |
| Panel Admin completo | ✅ |
| CRUD Usuarios (Admin) | ✅ |
| CRUD Vehículos (Admin) | ✅ |
| CRUD Roles/Permisos (Admin) | ✅ |
| Gestión de reservas (Admin) | ✅ |
| Gestión de tickets (Admin) | ✅ |
| Página IoT Devices (Admin) | ✅ |
| Fleet Health (Admin) | ✅ |
| Responsive design | ✅ |
| Notificaciones (toast) | ✅ |

### ⚠️ Pendiente / Mejoras

| Tarea | Prioridad |
|-------|-----------|
| Tests E2E (Cypress/Playwright) | Baja |
| Modo oscuro | Opcional |
| PWA / Service Worker | Opcional |

---

## Páginas y Rutas

### Rutas Públicas
| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/map` | PublicMapPage | Mapa público de vehículos |
| `/login` | LoginPage | Formulario de login |
| `/register` | RegisterPage | Formulario de registro |

### Rutas Usuario (requiere auth)
| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | HomePage | Página principal |
| `/vehicles` | VehiclesListPage | Lista de vehículos |
| `/vehicles/map` | MapPage | Mapa interactivo |
| `/bookings` | BookingsList | Mis reservas |
| `/active-vehicle` | ActiveVehicleControlPage | Control vehículo activo |
| `/tickets` | TicketsPage | Mis tickets |
| `/tickets/create` | CreateTicketPage | Crear ticket |
| `/tickets/:id` | TicketConversationPage | Conversación ticket |
| `/chatbot` | ChatbotPage | Asistente IA |
| `/perfil` | DashboardPage | Mi perfil |
| `/perfil/editar` | EditProfilePage | Editar perfil |

### Rutas Admin (requiere auth + rol Admin)
| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/admin` | AdminDashboardPage | Dashboard admin |
| `/admin/map` | VehicleMapPage | Mapa admin |
| `/admin/fleet-health` | FleetHealthPage | Salud de flota |
| `/admin/iot-devices` | IoTDevicesPage | Dispositivos IoT |
| `/admin/users` | UserPage | Gestión usuarios |
| `/admin/users/:id` | UserDetailPage | Detalle usuario |
| `/admin/vehicles` | VehiclesPage | Gestión vehículos |
| `/admin/roles` | RolePage | Gestión roles |
| `/admin/bookings` | BookingsPage | Gestión reservas |
| `/admin/tickets` | TicketsPage | Gestión tickets |

---

## Instalación y Desarrollo

### Requisitos
- Node.js v20.19.0+ (recomendado v22.12.0+)
- npm o pnpm

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/Projecte-SIMS/Frontend.git
cd project-sims-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con VITE_API_URL

# Ejecutar en desarrollo
npm run dev
```

### Build para producción
```bash
npm run build
```

### Docker
```bash
docker build -t sims-frontend:latest .
docker run -d -p 80:80 sims-frontend:latest
```

---

## Servicios API

### api.ts
Cliente Axios configurado con interceptor para token Bearer automático.

### iotService.ts
Servicio para operaciones IoT:
- `getDevices()` - Lista dispositivos
- `pingDevice(id)` - Verificar online
- `turnOn(id)` / `turnOff(id)` - Control vehículos
- `linkDeviceToVehicle(deviceId, vehicleId)` - Vincular

---

## Licencia

Este software se distribuye bajo la licencia **EUPL v1.2** (European Union Public Licence).

---

**Equipo de Desarrollo SIMS**
