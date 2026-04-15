# Flujo de Identificación Multitenant en Frontend

Este documento describe el mecanismo técnico mediante el cual una única aplicación Vue 3 (SPA) gestiona múltiples contextos de organización (tenants) de forma dinámica y transparente para el usuario.

## 1. Identificación y Resolución del Contexto (URL Resolution)

El proceso se inicia en el punto de entrada de la aplicación (`main.ts` y el servicio `api.ts`). El frontend debe determinar qué tenant está solicitando recursos para inyectar esta información en todas las peticiones hacia el backend en Render.

### Estrategias de Resolución en `src/services/api.ts`

La función `getCurrentTenant()` implementa una jerarquía de resolución:

1.  **Explícita por Parámetro (URL Query):**
    Si la URL contiene `?tenant=slug` (ej. `https://sims-frontend.vercel.app/login?tenant=acme`), el sistema captura `acme` y lo guarda como la fuente de verdad.
    
2.  **Implícita por Subdominio (Production Host):**
    En dominios de producción personalizados (ej. `acme.fleetly.com`), el sistema extrae el primer componente del hostname. Se aplican exclusiones para dominios base como `localhost`, `vercel.app` y `onrender.com`.

3.  **Persistencia Local (LocalStorage):**
    El identificador resuelto se almacena en `localStorage` bajo la clave `current_tenant`. Esto permite que la navegación subsiguiente mantenga el contexto sin necesidad de parámetros adicionales en la URL.

## 2. Persistencia y Ciclo de Vida del Contexto

La persistencia en `localStorage` asegura la estabilidad del contexto durante la sesión del usuario. 

-   **Almacenamiento:** `localStorage.setItem('current_tenant', slug)`.
-   **Recuperación:** En cada inicio o recarga de la aplicación, el servicio `api.ts` consulta este valor para configurar el cliente Axios.
-   **Validación:** Si se detectan valores inválidos o pertenecientes a dominios de infraestructura, el sistema limpia la entrada para evitar colisiones.

## 3. Inyección Automática de Identidad (Axios Interceptor)

La comunicación con el backend requiere que cada petición HTTP incluya la cabecera `X-Tenant`. Esta lógica está centralizada en `src/services/api.ts`.

### Configuración del Interceptor de Petición

```typescript
apiClient.interceptors.request.use((config) => {
  // Identificación del Tenant
  const tenant = getCurrentTenant();
  
  if (tenant && !isSuperAdminRoute()) {
    config.headers['X-Tenant'] = tenant;
    
    // Log de auditoría en modo producción
    if (import.meta.env.PROD) {
      console.log(`[API Request] Tenant context: ${tenant}`);
    }
  } else if (!isSuperAdminRoute()) {
    console.warn('Advertencia: No se ha detectado un contexto de tenant válido.');
  }

  return config;
});
```

Este mecanismo asegura que el backend (Laravel Landlord) pueda interceptar la cabecera y realizar el `switch` de base de datos antes de procesar la lógica de negocio.

## 4. Flujo de Autenticación Tenant-Aware

El proceso de login y registro está intrínsecamente ligado al tenant resuelto:

1.  El usuario accede a `/login` con el contexto `acme`.
2.  La petición `POST /api/login` se envía con `X-Tenant: acme`.
3.  El backend valida las credenciales en la base de datos de `acme`.
4.  Si el éxito es confirmado, el token JWT se guarda en las cookies del dominio actual.
5.  El frontend redirige al Dashboard de administración del tenant (`/admin`).

## 5. Separación de Contextos: Superadmin vs Tenant

El sistema mantiene una separación estricta entre la gestión global y la operativa de tenants:

-   **Rutas `/superadmin/*`:** Utilizan el `centralApiClient` (`src/services/centralApi.ts`). No envían la cabecera `X-Tenant`. Se comunican con los endpoints del landlord para gestionar la flota de tenants y facturación.
-   **Rutas `/admin/*` y `/app/*`:** Utilizan el `apiClient` estándar. Inyectan obligatoriamente el `X-Tenant`. Se comunican con la lógica de negocio específica de la organización.

## 6. Manejo de Errores y Estados de UI

-   **Tenant Inexistente:** Si el backend devuelve un error de resolución de tenant (404), el interceptor de Axios puede capturar el error y redirigir a una página de error global o mostrar una notificación mediante `vue3-toastify`.
-   **Sin Contexto:** Si no se encuentra un tenant en la URL ni en el almacenamiento local, el sistema muestra advertencias en la consola y limita las funcionalidades que requieren persistencia.

## 7. Checklist de Verificación para Desarrolladores

Para asegurar la integridad del flujo multitenant, cada nuevo módulo debe verificar:
- [ ] Uso exclusivo de `apiClient` para peticiones de datos de organización.
- [ ] No hardcodear identificadores de tenant en las rutas de Vue Router.
- [ ] Verificar que las llamadas a servicios externos (ej. IoT) también porten el contexto mediante el interceptor global.
- [ ] Asegurar que las cookies de sesión no se compartan entre diferentes subdominios si se requiere aislamiento total.

---

Para más detalles sobre la arquitectura global, consulte [architecture.md](./architecture.md).
Para guías de despliegue, consulte [deployment.md](./deployment.md).

