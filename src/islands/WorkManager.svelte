<script lang="ts">
  import { onMount } from 'svelte';
  import { myLocation } from '../data/location';

  onMount(() => {
    initNavActiveState();
    initScrollSpy();
    initRotatingPhrases();
    initLocationWidget();
    initNdaProtection();
    initCardGlow();
    initProjectCards();
    initCaseStudies();
  });

  function initNavActiveState() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-menu .nav-link');
    let navigatingAway = false;
    navLinks.forEach(link => {
      link.addEventListener('click', function(this: HTMLAnchorElement, e: Event) {
        const href = this.getAttribute('href');
        if (href && !href.startsWith('#')) navigatingAway = true;
        navLinks.forEach(l => l.classList.remove('active'));
        mobileNavLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        Array.from(navLinks).filter(l => l.getAttribute('href') === href).forEach(l => l.classList.add('active'));
      });
    });
  }

  function initScrollSpy() {
    const navLinks = document.querySelectorAll('.nav-link');
    let navigatingAway = false;
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
      if (navigatingAway) return;
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        const match = Array.from(navLinks).find(l => l.getAttribute('href') === `#${id}`);
        if (match) {
          navLinks.forEach(l => l.classList.remove('active'));
          match.classList.add('active');
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(s => sectionObserver.observe(s));
  }

  function initRotatingPhrases() {
    const rotatingPhrases = [
      "I spend more time choosing music than actually listening to it.",
      "I can spot a misaligned pixel from across the room.",
      "My browser tabs are like my design layers—way too many.",
      "Coffee first, wireframes second, everything else maybe.",
      "I have strong opinions about button radius.",
      "Dark mode is not a phase, it's a lifestyle.",
      "I speak four languages: Italian, English, Spanish, and Design Systems."
    ];
    let currentPhraseIndex = 0;
    let phraseInterval: ReturnType<typeof setInterval>;
    function rotatePhrase() {
      const textElement = document.getElementById('rotatingText');
      if (!textElement) return;
      textElement.style.opacity = '0';
      textElement.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        currentPhraseIndex = (currentPhraseIndex + 1) % rotatingPhrases.length;
        textElement.textContent = rotatingPhrases[currentPhraseIndex];
        textElement.style.opacity = '1';
        textElement.style.transform = 'translateY(0)';
      }, 500);
    }
    function startPhraseRotation() { phraseInterval = setInterval(rotatePhrase, 5000); }
    function stopPhraseRotation() { clearInterval(phraseInterval); }
    if (!document.hidden) startPhraseRotation();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopPhraseRotation();
      else startPhraseRotation();
    });
  }

  function initLocationWidget() {
    const location = myLocation;
    const cityElement = document.getElementById('locationCity');
    if (cityElement) cityElement.textContent = `${location.city}, ${location.country}`;
    const isOnVacation = !(location.city === 'Madrid' && location.country === 'Spain');
    const vacationBadge = document.getElementById('vacationBadge');
    if (vacationBadge) vacationBadge.classList.toggle('show', isOnVacation);
    const cityMobileElement = document.getElementById('locationCityMobile');
    if (cityMobileElement) cityMobileElement.textContent = location.city;

    const schedule = window.requestIdleCallback
      ? (cb: IdleRequestCallback) => requestIdleCallback(cb, { timeout: 4000 })
      : (cb: () => void) => setTimeout(cb, 1000);

    schedule(async () => {
      const CACHE_KEY = 'weather_cache';
      const CACHE_TTL = 30 * 60 * 1000;
      let weatherData: any = null;
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, ts } = JSON.parse(cached);
          if (Date.now() - ts < CACHE_TTL) weatherData = data;
        }
      } catch (_) {}

      if (!weatherData) {
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true`);
          const json = await res.json();
          weatherData = json.current_weather;
          try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: weatherData, ts: Date.now() })); } catch (_) {}
        } catch (_) {
          const descEl = document.getElementById('weatherDesc');
          if (descEl) descEl.textContent = 'Weather unavailable';
          return;
        }
      }

      if (weatherData) {
        const temp = Math.round(weatherData.temperature);
        const weatherInfo = getWeatherInfo(weatherData.weathercode);
        const tempEl = document.getElementById('weatherTemp');
        if (tempEl) tempEl.textContent = `${temp}°C`;
        const iconEl = document.getElementById('weatherIcon');
        if (iconEl) iconEl.textContent = weatherInfo.icon;
        const descEl = document.getElementById('weatherDesc');
        if (descEl) descEl.textContent = weatherInfo.desc;
        const tempMobileEl = document.getElementById('weatherTempMobile');
        if (tempMobileEl) tempMobileEl.textContent = `${temp}°`;
        const iconMobileEl = document.getElementById('weatherIconMobile');
        if (iconMobileEl) iconMobileEl.textContent = weatherInfo.icon;
      }
    });
  }

  function getWeatherInfo(code: number): { icon: string; desc: string } {
    const weatherMap: Record<number, { icon: string; desc: string }> = {
      0: { icon: '☀️', desc: 'Clear' }, 1: { icon: '🌤️', desc: 'Mainly clear' },
      2: { icon: '⛅', desc: 'Partly cloudy' }, 3: { icon: '☁️', desc: 'Cloudy' },
      45: { icon: '🌫️', desc: 'Foggy' }, 48: { icon: '🌫️', desc: 'Foggy' },
      51: { icon: '🌦️', desc: 'Light drizzle' }, 53: { icon: '🌦️', desc: 'Drizzle' },
      55: { icon: '🌧️', desc: 'Heavy drizzle' }, 61: { icon: '🌧️', desc: 'Light rain' },
      63: { icon: '🌧️', desc: 'Rain' }, 65: { icon: '🌧️', desc: 'Heavy rain' },
      71: { icon: '🌨️', desc: 'Light snow' }, 73: { icon: '❄️', desc: 'Snow' },
      75: { icon: '❄️', desc: 'Heavy snow' }, 80: { icon: '🌦️', desc: 'Light showers' },
      81: { icon: '🌧️', desc: 'Showers' }, 82: { icon: '⛈️', desc: 'Heavy showers' },
      95: { icon: '⛈️', desc: 'Thunderstorm' }, 96: { icon: '⛈️', desc: 'Thunderstorm with hail' },
      99: { icon: '⛈️', desc: 'Heavy thunderstorm' }
    };
    return weatherMap[code] || { icon: '🌤️', desc: 'Unknown' };
  }

  async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function initNdaProtection() {
    const ACCEPTED_PASSWORD_HASHES = [
      "2b1bf3c7cd0927a3f0c48e44d6c3784c081910a8849234a3cb6ef71815973b6d",
      "c3b34babd4342449e7406c59aaddf618fa5691849642094110b3b551fe878a67"
    ];
    const ndaModal = document.getElementById('ndaModal') as HTMLDialogElement;
    const ndaPasswordInput = document.getElementById('ndaPasswordInput') as HTMLInputElement;
    const ndaPasswordToggle = document.getElementById('ndaPasswordToggle') as HTMLButtonElement;
    const ndaSubmitBtn = document.getElementById('ndaSubmitBtn') as HTMLButtonElement;
    const ndaCancelBtn = document.getElementById('ndaCancelBtn') as HTMLButtonElement;
    const ndaErrorMessage = document.getElementById('ndaErrorMessage') as HTMLDivElement;
    let currentNdaProject: Element | null = null;

    if (!ndaModal) return;

    function eyeOpen() {
      return `<svg class="eye-open" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    }
    function eyeClosed() {
      return `<svg class="eye-closed" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    }

    if (ndaPasswordToggle) {
      ndaPasswordToggle.addEventListener('click', () => {
        const type = ndaPasswordInput.getAttribute('type');
        if (type === 'password') {
          ndaPasswordInput.setAttribute('type', 'text');
          ndaPasswordToggle.setAttribute('aria-label', 'Hide password');
          ndaPasswordToggle.innerHTML = eyeClosed();
        } else {
          ndaPasswordInput.setAttribute('type', 'password');
          ndaPasswordToggle.setAttribute('aria-label', 'Show password');
          ndaPasswordToggle.innerHTML = eyeOpen();
        }
      });
    }

    document.querySelectorAll('.nda-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentNdaProject = overlay.closest('.project-card');
        openNdaModal();
      });
    });

    document.querySelectorAll('.project-card.nda-protected').forEach(card => {
      card.addEventListener('click', function(this: Element, e: Event) {
        if ((e.target as Element).closest('.nda-modal')) return;
        if ((e.target as Element).closest('.project-image-link')) return;
        const link = this.querySelector('.project-image-link.nda-link');
        if (link && link.classList.contains('unlocked')) {
          const href = link.getAttribute('href');
          if (href) window.open(href, link.getAttribute('target') || '_self');
          return;
        }
        currentNdaProject = this;
        openNdaModal();
      });
      card.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        (this as HTMLElement).click();
      });
    });

    function openNdaModal() {
      ndaPasswordInput.value = '';
      ndaPasswordInput.setAttribute('type', 'password');
      ndaPasswordToggle.setAttribute('aria-label', 'Show password');
      ndaPasswordToggle.innerHTML = eyeOpen();
      ndaPasswordInput.classList.remove('error');
      ndaErrorMessage.classList.remove('show');
      ndaModal.showModal();
    }

    function closeNdaModal() {
      ndaModal.close();
      currentNdaProject = null;
    }

    ndaCancelBtn.addEventListener('click', closeNdaModal);
    ndaModal.addEventListener('click', (e) => { if (e.target === ndaModal) closeNdaModal(); });

    async function submitPassword() {
      const password = ndaPasswordInput.value;
      const hash = await hashPassword(password);
      if (ACCEPTED_PASSWORD_HASHES.includes(hash)) {
        unlockProject(currentNdaProject);
        closeNdaModal();
        sessionStorage.setItem('nda-unlocked', 'true');
      } else {
        ndaPasswordInput.classList.add('error');
        ndaErrorMessage.classList.add('show');
        setTimeout(() => ndaPasswordInput.classList.remove('error'), 500);
      }
    }

    function unlockProject(projectCard: Element | null) {
      if (!projectCard) return;
      projectCard.classList.add('unlocked');
      const link = projectCard.querySelector('.project-image-link.nda-link');
      if (link) {
        link.classList.add('unlocked');
        const realHref = link.getAttribute('data-href');
        if (realHref) link.setAttribute('href', realHref);
      }
      const overlay = projectCard.querySelector('.nda-overlay');
      if (overlay) overlay.classList.add('hidden');
      setTimeout(() => projectCard.querySelectorAll('.particle-container').forEach(c => c.remove()), 1000);
    }

    ndaSubmitBtn.addEventListener('click', submitPassword);
    ndaPasswordInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitPassword(); });

    if (sessionStorage.getItem('nda-unlocked') === 'true') {
      document.querySelectorAll('.project-card.nda-protected').forEach(card => unlockProject(card));
    }

    document.querySelectorAll('.project-image-link.nda-link').forEach(link => {
      link.addEventListener('click', function(e) {
        if (!this.classList.contains('unlocked')) e.preventDefault();
      });
    });

    // Particle system
    function buildParticleHTML(numParticles: number) {
      let html = '';
      for (let i = 0; i < numParticles; i++) {
        const x = Math.random() * 100, y = Math.random() * 100;
        const size = Math.random() * 3 + 2;
        const opacity = Math.random() * 0.3 + 0.2;
        const duration = Math.random() * 3 + 3;
        const delay = Math.random() * 2;
        html += `<div class="particle" style="position:absolute;left:${x}%;top:${y}%;width:${size}px;height:${size}px;background:rgba(136,136,136,${opacity});border-radius:50%;animation:particle-drift ${duration}s ease-in-out ${delay}s infinite;"></div>`;
      }
      return html;
    }

    function createParticleSystem(element: HTMLElement, width: number) {
      const numParticles = Math.floor(width / 5);
      const container = document.createElement('div');
      container.className = 'particle-container';
      container.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;';
      container.innerHTML = buildParticleHTML(numParticles);
      element.style.position = 'relative';
      element.appendChild(container);
      return container;
    }

    const ndaCards = Array.from(document.querySelectorAll('.project-card.nda-protected')) as HTMLElement[];
    const ndaItems = Array.from(document.querySelectorAll('.project-list-item.nda-protected-item')) as HTMLElement[];
    const today = new Date();

    const cardData = ndaCards
      .filter(card => !card.classList.contains('unlocked'))
      .map(card => {
        const title = card.querySelector('.project-title');
        const texts = Array.from(card.querySelectorAll('.nda-hidden-text'));
        const titleWidth = title ? title.getBoundingClientRect().width : 0;
        const textWidths = texts.map(t => t.getBoundingClientRect().width);
        return { title, texts, titleWidth, textWidths };
      });

    const itemData = ndaItems.map(item => {
      const releaseDate = item.getAttribute('data-release-date');
      if (releaseDate && today >= new Date(releaseDate)) return { item, skip: true };
      const texts = Array.from(item.querySelectorAll('.nda-hidden-text'));
      const widths = texts.map(t => t.getBoundingClientRect().width);
      return { item, texts, widths, skip: false };
    });

    cardData.forEach(({ title, texts, titleWidth, textWidths }) => {
      if (title) createParticleSystem(title as HTMLElement, titleWidth);
      texts.forEach((t, i) => createParticleSystem(t as HTMLElement, textWidths[i]));
    });

    itemData.forEach(({ item, texts, widths, skip }) => {
      if (skip) { item.classList.add('unlocked'); return; }
      texts.forEach((text, i) => {
        const numParticles = Math.max(Math.floor(widths[i] / 8), 15);
        const container = document.createElement('div');
        container.className = 'particle-container';
        container.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;';
        let html = '';
        for (let j = 0; j < numParticles; j++) {
          const x = Math.random() * 100, y = Math.random() * 100;
          const size = Math.random() * 2 + 1.5;
          const opacity = Math.random() * 0.3 + 0.2;
          const duration = Math.random() * 3 + 3;
          const delay = Math.random() * 2;
          html += `<div class="particle" style="position:absolute;left:${x}%;top:${y}%;width:${size}px;height:${size}px;background:rgba(136,136,136,${opacity});border-radius:50%;animation:particle-drift ${duration}s ease-in-out ${delay}s infinite;"></div>`;
        }
        container.innerHTML = html;
        (text as HTMLElement).style.position = 'relative';
        text.appendChild(container);
      });
    });
  }

  function initCardGlow() {
    document.body.addEventListener('pointermove', (e) => {
      const target = (e.target as Element).closest('.project-card.clickable-card, .accordion-trigger, .project-list-item.clickable');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      (target as HTMLElement).style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
      (target as HTMLElement).style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
    });
    document.body.addEventListener('pointerleave', (e) => {
      const target = (e.target as Element).closest('.project-card.clickable-card, .accordion-trigger, .project-list-item.clickable');
      if (!target) return;
      (target as HTMLElement).style.removeProperty('--glow-x');
      (target as HTMLElement).style.removeProperty('--glow-y');
    });
  }

  function initProjectCards() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.project-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        (card as HTMLElement).style.opacity = '1';
        (card as HTMLElement).style.transform = 'translateY(0)';
      } else {
        (card as HTMLElement).style.opacity = '0';
        (card as HTMLElement).style.transform = 'translateY(30px)';
        (card as HTMLElement).style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
      }
    });
  }

  function initCaseStudies() {
    const registry: Record<string, { cardId: string; overlayId: string; _pendingOpen?: boolean }> = {};
    const studyMap: Record<string, { card: HTMLElement; dialog: HTMLDialogElement; panel: HTMLElement; closeBtn: HTMLButtonElement | null; overlayId: string; _closing?: boolean }> = {};
    const loaded: Record<string, boolean> = {};

    async function loadOverlay(overlayId: string) {
      if (loaded[overlayId]) return;
      loaded[overlayId] = true;
      try {
        const res = await fetch(`${overlayId}.html`);
        const text = await res.text();
        const tmp = document.createElement('div');
        tmp.innerHTML = text;
        while (tmp.firstChild) document.body.appendChild(tmp.firstChild);
        const entry = registry[overlayId];
        if (entry) _register(entry.cardId, overlayId);
      } catch (err) {
        console.error(`Failed to load ${overlayId}.html`, err);
        loaded[overlayId] = false;
      }
    }

    function openOverlay(overlayId: string) {
      const study = studyMap[overlayId];
      if (!study) return;
      const { dialog, panel, closeBtn } = study;
      panel.querySelectorAll('.cs-section').forEach(s => s.classList.remove('cs-visible'));
      panel.scrollTop = 0;
      (panel as HTMLElement).style.cssText = '';
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      document.body.classList.add('cs-is-open');
      if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
      setTimeout(() => setupReveal(panel), 600);
    }

    function animateClose(study: typeof studyMap[string]) {
      const { dialog, panel, card } = study;
      if (!dialog.open || study._closing) return;
      study._closing = true;
      panel.querySelectorAll('.cs-section').forEach(s => s.classList.remove('cs-visible'));
      let handled = false;
      const done = (e?: TransitionEvent) => {
        if (handled) return;
        if (e && e.target !== panel) return;
        handled = true;
        panel.removeEventListener('transitionend', done);
        study._closing = false;
        panel.scrollTop = 0;
        document.body.style.overflow = '';
        document.body.classList.remove('cs-is-open');
        if (card) (card as HTMLElement).focus();
      };
      panel.addEventListener('transitionend', done);
      const timer = setTimeout(done, 700);
      dialog.close();
    }

    function setupReveal(panel: HTMLElement) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('cs-visible'); obs.unobserve(e.target); }
        });
      }, { root: panel, threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      panel.querySelectorAll('.cs-section').forEach(s => obs.observe(s));
    }

    function _register(cardId: string, overlayId: string) {
      const card = document.getElementById(cardId);
      const dialog = document.getElementById(overlayId) as HTMLDialogElement;
      if (!card || !dialog) return;
      const panel = dialog.querySelector('.cs-panel') as HTMLElement;
      const closeBtn = dialog.querySelector('.cs-close-btn') as HTMLButtonElement;
      const study = { card: card as HTMLElement, dialog, panel, closeBtn, overlayId };
      studyMap[overlayId] = study;

      dialog.addEventListener('cancel', (e) => { e.preventDefault(); animateClose(study); });
      dialog.addEventListener('close', () => {
        if (study._closing) return;
        panel.scrollTop = 0;
        document.body.style.overflow = '';
        document.body.classList.remove('cs-is-open');
      });
      if (closeBtn) closeBtn.addEventListener('click', () => animateClose(study));

      panel.querySelectorAll('[data-open]').forEach(el => {
        el.addEventListener('click', () => {
          const nextId = el.getAttribute('data-open');
          if (!nextId) return;
          animateClose(study);
          setTimeout(() => ensureAndOpen(nextId), 700);
        });
      });

      const backTop = panel.querySelector('#cs-back-to-top');
      const backArrow = panel.querySelector('#cs-back-arrow');
      [backTop, backArrow].forEach(el => {
        if (!el) return;
        el.addEventListener('click', () => {
          animateClose(study);
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 700);
        });
      });

      if (registry[overlayId]?._pendingOpen) {
        registry[overlayId]._pendingOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => openOverlay(overlayId)));
      }
    }

    async function ensureAndOpen(overlayId: string) {
      if (!loaded[overlayId]) {
        if (!registry[overlayId]) registry[overlayId] = { cardId: '', overlayId };
        registry[overlayId]._pendingOpen = true;
        await loadOverlay(overlayId);
        if (studyMap[overlayId]) {
          requestAnimationFrame(() => requestAnimationFrame(() => openOverlay(overlayId)));
        }
      } else {
        requestAnimationFrame(() => requestAnimationFrame(() => openOverlay(overlayId)));
      }
    }

    function register(cardId: string, overlayId: string) {
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
          (card as HTMLElement).style.cursor = 'wait';
          await loadOverlay(overlayId);
          (card as HTMLElement).style.cursor = '';
          requestAnimationFrame(() => requestAnimationFrame(() => openOverlay(overlayId)));
        } else {
          openOverlay(overlayId);
        }
      });
    }

    register('card-callao', 'cs-callao');
    register('card-abruzzo', 'cs-abruzzo');
    register('card-dicarlobus', 'cs-dicarlobus');
    register('card-quickcheckout', 'cs-quickcheckout');

    document.querySelectorAll('.cs-card').forEach(card => {
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); (card as HTMLElement).click(); }
      });
    });
  }
</script>
