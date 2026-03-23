# Flujo Frontend Unico en Multi-tenant

Este documento describe como implementar un unico frontend para multiples tenants, donde cada tenant opera sobre su propia base de datos.

## 1) Objetivo de UX

- Tener una sola aplicacion frontend.
- Cada usuario entra en el contexto de su tenant.
- Login/register siempre operan en la DB del tenant seleccionado.
- Segun rol, el usuario ve panel `tenant-admin` o `tenant-client`.

## 2) Modelos de entrada recomendados

Hay dos estrategias viables para un frontend unico:

### A) Subdominio por tenant (recomendado)
- `acme.tuapp.com`
- `beta.tuapp.com`

Ventajas:
- Aislamiento claro por tenant.
- Login/register ya van al host correcto.
- Menos riesgo de mezclar sesiones entre tenants.

### B) Ruta por tenant (fallback)
- `tuapp.com/t/acme/login`
- `tuapp.com/t/beta/login`

Ventajas:
- Mas simple si no puedes configurar DNS/subdominios.

Importante:
- El backend actual resuelve tenant por host/subdominio.
- Si usas rutas (`/t/{slug}`), el frontend debe redirigir o consumir backend con `Host` de tenant.

## 3) Flujo principal recomendado (Subdominio)

1. Usuario abre `https://acme.tuapp.com`.
2. Frontend detecta tenant desde `window.location.host`.
3. Frontend hace `GET /api/tenant/context`:
   - `401`: no autenticado -> ir a login/register tenant.
   - `200`: autenticado -> resolver rol y redirigir dashboard.
4. Usuario hace login/register en ese host tenant:
   - `POST /api/login`
   - `POST /api/register`
5. Guardar token Sanctum (Bearer).
6. Cargar `/api/tenant/context` y decidir UI por rol:
   - rol `Admin` -> area tenant admin.
   - resto -> area tenant client.

## 4) Flujo alternativo (Tenant selector)

Si el usuario entra por dominio central (`app.tuapp.com`):

1. Mostrar pantalla "Selecciona tu tenant".
2. Usuario elige tenant (slug o dominio).
3. Redirigir al subdominio del tenant:
   - `acme` -> `https://acme.tuapp.com/login`
4. A partir de aqui, login/register en contexto tenant.

Opcional:
- El panel central (`/api/landlord/tenants`) puede alimentar ese selector (solo para admins centrales).
- Para publico final, lo normal es que ya conozcan su subdominio.

## 5) Login y register tenant-aware

El frontend NO necesita enviar `tenant_id` en login/register si usa host tenant.

Endpoints:
- `POST /api/login`
- `POST /api/register`

Condicion critica:
- Llamar siempre al backend del host tenant actual.
- No reutilizar token entre tenants distintos.

## 6) Session y almacenamiento de token

Recomendacion:
- Guardar token con namespace por tenant para evitar mezcla.

Ejemplo de key:
- `auth_token::acme.tuapp.com`
- `auth_token::beta.tuapp.com`

En cada request:
- leer token del tenant actual.
- enviar `Authorization: Bearer {token}`.

Al hacer logout:
- `POST /api/logout`
- borrar token solo del tenant actual.

## 7) Routing frontend (single app)

Estructura sugerida:

- Public:
  - `/login`
  - `/register`
- Tenant client:
  - `/app/client/*`
- Tenant admin:
  - `/app/admin/*`

Guards:
- `RequireAuth`: exige token valido.
- `RequireTenantContext`: exige `GET /api/tenant/context` == 200.
- `RequireRole('Admin')`: solo admin tenant.

Redirecciones:
- autenticado + admin -> `/app/admin/dashboard`
- autenticado + client -> `/app/client/dashboard`
- no autenticado -> `/login`

## 8) Bootstrap de app (frontend)

Al iniciar la app:

1. Resolver `tenantHost` desde URL.
2. Cargar token tenant-scoped.
3. Si hay token, llamar `GET /api/tenant/context`.
4. Si falla con `401`, limpiar token y mandar a login.
5. Si `404`, mostrar "Tenant no encontrado o inactivo".
6. Si `200`, inicializar store con:
   - tenant
   - user
   - roles

## 9) Registro de nuevos usuarios por tenant

Para que cada usuario se registre en "su" tenant:

- el usuario debe estar en el host tenant correcto.
- `POST /api/register` crea usuario en DB tenant actual.

Ejemplo:
- registro en `acme.tuapp.com` => usuario en DB de ACME.
- el mismo email en `beta.tuapp.com` puede existir si negocio lo permite (aislamiento por DB).

## 10) Manejo de errores recomendado en UI

- `401`: sesion expirada o no autenticado.
- `403`: rol insuficiente (ej. entrar a area admin siendo client).
- `404` en tenant routes: tenant inexistente/inactivo.
- `422`: validaciones de formularios.
- `500`: error interno.

Mensajes UX sugeridos:
- `404 tenant`: "Este tenant no existe o esta desactivado."
- `403 admin`: "No tienes permisos para acceder a esta seccion."

## 11) Endpoints clave para frontend

Contexto tenant:
- `GET /api/tenant/context`

Auth tenant:
- `POST /api/login`
- `POST /api/register`
- `POST /api/logout`

Area tenant client:
- `GET /api/tenant/client/*`
- `POST /api/tenant/client/*`

Area tenant admin:
- `GET /api/tenant/admin/*`
- `POST /api/tenant/admin/*`
- `PUT /api/tenant/admin/*`
- `DELETE /api/tenant/admin/*`

Panel landlord (solo dominio central + admin):
- `GET /api/landlord/tenants`
- `POST /api/landlord/tenants`
- `POST /api/landlord/tenants/{tenant}/activate|deactivate|migrate`

## 12) Checklist de implementacion frontend

- [ ] Resolver tenant por host.
- [ ] Namespacing de token por tenant.
- [ ] Guard `RequireTenantContext`.
- [ ] Guard por rol (`Admin` vs `Client`).
- [ ] Login/register solo en host tenant.
- [ ] Pantalla de error tenant no encontrado.
- [ ] Logout limpia sesion del tenant actual.

