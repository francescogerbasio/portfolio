<script>
  import { onMount } from 'svelte';

  onMount(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const yearsCounter = document.querySelector('.stat-number[data-start-date]');
    if (yearsCounter) {
      const startDate = new Date(yearsCounter.dataset.startDate);
      const updateYears = () => {
        const now = new Date();
        const diffMs = now - startDate;
        const years = diffMs / (365.25 * 24 * 60 * 60 * 1000);
        yearsCounter.textContent = years.toFixed(1) + '+';
      };
      updateYears();
    }

    const titlesCounter = document.querySelector('.stat-number[data-count="20"]');
    if (titlesCounter && !reduced) {
      const animate = (el) => {
        const target = 20;
        const start = performance.now();
        const dur = 1400;
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(2, -10 * p);
          el.textContent = Math.round(target * eased) + '+';
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
        });
      }, { threshold: 0.4 });
      titlesCounter.textContent = '0+';
      obs.observe(titlesCounter);
    }

    if (!reduced && finePointer) {
      document.querySelectorAll('.cert-card').forEach(card => {
        card.addEventListener('pointermove', (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `translateY(-2px) rotateX(${(-y * 2).toFixed(2)}deg) rotateY(${(x * 2).toFixed(2)}deg)`;
        });
        card.addEventListener('pointerleave', () => {
          card.style.transform = '';
        });
      });
    }
  });
</script>
