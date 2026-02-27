# Especificaciones Funcionales y Perfiles de Usuario (Sprint 5)

Este documento detalla las capacidades operativas reales de la plataforma SIMS, desglosadas por perfiles de acceso y módulos críticos.

## 1. Perfiles de Usuario y Capacidades

### Superadmin / Tenant Admin
El acceso administrativo se centraliza en el **Admin Dashboard**, que ofrece una visión cuantitativa y directa de:
- **Gestión de Usuarios (`/admin/users`)**: Control de cuentas, perfiles y estados de activación.
- **Gestión de Roles (`/admin/roles`)**: Sistema granular de permisos agrupados por módulos (ej. `users`, `vehicles`, `bookings`).
- **Gestión de Flota (`/admin/vehicles`)**: CRUD completo de vehículos incluyendo matrícula, marca, modelo y estado operativo (`active`).
- **Control de Reservas (`/admin/bookings`)**: Historial y gestión de alquileres en tiempo real.
- **Soporte Técnico (`/admin/tickets`)**: Resolución de incidencias mediante un sistema de conversación directa.

### Cliente / Usuari Final
Interfaz optimizada para la movilidad y la inmediatez:
- **Mapa Interactivo (`/vehicles/map`)**: Localización de vehículos mediante Leaflet con indicadores de disponibilidad.
- **Home Proactiva (`/`)**: Sugerencia de vehículos cercanos calculada mediante algoritmos de distancia geodésica.
- **Autogestión de Reservas (`/bookings`)**: Consulta de estados y tiempos de alquiler.
- **Soporte y Ayuda**: Acceso a tickets de soporte (`/tickets`) y al Asistente AI (`/chatbot`).

## 2. Módulos y Flujos Críticos

### 2.1. Gestión de Flota y Estados
Los vehículos en SIMS mantienen un estado de actividad dual:
- **`active` (Booleano)**: Define si el vehículo es administrativamente apto para el servicio.
- **`mongo_active` (Tiempo Real)**: Estado dinámico que indica si el vehículo está siendo utilizado en ese preciso instante.

### 2.2. Sistema de Ayuda RAG (Chatbot)
El chatbot (`ChatbotPage.vue`) no es un simple buscador. Implementa un flujo de **Generación Aumentada por Recuperación (RAG)**:
1. Recibe el historial de mensajes (roles: `system`, `user`, `assistant`).
2. Consulta el endpoint `/chatbot/chat` del backend.
3. Responde basándose exclusivamente en la base de conocimientos de SIMS para evitar alucinaciones.

### 2.3. Gestión de Soporte
El flujo de tickets permite una comunicación bidireccional entre el cliente y el administrador del tenant, asegurando que cada incidencia tenga un seguimiento trazable desde su creación (`/tickets/create`) hasta su cierre.

---
