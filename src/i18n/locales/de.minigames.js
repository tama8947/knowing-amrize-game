/**
 * 🌍 locales/de.minigames.js — Textos de los minijuegos
 * Se fusiona con de.js en src/i18n/index.js (mergeLocale).
 * Contiene también las claves de UI propias de los retos:
 * ui.card.play · ui.card.played · ui.hud.points
 */
export default {
  ui: {
    card: {
      play: '🎮 Challenge spielen',
      played: '✅ Challenge geschafft',
    },
    hud: {
      points: 'Nachhaltigkeitspunkte',
    },
  },
  games: {
    shell: {
      success: 'Geschafft!',
      retry: '🔄 Nochmal spielen',
      continue: 'Weiter →',
      points: 'Punkte',
      again: 'Du hast diesen Challenge bereits geschafft: keine Extra-Punkte.',
    },
    kiln: {
      title: 'Steuere den Ofen',
      desc: 'Der Klinker entsteht bei etwa 1.450 °C. Stelle die Temperatur ein und zünde den Drehofen an.',
      target: 'Zielzone: 1425–1475 °C',
      validate: '🔥 Ofen anzünden',
      tooLow: 'Zu kalt: das Rohmahl reagiert nicht. Erhöhe die Temperatur.',
      tooHigh: 'Zu heiß: das Auskleidung leidet und das CO₂ steigt. Senke die Temperatur.',
      success: 'Qualitäts-Klinker! Das Rohmahl ist perfekt gesintert.',
    },
    dosing: {
      title: 'Dosiere den Beton',
      desc: 'Passe Zement, Wasser und Zuschlagstoffe an, bis die Mischung fest und verarbeitbar ist.',
      cement: 'Zement',
      water: 'Wasser',
      aggregates: 'Zuschlagstoffe',
      ratio: 'w/z-Verhältnis',
      validate: '🚚 Mischen',
      fail: 'Prüfe die roten Zutaten: sie liegen außerhalb des Bereichs.',
      success: 'Perfekte Mischung! Verarbeitbar und fest, bereit zum Gießen.',
    },
    screen: {
      title: 'Sortiere am Sieb',
      desc: 'Das Schüttelsieb trennt das Material nach Größe. Sortiere die 3 Steine in ihr Fach.',
      arena: 'Sand',
      grava: 'Schotter',
      roca: 'Fels',
      wrong: 'Falsches Fach: schau auf die Größe des Steins.',
      success: 'Alle drei sortiert! Perfekte Körnung.',
    },
    paving: {
      title: 'Verlege den Asphalt',
      desc: 'Drücke auf „Verdichten", wenn der Marker in der grünen Zone ist. Du brauchst 3 gleichmäßige Durchgänge.',
      hit: '⚖️ Verdichten',
      zone: 'Grüne Zone',
      good: 'Sauberer Durchgang!',
      wrong: 'Verfehlt: Wellen bleiben im Fahrbahnbelag.',
      success: 'Glatte Fahrbahn! Keine Kaltfugen oder Wellen.',
    },
    order: {
      title: 'Ordne den Prozess',
      desc: 'Klicke die Schritte in der Reihenfolge, in der sie passieren.',
      wrong: 'Dieser Schritt gehört nicht hier. Von vorn.',
      success: 'Prozess komplett! Jeder Schritt am richtigen Ort.',
      steps: {
        roofing: {
          liner: 'Abdichtungs-Unterlage',
          assemble: 'Platten montieren',
          reinforce: 'Verstärkung und Nähte',
          coat: 'Deckbeschichtung und Abdichtung',
        },
        logistics: {
          request: 'Kundenauftrag',
          plan: 'Routenplanung',
          dispatch: 'LKW-Disposition',
          deliver: 'Lieferung zur Baustelle',
        },
      },
    },
  },
};
