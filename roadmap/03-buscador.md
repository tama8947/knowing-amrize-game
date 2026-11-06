# Fase 1 bis — Buscador de plantas ✅

Objetivo: encontrar una planta concreta en segundos, sin recorrer el mapa a ojo.

## Búsqueda

- [x] Barra de búsqueda sobre el mapa (always visible en modo mapa)
- [x] Búsqueda por **nombre de planta**, **ciudad**, **estado**, **región** y **marca**
- [x] Búsqueda **en todos los idiomas**: escribir "cemento" encuentra plantas aunque el juego esté en inglés
- [x] Resultados en vivo mientras se escribe
- [x] `Enter` selecciona el primer resultado
- [x] `Esc` limpia la búsqueda
- [x] Botón de limpiar (✕)
- [x] Contador de resultados
- [x] Mensaje "sin resultados"

## Filtros

- [x] 6 chips de filtro por línea de negocio (+ "Todas")
- [x] Filtro combinable con la búsqueda por texto
- [x] Icono con el color del negocio en cada resultado

## Animación

- [x] Al elegir un resultado, la **cámara vuela** hasta el pin (easeInOutCubic, 1.6 s)
- [x] El pin queda resaltado al llegar
- [x] La tarjeta de la planta se abre al terminar el vuelo
- [x] Los pines que **no coinciden se atenúan** en el mapa

## Pendiente

- [ ] Búsqueda por coordenadas (lat/lon)
- [ ] Historial de búsquedas recientes
- [ ] Sugerencias automáticas (autocomplete) con las 5 plantas más visitadas
- [ ] Búsqueda por **distancia** desde la planta actual ("la más cercana")
- [ ] Atajo de teclado para enfocar la búsqueda (`/` o `Ctrl+K`)
- [ ] Resultados agrupados por país o región
