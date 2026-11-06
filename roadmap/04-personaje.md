# Fase 1 ter — Personaje jugable ✅

Objetivo: un personaje con el que el jugador se identifique y con el que
aprenda a moverse con soltura.

## Identidad

- [x] Selección de **hombre o mujer** en el menú
- [x] **Nombre personalizable** antes de empezar (campo de texto)
- [x] Botón 🎲 para nombre aleatorio
- [x] El nombre se guarda en `localStorage` y aparece en el HUD
- [x] Diferencias visuales: casco (blanco / amarillo), coleta, peinado

## Modelo 3D

- [x] **Brazos con pivote en el hombro** y manos visibles (antes se fundían con el torso)
- [x] **Alas del casco solo en la parte frontal** (antes tapaban la cara)
- [x] Ojos y nariz → la orientación del personaje se lee de un vistazo
- [x] Punta de las botas hacia delante
- [x] Chaleco de alta visibilidad con bandas reflectantes y tirantes
- [x] Pivotes en cadera y hombro → animación natural
- [x] Casco con cresta central
- [x] Escala 1.25 para gooder lectura en pantalla

## Movimiento

- [x] Caminar con **flechas** o **WASD** (relativo a la cámara)
- [x] Correr con `Shift`
- [x] **Saltar** con `Espacio` (gravedad + pose de salto)
- [x] El personaje se adapta al relieve del terreno
- [x] Límite del área jugable
- [x] Al aparecer en una planta, **mira hacia la planta**
- [x] La cámara sigue al jugador con suavizado

## Pendiente

- [ ] Animación de **saludo** al llegar a una planta
- [ ] Animación de **"high five"** al completar una planta
- [ ] Másnahme: gorra, gafas, casco con名字, chaleco de visitante
- [ ] Galeria de personajes con 6-8 opciones
- [ ] Mostrar el personaje en el menú en 3D (girando) en vez de emoji
- [ ] Animación de señalar el equipo cuando aparece el letrero
- [ ] Agacharse (`Ctrl`) para mirar por debajo de las máquinas
