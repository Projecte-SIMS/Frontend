# Calidad, Depuración y Convenciones (Sprint 5)

**Última actualización:** 2026-03-03

Este documento detalla los estándares de calidad, normas de codificación y herramientas de diagnóstico aplicadas en el proyecto SIMS.

---

## 1. Herramientas de Depuración (Estado Real)

### Frontend
| Herramienta | Estado | Propósito |
|-------------|--------|-----------|
| Vue DevTools | ✅ Instalado | Depuración de componentes Vue |
| Vite HMR | ✅ Activo | Hot Module Replacement |
| vue-tsc | ✅ Configurado | Type checking TypeScript |

### Backend (referencia)
| Herramienta | Estado | Propósito |
|-------------|--------|-----------|
| Laravel Pail | ✅ Instalado | Logs en tiempo real |
| Laravel Tinker | ✅ Instalado | REPL interactivo |
| PHPUnit | ✅ Configurado | Tests automatizados (51+ tests) |
| Laravel Pint | ✅ Instalado | Linting PSR-12 |
| Laravel Telescope | ❌ No instalado | Pendiente |
| Xdebug | ❌ No configurado | Pendiente |
| Sentry | ❌ No instalado | Pendiente |

---

## 2. Convenciones de Codificación

### Nomenclatura (Naming)

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Componentes Vue | PascalCase | `AdminsTable.vue` |
| Páginas | PascalCase + Page | `LoginPage.vue` |
| Composables | camelCase + use | `useAuth.ts` |
| Servicios | camelCase + Service | `iotService.ts` |
| Interfaces TS | camelCase + .interface | `auth.interface.ts` |
| Tipos | PascalCase | `UserResponse`, `IoTDevice` |

### Tipado Estricto

- Se prohíbe el uso de `any`
- Todas las respuestas API tienen interfaces tipadas
- Ejemplos: `UserResponse`, `LoginResponse`, `IoTDevice`, `Vehicle`

```typescript
// Correcto
const users = ref<User[]>([])

// Incorrecto
const users = ref<any>([])
```

### Estructura de Componentes Vue

```vue
<script setup lang="ts">
// 1. Imports
import { ref, onMounted } from 'vue'
import api from '@/services/api'

// 2. Props & Emits
const props = defineProps<{...}>()
const emit = defineEmits<{...}>()

// 3. State (refs, reactive)
const loading = ref(false)

// 4. Composables
const { isAuthenticated } = useAuth()

// 5. Computed
const isValid = computed(() => ...)

// 6. Functions
const fetchData = async () => {...}

// 7. Lifecycle
onMounted(() => {...})
</script>

<template>
  <!-- Template -->
</template>
```

---

## 3. Manejo de Errores

### API Interceptor

```typescript
// src/services/api.ts
apiClient.interceptors.request.use(
  (config) => {...},
  (error) => {
    showToast(error?.message || 'Request error')
    return Promise.reject(error)
  }
)
```

### Notificaciones Toast

```typescript
import showToast from '@/modules/common/composables/useToast'

// Uso
showToast('Operación exitosa', 'success')
showToast('Error al guardar', 'error')
```

---

## 4. Tests (Backend)

El backend cuenta con **51+ tests** en 8 archivos:

| Archivo | Tests | Cobertura |
|---------|-------|-----------|
| `AuthTest.php` | 7 | Login, logout, registro, perfil |
| `VehicleTest.php` | 8 | CRUD vehículos |
| `ReservationTest.php` | 8 | Reservas y conflictos |
| `TicketTest.php` | 9 | Sistema de soporte |
| `AdminMiddlewareTest.php` | 7 | Protección de rutas |
| `IoTControllerTest.php` | 8 | Comandos IoT |
| `RateLimitingTest.php` | 3 | Rate limiting |
| `ExampleTest.php` | 1 | Test básico |

### Ejecución
```bash
cd project-sims-backend
php artisan test
php artisan test --filter=AuthTest
```

---

## 5. Tests Frontend (Pendiente)

| Herramienta | Estado | Prioridad |
|-------------|--------|-----------|
| Vitest | ❌ No configurado | Baja |
| Cypress | ❌ No configurado | Baja |
| Playwright | ❌ No configurado | Baja |

---

## 6. Principios de Diseño

### Responsabilidad Única (SRP)
- Componentes pequeños y enfocados
- Lógica de estado en composables
- Llamadas API en servicios

### Lazy Loading
```typescript
// src/router/index.ts
{ 
  path: 'users', 
  component: () => import('@/modules/admin/modules/users/pages/UserPage.vue') 
}
```

### Modularidad
- Código organizado por dominios bajo `src/modules/`
- Cada módulo tiene su propia estructura (pages, composables, components)
- Facilita el mantenimiento y escalabilidad

---

## 7. Estilos CSS

### TailwindCSS 4.1.18
- Framework CSS utilitario
- Configuración en `tailwind.config.js`
- Estilos globales en `src/STYLE.css`

### Ejemplo
```html
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Guardar
</button>
```

---
