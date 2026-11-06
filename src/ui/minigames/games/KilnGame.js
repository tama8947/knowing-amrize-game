/**
 * 🔥 games/KilnGame.js — Controlar la temperatura del horno de cemento
 * El clinker se sinteriza a ~1450 °C: demasiado frío no reacciona y
 * demasiado calor daña el revestimiento.
 */
export function createKilnGame(body, ctx) {
  body.innerHTML = `
    <div class="mg-readout"><b id="mg-kiln-read">1300</b><span> °C</span></div>
    <input type="range" id="mg-kiln-temp" class="mg-range" min="1200" max="1600" step="5" value="1300" />
    <div class="mg-scale"><span>1200 °C</span><span class="mg-zone">1425–1475</span><span>1600 °C</span></div>
    <p class="mg-target">🎯 ${ctx.t('games.kiln.target')}</p>
  `;

  const input = body.querySelector('#mg-kiln-temp');
  const read = body.querySelector('#mg-kiln-read');
  const onInput = () => { read.textContent = input.value; };
  input.addEventListener('input', onInput);

  ctx.progress('🎯 1425–1475 °C');
  ctx.validate(ctx.t('games.kiln.validate'), () => {
    const v = Number(input.value);
    if (v < 1425) { ctx.feedback(ctx.t('games.kiln.tooLow'), 'bad'); return; }
    if (v > 1475) { ctx.feedback(ctx.t('games.kiln.tooHigh'), 'bad'); return; }
    ctx.feedback(ctx.t('games.kiln.success'), 'ok');
    ctx.win();
  });

  return {
    destroy() { input.removeEventListener('input', onInput); },
  };
}
