# Arquitectura Técnica y Decisiones (Detalle Real)

Este documento detalla la infraestructura tecnológica de SIMS Frontend y las decisiones de diseño que aseguran la mantenibilidad y el rendimiento del sistema (Sprint 5).

## 1. Stack Tecnológico (Versiones Verificadas en package.json)
- **Framework Core**: Vue 3.5.26 (Composition API).
- **Herramienta de Construcción**: Vite 7.3.1.
- **Lenguaje**: TypeScript 5.9.3 (Tipado estricto con `vue-tsc`).
- **Framework de Estilos**: TailwindCSS 4.1.18.
- **Librería de Mapas**: Leaflet 1.9.4.
- **Librería de Cliente HTTP**: Axios 1.13.3.
- **Enrutamiento Progresivo**: Vue Router 4.6.4.
- **Notificaciones**: vue3-toastify 0.2.8.

## 2. Arquitectura de Directorios Modular
El proyecto se organiza bajo el patrón **Modular por Dominios**, lo que permite una separación limpia de responsabilidades y facilita la escalabilidad:
```text
src/
├── modules/
│   ├── admin/       # Panel de administración central
│   │   ├── modules/ # Submódulos (users, vehicles, roles)
│   │   ├── bookings/# Gestión de reservas administrativas
│   │   ├── tickets/ # Gestión de tickets admin
│   │   └── components/ # Componentes reutilizables admin
│   ├── auth/        # Lógica de sesión, cookies y perfiles
│   ├── bookings/    # Reservas de usuario final
│   ├── map/         # Composables compartidos para lógica de mapas
│   ├── tickets/     # Interfaz de soporte para el cliente final
│   └── common/      # Componentes transversales, chatbot, páginas públicas
├── services/        # Configuración de clientes API (Axios Client)
├── router/          # Configuración de rutas Vue Router
└── types/           # Definiciones globales de tipos e interfaces
```

## 3. Decisiones Técnicas Clave

### 3.1. Gestión de Sesión Segura (Cookies)
Se ha implementado la gestión de tokens JWT mediante **Cookies** (`token`). El archivo `src/services/api.ts` incluye un interceptor de Axios que extrae automáticamente el token del documento para añadirlo a la cabecera `Authorization: Bearer <token>`. 
*Ventaja:* Persistencia nativa en el navegador y facilidad de implementación.

### 3.2. Redirección Basada en Roles (Router Guards)
En `src/router/index.ts`, se utiliza un guard global (`router.beforeEach`) que interactúa con el composable `useAuth.ts`. Este sistema detecta si el usuario tiene el rol "Admin" tras el login para redirigir automáticamente a `/admin`. Los usuarios finales son redirigidos a la Home pública `/`.

### 3.3. Renderizado de Mapas y Rendimiento
Se utiliza Leaflet directamente sobre el DOM mediante `refs` de Vue para garantizar el máximo rendimiento en la manipulación de cientos de marcadores. En `MapPage.vue`, se implementa un cálculo de distancias (Haversine) para mostrar de forma reactiva los vehículos más cercanos al usuario.

### 3.4. Integración de IA con Contexto por Rol
La página de Chatbot (`ChatbotPage.vue`) conecta con el endpoint `/api/chatbot/chat`. El backend inyecta automáticamente un prompt de sistema personalizado según el rol del usuario. El frontend:
- Muestra el rol actual del usuario en la interfaz
- Envía solo mensajes de usuario/assistant (sin system)
- Presenta mensajes de bienvenida personalizados por rol

**Nota:** No es un sistema RAG puro con embeddings, sino un chatbot con contexto inyectado.

---
