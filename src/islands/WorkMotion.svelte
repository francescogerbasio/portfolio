<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  declare global {
    interface Window {
      lenis?: {
        on?: (event: string, callback: () => void) => void;
        off?: (event: string, callback: () => void) => void;
        raf: (time: number) => void;
      };
    }
  }

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = window.lenis;
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroInfo = document.querySelector('.hero-info');
    const sidebar = document.querySelector('.sidebar');
    const sections = gsap.utils.toArray<HTMLElement>('.work-section');
    const cards = gsap.utils.toArray<HTMLElement>('.project-card');
    const magneticTargets = gsap.utils.toArray<HTMLElement>('.theme-toggle, .accordion-trigger, .project-list-item.clickable, .nda-btn, .cs-proto-link, .cs-next-arrow, .cs-next-title');
    const socialIcons = gsap.utils.toArray<HTMLElement>('.social-icon');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const onLenisScroll = () => ScrollTrigger.update();

    gsap.defaults({ ease: 'power2.out', duration: 0.9 });

    if (lenis?.on) lenis.on('scroll', onLenisScroll);

    const ctx = gsap.context(() => {
      const heroGroup = [heroTitle, heroSubtitle, heroInfo, sidebar].filter(Boolean);
      if (heroGroup.length) {
        gsap.fromTo(heroGroup,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out'
          }
        );
      }

      sections.forEach((section) => {
        const title = section.querySelector('.section-title');
        const sectionCards = gsap.utils.toArray<HTMLElement>('.project-card', section);
        if (title) {
          gsap.fromTo(title,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom-=18%'
              }
            }
          );
        }
        if (sectionCards.length) {
          gsap.fromTo(sectionCards,
            { opacity: 0, y: 44 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.12,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom-=10%'
              }
            }
          );
        }
      });

      cards.forEach((card) => {
        card.addEventListener('pointermove', handleCardTilt);
        card.addEventListener('pointerleave', resetCardTilt);
        card.addEventListener('blur', resetCardTilt);
      });

      if (finePointer) {
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

    function handleCardTilt(event: Event) {
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
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
      if (lenis?.off) lenis.off('scroll', onLenisScroll);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  });
</script>
