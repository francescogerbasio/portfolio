/* ===================================
   ABOUT PAGE — uses scroll-reveal.js
   =================================== */

document.addEventListener('DOMContentLoaded', function () {

    // Hero divider entrance (keeps its own timing)
    setTimeout(() => {
        const d = document.getElementById('heroDivider');
        if (d) d.classList.add('animate');
    }, 600);

    // Staggered reveals — powered by scroll-reveal.js
    window.staggerReveal('statsRow',      '.stat-item',  120);
    window.staggerReveal('skillsBlock',    '.skill-tag',   55);
    window.staggerReveal('valuesSection', '.value-item', 100);
    window.staggerReveal('timeline',      '.timeline-item', 130);
    window.staggerReveal('bentoGrid',     '.bento-card',   80);
});