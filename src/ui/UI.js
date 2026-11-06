/**
 * 🖥️ ui/UI.js — Capa de interfaz (DOM)
 * Menú, HUD, buscador de plantas, tarjetas y traducciones (i18n).
 */
import {
  t,
  tStation,
  tBusiness,
  setLocale,
  getLocale,
  detectLocale,
  onLocaleChange,
  LOCALES,
} from '../i18n/index.js';
import { PLANTS } from '../data/plants.js';

const BUSINESS_COLORS = {
  aggregates: '#9a8b7a',
  cement: '#ff4412',
  concrete: '#1963ff',
  asphalt: '#3d3d44',
  roofing: '#b5654a',
  logistics: '#2f9a8c',
};

/** Nombres de cada negocio en TODOS los idiomas (para buscar en cualquier lengua). */
const BUSINESS_ALIASES = (() => {
  const map = {};
  for (const key of Object.keys(BUSINESS_COLORS)) {
    const names = new Set();
    for (const info of Object.values(LOCALES)) {
      names.add(info.file.biz?.[key]?.name ?? '');
      names.add(info.file.biz?.[key]?.tagline ?? '');
    }
    map[key] = [...names].filter(Boolean);
  }
  return map;
})();

/** Nombres sugeridos para el jugador. */
const NAME_POOL = [
  'Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Taylor', 'Morgan', 'Avery',
  'Nico', 'Luna', 'Dani', 'Kai', 'Robin', 'Jamie', 'Noa', 'Valen',
];

function randomName() {
  return NAME_POOL[Math.floor(Math.random() * NAME_POOL.length)];
}

export class UI {
  constructor() {
    this.startScreen = document.getElementById('start-screen');
    this.hud = document.getElementById('hud');
    this.infoCard = document.getElementById('info-card');
    this.plantCard = document.getElementById('plant-card');
    this.prompt = document.getElementById('interact-prompt');
    this.playerName = document.getElementById('player-name');
    this.rankLabel = document.getElementById('player-rank');
    this.stampsContainer = document.querySelector('.stamps');
    this.toast = document.getElementById('toast');
    this.backButton = document.getElementById('back-to-map');
    this.mapStats = document.getElementById('map-stats');
    this.nameInput = document.getElementById('player-name-input');
    this.nameRandom = document.getElementById('name-random');
    this.objectiveTitle = document.getElementById('objective-title');
    this.objectiveText = document.getElementById('objective-text');

    // Buscador
    this.searchPanel = document.getElementById('search-panel');
    this.searchInput = document.getElementById('search-input');
    this.searchClear = document.getElementById('search-clear');
    this.filterChips = document.getElementById('filter-chips');
    this.searchResults = document.getElementById('search-results');

    this.onStart = () => {};
    this.onGenderChange = () => {};
    this.onVisitPlant = () => {};
    this.onBackToMap = () => {};
    this.onSearchSelect = () => {};
    this.onFilterChange = () => {};

    this._toastTimer = null;
    this.activeFilter = 'all';
    this.searchQuery = '';

    this.buildStamps();
    this.buildLangPicker();
    this.buildFilters();
    this.buildStats();
    this.bindEvents();

    // Idioma inicial (guardado o detectado del navegador)
    setLocale(detectLocale());
    this.applyTranslations();
    onLocaleChange(() => this.applyTranslations());
  }

  // ---------------------------------------------------------------
  // Construcción
  // ---------------------------------------------------------------
  buildStamps() {
    this.stampsContainer.innerHTML = '';
    this.stampElements = {};
    for (const key of Object.keys(BUSINESS_COLORS)) {
      const biz = tBusiness(key);
      const el = document.createElement('span');
      el.className = 'stamp empty';
      el.title = biz.name;
      el.textContent = biz.icon;
      this.stampsContainer.appendChild(el);
      this.stampElements[key] = el;
    }
  }

  buildLangPicker() {
    this.langPickers = [
      { el: document.getElementById('lang-picker'), compact: false },
      { el: document.getElementById('lang-picker-hud'), compact: true },
    ].filter((p) => p.el);

    for (const { el: picker, compact } of this.langPickers) {
      picker.innerHTML = '';
      for (const [code, info] of Object.entries(LOCALES)) {
        const btn = document.createElement('button');
        btn.className = 'lang-btn';
        btn.dataset.locale = code;
        btn.textContent = compact ? info.flag : `${info.flag} ${info.name}`;
        btn.title = info.name;
        btn.setAttribute('aria-label', info.name);
        btn.addEventListener('click', () => {
          setLocale(code);
          this.applyTranslations();
        });
        picker.appendChild(btn);
      }
    }
    this.updateLangPicker();
  }

  updateLangPicker() {
    document.querySelectorAll('.lang-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.locale === getLocale());
    });
    document.documentElement.lang = getLocale();
  }

  /** Chips de filtro por tipo de planta. */
  buildFilters() {
    this.filterChips.innerHTML = '';
    const mk = (key, label, icon) => {
      const btn = document.createElement('button');
      btn.className = 'chip' + (key === 'all' ? ' active' : '');
      btn.dataset.filter = key;
      btn.innerHTML = `${icon} ${label}`;
      btn.addEventListener('click', () => {
        this.activeFilter = key;
        this.filterChips.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
        btn.classList.add('active');
        this.renderResults();
        this.onFilterChange(this.matchingIds());
      });
      this.filterChips.appendChild(btn);
    };

    mk('all', t('ui.search.all'), '🌎');
    for (const key of Object.keys(BUSINESS_COLORS)) {
      const biz = tBusiness(key);
      mk(key, biz.name, biz.icon);
    }
  }

  buildStats() {
    const el = document.getElementById('stats-text');
    if (!el) return;
    const regions = new Set(PLANTS.map((p) => `${p.country}-${p.state}`)).size;
    el.textContent = `${PLANTS.length} plantas · ${regions} estados y provincias · 2 países`;
  }

  // ---------------------------------------------------------------
  // Eventos
  // ---------------------------------------------------------------
  bindEvents() {
    document.querySelectorAll('.char-option').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.char-option').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.onGenderChange(btn.dataset.gender);
      });
    });

    document.getElementById('start-btn').addEventListener('click', () => {
      const selected = document.querySelector('.char-option.selected');
      this.onStart(selected?.dataset.gender || 'male', this.playerNameValue);
    });

    // Nombre del personaje
    this.nameInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('start-btn').click();
      }
    });
    this.nameRandom?.addEventListener('click', () => {
      this.nameInput.value = randomName();
      this.nameInput.focus();
    });

    document.getElementById('info-close').addEventListener('click', () => this.hideInfo());
    document.getElementById('info-next').addEventListener('click', () => this.hideInfo());
    document.getElementById('plant-close').addEventListener('click', () => this.hidePlantCard());

    document.getElementById('visit-btn').addEventListener('click', () => {
      if (this.selectedPlant) {
        this.onVisitPlant(this.selectedPlant);
        this.hidePlantCard();
      }
    });

    this.backButton?.addEventListener('click', () => this.onBackToMap());

    // --- Buscador ---
    this.searchInput?.addEventListener('input', () => {
      this.searchQuery = this.searchInput.value.trim().toLowerCase();
      this.searchClear.classList.toggle('hidden', !this.searchQuery);
      this.renderResults();
      this.onFilterChange(this.matchingIds());
    });

    this.searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.searchInput.value = '';
        this.searchQuery = '';
        this.searchClear.classList.add('hidden');
        this.renderResults();
        this.onFilterChange(this.matchingIds());
      }
      if (e.key === 'Enter') {
        const first = this.searchResults.querySelector('.result-item');
        if (first) first.click();
      }
    });

    this.searchClear?.addEventListener('click', () => {
      this.searchInput.value = '';
      this.searchQuery = '';
      this.searchClear.classList.add('hidden');
      this.renderResults();
      this.onFilterChange(this.matchingIds());
    });

    document.addEventListener('click', (e) => {
      if (!this.searchPanel?.contains(e.target)) this.hideResults();
    });
  }

  // ---------------------------------------------------------------
  // Buscador
  // ---------------------------------------------------------------
  /** Plantas que coinciden con el texto y el filtro activos. */
  matchingPlants() {
    return PLANTS.filter((p) => {
      if (this.activeFilter !== 'all' && p.business !== this.activeFilter) return false;
      if (!this.searchQuery) return true;
      const haystack = [
        p.name,
        p.site,
        p.locality,
        p.state,
        p.region,
        p.brand,
        p.business,
        tBusiness(p.business).name,
        // Nombres del negocio en todos los idiomas: se puede buscar
        // "cemento" aunque el juego esté en inglés
        ...(BUSINESS_ALIASES[p.business] ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(this.searchQuery);
    });
  }

  matchingIds() {
    return new Set(this.matchingPlants().map((p) => p.id));
  }

  /** Dibuja la lista de resultados. */
  renderResults() {
    const matches = this.matchingPlants();
    this.searchResults.innerHTML = '';

    if (!this.searchQuery && this.activeFilter === 'all') {
      this.searchResults.classList.add('hidden');
      return;
    }

    this.searchResults.classList.remove('hidden');

    if (!matches.length) {
      const empty = document.createElement('div');
      empty.className = 'result-empty';
      empty.textContent = `🔍 ${t('ui.search.noResults')}`;
      this.searchResults.appendChild(empty);
      return;
    }

    matches.slice(0, 12).forEach((plant) => {
      const biz = tBusiness(plant.business);
      const item = document.createElement('button');
      item.className = 'result-item';
      item.innerHTML = `
        <span class="result-icon" style="background:${BUSINESS_COLORS[plant.business]}"></span>
        <span class="result-text">
          <strong>${plant.name}</strong>
          <small>${biz.name} · ${plant.state} · ${plant.country === 'CA' ? '🇨🇦' : '🇺🇸'}</small>
        </span>
        <span class="result-go">→</span>
      `;
      item.addEventListener('click', () => {
        this.onSearchSelect(plant);
        this.hideResults();
      });
      this.searchResults.appendChild(item);
    });

    if (matches.length > 12) {
      const more = document.createElement('div');
      more.className = 'result-empty';
      more.textContent = `+${matches.length - 12} ${t('ui.search.results')}`;
      this.searchResults.appendChild(more);
    }
  }

  hideResults() {
    this.searchResults?.classList.add('hidden');
  }

  /** Rellena el placeholder del buscador con el idioma actual. */
  refreshSearchPlaceholder() {
    if (this.searchInput) this.searchInput.placeholder = t('ui.search.placeholder');
  }

  // ---------------------------------------------------------------
  // Traducciones
  // ---------------------------------------------------------------
  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const value = t(el.dataset.i18n);
      if (value) el.textContent = value;
    });

    // Atributos traducibles (placeholder, title, aria-label…)
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const value = t(el.dataset.i18nPlaceholder);
      if (value) el.placeholder = value;
    });

    // Elementos con traducción parcial
    const gameTitle = document.querySelector('[data-i18n="game.title"]');
    if (gameTitle && getLocale() !== 'es') {
      gameTitle.textContent = 'Ruta de Constructores';
    }

    this.buildStamps();
    this.buildFilters();
    this.buildStats();
    this.updateLangPicker();
    this.refreshSearchPlaceholder();
    this.setMode(this.mode || 'map');
    if (this._currentGender) this.setPlayer(this._currentGender, this._currentRank, this._customName);
    // Las tarjetas abiertas y el letrero también cambian de idioma
    this.refreshDynamicContent();
  }

  // ---------------------------------------------------------------
  // Modos
  // ---------------------------------------------------------------
  showStartScreen() {
    this.startScreen.classList.remove('hidden');
    this.hud.classList.add('hidden');
  }

  showGame() {
    this.startScreen.classList.add('hidden');
    this.hud.classList.remove('hidden');
  }

  /** Modo mapa: muestra estadísticas y búsqueda; oculta el botón de volver. */
  setMode(mode) {
    this.mode = mode;
    const isMap = mode === 'map';
    this.mapStats?.classList.toggle('hidden', !isMap);
    this.searchPanel?.classList.toggle('hidden', !isMap);
    this.backButton?.classList.toggle('hidden', isMap);

    if (isMap) {
      this.objectiveTitle.innerHTML = `🗺️ ${t('ui.hud.selectDest')}`;
      this.objectiveText.innerHTML = `${t('ui.hud.selectDest')} · <kbd>E</kbd>`;
    } else {
      this.objectiveTitle.innerHTML = `🎯 ${t('ui.hud.objective')}`;
      this.objectiveText.innerHTML = t('ui.hud.approach');
    }
  }

  /** Nombre personalizado del jugador (vacío = usar el nombre por defecto). */
  get playerNameValue() {
    return this.nameInput?.value.trim() ?? '';
  }

  setPlayer(gender, rank, customName = this._customName) {
    this._currentGender = gender;
    this._currentRank = rank;
    this._customName = customName;

    const role = gender === 'male' ? t('ui.start.male') : t('ui.start.female');
    const fallback = gender === 'male' ? t('ui.start.maleName') : t('ui.start.femaleName');

    this.playerName.textContent = customName ? `${customName} · ${role}` : `${role} ${fallback}`;
    this.rankLabel.textContent = rank;
  }

  unlockStamp(businessKey) {
    const el = this.stampElements?.[businessKey];
    if (el) {
      el.classList.remove('empty');
      el.classList.add('unlocked');
    }
  }

  syncProgress(state) {
    state.stamps.forEach((k) => this.unlockStamp(k));
    this.setPlayer(state.gender, state.rank, state.playerName);
    if (state.playerName && this.nameInput) this.nameInput.value = state.playerName;
  }

  // ---------------------------------------------------------------
  // Letrero y tarjetas
  // ---------------------------------------------------------------
  showPrompt(stationId) {
    this.currentStationId = stationId;
    this.updatePromptText();
    this.prompt.classList.remove('hidden');
  }

  /** Actualiza solo el texto del letrero (sin mostrarlo). */
  updatePromptText() {
    if (!this.currentStationId) return;
    const info = tStation(this.currentStationId);
    this.prompt.innerHTML = `<kbd>E</kbd> ${t('ui.prompt.inspect')} <strong>${info.icon} ${info.title}</strong>`;
  }

  hidePrompt() {
    this.prompt.classList.add('hidden');
  }

  /**
   * Tarjeta educativa de una estación.
   * @param {string} stationId  clave i18n de la estación
   */
  showInfo(stationId) {
    this.currentStationId = stationId;
    const info = tStation(stationId);
    document.getElementById('info-icon').textContent = info.icon;
    document.getElementById('info-title').textContent = info.title;
    document.getElementById('info-text').textContent = info.text;
    document.querySelector('#info-fact span').textContent = info.fact;
    this.infoCard.classList.remove('hidden');
  }

  hideInfo() {
    this.infoCard.classList.add('hidden');
    this.currentStationId = null;
  }

  get isInfoOpen() {
    return !this.infoCard.classList.contains('hidden');
  }

  /** Tarjeta de planta en el mapa. */
  showPlantCard(plant, businessKey) {
    this.selectedPlant = plant;
    this.selectedBusiness = typeof businessKey === 'string' ? businessKey : businessKey?.key;
    const business = this.selectedBusiness ? tBusiness(this.selectedBusiness) : null;

    document.getElementById('plant-badge').textContent = business?.icon ?? '📍';
    document.getElementById('plant-name').textContent = plant.name;
    document.getElementById('plant-site').textContent = plant.site ?? plant.name;

    document.getElementById('plant-details').innerHTML = `
      <div><b>📍 ${t('ui.card.address')}</b><span>${plant.address || plant.locality}</span></div>
      <div><b>🗺️ ${t('ui.card.region')}</b><span>${plant.region}</span></div>
      <div><b>🏭 ${t('ui.card.activity')}</b><span>${plant.activity}</span></div>
      <div><b>🏷️ ${t('ui.card.brand')}</b><span>${plant.brand || 'Amrize'}</span></div>
      <div><b>🧭 ${t('ui.card.coords')}</b><span>${plant.lat.toFixed(2)}°, ${plant.lng.toFixed(2)}°</span></div>
    `;

    const tags = document.getElementById('plant-tags');
    tags.innerHTML = '';
    [business?.name, plant.state, plant.country === 'CA' ? 'Canadá 🇨🇦' : 'EE.UU. 🇺🇸']
      .filter(Boolean)
      .forEach((txt) => {
        const s = document.createElement('span');
        s.textContent = txt;
        tags.appendChild(s);
      });

    this.plantCard.classList.remove('hidden');
  }

  hidePlantCard() {
    this.plantCard.classList.add('hidden');
  }

  get isPlantCardOpen() {
    return !this.plantCard.classList.contains('hidden');
  }

  /**
   * Re-renderiza TODO el contenido dinámico tras un cambio de idioma.
   * Sin esto, las tarjetas abiertas quedarían en el idioma anterior.
   */
  refreshDynamicContent() {
    // Tarjeta educativa abierta
    if (this.isInfoOpen && this.currentStationId) {
      this.showInfo(this.currentStationId);
    }

    // Tarjeta de planta abierta
    if (this.isPlantCardOpen && this.selectedPlant) {
      this.showPlantCard(this.selectedPlant, this.selectedBusiness);
    }

    // Letrero de proximidad (aunque esté oculto, se actualiza su texto)
    if (this.currentStationId) {
      this.updatePromptText();
    }

    // Resultados del buscador
    if (!this.searchResults.classList.contains('hidden')) {
      this.renderResults();
    }
  }

  /** Notificación flotante. */
  showToast(message, icon = '🏅') {
    if (!this.toast) return;
    this.toast.innerHTML = `${icon} ${message}`;
    this.toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => this.toast.classList.remove('show'), 3200);
  }
}
