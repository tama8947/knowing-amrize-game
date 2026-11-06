# Fase 4 — Multiidioma ✅

**5 idiomas completos**: Español 🇨🇴 · English 🇺🇸 · Français 🇨🇦 · Deutsch 🇩🇪 · Schweizerdeutsch 🇨🇭

## Motor

- [x] Motor i18n propio (`src/i18n/index.js`), sin dependencias externas
- [x] Claves con dots: `ui.start.begin`, `stations.horno.title`, `biz.cement.name`
- [x] Fallback automático al español (base) + aviso en consola
- [x] Detección por `navigator.languages` (de-CH → CH, de-DE → DE)
- [x] Preferencia persistida en `localStorage`
- [x] `onLocaleChange()` para suscribirse a los cambios

## Traducción

- [x] 5 archivos en `src/i18n/locales/` (`es`, `en`, `fr`, `de`, `ch`)
- [x] Interfaz completa (menú, HUD, tarjetas, buscador, avisos, toasts)
- [x] **35 estaciones educativas** con título, texto y dato clave
- [x] Nombres y eslóganes de las 6 líneas de negocio
- [x] Rangos del jugador

## Cambio en caliente

- [x] El contenido se resuelve **por clave al mostrar**, no al construir la escena
- [x] Al cambiar de idioma se re-traducen **todas** las tarjetas abiertas
- [x] También el letrero de proximidad, los resultados del buscador,
      los sellos, los chips de filtro, la leyenda, el objetivo y el nombre
- [x] Sin recargar la página ni reconstruir la planta

## Variantes regionales

- [x] Español con variante Colombia 🇨🇴
- [x] `de-CH` ≠ `de-DE`: Standarddeutsch con «Sie» y *ss* en lugar de *ß*
- [x] Francés de Canadá (`fr-CA`) para el mercado de Amrize CA

## Pendiente

- [ ] Revisión lingüística nativa por hablante (especialmente `de-CH`)
- [ ] Formatos numéricos y de fecha con `Intl` (1.234,5 vs 1,234.5)
- [ ] Traducción de las descripciones largas de las 38 plantas
- [ ] Narración por voz en cada idioma
- [ ] Glosario corporativo Amrize por mercado (terminología oficial)
- [ ] Traducción del README y de la documentación
- [ ] Herramienta para detectar claves faltantes entre idiomas
