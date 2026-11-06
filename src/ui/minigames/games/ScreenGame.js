/**
 * 🪨 games/ScreenGame.js — Clasificar rocas en la zaranda
 * La zaranda vibra y separa el material por granulometría:
 * fina → arena, media → grava, gruesa → roca.
 */
const ROUNDS = [
  { size: 46, answer: 'arena' },
  { size: 76, answer: 'grava' },
  { size: 112, answer: 'roca' },
];

export function createScreenGame(body, ctx) {
  let round = 0;

  body.innerHTML = `
    <div class="mg-rock-stage"><div class="mg-rock" data-rock></div></div>
    <div class="mg-buckets">
      <button class="mg-bucket" data-bucket="arena">🪨 ${ctx.t('games.screen.arena')}</button>
      <button class="mg-bucket" data-bucket="grava">🪨 ${ctx.t('games.screen.grava')}</button>
      <button class="mg-bucket" data-bucket="roca">🪨 ${ctx.t('games.screen.roca')}</button>
    </div>
  `;

  const rock = body.querySelector('[data-rock]');
  const stage = body.querySelector('.mg-rock-stage');

  function drawRock() {
    const r = ROUNDS[round];
    rock.style.width = `${r.size}px`;
    rock.style.height = `${r.size}px`;
    stage.classList.remove('mg-shake');
  }

  function onBucket(e) {
    const btn = e.target.closest('[data-bucket]');
    if (!btn || round >= ROUNDS.length) return;
    if (btn.dataset.bucket === ROUNDS[round].answer) {
      round++;
      ctx.progress(`${round} / ${ROUNDS.length}`);
      if (round >= ROUNDS.length) {
        ctx.feedback(ctx.t('games.screen.success'), 'ok');
        ctx.win();
      } else {
        drawRock();
      }
    } else {
      ctx.feedback(ctx.t('games.screen.wrong'), 'bad');
      stage.classList.remove('mg-shake');
      void stage.offsetWidth; // reinicia la animación
      stage.classList.add('mg-shake');
    }
  }

  body.addEventListener('click', onBucket);
  drawRock();
  ctx.progress(`0 / ${ROUNDS.length}`);

  return {
    destroy() { body.removeEventListener('click', onBucket); },
  };
}
