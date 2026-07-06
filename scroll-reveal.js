/* ===================================
   SCROLL REVEAL — Shared Utility
   Used by about.js and career.js
   =================================== */

document.addEventListener('DOMContentLoaded', function () {

    const supportsScrollDriven = CSS.supports('(animation-timeline: view()) and (animation-range: entry 0% entry 30%)');

    // ── Generic scroll-reveal for .scroll-reveal elements ──
    // Use native CSS scroll-driven animations when available; fall back to IO.
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

    // ── Staggered reveal for child elements within a container ──
    // Call after page loads so container dimensions are stable.
    function staggerReveal(containerId, childSelector, baseDelay) {
        const container = document.getElementById(containerId);
        if (!container) return;

        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    container.querySelectorAll(childSelector).forEach((item, i) => {
                        setTimeout(() => item.classList.add('visible'), i * baseDelay);
                    });
                }
            });
        }, { threshold: 0.1 }).observe(container);
    }

    // Expose globally so page-specific scripts can use it
    window.staggerReveal = staggerReveal;
});