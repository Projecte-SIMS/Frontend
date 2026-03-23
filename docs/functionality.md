# Especificaciones Funcionales y Perfiles de Usuario (Sprint 5)

**Última actualización:** 2026-03-03

Este documento detalla las capacidades operativas reales de la plataforma SIMS, desglosadas por perfiles de acceso y módulos críticos.

---

## 1. Perfiles de Usuario y Capacidades

### 1.1. Admin (Administrador)

El acceso administrativo se centraliza en el **Admin Dashboard** (`/admin`):

| Módulo | Ruta | Funcionalidades |
|--------|------|-----------------|
| Dashboard | `/admin` | Vista general del sistema |
| Usuarios | `/admin/users` | CRUD completo, activar/desactivar cuentas |
| Roles | `/admin/roles` | Crear, editar roles y asignar permisos |
| Vehículos | `/admin/vehicles` | CRUD flota, ver estado IoT |
| Mapa | `/admin/map` | Mapa con telemetría en tiempo real |
| Fleet Health | `/admin/fleet-health` | Estado de salud de la flota |
| IoT Devices | `/admin/iot-devices` | Gestión de dispositivos IoT |
| Reservas | `/admin/bookings` | Ver todas las reservas, forzar finalización |
| Tickets | `/admin/tickets` | Responder tickets de soporte |

### 1.2. Client (Usuario Final)

Interfaz optimizada para la movilidad y la inmediatez:

| Módulo | Ruta | Funcionalidades |
|--------|------|-----------------|
| Home | `/` | Sugerencias de vehículos cercanos |
| Vehículos | `/vehicles` | Lista de vehículos disponibles |
| Mapa | `/vehicles/map` | Localización con Leaflet |
| Reservas | `/bookings` | Ver mis reservas, activar, cancelar, finalizar |
| Control | `/active-vehicle` | Encender/apagar vehículo activo |
| Tickets | `/tickets` | Crear y gestionar tickets de soporte |
| Chatbot | `/chatbot` | Asistente IA con contexto de cliente |
| Perfil | `/perfil` | Ver y editar mi perfil |

### 1.3. Maintenance (Mantenimiento)

En este frontend, el rol `Maintenance` se utiliza principalmente para adaptar el mensaje de bienvenida del chatbot.

---

## 2. Módulos y Flujos Críticos

### 2.1. Flujo de Reserva

```
1. Usuario ve mapa de vehículos → /vehicles/map
2. Selecciona vehículo disponible
3. Confirma reserva (ReservationConfirmModal)
4. Estado: "pending"
5. Activa reserva → Estado: "active"
6. Puede encender/apagar vehículo → /active-vehicle
7. Finaliza reserva (FinishTripConfirmModal)
8. Ve resumen (TripSummaryModal)
9. Estado: "completed"
```

### 2.2. Control de Vehículos IoT

Desde `ActiveVehicleControlPage.vue`:

```typescript
// Encender vehículo asociado a una reserva activa
POST /reservations/{id}/on

// Apagar vehículo asociado a una reserva activa
POST /reservations/{id}/off
```

### 2.3. Sistema de Tickets

```
1. Usuario crea ticket → /tickets/create
2. Admin ve ticket en → /admin/tickets
3. Admin responde
4. Usuario ve respuesta en → /tickets/:id
5. Conversación continúa hasta cierre
```

### 2.4. Chatbot con IA

`ChatbotPage.vue` envía la conversación al endpoint `/api/chatbot/chat`. El rol del usuario se usa para construir el mensaje de bienvenida inicial:

| Rol | Contexto |
|-----|----------|
| Admin | Gestión de sistema, usuarios, flota |
| Client | Reservas, uso del servicio, dudas |
| Maintenance | Procedimientos técnicos, mantenimiento |

**Nota:** No es RAG puro; es un chatbot que envía el historial de conversación al backend.

---

## 3. Páginas por Módulo

### Auth
| Página | Archivo | Descripción |
|--------|---------|-------------|
| Login | `LoginPage.vue` | Formulario de login |
| Registro | `RegisterPage.vue` | Formulario de registro |
| Dashboard | `DashboardPage.vue` | Panel de usuario |
| Editar Perfil | `EditProfilePage.vue` | Modificar datos |

### Common
| Página | Archivo | Descripción |
|--------|---------|-------------|
| Home | `HomePage.vue` | Página principal |
| Mapa | `MapPage.vue` | Mapa autenticado |
| Mapa Público | `PublicMapPage.vue` | Mapa sin login |
| Vehículos | `VehiclesListPage.vue` | Lista de vehículos |
| Chatbot | `ChatbotPage.vue` | Asistente IA |
| 404 | `NotFoundPage.vue` | Página no encontrada |

### Bookings
| Página | Archivo | Descripción |
|--------|---------|-------------|
| Lista | `BookingsList.vue` | Mis reservas |
| Control | `ActiveVehicleControlPage.vue` | On/off vehículo |

### Tickets
| Página | Archivo | Descripción |
|--------|---------|-------------|
| Lista | `TicketsPage.vue` | Mis tickets |
| Crear | `CreateTicketPage.vue` | Nuevo ticket |
| Conversación | `TicketConversationPage.vue` | Ver mensajes |

### Admin
| Página | Archivo | Descripción |
|--------|---------|-------------|
| Dashboard | `AdminDashboardPage.vue` | Vista general |
| Mapa | `VehicleMapPage.vue` | Mapa con telemetría |
| Fleet Health | `FleetHealthPage.vue` | Salud de flota |
| IoT Devices | `IoTDevicesPage.vue` | Dispositivos IoT |

### Admin > Users
| Página | Archivo | Descripción |
|--------|---------|-------------|
| Lista | `UserPage.vue` | CRUD usuarios |
| Detalle | `UserDetailPage.vue` | Ver usuario |
| Formulario | `UserFormPage.vue` | Crear/editar |

### Admin > Vehicles
| Página | Archivo | Descripción |
|--------|---------|-------------|
| Lista | `VehiclesPage.vue` | CRUD vehículos |
| Detalle | `ShowVehiclePage.vue` | Ver vehículo |
| Crear | `CreateVehiclePage.vue` | Nuevo vehículo |
| Editar | `EditVehiclePage.vue` | Modificar |

### Admin > Roles
| Página | Archivo | Descripción |
|--------|---------|-------------|
| Lista | `RolePage.vue` | CRUD roles |
| Detalle | `RoleDetailPage.vue` | Ver rol |
| Formulario | `RoleFormPage.vue` | Crear/editar |

### Admin > Bookings
| Página | Archivo | Descripción |
|--------|---------|-------------|
| Lista | `BookingsPage.vue` | Todas las reservas |
| Detalle | `BookingDetailPage.vue` | Ver reserva |
| Formulario | `BookingFormPage.vue` | Editar reserva |

### Admin > Tickets
| Página | Archivo | Descripción |
|--------|---------|-------------|
| Lista | `TicketsPage.vue` | Todos los tickets |
| Detalle | `TicketDetailPage.vue` | Responder ticket |

---

## 4. Rutas Protegidas (Router Guards)

| Ruta | Meta | Comportamiento |
|------|------|----------------|
| `/map` | `requiresAuth: false` | Mapa público de vehículos |
| `/login` | - | Redirige a /admin si autenticado |
| `/register` | - | Redirige a /admin si autenticado |
| `/` | `requiresAuth: true` | Home (requiere login) |
| `/vehicles/*` | `requiresAuth: true` | Requiere login |
| `/bookings` | `requiresAuth: true` | Requiere login |
| `/tickets/*` | `requiresAuth: true` | Requiere login |
| `/chatbot` | `requiresAuth: true` | Requiere login |
| `/perfil/*` | `requiresAuth: true` | Requiere login |
| `/admin/*` | `requiresAuth: true` | Requiere login + rol Admin |

---
