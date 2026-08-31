<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  declare global {
    interface Window {
      __motion?: boolean;
      lenis?: {
        on?: (event: string, callback: () => void) => void;
        off?: (event: string, callback: () => void) => void;
        raf: (time: number) => void;
      };
      lenisRaf?: { stop: () => void; start: () => void };
    }
  }

  onMount(() => {
    window.__motion = true; // tells the head fallback that motion took over
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const hero = document.querySelector<HTMLElement>('.hero');
    const heroContent = document.querySelector<HTMLElement>('.hero-content');
    const heroSubtitle = document.querySelector<HTMLElement>('.hero-subtitle');
    const sidebar = document.querySelector<HTMLElement>('.sidebar');
    const sections = gsap.utils.toArray<HTMLElement>('.work-section');
    const cards = gsap.utils.toArray<HTMLElement>('.project-card');
    const magneticTargets = gsap.utils.toArray<HTMLElement>('.project-list-item.clickable, .cs-proto-link, .cs-next-arrow, .cs-next-title');
    const socialIcons = gsap.utils.toArray<HTMLElement>('.social-icon');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const wideEnough = window.innerWidth >= 900;
    const enableParallax = finePointer && wideEnough && Boolean(hero);
    const onLenisScroll = () => ScrollTrigger.update();
    let lenisCleanup: (() => void) | undefined;

    const syncLenis = () => {
      const lenis = window.lenis;
      if (!lenis?.on || !lenis?.raf || lenisCleanup) return;
      lenis.on('scroll', onLenisScroll);
      const drive = (time: number) => lenis.raf(time * 1000);
      window.lenisRaf?.stop();
      gsap.ticker.add(drive);
      gsap.ticker.lagSmoothing(0);
      lenisCleanup = () => {
        lenis.off?.('scroll', onLenisScroll);
        gsap.ticker.remove(drive);
        gsap.ticker.lagSmoothing(500, 33);
        window.lenisRaf?.start();
      };
    };

    if (window.lenis) syncLenis();
    else window.addEventListener('lenis:ready', syncLenis, { once: true });

    gsap.defaults({ ease: 'power3.out' });

    const ctx = gsap.context(() => {
      if (hero) {
        gsap.fromTo(hero,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.72, ease: 'power3.out' }
        );
      }

      initHeroCharReveal();

      if (enableParallax && hero) {
        gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        })
          .to(heroContent ?? hero, { y: -18, ease: 'none' }, 0)
          .to(sidebar ?? hero, { y: -10, ease: 'none' }, 0)
          .to(heroSubtitle ?? hero, { y: -26, ease: 'none' }, 0);
      }

      sections.forEach((section) => {
        const isFirst = section === sections[0];
        const title = section.querySelector<HTMLElement>('.section-title');
        const sectionCards = gsap.utils.toArray<HTMLElement>('.project-card', section);
        if (title) {
          gsap.fromTo(title,
            { autoAlpha: 0, y: isFirst ? 22 : 32 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              delay: isFirst ? 0.6 : 0,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom-=18%'
              }
            }
          );
        }
        if (sectionCards.length) {
          gsap.fromTo(sectionCards,
            { autoAlpha: 0, y: isFirst ? 56 : 44 },
            {
              autoAlpha: 1,
              y: 0,
              stagger: isFirst ? { each: 0.22, from: 'start' } : 0.12,
              duration: isFirst ? 0.78 : 0.55,
              delay: isFirst ? 0.7 : 0,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom-=10%'
              }
            }
          );
        }
      });

      if (finePointer) {
        cards.forEach((card) => {
          card.addEventListener('pointermove', handleCardTilt);
          card.addEventListener('pointerleave', resetCardTilt);
          card.addEventListener('blur', resetCardTilt);
        });
        magneticTargets.forEach((target) => {
          target.addEventListener('pointermove', handleMagnetMove);
          target.addEventListener('pointerleave', resetMagnet);
          target.addEventListener('blur', resetMagnet);
        });
      }

      socialIcons.forEach((icon) => {
        icon.addEventListener('click', handleSocialClick);
      });
    });

    ScrollTrigger.refresh();

    function initHeroCharReveal() {
      const title = document.querySelector<HTMLElement>('.hero-title');
      if (!title) return;
      const original = title.textContent ?? '';
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      title.setAttribute('aria-label', original);

      const chars = Array.from(original);
      title.textContent = '';
      const spans: HTMLElement[] = [];
      chars.forEach((ch) => {
        const span = document.createElement('span');
        span.className = 'hero-char';
        span.textContent = ch;
        title.appendChild(span);
        spans.push(span);
      });

      gsap.set(spans, {
        opacity: 0,
        scale: 0.2,
        x: () => gsap.utils.random(-60, 60),
        y: () => gsap.utils.random(-40, 40),
        rotate: () => gsap.utils.random(-25, 25)
      });

      gsap.to(spans, {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        rotate: 0,
        duration: 1.0,
        ease: 'elastic.out(1, 0.6)',
        stagger: { each: 0.035, from: 'start' },
        delay: 0.6
      });
    }

    function handleCardTilt(event: Event) {
      const card = event.currentTarget as HTMLElement;
      const pointerEvent = event as PointerEvent;
      const rect = card.getBoundingClientRect();
      const x = (pointerEvent.clientX - rect.left) / rect.width;
      const y = (pointerEvent.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 8;
      const rotateX = (0.5 - y) * 8;
      gsap.to(card, {
        rotateX,
        rotateY,
        y: -6,
        transformPerspective: 900,
        transformOrigin: 'center',
        duration: 0.25,
        overwrite: true
      });
    }

    function resetCardTilt(event: Event) {
      gsap.to(event.currentTarget as HTMLElement, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        duration: 0.35,
        overwrite: true
      });
    }

    function handleMagnetMove(event: Event) {
      const target = event.currentTarget as HTMLElement;
      const pointerEvent = event as PointerEvent;
      const rect = target.getBoundingClientRect();
      const x = ((pointerEvent.clientX - rect.left) / rect.width) - 0.5;
      const y = ((pointerEvent.clientY - rect.top) / rect.height) - 0.5;
      const strength = target.matches('.project-list-item, .accordion-trigger') ? 10 : 14;
      gsap.to(target, {
        x: x * strength,
        y: y * strength,
        duration: 0.28,
        ease: 'power3.out',
        overwrite: true
      });
    }

    function resetMagnet(event: Event) {
      gsap.to(event.currentTarget as HTMLElement, {
        x: 0,
        y: 0,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: true
      });
    }

    function handleSocialClick(event: Event) {
      gsap.fromTo(event.currentTarget as HTMLElement,
        { scale: 0.92 },
        {
          scale: 1,
          duration: 0.32,
          ease: 'back.out(2.2)',
          overwrite: true
        }
      );
    }

    return () => {
      cards.forEach((card) => {
        card.removeEventListener('pointermove', handleCardTilt);
        card.removeEventListener('pointerleave', resetCardTilt);
        card.removeEventListener('blur', resetCardTilt);
      });
      magneticTargets.forEach((target) => {
        target.removeEventListener('pointermove', handleMagnetMove);
        target.removeEventListener('pointerleave', resetMagnet);
        target.removeEventListener('blur', resetMagnet);
      });
      socialIcons.forEach((icon) => {
        icon.removeEventListener('click', handleSocialClick);
      });
      ctx.revert();
      lenisCleanup?.();
      window.removeEventListener('lenis:ready', syncLenis);
    };
  });
</script>
