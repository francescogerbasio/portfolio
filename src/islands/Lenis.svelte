<script lang="ts">
  import { onMount } from 'svelte';
  import Lenis from 'lenis';

  declare global {
    interface Window {
      lenis?: Lenis;
    }
  }

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothTouch: false,
      prevent: (node) => Boolean(node.closest('.cs-panel, dialog, [popover]'))
    });

    window.lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.lenis;
    };
  });
</script>
