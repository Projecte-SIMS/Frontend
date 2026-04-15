# Guía de Instalación y Despliegue (Detalle Real)

Este documento detalla los pasos para poner en marcha el entorno de desarrollo y realizar el despliegue del proyecto SIMS (Sprint 5) en entornos multitenant.

## 1. Configuración de Desarrollo Local

### Requisitos del Sistema
- **Node.js**: v20.19.0 o superior (recomendado v22.12.0+).
- **NPM**: Gestor de paquetes npm o pnpm.
- **Backend (API)**: Entorno Laravel con soporte multitenant (Render o Local).

### Pasos de Instalación
1. **Clonación**:
   ```bash
   git clone https://github.com/Projecte-SIMS/Frontend.git
   cd project-sims-frontend
   ```
2. **Instalación de Dependencias**:
   ```bash
   npm install
   ```
3. **Variables de Entorno**:
   Crea un archivo `.env` en la raíz (usa `.env.example` como base):
   ```bash
   VITE_API_URL=http://localhost:8000/api
   ```
4. **Ejecución en Desarrollo**:
   ```bash
   npm run dev
   ```
   *Acceso por defecto:* `http://localhost:5173`. Para probar multitenancy localmente, use `http://localhost:5173/?tenant=slug_del_tenant`.

## 2. Despliegue en Producción (Vercel)

El frontend está optimizado para su despliegue en la plataforma **Vercel**, aprovechando su integración nativa con proyectos Vite y soporte para Single Page Applications (SPA).

### Variables de Entorno Críticas en Vercel
Es fundamental configurar las siguientes variables en el panel de control de Vercel para asegurar la comunicación con el backend multitenant:

| Variable | Valor Sugerido | Descripción |
|----------|----------------|-------------|
| `VITE_API_URL` | `https://sims-backend-api-0b2w.onrender.com/api` | URL base del backend alojado en Render. |

### Proceso de Despliegue
1. Conectar el repositorio de GitHub a un nuevo proyecto en Vercel.
2. Framework Preset: `Vite`.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Configurar las variables de entorno mencionadas.
6. Vercel detectará automáticamente el archivo `vercel.json` para gestionar el enrutamiento.

### Configuración de Enrutamiento (vercel.json)
Para permitir que Vue Router gestione las rutas internas de la SPA, se utiliza la siguiente configuración:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 3. Adaptación Dinámica al Tenant

El frontend es una aplicación única que se adapta al contexto del tenant basándose en la URL de acceso:

1.  **Detección por Subdominio:** En entornos de producción con dominios personalizados (ej. `empresa.sims.com`), el frontend extrae el primer segmento del host y lo utiliza como identificador de tenant.
2.  **Detección por Query Parameter:** Útil para despliegues en dominios de staging de Vercel (ej. `sims-frontend.vercel.app/?tenant=acme`). Una vez detectado, el identificador se persiste en `localStorage`.
3.  **Inyección en Cabeceras:** El servicio `src/services/api.ts` inyecta automáticamente la cabecera `X-Tenant` en cada petición saliente. El backend en Render utiliza esta cabecera para conmutar a la base de datos correspondiente.

## 4. Otros Métodos de Despliegue

### Generación de Construcción Manual
```bash
npm run build
```
Este comando genera la carpeta `dist/` con los archivos estáticos optimizados mediante Vite 7.3.1.

### Configuración del Servidor Web (Nginx)
Si se opta por un despliegue tradicional en un VPS, Nginx debe configurarse para redirigir todas las peticiones a `index.html`:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Despliegue con Docker
```bash
docker build -t sims-frontend:latest .
docker run -d -p 80:80 sims-frontend:latest
```

---
