# Fase 1 — Mapa de Norteamérica ✅

Objetivo: que el jugador vea dónde está cada planta antes de viajar.

## Geometría

- [x] Geometría real de 50 estados + 13 provincias (Natural Earth 10m admin-1)
- [x] Extracción y simplificación con Douglas–Peucker (`tools/build-map-data.mjs`)
- [x] Proyección **Albers Equal Area Conic** (la oficial de Norteamérica/USGS)
- [x] Extrusión 3D con bisel y bordes definidos
- [x] Insets de Alaska y Hawái (fuera de escala, bajo el continente)
- [x] Agujeros (lagos y bahías) resueltos como `Shape.holes`
- [x] Datapackage reproducible: `src/data/map/us-ca.json` (~275 KB)

## Catálogo de plantas

- [x] Datos extraídos de las ubicaciones públicas de amrize.com (647 registros)
- [x] 38 plantas seleccionadas con cobertura equilibrada (26 estados/provincias, 5 regiones, 2 países)
- [x] Clasificación automática por línea de negocio
- [x] Selección **determinista** (hash del id, sin `Math.random`)
- [x] Nombres limpios (ciudad + sitio) y geocodificación (`tools/build-plants.mjs`)

## Interacción

- [x] 38 pines con color por negocio
- [x] Emojis de negocio flotando sobre cada pin
- [x] Etiqueta con el nombre de la ciudad
- [x] Hover: el pin crece y se resalta
- [x] Click: abre la tarjeta de la planta
- [x] Vuelo de cámara entre mapa y planta
- [x] Regreso al mapa con botón en el HUD

## Pendiente

- [ ] Marcas de agua / lakes轨迹 de rios (Great Lakes más detallados)
- [ ] Nombres de países, mares y límites internacionales rotulados
- [ ] Vista de zoom con detalle de estado (al hacer zoom en un estado, mostrar sus plantas)
- [ ] Filtro por **región** de Amrize (Pacific, Northeast, Central, South, Great Lakes)
- [ ] Filtro por país (🇺🇸 / 🇨🇦)
- [ ] Vista de Routes de distribución entre plantas (líneas de tren y barco)
- [ ] Mini-mapa o brújula con la posición del jugador
