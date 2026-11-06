/**
 * 🧱 games/DosingGame.js — Dosificar 1 m³ de concreto
 * Rangos realistas por m³: cemento 350–400 kg, agua 155–180 L
 * (relación agua/cemento ≈ 0.44–0.50) y agregados 1750–1850 kg.
 */
const FIELDS = [
  { id: 'cement', min: 300, max: 450, step: 5, value: 320, lo: 350, hi: 400, unit: 'kg' },
  { id: 'water', min: 120, max: 220, step: 5, value: 140, lo: 155, hi: 180, unit: 'L' },
  { id: 'aggregates', min: 1650, max: 1950, step: 10, value: 1700, lo: 1750, hi: 1850, unit: 'kg' },
];

export function createDosingGame(body, ctx) {
  body.innerHTML = FIELDS.map((f) => `
    <div class="mg-field" data-field="${f.id}">
      <label for="mg-dos-${f.id}">${ctx.t(`games.dosing.${f.id}`)}
        <small>${f.lo}–${f.hi} ${f.unit}</small>
      </label>
      <input type="range" id="mg-dos-${f.id}" min="${f.min}" max="${f.max}" step="${f.step}" value="${f.value}" />
      <output class="mg-field-status" data-status>${f.value} ${f.unit}</output>
    </div>
  `).join('')
  + `<p class="mg-target">⚗️ ${ctx.t('games.dosing.ratio')}: <b data-ratio>0.40</b></p>`;

  const inputs = Object.fromEntries(
    FIELDS.map((f) => [f.id, body.querySelector(`#mg-dos-${f.id}`)])
  );
  const ratioEl = body.querySelector('[data-ratio]');

  const ok = (f, v) => v >= f.lo && v <= f.hi;

  function refresh() {
    for (const f of FIELDS) {
      const v = Number(inputs[f.id].value);
      const status = inputs[f.id].closest('.mg-field').querySelector('[data-status]');
      const good = ok(f, v);
      status.textContent = `${v} ${f.unit} ${good ? '✓' : '✗'}`;
      status.classList.toggle('bad', !good);
      status.classList.toggle('good', good);
    }
    const wc = Number(inputs.water.value) / Number(inputs.cement.value);
    ratioEl.textContent = wc.toFixed(2);
    ratioEl.classList.toggle('bad', wc > 0.5 || wc < 0.4);
    ratioEl.classList.toggle('good', wc >= 0.4 && wc <= 0.5);
  }

  const onInput = () => refresh();
  FIELDS.forEach((f) => inputs[f.id].addEventListener('input', onInput));
  refresh();

  ctx.progress('⚖️ 1 m³');
  ctx.validate(ctx.t('games.dosing.validate'), () => {
    const allOk = FIELDS.every((f) => ok(f, Number(inputs[f.id].value)));
    if (!allOk) { ctx.feedback(ctx.t('games.dosing.fail'), 'bad'); return; }
    ctx.feedback(ctx.t('games.dosing.success'), 'ok');
    ctx.win();
  });

  return {
    destroy() { FIELDS.forEach((f) => inputs[f.id].removeEventListener('input', onInput)); },
  };
}
