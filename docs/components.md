# Guía de Componentes y Diseño de UI (Detalle Real)

Este documento detalla la biblioteca de componentes personalizados en Vue 3.5, enfocada en la eficiencia operativa, la coherencia visual con TailwindCSS 4.1 y la accesibilidad.

## 1. Estructura de Layouts (Diseño Adaptativo)
Ubicados en `src/modules/*/layouts/`, definen el esqueleto de las vistas según el rol y contexto:
- **`AppLayout.vue`** (`src/modules/common/layouts/`): Layout principal para la interfaz de usuario general. Gestiona el chatbot flotante, la barra de navegación superior y el pie de página.
- **`AdminLayout.vue`** (`src/modules/admin/layouts/`): Estructura para el panel administrativo. Incluye una barra lateral de navegación (Sidebar) fija con acceso rápido a usuarios, vehículos, roles, reservas y tickets.

## 2. Librería de Componentes de Administración (`src/modules/admin/components/`)
Estos componentes están centralizados y se exportan en un `index.ts` para facilitar su uso modular:

### Visualización y Tablas
- **`AdminsTable.vue`**: Tabla reactiva que consume datos paginados (`RolePagination`, `UserPagination`, `VehiclePagination`).
- **`AdminTd.vue`**: Celda estandarizada para garantizar el espaciado y legibilidad correctos en todas las vistas administrativas.
- **`AdminPagination.vue`**: Controles de navegación de páginas (Anterior/Siguiente) integrados con los estados de carga de la API (Axios).
- **`StatusBadge.vue`**: Etiquetas de estado con colores semánticos (Verde: Activo, Rojo: Inactivo/Ocupado, Amarillo: Pendiente).

### Comunicación y Modales
- **`PageHeading.vue`**: Encabezado de sección que incluye el título de la página y botones de acción primaria (ej. "Añadir vehículo").
- **`Modal.vue`**: Contenedor base para ventanas emergentes animadas mediante transiciones de Vue.
- **`ConfirmDialog.vue`**: Diálogo especializado para acciones irreversibles (borrar, suspender), evitando eliminaciones accidentales con un flujo de confirmación clara.

### Sistema de Formularios (Basado en TailwindCSS)
- **`FormField.vue`**: Gestiona el label y el espaciado de cada campo de formulario.
- **`FormInput.vue`**: Input de texto con estados de foco, hover y error (utilizado en Login, Registro y CRUDs).
- **`FormSelect.vue`**: Selector de opciones estilizado para garantizar una UX uniforme.
- **`FormCheckbox.vue`**: Control de selección para opciones múltiples o booleanos.

## 3. Componentes de Módulos Específicos
### Gestión de Roles y Permisos (`src/modules/admin/modules/roles/components/`)
- **`PermissionCheckbox.vue`**: Control especializado para la matriz de permisos de un rol, permitiendo asignar permisos modulares (ej. `users.view`, `vehicles.create`).
- **`RoleDeleteModal.vue`**: Lógica de confirmación específica para asegurar la integridad referencial de los roles asignados.

### Gestión de Usuarios (`src/modules/admin/modules/users/components/`)
- **`UserDeleteModal.vue`**: Gestión de la baja de usuarios en el sistema con verificación de seguridad.

### Reservas y Alquileres (`src/modules/bookings/`)
- **`BookingsList.vue`**: Lista interactiva para que el usuario final consulte su historial de alquileres, tiempo de uso y el estado actual de sus reservas.

---
