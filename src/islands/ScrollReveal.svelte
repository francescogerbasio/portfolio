<script>
  import { onMount } from 'svelte';

  onMount(() => {
    setTimeout(() => {
      const d = document.getElementById('heroDivider');
      if (d) d.classList.add('animate');
    }, 600);

    const supportsScrollDriven = CSS.supports('(animation-timeline: view()) and (animation-range: entry 0% entry 30%)');

    if (!supportsScrollDriven) {
      const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      document.querySelectorAll('.scroll-reveal').forEach(el => revealObs.observe(el));
    }

    function staggerReveal(containerId, childSelector, baseDelay) {
      const container = document.getElementById(containerId);
      if (!container) return;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            container.querySelectorAll(childSelector).forEach((item, i) => {
              setTimeout(() => item.classList.add('visible'), i * baseDelay);
            });
            observer.unobserve(container);
          }
        });
      }, { threshold: 0.1 });
      observer.observe(container);
    }

    staggerReveal('statsRow', '.stat-item', 120);
    staggerReveal('skillsBlock', '.skill-tag', 55);
    staggerReveal('valuesSection', '.value-item', 100);
    staggerReveal('timeline', '.timeline-item', 130);
    staggerReveal('bentoGrid', '.bento-card', 80);
    staggerReveal('certificationsSection', '.cert-card', 100);

  });
</script>
