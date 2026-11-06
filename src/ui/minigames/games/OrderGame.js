/**
 * 🧩 games/OrderGame.js — Ordenar las etapas de un proceso
 * Se muestran las etapas en desorden: hay que pincharlas en el orden
 * en que ocurren (p. ej. el pedido logístico o la fabricación de roofing).
 */
import { ORDER_SEQUENCES } from '../../../data/plantInfo.js';

export function createOrderGame(body, ctx, { sequence } = {}) {
  const steps = ORDER_SEQUENCES[sequence] ?? ORDER_SEQUENCES.logistics;
  // Mezcla determinista: rota una posición (sin Math.random para que
  // el repositorio y las pruebas sean reproducibles).
  const display = [steps[steps.length - 1], ...steps.slice(0, -1)];

  let filled = 0;

  const label = (key) => ctx.t(`games.order.steps.${sequence ?? 'logistics'}.${key}`);

  function render() {
    body.innerHTML = `
      <div class="mg-slots">
        ${steps.map((_, i) => `
          <div class="mg-slot ${i < filled ? 'filled' : ''}">
            ${i < filled ? `${i + 1}. ${label(steps[i])}` : `${i + 1}.`}
          </div>
        `).join('')}
      </div>
      <div class="mg-chips">
        ${display.map((key) => `
          <button class="mg-chip" data-key="${key}" ${steps.indexOf(key) < filled ? 'disabled' : ''}>
            ${label(key)}
          </button>
        `).join('')}
      </div>
    `;
  }

  function onChip(e) {
    const chip = e.target.closest('[data-key]');
    if (!chip || filled >= steps.length) return;
    if (chip.dataset.key === steps[filled]) {
      filled++;
      ctx.progress(`${filled} / ${steps.length}`);
      if (filled >= steps.length) {
        render();
        ctx.feedback(ctx.t('games.order.success'), 'ok');
        ctx.win();
      } else {
        render();
      }
    } else {
      filled = 0;
      ctx.progress(`0 / ${steps.length}`);
      ctx.feedback(ctx.t('games.order.wrong'), 'bad');
      render();
    }
  }

  body.addEventListener('click', onChip);
  render();
  ctx.progress(`0 / ${steps.length}`);

  return {
    destroy() { body.removeEventListener('click', onChip); },
  };
}
