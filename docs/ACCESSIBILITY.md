# Auditoría y Nivel de Cumplimiento de Accesibilidad

Este documento detalla las medidas de accesibilidad implementadas en el frontend de SIMS (Vue 3) siguiendo las pautas WCAG 2.1.

## 1. Medidas de Accesibilidad Implementadas

### A. Estructura Semántica y Navegación
- **Uso de HTML Semántico**: Todos los componentes principales utilizan etiquetas adecuadas (header, main, nav, section, footer).
- **Control de Foco**: Gestión del foco en modales y diálogos mediante HeadlessUI para asegurar que el foco no se pierda al interactuar.
- **Jerarquía de Encabezados (H1-H6)**: Los encabezados están organizados de forma lógica en todas las vistas administrativas y de usuario.

### B. Elementos de Interfaz
- **Etiquetas Aria**: Todos los botones con solo iconos tienen un `aria-label` descriptivo.
- **Relación de Contraste**: Se ha validado que el contraste entre el texto y el fondo cumpla con el estándar AA de las WCAG (4.5:1).
- **Indicadores de Estado**: Se evita el uso exclusivo del color para transmitir información (por ejemplo, mensajes de error van acompañados de un icono).

## 2. Problemas Detectados y Soluciones Aplicadas

### Problema: Mapas Dinámicos (Leaflet)
Los mapas son tradicionalmente difíciles de hacer accesibles por teclado.
- **Solución**: Se ha implementado una alternativa en formato tabla/lista para que los usuarios de lectores de pantalla puedan consultar la flota de vehículos sin depender exclusivamente del mapa visual.

### Problema: Modales y Menús Desplegables
La pérdida de contexto al abrir un modal.
- **Solución**: Uso de la librería HeadlessUI para manejar automáticamente el `focus trap` y los atributos ARIA pertinentes durante la apertura y cierre de componentes interactivos.

## 3. Nivel de Cumplimiento Estimado
El proyecto SIMS Frontend aspira a un nivel de cumplimiento **AA (WCAG 2.1)**.
- **Soportado**: Navegación por teclado básica, compatibilidad con lectores de pantalla modernos, contraste visual adecuado.
- **En proceso**: Mejora de descripciones alternativas para gráficos complejos de telemetría.
