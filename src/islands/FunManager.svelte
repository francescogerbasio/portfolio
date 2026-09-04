<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { createTravelPhotos, shuffleArray, travelConfig, travelPhotoSrcset, TRAVEL_IMAGE_SIZES, type TravelPhoto } from '../data/travel';
  import { musicData } from '../data/music';
  import { gamesData } from '../data/games';

  const CATEGORY_SUBTITLES: Record<string, string> = {
    travel: "Places I've been and stories from the road. Every journey tells a story, and these are mine captured through moments and memories.",
    music: "Songs I've created and the artists who inspire me. Music has always been a passion, from producing my own tracks to discovering new sounds.",
    gaming: "The games I'm playing and the worlds I'm exploring. Gaming isn't just a hobby—it's an art form, a story, and an experience."
  };

  const base = import.meta.env.BASE_URL;

  let currentCategory = $state('travel');
  let currentCountry = $state('all');
  let photos = $state<TravelPhoto[]>([]);
  let shuffledPhotos = $state<TravelPhoto[]>([]);
  let isWindows = $state(false);
  let flagNav: HTMLElement | null = $state(null);
  let flagPill: HTMLElement | null = $state(null);
  let flagResizeObserver: ResizeObserver | null = null;
  let masonryResizeFrame: number | null = null;
  let flipped = $state(false);
  let isFlipping = $state(false);
  let previewSrc = $state('');
  let artistDataRequested = false;

  const countries = $derived.by(() => {
    const map = new Map<string, { name: string; flag: string; countryCode: string }>();
    travelConfig.destinations.forEach(dest => {
      if (!map.has(dest.country)) {
        map.set(dest.country, {
          name: dest.country.charAt(0).toUpperCase() + dest.country.slice(1),
          flag: dest.flag,
          countryCode: dest.country
        });
      }
    });
    return Array.from(map.values());
  });

  async function scheduleMovePill() {
    await tick();
    requestAnimationFrame(() => requestAnimationFrame(movePill));
  }

  $effect(() => {
    currentCountry;
    currentCategory;
    void scheduleMovePill();
  });

  onMount(() => {
    isWindows = (navigator.userAgentData?.platform || navigator.platform || '').toLowerCase().includes('win');

    void scheduleMovePill();
    flagNav?.addEventListener('scroll', movePill);
    const handleResize = () => {
      movePill();
      if (masonryResizeFrame !== null) cancelAnimationFrame(masonryResizeFrame);
      masonryResizeFrame = requestAnimationFrame(() => {
        masonryResizeFrame = null;
        layoutTravelGrid();
      });
    };
    window.addEventListener('resize', handleResize);
    masonryResizeFrame = requestAnimationFrame(() => {
      masonryResizeFrame = null;
      layoutTravelGrid();
    });
    if (flagNav) {
      flagResizeObserver = new ResizeObserver(() => movePill());
      flagResizeObserver.observe(flagNav);
    }

    return () => {
      flagNav?.removeEventListener('scroll', movePill);
      window.removeEventListener('resize', handleResize);
      if (masonryResizeFrame !== null) cancelAnimationFrame(masonryResizeFrame);
      flagResizeObserver?.disconnect();
    };
  });

  function loadTravel() {
    photos = createTravelPhotos(base);
    shuffledPhotos = shuffleArray(photos);
  }

  function travelCardAspectRatio(index: number) {
    const cardNumber = index + 1;
    if (cardNumber % 7 === 0) return 0.85;
    if (cardNumber % 5 === 0) return 1.333;
    if (cardNumber % 3 === 0) return 1;
    return 0.75;
  }

  function supportsGridLanes() {
    return typeof CSS !== 'undefined' && CSS.supports('display', 'grid-lanes');
  }

  function resetTravelCardLayout(card: HTMLElement) {
    card.style.removeProperty('position');
    card.style.removeProperty('left');
    card.style.removeProperty('top');
    card.style.removeProperty('width');
    card.style.removeProperty('height');
    card.style.removeProperty('margin-bottom');
  }

  function layoutTravelGrid() {
    if (typeof window === 'undefined') return;

    const grid = document.getElementById('travelGrid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.travel-card'));
    if (supportsGridLanes()) {
      grid.style.removeProperty('height');
      grid.style.removeProperty('columns');
      cards.forEach(resetTravelCardLayout);
      return;
    }

    if (!cards.length || grid.clientWidth === 0) {
      grid.style.removeProperty('height');
      grid.style.removeProperty('columns');
      cards.forEach(resetTravelCardLayout);
      return;
    }

    const styles = getComputedStyle(grid);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    const paddingTop = parseFloat(styles.paddingTop) || 0;
    const paddingBottom = parseFloat(styles.paddingBottom) || 0;
    const contentWidth = grid.clientWidth - paddingLeft - paddingRight;
    const gap = 12;
    const columns = window.innerWidth > 1400 ? 4 : window.innerWidth > 1024 ? 3 : window.innerWidth > 600 ? 2 : 1;
    const columnWidth = (contentWidth - gap * (columns - 1)) / columns;
    const columnHeights = Array(columns).fill(0);

    grid.style.columns = 'unset';

    cards.forEach((card, index) => {
      resetTravelCardLayout(card);
      const cardHeight = columnWidth / travelCardAspectRatio(index);
      const column = columnHeights.indexOf(Math.min(...columnHeights));

      card.style.position = 'absolute';
      card.style.left = `${paddingLeft + column * (columnWidth + gap)}px`;
      card.style.top = `${paddingTop + columnHeights[column]}px`;
      card.style.width = `${columnWidth}px`;
      card.style.height = `${cardHeight}px`;
      card.style.marginBottom = '0';
      columnHeights[column] += cardHeight + gap;
    });

    const contentHeight = Math.max(...columnHeights, 0) - (cards.length ? gap : 0);
    grid.style.height = `${paddingTop + Math.max(0, contentHeight) + paddingBottom}px`;
  }

  async function refreshTravelLayout() {
    await tick();
    requestAnimationFrame(() => {
      layoutTravelGrid();
      initGrainReveal();
    });
  }
  // Runs at init (server + client) so the travel grid ships in the initial HTML.
  loadTravel();

  onMount(() => {
    // Warm Deezer artist photos on page load so they're ready before the
    // Music tab is opened (decode-before-swap keeps the change invisible).
    void loadArtistImages();
  });

  function switchCategory(category: string) {
    if (currentCategory === category) return;
    currentCategory = category;
    if (category === 'travel') {
      loadTravel();
      void scheduleMovePill();
      void refreshTravelLayout();
    } else if (category === 'gaming') {
      restartFeaturedCycle();
    } else {
      stopFeaturedAuto();
      void loadArtistImages();
    }
  }

  function srcset(path: string, widths: number[], originalWidth?: number): string {
    if (widths.length === 1 && widths[0] === 315 && originalWidth === 630) return travelPhotoSrcset(path);
    const [base, query] = path.split('?');
    const q = query ? `?${query}` : '';
    const parts = widths.map(w => `${base.replace(/\.webp$/, `-${w}w.webp`)}${q} ${w}w`);
    if (originalWidth) parts.push(`${path} ${originalWidth}w`);
    return parts.join(', ');
  }

  function movePill() {
    if (currentCategory !== 'travel' || !flagNav || !flagPill) return;
    const active = flagNav.querySelector('.flag-btn.active') as HTMLElement | null;
    if (!active) return;
    const navRect = flagNav.getBoundingClientRect();
    const btnRect = active.getBoundingClientRect();
    const scrollLeft = flagNav.scrollLeft;
    flagPill.style.left = (btnRect.left - navRect.left + scrollLeft) + 'px';
    flagPill.style.width = btnRect.width + 'px';
  }

  function filterCountry(country: string) {
    currentCountry = country;
    void tick().then(() => {
      const btn = flagNav?.querySelector(`[data-country="${country}"]`) as HTMLElement | null;
      if (btn) {
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      void scheduleMovePill();
      void refreshTravelLayout();
    });
  }

  function activateCountryFromCard(country: string) {
    currentCountry = country;
    document.getElementById('travel-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    void scheduleMovePill();
    void refreshTravelLayout();
  }

  function makeKeyboardClickable(node: HTMLElement, handler: () => void) {
    node.setAttribute('role', 'button');
    node.setAttribute('tabindex', '0');
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      handler();
    };
    node.addEventListener('keydown', onKey);
    return {
      destroy() { node.removeEventListener('keydown', onKey); }
    };
  }

  // Gaming state — dwell-tracked autoplay keeps the progress-segment fill in sync
  let featuredIndex = $state(0);
  let segCycle = $state(0);
  const GF_DWELL_MS = 7000;
  let autoTimeout: ReturnType<typeof setTimeout> | null = null;
  let autoStartedAt = 0;
  let autoElapsed = 0;
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  function startFeaturedAuto() {
    if (prefersReducedMotion || document.hidden || autoTimeout) return;
    const remaining = Math.max(400, GF_DWELL_MS - autoElapsed);
    autoStartedAt = performance.now();
    autoTimeout = setTimeout(() => {
      autoTimeout = null;
      autoStartedAt = 0;
      autoElapsed = 0;
      featuredIndex = (featuredIndex + 1) % gamesData.featured.length;
      startFeaturedAuto();
    }, remaining);
  }

  function stopFeaturedAuto() {
    if (autoTimeout) {
      clearTimeout(autoTimeout);
      autoTimeout = null;
    }
    if (autoStartedAt) {
      autoElapsed = Math.min(GF_DWELL_MS, autoElapsed + performance.now() - autoStartedAt);
      autoStartedAt = 0;
    }
  }

  onMount(() => {
    requestAnimationFrame(() => {
      layoutTravelGrid();
      initGrainReveal();
    });
    const onVisibility = () => {
      if (document.hidden) stopFeaturedAuto();
      else if (currentCategory === 'gaming') startFeaturedAuto();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stopFeaturedAuto();
      grainObserver?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  });

  function goToFeatured(n: number) {
    stopFeaturedAuto();
    const count = gamesData.featured.length;
    featuredIndex = ((n % count) + count) % count;
    segCycle++;
    autoElapsed = 0;
    startFeaturedAuto();
  }

  function onFeaturedKey(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goToFeatured(featuredIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goToFeatured(featuredIndex + 1); }
  }

  // Fresh cycle whenever Gaming becomes visible — timer and segment fill start together.
  // Imperative on purpose: mutating segCycle inside an $effect makes it a dependency
  // of its own writer ($effect tracks the read in segCycle++) and the effect loops.
  function restartFeaturedCycle() {
    stopFeaturedAuto();
    autoElapsed = 0;
    segCycle++;
    startFeaturedAuto();
  }

  function flipSongCard() {
    if (isFlipping) return;
    isFlipping = true;
    flipped = true;
    if (typeof navigator !== 'undefined' && navigator.onLine && musicData.mySong.youtubeEmbedId) {
      setTimeout(() => {
        previewSrc = `https://www.youtube.com/embed/${musicData.mySong.youtubeEmbedId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`;
      }, 350);
    }
    setTimeout(() => { isFlipping = false; }, 700);
  }

  function unflipSongCard() {
    if (isFlipping) return;
    isFlipping = true;
    flipped = false;
    previewSrc = '';
    setTimeout(() => { isFlipping = false; }, 700);
  }

  // Saga toggles
  let openSaga = $state<string | null>(null);
  function toggleSaga(id: string) {
    openSaga = openSaga === id ? null : id;
  }

  // Artist detail dialog + Deezer album fetch
  type DeezerAlbum = {
    name: string;
    cover: string;
    release_date: string;
  };
  type DeezerAlbumApiItem = {
    title?: unknown;
    cover_xl?: unknown;
    record_type?: unknown;
    release_date?: unknown;
  };
  const albumCache = new Map<string, DeezerAlbum[]>();
  let expandedArtistId = $state<string | null>(null);
  let expandedArtistAlbums = $state<DeezerAlbum[] | null>(null);
  let expandedArtistLoading = $state(false);
  let vinylDialog: HTMLDialogElement | null = $state(null);
  let closeTimer: ReturnType<typeof setTimeout> | null = null;

  type DeezerArtist = {
    id: number;
    name: string;
    picture_xl: string;
    nb_fan: number;
  };
  type CachedArtistImage = {
    url: string;
    cachedAt: number;
  };
  const deezerCache = new Map<string, DeezerArtist | null>();
  const ARTIST_IMAGE_CACHE_KEY = 'deezer-artist-images-v2';
  const ARTIST_IMAGE_CACHE_TTL = 30 * 24 * 60 * 60 * 1000;

  function readCachedArtistImages(): Record<string, CachedArtistImage> {
    if (typeof window === 'undefined') return {};
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(ARTIST_IMAGE_CACHE_KEY) || '{}');
      if (!parsed || typeof parsed !== 'object') return {};
      const now = Date.now();
      return Object.fromEntries(
        Object.entries(parsed).filter(([, value]) => {
          if (!value || typeof value !== 'object') return false;
          const entry = value as Partial<CachedArtistImage>;
          return typeof entry.url === 'string'
            && typeof entry.cachedAt === 'number'
            && now - entry.cachedAt < ARTIST_IMAGE_CACHE_TTL;
        })
      ) as Record<string, CachedArtistImage>;
    } catch {
      return {};
    }
  }

  const cachedArtistImages = readCachedArtistImages();
  let artistImages = $state<Record<string, string>>(
    Object.fromEntries(Object.entries(cachedArtistImages).map(([id, entry]) => [id, entry.url]))
  );
  let artistAlbumCounts = $state<Record<string, number>>({});

  const DEEZER_ARTIST_OVERRIDES: Record<string, number> = {
    'Flaco G': 13478397,
    'Izi': 4677848,
    'Kid Yugi': 139795852,
    'Papa V': 85051272,
    'Young Miko': 139171932,
    'Quevedo': 6705223,
    'Jhayco': 105047672,
    'Lucho RK': 151322852
  };

  async function fetchDeezerArtist(artistName: string): Promise<DeezerArtist | null> {
    if (deezerCache.has(artistName)) {
      return deezerCache.get(artistName) || null;
    }
    try {
      const overrideId = DEEZER_ARTIST_OVERRIDES[artistName];
      const endpoint = overrideId
        ? `/.netlify/functions/deezer-artist?id=${overrideId}`
        : `/.netlify/functions/deezer-artist?name=${encodeURIComponent(artistName)}`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        deezerCache.set(artistName, null);
        return null;
      }
      const data = await response.json();
      let bestMatch: DeezerArtist | null = null;
      if (overrideId) {
        if (!data || !data.id) {
          deezerCache.set(artistName, null);
          return null;
        }
        bestMatch = {
          id: data.id,
          name: data.name ?? artistName,
          picture_xl: data.picture_xl ?? '',
          nb_fan: data.nb_fan ?? 0
        };
      } else {
        if (!data.data || data.data.length === 0) {
          deezerCache.set(artistName, null);
          return null;
        }
        bestMatch = data.data.reduce((best: DeezerArtist, current: DeezerArtist) =>
          current.nb_fan > best.nb_fan ? current : best
        );
      }
      deezerCache.set(artistName, bestMatch);
      return bestMatch;
    } catch {
      deezerCache.set(artistName, null);
      return null;
    }
  }

  function cacheArtistImage(id: string, url: string) {
    if (typeof window === 'undefined') return;
    cachedArtistImages[id] = { url, cachedAt: Date.now() };
    try {
      window.localStorage.setItem(ARTIST_IMAGE_CACHE_KEY, JSON.stringify(cachedArtistImages));
    } catch {
      // Storage may be unavailable in private browsing.
    }
  }

  async function decodeArtistImage(url: string): Promise<boolean> {
    const image = new Image();
    image.decoding = 'async';
    image.src = url;
    try {
      await image.decode();
      return true;
    } catch {
      return false;
    }
  }

  async function loadArtistImages() {
    if (artistDataRequested || (typeof navigator !== 'undefined' && !navigator.onLine)) return;
    artistDataRequested = true;
    await Promise.all(
      musicData.artists.map(async (artist) => {
        const deezerData = await fetchDeezerArtist(artist.name);
        if (deezerData?.picture_xl) {
          const imageReady = await decodeArtistImage(deezerData.picture_xl);
          if (imageReady) {
            if (artistImages[artist.id] !== deezerData.picture_xl) {
              artistImages = { ...artistImages, [artist.id]: deezerData.picture_xl };
            }
            cacheArtistImage(artist.id, deezerData.picture_xl);
          }
        }
        if (deezerData?.id) {
          const albums = await fetchAlbumsById(deezerData.id, artist.albumAllowlist);
          if (albums.length > 0) {
            artistAlbumCounts = { ...artistAlbumCounts, [artist.id]: albums.length };
            albumCache.set(artist.id, albums);
          }
        }
      })
    );
  }

  function openArtistDetail(artistId: string) {
    const artist = musicData.artists.find(a => a.id === artistId);
    if (!artist) return;
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    vinylDialog?.classList.remove('vinyl-closing');
    expandedArtistId = artistId;

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      expandedArtistAlbums = null;
      expandedArtistLoading = false;
    } else {
      const cached = albumCache.get(artistId);
      if (cached) {
        expandedArtistAlbums = cached;
        expandedArtistLoading = false;
      } else {
        expandedArtistAlbums = null;
        expandedArtistLoading = true;
        void fetchAlbums(artistId).then(albums => {
          if (expandedArtistId !== artistId) return;
          expandedArtistAlbums = albums;
          expandedArtistLoading = false;
        });
      }
    }

    requestAnimationFrame(() => {
      if (vinylDialog && !vinylDialog.open) vinylDialog.showModal();
    });
  }

  function closeArtistDetail() {
    if (!vinylDialog?.open) return;
    vinylDialog.classList.add('vinyl-closing');
    closeTimer = setTimeout(() => {
      closeTimer = null;
      vinylDialog?.close();
      vinylDialog?.classList.remove('vinyl-closing');
      expandedArtistId = null;
      expandedArtistAlbums = null;
      expandedArtistLoading = false;
    }, 380);
  }

  async function fetchAlbumsById(deezerId: number, allowlist?: string[]): Promise<DeezerAlbum[]> {
    try {
      const res = await fetch(`/.netlify/functions/deezer-artist?albums_for=${deezerId}`);
      if (!res.ok) return [];
      const data = await res.json() as { data?: DeezerAlbumApiItem[] };
      const seen = new Set<string>();
      const allowed = allowlist ? new Set(allowlist.map(n => n.toLowerCase())) : null;
      const albums: DeezerAlbum[] = (data.data || [])
        .filter((a) => typeof a.title === 'string' && typeof a.cover_xl === 'string'
          && (typeof a.record_type !== 'string' || a.record_type.toLowerCase() === 'album'))
        .filter((a) => {
          // Exact-title dedupe; switch to case-insensitive matching if variant duplicates appear.
          const name = String(a.title);
          if (seen.has(name)) return false;
          seen.add(name);
          return true;
        })
        .filter((a) => !allowed || allowed.has(String(a.title).toLowerCase()))
        .map((a) => ({
          name: String(a.title),
          cover: String(a.cover_xl),
          release_date: String(a.release_date || '')
        }));
      return albums;
    } catch {
      return [];
    }
  }

  async function fetchAlbums(artistId: string): Promise<DeezerAlbum[]> {
    const artist = musicData.artists.find(a => a.id === artistId);
    if (!artist) return [];

    const deezerArtist = await fetchDeezerArtist(artist.name);
    if (!deezerArtist?.id) return [];

    return fetchAlbumsById(deezerArtist.id, artist.albumAllowlist);
  }

  function spotifyUrl(artistName: string): string {
    return `https://open.spotify.com/search/${encodeURIComponent(artistName)}`;
  }

  // Travel card grain reveal — inspired by Canvas-UI Particle Scroll
  let grainObserver: IntersectionObserver | null = null;

  function initGrainReveal() {
    const grid = document.getElementById('travelGrid');
    if (!grid || typeof IntersectionObserver === 'undefined') return;
    grainObserver?.disconnect();
    grainObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const card = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          card.classList.add('grain-active');
          setTimeout(() => card.classList.remove('grain-active'), 300);
          grainObserver?.unobserve(card);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
    grid.querySelectorAll('.travel-card').forEach(c => {
      const rect = c.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) return;
      grainObserver?.observe(c);
    });
  }
</script>

{#snippet musicCard()}
  {@const song = musicData.mySong}
  {@const canPreview = Boolean(previewSrc)}
  {@const artworkSrc = song.artwork || `https://i.ytimg.com/vi/${song.youtubeEmbedId}/maxresdefault.jpg`}
  <div class="song-card{flipped ? ' flipped' : ''}" id="songCard" onmouseleave={unflipSongCard}>
    <div class="song-card-inner">
      <div class="song-card-front">
        <div class="song-card-artwork" onmouseenter={flipSongCard}>
          <img src={artworkSrc} alt={song.title} width="340" height="340" loading="lazy" fetchpriority="low" decoding="async"
               srcset={srcset(artworkSrc, [340, 680])} sizes="340px">
        </div>
        <div class="song-card-info">
          <div class="song-card-waveform"><span></span><span></span><span></span><span></span></div>
          <div class="song-card-text">
            <p class="song-card-title">{song.title}</p>
            <p class="song-card-artist">{song.artist}</p>
            <p class="song-card-producer">{song.producer}</p>
          </div>
          <button type="button" class="song-card-play-btn" aria-label="Open on YouTube"
                  onclick={() => window.open(song.youtubeUrl, '_blank', 'noopener,noreferrer')}>
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
        </div>
      </div>
      <div class="song-card-back">
        {#if canPreview}
          <iframe id="youtubePreview" src={previewSrc} title="YouTube preview" frameborder="0"
                  allow="autoplay; encrypted-media" allowfullscreen tabindex="-1"></iframe>
        {:else}
          <img src={`https://i.ytimg.com/vi/${song.youtubeEmbedId}/hqdefault.jpg`} alt={song.title} style="width:100%;height:100%;object-fit:cover;">
        {/if}
        <div class="song-card-back-overlay">
          <p class="song-card-back-title">{song.title}</p>
          {#if canPreview}
            <div class="preview-badge"><span class="preview-dot"></span>Preview</div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/snippet}

<div class="category-nav-top" aria-label="Content categories">
  <button class="category-btn{currentCategory === 'travel' ? ' active' : ''}" data-category="travel" aria-pressed={currentCategory === 'travel'} aria-controls="travel-section" id="tab-travel" onclick={() => switchCategory('travel')}>Travel</button>
  <button class="category-btn{currentCategory === 'music' ? ' active' : ''}" data-category="music" aria-pressed={currentCategory === 'music'} aria-controls="music-section" id="tab-music" onclick={() => switchCategory('music')}>Music</button>
  <button class="category-btn{currentCategory === 'gaming' ? ' active' : ''}" data-category="gaming" aria-pressed={currentCategory === 'gaming'} aria-controls="gaming-section" id="tab-gaming" onclick={() => switchCategory('gaming')}>Gaming</button>
</div>

<p class="category-subtitle" id="categorySubtitle">{CATEGORY_SUBTITLES[currentCategory]}</p>

<section class="category-section{currentCategory === 'travel' ? ' active' : ''}" id="travel-section" aria-labelledby="tab-travel" hidden={currentCategory !== 'travel'}>
  <div class="flag-navigation" id="flagNavigation" bind:this={flagNav} aria-label="Filter travel photos by country">
    <div class="flag-nav-pill" id="flagNavPill" bind:this={flagPill}></div>
    <button class="flag-btn{currentCountry === 'all' ? ' active' : ''}" data-country="all" aria-pressed={currentCountry === 'all'} onclick={() => filterCountry('all')}>{isWindows ? 'All' : '🌍 All'}</button>
    {#each countries as c}
      <button class="flag-btn{currentCountry === c.countryCode ? ' active' : ''}" data-country={c.countryCode} aria-pressed={currentCountry === c.countryCode} onclick={() => filterCountry(c.countryCode)}>{isWindows ? c.name : `${c.flag} ${c.name}`}</button>
    {/each}
  </div>
  <div class="masonry-grid" id="travelGrid">
    {#if currentCountry === 'all'}
      {#each shuffledPhotos as photo, i (photo.id)}
        <div class="travel-card" data-country={photo.country} data-ar={photo.ar} style="--card-i:{i}; --travel-card-ar:{travelCardAspectRatio(i)}"
             role="button" tabindex="0"
             use:makeKeyboardClickable={() => activateCountryFromCard(photo.country)}
             onclick={() => activateCountryFromCard(photo.country)}>
          <img src={photo.image}
               alt={photo.location} width="630" height="840"
               loading={i < 4 ? 'eager' : 'lazy'} fetchpriority={i === 0 ? 'high' : undefined} decoding="async"
               srcset={srcset(photo.image, [315], 630)}
               sizes="(max-width: 600px) 92vw, (max-width: 1024px) 46vw, (max-width: 1400px) 31vw, 23vw">
          <div class="travel-card-location">{#if !isWindows}<span class="flag">{photo.flag}</span>{/if}<span class="location-name">{photo.location}</span></div>
        </div>
      {/each}
    {:else}
      {@const filtered = photos.filter(p => p.country === currentCountry)}
      {#if filtered.length === 0}
        <div class="loading-state"><p>No photos for this location yet.</p></div>
      {:else}
        {#each filtered as photo, i (photo.id)}
          <div class="travel-card" data-country={photo.country} data-ar={photo.ar} style="--card-i:{i}; --travel-card-ar:{travelCardAspectRatio(i)}"
               role="button" tabindex="0"
               use:makeKeyboardClickable={() => activateCountryFromCard(photo.country)}
               onclick={() => activateCountryFromCard(photo.country)}>
            <img src={photo.image}
                 alt={photo.location} width="630" height="840"
                 loading={i < 4 ? 'eager' : 'lazy'} fetchpriority={i === 0 ? 'high' : undefined} decoding="async"
                 srcset={srcset(photo.image, [315], 630)}
                 sizes={TRAVEL_IMAGE_SIZES}>
            <div class="travel-card-location">{#if !isWindows}<span class="flag">{photo.flag}</span>{/if}<span class="location-name">{photo.location}</span></div>
          </div>
        {/each}
      {/if}
    {/if}
  </div>
</section>

<section class="category-section{currentCategory === 'music' ? ' active' : ''}" id="music-section" aria-labelledby="tab-music" hidden={currentCategory !== 'music'}>
  <div class="music-category">
    <h3 class="music-category-title">Music Production</h3>
    <div class="my-music-container" id="myMusicContainer">
      {@render musicCard()}
    </div>
  </div>
  <div class="music-category">
    <h3 class="music-category-title">Favorite Artists</h3>
    <div class="vinyl-shelf" id="vinylShelf" role="list" aria-label="Favorite artists">
      {#each musicData.artists as artist, i (artist.id)}
        {@const hiResImg = artistImages[artist.id] || artist.image}
        {@const albumCount = artistAlbumCounts[artist.id] ?? artist.albums.length}
        <div class="vinyl-sleeve" data-index={i} style="--i:{i}"
             role="button" tabindex="0"
             aria-label="Open {artist.name} details"
             use:makeKeyboardClickable={() => openArtistDetail(artist.id)}
             onclick={() => openArtistDetail(artist.id)}>
          <div class="vinyl-disc" aria-hidden="true">
            <div class="vinyl-disc-label"></div>
          </div>
          <div class="sleeve-front">
            {#if hiResImg}
              {#key hiResImg}
                <img class="sleeve-art" class:artist-img-fade={artistImages[artist.id] !== undefined} src={hiResImg} alt="" width="600" height="600" loading="lazy" decoding="async">
              {/key}
            {/if}
            <div class="sleeve-overlay"></div>
            <div class="sleeve-meta">
              <h4 class="sleeve-name">{artist.name}</h4>
              {#if albumCount > 0}
                <span class="sleeve-album-count">{albumCount} album{albumCount > 1 ? 's' : ''}</span>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  {#if expandedArtistId}
    {@const expandedArtist = musicData.artists.find(a => a.id === expandedArtistId)}
    <dialog class="vinyl-overlay" id="vinylOverlay" aria-label="Artist details" bind:this={vinylDialog}
            oncancel={(e) => { e.preventDefault(); closeArtistDetail(); }}
            onclick={(e) => { if (e.target === vinylDialog) closeArtistDetail(); }}>
      {#if expandedArtist}
      <div class="vinyl-panel">
        <button class="vinyl-close-btn" aria-label="Close artist details" onclick={closeArtistDetail}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <div class="vinyl-card-head">
          <div class="vinyl-avatar">
            {#key artistImages[expandedArtist.id]}
              <img class:artist-img-fade={artistImages[expandedArtist.id] !== undefined} src={artistImages[expandedArtist.id] || expandedArtist.image} alt={expandedArtist.name} width="1000" height="1000" loading="eager" decoding="async">
            {/key}
          </div>
          <div class="vinyl-card-head-text">
            <h3 class="vinyl-name">{expandedArtist.name}</h3>
            <a class="vinyl-spotify-btn" href={spotifyUrl(expandedArtist.name)} target="_blank" rel="noopener noreferrer">
              <span class="vinyl-spotify-dot" aria-hidden="true"></span>
              <span>Open in Spotify</span>
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
        </div>
        <div class="vinyl-body">
          {#if expandedArtistLoading || (expandedArtistAlbums && expandedArtistAlbums.length > 0) || expandedArtist.albums.length > 0}
            <div class="vinyl-albums-section">
              <h4 class="vinyl-section-label">Notable Albums</h4>
              {#if expandedArtistLoading}
                <div class="vinyl-albums-row" aria-busy="true" aria-label="Loading albums">
                  {#each Array(3) as _, k (k)}
                    <div class="vinyl-album-skeleton"></div>
                  {/each}
                </div>
              {:else if expandedArtistAlbums && expandedArtistAlbums.length > 0}
                <div class="vinyl-albums-row">
                  {#each expandedArtistAlbums as album (album.name)}
                    <div class="vinyl-album">
                      <div class="vinyl-album-cover">
                        <img src={album.cover} alt={album.name} width="300" height="300" loading="lazy" decoding="async">
                      </div>
                      <div class="vinyl-album-info">
                        <span class="vinyl-album-name">{album.name}</span>
                        {#if album.release_date}
                          <span class="vinyl-album-year">{album.release_date.split('-')[0]}</span>
                        {/if}
                      </div>
                    </div>
                  {/each}
                </div>
              {:else}
                <div class="vinyl-albums-pills">
                  {#each expandedArtist.albums as name (name)}
                    <span class="vinyl-album-pill">{name}</span>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>
      {/if}
    </dialog>
  {/if}
</section>

<section class="category-section{currentCategory === 'gaming' ? ' active' : ''}" id="gaming-section" aria-labelledby="tab-gaming" hidden={currentCategory !== 'gaming'}>
  <div class="gf-stage" id="gamesFeatured" role="region" aria-roledescription="carousel" aria-label="Featured games"
       onkeydown={onFeaturedKey} onmouseenter={stopFeaturedAuto} onmouseleave={startFeaturedAuto}
       onfocusin={stopFeaturedAuto} onfocusout={startFeaturedAuto}>
    {#each gamesData.featured as game, i (game.id)}
      <article class="gf-slide{featuredIndex === i ? ' is-active' : ''}" data-index={i}
               role="group" aria-roledescription="slide" aria-label="{i + 1} of {gamesData.featured.length}"
               aria-hidden={featuredIndex !== i}>
        <img class="gf-bg-img" src={game.cover} alt="" width="2100" height="900" loading="lazy" fetchpriority="low" decoding="async"
             srcset={srcset(game.cover, [800, 1600])} sizes="100vw">
        <div class="gf-shade"></div>
        <div class="gf-content">
          <span class="gf-genre">{game.genre}</span>
          <h2 class="gf-title">{game.title}</h2>
          <span class="gf-year">{game.year}</span>
        </div>
      </article>
    {/each}
    <div class="gf-progress" role="group" aria-label="Featured game slides">
      {#each gamesData.featured as _, i (i + '-' + (featuredIndex === i ? segCycle : 'idle'))}
        <button class="gf-seg{featuredIndex === i ? ' is-active' : ''}{featuredIndex > i ? ' done' : ''}"
                aria-label="Go to slide {i + 1}" aria-pressed={featuredIndex === i}
                onclick={() => goToFeatured(i)}></button>
      {/each}
    </div>
    <button class="gf-arrow gf-prev" aria-label="Previous slide" onclick={() => goToFeatured(featuredIndex - 1)}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
    </button>
    <button class="gf-arrow gf-next" aria-label="Next slide" onclick={() => goToFeatured(featuredIndex + 1)}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
    </button>
  </div>

  <div class="games-subsection">
    <h3 class="games-subsection-title"><span class="games-subsection-dot playing"></span>Currently Playing</h3>
    <div class="games-playing-row">
      {#each gamesData.currentlyPlaying as game, i (game.id)}
        <article class="playing-card" style="--i:{i}">
          <div class="playing-cover">
            <img src={game.cover} alt={game.title} width="300" height="400" loading="lazy" decoding="async" srcset={srcset(game.cover, [300, 600])} sizes="(max-width: 700px) 28vw, 140px">
          </div>
          <div class="playing-info">
            <span class="playing-live"><span class="games-subsection-dot playing"></span>Now Playing</span>
            <h4 class="playing-name">{game.title}</h4>
            <span class="playing-genre">{game.genre}</span>
          </div>
        </article>
      {/each}
    </div>
  </div>

  <div class="games-subsection">
    <h3 class="games-subsection-title">All‑Time Favourites</h3>
    <div class="games-grid" id="gamesFavourites">
      {#each gamesData.favorites as game, i (game.id)}
        {#if game.isSaga}
          <div class="game-card saga-card{openSaga === game.id ? ' open' : ''}" data-id={game.id} style="--i:{i}"
               role="button" tabindex="0" aria-expanded={openSaga === game.id}
               use:makeKeyboardClickable={() => toggleSaga(game.id)}
               onclick={() => toggleSaga(game.id)}>
            <div class="game-cover">
              <img src={game.cover} alt={game.title} width="300" height="400" loading="lazy" decoding="async" srcset={srcset(game.cover, [300, 600])} sizes="(max-width: 600px) 33vw, 180px">
              <div class="saga-badge">{game.games?.length} games</div>
            </div>
            <div class="game-meta">
              <span class="game-genre-tag">{game.genre}</span>
              <h4 class="game-name">{game.title}<svg class="saga-chevron" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg></h4>
            </div>
            <div class="saga-drawer" id="drawer-{game.id}">
              <ul class="saga-list">
                {#each game.games || [] as entry, j (entry.title)}
                  <li class="saga-list-item" style="--j:{j}"><span class="saga-list-title">{entry.title}</span><span class="saga-list-year">{entry.year}</span></li>
                {/each}
              </ul>
            </div>
          </div>
        {:else}
          <div class="game-card" data-id={game.id} style="--i:{i}">
            <div class="game-cover">
              <img src={game.cover} alt={game.title} width="300" height="400" loading="lazy" decoding="async"
                   srcset={srcset(game.cover, [300])} sizes="(max-width: 600px) 33vw, 180px">
            </div>
            <div class="game-meta">
              <span class="game-genre-tag">{game.genre}</span>
              <h4 class="game-name">{game.title}</h4>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</section>
