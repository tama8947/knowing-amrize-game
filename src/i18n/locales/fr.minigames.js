/**
 * 🌍 locales/fr.minigames.js — Textos de los minijuegos
 * Se fusiona con fr.js en src/i18n/index.js (mergeLocale).
 * Contiene también las claves de UI propias de los retos:
 * ui.card.play · ui.card.played · ui.hud.points
 */
export default {
  ui: {
    card: {
      play: '🎮 Jouer au défi',
      played: '✅ Défi réussi',
    },
    hud: {
      points: 'Points de durabilité',
    },
  },
  games: {
    shell: {
      success: 'Réussi !',
      retry: '🔄 Rejouer',
      continue: 'Continuer →',
      points: 'points',
      again: 'Tu avais déjà réussi ce défi : aucun point bonus.',
    },
    kiln: {
      title: 'Contrôle le four',
      desc: 'Le clinker se forme vers 1 450 °C. Règle la température et allume le four rotatif.',
      target: 'Zone cible : 1425–1475 °C',
      validate: '🔥 Allumer le four',
      tooLow: 'Trop froid : la matière première ne réagit pas. Augmente la température.',
      tooHigh: 'Trop chaud : le revêtement souffre et le CO₂ augmente. Baisse la température.',
      success: 'Clinker de qualité ! La matière première est parfaitement frittée.',
    },
    dosing: {
      title: 'Dosifie le béton',
      desc: 'Ajuste ciment, eau et agrégats pour un mélange résistant et manipulable.',
      cement: 'Ciment',
      water: 'Eau',
      aggregates: 'Agrégats',
      ratio: 'Rapport e/c',
      validate: '🚚 Mélanger',
      fail: 'Vérifie les ingrédients en rouge : ils sont hors plage.',
      success: 'Mélange parfait ! Maniable et résistant, prêt à couler.',
    },
    screen: {
      title: 'Trie au crible',
      desc: 'Le crible vibre et sépare le matériau par taille. Trie les 3 rochers dans leur bac.',
      arena: 'Sable',
      grava: 'Gravier',
      roca: 'Roche',
      wrong: 'Ce n\'est pas le bon bac : regarde la taille du rocher.',
      success: 'Les trois triés ! Granulométrie parfaite.',
    },
    paving: {
      title: 'Répands l\'asphalte',
      desc: 'Appuie sur « Compacter » quand le repère est dans la zone verte. Il faut 3 passes régulières.',
      hit: '⚖️ Compacter',
      zone: 'Zone verte',
      good: 'Passe nette !',
      wrong: 'Hors zone : des ondulations restent dans la chaussée.',
      success: 'Surface lisse ! Ni joints froids ni ondulations.',
    },
    order: {
      title: 'Ordonne le processus',
      desc: 'Clique sur les étapes dans l\'ordre où elles se déroulent.',
      wrong: 'Cette étape n\'est pas là. Recommence.',
      success: 'Processus complet ! Chaque étape à sa place.',
      steps: {
        roofing: {
          liner: 'Étanchéité de base',
          assemble: 'Assemblage des dalles',
          reinforce: 'Renfort et coutures',
          coat: 'Finition et étanchéité',
        },
        logistics: {
          request: 'Commande client',
          plan: 'Planification d\'itinéraire',
          dispatch: 'Départ des camions',
          deliver: 'Livraison sur chantier',
        },
      },
    },
  },
};
