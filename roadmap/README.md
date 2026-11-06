# 🗺️ Roadmap — *Amrize: Ruta de Constructores*

Índice de fases del proyecto. Cada fase tiene su propio archivo con la lista
de tareas marcables (`[x]` hecho · `[ ]` pendiente).

## Estado general

| Fase | Tema | Estado |
|---|---|---|
| [0](01-identidad.md) | Identidad corporativa | ✅ Completada |
| [1](02-mapa-norteamerica.md) | Mapa de Norteamérica | ✅ Completada |
| [1 bis](03-buscador.md) | Buscador de plantas | ✅ Completada |
| [1 ter](04-personaje.md) | Personaje jugable | ✅ Completada |
| [2](05-plantas.md) | Contenido de las 6 plantas | ✅ Completada |
| [3](06-sistema-juego.md) | Sistema de juego | 🔶 En curso |
| [4](07-multiidioma.md) | Multiidioma (5 idiomas) | ✅ Completada |
| [4 bis](08-interfaz.md) | Interfaz y usabilidad | ✅ Completada |
| [5](09-lanzamiento.md) | Lanzamiento | ⬜ Pendiente |
| — | [Backlog de ideas](10-backlog.md) | 📝 Acumulando |

## Principios del proyecto

1. **Contenido separado del código** — los textos viven en `src/i18n/locales/`.
2. **Autenticidad** — los datos vienen de fuentes reales (Natural Earth, amrize.com).
3. **Reproducibilidad** — todo dato generado se regenera con un script en `tools/`.
4. **Todo verificable** — cada cambio se prueba con `pnpm test:e2e`.
5. **Identidad coherente** — azul `#011E6A`, naranja `#FF4412`, logo y eslóganes oficiales.

## Resumen numérico

| Métrica | Valor |
|---|---|
| Plantas reales en el mapa | 38 |
| Estados / provincias | 26 |
| Países | 2 (EE.UU. y Canadá) |
| Líneas de negocio | 6 |
| Estaciones educativas | 35 |
| Minijuegos | 6 retos (5 tipos) |
| Idiomas | 5 |
| Pruebas end-to-end | 51 |
| Triángulos del mapa | ~89 k |
| Build de producción | ~1.1 MB (three: 172 KB gzip) |
