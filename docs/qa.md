# Calidad, Depuración y Convenciones (Detalle Real)

Este documento detalla los estándares de calidad, normas de codificación y herramientas de diagnóstico aplicadas en el proyecto SIMS (Sprint 5).

## 1. Herramientas de Depuración y Diagnóstico (Estado Real)

| Herramienta | Tipo | Estado | Propósito |
| :--- | :--- | :--- | :--- |
| **Laravel Pail** | CLI Tool | ✅ Instalado | Monitorización de logs en tiempo real |
| **Laravel Tinker** | REPL | ✅ Instalado | Interacción con la aplicación vía CLI |
| **PHPUnit** | Testing | ✅ Configurado | Tests automatizados (41+ tests) |
| **Vue DevTools** | Browser | ✅ Instalado | Depuración de componentes Vue |
| **Xdebug** | Extensión PHP | ❌ No configurado | Pendiente para debugging profundo |
| **Laravel Telescope** | Dashboard | ❌ No instalado | Pendiente para monitorización |
| **Sentry** | Error Tracking | ❌ No instalado | Pendiente para producción |

### Comandos de Diagnóstico Disponibles
```bash
# Logs en tiempo real (backend)
php artisan pail

# REPL interactivo
php artisan tinker

# Ejecutar tests
php artisan test
./vendor/bin/phpunit
```

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

## 4. Tests Automatizados (Backend)

El proyecto cuenta con **41+ tests** organizados en:

| Archivo | Tests | Cobertura |
|---------|-------|-----------|
| `AuthTest.php` | 7 | Login, logout, perfil |
| `VehicleTest.php` | 9 | CRUD vehículos |
| `ReservationTest.php` | 9 | Reservas y conflictos |
| `TicketTest.php` | 9 | Sistema de soporte |
| `AdminMiddlewareTest.php` | 7 | Protección de rutas |

---
