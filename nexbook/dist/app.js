'use strict';

(() => {
  const BASE_CFG = JSON.parse(JSON.stringify(window.STORE_CONFIG || {}));
  const BASE_PRODUCTS = JSON.parse(JSON.stringify(products || []));
  const CFG = window.STORE_CONFIG || {};

  function getRefs() {
    return {
      BRAND: CFG.brand || (CFG.brand = {}),
      CONTACT: CFG.contact || (CFG.contact = {}),
      CURRENCY: CFG.currency || (CFG.currency = { label: 'so‘m', position: 'after', thousandSep: ' ' }),
      INSTALLMENT: CFG.installment || (CFG.installment = { enabled: false, months: [3, 6, 12], defaultMonths: 12, markupPercent: {} }),
      FEATURES: CFG.features || (CFG.features = { compare: true, maxCompare: 3, autoplaySlidesMs: 6500, maxCartQty: 99, introAnimation: true }),
      ADMIN: CFG.admin || (CFG.admin = { enabled: true, pin: '1234', showFooterLink: true }),
      UI: CFG.ui || (CFG.ui = {}),
      SLIDES: Array.isArray(CFG.slides) && CFG.slides.length ? CFG.slides : [],
      PROMOS: CFG.promoCodes || (CFG.promoCodes = {}),
      DELIVERY: Array.isArray(CFG.deliveryOptions) && CFG.deliveryOptions.length
        ? CFG.deliveryOptions
        : [{ id: 'pickup', label: 'Do‘kondan olib ketish', note: '', price: 0, requiresAddress: false }],
      PAYMENTS: Array.isArray(CFG.paymentMethods) && CFG.paymentMethods.length
        ? CFG.paymentMethods
        : ['Naqd pul']
    };
  }

  let { BRAND, CONTACT, CURRENCY, INSTALLMENT, FEATURES, ADMIN, UI, SLIDES, PROMOS, DELIVERY, PAYMENTS } = getRefs();
  const baseStorageKey = BRAND.storageKey || 'nexbook-store-v2';
  const adminStorageKey = `${baseStorageKey}-admin-overrides`;
  const adminSessionKey = `${baseStorageKey}-admin-auth`;

  const paths = {
    search: '<circle cx="10.5" cy="10.5" r="6.6"/><path d="m16 16 4.7 4.7"/>',
    heart: '<path d="M20.5 5.7c-2.1-2.2-5.8-2.1-8.5 1C9.3 3.6 5.6 3.5 3.5 5.7c-2.3 2.5-1.8 6 .3 8.3L12 21l8.2-7c2.1-2.3 2.6-5.8.3-8.3Z"/>',
    bag: '<path d="M4.5 8h15l1 13h-17l1-13Z"/><path d="M8.5 9V6a3.5 3.5 0 0 1 7 0v3"/>',
    bagPlus: '<path d="M4.5 8h15l1 13h-17l1-13Z"/><path d="M8.5 9V6a3.5 3.5 0 0 1 7 0v3M9 15h6m-3-3v6"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.3"/><rect x="14" y="3" width="7" height="7" rx="1.3"/><rect x="3" y="14" width="7" height="7" rx="1.3"/><rect x="14" y="14" width="7" height="7" rx="1.3"/>',
    gamepad: '<path d="M7 7h10c2 0 3 1.3 3.6 4.3l1 5C22.2 20 19 20 17 17l-1-1.5H8L7 17c-2 3-5.2 3-4.6-.7l1-5C4 8.3 5 7 7 7Z"/><path d="M6 11.5h4m-2-2v4m8-2.5h.01m2 2h.01"/>',
    briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12c5 3 13 3 18 0m-9 0v3"/>',
    cap: '<path d="m2 9 10-5 10 5-10 5L2 9Zm4 3v5c4 3 8 3 12 0v-5m4-3v7"/>',
    pen: '<path d="m13 5 6 6-7 8-9 2 2-9 8-7Zm0 0 3-3 6 6-3 3M4 20l6-6"/><circle cx="11" cy="13" r="1.5"/>',
    sliders: '<path d="M3 6h8m5 0h5M3 12h2m5 0h11M3 18h10m5 0h3"/><circle cx="13.5" cy="6" r="2.1"/><circle cx="7.5" cy="12" r="2.1"/><circle cx="15.5" cy="18" r="2.1"/>',
    sort: '<path d="M4 5h16M4 12h11M4 19h6"/>',
    left: '<path d="m14.5 5-7 7 7 7"/>',
    right: '<path d="m9.5 5 7 7-7 7"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    up: '<path d="m18 15-6-6-6 6"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6" rx=".5"/><path d="M9 3v3m6-3v3M9 18v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3"/>',
    ram: '<path d="M2 6h20v11H2zM5 17v2m4-2v2m6-2v2m4-2v2M6 9v4m4-4v4m4-4v4m4-4v4"/>',
    disk: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 14h18m-4 2.5h1"/>',
    screen: '<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
    gpu: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="9.5" cy="12" r="2.5"/><path d="M15 9.5h3m-3 5h3"/>',
    x: '<path d="m6 6 12 12m0-12L6 18"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    trash: '<path d="M3 6h18m-15 0 1 15h10l1-15M9 6V3h6v3m-5 4v7m4-7v7"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.5 10.5 7-4m-7 7 7 4"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    compare: '<path d="M8 7h12m0 0-3-3m3 3-3 3M16 17H4m0 0 3-3m-3 3 3 3"/>',
    shield: '<path d="M12 3 4 6.5v5.3c0 5 3.4 8.7 8 10.2 4.6-1.5 8-5.2 8-10.2V6.5L12 3Z"/><path d="m9 12 2 2 4-4"/>',
    truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
    percent: '<circle cx="7.5" cy="7.5" r="2"/><circle cx="16.5" cy="16.5" r="2"/><path d="M18 6 6 18"/>',
    chat: '<path d="M4 5h16v11H8l-4 4V5Z"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C9.8 21 3 14.2 3 6a2 2 0 0 1 2-2Z"/>',
    send: '<path d="m21 3-9.5 18-3-7-7-3L21 3Z"/><path d="M21 3 11.5 14"/>',
    pin: '<path d="M12 21s6-5.4 6-10.5a6 6 0 1 0-12 0C6 15.6 12 21 12 21Z"/><circle cx="12" cy="10.5" r="2.2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    receipt: '<path d="M6 3h12v18l-2.5-1.6L13 21l-2.5-1.6L8 21l-2-1.6V3Z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="m14 4 6 6-11 11H3v-6L14 4Z"/>',
    chart: '<path d="M4 20h16M7 16v-5m5 5V7m5 9v-8"/>',
    box: '<path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>'
  };

  const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.grid}</svg>`;
  const $ = selector => document.querySelector(selector);
  const esc = val => String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  let productById = new Map();
  let brands = [];
  const filterSpec = (typeof specFields !== 'undefined' ? specFields : []).find(f => f.filterable);
  let storageKey = BRAND.storageKey || 'nexbook-store-v2';

  function rebuildCatalogIndex() {
    productById = new Map(products.map(p => [p.id, p]));
    brands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  function applyAdminOverrides() {
    try {
      const ov = JSON.parse(localStorage.getItem(adminStorageKey) || 'null');
      if (!ov) return;
      if (ov.config) {
        if (ov.config.brand) Object.assign(CFG.brand, ov.config.brand);
        if (ov.config.contact) Object.assign(CFG.contact, ov.config.contact);
        if (ov.config.currency) Object.assign(CFG.currency, ov.config.currency);
        if (ov.config.installment) Object.assign(CFG.installment, ov.config.installment);
        if (ov.config.promoCodes) CFG.promoCodes = ov.config.promoCodes;
        if (ov.config.admin) Object.assign(CFG.admin, ov.config.admin);
      }
      if (Array.isArray(ov.products)) {
        products.length = 0;
        products.push(...ov.products);
      }
      ({ BRAND, CONTACT, CURRENCY, INSTALLMENT, FEATURES, ADMIN, UI, SLIDES, PROMOS, DELIVERY, PAYMENTS } = getRefs());
      storageKey = BRAND.storageKey || 'nexbook-store-v2';
    } catch {
      /* Ignore corrupted override cache. */
    }
  }

  function saveAdminOverrides(patch) {
    try {
      const current = JSON.parse(localStorage.getItem(adminStorageKey) || '{}');
      const next = { ...current, ...patch };
      localStorage.setItem(adminStorageKey, JSON.stringify(next));
      return true;
    } catch {
      notify('Brauzer xotirasi to‘lgan: rasm hajmini kichikroq tanlang');
      return false;
    }
  }

  function formatNumber(amount) {
    const sep = CURRENCY.thousandSep ?? ' ';
    return String(Math.round(Number(amount) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  }

  function formatMoney(amount, withUnit = true) {
    const num = formatNumber(amount);
    if (!withUnit) return num;
    const label = CURRENCY.label || 'so‘m';
    return CURRENCY.position === 'before' ? `${label}${num}` : `${num} ${label}`;
  }

  function moneyHtml(amount) {
    const num = esc(formatNumber(amount));
    const unit = esc(CURRENCY.label || 'so‘m');
    return CURRENCY.position === 'before'
      ? `${unit}${num}`
      : `${num} <small>${unit}</small>`;
  }

  function calcInstallment(price, months) {
    const pct = Number(INSTALLMENT.markupPercent?.[months] ?? 0);
    const total = price * (1 + pct / 100);
    const rawMonthly = total / months;
    const monthly = rawMonthly >= 10000
      ? Math.round(rawMonthly / 1000) * 1000
      : Math.round(rawMonthly);
    return { monthly, total: Math.round(total), pct };
  }

  function parseHexRgb(hex) {
    const clean = String(hex || '').replace('#', '').trim();
    const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
    if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
    const n = parseInt(full, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function hydrateBusinessConfig() {
    if (BRAND.siteTitle) document.title = BRAND.siteTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && BRAND.description) metaDesc.setAttribute('content', BRAND.description);

    if (BRAND.accentColor) {
      const rgb = parseHexRgb(BRAND.accentColor);
      if (rgb) {
        const root = document.documentElement.style;
        root.setProperty('--lime', BRAND.accentColor);
        root.setProperty('--lime-rgb', rgb.join(', '));
        const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
        root.setProperty('--lime-ink', luminance > 0.55 ? '#151e0b' : '#f7f9f5');
      }
    }

    if (FEATURES.autoplaySlidesMs) {
      document.documentElement.style.setProperty('--hero-progress-ms', `${FEATURES.autoplaySlidesMs}ms`);
    }

    const brandName = BRAND.name || 'NEXBOOK';
    $('#brand-name').textContent = brandName;
    $('#footer-brand-name').textContent = brandName;
    const introName = $('#intro-name');
    const introLogo = $('#intro-logo');
    const introSub = $('#intro-sub');
    if (introName) introName.textContent = brandName;
    if (introSub) introSub.textContent = BRAND.siteTitle || brandName;

    if (BRAND.logoMark) {
      $('#brand-logo').src = BRAND.logoMark;
      $('#footer-logo').src = BRAND.logoMark;
      if (introLogo) introLogo.src = BRAND.logoMark;
    }
    if (BRAND.tagline) $('#footer-tagline').textContent = BRAND.tagline;
    if (BRAND.footerNote) $('#footer-note').textContent = BRAND.footerNote;
    if (BRAND.copyright) $('#footer-copyright').textContent = BRAND.copyright;
    if (UI.catalogTitle) $('#catalog-heading').textContent = UI.catalogTitle;

    const adminFooterBtn = $('#footer-admin-btn');
    if (adminFooterBtn) {
      adminFooterBtn.hidden = ADMIN.enabled === false || ADMIN.showFooterLink === false;
    }

    const benefitsEl = $('#benefits');
    if (benefitsEl && Array.isArray(CFG.benefits) && CFG.benefits.length) {
      benefitsEl.innerHTML = CFG.benefits.map(b => `
        <article class="benefit-card">
          <div class="benefit-icon">${icon(b.icon || 'shield')}</div>
          <div>
            <h3>${esc(b.title)}</h3>
            <p>${esc(b.desc)}</p>
          </div>
        </article>
      `).join('');
    } else if (benefitsEl) {
      benefitsEl.hidden = true;
    }

    const metaItems = [];
    if (CONTACT.address) metaItems.push(`<span>${icon('pin')}${esc(CONTACT.address)}</span>`);
    if (CONTACT.hours) metaItems.push(`<span>${icon('clock')}${esc(CONTACT.hours)}</span>`);
    if (CONTACT.deliverySummary) metaItems.push(`<span>${icon('truck')}${esc(CONTACT.deliverySummary)}</span>`);
    if (CONTACT.warrantySummary) metaItems.push(`<span>${icon('shield')}${esc(CONTACT.warrantySummary)}</span>`);
    $('#contact-meta').innerHTML = metaItems.join('');

    const actionBtns = [];
    if (CONTACT.phone) {
      const href = CONTACT.phoneHref || `tel:${CONTACT.phone.replace(/\s+/g, '')}`;
      actionBtns.push(`<a class="secondary" href="${esc(href)}">${icon('phone')}${esc(CONTACT.phone)}</a>`);
    }
    if (CONTACT.telegram) {
      actionBtns.push(`<a class="secondary" href="https://t.me/${encodeURIComponent(CONTACT.telegram)}" target="_blank" rel="noopener noreferrer">${icon('send')}Telegram</a>`);
    }
    actionBtns.push(`<button type="button" class="primary" data-action="consult">${icon('chat')}Bepul maslahat olish</button>`);
    $('#contact-actions').innerHTML = actionBtns.join('');
  }

  function runIntro() {
    const splash = $('#intro-splash');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finish = () => {
      if (splash) splash.classList.add('done');
      document.body.classList.remove('intro-animating');
      document.body.classList.add('intro-ready');
      setTimeout(() => splash?.remove(), 520);
    };
    if (!splash || FEATURES.introAnimation === false || reduced) {
      finish();
      return;
    }
    setTimeout(finish, 640);
  }

  function initReveal() {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach(el => el.classList.add('revealed'));
      return;
    }
    document.documentElement.classList.add('has-reveal');
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });
    targets.forEach(el => revealObs.observe(el));
  }

  function getDefaultVariantId(product) {
    if (!Array.isArray(product.variants) || !product.variants.length) return '';
    const exact = product.variants.find(v => v.price === product.price);
    return (exact || product.variants[0]).id;
  }

  function resolveProduct(product, variantId = '') {
    if (!product) return null;
    const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
    const chosen = hasVariants
      ? (product.variants.find(v => v.id === variantId) || product.variants.find(v => v.id === getDefaultVariantId(product)) || product.variants[0])
      : null;
    const merged = chosen ? { ...product, ...chosen, id: product.id, name: product.name } : product;
    const key = chosen ? `${product.id}::${chosen.id}` : product.id;
    return {
      product,
      variant: chosen,
      variantId: chosen ? chosen.id : '',
      variantLabel: chosen ? chosen.label : '',
      key,
      price: merged.price,
      old: merged.old,
      merged
    };
  }

  function parseCartKey(key) {
    const idx = key.indexOf('::');
    if (idx === -1) return { productId: key, variantId: '' };
    return { productId: key.slice(0, idx), variantId: key.slice(idx + 2) };
  }

  const cleanFilters = { brand: '', ceiling: 0, specMin: 0, sale: false, stock: false };
  let filters = { ...cleanFilters };
  let category = 'all';
  let sortOrder = 'recommended';
  let cart = {};
  let favorites = new Set();
  let compareIds = [];
  let orders = [];
  let leads = [];
  let appliedPromo = '';
  let lastOrder = null;
  let slideIndex = 0;
  let slideTimer = null;
  let toastTimer = null;
  let panelName = '';
  let detailOrigin = '';
  let detailState = { id: '', variantId: '', months: INSTALLMENT.defaultMonths || 12 };
  let checkoutState = { deliveryId: DELIVERY[0].id, payment: PAYMENTS[0] };
  let searchText = '';
  let programmaticScrollUntil = 0;

  let adminTab = 'analytics';
  let adminEditingId = null;
  let adminProductDraftImg = '';
  let warehouseFilter = 'all';
  let warehouseQuery = '';

  function getStockQty(p) {
    if (!p) return 0;
    if (typeof p.stockQty === 'number' && Number.isFinite(p.stockQty)) return Math.max(0, p.stockQty);
    return p.inStock === false ? 0 : 10;
  }

  function syncProductStock(p, qty) {
    if (!p) return;
    p.stockQty = Math.max(0, Math.round(Number(qty) || 0));
    p.inStock = p.stockQty > 0;
  }

  function adjustOrderInventory(order, shouldDeduct) {
    if (!order || !Array.isArray(order.items)) return;
    if (shouldDeduct && order.stockDeducted) return;
    if (!shouldDeduct && !order.stockDeducted) return;
    let changed = false;
    order.items.forEach(item => {
      const p = productById.get(item.id);
      if (!p) return;
      const cur = getStockQty(p);
      const next = shouldDeduct ? Math.max(0, cur - Number(item.qty || 0)) : cur + Number(item.qty || 0);
      syncProductStock(p, next);
      changed = true;
    });
    order.stockDeducted = Boolean(shouldDeduct);
    if (changed) {
      saveAdminOverrides({ products });
      renderCatalog();
    }
  }

  function isAdminUnlocked() {
    try { return sessionStorage.getItem(adminSessionKey) === '1'; } catch { return false; }
  }

  function restore() {
    try {
      const state = JSON.parse(localStorage.getItem(storageKey) || '{}');
      favorites = new Set((Array.isArray(state?.favorites) ? state.favorites : []).filter(id => productById.has(id)));
      const maxQty = FEATURES.maxCartQty || 99;
      const cleanCart = {};
      for (const [rawKey, qty] of Object.entries(state?.cart || {})) {
        const { productId, variantId } = parseCartKey(rawKey);
        const p = productById.get(productId);
        if (!p || p.inStock === false || !Number.isInteger(qty) || qty <= 0) continue;
        const resolved = resolveProduct(p, variantId);
        cleanCart[resolved.key] = Math.min(maxQty, (cleanCart[resolved.key] || 0) + qty);
      }
      cart = cleanCart;
      const maxCmp = FEATURES.maxCompare || 3;
      compareIds = (Array.isArray(state?.compareIds) ? state.compareIds : [])
        .filter((id, idx, arr) => productById.has(id) && arr.indexOf(id) === idx)
        .slice(0, maxCmp);
      orders = Array.isArray(state?.orders) ? state.orders.slice(0, 30) : [];
      leads = Array.isArray(state?.leads) ? state.leads.slice(0, 30) : [];
      appliedPromo = typeof state?.promo === 'string' && PROMOS[state.promo] ? state.promo : '';
    } catch {
      cart = {};
      favorites = new Set();
      compareIds = [];
      orders = [];
      leads = [];
      appliedPromo = '';
    }
  }

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        favorites: [...favorites],
        cart,
        compareIds,
        orders,
        leads,
        promo: appliedPromo
      }));
    } catch {
      /* Local storage may be restricted; session state remains active. */
    }
    updateCounts();
  }

  function productCartQty(productId) {
    let total = 0;
    for (const [key, qty] of Object.entries(cart)) {
      if (parseCartKey(key).productId === productId) total += qty;
    }
    return total;
  }

  function updateCounts() {
    const total = Object.values(cart).reduce((n, qty) => n + qty, 0);
    $('#cart-count').textContent = total;
    $('.cart-tool').setAttribute('aria-label', `Savatcha, ${total} ta mahsulot`);
    $('#fav-dot').hidden = !favorites.size;
    $('#orders-dot').hidden = !orders.length;

    const cmpBar = $('#compare-bar');
    if (FEATURES.compare && compareIds.length > 0) {
      cmpBar.hidden = false;
      $('#compare-bar-text').textContent = `Taqqoslash: ${compareIds.length} ta model tanlandi`;
    } else {
      cmpBar.hidden = true;
    }

    document.querySelectorAll('[data-add]').forEach(btn => {
      const id = btn.dataset.add;
      const inCart = productCartQty(id);
      if (btn.classList.contains('add-cart')) {
        btn.classList.toggle('in-cart', inCart > 0);
        btn.innerHTML = inCart > 0 ? `${icon('bagPlus')}<span>${inCart}</span>` : icon('bagPlus');
      }
    });
  }

  function bumpCartBadge() {
    const tool = $('.cart-tool');
    tool.classList.remove('bump');
    void tool.offsetWidth;
    tool.classList.add('bump');
  }

  function notify(message) {
    clearTimeout(toastTimer);
    const toast = $('#toast');
    (document.querySelector('dialog[open]') || document.body).append(toast);
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
  }

  function stopAutoSlide() {
    clearTimeout(slideTimer);
    slideTimer = null;
  }

  function scheduleAutoSlide() {
    stopAutoSlide();
    const ms = Number(FEATURES.autoplaySlidesMs || 0);
    if (!ms || SLIDES.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    slideTimer = setTimeout(() => {
      if (!panel.open && !$('.hero')?.matches(':hover')) {
        chooseSlide(slideIndex + 1, true);
      } else {
        scheduleAutoSlide();
      }
    }, ms);
  }

  function chooseSlide(index, animate = true) {
    if (!SLIDES.length) return;
    slideIndex = (index + SLIDES.length) % SLIDES.length;
    const slide = SLIDES[slideIndex];
    $('#hero-label').textContent = (slide.label || '').toLocaleUpperCase('uz');
    $('#hero-title').innerHTML = `${esc(slide.title)}<br><em>${esc(slide.accent)}</em>`;
    $('#hero-copy').innerHTML = String(slide.copy || '').split('\n').map(esc).join('<br>');
    $('#hero-cta-text').textContent = slide.cta || 'Katalogni ko‘rish';

    const img = $('#hero-image');
    img.src = slide.image;
    img.alt = slide.alt || slide.title || '';

    const art = $('.hero-art');
    art.classList.toggle('alternate', slideIndex > 0);
    art.classList.toggle('blend-lighten', slide.blend === 'lighten');

    $('#slide-number').textContent = String(slideIndex + 1).padStart(2, '0');
    $('#slide-total').textContent = String(SLIDES.length).padStart(2, '0');
    $('#slide-tabs').innerHTML = SLIDES.map((s, i) =>
      `<button type="button" data-slide="${i}" aria-label="${esc(s.label)}" aria-pressed="${i === slideIndex}"></button>`
    ).join('');

    if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const content = $('#hero-content');
      content.classList.remove('animating');
      void content.offsetWidth;
      content.classList.add('animating');
      art.getAnimations().forEach(a => {
        if (a.id === 'slideArt') a.cancel();
      });
      art.animate(
        [{ opacity: 0.25, transform: 'translateX(14px) scale(.985)' }, { opacity: 1, transform: 'translateX(0) scale(1)' }],
        { id: 'slideArt', duration: 360, easing: 'cubic-bezier(.22, 1, .36, 1)' }
      );
    }

    scheduleAutoSlide();
  }

  function categoryName(id) {
    return categories.find(c => c.id === id)?.name || id;
  }

  function priceCeilings() {
    const prices = products.map(p => p.price).filter(n => n > 0).sort((a, b) => a - b);
    if (!prices.length) return [];
    const min = prices[0];
    const max = prices[prices.length - 1];
    const step = max >= 5000000 ? 5000000 : max >= 1000000 ? 1000000 : max >= 500 ? 500 : 100;
    const start = Math.max(step, Math.ceil((min * 1.1) / step) * step);
    const end = Math.ceil(max / step) * step;
    const tiers = [];
    for (let v = start; v <= end && tiers.length < 5; v += step) tiers.push(v);
    if (tiers.length < 2) {
      const mid = Math.ceil(((min + max) / 2) / (step / 2 || 1)) * (step / 2 || 1);
      if (mid > 0 && mid < max) tiers.unshift(mid);
    }
    return tiers;
  }

  function specOptions() {
    if (!filterSpec) return [];
    const vals = new Set();
    products.forEach(p => {
      if (typeof p[filterSpec.key] === 'number') vals.add(p[filterSpec.key]);
      (p.variants || []).forEach(v => {
        if (typeof v[filterSpec.key] === 'number') vals.add(v[filterSpec.key]);
      });
    });
    return [...vals].sort((a, b) => a - b);
  }

  function matchesSpecMin(p, minVal) {
    if (!minVal || !filterSpec) return true;
    const key = filterSpec.key;
    if (Number(p[key] || 0) >= minVal) return true;
    return Array.isArray(p.variants) && p.variants.some(v => Number(v[key] || p[key] || 0) >= minVal);
  }

  function subset() {
    const result = products.filter(p =>
      (category === 'all' || (Array.isArray(p.categories) && p.categories.includes(category))) &&
      (!filters.brand || p.brand === filters.brand) &&
      (!filters.ceiling || p.price <= filters.ceiling) &&
      matchesSpecMin(p, filters.specMin) &&
      (!filters.sale || (p.old && p.old > p.price)) &&
      (!filters.stock || p.inStock !== false)
    );
    if (sortOrder === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortOrder === 'low') result.sort((a, b) => a.price - b.price);
    if (sortOrder === 'high') result.sort((a, b) => b.price - a.price);
    return result;
  }

  function priceBlock(p) {
    const monthly = INSTALLMENT.enabled
      ? calcInstallment(p.price, INSTALLMENT.defaultMonths || 12).monthly
      : 0;
    return `<div>
      <div class="price">${moneyHtml(p.price)}</div>
      ${p.old ? `<del class="old-price">${esc(formatMoney(p.old))}</del>` : ''}
      ${monthly ? `<div class="installment-hint">oyiga ${esc(formatMoney(monthly))} dan</div>` : ''}
    </div>`;
  }

  function getCardSpecs(p) {
    const fields = (typeof specFields !== 'undefined' ? specFields : []).filter(f => f.card).slice(0, 3);
    return fields.map(f => {
      const raw = p[f.key];
      if (raw === undefined || raw === null || raw === '') return '';
      const val = f.format ? f.format(raw) : raw;
      return `<span>${icon(f.icon || 'cpu')}${esc(val)}</span>`;
    }).join('');
  }

  function card(p, index) {
    const saved = favorites.has(p.id);
    const compared = compareIds.includes(p.id);
    const inCart = productCartQty(p.id);
    const out = p.inStock === false;
    const catLabel = Array.isArray(p.categories) && p.categories.length ? categoryName(p.categories[0]) : '';
    const imgSrc = p.image || `assets/${p.id}.webp`;

    return `<article class="product-card" style="--i:${index}">
      <button type="button" class="product-visual tone-${esc(p.tone || 'slate')}" data-detail="${esc(p.id)}" aria-label="${esc(p.brand)} ${esc(p.name)} haqida">
        <img src="${esc(imgSrc)}" alt="${esc(p.brand)} ${esc(p.name)}" loading="lazy" onerror="this.onerror=null;this.src='assets/mark.svg';this.style.maxWidth='34%';this.style.opacity='.45';">
      </button>
      ${p.badge ? `<span class="flag ${p.old ? 'sale' : ''}">${esc(p.badge)}</span>` : ''}
      ${out ? `<span class="flag out">${esc(UI.outOfStockLabel || 'Buyurtma asosida')}</span>` : ''}
      <div class="card-float-actions">
        <button type="button" class="save-product ${saved ? 'saved' : ''}" data-fav="${esc(p.id)}" aria-label="${esc(p.name)} — sevimlilar" title="Sevimlilarga saqlash" aria-pressed="${saved}">${icon('heart')}</button>
        ${FEATURES.compare ? `<button type="button" class="compare-product ${compared ? 'compared' : ''}" data-compare="${esc(p.id)}" aria-label="${esc(p.name)} — solishtirish" title="Taqqoslashga qo‘shish" aria-pressed="${compared}">${icon('compare')}</button>` : ''}
      </div>
      <div class="card-info">
        <div class="brand-type"><span>${esc(p.brand)}</span>${catLabel ? `<span>${esc(catLabel)}</span>` : ''}</div>
        <h3><button type="button" class="card-title" data-detail="${esc(p.id)}">${esc(p.name)}</button></h3>
        <div class="specs">${getCardSpecs(p)}</div>
        <div class="card-bottom">
          ${priceBlock(p)}
          <button type="button" class="add-cart ${inCart ? 'in-cart' : ''}" data-add="${esc(p.id)}" aria-label="${esc(p.name)}ni savatchaga qo‘shish" ${out ? 'disabled title="Sotuvda yo‘q"' : ''}>
            ${inCart ? `${icon('bagPlus')}<span>${inCart}</span>` : icon('bagPlus')}
          </button>
        </div>
      </div>
    </article>`;
  }

  function emptyState(symbol, title, body, action, label) {
    return `<div class="empty">${icon(symbol)}<h3>${esc(title)}</h3><p class="small-copy">${esc(body)}</p>${action ? `<button type="button" class="secondary" data-action="${esc(action)}">${esc(label)}</button>` : ''}</div>`;
  }

  function renderCatalog() {
    const result = subset();
    $('#category-tabs').innerHTML = categories.map(c =>
      `<button type="button" data-category="${esc(c.id)}" aria-pressed="${category === c.id}">${icon(c.icon)}${esc(c.name)}</button>`
    ).join('');

    $('#model-count').textContent = `${result.length} ta model`;
    $('#product-grid').innerHTML = result.map((p, i) => card(p, i)).join('')
      || emptyState('search', 'Mos model topilmadi', 'Boshqa toifani tanlang yoki filtrlarni tozalang.', 'reset', 'Filtrlarni tozalash');

    const unitLabel = filterSpec ? `${filterSpec.filterUnit || ''} ${filterSpec.minSuffix || 'va ko‘proq'}`.trim() : '';
    const labels = {
      brand: filters.brand,
      ceiling: filters.ceiling ? `${formatMoney(filters.ceiling)} gacha` : '',
      specMin: filters.specMin ? `${filters.specMin} ${unitLabel}` : '',
      sale: filters.sale ? 'Chegirmada' : '',
      stock: filters.stock ? (UI.inStockLabel || 'Sotuvda mavjud') : ''
    };
    const active = Object.entries(labels).filter(([, label]) => label);
    const chipsHtml = active.map(([key, label]) =>
      `<button type="button" class="chip" data-remove-filter="${esc(key)}" aria-label="${esc(label)} filtrini olib tashlash">${esc(label)}${icon('x')}</button>`
    ).join('');
    $('#active-filters').innerHTML = active.length > 1
      ? `${chipsHtml}<button type="button" class="chip chip-clear" data-action="reset">Barchasini tozalash${icon('x')}</button>`
      : chipsHtml;

    const countEl = $('#filter-count');
    countEl.hidden = !active.length;
    countEl.textContent = String(active.length);
  }

  function scrollToSection(id, navId) {
    programmaticScrollUntil = Date.now() + 800;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    activeNav(navId || id);
  }

  function catalogView(newCategory = null, newFilters = null, navKey = 'catalog') {
    closePanel();
    if (newCategory !== null) category = newCategory;
    if (newFilters !== null) filters = { ...cleanFilters, ...newFilters };
    renderCatalog();
    scrollToSection('catalog', navKey);
  }

  function activeNav(id) {
    document.querySelectorAll('[data-nav]').forEach(el => {
      const match = el.dataset.nav === id;
      el.classList.toggle('nav-active', match);
      if (match) el.setAttribute('aria-current', 'location');
      else el.removeAttribute('aria-current');
    });
  }

  const panel = $('#panel');

  function openPanel(name, title, html, opts = {}) {
    const { drawer = false, wide = false, admin = false } = typeof opts === 'boolean' ? { drawer: opts } : opts;
    panelName = name;
    panel.classList.toggle('drawer', drawer);
    panel.classList.toggle('wide', wide);
    panel.classList.toggle('admin-dialog', admin);
    $('#panel-body').innerHTML = `
      <div class="panel-header">
        <h2 id="panel-title" tabindex="-1">${esc(title)}</h2>
        <button type="button" class="icon-btn" data-action="close" aria-label="Yopish">${icon('x')}</button>
      </div>
      ${html}
    `;
    if (!panel.open) panel.showModal();
    document.body.classList.add('modal-open');
    panel.scrollTop = 0;
    $('#panel-title').focus({ preventScroll: true });
  }

  function closePanel() {
    if (panel.open) panel.close();
  }

  panel.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    panelName = '';
    panel.classList.remove('drawer', 'wide', 'admin-dialog');
    document.body.append($('#toast'));
  });

  panel.addEventListener('click', e => {
    if (e.target !== panel) return;
    const r = panel.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closePanel();
  });

  function addToCart(id, variantId = '') {
    const p = productById.get(id);
    if (!p) return;
    const stock = getStockQty(p);
    if (p.inStock === false || stock <= 0) {
      notify('Bu model hozirda buyurtma asosida');
      return;
    }
    const resolved = resolveProduct(p, variantId);
    const maxQty = FEATURES.maxCartQty || 99;
    const currentProductQty = productCartQty(id);
    if (typeof p.stockQty === 'number' && currentProductQty >= stock) {
      notify(`Omborda bu modeldan faqat ${stock} ta qolgan`);
      return;
    }
    if ((cart[resolved.key] || 0) >= maxQty) {
      notify(`Bir konfiguratsiyadan ${maxQty} tagacha tanlash mumkin`);
      return;
    }
    cart[resolved.key] = (cart[resolved.key] || 0) + 1;
    save();
    bumpCartBadge();

    document.querySelectorAll(`[data-add="${CSS.escape(id)}"]`).forEach(b => {
      b.classList.remove('added');
      void b.offsetWidth;
      b.classList.add('added');
    });

    notify(resolved.variantLabel ? `${p.name} (${resolved.variantLabel}) savatchaga qo‘shildi` : 'Savatchaga qo‘shildi');
  }

  function toggleFavorite(id) {
    if (!productById.has(id)) return;
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    save();
    const saved = favorites.has(id);
    document.querySelectorAll(`[data-fav="${CSS.escape(id)}"]`).forEach(btn => {
      btn.classList.toggle('saved', saved);
      btn.setAttribute('aria-pressed', String(saved));
    });
    if (panelName === 'favorites') showFavorites();
    notify(saved ? 'Sevimlilarga saqlandi' : 'Sevimlilardan olib tashlandi');
  }

  function toggleCompare(id) {
    if (!FEATURES.compare || !productById.has(id)) return;
    const maxCmp = FEATURES.maxCompare || 3;
    const exists = compareIds.includes(id);
    if (exists) {
      compareIds = compareIds.filter(x => x !== id);
    } else {
      if (compareIds.length >= maxCmp) {
        notify(`Ko‘pi bilan ${maxCmp} ta modelni solishtirish mumkin`);
        return;
      }
      compareIds = [...compareIds, id];
    }
    save();
    const active = compareIds.includes(id);
    document.querySelectorAll(`[data-compare="${CSS.escape(id)}"]`).forEach(btn => {
      btn.classList.toggle('compared', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    if (panelName === 'detail' && detailState.id === id) showDetail(id, detailState.variantId);
    if (panelName === 'compare') {
      if (compareIds.length < 2) closePanel();
      else showCompare();
    }
    notify(active ? 'Taqqoslashga qo‘shildi' : 'Taqqoslashdan olib tashlandi');
  }

  function listItem(p, tail, extra = '', unitPrice = null, subtitle = '') {
    const imgSrc = p.image || `assets/${p.id}.webp`;
    const displayPrice = unitPrice !== null ? unitPrice : p.price;
    return `<div class="list-item">
      <img src="${esc(imgSrc)}" alt="" onerror="this.onerror=null;this.src='assets/mark.svg';">
      <div style="min-width:0;flex:1">
        <button type="button" class="list-name" data-detail="${esc(p.id)}">${esc(p.brand)} ${esc(p.name)}</button>
        ${subtitle ? `<div class="small-copy" style="font-size:.77rem">${esc(subtitle)}</div>` : ''}
        <p class="small-copy">${esc(formatMoney(displayPrice))}</p>
        ${extra}
      </div>
      ${tail}
    </div>`;
  }

  function showFavorites() {
    const html = [...favorites].map(id => {
      const p = productById.get(id);
      if (!p) return '';
      return listItem(
        p,
        `<button type="button" class="add-cart" data-add="${esc(id)}" aria-label="Savatchaga qo‘shish">${icon('bagPlus')}</button>
         <button type="button" class="icon-btn" data-fav="${esc(id)}" aria-label="Sevimlilardan olib tashlash">${icon('x')}</button>`
      );
    }).join('');
    openPanel(
      'favorites',
      'Sevimlilar',
      html || emptyState('heart', 'Sevimlilar ro‘yxati bo‘sh', 'Yoqtirgan modelingizni yurakcha orqali shu yerga saqlang.', 'catalog', 'Katalogga o‘tish'),
      { drawer: true }
    );
  }

  function getCartEntries() {
    return Object.entries(cart).map(([key, qty]) => {
      const { productId, variantId } = parseCartKey(key);
      const p = productById.get(productId);
      if (!p) return null;
      const resolved = resolveProduct(p, variantId);
      return { key, qty, ...resolved };
    }).filter(Boolean);
  }

  function getTotals(deliveryId = checkoutState.deliveryId) {
    const entries = getCartEntries();
    const subtotal = entries.reduce((sum, item) => sum + item.price * item.qty, 0);
    const promoPct = appliedPromo && PROMOS[appliedPromo] ? Number(PROMOS[appliedPromo]) : 0;
    const discount = promoPct ? Math.round(subtotal * (promoPct / 100)) : 0;
    const deliveryObj = DELIVERY.find(d => d.id === deliveryId) || DELIVERY[0];
    const deliveryFee = entries.length ? Number(deliveryObj?.price || 0) : 0;
    const total = Math.max(0, subtotal - discount + deliveryFee);
    return { entries, subtotal, promoPct, discount, deliveryObj, deliveryFee, total };
  }

  function showCart() {
    const { entries, subtotal, promoPct, discount, total } = getTotals();
    const maxQty = FEATURES.maxCartQty || 99;
    const rows = entries.map(item =>
      listItem(
        item.product,
        `<button type="button" class="icon-btn" data-delete="${esc(item.key)}" aria-label="Savatchadan olib tashlash">${icon('trash')}</button>`,
        `<div class="qty">
          <button type="button" data-minus="${esc(item.key)}" aria-label="Miqdorni kamaytirish">−</button>
          <span>${item.qty}</span>
          <button type="button" data-plus="${esc(item.key)}" aria-label="Miqdorni oshirish" ${item.qty >= maxQty ? 'disabled' : ''}>+</button>
        </div>`,
        item.price,
        item.variantLabel
      )
    ).join('');

    const hasPromos = Object.keys(PROMOS).length > 0;
    const promoHtml = !hasPromos ? '' : appliedPromo
      ? `<div class="promo-badge">
          <span>Promo-kod: <strong>${esc(appliedPromo)}</strong> (−${promoPct}%)</span>
          <button type="button" class="icon-btn" style="width:26px;height:26px" data-action="remove-promo" aria-label="Promo-kodni olib tashlash">${icon('x')}</button>
        </div>`
      : `<form id="promo-form" class="promo-row">
          <input type="text" name="code" placeholder="Promo-kod (masalan: ${esc(Object.keys(PROMOS)[0])})" aria-label="Promo-kod">
          <button type="submit" class="secondary small-btn">Qo‘llash</button>
        </form>`;

    const footer = `<div class="panel-footer">
      ${promoHtml}
      <div class="total-line"><span>Mahsulotlar</span><span>${esc(formatMoney(subtotal))}</span></div>
      ${discount ? `<div class="total-line"><span>Chegirma (−${promoPct}%)</span><strong>−${esc(formatMoney(discount))}</strong></div>` : ''}
      <div class="total-line final"><span>Jami</span><strong>${esc(formatMoney(total))}</strong></div>
      <button type="button" class="primary full" data-action="checkout">${icon('bag')}Buyurtmani rasmiylashtirish</button>
      <button type="button" class="secondary full" style="margin-top:9px" data-action="clear-cart">Savatchani tozalash</button>
    </div>`;

    openPanel(
      'cart',
      'Savatcha',
      rows ? rows + footer : emptyState('bag', 'Savatchangiz bo‘sh', 'Noutbuk tanlab, savatcha tugmasini bosing.', 'catalog', 'Katalogga o‘tish'),
      { drawer: true }
    );
  }

  function showDetail(id, variantId = '') {
    const p = productById.get(id);
    if (!p) return;
    if (['cart', 'favorites', 'search', 'compare'].includes(panelName)) detailOrigin = panelName;
    else if (panelName !== 'detail') detailOrigin = '';

    const resolved = resolveProduct(p, variantId || (detailState.id === id ? detailState.variantId : ''));
    detailState = {
      id,
      variantId: resolved.variantId,
      months: detailState.months || INSTALLMENT.defaultMonths || 12
    };

    const m = resolved.merged;
    const out = p.inStock === false;
    const saved = favorites.has(id);
    const compared = compareIds.includes(id);
    const imgSrc = p.image || `assets/${id}.webp`;
    const catName = Array.isArray(p.categories) && p.categories.length ? categoryName(p.categories[0]) : '';

    const variantsHtml = Array.isArray(p.variants) && p.variants.length
      ? `<div class="variant-section">
          <span class="section-sublabel">Konfiguratsiyani tanlang</span>
          <div class="variant-grid">
            ${p.variants.map(v => `<button type="button" class="variant-pill" data-variant="${esc(v.id)}" aria-pressed="${v.id === resolved.variantId}">${esc(v.label)}</button>`).join('')}
          </div>
        </div>`
      : '';

    const monthsList = INSTALLMENT.months || [3, 6, 12];
    const activeMonths = monthsList.includes(detailState.months) ? detailState.months : monthsList[0];
    const inst = INSTALLMENT.enabled ? calcInstallment(resolved.price, activeMonths) : null;
    const installmentHtml = INSTALLMENT.enabled
      ? `<div class="installment-box">
          <div class="installment-top">
            <span class="section-sublabel" style="margin:0">${esc(INSTALLMENT.label || 'Muddatli to‘lov')}</span>
            <div class="month-tabs">
              ${monthsList.map(mo => `<button type="button" data-inst-month="${mo}" aria-pressed="${mo === activeMonths}">${mo} oy</button>`).join('')}
            </div>
          </div>
          <div class="installment-result">
            <span>Oylik to‘lov (${activeMonths} oy${inst.pct === 0 ? ', 0% ustama' : ''})</span>
            <strong>${esc(formatMoney(inst.monthly))} / oy</strong>
          </div>
        </div>`
      : '';

    const fields = (typeof specFields !== 'undefined' ? specFields : [])
      .map(f => {
        const raw = m[f.key];
        if (raw === undefined || raw === null || raw === '') return '';
        return `<div><dt>${esc(f.label)}</dt><dd>${esc(f.format ? f.format(raw) : raw)}</dd></div>`;
      }).join('');

    const back = detailOrigin
      ? `<button type="button" class="secondary full" style="margin-top:10px" data-action="${esc(detailOrigin)}">Ro‘yxatga qaytish</button>`
      : '';

    openPanel(
      'detail',
      p.name,
      `<div class="detail-visual tone-${esc(p.tone || 'slate')}">
        <img src="${esc(imgSrc)}" alt="${esc(p.name)}" onerror="this.onerror=null;this.src='assets/mark.svg';">
      </div>
      <div class="brand-type"><span>${esc(p.brand)}</span>${catName ? `<span>${esc(catName)}</span>` : ''}</div>
      <div class="detail-badges">
        <span class="status-pill ${out ? 'warn' : 'ok'}">${icon(out ? 'clock' : 'check')}${esc(out ? (UI.outOfStockLabel || 'Buyurtma asosida') : (UI.inStockLabel || 'Sotuvda mavjud'))}</span>
        ${p.warranty ? `<span class="status-pill">${icon('shield')}${esc(p.warranty)}</span>` : ''}
      </div>
      <p class="detail-desc">${esc(p.desc)}</p>
      ${variantsHtml}
      ${installmentHtml}
      <dl class="detail-info">${fields}</dl>
      <div class="panel-actions">
        <div>
          <div class="price">${moneyHtml(resolved.price)}</div>
          ${resolved.old ? `<del class="old-price">${esc(formatMoney(resolved.old))}</del>` : ''}
        </div>
        <button type="button" class="primary" data-add-detail="${esc(id)}" ${out ? 'disabled' : ''}>${icon('bagPlus')}${out ? 'Mavjud emas' : 'Savatchaga'}</button>
      </div>
      <div class="detail-secondary-actions">
        <button type="button" class="secondary small-btn" data-fav="${esc(id)}">${icon('heart')}${saved ? 'Saqlangan' : 'Sevimlilarga'}</button>
        ${FEATURES.compare ? `<button type="button" class="secondary small-btn" data-compare="${esc(id)}">${icon('compare')}${compared ? 'Tanlangan' : 'Taqqoslash'}</button>` : ''}
      </div>
      ${back}`
    );
  }

  function showCompare() {
    const items = compareIds.map(id => productById.get(id)).filter(Boolean);
    if (!items.length) {
      openPanel('compare', 'Modellarni taqqoslash', emptyState('compare', 'Modellar tanlanmagan', 'Taqqoslash uchun mahsulot kartasidagi solishtirish tugmasini bosing.', 'catalog', 'Katalogga o‘tish'), { wide: true });
      return;
    }

    const minPrice = Math.min(...items.map(p => p.price));
    const maxRam = Math.max(...items.map(p => Number(p.ram || 0)));
    const specRows = (typeof specFields !== 'undefined' ? specFields : []).map(f => `
      <tr>
        <th>${esc(f.label)}</th>
        ${items.map(p => {
          const val = p[f.key];
          const text = val !== undefined && val !== '' ? (f.format ? f.format(val) : val) : '—';
          const isBest = f.key === 'ram' && items.length > 1 && Number(val) === maxRam;
          return `<td class="${isBest ? 'compare-best' : ''}">${esc(text)}</td>`;
        }).join('')}
      </tr>
    `).join('');

    const html = `<div class="compare-wrap">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Model</th>
            ${items.map(p => `
              <td>
                <div class="compare-head-card">
                  <img src="${esc(p.image || `assets/${p.id}.webp`)}" alt="${esc(p.name)}" onerror="this.onerror=null;this.src='assets/mark.svg';">
                  <button type="button" class="list-name" data-detail="${esc(p.id)}">${esc(p.brand)} ${esc(p.name)}</button>
                  <button type="button" class="secondary small-btn" data-compare="${esc(p.id)}">${icon('x')}Olib tashlash</button>
                </div>
              </td>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Narxi</th>
            ${items.map(p => `<td class="${items.length > 1 && p.price === minPrice ? 'compare-best' : ''}">${esc(formatMoney(p.price))}</td>`).join('')}
          </tr>
          <tr>
            <th>Mavjudligi</th>
            ${items.map(p => `<td>${esc(p.inStock === false ? (UI.outOfStockLabel || 'Buyurtma asosida') : (UI.inStockLabel || 'Sotuvda mavjud'))}</td>`).join('')}
          </tr>
          <tr>
            <th>Kafolat</th>
            ${items.map(p => `<td>${esc(p.warranty || CONTACT.warrantySummary || '12 oy')}</td>`).join('')}
          </tr>
          ${specRows}
          <tr>
            <th>Harakat</th>
            ${items.map(p => `<td><button type="button" class="primary small-btn full" data-add="${esc(p.id)}" ${p.inStock === false ? 'disabled' : ''}>${icon('bagPlus')}Savatchaga</button></td>`).join('')}
          </tr>
        </tbody>
      </table>
    </div>`;

    openPanel('compare', 'Modellarni taqqoslash', html, { wide: true });
  }

  function showCheckout() {
    const totals = getTotals(checkoutState.deliveryId);
    if (!totals.entries.length) {
      showCart();
      return;
    }

    const requiresAddr = Boolean(totals.deliveryObj?.requiresAddress);
    const html = `<form id="checkout-form" class="checkout-form" novalidate>
      <label class="field">
        <span>Ismingiz *</span>
        <input type="text" name="name" placeholder="Masalan: Azizbek" required autocomplete="name">
        <span class="field-error" data-err="name" hidden></span>
      </label>

      <label class="field">
        <span>Telefon raqamingiz *</span>
        <input type="tel" name="phone" id="checkout-phone" placeholder="+998 90 123-45-67" required autocomplete="tel">
        <span class="field-error" data-err="phone" hidden></span>
      </label>

      <div class="field">
        <span>Yetkazib berish usuli</span>
        <div class="delivery-options">
          ${DELIVERY.map(d => `
            <label class="radio-card">
              <input type="radio" name="delivery" value="${esc(d.id)}" ${d.id === checkoutState.deliveryId ? 'checked' : ''}>
              <div class="radio-card-body">
                <div>
                  <strong>${esc(d.label)}</strong>
                  ${d.note ? `<div class="small-copy" style="font-size:.76rem">${esc(d.note)}</div>` : ''}
                </div>
                <strong style="white-space:nowrap;color:var(--lime)">${d.price ? esc(formatMoney(d.price)) : 'Bepul'}</strong>
              </div>
            </label>
          `).join('')}
        </div>
      </div>

      <label class="field" id="address-field" ${requiresAddr ? '' : 'hidden'}>
        <span>Manzil *</span>
        <input type="text" name="address" placeholder="Shahar, tuman, ko‘cha va uy raqami" autocomplete="street-address">
        <span class="field-error" data-err="address" hidden></span>
      </label>

      <label class="field">
        <span>To‘lov turi</span>
        <select name="payment">
          ${PAYMENTS.map(pm => `<option value="${esc(pm)}" ${pm === checkoutState.payment ? 'selected' : ''}>${esc(pm)}</option>`).join('')}
        </select>
      </label>

      <label class="field">
        <span>Izoh yoki Telegram (@username)</span>
        <textarea name="note" placeholder="Qo‘shimcha savol yoki yetkazib berish vaqti…"></textarea>
      </label>

      <div class="panel-footer" style="margin-top:4px">
        <div class="total-line"><span>Mahsulotlar (${totals.entries.reduce((n, x) => n + x.qty, 0)} ta)</span><span>${esc(formatMoney(totals.subtotal))}</span></div>
        ${totals.discount ? `<div class="total-line"><span>Promo-kod (${esc(appliedPromo)})</span><strong>−${esc(formatMoney(totals.discount))}</strong></div>` : ''}
        <div class="total-line"><span>Yetkazib berish</span><span id="checkout-delivery-fee">${totals.deliveryFee ? esc(formatMoney(totals.deliveryFee)) : 'Bepul'}</span></div>
        <div class="total-line final"><span>Jami to‘lov</span><strong id="checkout-total">${esc(formatMoney(totals.total))}</strong></div>
        <button type="submit" class="primary full">${icon('check')}Buyurtmani tasdiqlash</button>
        <button type="button" class="secondary full" style="margin-top:9px" data-action="cart">Savatchaga qaytish</button>
      </div>
    </form>`;

    openPanel('checkout', 'Buyurtmani rasmiylashtirish', html, { drawer: true });
  }

  function formatOrderMessage(order) {
    const lines = [
      `${BRAND.name || 'NEXBOOK'} — Buyurtma #${order.id}`,
      `Sana: ${order.dateLabel}`,
      '',
      ...order.items.map((item, idx) =>
        `${idx + 1}. ${item.brand} ${item.name}${item.variant ? ` (${item.variant})` : ''} × ${item.qty} = ${formatMoney(item.price * item.qty)}`
      ),
      ''
    ];
    if (order.discount) lines.push(`Promo-kod (${order.promoCode}): −${formatMoney(order.discount)}`);
    lines.push(`Yetkazish: ${order.deliveryLabel} (${order.deliveryFee ? formatMoney(order.deliveryFee) : 'Bepul'})`);
    lines.push(`To‘lov turi: ${order.payment}`);
    lines.push(`JAMI: ${formatMoney(order.total)}`);
    lines.push('');
    lines.push(`Mijoz: ${order.customer.name}`);
    lines.push(`Telefon: ${order.customer.phone}`);
    if (order.customer.address) lines.push(`Manzil: ${order.customer.address}`);
    if (order.customer.note) lines.push(`Izoh: ${order.customer.note}`);
    return lines.join('\n');
  }

  async function dispatchOrderToIntegrations(text, payload) {
    try {
      if (CONTACT.telegramBotToken && CONTACT.telegramChatId) {
        await fetch(`https://api.telegram.org/bot${encodeURIComponent(CONTACT.telegramBotToken)}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CONTACT.telegramChatId, text })
        });
      }
      if (CONTACT.webhookUrl) {
        await fetch(CONTACT.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    } catch {
      /* Fallback to local receipt, Telegram deep-link, copy, and file download. */
    }
  }

  function downloadTextFile(filename, content) {
    const url = URL.createObjectURL(new Blob(['\uFEFF', content], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  async function copyText(text, okMsg = 'Nusxa olindi') {
    try {
      await navigator.clipboard.writeText(text);
      notify(okMsg);
      return true;
    } catch {
      return false;
    }
  }

  function showOrderSuccess(order) {
    lastOrder = order;
    const msg = formatOrderMessage(order);
    const tgLink = CONTACT.telegram
      ? `https://t.me/${encodeURIComponent(CONTACT.telegram)}?text=${encodeURIComponent(msg)}`
      : '';

    const html = `<div class="order-success">
      <div class="success-badge">${icon('check')}</div>
      <h3 style="font-size:1.25rem;margin-bottom:6px">Buyurtma #${esc(order.id)} qabul qilindi!</h3>
      <p class="small-copy">Buyurtma tafsilotlari saqlandi. Tezroq tasdiqlash uchun Telegram orqali yuborishingiz yoki chekni saqlashingiz mumkin.</p>
    </div>
    <dl class="detail-info">
      <div><dt>Mijoz</dt><dd>${esc(order.customer.name)}</dd></div>
      <div><dt>Telefon</dt><dd>${esc(order.customer.phone)}</dd></div>
      <div><dt>Yetkazish</dt><dd>${esc(order.deliveryLabel)}</dd></div>
      <div><dt>To‘lov</dt><dd>${esc(order.payment)}</dd></div>
      <div><dt>Jami summa</dt><dd style="color:var(--lime);font-weight:700">${esc(formatMoney(order.total))}</dd></div>
    </dl>
    <div style="display:grid;gap:9px">
      ${tgLink ? `<a class="primary full" href="${esc(tgLink)}" target="_blank" rel="noopener noreferrer">${icon('send')}Telegramda sotuvchiga yuborish</a>` : ''}
      <div class="panel-actions">
        <button type="button" class="secondary" style="flex:1" data-action="copy-order">${icon('copy')}Nusxalash</button>
        <button type="button" class="secondary" style="flex:1" data-action="download-order">${icon('download')}Chek (.txt)</button>
      </div>
      <button type="button" class="secondary full" data-action="orders">${icon('receipt')}Buyurtmalarimni ko‘rish</button>
      <button type="button" class="secondary full" data-action="close">Katalogga qaytish</button>
    </div>`;

    openPanel('order-success', 'Buyurtma rasmiylashtirildi', html, { drawer: true });
  }

  function showOrders() {
    if (!orders.length) {
      openPanel('orders', 'Buyurtmalarim', emptyState('receipt', 'Hali buyurtmalar yo‘q', 'Rasmiylashtirilgan buyurtmalaringiz shu yerda saqlanadi.', 'catalog', 'Katalogga o‘tish'), { drawer: true });
      return;
    }

    const html = orders.map((o, idx) => `
      <div class="order-card">
        <div class="order-card-head">
          <strong>#${esc(o.id)}</strong>
          <span class="status-pill ok" style="font-size:.7rem;padding:2px 8px">${esc(o.status || 'Yangi')}</span>
        </div>
        <div class="small-copy" style="font-size:.76rem;margin-bottom:5px">${esc(o.dateLabel)}</div>
        <p class="small-copy" style="margin-bottom:8px">${o.items.map(i => `${esc(i.name)}${i.variant ? ` (${esc(i.variant)})` : ''} × ${i.qty}`).join(', ')}</p>
        <div class="panel-actions">
          <strong style="color:var(--lime)">${esc(formatMoney(o.total))}</strong>
          <div style="display:flex;gap:6px">
            <button type="button" class="secondary small-btn" data-copy-order="${idx}">${icon('copy')}Nusxa</button>
            ${CONTACT.telegram ? `<a class="secondary small-btn" href="https://t.me/${encodeURIComponent(CONTACT.telegram)}?text=${encodeURIComponent(formatOrderMessage(o))}" target="_blank" rel="noopener noreferrer">${icon('send')}TG</a>` : ''}
          </div>
        </div>
      </div>
    `).join('');

    openPanel('orders', 'Buyurtmalarim', html, { drawer: true });
  }

  function showConsult() {
    const html = `<form id="consult-form" class="checkout-form" novalidate>
      <p class="small-copy">Qaysi model sizning vazifangizga mos kelishini ayting — mutaxassisimiz tez orada bog‘lanadi.</p>
      <label class="field">
        <span>Ismingiz *</span>
        <input type="text" name="name" placeholder="Ismingiz" required>
        <span class="field-error" data-err="cname" hidden></span>
      </label>
      <label class="field">
        <span>Telefon raqamingiz *</span>
        <input type="tel" name="phone" id="consult-phone" placeholder="+998 90 123-45-67" required>
        <span class="field-error" data-err="cphone" hidden></span>
      </label>
      <label class="field">
        <span>Qaysi maqsad uchun?</span>
        <select name="purpose">
          <option value="O‘yin va grafika">O‘yin va grafika (Gaming)</option>
          <option value="Biznes va ofis">Biznes va ofis</option>
          <option value="O‘qish va dasturlash">O‘qish va dasturlash</option>
          <option value="Dizayn va montaj">Dizayn va video montaj</option>
          <option value="Aniq model bo‘yicha savol">Aniq model bo‘yicha savol</option>
        </select>
      </label>
      <label class="field">
        <span>Byudjet yoki izoh</span>
        <textarea name="note" placeholder="Masalan: 15 mln so‘mgacha, yengil va OLED ekranli bo‘lsin…"></textarea>
      </label>
      <button type="submit" class="primary full">${icon('send')}So‘rov yuborish</button>
    </form>`;

    openPanel('consult', 'Bepul maslahat olish', html);
  }

  function normalized(value) {
    return String(value || '').toLowerCase().replace(/[‘’ʻʼ′'`]/g, '').replace(/\s+/g, ' ').trim();
  }

  function searchResults() {
    const query = normalized(searchText);
    const matches = products.filter(p => {
      if (!query) return true;
      const variantText = (p.variants || []).map(v => v.label).join(' ');
      const haystack = [
        p.brand, p.name, p.cpu, p.gpu, p.ssd, p.screen, p.desc,
        p.ram ? `${p.ram} GB` : '',
        variantText,
        ...(p.categories || []).map(categoryName)
      ].join(' ');
      return normalized(haystack).includes(query);
    });

    $('.search-results').innerHTML = matches.map(p => `
      <button type="button" class="list-item" data-detail="${esc(p.id)}">
        <img src="${esc(p.image || `assets/${p.id}.webp`)}" alt="" onerror="this.onerror=null;this.src='assets/mark.svg';">
        <span>
          <strong>${esc(p.brand)} ${esc(p.name)}</strong><br>
          <span class="small-copy">${esc(formatMoney(p.price))} · ${esc(p.cpu || '')}</span>
        </span>
      </button>
    `).join('') || emptyState('search', 'Model topilmadi', 'Brend, model yoki protsessor nomi bilan qidirib ko‘ring.');
  }

  function showSearch() {
    const placeholder = UI.searchPlaceholder || 'Brend, model yoki protsessor…';
    openPanel(
      'search',
      'Katalogdan qidirish',
      `<label class="search-field">${icon('search')}<input id="search-input" type="search" placeholder="${esc(placeholder)}" aria-label="Qidirish" autocomplete="off"></label>
       <div class="search-results"></div>`
    );
    const input = $('#search-input');
    input.value = searchText;
    searchResults();
    input.focus();
  }

  function showBrands() {
    openPanel(
      'brands',
      'Brendlar',
      `<div class="choice-list">${brands.map(b =>
        `<button type="button" data-brand="${esc(b)}"><strong>${esc(b)}</strong><span class="small-copy">${products.filter(p => p.brand === b).length} ta model</span></button>`
      ).join('')}</div>`
    );
  }

  function choices(items, value) {
    return items.map(([id, label]) =>
      `<option value="${esc(id)}" ${String(id) === String(value) ? 'selected' : ''}>${esc(label)}</option>`
    ).join('');
  }

  function showFilters() {
    const ceilings = priceCeilings();
    const specs = specOptions();
    const specSelectHtml = filterSpec && specs.length
      ? `<label class="field">${esc(filterSpec.filterLabel || filterSpec.label)}
          <select name="specMin">
            ${choices([[0, 'Barchasi'], ...specs.map(v => [v, `${v} ${filterSpec.filterUnit || ''} ${filterSpec.minSuffix || 'va ko‘proq'}`.trim()])], filters.specMin)}
          </select>
        </label>`
      : '';

    openPanel(
      'filters',
      'Katalog filtrlari',
      `<form id="filter-form" class="filter-form">
        <label class="field">Brend
          <select name="brand">${choices([['', 'Barcha brendlar'], ...brands.map(b => [b, b])], filters.brand)}</select>
        </label>
        <label class="field">Maksimal narx
          <select name="ceiling">${choices([[0, 'Cheklanmagan'], ...ceilings.map(c => [c, `${formatMoney(c)} gacha`])], filters.ceiling)}</select>
        </label>
        ${specSelectHtml}
        <label class="check-field"><input type="checkbox" name="sale" ${filters.sale ? 'checked' : ''}>Faqat chegirmadagi modellar</label>
        <label class="check-field"><input type="checkbox" name="stock" ${filters.stock ? 'checked' : ''}>Faqat sotuvda mavjud modellar</label>
        <div class="panel-actions">
          <button type="button" class="secondary" data-action="reset-form">Tozalash</button>
          <button class="primary" type="submit">Natijalarni ko‘rish</button>
        </div>
      </form>`
    );
  }

  function showMenu() {
    const items = [
      ['home', 'Bosh sahifa', ''],
      ['catalog', 'Katalog', `${products.length} ta`],
      ['brands', 'Brendlar', `${brands.length} ta`],
      ['deals', 'Chegirmalar', `${products.filter(p => p.old).length} ta`],
      ['favorites', 'Sevimlilar', favorites.size ? `${favorites.size} ta` : ''],
      ['orders', 'Buyurtmalarim', orders.length ? `${orders.length} ta` : ''],
      ['consult', 'Bepul maslahat', '']
    ];
    if (FEATURES.compare && compareIds.length) {
      items.splice(5, 0, ['compare', 'Taqqoslash', `${compareIds.length} ta`]);
    }
    if (ADMIN.enabled !== false) {
      items.push(['admin', 'Admin panel', '']);
    }

    const contactExtra = CONTACT.phone
      ? `<div class="panel-footer" style="margin-top:18px">
          <p class="small-copy" style="margin-bottom:8px">${esc(CONTACT.address || '')}</p>
          <a class="secondary full" href="${esc(CONTACT.phoneHref || `tel:${CONTACT.phone.replace(/\s+/g, '')}`)}">${icon('phone')}${esc(CONTACT.phone)}</a>
        </div>`
      : '';

    openPanel(
      'menu',
      BRAND.name || 'Menyu',
      `<div class="choice-list">${items.map(([id, label, meta]) =>
        `<button type="button" data-action="${esc(id)}"><strong>${esc(label)}</strong>${meta ? `<span class="small-copy">${esc(meta)}</span>` : ''}</button>`
      ).join('')}</div>${contactExtra}`,
      { drawer: true }
    );
  }

  /* -------------------- ADMIN PANEL -------------------- */

  function showAdmin() {
    if (ADMIN.enabled === false) {
      notify('Admin panel o‘chirilgan');
      return;
    }

    if (!isAdminUnlocked()) {
      const currentPin = String(ADMIN.pin || '1234');
      const hint = currentPin === '1234'
        ? '<p class="small-copy">Standart demo PIN: <strong>1234</strong> (Sozlamalardan o‘zgartirish mumkin)</p>'
        : '<p class="small-copy">Davom etish uchun do‘kon admin PIN kodini kiriting.</p>';

      openPanel('admin', 'Admin panelga kirish', `
        <form id="admin-login-form" class="admin-lock">
          <div class="admin-lock-icon">${icon('lock')}</div>
          ${hint}
          <label class="field" style="text-align:left">
            <span>PIN kod</span>
            <input type="password" name="pin" id="admin-pin-input" placeholder="••••" autocomplete="off" required>
            <span class="field-error" data-err="apin" hidden></span>
          </label>
          <button type="submit" class="primary full">${icon('check')}Kirish</button>
        </form>
      `);
      setTimeout(() => $('#admin-pin-input')?.focus(), 40);
      return;
    }

    const tabs = [
      ['analytics', 'chart', 'Analitika'],
      ['warehouse', 'box', `Ombor (${products.reduce((n, p) => n + getStockQty(p), 0)})`],
      ['orders', 'receipt', `Buyurtmalar (${orders.length})`],
      ['products', 'grid', `Mahsulotlar (${products.length})`],
      ['settings', 'settings', 'Sozlamalar'],
      ['export', 'download', 'Eksport']
    ];

    const tabsHtml = `<div class="admin-tabs" role="tablist">
      ${tabs.map(([id, ic, label]) =>
        `<button type="button" role="tab" data-admin-tab="${id}" aria-selected="${adminTab === id}">${icon(ic)}${esc(label)}</button>`
      ).join('')}
      <button type="button" class="secondary small-btn" style="margin-left:auto" data-action="admin-lock">${icon('lock')}Chiqish</button>
    </div>`;

    let bodyHtml = '';
    if (adminTab === 'analytics') bodyHtml = renderAdminAnalyticsTab();
    else if (adminTab === 'warehouse') bodyHtml = renderAdminWarehouseTab();
    else if (adminTab === 'orders') bodyHtml = renderAdminOrdersTab();
    else if (adminTab === 'products') bodyHtml = renderAdminProductsTab();
    else if (adminTab === 'settings') bodyHtml = renderAdminSettingsTab();
    else if (adminTab === 'export') bodyHtml = renderAdminExportTab();

    openPanel('admin', `${BRAND.name || 'Do‘kon'} — Boshqaruv paneli`, tabsHtml + bodyHtml, { admin: true });
  }

  function computeAnalytics() {
    const activeOrders = orders.filter(o => o.status !== 'Bekor qilindi');
    const liveRevenue = activeOrders.reduce((s, o) => s + Number(o.total || 0), 0);
    const liveUnitsById = {};
    const paymentCounts = {};
    const statusCounts = { Yangi: 0, Tasdiqlangan: 0, Yetkazildi: 0, 'Bekor qilindi': 0 };

    orders.forEach(o => {
      const st = o.status || 'Yangi';
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    });

    activeOrders.forEach(o => {
      const pm = o.payment || 'Naqd pul';
      paymentCounts[pm] = (paymentCounts[pm] || 0) + 1;
      (o.items || []).forEach(it => {
        if (!liveUnitsById[it.id]) liveUnitsById[it.id] = { qty: 0, revenue: 0 };
        liveUnitsById[it.id].qty += Number(it.qty || 0);
        liveUnitsById[it.id].revenue += Number(it.price || 0) * Number(it.qty || 0);
      });
    });

    const productStats = products.map(p => {
      const live = liveUnitsById[p.id] || { qty: 0, revenue: 0 };
      const baseQty = Number(p.soldBase || 0);
      const totalSold = live.qty + baseQty;
      const revenue = live.revenue + baseQty * Number(p.price || 0);
      const cost = Number(p.costPrice || Math.round(Number(p.price || 0) * 0.85));
      const marginPerUnit = Math.max(0, Number(p.price || 0) - cost);
      const profit = marginPerUnit * totalSold;
      const stock = getStockQty(p);
      const stockValue = stock * Number(p.price || 0);
      const stockCost = stock * cost;
      return { product: p, liveQty: live.qty, baseQty, totalSold, revenue, profit, stock, stockValue, stockCost };
    });

    const topSellers = [...productStats].sort((a, b) => b.totalSold - a.totalSold || b.revenue - a.revenue);
    const totalUnitsSold = productStats.reduce((s, x) => s + x.totalSold, 0);
    const totalRevenueAll = productStats.reduce((s, x) => s + x.revenue, 0);
    const totalProfitAll = productStats.reduce((s, x) => s + x.profit, 0);
    const totalStockUnits = productStats.reduce((s, x) => s + x.stock, 0);
    const totalStockValue = productStats.reduce((s, x) => s + x.stockValue, 0);
    const totalStockCost = productStats.reduce((s, x) => s + x.stockCost, 0);
    const lowStockItems = productStats.filter(x => x.stock <= 3).sort((a, b) => a.stock - b.stock);

    const catMap = {};
    categories.filter(c => c.id !== 'all').forEach(c => {
      catMap[c.id] = { id: c.id, name: c.name, sold: 0, revenue: 0, stock: 0 };
    });
    productStats.forEach(item => {
      const cats = Array.isArray(item.product.categories) && item.product.categories.length ? item.product.categories : [];
      if (cats.length && catMap[cats[0]]) {
        catMap[cats[0]].sold += item.totalSold;
        catMap[cats[0]].revenue += item.revenue;
        catMap[cats[0]].stock += item.stock;
      }
    });
    const catStats = Object.values(catMap).sort((a, b) => b.sold - a.sold);

    const brandMap = {};
    productStats.forEach(item => {
      const b = item.product.brand || 'Boshqa';
      if (!brandMap[b]) brandMap[b] = { brand: b, sold: 0, revenue: 0, stock: 0, models: 0 };
      brandMap[b].sold += item.totalSold;
      brandMap[b].revenue += item.revenue;
      brandMap[b].stock += item.stock;
      brandMap[b].models += 1;
    });
    const brandStats = Object.values(brandMap).sort((a, b) => b.sold - a.sold);

    return {
      activeOrders,
      liveRevenue,
      avgOrder: activeOrders.length ? Math.round(liveRevenue / activeOrders.length) : 0,
      productStats,
      topSellers,
      totalUnitsSold,
      totalRevenueAll,
      totalProfitAll,
      totalStockUnits,
      totalStockValue,
      totalStockCost,
      lowStockItems,
      catStats,
      brandStats,
      paymentCounts,
      statusCounts
    };
  }

  function renderAdminAnalyticsTab() {
    const a = computeAnalytics();
    const maxSold = Math.max(1, ...a.topSellers.slice(0, 5).map(x => x.totalSold));
    const maxCat = Math.max(1, ...a.catStats.map(c => c.sold));
    const maxBrand = Math.max(1, ...a.brandStats.map(b => b.sold));

    const statsHtml = `<div class="admin-stats">
      <div class="stat-card">
        <span>Umumiy savdo</span>
        <strong>${esc(formatMoney(a.totalRevenueAll))}</strong>
        <small>${a.totalUnitsSold} dona sotilgan · Onlayn: ${esc(formatMoney(a.liveRevenue))}</small>
      </div>
      <div class="stat-card">
        <span>Taxminiy sof foyda</span>
        <strong>${esc(formatMoney(a.totalProfitAll))}</strong>
        <small>O‘rtacha buyurtma: ${a.avgOrder ? esc(formatMoney(a.avgOrder)) : '—'}</small>
      </div>
      <div class="stat-card">
        <span>Ombor zaxirasi</span>
        <strong>${a.totalStockUnits} dona</strong>
        <small>Qiymati: ${esc(formatMoney(a.totalStockValue))}</small>
      </div>
      <div class="stat-card">
        <span>Buyurtma va faollik</span>
        <strong>${a.activeOrders.length} / ${leads.length}</strong>
        <small>Buyurtmalar / Maslahat · Sevimli: ${favorites.size}</small>
      </div>
    </div>`;

    const topHtml = `<div class="admin-section">
      <div class="admin-section-title">
        <span>Eng zo‘r sotilgan tovarlar (Top 5)</span>
        <span class="small-copy">Jami ${a.totalUnitsSold} dona</span>
      </div>
      <div class="bar-list">
        ${a.topSellers.slice(0, 5).map((item, idx) => {
          const pct = Math.round((item.totalSold / maxSold) * 100);
          return `<div class="bar-row">
            <div class="bar-head">
              <span class="bar-label">
                <span class="rank-pill ${idx < 3 ? 'top' : ''}">#${idx + 1}</span>
                <strong>${esc(item.product.brand)} ${esc(item.product.name)}</strong>
              </span>
              <span class="small-copy"><strong style="color:var(--text)">${item.totalSold} ta</strong> · ${esc(formatMoney(item.revenue))}</span>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
          </div>`;
        }).join('')}
      </div>
    </div>`;

    const catHtml = `<div class="admin-section">
      <div class="admin-section-title"><span>Toifalar bo‘yicha sotuv</span></div>
      <div class="bar-list">
        ${a.catStats.map(c => `
          <div class="bar-row">
            <div class="bar-head">
              <strong>${esc(c.name)}</strong>
              <span class="small-copy">${c.sold} ta · Omborda: ${c.stock}</span>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width:${Math.round((c.sold / maxCat) * 100)}%"></div></div>
          </div>
        `).join('')}
      </div>
    </div>`;

    const brandHtml = `<div class="admin-section">
      <div class="admin-section-title"><span>Brendlar statistikasi</span></div>
      <div class="bar-list">
        ${a.brandStats.map(b => `
          <div class="bar-row">
            <div class="bar-head">
              <strong>${esc(b.brand)} <span class="small-copy">(${b.models} model)</span></strong>
              <span class="small-copy">${b.sold} sotilgan · ${b.stock} qoldiq</span>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width:${Math.round((b.sold / maxBrand) * 100)}%"></div></div>
          </div>
        `).join('')}
      </div>
    </div>`;

    const lowHtml = `<div class="admin-section">
      <div class="admin-section-title">
        <span>Ombor ogohlantirishlari (Kam qolganlar)</span>
        <button type="button" class="secondary small-btn" data-admin-tab="warehouse">Omborga o‘tish</button>
      </div>
      ${a.lowStockItems.length
        ? a.lowStockItems.map(item => `
            <div class="admin-prod-row" style="margin-bottom:7px">
              <img src="${esc(item.product.image || `assets/${item.product.id}.webp`)}" alt="" onerror="this.onerror=null;this.src='assets/mark.svg';">
              <div class="admin-prod-meta">
                <strong style="font-size:.9rem">${esc(item.product.brand)} ${esc(item.product.name)}</strong>
                <div class="small-copy">${item.stock === 0 ? 'Omborda tugagan' : `Atigi ${item.stock} dona qoldi`}</div>
              </div>
              <span class="stock-pill ${item.stock === 0 ? 'zero' : 'low'}">${item.stock} ta</span>
              <button type="button" class="secondary small-btn" data-stock-delta="${esc(item.product.id)}:5">+5 kirim</button>
            </div>
          `).join('')
        : '<p class="small-copy">Barcha mahsulotlar omborda yetarli miqdorda mavjud.</p>'}
    </div>`;

    const paymentEntries = Object.entries(a.paymentCounts);
    const paymentHtml = paymentEntries.length
      ? `<div class="admin-section">
          <div class="admin-section-title"><span>Onlayn buyurtmalarda to‘lov usullari</span></div>
          <div class="detail-badges" style="margin:0">
            ${paymentEntries.map(([pm, cnt]) => `<span class="status-pill ok">${esc(pm)}: ${cnt} ta</span>`).join('')}
          </div>
        </div>`
      : '';

    return `${statsHtml}${topHtml}<div class="admin-grid-2">${catHtml}${brandHtml}</div>${lowHtml}${paymentHtml}`;
  }

  function renderAdminWarehouseTab() {
    const a = computeAnalytics();
    const lowCount = a.productStats.filter(x => x.stock > 0 && x.stock <= 3).length;
    const zeroCount = a.productStats.filter(x => x.stock === 0).length;

    const q = normalized(warehouseQuery);
    const filtered = a.productStats.filter(item => {
      if (warehouseFilter === 'ok' && item.stock <= 3) return false;
      if (warehouseFilter === 'low' && (item.stock <= 0 || item.stock > 3)) return false;
      if (warehouseFilter === 'zero' && item.stock !== 0) return false;
      if (q && !normalized(`${item.product.brand} ${item.product.name}`).includes(q)) return false;
      return true;
    });

    const statsHtml = `<div class="admin-stats">
      <div class="stat-card"><span>Jami qoldiq</span><strong>${a.totalStockUnits} dona</strong><small>${products.length} ta model</small></div>
      <div class="stat-card"><span>Sotuv qiymati</span><strong>${esc(formatMoney(a.totalStockValue))}</strong><small>Tannarxda: ${esc(formatMoney(a.totalStockCost))}</small></div>
      <div class="stat-card"><span>Kam qolgan (1–3)</span><strong>${lowCount} ta</strong><small>Tez orada to‘ldirish kerak</small></div>
      <div class="stat-card"><span>Tugagan (0)</span><strong style="color:${zeroCount ? 'var(--danger)' : 'var(--lime)'}">${zeroCount} ta</strong><small>Buyurtma asosida</small></div>
    </div>`;

    const toolbar = `<div class="admin-toolbar">
      <div class="warehouse-filters">
        <button type="button" data-wh-filter="all" aria-pressed="${warehouseFilter === 'all'}">Barchasi (${products.length})</button>
        <button type="button" data-wh-filter="ok" aria-pressed="${warehouseFilter === 'ok'}">Yetarli</button>
        <button type="button" data-wh-filter="low" aria-pressed="${warehouseFilter === 'low'}">Kam qoldi (${lowCount})</button>
        <button type="button" data-wh-filter="zero" aria-pressed="${warehouseFilter === 'zero'}">Tugagan (${zeroCount})</button>
      </div>
      <input type="search" id="wh-search" value="${esc(warehouseQuery)}" placeholder="Ombordan qidirish…" style="padding:7px 11px;border-radius:8px;border:1px solid #3c4537;background:#10140f;font-size:.84rem;min-width:190px">
    </div>`;

    const listHtml = filtered.length
      ? filtered.map(item => {
          const p = item.product;
          const badgeClass = item.stock === 0 ? 'zero' : item.stock <= 3 ? 'low' : 'ok';
          const badgeLabel = item.stock === 0 ? 'Tugagan' : item.stock <= 3 ? 'Kam qoldi' : 'Yetarli';
          return `<div class="admin-prod-row">
            <img src="${esc(p.image || `assets/${p.id}.webp`)}" alt="" onerror="this.onerror=null;this.src='assets/mark.svg';">
            <div class="admin-prod-meta">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                <strong style="font-size:.93rem">${esc(p.brand)} ${esc(p.name)}</strong>
                <span class="stock-pill ${badgeClass}">${badgeLabel}</span>
              </div>
              <span class="small-copy">Narx: ${esc(formatMoney(p.price))} · Zaxira qiymati: ${esc(formatMoney(item.stockValue))} · Sotilgan: ${item.totalSold}</span>
            </div>
            <div class="stock-stepper">
              <button type="button" data-stock-delta="${esc(p.id)}:-1" aria-label="1 ta kamaytirish">−1</button>
              <input type="number" min="0" value="${item.stock}" data-stock-input="${esc(p.id)}" aria-label="${esc(p.name)} qoldiq soni">
              <button type="button" data-stock-delta="${esc(p.id)}:1" aria-label="1 ta qo‘shish">+1</button>
              <button type="button" data-stock-delta="${esc(p.id)}:5" aria-label="5 ta kirim qilish">+5</button>
            </div>
          </div>`;
        }).join('')
      : emptyState('box', 'Mos tovar topilmadi', 'Boshqa ombor filtrini tanlang.');

    return statsHtml + toolbar + listHtml;
  }

  function renderAdminOrdersTab() {
    const totalSales = orders
      .filter(o => o.status !== 'Bekor qilindi')
      .reduce((s, o) => s + Number(o.total || 0), 0);
    const statuses = ['Yangi', 'Tasdiqlangan', 'Yetkazildi', 'Bekor qilindi'];

    const statsHtml = `<div class="admin-stats">
      <div class="stat-card"><span>Jami buyurtmalar</span><strong>${orders.length} ta</strong></div>
      <div class="stat-card"><span>Savdo summasi</span><strong>${esc(formatMoney(totalSales))}</strong></div>
      <div class="stat-card"><span>Maslahat so‘rovlari</span><strong>${leads.length} ta</strong></div>
      <div class="stat-card"><span>Katalog modellari</span><strong>${products.length} ta</strong></div>
    </div>`;

    const ordersHtml = orders.length
      ? orders.map((o, idx) => `
          <div class="order-card">
            <div class="order-card-head">
              <div>
                <strong>#${esc(o.id)}</strong> · <span>${esc(o.customer.name)}</span>
                <span class="small-copy"> (${esc(o.customer.phone)})</span>
              </div>
              <div style="display:flex;gap:8px;align-items:center">
                <select class="status-select" data-order-status="${idx}" aria-label="Buyurtma holati">
                  ${statuses.map(st => `<option value="${st}" ${(o.status || 'Yangi') === st ? 'selected' : ''}>${st}</option>`).join('')}
                </select>
                <button type="button" class="icon-btn" style="width:30px;height:30px" data-admin-del-order="${idx}" aria-label="O‘chirish">${icon('trash')}</button>
              </div>
            </div>
            <div class="small-copy" style="margin-bottom:6px">${esc(o.dateLabel)} · ${esc(o.deliveryLabel)} · ${esc(o.payment)}</div>
            <div class="small-copy" style="color:var(--text);margin-bottom:6px">${o.items.map(i => `${esc(i.brand)} ${esc(i.name)}${i.variant ? ` (${esc(i.variant)})` : ''} × ${i.qty}`).join(', ')}</div>
            ${o.customer.address ? `<div class="small-copy">Manzil: ${esc(o.customer.address)}</div>` : ''}
            ${o.customer.note ? `<div class="small-copy">Izoh: ${esc(o.customer.note)}</div>` : ''}
            <div class="panel-actions" style="margin-top:8px">
              <strong style="color:var(--lime)">${esc(formatMoney(o.total))}</strong>
              <button type="button" class="secondary small-btn" data-copy-order="${idx}">${icon('copy')}Nusxalash</button>
            </div>
          </div>
        `).join('')
      : '<p class="small-copy" style="margin-bottom:18px">Hozircha buyurtmalar kelib tushmagan.</p>';

    const leadsHtml = leads.length
      ? leads.map((l, idx) => `
          <div class="order-card">
            <div class="order-card-head">
              <div><strong>${esc(l.name)}</strong> · <span class="small-copy">${esc(l.phone)}</span></div>
              <div style="display:flex;gap:8px;align-items:center">
                <button type="button" class="secondary small-btn" data-lead-toggle="${idx}">${esc(l.status || 'Yangi')}</button>
                <button type="button" class="icon-btn" style="width:30px;height:30px" data-admin-del-lead="${idx}" aria-label="O‘chirish">${icon('trash')}</button>
              </div>
            </div>
            <div class="small-copy">${esc(l.dateLabel)} · Maqsad: ${esc(l.purpose)}</div>
            ${l.note ? `<div class="small-copy" style="margin-top:4px;color:var(--text)">${esc(l.note)}</div>` : ''}
          </div>
        `).join('')
      : '<p class="small-copy">Hozircha maslahat so‘rovlari yo‘q.</p>';

    return `${statsHtml}
      <h3 style="margin-bottom:10px;font-size:1.05rem">Buyurtmalar</h3>
      ${ordersHtml}
      <h3 style="margin:18px 0 10px;font-size:1.05rem">Maslahat so‘rovlari</h3>
      ${leadsHtml}`;
  }

  function renderAdminProductsTab() {
    if (adminEditingId !== null) {
      const existing = adminEditingId === '__new__' ? null : productById.get(adminEditingId);
      const p = existing || {
        id: '',
        brand: '',
        name: '',
        categories: ['business'],
        cpu: '',
        ram: 16,
        ssd: '512 GB',
        screen: '',
        gpu: '',
        price: 10000000,
        old: '',
        costPrice: '',
        stockQty: 5,
        soldBase: 0,
        badge: '',
        tone: 'slate',
        inStock: true,
        warranty: CONTACT.warrantySummary || '12 oy rasmiy kafolat',
        desc: '',
        image: 'assets/zenbook.webp'
      };
      const imgPreview = adminProductDraftImg || p.image || (p.id ? `assets/${p.id}.webp` : 'assets/mark.svg');
      const tones = ['slate', 'blue', 'purple', 'olive', 'rose'];

      return `<form id="admin-product-form" class="checkout-form">
        <div class="admin-toolbar">
          <h3 style="font-size:1.05rem">${existing ? `${esc(p.name)} tahrirlash` : 'Yangi mahsulot qo‘shish'}</h3>
          <button type="button" class="secondary small-btn" data-admin-cancel-prod="1">Orqaga</button>
        </div>

        <div class="admin-grid-2">
          <label class="field"><span>Brend *</span><input type="text" name="brand" value="${esc(p.brand)}" placeholder="Masalan: ASUS" required></label>
          <label class="field"><span>Model nomi *</span><input type="text" name="name" value="${esc(p.name)}" placeholder="Masalan: Vivobook 15 OLED" required></label>
          <label class="field"><span>Narxi *</span><input type="number" name="price" value="${esc(p.price)}" min="0" step="1000" required></label>
          <label class="field"><span>Eski narxi (chegirma uchun)</span><input type="number" name="old" value="${esc(p.old || '')}" min="0" step="1000" placeholder="Ixtiyoriy"></label>
          <label class="field"><span>Tannarxi (foyda hisobi uchun)</span><input type="number" name="costPrice" value="${esc(p.costPrice || '')}" min="0" step="1000" placeholder="Ixtiyoriy"></label>
          <label class="field"><span>Ombordagi soni (dona)</span><input type="number" name="stockQty" value="${esc(getStockQty(p))}" min="0"></label>
          <label class="field"><span>Oldingi sotuvlar soni</span><input type="number" name="soldBase" value="${esc(p.soldBase || 0)}" min="0"></label>
          <label class="field"><span>Protsessor (CPU)</span><input type="text" name="cpu" value="${esc(p.cpu || '')}" placeholder="Core i7 / Ryzen 7"></label>
          <label class="field"><span>RAM (GB)</span><input type="number" name="ram" value="${esc(p.ram || 16)}" min="1"></label>
          <label class="field"><span>SSD xotira</span><input type="text" name="ssd" value="${esc(p.ssd || '')}" placeholder="512 GB"></label>
          <label class="field"><span>Ekran</span><input type="text" name="screen" value="${esc(p.screen || '')}" placeholder="15,6″ OLED"></label>
          <label class="field"><span>Videokarta (GPU)</span><input type="text" name="gpu" value="${esc(p.gpu || '')}" placeholder="RTX 4060 / Intel Iris"></label>
          <label class="field"><span>Badge (belgi)</span><input type="text" name="badge" value="${esc(p.badge || '')}" placeholder="Yangi, −10%, OLED…"></label>
          <label class="field"><span>Kafolat</span><input type="text" name="warranty" value="${esc(p.warranty || '')}"></label>
          <label class="field"><span>Fon rangi (Glow)</span>
            <select name="tone">${tones.map(t => `<option value="${t}" ${p.tone === t ? 'selected' : ''}>${t}</option>`).join('')}</select>
          </label>
        </div>

        <div class="field">
          <span>Toifalar</span>
          <div style="display:flex;flex-wrap:wrap;gap:12px">
            ${categories.filter(c => c.id !== 'all').map(c =>
              `<label class="check-field"><input type="checkbox" name="cat" value="${esc(c.id)}" ${(p.categories || []).includes(c.id) ? 'checked' : ''}>${esc(c.name)}</label>`
            ).join('')}
          </div>
        </div>

        <div class="field">
          <span>Rasm (URL/fayl yo‘li yoki qurilmadan yuklash)</span>
          <div class="img-preview-box">
            <img id="admin-img-preview" src="${esc(imgPreview)}" alt="" onerror="this.onerror=null;this.src='assets/mark.svg';">
            <div style="flex:1;display:grid;gap:7px">
              <input type="text" name="image" id="admin-img-url" value="${esc(adminProductDraftImg || p.image || (p.id ? `assets/${p.id}.webp` : ''))}" placeholder="assets/rog.webp yoki https://...">
              <input type="file" id="admin-img-file" accept="image/*" style="font-size:.78rem;border:0;padding:0;background:none">
            </div>
          </div>
        </div>

        <label class="field"><span>Tavsif</span><textarea name="desc">${esc(p.desc || '')}</textarea></label>
        <label class="check-field"><input type="checkbox" name="inStock" ${p.inStock !== false ? 'checked' : ''}>Sotuvda mavjud</label>

        <div class="panel-actions">
          <button type="button" class="secondary" data-admin-cancel-prod="1">Bekor qilish</button>
          <button type="submit" class="primary">${icon('check')}Saqlash</button>
        </div>
      </form>`;
    }

    return `<div class="admin-toolbar">
        <span class="small-copy">Jami ${products.length} ta mahsulot</span>
        <button type="button" class="primary small-btn" data-admin-edit-prod="__new__">${icon('plus')}Yangi mahsulot</button>
      </div>
      <div>
        ${products.map(p => `
          <div class="admin-prod-row">
            <img src="${esc(p.image || `assets/${p.id}.webp`)}" alt="" onerror="this.onerror=null;this.src='assets/mark.svg';">
            <div class="admin-prod-meta">
              <strong style="display:block;font-size:.94rem">${esc(p.brand)} ${esc(p.name)}</strong>
              <span class="small-copy">${esc(formatMoney(p.price))}${p.inStock === false ? ' · Buyurtma asosida' : ''}</span>
            </div>
            <div class="admin-prod-actions">
              <button type="button" class="secondary small-btn" data-admin-toggle-stock="${esc(p.id)}">${p.inStock === false ? 'Mavjud' : 'Tugadi'}</button>
              <button type="button" class="icon-btn" data-admin-edit-prod="${esc(p.id)}" aria-label="Tahrirlash">${icon('edit')}</button>
              <button type="button" class="icon-btn" data-admin-del-prod="${esc(p.id)}" aria-label="O‘chirish">${icon('trash')}</button>
            </div>
          </div>
        `).join('')}
      </div>`;
  }

  function renderAdminSettingsTab() {
    const swatches = ['#c1f950', '#38bdf8', '#fb923c', '#a78bfa', '#34d399', '#f43f5e'];
    const promoString = Object.entries(PROMOS).map(([k, v]) => `${k}:${v}`).join(', ');

    return `<form id="admin-settings-form" class="checkout-form">
      <div class="admin-grid-2">
        <label class="field"><span>Do‘kon nomi</span><input type="text" name="name" value="${esc(BRAND.name || '')}" required></label>
        <label class="field"><span>Sayt sarlavhasi (Title)</span><input type="text" name="siteTitle" value="${esc(BRAND.siteTitle || '')}"></label>
        <label class="field"><span>Telefon raqami</span><input type="text" name="phone" value="${esc(CONTACT.phone || '')}"></label>
        <label class="field"><span>Telegram (@ siz)</span><input type="text" name="telegram" value="${esc(CONTACT.telegram || '')}" placeholder="nexbook_uz"></label>
        <label class="field"><span>Manzil</span><input type="text" name="address" value="${esc(CONTACT.address || '')}"></label>
        <label class="field"><span>Ish vaqti</span><input type="text" name="hours" value="${esc(CONTACT.hours || '')}"></label>
        <label class="field"><span>Valyuta belgisi</span><input type="text" name="currencyLabel" value="${esc(CURRENCY.label || 'so‘m')}"></label>
        <label class="field"><span>Valyuta joylashuvi</span>
          <select name="currencyPos">
            <option value="after" ${CURRENCY.position !== 'before' ? 'selected' : ''}>Summa keyin (10 000 so‘m)</option>
            <option value="before" ${CURRENCY.position === 'before' ? 'selected' : ''}>Summa oldin ($500)</option>
          </select>
        </label>
      </div>

      <label class="field">
        <span>Urg‘u rangi (Accent color)</span>
        <div class="swatch-row">
          <input type="color" name="accentColor" id="admin-color-picker" value="${esc(BRAND.accentColor || '#c1f950')}" style="width:48px;height:38px;padding:2px;cursor:pointer">
          ${swatches.map(hex => `<button type="button" class="swatch ${(BRAND.accentColor || '').toLowerCase() === hex ? 'active' : ''}" data-admin-swatch="${hex}" style="background:${hex}" aria-label="${hex}"></button>`).join('')}
        </div>
      </label>

      <label class="field"><span>Do‘kon shiori (Tagline)</span><input type="text" name="tagline" value="${esc(BRAND.tagline || '')}"></label>
      <label class="field"><span>Promo-kodlar (KOD:FOIZ vergul bilan)</span><input type="text" name="promos" value="${esc(promoString)}" placeholder="NEXBOOK5:5, YANGI10:10"></label>
      <label class="field"><span>Yangi Admin PIN kodi</span><input type="text" name="pin" value="${esc(ADMIN.pin || '1234')}" required></label>
      <label class="check-field"><input type="checkbox" name="installmentEnabled" ${INSTALLMENT.enabled ? 'checked' : ''}>Muddatli to‘lov hisoblagichini ko‘rsatish</label>

      <button type="submit" class="primary full">${icon('check')}Sozlamalarni saqlash</button>
    </form>`;
  }

  function renderAdminExportTab() {
    return `<div style="display:grid;gap:14px">
      <p class="small-copy">Admin panelda qilingan barcha o‘zgarishlar hozir brauzeringizda jonli ishlayapti. Saytni boshqa biznesga yoki hostingga tayyor holda berish uchun yangilangan <code>config.js</code> va <code>store.js</code> fayllarini yuklab olib <code>dist/</code> papkasiga almashtiring.</p>
      <div class="admin-grid-2">
        <button type="button" class="primary" data-action="admin-dl-config">${icon('download')}config.js yuklab olish</button>
        <button type="button" class="primary" data-action="admin-dl-store">${icon('download')}store.js yuklab olish</button>
      </div>
      <div class="panel-footer" style="margin-top:4px;display:grid;gap:10px">
        <strong style="font-size:.94rem">Zaxira nusxa (JSON)</strong>
        <div class="admin-grid-2">
          <button type="button" class="secondary" data-action="admin-export-json">${icon('download')}JSON eksport</button>
          <label class="secondary" style="cursor:pointer">${icon('plus')}JSON import<input type="file" id="admin-import-json" accept="application/json" hidden></label>
        </div>
        <button type="button" class="secondary" style="color:var(--danger);border-color:#5a3737" data-action="admin-reset-all">Boshlang‘ich holatga qaytarish</button>
      </div>
    </div>`;
  }

  function compressImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 640;
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/webp', 0.86));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* -------------------- PHONE & FORMATTING -------------------- */

  function formatUzPhone(value) {
    let digits = String(value || '').replace(/\D/g, '');
    if (digits.startsWith('998')) digits = digits.slice(3);
    digits = digits.slice(0, 9);
    if (!digits.length) return '';
    let out = '+998';
    if (digits.length > 0) out += ` ${digits.slice(0, 2)}`;
    if (digits.length > 2) out += ` ${digits.slice(2, 5)}`;
    if (digits.length > 5) out += `-${digits.slice(5, 7)}`;
    if (digits.length > 7) out += `-${digits.slice(7, 9)}`;
    return out;
  }

  function validatePhone(value) {
    const digits = String(value || '').replace(/\D/g, '');
    return digits.length >= 9;
  }

  const actions = {
    close: closePanel,
    home: () => {
      closePanel();
      programmaticScrollUntil = Date.now() + 800;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      activeNav('home');
    },
    catalog: () => catalogView(null, null, 'catalog'),
    'hero-catalog': () => catalogView(SLIDES[slideIndex]?.category || 'all', cleanFilters, 'catalog'),
    'prev-slide': () => chooseSlide(slideIndex - 1),
    'next-slide': () => chooseSlide(slideIndex + 1),
    search: showSearch,
    cart: showCart,
    favorites: showFavorites,
    brands: showBrands,
    filters: showFilters,
    menu: showMenu,
    compare: showCompare,
    admin: showAdmin,
    'admin-lock': () => {
      try { sessionStorage.removeItem(adminSessionKey); } catch {}
      showAdmin();
      notify('Admin panel qulflandi');
    },
    'admin-dl-config': () => {
      const content = `/**\n * BIZNES SOZLAMALARI (Admin paneldan eksport qilingan)\n */\nwindow.STORE_CONFIG = ${JSON.stringify(CFG, null, 2)};\n`;
      downloadTextFile('config.js', content);
      notify('config.js yuklab olindi');
    },
    'admin-dl-store': () => {
      const content = `/**\n * KATALOG MA'LUMOTLARI (Admin paneldan eksport qilingan)\n */\nconst categories = ${JSON.stringify(categories, null, 2)};\n\nconst specFields = [\n  { key: 'cpu', label: 'Protsessor', icon: 'cpu', card: true },\n  { key: 'ram', label: 'Tezkor xotira', icon: 'ram', card: true, format: val => \`\${val} GB\`, filterable: true, filterLabel: 'Tezkor xotira (RAM)', filterUnit: 'GB', minSuffix: 'va ko‘proq' },\n  { key: 'ssd', label: 'Doimiy xotira (SSD)', icon: 'disk', card: true },\n  { key: 'screen', label: 'Ekran', icon: 'screen', card: false },\n  { key: 'gpu', label: 'Videokarta (GPU)', icon: 'gpu', card: false }\n];\n\nconst products = ${JSON.stringify(products, null, 2)};\n`;
      downloadTextFile('store.js', content);
      notify('store.js yuklab olindi');
    },
    'admin-export-json': () => {
      downloadTextFile(`${(BRAND.name || 'store').toLowerCase()}-backup.json`, JSON.stringify({ config: CFG, products }, null, 2));
      notify('JSON zaxira nusxa yuklandi');
    },
    'admin-reset-all': () => {
      try { localStorage.removeItem(adminStorageKey); } catch {}
      Object.keys(CFG).forEach(k => delete CFG[k]);
      Object.assign(CFG, JSON.parse(JSON.stringify(BASE_CFG)));
      products.length = 0;
      products.push(...JSON.parse(JSON.stringify(BASE_PRODUCTS)));
      ({ BRAND, CONTACT, CURRENCY, INSTALLMENT, FEATURES, ADMIN, UI, SLIDES, PROMOS, DELIVERY, PAYMENTS } = getRefs());
      rebuildCatalogIndex();
      hydrateBusinessConfig();
      renderCatalog();
      showAdmin();
      notify('Boshlang‘ich holat tiklandi');
    },
    'clear-compare': () => {
      compareIds = [];
      save();
      document.querySelectorAll('.compare-product').forEach(b => {
        b.classList.remove('compared');
        b.setAttribute('aria-pressed', 'false');
      });
      notify('Taqqoslash ro‘yxati tozalandi');
    },
    deals: () => catalogView('all', { sale: true }, 'deals'),
    reset: () => catalogView('all', cleanFilters, 'catalog'),
    'reset-form': () => {
      const form = $('#filter-form');
      if (!form) return;
      for (const el of form.querySelectorAll('select')) el.selectedIndex = 0;
      if (form.elements.sale) form.elements.sale.checked = false;
      if (form.elements.stock) form.elements.stock.checked = false;
    },
    'remove-promo': () => {
      appliedPromo = '';
      save();
      showCart();
      notify('Promo-kod bekor qilindi');
    },
    'clear-cart': () => {
      cart = {};
      appliedPromo = '';
      save();
      showCart();
      notify('Savatcha tozalandi');
    },
    checkout: showCheckout,
    orders: showOrders,
    consult: showConsult,
    'copy-order': () => {
      if (lastOrder) copyText(formatOrderMessage(lastOrder), 'Buyurtma matni nusxalandi');
    },
    'download-order': () => {
      if (lastOrder) {
        downloadTextFile(`${UI.orderFilePrefix || 'Buyurtma'}-${lastOrder.id}.txt`, formatOrderMessage(lastOrder));
        notify('Buyurtma cheki yuklab olindi');
      }
    },
    'scroll-top': () => window.scrollTo({ top: 0, behavior: 'smooth' })
  };

  document.addEventListener('click', event => {
    const btn = event.target.closest('button, a');
    if (!btn) return;
    const d = btn.dataset;

    if (d.action) {
      actions[d.action]?.();
      return;
    }
    if (d.nav === 'catalog') {
      event.preventDefault();
      catalogView('all', cleanFilters, 'catalog');
      return;
    }
    if (d.nav === 'contact') {
      event.preventDefault();
      closePanel();
      scrollToSection('contact', 'contact');
      return;
    }
    if (d.nav === 'home' || btn.matches('.logo')) {
      event.preventDefault();
      actions.home();
      return;
    }
    if (d.slide !== undefined) {
      chooseSlide(Number(d.slide));
      return;
    }
    if (d.category) {
      category = d.category;
      renderCatalog();
      document.querySelector(`[data-category="${CSS.escape(category)}"]`)?.focus({ preventScroll: true });
      return;
    }
    if (d.brand) {
      catalogView('all', { brand: d.brand }, 'catalog');
      return;
    }
    if (d.removeFilter) {
      filters[d.removeFilter] = cleanFilters[d.removeFilter];
      renderCatalog();
      return;
    }
    if (d.detail) {
      showDetail(d.detail);
      return;
    }
    if (d.variant) {
      showDetail(detailState.id, d.variant);
      return;
    }
    if (d.instMonth) {
      detailState.months = Number(d.instMonth);
      showDetail(detailState.id, detailState.variantId);
      return;
    }
    if (d.addDetail) {
      addToCart(d.addDetail, detailState.variantId);
      return;
    }
    if (d.fav) {
      toggleFavorite(d.fav);
      return;
    }
    if (d.compare) {
      toggleCompare(d.compare);
      return;
    }
    if (d.add) {
      addToCart(d.add);
      return;
    }
    if (d.copyOrder !== undefined) {
      const o = orders[Number(d.copyOrder)];
      if (o) copyText(formatOrderMessage(o), 'Buyurtma nusxalandi');
      return;
    }
    if (d.adminTab) {
      adminTab = d.adminTab;
      adminEditingId = null;
      adminProductDraftImg = '';
      showAdmin();
      return;
    }
    if (d.adminEditProd !== undefined) {
      adminEditingId = d.adminEditProd;
      adminProductDraftImg = '';
      showAdmin();
      return;
    }
    if (d.adminCancelProd) {
      adminEditingId = null;
      adminProductDraftImg = '';
      showAdmin();
      return;
    }
    if (d.whFilter) {
      warehouseFilter = d.whFilter;
      showAdmin();
      return;
    }
    if (d.stockDelta) {
      const [pid, deltaStr] = d.stockDelta.split(':');
      const p = productById.get(pid);
      if (p) {
        syncProductStock(p, getStockQty(p) + Number(deltaStr || 0));
        saveAdminOverrides({ products });
        renderCatalog();
        showAdmin();
        notify(`${p.name}: qoldiq ${p.stockQty} ta`);
      }
      return;
    }
    if (d.adminToggleStock) {
      const p = productById.get(d.adminToggleStock);
      if (p) {
        const nextInStock = p.inStock === false;
        syncProductStock(p, nextInStock ? Math.max(1, getStockQty(p) || 5) : 0);
        saveAdminOverrides({ products });
        renderCatalog();
        showAdmin();
        notify(p.inStock ? 'Mahsulot sotuvda mavjud qilindi' : 'Buyurtma asosida holatiga o‘tkazildi');
      }
      return;
    }
    if (d.adminDelProd) {
      const idx = products.findIndex(p => p.id === d.adminDelProd);
      if (idx !== -1) {
        products.splice(idx, 1);
        rebuildCatalogIndex();
        saveAdminOverrides({ products });
        restore();
        save();
        renderCatalog();
        showAdmin();
        notify('Mahsulot o‘chirildi');
      }
      return;
    }
    if (d.adminDelOrder !== undefined) {
      orders.splice(Number(d.adminDelOrder), 1);
      save();
      showAdmin();
      return;
    }
    if (d.leadToggle !== undefined) {
      const lead = leads[Number(d.leadToggle)];
      if (lead) {
        lead.status = lead.status === 'Bog‘lanildi' ? 'Yangi' : 'Bog‘lanildi';
        save();
        showAdmin();
      }
      return;
    }
    if (d.adminDelLead !== undefined) {
      leads.splice(Number(d.adminDelLead), 1);
      save();
      showAdmin();
      return;
    }
    if (d.adminSwatch) {
      const picker = $('#admin-color-picker');
      if (picker) picker.value = d.adminSwatch;
      document.querySelectorAll('.swatch').forEach(s => s.classList.toggle('active', s.dataset.adminSwatch === d.adminSwatch));
      return;
    }
    if (d.plus || d.minus || d.delete) {
      const key = d.plus || d.minus || d.delete;
      const maxQty = FEATURES.maxCartQty || 99;
      if (d.plus) {
        const { productId } = parseCartKey(key);
        const p = productById.get(productId);
        const stock = getStockQty(p);
        if (p && typeof p.stockQty === 'number' && productCartQty(productId) >= stock) {
          notify(`Omborda bu modeldan faqat ${stock} ta qolgan`);
          return;
        }
        cart[key] = Math.min(maxQty, (cart[key] || 0) + 1);
      }
      if (d.minus) cart[key] = (cart[key] || 0) - 1;
      if (d.delete || cart[key] <= 0) delete cart[key];
      save();
      showCart();
      const actionKey = d.plus ? 'plus' : d.minus ? 'minus' : 'delete';
      panel.querySelector(`[data-${actionKey}="${CSS.escape(key)}"]`)?.focus({ preventScroll: true });
    }
  });

  document.addEventListener('input', event => {
    const t = event.target;
    if (t.id === 'search-input') {
      searchText = t.value;
      searchResults();
      return;
    }
    if (t.id === 'wh-search') {
      warehouseQuery = t.value;
      showAdmin();
      const inp = $('#wh-search');
      if (inp) {
        inp.focus();
        inp.setSelectionRange(inp.value.length, inp.value.length);
      }
      return;
    }
    if (t.id === 'checkout-phone' || t.id === 'consult-phone') {
      if (event.inputType && event.inputType.startsWith('delete')) return;
      const formatted = formatUzPhone(t.value);
      if (formatted) t.value = formatted;
      return;
    }
    if (t.id === 'admin-img-url') {
      const prev = $('#admin-img-preview');
      if (prev && t.value.trim()) prev.src = t.value.trim();
    }
  });

  document.addEventListener('change', async event => {
    const t = event.target;
    if (t.id === 'sort') {
      sortOrder = t.value;
      renderCatalog();
      return;
    }
    if (t.dataset.stockInput !== undefined) {
      const p = productById.get(t.dataset.stockInput);
      if (p) {
        syncProductStock(p, t.value);
        saveAdminOverrides({ products });
        renderCatalog();
        showAdmin();
        notify(`${p.name}: qoldiq ${p.stockQty} ta saqlandi`);
      }
      return;
    }
    if (t.dataset.orderStatus !== undefined) {
      const o = orders[Number(t.dataset.orderStatus)];
      if (o) {
        o.status = t.value;
        adjustOrderInventory(o, o.status !== 'Bekor qilindi');
        save();
        showAdmin();
        notify('Buyurtma holati yangilandi');
      }
      return;
    }
    if (t.id === 'admin-img-file' && t.files?.[0]) {
      try {
        const dataUrl = await compressImageFile(t.files[0]);
        adminProductDraftImg = dataUrl;
        const urlInput = $('#admin-img-url');
        const prev = $('#admin-img-preview');
        if (urlInput) urlInput.value = dataUrl;
        if (prev) prev.src = dataUrl;
        notify('Rasm yuklandi');
      } catch {
        notify('Rasmni o‘qib bo‘lmadi');
      }
      return;
    }
    if (t.id === 'admin-import-json' && t.files?.[0]) {
      try {
        const parsed = JSON.parse(await t.files[0].text());
        if (parsed.config) Object.assign(CFG, parsed.config);
        if (Array.isArray(parsed.products)) {
          products.length = 0;
          products.push(...parsed.products);
        }
        ({ BRAND, CONTACT, CURRENCY, INSTALLMENT, FEATURES, ADMIN, UI, SLIDES, PROMOS, DELIVERY, PAYMENTS } = getRefs());
        rebuildCatalogIndex();
        saveAdminOverrides({ config: parsed.config, products });
        hydrateBusinessConfig();
        renderCatalog();
        showAdmin();
        notify('JSON zaxira nusxadan tiklandi');
      } catch {
        notify('JSON fayl formati noto‘g‘ri');
      }
      return;
    }
    if (t.form && t.form.id === 'checkout-form' && t.name === 'delivery') {
      checkoutState.deliveryId = t.value;
      const totals = getTotals(checkoutState.deliveryId);
      const addrField = $('#address-field');
      if (addrField) addrField.hidden = !totals.deliveryObj?.requiresAddress;
      const feeEl = $('#checkout-delivery-fee');
      const totalEl = $('#checkout-total');
      if (feeEl) feeEl.textContent = totals.deliveryFee ? formatMoney(totals.deliveryFee) : 'Bepul';
      if (totalEl) totalEl.textContent = formatMoney(totals.total);
    }
    if (t.form && t.form.id === 'checkout-form' && t.name === 'payment') {
      checkoutState.payment = t.value;
    }
  });

  document.addEventListener('submit', async event => {
    const form = event.target;
    if (form.id === 'filter-form') {
      event.preventDefault();
      const data = new FormData(form);
      catalogView(category, {
        brand: data.get('brand') || '',
        specMin: Number(data.get('specMin') || 0),
        ceiling: Number(data.get('ceiling') || 0),
        sale: data.has('sale'),
        stock: data.has('stock')
      }, data.has('sale') ? 'deals' : 'catalog');
      return;
    }

    if (form.id === 'promo-form') {
      event.preventDefault();
      const code = String(new FormData(form).get('code') || '').trim().toUpperCase();
      if (!code || !PROMOS[code]) {
        notify('Promo-kod topilmadi');
        return;
      }
      appliedPromo = code;
      save();
      showCart();
      notify(`${code} promo-kodi (−${PROMOS[code]}%) qo‘llandi`);
      return;
    }

    if (form.id === 'admin-login-form') {
      event.preventDefault();
      const pin = String(new FormData(form).get('pin') || '').trim();
      const errEl = form.querySelector('[data-err="apin"]');
      if (pin !== String(ADMIN.pin || '1234')) {
        if (errEl) {
          errEl.textContent = 'PIN kod noto‘g‘ri';
          errEl.hidden = false;
        }
        return;
      }
      try { sessionStorage.setItem(adminSessionKey, '1'); } catch {}
      showAdmin();
      notify('Admin panelga kirildi');
      return;
    }

    if (form.id === 'admin-product-form') {
      event.preventDefault();
      const data = new FormData(form);
      const cats = data.getAll('cat');
      const existing = adminEditingId && adminEditingId !== '__new__' ? productById.get(adminEditingId) : null;
      const slugBase = normalized(`${data.get('brand')}-${data.get('name')}`).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
      const id = existing ? existing.id : (productById.has(slugBase) ? `${slugBase}-${String(Date.now()).slice(-4)}` : slugBase);
      const oldPrice = Number(data.get('old') || 0);
      const costPrice = Number(data.get('costPrice') || 0);
      const stockQty = Math.max(0, Math.round(Number(data.get('stockQty') || 0)));
      const soldBase = Math.max(0, Math.round(Number(data.get('soldBase') || 0)));
      const newProd = {
        ...(existing || {}),
        id,
        brand: String(data.get('brand') || '').trim(),
        name: String(data.get('name') || '').trim(),
        categories: cats.length ? cats : ['business'],
        cpu: String(data.get('cpu') || '').trim(),
        ram: Number(data.get('ram') || 8),
        ssd: String(data.get('ssd') || '').trim(),
        screen: String(data.get('screen') || '').trim(),
        gpu: String(data.get('gpu') || '').trim(),
        price: Number(data.get('price') || 0),
        old: oldPrice > 0 ? oldPrice : undefined,
        costPrice: costPrice > 0 ? costPrice : undefined,
        stockQty,
        soldBase,
        badge: String(data.get('badge') || '').trim() || undefined,
        tone: String(data.get('tone') || 'slate'),
        inStock: data.has('inStock') && stockQty > 0,
        warranty: String(data.get('warranty') || '').trim(),
        desc: String(data.get('desc') || '').trim(),
        image: String(data.get('image') || '').trim() || undefined
      };
      if (existing) {
        const idx = products.findIndex(x => x.id === existing.id);
        if (idx !== -1) products[idx] = newProd;
      } else {
        products.unshift(newProd);
      }
      rebuildCatalogIndex();
      if (saveAdminOverrides({ products })) {
        adminEditingId = null;
        adminProductDraftImg = '';
        renderCatalog();
        updateCounts();
        showAdmin();
        notify(existing ? 'Mahsulot yangilandi' : 'Yangi mahsulot qo‘shildi');
      }
      return;
    }

    if (form.id === 'admin-settings-form') {
      event.preventDefault();
      const data = new FormData(form);
      const promoPairs = String(data.get('promos') || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const nextPromos = {};
      for (const pair of promoPairs) {
        const [k, v] = pair.split(':').map(x => x.trim());
        if (k && Number(v) > 0) nextPromos[k.toUpperCase()] = Number(v);
      }

      const nextBrand = {
        name: String(data.get('name') || '').trim() || 'NEXBOOK',
        siteTitle: String(data.get('siteTitle') || '').trim(),
        tagline: String(data.get('tagline') || '').trim(),
        accentColor: String(data.get('accentColor') || '#c1f950')
      };
      const nextContact = {
        phone: String(data.get('phone') || '').trim(),
        phoneHref: `tel:${String(data.get('phone') || '').replace(/\s+/g, '')}`,
        telegram: String(data.get('telegram') || '').replace(/^@/, '').trim(),
        address: String(data.get('address') || '').trim(),
        hours: String(data.get('hours') || '').trim()
      };
      const nextCurrency = {
        label: String(data.get('currencyLabel') || 'so‘m').trim(),
        position: String(data.get('currencyPos') || 'after')
      };
      const nextInstallment = { enabled: data.has('installmentEnabled') };
      const nextAdmin = { pin: String(data.get('pin') || '1234').trim() || '1234' };

      Object.assign(CFG.brand, nextBrand);
      Object.assign(CFG.contact, nextContact);
      Object.assign(CFG.currency, nextCurrency);
      Object.assign(CFG.installment, nextInstallment);
      CFG.promoCodes = nextPromos;
      Object.assign(CFG.admin, nextAdmin);
      ({ BRAND, CONTACT, CURRENCY, INSTALLMENT, FEATURES, ADMIN, UI, SLIDES, PROMOS, DELIVERY, PAYMENTS } = getRefs());

      saveAdminOverrides({
        config: {
          brand: nextBrand,
          contact: nextContact,
          currency: nextCurrency,
          installment: nextInstallment,
          promoCodes: nextPromos,
          admin: nextAdmin
        }
      });
      hydrateBusinessConfig();
      renderCatalog();
      showAdmin();
      notify('Do‘kon sozlamalari saqlandi');
      return;
    }

    if (form.id === 'checkout-form') {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const phone = String(data.get('phone') || '').trim();
      const deliveryId = String(data.get('delivery') || DELIVERY[0].id);
      const address = String(data.get('address') || '').trim();
      const payment = String(data.get('payment') || PAYMENTS[0]);
      const note = String(data.get('note') || '').trim();

      const totals = getTotals(deliveryId);
      const needsAddr = Boolean(totals.deliveryObj?.requiresAddress);

      const errs = {
        name: name.length < 2 ? 'Iltimos, ismingizni kiriting' : '',
        phone: !validatePhone(phone) ? 'To‘g‘ri telefon raqamini kiriting' : '',
        address: needsAddr && address.length < 4 ? 'Yetkazib berish manzilini kiriting' : ''
      };

      let hasErr = false;
      for (const [k, msg] of Object.entries(errs)) {
        const errEl = form.querySelector(`[data-err="${k}"]`);
        if (errEl) {
          errEl.textContent = msg;
          errEl.hidden = !msg;
        }
        if (msg) hasErr = true;
      }
      if (hasErr) return;

      const now = new Date();
      const orderId = `${(BRAND.name || 'NB').replace(/[^A-Z0-9]/gi, '').slice(0, 2).toUpperCase() || 'NB'}-${String(now.getTime()).slice(-5)}`;
      const order = {
        id: orderId,
        status: 'Yangi',
        dateLabel: now.toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        customer: { name, phone, address: needsAddr ? address : '', note },
        deliveryLabel: totals.deliveryObj?.label || '',
        deliveryFee: totals.deliveryFee,
        payment,
        promoCode: appliedPromo,
        discount: totals.discount,
        subtotal: totals.subtotal,
        total: totals.total,
        items: totals.entries.map(e => ({
          id: e.product.id,
          brand: e.product.brand,
          name: e.product.name,
          variant: e.variantLabel,
          price: e.price,
          qty: e.qty
        }))
      };

      orders = [order, ...orders].slice(0, 30);
      cart = {};
      appliedPromo = '';
      adjustOrderInventory(order, true);
      save();

      const msgText = formatOrderMessage(order);
      dispatchOrderToIntegrations(msgText, { type: 'order', order });
      showOrderSuccess(order);
      return;
    }

    if (form.id === 'consult-form') {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const phone = String(data.get('phone') || '').trim();
      const purpose = String(data.get('purpose') || '');
      const note = String(data.get('note') || '').trim();

      const nameErr = form.querySelector('[data-err="cname"]');
      const phoneErr = form.querySelector('[data-err="cphone"]');
      if (nameErr) { nameErr.textContent = name.length < 2 ? 'Ismingizni kiriting' : ''; nameErr.hidden = name.length >= 2; }
      if (phoneErr) { phoneErr.textContent = !validatePhone(phone) ? 'Telefon raqamini kiriting' : ''; phoneErr.hidden = validatePhone(phone); }
      if (name.length < 2 || !validatePhone(phone)) return;

      const lead = {
        id: String(Date.now()).slice(-5),
        dateLabel: new Date().toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        name,
        phone,
        purpose,
        note,
        status: 'Yangi'
      };
      leads = [lead, ...leads].slice(0, 30);
      save();

      const text = [
        `${BRAND.name || 'NEXBOOK'} — Maslahat so‘rovi`,
        `Mijoz: ${name}`,
        `Telefon: ${phone}`,
        `Maqsad: ${purpose}`,
        note ? `Izoh: ${note}` : ''
      ].filter(Boolean).join('\n');

      dispatchOrderToIntegrations(text, { type: 'consultation', name, phone, purpose, note });
      const tgConsultLink = CONTACT.telegram
        ? `https://t.me/${encodeURIComponent(CONTACT.telegram)}?text=${encodeURIComponent(text)}`
        : '';
      openPanel(
        'consult-done',
        'So‘rov qabul qilindi',
        `<div class="order-success">
          <div class="success-badge">${icon('check')}</div>
          <h3 style="font-size:1.2rem;margin-bottom:6px">Rahmat, ${esc(name)}!</h3>
          <p class="small-copy">Mutaxassisimiz tez orada <strong>${esc(phone)}</strong> raqamiga bog‘lanadi.</p>
        </div>
        <div style="display:grid;gap:9px">
          ${tgConsultLink ? `<a class="primary full" href="${esc(tgConsultLink)}" target="_blank" rel="noopener noreferrer">${icon('send')}Telegramda yozish</a>` : ''}
          <button type="button" class="secondary full" data-action="close">Yopish</button>
        </div>`
      );
    }
  });

  // Keyboard shortcuts: Ctrl+K / "/" for Search, Ctrl+Shift+A for Admin, Left/Right arrows for Hero
  document.addEventListener('keydown', event => {
    const tag = document.activeElement?.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      showAdmin();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      showSearch();
      return;
    }
    if (!typing && !panel.open && event.key === '/') {
      event.preventDefault();
      showSearch();
      return;
    }
    if (!typing && !panel.open && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      const heroRect = $('.hero')?.getBoundingClientRect();
      if (heroRect && heroRect.bottom > 80 && heroRect.top < window.innerHeight) {
        chooseSlide(slideIndex + (event.key === 'ArrowRight' ? 1 : -1));
      }
    }
  });

  // Touch swipe for Hero Carousel
  const heroEl = $('.hero');
  if (heroEl) {
    let touchStartX = 0;
    let touchStartY = 0;
    heroEl.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    heroEl.addEventListener('touchend', e => {
      if (!touchStartX || e.changedTouches.length !== 1) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      touchStartX = 0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        chooseSlide(slideIndex + (dx < 0 ? 1 : -1));
      }
    }, { passive: true });
  }

  // Subtle hover spotlight on product cards (desktop pointer only)
  const grid = $('#product-grid');
  if (grid && matchMedia('(hover: hover)').matches) {
    grid.addEventListener('pointermove', e => {
      const visual = e.target.closest('.product-visual');
      if (!visual) return;
      const rect = visual.getBoundingClientRect();
      visual.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      visual.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  }

  // Scroll tracking (header elevation, scroll-top button, clean active nav)
  let scrollTicking = false;
  function handleScroll() {
    scrollTicking = false;
    const y = window.scrollY;
    $('#site-header').classList.toggle('scrolled', y > 12);
    $('#scroll-top').hidden = y < 440;

    if (Date.now() < programmaticScrollUntil) return;
    const contactTop = $('#contact')?.getBoundingClientRect().top ?? 9999;
    const catalogTop = $('#catalog')?.getBoundingClientRect().top ?? 9999;
    if (contactTop <= window.innerHeight * 0.6) activeNav('contact');
    else if (catalogTop <= 180) activeNav(filters.sale ? 'deals' : 'catalog');
    else activeNav('home');
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(handleScroll);
    }
  }, { passive: true });

  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === adminStorageKey || event.key === null) {
      applyAdminOverrides();
      rebuildCatalogIndex();
      hydrateBusinessConfig();
      restore();
      updateCounts();
      renderCatalog();
      if (panelName === 'cart') showCart();
      if (panelName === 'favorites') showFavorites();
      if (panelName === 'compare') showCompare();
      if (panelName === 'orders') showOrders();
      if (panelName === 'admin') showAdmin();
    }
  });

  // Initialize application
  document.querySelectorAll('i[data-icon]').forEach(el => {
    el.outerHTML = icon(el.dataset.icon);
  });
  applyAdminOverrides();
  rebuildCatalogIndex();
  hydrateBusinessConfig();
  restore();
  updateCounts();
  renderCatalog();
  chooseSlide(0, false);
  handleScroll();
  initReveal();
  runIntro();

  if (location.hash === '#admin' && ADMIN.enabled !== false) {
    setTimeout(showAdmin, 700);
  }
})();
