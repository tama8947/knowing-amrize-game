# AGENTS.md

Instrucciones para asistentes de IA que trabajen en este repositorio.

> **Proyecto:** *Amrize: Ruta de Constructores* — juego educativo 3D (Three.js)
> sobre las plantas de Amrize en Estados Unidos y Canadá.
> Stack: **Vite + JavaScript vanilla + Three.js**. Sin framework de UI.

Lee este archivo **antes** de tocar código. Si una regla de aquí contradice tu
impulso, gana la regla.

---

## 1. Comandos

**Gestor de paquetes: pnpm** (no uses npm ni yarn en este repositorio).

```bash
pnpm install        # solo la primera vez
pnpm dev            # servidor de desarrollo (http://localhost:5173)
pnpm build          # build de producción → dist/
pnpm preview        # previsualiza el build
pnpm test:e2e       # 51 pruebas end-to-end con Chromium headless
```

Scripts de datos (regeneran ficheros en `src/data/`):

```bash
pnpm data:map        # geometría de estados/provincias (Natural Earth)
pnpm data:plants     # catálogo de 38 plantas reales
pnpm screenshots     # regenera docs/screenshot-*.png
```

> Equivalentes directos: `node tools/build-map-data.mjs`, etc.
> Los scripts usan el binario local de Vite (`tools/devServer.mjs`), así que
> funcionan igual con pnpm, npm o yarn.

> `build-plants.mjs` espera por defecto `/tmp/amrize_locations.json`. Pasa la
> ruta como argumento: `node tools/build-plants.mjs <archivo.json>`.

---

## 2. Reglas que NO se negocian

### 2.1 Ningún texto de interfaz hardcodeado
Todo lo que se ve en pantalla va por clave i18n:

```js
// ❌ mal
button.textContent = 'Comenzar el viaje';

// ✅ bien
button.textContent = t('ui.start.begin');
```

- En HTML: `data-i18n="ui.start.begin"` para texto, `data-i18n-placeholder="…"` para placeholders.
- El contenido educativo de las estaciones vive en `src/i18n/locales/*.js`, **nunca** en el código 3D.
- Si añades una clave, **añádela en los 5 idiomas** (es, en, fr, de, ch). El español es la base y el fallback.

### 2.2 Las estaciones se resuelven por clave, al mostrar
El contenido no se captura al construir la escena. Se pasa el **id** y la UI
lo resuelve, para que el cambio de idioma funcione en caliente:

```js
// ❌ mal — congela el texto en el idioma actual
ui.showInfo(tStation('horno'));

// ✅ bien
ui.showInfo('horno');
```

`Interaction` guarda `{ object, stationId }`. `UI.showInfo(stationId)` y
`UI.showPrompt(stationId)` resuelven el texto.

### 2.3 Todo dato generado se regenera, no se edita a mano
`src/data/plants.js` y `src/data/map/us-ca.json` los generan scripts de
`tools/`. Para cambiarlos, edita el script y vuelve a ejecutarlo.

La selección de plantas debe seguir siendo **determinista** (usa un hash del
id, no `Math.random()`), para que el repositorio sea reproducible.

### 2.4 Estilo visual low-poly coherente
- Geometría simple, `flatShading: true`, sin texturas.
- Paleta de materiales en `src/world/plants/PlantKit.js` (`MAT.*`).
- Colores corporativos: azul `#011E6A`, naranja `#FF4412` (ver `src/styles/main.css`).

### 2.5 Nada de rutas absolutas ni datos de la máquina
El repositorio es público. Nada de `/home/...`, `/Users/...`, tokens, claves ni
nombres de usuario. Todo se resuelve con `import.meta.url` o rutas relativas.

---

## 3. Arquitectura

```
src/
├── main.js            ← bootstrap: modos 'menu' → 'map' → 'plant'
├── core/
│   ├── Engine.js      ← renderer, cámara, OrbitControls, bucle, modo lowfx
│   └── Sky.js         ← cielo con shader, sol, nubes
├── world/
│   ├── Terrain.js     ← relieve + terrainHeight() (compartido con el jugador)
│   ├── Scenery.js     ← árboles, rocas, caminos
│   ├── geoProjection.js ← proyección Albers de Norteamérica
│   ├── MapScene.js    ← mapa 3D, pines, búsqueda, foco de cámara
│   └── plants/
│       ├── index.js       ← factory: createPlantByBusiness()
│       ├── PlantKit.js    ← piezas reutilizables (silos, cintas, camiones…)
│       └── <Business>Plant.js
├── game/
│   ├── Player.js      ← personaje: caminar, saltar, colisión, animación
│   ├── Input.js       ← teclado (flechas/WASD + acciones)
│   ├── Interaction.js ← proximidad (REACH = 6.5) + activación
│   └── GameState.js   ← progreso y persistencia (localStorage)
├── ui/
│   ├── UI.js          ← menú, HUD, buscador, tarjetas, toasts
│   └── minigames/     ← marco + 5 juegos (kiln, dosing, screen, paving, order)
├── i18n/
│   ├── index.js       ← motor, claves, detección, fallback
│   └── locales/       ← es.js en.js fr.js de.js ch.js
└── data/
    ├── plantInfo.js   ← estructura de negocios (sin textos)
    ├── plants.js      ← GENERADO
    └── map/us-ca.json ← GENERADO
```

### Modos de juego
`main.js` mantiene `mode ∈ {'menu', 'map', 'plant'}`:

| Modo | Visible | Controles |
|---|---|---|
| `map` | `mapGroup` | cámara orbital, hover/click en pines, buscador |
| `plant` | `worldGroup` + planta actual | jugador, saltos, inspección con `E` |

`goToMap()` / `goToPlant()` alternan la visibilidad y lanzan el vuelo de cámara.

---

## 4. Cómo añadir cosas

### 4.1 Una estación nueva en una planta existente
1. Añade la clave en `src/i18n/locales/*.js` (los 5 idiomas):
   ```js
   stations: { 'co-nueva': { icon, title, text, fact } }
   ```
2. Añade el id a `STATIONS_BY_BUSINESS` en `src/data/plantInfo.js`.
3. En la planta, registra el objeto: `register(mesh, 'co-nueva')` o `add(mesh, 'co-nueva')`.

### 4.2 Una planta nueva (nueva línea de negocio)
1. Crea `src/world/plants/<Business>Plant.js` que exporte
   `createXPlant(scene, register)` y devuelva `{ group, update }`.
2. Regístrala en `src/world/plants/index.js` (`FACTORIES`).
3. Añade el color del negocio en `BUSINESS_COLORS` de `src/ui/UI.js` y en
   `MapScene.js`.
4. Añade `biz.<key>.*` a los 5 locales y el key a `BUSINESS_KEYS`
   (`src/data/plantInfo.js`).
5. Reconstruye `BUSINESS_ALIASES` si hace falta (se calcula solo al cargar).

### 4.3 Un idioma nuevo
1. Copia `src/i18n/locales/es.js` → `<code>.js` y tradúcelo.
2. Regístralo en `LOCALES` (`src/i18n/index.js`) con su bandera y locale.
3. Si debe autodetectarse, añade el prefijo en `detectLocale()`.

### 4.4 Una planta más en el mapa
1. Añádela al JSON de ubicaciones de origen.
2. Ajusta `TARGET_PER_BUSINESS` en `tools/build-plants.mjs`.
3. `node tools/build-plants.mjs <archivo.json>` → regenera `src/data/plants.js`.

### 4.5 Un minijuego nuevo
1. Crea `src/ui/minigames/games/<Nombre>.js` exportando
   `createXGame(body, ctx, opts)` → `{ destroy?() }`.
   El contrato de `ctx` está documentado en la cabecera de
   `MinigameManager.js` (`t`, `feedback`, `validate`, `progress`, `win`).
2. Regístralo en `src/ui/minigames/games/index.js` (`GAME_TYPES` + `GAME_ICONS`).
3. Asócialo a una estación en `GAME_FOR_STATION` (`src/data/plantInfo.js`).
4. Añade `games.<tipo>.*` a los 5 archivos `locales/<code>.minigames.js`.
5. Añade sus pruebas en la sección 12 de `tools/e2e-test.mjs`.

> Los minijuegos son **DOM puro** (sin Three.js): fáciles de probar,
> traducir y mantener. El overlay es modal: mientras está abierto, el
> jugador queda quieto y `Esc` lo cierra.

---

## 5. Verificación

**Antes de dar por terminado cualquier cambio:**

```bash
pnpm build        # debe compilar sin errores
pnpm test:e2e     # debe dar 51/51
```

La suite E2E (Playwright + Chromium headless) cubre: carga, menú, selección de
personaje y nombre, modo mapa, geometría, pines, vuelo de cámara, caminar,
saltar, letrero de proximidad, tecla `E`, sellos, buscador, filtro por tipo,
vuelo al resultado, búsqueda multiidioma, cambio de idioma en caliente,
**minijuegos** (apertura, fallo, victoria, puntos, repetición, persistencia y
traducción en caliente) y errores de consola.

Si añades una funcionalidad, **añade también su prueba** en `tools/e2e-test.mjs`.

---

## 6. Estilo de código

- ES Modules, `import`/`export`. Sin CommonJS.
- Comentarios y nombres de documentación en **español**.
- JSDoc en las funciones públicas: `@param`, `@returns`.
- Emojis en los comentarios de sección para-orientarse rápido (igual que el
  resto del repositorio).
- Sin dependencias nuevas sin justificarlo en el README.
- **Usa `pnpm`**, nunca `npm install` ni `yarn` (el repo tiene `pnpm-lock.yaml`).
  Si añades una dependencia, actualiza también `pnpm-lock.yaml`.
- Preferencia por lo declarativo: datos en `src/data/`, lógica en `src/game/`.

---

## 7. Identidad de marca

| Elemento | Valor |
|---|---|
| Azul Amrize | `#011E6A` |
| Naranja Amrize | `#FF4412` |
| Azul brillante | `#1963FF` |
| Logo | `public/brand/amrize-logo.svg` (no modificar: es oficial) |
| Eslóganos | *Build your ambition* · 🇺🇸 *Building America* · 🇨🇦 *Building Canada* |

Referencia: [amrize.com/us/en/amrize-homepage.html](https://www.amrize.com/us/en/amrize-homepage.html).

---

## 8. Estado actual

- 38 plantas reales · 26 estados/provincias · 2 países
- 6 líneas de negocio · 35 estaciones educativas
- 6 minijuegos educativos con puntos de sostenibilidad
- 5 idiomas completos con traducción en caliente
- 51 pruebas E2E en verde

El detalle de lo pendiente está en [`roadmap/`](roadmap/README.md).
