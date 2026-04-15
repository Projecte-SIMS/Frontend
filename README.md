# SIMS Frontend - Interfaz de Usuario Multitenant SaaS

**Versión:** Sprint 5 – Producción  
**Última actualización:** Abril 2026

---

## Descripción General del Proyecto

SIMS Frontend es una plataforma avanzada diseñada para la gestión de servicios de movilidad sostenible (carsharing eléctrico). El sistema está construido con **Vue 3** y **TypeScript**, funcionando como una aplicación de marca blanca (White Label) que adapta dinámicamente su contexto operativo al inquilino (tenant) que accede al sistema.

---

## Índice de Documentación Técnica

Para una comprensión profunda de la implementación, consulte los siguientes manuales técnicos y operativos:

| Documento | Descripción |
| :--- | :--- |
| [**Manual de Usuario**](docs/MANUAL_USUARIO.md) | Guía operativa segmentada por roles (Admin, Client, Maintenance). |
| [**Arquitectura Técnica**](docs/architecture.md) | Detalle del stack tecnológico, patrones de diseño y estructura modular. |
| [**Flujo Multitenant**](docs/MULTITENANT_FRONTEND_FLOW.md) | Especificación del ciclo de vida de identificación y aislamiento de inquilinos. |
| [**Guía de Despliegue**](docs/deployment.md) | Instrucciones para Vercel, Docker (Nginx) y configuración de variables VITE. |
| [**Especificaciones Funcionales**](docs/functionality.md) | Definición de roles, permisos y flujos de negocio del frontend. |
| [**Catálogo de Componentes**](docs/components.md) | Documentación de la librería de UI personalizada y diseño atómico. |
| [**Calidad y QA**](docs/qa.md) | Herramientas de depuración, linting y estándares de código. |

---

## Arquitectura de Módulos (Domain-Driven Design)

El proyecto se organiza bajo una estructura modular que separa claramente las responsabilidades operativas y administrativas:

```
src/
├── modules/
│   ├── superadmin/                 # Gestión global (Landlord)
│   │   ├── pages/                  # TenantsPage, BillingPage, SuperAdminOverview
│   │   ├── layouts/                # SuperAdminLayout.vue (Sidebar global)
│   │   └── composables/            # useTenants.ts (Peticiones a centralApi)
│   ├── admin/                      # Gestión de Inquilino (Tenant Admin)
│   │   ├── modules/                # CRUD Users, Vehicles, Roles/Permissions
│   │   ├── pages/                  # FleetHealth, IoTDevices, VehicleMap (Admin)
│   │   └── layouts/                # AdminLayout.vue (Menú operativo local)
│   ├── auth/                       # Autenticación Aislada por Tenant
│   │   ├── pages/                  # LoginPage, RegisterPage (Tenant-aware)
│   │   └── composables/            # useAuth.ts (Manejo de tokens por esquema)
│   ├── bookings/                   # Reservas y Control Activo
│   │   └── pages/                  # ActiveVehicleControlPage (Comandos IoT)
│   ├── common/                     # Componentes Transversales y Mapas
│   │   ├── pages/                  # HomePage, MapPage, PublicMapPage, ChatbotPage
│   │   └── layouts/                # AppLayout.vue (Vista de usuario final)
│   └── tickets/                    # Sistema de Soporte Técnico (Tickets)
├── services/
│   ├── api.ts                      # Cliente Axios para Tenant (Header X-Tenant)
│   ├── centralApi.ts               # Cliente Axios para SuperAdmin (Auth Landlord)
│   └── iotService.ts               # Comunicación con microservicio FastAPI
└── router/
    └── index.ts                    # Guardias de navegación y control de contexto
```

---

## Identificación de Inquilinos (Tenant Identification)

El frontend utiliza una estrategia de identificación dinámica para determinar el esquema de datos al que debe conectarse el usuario.

### Ciclo de Vida de Identificación
1.  **Detección de URL**: El router extrae el parámetro `?tenant=` o el subdominio de `window.location`.
2.  **Persistencia**: El identificador se almacena en `localStorage` (`current_tenant`) para mantener la sesión.
3.  **Interceptor de Red**: Todas las peticiones salientes mediante `api.ts` inyectan automáticamente la cabecera `X-Tenant`.
4.  **Aislamiento**: El backend de Laravel recibe esta cabecera y activa el esquema PostgreSQL correspondiente antes de procesar la petición.

---

## Stack Tecnológico Verificado (package.json)

| Componente | Versión | Propósito |
| :--- | :--- | :--- |
| Vue | 3.5.26 | Core del Framework (Composition API). |
| TypeScript | 5.9.3 | Tipado estricto y seguridad en tiempo de compilación. |
| Vite | 7.3.1 | Motor de construcción y servidor de desarrollo. |
| TailwindCSS | 4.1.18 | Diseño visual utilitario y responsive. |
| Axios | 1.13.3 | Gestión de peticiones asíncronas HTTP. |
| Vue Router | 4.6.4 | Enrutamiento SPA con guardias de seguridad. |
| Leaflet | 1.9.4 | Renderización de mapas e integración geoespacial. |

---

## Integración con el Ecosistema SIMS

### Comunicación con el Backend (Render)
El frontend se conecta a la API de Laravel mediante la variable `VITE_API_URL`. Las peticiones se segregan por el header `X-Tenant`, permitiendo que una sola instancia del frontend sirva a múltiples organizaciones.

### Microservicio IoT (FastAPI)
La telemetría en tiempo real y los comandos de control de vehículos (encendido/apagado) se gestionan mediante `iotService.ts`, que interactúa con el microservicio global de telemetría, filtrando los datos por el identificador de hardware vinculado al vehículo del tenant.

---
**Ingeniería de Frontend SIMS – Abril 2026**
