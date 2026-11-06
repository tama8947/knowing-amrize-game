# Fase 4 bis — Interfaz y usabilidad ✅

Objetivo: que la interfaz se sienta como un producto de Amrize y funcione en
cualquier dispositivo.

## Layout

- [x] Menú que **no se recorta** en pantallas bajas (`max-height` + scroll interno)
- [x] Logo y franja naranja siempre visibles
- [x] Controles del juego en 2 columnas
- [x] Tarjeta de planta, tarjeta educativa y letrero sin solaparse
- [x] Panel del mapa con leyenda y eslóganes
- [x] Selector de idioma compacto (banderas) en el HUD

## Rendimiento

- [x] Modo `?lowfx=1` (sin sombras, pixel ratio 1)
- [x] Activación **automática** en móviles y equipos con ≤ 4 núcleos
- [x] Three.js en su propio chunk (172 KB gzip, cacheable)
- [x] Geometría del mapa ~89 k triángulos
- [x] Build de producción ~1.1 MB

## Interacción

- [x] Click en el suelo para caminar (alternativa a las flechas)
- [x] Hover de pines en el mapa con cursor de mano
- [x] El click distingue arrastre de cámara (no dispara la selección)
- [x] Toasts de confirmación (sello obtenido, planta visitada)

## Pendiente

- [ ] **Controles táctiles** en móvil (joystick virtual + botón de saltar e interactuar)
- [ ] Diseño responsive del HUD para móvil (el panel del mapa ocupa mucho)
- [ ] Accesibilidad: navegación completa por teclado, foco visible, roles ARIA
- [ ] Contraste AA en todas las combinaciones de color
- [ ] Lector de pantalla para el HUD
- [ ] Opción de reducir movimiento (animaciones de cámara)
- [ ] Tamaño de texto ajustable
- [ ] Preferencia de "modo daltónico" para los colores por negocio
- [ ] Tutorial interactivo en la primera partida
