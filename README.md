# SIMS – Frontend Blade
**Versión:** Sprint 5 – First Deployment  
**Fecha:** 2026-02-23

---

## Descripción General

Este repositorio contiene el frontend web de SIMS, implementado en Laravel Blade. Proporciona interfaces para usuarios y administradores, permitiendo la gestión y visualización de vehículos, tickets, reservas, roles y permisos.

---

## Arquitectura y Componentes

- **Vistas Blade:** Login, registro, panel de usuario, panel de administración, CRUD de entidades.
- **Formularios:** Apuntan a endpoints auditados del backend, usan CSRF y validaciones básicas.
- **Navegación:** Menús y enlaces funcionales, diferenciados por rol (usuario/admin).
- **Integración:** Consumo directo de endpoints backend, sin lógica de negocio en frontend.

---

## Integración

- **Backend Laravel:** Consume endpoints protegidos para autenticación, gestión y visualización.
- **Roles:** Navegación y vistas diferenciadas para usuarios y administradores.

---

## Formularios y Vistas Principales

| Vista/Formulario      | Endpoint         | Método | Acceso         |
|----------------------|------------------|--------|----------------|
| Login                | /login           | POST   | Público        |
| Registro             | /register        | POST   | Público        |
| Panel usuario        | /user/panel      | GET    | Usuario        |
| Panel admin          | /admin/panel     | GET    | Admin          |
| CRUD vehículos       | /vehicles        | CRUD   | Admin          |
| CRUD tickets         | /tickets         | CRUD   | Usuario/Admin  |
| CRUD reservas        | /reservations    | CRUD   | Usuario/Admin  |
| CRUD roles           | /roles           | CRUD   | Admin          |
| CRUD permisos        | /permissions     | CRUD   | Admin          |

---

## Seguridad y Validaciones

- **Protección por middleware/auth y roles.**
- **Validaciones básicas en todos los formularios.**
- **Protección CSRF en todos los formularios.**

---

## Despliegue y Entorno

- Variables de entorno en `.env` (no exponer credenciales reales).
- Docker y `docker-compose.yml` disponibles.
- Requiere PHP 8+, Composer, Node.js (para assets).

---

## Estado Actual

- Vistas y formularios completos y auditados.
- Navegación y roles correctamente implementados.
- Listo para integración y despliegue.

---

## Recomendaciones

- Mejorar validaciones y experiencia de usuario en futuros sprints.
- Añadir tests de integración frontend-backend.

---
