# Manual de Usuario SIMS

## Índice

1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Manual para Usuarios (Clientes)](#manual-para-usuarios-clientes)
4. [Manual para Administradores](#manual-para-administradores)
5. [Sistema de Ayuda (Chatbot)](#sistema-de-ayuda-chatbot)
6. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Introducción

SIMS (Sistema Inteligente de Movilidad Sostenible) es una plataforma de gestión de flotas de vehículos compartidos que permite a los usuarios reservar, activar y controlar vehículos en tiempo real.

### Roles del Sistema

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **Client** | Usuario final que alquila vehículos | Panel de usuario (`/`) |
| **Admin** | Administrador del sistema | Panel de administración (`/admin`) |
| **Maintenance** | Personal de mantenimiento | Panel de usuario con funciones específicas |

---

## Acceso al Sistema

### Registro de Cuenta

1. Acceder a la página de registro: `/register`
2. Completar el formulario con:
   - Nombre completo
   - Nombre de usuario
   - Email
   - Contraseña (mínimo 8 caracteres)
3. Confirmar contraseña
4. Hacer clic en "Registrarse"

### Inicio de Sesión

1. Acceder a la página de login: `/login`
2. Introducir email y contraseña
3. Hacer clic en "Iniciar Sesión"

---

## Manual para Usuarios (Clientes)

### Página Principal (`/`)

La página de inicio muestra:
- **Mapa interactivo**: Visualización de todos los vehículos disponibles
- **Lista de vehículos cercanos**: Ordenados por distancia desde tu ubicación actual
- **Características del servicio**: Información sobre SIMS

#### Funcionalidades del Mapa:
- Los vehículos **verdes** están disponibles para reservar
- Los vehículos **ámbar** están en uso
- Al hacer clic en un vehículo de la lista, el mapa se centra en él
- Se muestra la distancia desde tu ubicación actual a cada vehículo

---

### Mapa de Vehículos (`/vehicles/map`)

Mapa completo con todas las funcionalidades:

1. **Ver vehículos disponibles**: Marcadores en el mapa
2. **Popup de información**: Al hacer clic en un marcador:
   - Marca y modelo
   - Matrícula
   - Estado (disponible/en uso)
   - Distancia desde tu ubicación
   - Botón "Reservar" (si está disponible)
3. **Centrar en ubicación**: Botón para centrar el mapa en tu posición GPS
4. **Zoom**: Controles de zoom para acercar/alejar

---

### Lista de Vehículos (`/vehicles`)

Vista de catálogo de todos los vehículos:

#### Filtros disponibles:
- **Búsqueda**: Por marca, modelo o matrícula
- **Estado**: Todos / Solo disponibles / En uso
- **Ordenar**: Por distancia, marca o modelo

#### Información de cada vehículo:
- Imagen del modelo
- Marca y modelo
- Matrícula
- Estado actual
- Distancia desde tu ubicación

#### Acciones:
- **Ver detalles**: Abre modal con información completa y mapa de ubicación
- **Reservar**: Inicia el proceso de reserva (solo si está disponible)

> ⚠️ **Nota**: Solo puedes tener una reserva activa a la vez.

---

### Mis Reservas (`/bookings`)

Gestión de tus reservas y viajes:

#### Estados de reserva:
| Estado | Descripción | Acciones |
|--------|-------------|----------|
| **Pendiente** | Reserva confirmada, esperando activación | Activar / Cancelar |
| **Activo** | Viaje en curso | Ir a Control del Vehículo |
| **Completado** | Viaje finalizado | Ver detalles |
| **Cancelado** | Reserva cancelada | - |

#### Tiempo de activación:
- Las reservas pendientes tienen **15 minutos** para ser activadas
- Si no se activa a tiempo, la reserva se cancela automáticamente

#### Acciones disponibles:
1. **Activar Vehículo**: Inicia el viaje (desbloquea el vehículo)
2. **Cancelar**: Cancela la reserva pendiente
3. **Ver Control**: Accede al panel de control del vehículo activo

---

### Control del Vehículo Activo (`/active-vehicle`)

Panel de control durante un viaje activo:

#### Información en tiempo real:
- **Velocidad**: Velocidad actual del vehículo (km/h)
- **RPM del motor**: Revoluciones por minuto
- **Temperatura del motor**: Con alerta si se sobrecalienta
- **Nivel de batería**: Porcentaje restante
- **Distancia recorrida**: Kilómetros del viaje actual
- **Tiempo de viaje**: Duración del trayecto
- **Coste estimado**: Precio aproximado del viaje

#### Controles del vehículo:
| Control | Función |
|---------|---------|
| **Motor ON/OFF** | Encender o apagar el motor |
| **Luces** | Encender/apagar luces |
| **Claxon** | Activar bocina |
| **Puertas** | Bloquear/desbloquear puertas |

#### Alertas de seguridad:
- Sobrecalentamiento del motor (>95°C)
- Batería baja (<20%)
- Velocidad excesiva

#### Finalizar viaje:
1. Detener el vehículo completamente
2. Apagar el motor
3. Hacer clic en "Finalizar Viaje"
4. Confirmar la acción

---

### Sistema de Tickets (`/tickets`)

Soporte y comunicación con el equipo:

#### Crear nuevo ticket (`/tickets/create`):
1. Seleccionar categoría:
   - Problema técnico
   - Consulta general
   - Incidencia con vehículo
   - Facturación
   - Sugerencia
2. Escribir asunto descriptivo
3. Detallar el problema o consulta
4. Enviar ticket

#### Gestionar tickets:
- **Ver tickets activos**: Tickets abiertos pendientes de resolución
- **Ver tickets cerrados**: Historial de consultas resueltas
- **Responder**: Añadir mensajes a un ticket existente

#### Conversación (`/tickets/:id`):
- Historial de mensajes
- Respuestas del equipo de soporte
- Indicador de estado (Abierto/Cerrado)

---

### Perfil de Usuario (`/perfil`)

Información de tu cuenta:
- Nombre y usuario
- Email
- Rol asignado

#### Editar perfil (`/perfil/editar`):
- Cambiar nombre
- Cambiar nombre de usuario
- Cambiar email
- Cambiar contraseña

---

## Manual para Administradores

### Panel de Administración (`/admin`)

Dashboard principal con:
- **Estadísticas rápidas**: Total de usuarios, vehículos, reservas y tickets
- **Estado IoT**: Conexión con el microservicio de dispositivos
- **Resumen de flota**: Vehículos disponibles vs total
- **Acciones rápidas**: Accesos directos a las secciones principales

---

### Gestión de Usuarios (`/admin/users`)

Lista completa de usuarios del sistema:

#### Funcionalidades:
- **Buscar**: Por nombre, email o username
- **Filtrar**: Por rol o estado
- **Ver detalles** (`/admin/users/:id`): Información completa del usuario
- **Editar** (`/admin/users/:id/edit`): Modificar datos y rol
- **Crear** (`/admin/users/create`): Añadir nuevo usuario

#### Datos gestionables:
- Nombre completo
- Nombre de usuario
- Email
- Rol asignado
- Estado de la cuenta

---

### Gestión de Roles (`/admin/roles`)

Administración de roles y permisos:

#### Funcionalidades:
- **Ver roles**: Lista de roles existentes
- **Crear rol** (`/admin/roles/create`): Nuevo rol con permisos específicos
- **Editar rol** (`/admin/roles/:id/edit`): Modificar permisos
- **Ver detalles** (`/admin/roles/:id`): Usuarios con este rol

#### Roles predefinidos:
- **Admin**: Acceso total al sistema
- **Client**: Usuario estándar (reservas y viajes)
- **Maintenance**: Personal técnico

---

### Gestión de Vehículos (`/admin/vehicles`)

Control total de la flota:

#### Lista de vehículos:
- Búsqueda por marca, modelo o matrícula
- Filtros por estado
- Ordenación múltiple

#### Acciones:
| Acción | Ruta | Descripción |
|--------|------|-------------|
| Ver | `/admin/vehicles/:id` | Detalles completos |
| Crear | `/admin/vehicles/create` | Añadir vehículo |
| Editar | `/admin/vehicles/:id/edit` | Modificar datos |
| Eliminar | - | Dar de baja vehículo |

#### Datos del vehículo:
- Marca y modelo
- Matrícula
- Año de fabricación
- Estado (disponible/mantenimiento/activo)
- Ubicación GPS actual

---

### Mapa de Vehículos Admin (`/admin/map`)

Visualización avanzada de toda la flota:
- Todos los vehículos con su estado actual
- Filtros por estado
- Información detallada en popup
- Actualización en tiempo real

---

### Gestión de Reservas (`/admin/bookings`)

Control de todas las reservas:

#### Información mostrada:
- Usuario que reserva
- Vehículo reservado
- Fecha de creación
- Estado actual
- Fechas de inicio/fin

#### Acciones:
- **Ver detalles** (`/admin/bookings/:id`): Información completa
- **Editar** (`/admin/bookings/:id/edit`): Modificar reserva
- **Cambiar estado**: Aprobar, cancelar, completar

---

### Gestión de Tickets (`/admin/tickets`)

Soporte al cliente:

#### Panel de tickets:
- Lista de todos los tickets
- Filtros por estado y categoría
- Ordenación por fecha o prioridad

#### Acciones (`/admin/tickets/:id`):
- Ver conversación completa
- Responder al usuario
- Cambiar estado (Abrir/Cerrar)
- Asignar prioridad

---

### Dispositivos IoT (`/admin/iot-devices`)

Monitorización de dispositivos conectados:

#### Información:
- Estado del microservicio (Online/Offline)
- Lista de dispositivos
- Estado de conexión de cada dispositivo
- Datos de telemetría

#### Datos mostrados:
- ID del dispositivo
- Vehículo asociado
- Estado de conexión
- Última actualización
- Ubicación GPS

---

### Salud de la Flota (`/admin/fleet-health`)

Visión general del estado de los vehículos:
- Vehículos activos vs disponibles
- Alertas de mantenimiento
- Estadísticas de uso
- Dispositivos online/offline

---

## Sistema de Ayuda (Chatbot)

### Acceso
El chatbot está disponible en `/chatbot` o mediante el botón flotante en la esquina inferior derecha.

### Funcionalidades
- **Ayuda contextual**: Respuestas según tu rol (Admin/Client/Maintenance)
- **Preguntas frecuentes**: Resolución de dudas comunes
- **Guía de uso**: Instrucciones paso a paso

### Ejemplos de consultas:
- "¿Cómo reservo un vehículo?"
- "¿Cómo finalizo mi viaje?"
- "¿Qué hago si el vehículo no arranca?"
- "¿Cómo cambio mi contraseña?"

> ⚠️ **Nota**: El chatbot requiere conexión con el servicio de IA externo.

---

## Preguntas Frecuentes

### Reservas

**P: ¿Cuántas reservas puedo tener activas?**
R: Solo una reserva activa (pendiente o en curso) a la vez.

**P: ¿Cuánto tiempo tengo para activar una reserva?**
R: 15 minutos desde la confirmación. Después se cancela automáticamente.

**P: ¿Puedo cancelar una reserva?**
R: Sí, mientras esté en estado "Pendiente".

### Viajes

**P: ¿Cómo sé dónde está el vehículo?**
R: En el mapa de vehículos puedes ver la ubicación exacta con la distancia desde tu posición.

**P: ¿Qué hago si el vehículo tiene un problema?**
R: Crea un ticket de soporte con la categoría "Incidencia con vehículo".

**P: ¿Cómo finalizo un viaje?**
R: Detén el vehículo, apaga el motor y pulsa "Finalizar Viaje" en el panel de control.

### Cuenta

**P: ¿Puedo cambiar mi email?**
R: Sí, desde Perfil > Editar Perfil.

**P: ¿Olvidé mi contraseña?**
R: Usa la opción "¿Olvidaste tu contraseña?" en la página de login.

---

## Soporte

Si tienes algún problema:
1. Consulta el chatbot de ayuda
2. Crea un ticket de soporte
3. Revisa las preguntas frecuentes

---

*Última actualización: Marzo 2025*
*Versión del manual: 1.0*
