<script lang="ts">
  import { onMount } from 'svelte';
  import Lenis from 'lenis';

  declare global {
    interface Window {
      lenis?: Lenis;
      lenisRaf?: { stop: () => void; start: () => void };
    }
  }

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1,
      smoothTouch: false,
      prevent: (node) => Boolean(node.closest('.cs-panel, dialog, [popover]'))
    });

    window.lenis = lenis;

    let rafId = 0;
    let running = false;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    window.lenisRaf = {
      stop: () => {
        if (!running) return;
        running = false;
        window.cancelAnimationFrame(rafId);
      },
      start: () => {
        if (running) return;
        running = true;
        rafId = window.requestAnimationFrame(raf);
      }
    };

    window.lenisRaf.start();
    window.dispatchEvent(new CustomEvent('lenis:ready'));

    return () => {
      window.lenisRaf?.stop();
      delete window.lenisRaf;
      lenis.destroy();
      delete window.lenis;
    };
  });
</script>
