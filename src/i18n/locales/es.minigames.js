/**
 * 🌍 locales/es.minigames.js — Textos de los minijuegos
 * Se fusiona con es.js en src/i18n/index.js (mergeLocale).
 * Contiene también las claves de UI propias de los retos:
 * ui.card.play · ui.card.played · ui.hud.points
 */
export default {
  ui: {
    card: {
      play: '🎮 Jugar el reto',
      played: '✅ Reto completado',
    },
    hud: {
      points: 'Puntos de sostenibilidad',
    },
  },
  games: {
    shell: {
      success: '¡Completado!',
      retry: '🔄 Jugar de nuevo',
      continue: 'Continuar →',
      points: 'puntos',
      again: 'Ya habías completado este reto: sin puntos extra.',
    },
    kiln: {
      title: 'Controla el horno',
      desc: 'El clinker se forma a unos 1.450 °C. Ajusta la temperatura y enciende el horno rotatorio.',
      target: 'Zona objetivo: 1425–1475 °C',
      validate: '🔥 Encender el horno',
      tooLow: 'Muy frío: la materia prima no reacciona. Sube la temperatura.',
      tooHigh: 'Demasiado calor: se daña el revestimiento y sube el CO₂. Baja la temperatura.',
      success: '¡Clinker de calidad! La materia prima se ha sinterizado a la perfección.',
    },
    dosing: {
      title: 'Dosifica el concreto',
      desc: 'Ajusta cemento, agua y agregados hasta lograr una mezcla resistente y trabajable.',
      cement: 'Cemento',
      water: 'Agua',
      aggregates: 'Agregados',
      ratio: 'Relación a/c',
      validate: '🚚 Mezclar',
      fail: 'Revisa los ingredientes marcados en rojo: están fuera de rango.',
      success: '¡Mezcla perfecta! Trabajable y resistente, lista para vaciar.',
    },
    screen: {
      title: 'Clasifica en la zaranda',
      desc: 'La zaranda vibra y separa el material por tamaño. Clasifica las 3 rocas en su bandeja.',
      arena: 'Arena',
      grava: 'Grava',
      roca: 'Roca',
      wrong: 'No es esa bandeja: mira la roca según su tamaño.',
      success: '¡Tres clasificadas! La granulometría queda perfecta.',
    },
    paving: {
      title: 'Extiende el asfalto',
      desc: 'Pulsa «Compactar» cuando el marcador esté en la zona verde. Necesitas 3 pasadas parejas.',
      hit: '⚖️ Compactar',
      zone: 'Zona verde',
      good: '¡Pasada limpia!',
      wrong: 'Fuera de zona: quedaron oscilaciones en la carpeta.',
      success: '¡Carpeta pareja! Sin juntas frías ni oscilaciones.',
    },
    order: {
      title: 'Ordena el proceso',
      desc: 'Haz clic en las etapas en el orden en que ocurren.',
      wrong: 'Esa etapa no va ahí. Vuelve a empezar.',
      success: '¡Proceso completo! Cada etapa en su sitio.',
      steps: {
        roofing: {
          liner: 'Base impermeable',
          assemble: 'Armado de láminas',
          reinforce: 'Refuerzo y costuras',
          coat: 'Acabado y sellado',
        },
        logistics: {
          request: 'Pedido del cliente',
          plan: 'Planificación de ruta',
          dispatch: 'Despacho de camiones',
          deliver: 'Entrega en obra',
        },
      },
    },
  },
};
