# Calidad, Depuración y Convenciones (Detalle Real)

Este documento detalla los estándares de calidad, normas de codificación y herramientas de diagnóstico aplicadas en el proyecto SIMS (Sprint 5).

## 1. Herramientas de Depuración y Diagnóstico (Selección Real)

| Herramienta | Tipo | Propósito Principal en SIMS |
| :--- | :--- | :--- |
| **Xdebug** | Extensión PHP | Depuración profunda del backend Laravel. Permite inspeccionar el flujo de datos exacto de la API. |
| **Laravel Telescope** | Dashboard Interno | Monitorización de peticiones HTTP de Axios, logs de depuración y excepciones en tiempo real. |
| **Sentry** | Error Tracking | Captura de errores reales en producción del frontend Vue y backend Laravel, informando sobre fallos críticos. |
| **TestTools (Chrome)** | Navegador | Registro de flujos de usuario (ej. Login exitoso -> Reserva -> Ticket) para automatizar pruebas. |

### Por qué las hemos elegido
Se ha optado por **Laravel Telescope** para el desarrollo local debido a su integración nativa, y **Sentry** para garantizar la estabilidad post-despliegue. **Xdebug** es la herramienta de referencia para resolver errores lógicos complejos mediante breakpoints.

## 2. Convenciones de Codificación Reales
- **Nomenclatura (Naming)**:
  - Componentes Vue: `PascalCase.vue` (ej. `AdminsTable.vue`).
  - Composables: `useName.ts` (ej. `useAuth.ts`, `useMap.ts`).
  - Interfaces TS: `nombre.interface.ts` (ej. `auth.interface.ts`, `role.interface.ts`).
- **Tipado Estricto**: Se prohíbe el uso de `any`. Las respuestas de la API están tipadas mediante interfaces como `UserResponse`, `LoginResponse`, `RolePagination` o `VehiclePagination`.
- **Estructura Modular**: El código está organizado por dominios bajo `src/modules/`, facilitando el **lazy loading** de componentes en `src/router/index.ts`.
- **Intercepción de API**: Todas las peticiones HTTP pasan por el interceptor global en `src/services/api.ts` para inyectar automáticamente el token Bearer y capturar errores de red o servidor mediante `vue3-toastify`.

## 3. Calidad y Mantenimiento de Código
- **Comentarios Proactivos**: Se utiliza el estándar JSDoc para documentar la lógica de negocio en los composables.
- **Principio de Responsabilidad Única (SRP)**: Los componentes de Vue se mantienen pequeños y enfocados, delegando la lógica de estado y llamadas a la API a sus respectivos composables.
- **Refactorización Continua**: Revisión periódica de la biblioteca de componentes para asegurar que cumplen con el sistema de diseño centralizado en `src/STYLE.css`.

---
