/* ============================================================
   CASE STUDY ENGINE — v5
   Native <dialog> element. showModal()/close() for open/close.
   slide-down panel animation before dialog closes.
   Focus trap, ESC, backdrop click — all native.
   ============================================================ */

(function () {
  'use strict';

  const registry = {};
  const studyMap  = {};

  // ── Fetch and inject overlay HTML ──
  const loaded = {};

  async function loadOverlay(overlayId) {
    if (loaded[overlayId]) return;
    loaded[overlayId] = true;
    try {
      const res  = await fetch(`${overlayId}.html`);
      const text = await res.text();
      const tmp  = document.createElement('div');
      tmp.innerHTML = text;
      while (tmp.firstChild) document.body.appendChild(tmp.firstChild);
      const entry = registry[overlayId];
      if (entry) _register(entry.cardId, overlayId);
    } catch (err) {
      console.error(`Failed to load ${overlayId}.html`, err);
      loaded[overlayId] = false;
    }
  }

  // ── Open via showModal() ──
  function openOverlay(overlayId) {
    const study = studyMap[overlayId];
    if (!study) return;
    const { dialog, panel, closeBtn } = study;

    panel.querySelectorAll('.cs-section').forEach(s => s.classList.remove('cs-visible'));
    panel.scrollTop = 0;
    panel.style.cssText = '';

    dialog.showModal();
    document.body.style.overflow = 'hidden';
    document.body.classList.add('cs-is-open');

    if (closeBtn) setTimeout(() => closeBtn.focus(), 100);

    setTimeout(() => setupReveal(panel), 600);
  }

  // ── Coordinated close — native dialog + CSS @starting-style/allow-discrete ──
  function animateClose(study) {
    const { dialog, panel, card } = study;

    if (!dialog.open || study._closing) return;
    study._closing = true;

    panel.querySelectorAll('.cs-section').forEach(s => s.classList.remove('cs-visible'));

    let handled = false;
    const done = (e) => {
      if (handled) return;
      if (e && e.target !== panel) return;
      handled = true;
      panel.removeEventListener('transitionend', done);
      clearTimeout(timer);
      study._closing = false;
      panel.scrollTop = 0;
      document.body.style.overflow = '';
      document.body.classList.remove('cs-is-open');
      if (card) card.focus();
    };

    panel.addEventListener('transitionend', done);
    const timer = setTimeout(done, 700); // fallback

    // Removing [open] starts the CSS exit transition
    dialog.close();
  }

  // ── Scroll reveal ──
  function setupReveal(panel) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('cs-visible'); obs.unobserve(e.target); }
      });
    }, { root: panel, threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    panel.querySelectorAll('.cs-section').forEach(s => obs.observe(s));
  }

  // ── Internal register (after overlay injected into DOM) ──
  function _register(cardId, overlayId) {
    const card   = document.getElementById(cardId);
    const dialog = document.getElementById(overlayId);
    if (!card || !dialog) return;

    const panel    = dialog.querySelector('.cs-panel');
    const closeBtn = dialog.querySelector('.cs-close-btn');

    const study = { card, dialog, panel, closeBtn, overlayId };
    studyMap[overlayId] = study;

    // ESC key or backdrop click → cancel event
    dialog.addEventListener('cancel', (e) => {
      e.preventDefault(); // stop native close — we animate first
      animateClose(study);
    });

    // dialog.close() called → close event
    dialog.addEventListener('close', () => {
      if (study._closing) return; // animateClose already handling
      // External close — clean up synchronously
      panel.scrollTop = 0;
      document.body.style.overflow = '';
      document.body.classList.remove('cs-is-open');
    });

    // Close button → animateClose()
    if (closeBtn) {
      closeBtn.addEventListener('click', () => animateClose(study));
    }

    // Next project navigation
    panel.querySelectorAll('[data-open]').forEach(el => {
      el.addEventListener('click', () => {
        const nextId = el.dataset.open;
        animateClose(study);
        setTimeout(() => ensureAndOpen(nextId), 700);
      });
    });

    // Back to top (QuickCheckout only)
    const backTop   = panel.querySelector('#cs-back-to-top');
    const backArrow = panel.querySelector('#cs-back-arrow');
    [backTop, backArrow].forEach(el => {
      if (!el) return;
      el.addEventListener('click', () => {
        animateClose(study);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 700);
      });
    });

    // Pending open — card was clicked before overlay was loaded
    if (registry[overlayId]?._pendingOpen) {
      registry[overlayId]._pendingOpen = false;
      requestAnimationFrame(() => requestAnimationFrame(() => openOverlay(overlayId)));
    }
  }

  // ── Ensure loaded then open ──
  async function ensureAndOpen(overlayId) {
    if (!loaded[overlayId]) {
      if (!registry[overlayId]) registry[overlayId] = {};
      registry[overlayId]._pendingOpen = true;
      await loadOverlay(overlayId);
      if (studyMap[overlayId]) {
        requestAnimationFrame(() => requestAnimationFrame(() => openOverlay(overlayId)));
      }
    } else {
      requestAnimationFrame(() => requestAnimationFrame(() => openOverlay(overlayId)));
    }
  }

  // ── Public register ──
  function register(cardId, overlayId) {
    registry[overlayId] = { cardId, overlayId };
    const card = document.getElementById(cardId);
    if (!card) return;

    if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
    if (!card.getAttribute('role')) card.setAttribute('role', 'button');
    card.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      card.click();
    });

    card.addEventListener('click', async () => {
      if (!loaded[overlayId]) {
        card.style.cursor = 'wait';
        await loadOverlay(overlayId);
        card.style.cursor = '';
        requestAnimationFrame(() => requestAnimationFrame(() => openOverlay(overlayId)));
      } else {
        openOverlay(overlayId);
      }
    });
  }

  window.CaseStudy = { register };

})();