# SIMS – Frontend Vue
**Versión:** Sprint 5 – First Deployment  
**Fecha:** 2026-02-23

---

## Descripción General

Este repositorio contiene el frontend web de SIMS, implementado en Vue 3 + Vite. Proporciona interfaces para usuarios y administradores, permitiendo la gestión y visualización de vehículos, tickets, reservas, roles y permisos.

---

## Stack y Librerías Principales

- **Vue 3** – Framework principal
- **Vite** – Bundler y servidor de desarrollo
- **Vue Router** – Enrutamiento SPA
- **TailwindCSS** – Utilidades CSS
- **@headlessui/vue** y **@heroicons/vue** – Componentes accesibles y SVG icons
- **Leaflet** – Mapas interactivos
- **Axios** – Llamadas HTTP
- **vue3-toastify** – Notificaciones

### Dependencias (package.json)

- @headlessui/vue
- @heroicons/vue
- @tailwindcss/vite
- @types/leaflet
- axios
- leaflet
- tailwindcss
- vue
- vue-router
- vue3-toastify

### DevDependencies

- @vitejs/plugin-vue
- vite-plugin-vue-devtools
- vue-tsc
- typescript
- @types/node
- npm-run-all2

---

## Desarrollo y Ejecución

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Ejecuta en modo desarrollo:
   ```bash
   npm run dev
   ```
3. Compila para producción:
   ```bash
   npm run build
   ```
4. Variables de entorno en `.env` (ejemplo: endpoints backend, claves API, etc).
5. Docker y `docker-compose.yml` disponibles para despliegue.
6. Node.js 20+ recomendado.

---

## Arquitectura y Componentes

- **SPA Vue:** Login, registro, panel de usuario, panel de administración, CRUD de entidades.
- **Mapas:** Vista de vehículos en mapa interactivo (Leaflet).
- **Chatbot:** Asistente AI flotante disponible en toda la app.
- **Navegación:** Menús y rutas diferenciadas por rol (usuario/admin).
- **Integración:** Consumo de endpoints backend vía Axios.

---

## Seguridad y Validaciones

- **Protección por roles y autenticación.**
- **Validaciones básicas en formularios.**
- **No exponer credenciales en frontend.**

---

## Estado Actual

- Vistas y formularios completos y auditados.
- Navegación y roles correctamente implementados.
- Listo para integración y despliegue.

---

## Recomendaciones

- Mejorar validaciones y experiencia de usuario en futuros sprints.
- Añadir tests de integración frontend-backend.

---
