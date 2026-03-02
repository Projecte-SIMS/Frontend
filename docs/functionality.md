# Especificaciones Funcionales y Perfiles de Usuario (Sprint 5)

Este documento detalla las capacidades operativas reales de la plataforma SIMS, desglosadas por perfiles de acceso y módulos críticos.

## 1. Perfiles de Usuario y Capacidades

### Admin (Administrador)
El acceso administrativo se centraliza en el **Admin Dashboard**, que ofrece:
- **Gestión de Usuarios (`/admin/users`)**: Control de cuentas, perfiles y estados de activación.
- **Gestión de Roles (`/admin/roles`)**: Sistema granular de permisos agrupados por módulos (ej. `users`, `vehicles`, `bookings`).
- **Gestión de Flota (`/admin/vehicles`)**: CRUD completo de vehículos incluyendo matrícula, marca, modelo y estado operativo (`active`).
- **Control de Reservas (`/admin/bookings`)**: Historial y gestión de alquileres en tiempo real.
- **Soporte Técnico (`/admin/tickets`)**: Resolución de incidencias mediante un sistema de conversación directa.

### Client (Usuario Final)
Interfaz optimizada para la movilidad y la inmediatez:
- **Mapa Interactivo (`/vehicles/map`)**: Localización de vehículos mediante Leaflet con indicadores de disponibilidad.
- **Home Proactiva (`/`)**: Sugerencia de vehículos cercanos calculada mediante algoritmos de distancia geodésica.
- **Autogestión de Reservas (`/bookings`)**: Consulta de estados y tiempos de alquiler.
- **Soporte y Ayuda**: Acceso a tickets de soporte (`/tickets`) y al Asistente AI (`/chatbot`).

### Maintenance (Mantenimiento)
Permisos específicos para gestión técnica:
- **Ver vehículos**: Acceso a listado de flota.
- **Gestionar vehículos**: Actualizar estado técnico y disponibilidad.

## 2. Módulos y Flujos Críticos

### 2.1. Gestión de Flota y Estados
Los vehículos en SIMS mantienen un estado de actividad dual:
- **`active` (PostgreSQL)**: Define si el vehículo está en uso (reserva activa).
- **`mongo_active` (MongoDB)**: Estado dinámico en tiempo real desde telemetría IoT.

### 2.2. Sistema de Ayuda con IA (Chatbot)
El chatbot (`ChatbotPage.vue`) proporciona asistencia personalizada:
1. Recibe el historial de mensajes (roles: `user`, `assistant`).
2. El backend inyecta un prompt de sistema según el rol del usuario.
3. Consulta el endpoint `/api/chatbot/chat`.
4. Responde con contexto adaptado al perfil del usuario.

**Nota:** No es un sistema RAG puro con retrieval de documentos. Es un chatbot con contexto por rol.

### 2.3. Gestión de Soporte
El flujo de tickets permite una comunicación bidireccional entre el cliente y el administrador, asegurando que cada incidencia tenga un seguimiento trazable desde su creación (`/tickets/create`) hasta su cierre.

## 3. Rutas Protegidas

| Ruta | Acceso | Middleware |
|------|--------|------------|
| `/` | Todos | `requiresAuth` |
| `/vehicles/*` | Todos | `requiresAuth` |
| `/bookings` | Todos | `requiresAuth` |
| `/tickets/*` | Todos | `requiresAuth` |
| `/chatbot` | Todos | `requiresAuth` |
| `/admin/*` | Solo Admin | `requiresAuth` + rol Admin |

---
