<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { travelConfig } from '../data/travel';
  import { musicData } from '../data/music';
  import { gamesData } from '../data/games';

  const CATEGORY_SUBTITLES: Record<string, string> = {
    travel: "Places I've been and stories from the road. Every journey tells a story, and these are mine captured through moments and memories.",
    music: "Songs I've created and the artists who inspire me. Music has always been a passion, from producing my own tracks to discovering new sounds.",
    gaming: "The games I'm playing and the worlds I'm exploring. Gaming isn't just a hobby—it's an art form, a story, and an experience."
  };

  type TravelPhoto = {
    id: string;
    image: string;
    location: string;
    country: string;
    flag: string;
    ar: number;
  };

  let currentCategory = $state('travel');
  let switching = $state(false);
  let currentCountry = $state('all');
  let photos = $state<TravelPhoto[]>([]);
  let shuffledPhotos = $state<TravelPhoto[]>([]);
  let isWindows = $state(false);
  let flagNav: HTMLElement | null = $state(null);
  let flagPill: HTMLElement | null = $state(null);
  let flagResizeObserver: ResizeObserver | null = null;
  let flipped = $state(false);
  let isFlipping = $state(false);
  let previewSrc = $state('');

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
    loadTravel();

    void scheduleMovePill();
    flagNav?.addEventListener('scroll', movePill);
    window.addEventListener('resize', movePill);
    if (flagNav) {
      flagResizeObserver = new ResizeObserver(() => movePill());
      flagResizeObserver.observe(flagNav);
    }

    return () => {
      flagNav?.removeEventListener('scroll', movePill);
      window.removeEventListener('resize', movePill);
      flagResizeObserver?.disconnect();
    };
  });

  function loadTravel() {
    const allPhotos: TravelPhoto[] = [];
    travelConfig.destinations.forEach(destination => {
      const folderPath = `/Assets/Images/Travel/${destination.folder}`;
      for (let i = 1; i <= (destination.photoCount || 0); i++) {
        allPhotos.push({
          id: `${destination.folder}-${i}`,
          image: `${folderPath}/${i}.webp`,
          location: destination.location,
          country: destination.country,
          flag: destination.flag,
          ar: 1.3337
        });
      }
    });
    photos = allPhotos;
    shuffledPhotos = shuffleArray([...allPhotos]);
  }

  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    const seedBuffer = new Uint32Array(1);
    crypto.getRandomValues(seedBuffer);
    let seed = seedBuffer[0];
    for (let i = shuffled.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const j = Math.floor((seed / 233280) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function switchCategory(category: string) {
    if (switching) return;
    switching = true;
    setTimeout(() => {
      currentCategory = category;
      if (category === 'travel') {
        loadTravel();
        void scheduleMovePill();
      }
      switching = false;
    }, 180);
  }

  function srcset(path: string, widths: number[], originalWidth?: number): string {
    const parts = widths.map(w => `${path.replace(/\.webp$/, `-${w}w.webp`)} ${w}w`);
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
    });
  }

  function activateCountryFromCard(country: string) {
    currentCountry = country;
    document.getElementById('travel-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    void scheduleMovePill();
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

  // Gaming state
  let featuredIndex = $state(0);
  let autoTimer: ReturnType<typeof setInterval> | null = null;
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  function startFeaturedAuto() {
    if (prefersReducedMotion) return;
    stopFeaturedAuto();
    autoTimer = setInterval(() => {
      featuredIndex = (featuredIndex + 1) % gamesData.featured.length;
    }, 5000);
  }
  function stopFeaturedAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  onMount(() => {
    startFeaturedAuto();
    const onVisibility = () => {
      if (document.hidden) stopFeaturedAuto();
      else startFeaturedAuto();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stopFeaturedAuto();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  });

  function goToFeatured(n: number) {
    stopFeaturedAuto();
    featuredIndex = (n + gamesData.featured.length) % gamesData.featured.length;
    startFeaturedAuto();
  }

  function onFeaturedKey(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goToFeatured(featuredIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goToFeatured(featuredIndex + 1); }
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
</script>

{#snippet musicCard()}
  {@const song = musicData.mySong}
  {@const canPreview = typeof navigator !== 'undefined' && navigator.onLine && song.youtubeEmbedId}
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
          <div class="song-card-play-btn" role="button" tabindex="0" aria-label="Open on YouTube"
               onclick={() => window.open(song.youtubeUrl, '_blank')}
               onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.open(song.youtubeUrl, '_blank'); } }}>
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
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

<div class="category-nav-top" role="tablist" aria-label="Content categories">
  <button class="category-btn{currentCategory === 'travel' ? ' active' : ''}" data-category="travel" role="tab" aria-selected={currentCategory === 'travel'} aria-controls="travel-section" id="tab-travel" onclick={() => switchCategory('travel')}>Travel</button>
  <button class="category-btn{currentCategory === 'music' ? ' active' : ''}" data-category="music" role="tab" aria-selected={currentCategory === 'music'} aria-controls="music-section" id="tab-music" onclick={() => switchCategory('music')}>Music</button>
  <button class="category-btn{currentCategory === 'gaming' ? ' active' : ''}" data-category="gaming" role="tab" aria-selected={currentCategory === 'gaming'} aria-controls="gaming-section" id="tab-gaming" onclick={() => switchCategory('gaming')}>Gaming</button>
</div>

<p class="category-subtitle" id="categorySubtitle">{CATEGORY_SUBTITLES[currentCategory]}</p>

<section class="category-section{currentCategory === 'travel' ? ' active' : ''}" id="travel-section" role="tabpanel" aria-labelledby="tab-travel" hidden={currentCategory !== 'travel'}>
  <div class="flag-navigation" id="flagNavigation" bind:this={flagNav}>
    <div class="flag-nav-pill" id="flagNavPill" bind:this={flagPill}></div>
    <button class="flag-btn{currentCountry === 'all' ? ' active' : ''}" data-country="all" onclick={() => filterCountry('all')}>{isWindows ? 'All' : '🌍 All'}</button>
    {#each countries as c}
      <button class="flag-btn{currentCountry === c.countryCode ? ' active' : ''}" data-country={c.countryCode} onclick={() => filterCountry(c.countryCode)}>{isWindows ? c.name : `${c.flag} ${c.name}`}</button>
    {/each}
  </div>
  <div class="masonry-grid" id="travelGrid">
    {#if currentCountry === 'all'}
      {#each shuffledPhotos as photo, i (photo.id)}
        <div class="travel-card" data-country={photo.country} data-ar={photo.ar} style="--card-i:{i}"
             role="button" tabindex="0"
             use:makeKeyboardClickable={() => activateCountryFromCard(photo.country)}
             onclick={() => activateCountryFromCard(photo.country)}>
          <img src={photo.image} alt={photo.location} width="800" height="1067" loading="lazy" decoding="async"
               srcset={srcset(photo.image, [315], 630)} sizes="(max-width: 600px) 92vw, (max-width: 1024px) 46vw, (max-width: 1400px) 31vw, 23vw">
          <div class="travel-card-location"><span class="flag">{photo.flag}</span><span class="location-name">{photo.location}</span></div>
        </div>
      {/each}
    {:else}
      {@const filtered = photos.filter(p => p.country === currentCountry)}
      {#if filtered.length === 0}
        <div class="loading-state"><p>No photos for this location yet.</p></div>
      {:else}
        {#each filtered as photo, i (photo.id)}
          <div class="travel-card" data-country={photo.country} data-ar={photo.ar} style="--card-i:{i}"
               role="button" tabindex="0"
               use:makeKeyboardClickable={() => activateCountryFromCard(photo.country)}
               onclick={() => activateCountryFromCard(photo.country)}>
            <img src={photo.image} alt={photo.location} width="800" height="1067" loading="lazy" decoding="async"
                 srcset={srcset(photo.image, [315], 630)} sizes="(max-width: 600px) 92vw, (max-width: 1024px) 46vw, (max-width: 1400px) 31vw, 23vw">
            <div class="travel-card-location"><span class="flag">{photo.flag}</span><span class="location-name">{photo.location}</span></div>
          </div>
        {/each}
      {/if}
    {/if}
  </div>
</section>

<section class="category-section{currentCategory === 'music' ? ' active' : ''}" id="music-section" role="tabpanel" aria-labelledby="tab-music" hidden={currentCategory !== 'music'}>
  <div class="music-category">
    <h3 class="music-category-title">Music Production</h3>
    <div class="my-music-container" id="myMusicContainer">
      {@render musicCard()}
    </div>
  </div>
  <div class="music-category">
    <h3 class="music-category-title">Favorite Artists</h3>
    <div class="artists-grid revealed" id="artistsGrid">
      {#each musicData.artists as artist, i (artist.id)}
        <div class="artist-card" data-index={i} style="--i:{i}"
             role="button" tabindex="0"
             use:makeKeyboardClickable={() => window.open(`https://open.spotify.com/search/${encodeURIComponent(artist.name)}`, '_blank')}
             onclick={() => window.open(`https://open.spotify.com/search/${encodeURIComponent(artist.name)}`, '_blank')}>
          <div class="artist-image">
            {#if artist.image}
              <img src={artist.image} alt={artist.name} width="300" height="400" loading="lazy" decoding="async" srcset={srcset(artist.image, [300, 600])} sizes="(max-width: 600px) 33vw, 200px">
            {/if}
          </div>
          <div class="artist-overlay"></div>
          <div class="artist-info">
            <h4 class="artist-name">{artist.name}</h4>
            <span class="artist-spotify-pill">Open in Spotify</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<section class="category-section{currentCategory === 'gaming' ? ' active' : ''}" id="gaming-section" role="tabpanel" aria-labelledby="tab-gaming" hidden={currentCategory !== 'gaming'}>
  <div class="games-featured" id="gamesFeatured" role="region" aria-roledescription="carousel" aria-label="Featured games" onkeydown={onFeaturedKey}>
    <div class="gf-track" id="gfTrack">
      {#each gamesData.featured as game, i (game.id)}
        <div class="gf-slide{featuredIndex === i ? ' active' : ''}" data-index={i} role="group" aria-roledescription="slide" aria-label="{i + 1} of {gamesData.featured.length}">
          <div class="gf-bg">
            <img src={game.cover} alt={game.title} class="gf-bg-img" width="2100" height="900" loading="lazy" fetchpriority="low" decoding="async"
                 srcset={srcset(game.cover, [800, 1600])} sizes="100vw">
            <div class="gf-bg-overlay"></div>
          </div>
          <div class="gf-content">
            <span class="gf-genre">{game.genre}</span>
            <h2 class="gf-title">{game.title}</h2>
            <span class="gf-year">{game.year}</span>
          </div>
        </div>
      {/each}
    </div>
    <div class="gf-dots" role="tablist" aria-label="Featured game slides">
      {#each gamesData.featured as _, i}
        <button class="gf-dot{featuredIndex === i ? ' active' : ''}" data-i={i} role="tab" aria-label="Go to slide {i + 1}" aria-selected={featuredIndex === i} tabindex={featuredIndex === i ? 0 : -1} onclick={() => goToFeatured(i)}></button>
      {/each}
    </div>
    <button class="gf-arrow gf-prev" aria-label="Previous slide" onclick={() => goToFeatured(featuredIndex - 1)}>‹</button>
    <button class="gf-arrow gf-next" aria-label="Next slide" onclick={() => goToFeatured(featuredIndex + 1)}>›</button>
  </div>

  <div class="games-subsection">
    <h3 class="games-subsection-title"><span class="games-subsection-dot playing"></span>Currently Playing</h3>
    <div class="games-grid small revealed" id="gamesPlaying">
      {#each gamesData.currentlyPlaying as game, i (game.id)}
        <div class="game-card" data-id={game.id} style="--i:{i}">
          <div class="game-cover">
            <img src={game.cover} alt={game.title} width="300" height="400" loading="lazy" decoding="async" srcset={srcset(game.cover, [300, 600])} sizes="(max-width: 600px) 33vw, 180px">
            <div class="game-cover-overlay"></div>
          </div>
          <div class="game-meta">
            <span class="game-genre-tag">{game.genre}</span>
            <h4 class="game-name">{game.title}</h4>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="games-subsection">
    <h3 class="games-subsection-title">All‑Time Favourites</h3>
    <div class="games-grid revealed" id="gamesFavourites">
      {#each gamesData.favorites as game, i (game.id)}
        {#if game.isSaga}
          <div class="game-card saga-card{openSaga === game.id ? ' open' : ''}" data-id={game.id} style="--i:{i}"
               role="button" tabindex="0"
               use:makeKeyboardClickable={() => toggleSaga(game.id)}
               onclick={() => toggleSaga(game.id)}>
            <div class="game-cover">
              <img src={game.cover} alt={game.title} width="300" height="400" loading="lazy" decoding="async" srcset={srcset(game.cover, [300, 600])} sizes="(max-width: 600px) 33vw, 180px">
              <div class="game-cover-overlay"></div>
              <div class="saga-badge">{game.games?.length} games</div>
            </div>
            <div class="game-meta">
              <span class="game-genre-tag">{game.genre}</span>
              <h4 class="game-name">{game.title}</h4>
            </div>
            <div class="saga-drawer" id="drawer-{game.id}">
              <ul class="saga-list">
                {#each game.games || [] as entry}
                  <li class="saga-list-item"><span class="saga-list-title">{entry.title}</span><span class="saga-list-year">{entry.year}</span></li>
                {/each}
              </ul>
            </div>
          </div>
        {:else}
          <div class="game-card" data-id={game.id} style="--i:{i}">
            <div class="game-cover">
              <img src={game.cover} alt={game.title} width="300" height="400" loading="lazy" decoding="async">
              <div class="game-cover-overlay"></div>
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
