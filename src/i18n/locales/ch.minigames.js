/**
 * 🌍 locales/ch.minigames.js — Textos de los minijuegos
 * Se fusiona con ch.js en src/i18n/index.js (mergeLocale).
 * Contiene también las claves de UI propias de los retos:
 * ui.card.play · ui.card.played · ui.hud.points
 */
export default {
  ui: {
    card: {
      play: '🎮 Uförschla spile',
      played: '✅ Uförschla gschafft',
    },
    hud: {
      points: 'Nachhaltigkeitspunkte',
    },
  },
  games: {
    shell: {
      success: 'Gschafft!',
      retry: '🔄 Nochmal spile',
      continue: 'Weiter →',
      points: 'Pünkt',
      again: 'Du hesch das Uförschla scho mal gschafft: kei Extra-Pünkt.',
    },
    kiln: {
      title: 'Stüür d\'Öfen',
      desc: 'Ds Klinker entsteht bi ca. 1.450 °C. Stüür d Temperatur i und zünd dr Drehöfen a.',
      target: 'Zielzone: 1425–1475 °C',
      validate: '🔥 Öfen aaazünde',
      tooLow: 'Zu chalt: ds Rohmahl reagiert nid. Erhöh d Temperatur.',
      tooHigh: 'Zu heiss: s Auskleidig lit und s CO₂ steigt. Senk d Temperatur.',
      success: 'Qualitäts-Klinker! s Rohmahl isch perfekt gsintert.',
    },
    dosing: {
      title: 'Dosier dr Beton',
      desc: 'Passe Zement, Wasser und Zueschlagstoffi a, bis d Mischig fäst und verarbeitbar isch.',
      cement: 'Zement',
      water: 'Wasser',
      aggregates: 'Zueschlagstoff',
      ratio: 'w/z-Verhäutnis',
      validate: '🚚 Mische',
      fail: 'Prüf d roote Zutate: si ligged usserhalb em Räng.',
      success: 'Perfekt Mischig! Verarbeitbar und fäst, bereit zum Giisse.',
    },
    screen: {
      title: 'Sortier am Sieb',
      desc: 'Dr Sieb trennt s Material nach Grössi. Sortier d 3 Stei i ihri Fächer.',
      arena: 'Sand',
      grava: 'Schotte',
      roca: 'Stein',
      wrong: 'Fälschs Fach: lueg uf d Grössi vom Stein.',
      success: 'Aui drü sortiert! Perfekti Körnig.',
    },
    paving: {
      title: 'Verleg dr Asphalt',
      desc: 'Drück uf „Verdichte", wenn dr Marker i dr grüene Zone isch. Du bruchsch 3 glätti Dürchgäng.',
      hit: '⚖️ Verdichte',
      zone: 'Grüeni Zone',
      good: 'Sauberer Dürchgang!',
      wrong: 'Verfehlt: Wellig blibet im Fahrbahnbeläg.',
      success: 'Glatte Fahrbähn! Kei Chaltfuge oder Wellig.',
    },
    order: {
      title: 'Ordne dr Prozäss',
      desc: 'Klic d Schritt i dr Reihenfolg, i dener si passiered.',
      wrong: 'Ds Schritt gehört nid do. Voon vorn.',
      success: 'Prozäss komplett! All Schritt am richtige Ort.',
      steps: {
        roofing: {
          liner: 'Abdichtig-Unterlag',
          assemble: 'Platte montere',
          reinforce: 'Verstärköö und Näht',
          coat: 'Deckbifig und Abdichtig',
        },
        logistics: {
          request: 'Chundeauftrag',
          plan: 'Routenplanning',
          dispatch: 'LKW-Disposition',
          deliver: 'Liiferig zur Chliibau',
        },
      },
    },
  },
};
