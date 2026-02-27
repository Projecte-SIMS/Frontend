# Arquitectura Técnica y Decisiones (Detalle Real)

Este documento detalla la infraestructura tecnológica de SIMS Frontend y las decisiones de diseño que aseguran la mantenibilidad y el rendimiento del sistema (Sprint 5).

## 1. Stack Tecnológico (Versiones Reales)
- **Framework Core**: Vue 3.5.26 (Composition API).
- **Herramienta de Construcción**: Vite 7.3.1.
- **Lenguaje**: TypeScript 5.9.3 (Tipado estricto con `vue-tsc`).
- **Framework de Estilos**: TailwindCSS 4.1.18.
- **Librería de Mapas**: Leaflet 1.9.4.
- **Librería de Cliente HTTP**: Axios 1.13.3.
- **Enrutamiento Progresivo**: Vue Router 4.6.4.

## 2. Arquitectura de Directorios Modular
El proyecto se organiza bajo el patrón **Modular por Dominios**, lo que permite una separación limpia de responsabilidades y facilita la escalabilidad:
```text
src/
├── modules/
│   ├── admin/       # Panel de administración central (Dashboard, Tablas)
│   │   ├── modules/ # Submódulos (users, vehicles, roles)
│   │   └── bookings/# Gestión de reservas administrativas
│   ├── auth/        # Lógica de sesión, cookies y perfiles
│   ├── map/         # Composables compartidos para lógica de mapas
│   ├── tickets/     # Interfaz de soporte para el cliente final
│   └── common/      # Componentes transversales y páginas públicas
├── services/        # Configuración de clientes API (Axios Client)
└── types/           # Definiciones globales de tipos e interfaces
```

## 3. Decisiones Técnicas Clave

### 3.1. Gestión de Sesión Segura (Cookies vs LocalStorage)
Se ha implementado la gestión de tokens JWT mediante **Cookies** (`token`). El archivo `src/services/api.ts` incluye un interceptor de Axios que extrae automáticamente el token del documento para añadirlo a la cabecera `Authorization: Bearer <token>`. 
*Ventaja:* Mayor protección contra ataques XSS y persistencia nativa en el navegador.

### 3.2. Redirección Basada en Roles (Router Guards)
En `src/router/index.ts`, se utiliza un guard global (`router.beforeEach`) que interactúa con el composable `useAuth.ts`. Este sistema detecta si el usuario tiene el rol "Admin" tras el login para redirigir automáticamente a `/admin`. Los usuarios finales son redirigidos a la Home pública `/`.

### 3.3. Renderizado de Mapas y Rendimiento
Se utiliza Leaflet directamente sobre el DOM mediante `refs` de Vue para garantizar el máximo rendimiento en la manipulación de cientos de marcadores. En `HomePage.vue`, se implementa un cálculo de distancias (Haversine) para mostrar de forma reactiva los vehículos más cercanos al usuario.

### 3.4. Integración de IA con RAG (Retrieval-Augmented Generation)
La página de Chatbot (`ChatbotPage.vue`) conecta con el endpoint `/chatbot/chat`. El frontend envía el historial completo de mensajes, permitiendo que la IA mantenga el contexto de la conversación. Las respuestas se generan en base a la documentación técnica interna, garantizando veracidad en la ayuda al usuario.

---
