# 📜 Game Design Document — *Amrize: Ruta de Constructores*

## 1. Resumen
Juego educativo 3D de exploración para dar a conocer **Amrize** (la compañía de
materiales de construcción de Norteamérica surgida de Holcim/Lafarge, presente
en el 100% de estados de EE.UU. y provincias de Canadá, con 1,000+ sitios).
El jugador viaja por el mapa visitando plantas y aprendiendo procesos reales.

## 2. Audiencia
- **Primaria:** nuevos colaboradores de Amrize (onboarding) 🧑‍🔧
- **Secundaria:** estudiantes/escuelas, ferias de carreras, familias
- **Terciaria:** clientes y público general (brand awareness)
- Edad objetivo: 12+ · Idiomas: ES / EN / FR

## 3. Bucle de juego (core loop)
```
Elegir personaje → Elegir destino en el mapa → Volar a la planta
→ Recorrido guiado (3–6 estaciones) → Mini-reto educativo
→ Ganar sello + insignia → Desbloquear siguiente región
```

## 4. Pilares de diseño
1. **Autenticidad:** los procesos reflejan operaciones reales de Amrize.
2. **Asombro:** el mundo low-poly cálido invita a explorar (estilo "summer afternoon").
3. **Progreso visible:** el pasaporte y el mapa se llenan de sellos.
4. **Propósito:** cada visita enseña sostenibilidad (economía circular, CO₂, reciclaje).

## 5. Personajes
- **Constructor / Constructora** (selección al inicio):
  - Casco, chaleco de alta visibilidad, botas (uniforme de seguridad Amrize).
  - Personalización: tono de piel, color de casco, accesorios.
- Animación: caminar, saludar, señalar equipos, "high five" al completar planta.

## 6. Mundo — Mapa de Norteamérica
- Diorama stylized de EE.UU. + Canadá (low-poly, colores cálidos).
- **Proyección Albers Equal Area Conic** (la oficial de Norteamérica/USGS).
- 50 estados + 13 provincias extruidos, con Alaska y Hawái como insets.
- **Pines** = plantas reales; colores por negocio:
  🪨 Agregados · 🟠 Cemento · 🔵 Concreto · ⚫ Asfalto · 🟤 Roofing · 🚂 Logística
- Regiones desbloqueables: Costa Este → Medio Oeste → Sur → Oeste → Canadá.
- Iconos de "mundo vivo": camiones, trenes, barcos en rutas de distribución.
- Datos generados por `tools/build-map-data.mjs` (Natural Earth 10m admin-1).

## 7. Estructura de una planta (niveles)
Cada planta es un nivel con:
- **Estaciones (checkpoints):** extracción → procesamiento → producto → calidad → despacho.
- **Anfitriona/anfitrión virtual:** avatar que narra datos curiosos.
- **Reto final:** quiz de 3–5 preguntas o minijuego (ordenar etapas, mezclar concreto…).
- **Recompensa:** sello de pasaporte + insignia + datos clave (ej. "el horno alcanza ~1,450 °C").

## 8. Minijuegos por negocio
| Negocio | Minijuego |
|---|---|
| Agregados | Clasificar rocas por tamaño en la zaranda |
| Cemento | Controlar el horno: temperatura y velocidad del clinker |
| Concreto | Dosificar la mezcla perfecta (cemento+agua+agregados+aditivos) |
| Asphalt | Pavimentar la carretera siguiendo la curva |
| Roofing | Instalar membrana sobre la azotea contra reloj |
| Logística | Planear la ruta de camiones más eficiente y baja en CO₂ |

## 9. Progresión y recompensas
- **Pasaporte de Construcción** con sellos por planta.
- **Rangos:** Aprendiz → Constructor → Experto → Embajador Amrize.
- **Insignias de proceso:** "Rey/Reina del Clinker", "Mezcla Perfecta", etc.
- **Medidor de sostenibilidad:** puntos por decisiones ecológicas en minijuegos.

## 10. Estilo visual, marca y audio
- Low-poly flat shading, paleta cálida (atardecer de verano), niebla suave.
- **Identidad corporativa Amrize:**
  - Azul `#011E6A` (primario) · Naranja `#FF4412` (acento) · Azul brillante `#1963FF`
  - Logo oficial vectorial (`public/brand/amrize-logo.svg`) en menú y HUD
  - Eslóganos: *Build your ambition* · *🇺🇸 Building America* · *🇨🇦 Building Canada*
- UI redondeada y amable; tipografía geométrica.
- Música acústica optimista; SFX de maquinaria suave (sin estridencias).
- Modo `?lowfx=1` (o automático en móviles): sin sombras, pixel ratio 1.

## 11. Tecnología
- **Three.js** (WebGL) + OrbitControls / cámaras con tween.
- Estado en `localStorage` (guardar pasaporte).
- Futuro: Vite + TypeScript, React para UI, i18n, analytics de aprendizaje.

## 12. Contenido educativo (fuente)
Datos y procesos basados en la operación pública de Amrize:
- Cemento, concreto, agregados, asfalto → *Building Materials*
- Roofing (comercial/residencial), aislamiento, adhesivos y sellantes,
  weatherization → *Building Envelope*
- Distribución y logística: red nacional de 1,000+ sitios
  (ver `docs/plants-content.md` para el detalle por planta).
