# Guía de Instalación y Despliegue (Detalle Real)

Este documento detalla los pasos para poner en marcha el entorno de desarrollo y realizar el despliegue del proyecto SIMS (Sprint 5).

## 1. Configuración de Desarrollo Local

### Requisitos del Sistema
- **Node.js**: v20.19.0 o superior (recomendado v22.12.0+).
- **NPM**: Gestor de paquetes npm o pnpm.
- **Backend (API)**: Entorno Laravel con acceso a la API configurada.

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
   *Acceso por defecto:* `http://localhost:5173`.

## 2. Despliegue en Producción

### Generación de Construcción (Build)
```bash
npm run build
```
Este comando ejecuta `vite build` y genera la carpeta `dist/` con los archivos estáticos optimizados mediante Vite 7.3.1.

Opcionalmente, puedes ejecutar el chequeo de tipos con:
```bash
npm run type-check
```

### Configuración del Servidor Web (Nginx)
Para que el enrutamiento de la SPA funcione correctamente, Nginx debe redirigir todas las peticiones a `index.html`:
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

## 3. Despliegue con Docker
El proyecto está preparado para ejecutarse en contenedores:
1. **Construir Imagen**:
   ```bash
   docker build -t sims-frontend:latest .
   ```
2. **Ejecutar Contenedor**:
   ```bash
   docker run -d -p 80:80 sims-frontend:latest
   ```
   *(Consultar `docker-compose.yml` para despliegues multi-contenedor).*

---
