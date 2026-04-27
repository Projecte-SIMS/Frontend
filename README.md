# SIMS Frontend – Interfaz de Movilidad (Vue 3)

Aplicación SPA multitenant que adapta su comportamiento y estética según la organización detectada en la URL.

## 🛠️ Requisitos
- Node.js 20+
- NPM o PNPM

## 🚀 Inicio Rápido
```bash
# 1. Instalar dependencias
npm install

# 2. Configurar entorno
# VITE_API_URL=http://localhost:8000/api
cp .env.example .env

# 3. Modo desarrollo
npm run dev
```

## 🌐 Identificación Multitenant
La aplicación detecta el inquilino automáticamente siguiendo este orden:
1. Parámetro `?tenant=slug` en la URL.
2. Subdominio (ej. `slug.fleetly-app.com`).
3. Caché en `LocalStorage`.

Para forzar un contexto en desarrollo: `http://localhost:5173/?tenant=demo`

## 🎨 Personalización y Accesibilidad
- **Branding:** Los colores y logotipos se inyectan dinámicamente desde el backend tras resolver el tenant.
- **Accesibilidad:** Integración nativa con **UserWay** y cumplimiento **WCAG 2.1 AA**. Consulta el [**Manual de Accesibilidad**](../docs/accesibilidad.md) para más detalles.

## 📄 Documentación Relacionada
- [**Flujo Multitenant Detallado**](./docs/MULTITENANT_FRONTEND_FLOW.md)
- [**Guía de Componentes**](./docs/components.md)
- [**Manual de Usuario Final**](../docs/manual_usuario.md)

---
*Para más detalles, consulta el [README principal](../README.md).*
