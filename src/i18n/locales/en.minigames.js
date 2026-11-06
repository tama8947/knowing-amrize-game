/**
 * 🌍 locales/en.minigames.js — Textos de los minijuegos
 * Se fusiona con en.js en src/i18n/index.js (mergeLocale).
 * Contiene también las claves de UI propias de los retos:
 * ui.card.play · ui.card.played · ui.hud.points
 */
export default {
  ui: {
    card: {
      play: '🎮 Play the challenge',
      played: '✅ Challenge completed',
    },
    hud: {
      points: 'Sustainability points',
    },
  },
  games: {
    shell: {
      success: 'Completed!',
      retry: '🔄 Play again',
      continue: 'Continue →',
      points: 'points',
      again: 'You already completed this challenge: no extra points.',
    },
    kiln: {
      title: 'Control the kiln',
      desc: 'Clinker forms at about 1,450 °C. Set the temperature and fire up the rotary kiln.',
      target: 'Target zone: 1425–1475 °C',
      validate: '🔥 Fire up the kiln',
      tooLow: 'Too cold: the raw meal won\'t react. Raise the temperature.',
      tooHigh: 'Too hot: the lining suffers and CO₂ rises. Lower the temperature.',
      success: 'Quality clinker! The raw meal sinters perfectly.',
    },
    dosing: {
      title: 'Batch the concrete',
      desc: 'Adjust cement, water and aggregates for a mix that is both strong and workable.',
      cement: 'Cement',
      water: 'Water',
      aggregates: 'Aggregates',
      ratio: 'w/c ratio',
      validate: '🚚 Mix it',
      fail: 'Check the ingredients marked in red: they are out of range.',
      success: 'Perfect mix! Workable and strong, ready to pour.',
    },
    screen: {
      title: 'Sort it on the screen',
      desc: 'The vibrating screen separates material by size. Sort the 3 rocks into their tray.',
      arena: 'Sand',
      grava: 'Gravel',
      roca: 'Rock',
      wrong: 'Wrong tray: look at the size of the rock.',
      success: 'All three sorted! Perfect gradation.',
    },
    paving: {
      title: 'Pave the road',
      desc: 'Hit "Compact" while the marker is in the green zone. You need 3 smooth passes.',
      hit: '⚖️ Compact',
      zone: 'Green zone',
      good: 'Smooth pass!',
      wrong: 'Missed the zone: ripples left in the surface.',
      success: 'Smooth surface! No cold joints or ripples.',
    },
    order: {
      title: 'Order the process',
      desc: 'Click the steps in the order they happen.',
      wrong: 'That step doesn\'t belong there. Start over.',
      success: 'Process complete! Every step in place.',
      steps: {
        roofing: {
          liner: 'Waterproof base',
          assemble: 'Assembling sheets',
          reinforce: 'Reinforcement and seams',
          coat: 'Topcoat and sealing',
        },
        logistics: {
          request: 'Customer order',
          plan: 'Route planning',
          dispatch: 'Dispatching trucks',
          deliver: 'Delivery to site',
        },
      },
    },
  },
};
