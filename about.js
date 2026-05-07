document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        const d = document.getElementById('heroDivider');
        if (d) d.classList.add('animate');
    }, 600);

    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach(el => revealObs.observe(el));

    const statsRow = document.getElementById('statsRow');
    if (statsRow) {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.stat-item').forEach((item, i) => {
                        setTimeout(() => item.classList.add('visible'), i * 120);
                    });
                }
            });
        }, { threshold: 0.2 }).observe(statsRow);
    }

    const skillsBlock = document.getElementById('skillsBlock');
    if (skillsBlock) {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.skill-tag').forEach((tag, i) => {
                        setTimeout(() => tag.classList.add('visible'), i * 55);
                    });
                }
            });
        }, { threshold: 0.1 }).observe(skillsBlock);
    }

    const valuesList = document.getElementById('valuesList');
    if (valuesList) {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.value-item').forEach((item, i) => {
                        setTimeout(() => item.classList.add('visible'), i * 100);
                    });
                }
            });
        }, { threshold: 0.1 }).observe(valuesList);
    }

    const timeline = document.getElementById('timeline');
    if (timeline) {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.timeline-item').forEach((item, i) => {
                        setTimeout(() => item.classList.add('visible'), i * 130);
                    });
                }
            });
        }, { threshold: 0.1 }).observe(timeline);
    }

    const bentoGrid = document.getElementById('bentoGrid');
    if (bentoGrid) {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.bento-card').forEach((card, i) => {
                        setTimeout(() => card.classList.add('visible'), i * 80);
                    });
                }
            });
        }, { threshold: 0.1 }).observe(bentoGrid);
    }
});
