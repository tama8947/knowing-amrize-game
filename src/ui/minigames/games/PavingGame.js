/**
 * 🛣️ games/PavingGame.js — Extender y compactar el asfalto
 * El marcador recorre la barra: hay que pulsar cuando está en la zona
 * verde para dejar una carpeta pareja (3 pasadas buenas).
 */
const ZONE_MIN = 35;
const ZONE_MAX = 65;
const NEEDED = 3;

export function createPavingGame(body, ctx) {
  body.innerHTML = `
    <div class="mg-pave-track">
      <div class="mg-pave-zone" style="left:${ZONE_MIN}%;width:${ZONE_MAX - ZONE_MIN}%"></div>
      <div class="mg-pave-marker" data-marker></div>
    </div>
    <p class="mg-target">🟢 ${ctx.t('games.paving.zone')}: ${ZONE_MIN}–${ZONE_MAX}%</p>
  `;

  const marker = body.querySelector('[data-marker]');
  let hits = 0;
  let raf = 0;
  let pos = 5;
  let dir = 1;
  let last = performance.now();

  // Movimiento alternado (ida y vuelta) a velocidad constante
  function tick(now) {
    const dt = Math.min(now - last, 60);
    last = now;
    pos += dir * (dt / 900) * 90;
    if (pos >= 95) { pos = 95; dir = -1; }
    if (pos <= 5) { pos = 5; dir = 1; }
    marker.style.left = `${pos}%`;
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  function onHit() {
    if (hits >= NEEDED) return;
    if (pos >= ZONE_MIN && pos <= ZONE_MAX) {
      hits++;
      ctx.progress(`${hits} / ${NEEDED} ✓`);
      if (hits >= NEEDED) {
        ctx.feedback(ctx.t('games.paving.success'), 'ok');
        ctx.win();
      } else {
        ctx.feedback(ctx.t('games.paving.good'), 'ok');
      }
    } else {
      ctx.progress(`${hits} / ${NEEDED}`);
      ctx.feedback(ctx.t('games.paving.wrong'), 'bad');
    }
  }

  ctx.progress(`0 / ${NEEDED}`);
  ctx.validate(ctx.t('games.paving.hit'), onHit);

  return {
    destroy() { cancelAnimationFrame(raf); },
  };
}
