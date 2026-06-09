document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('scrollToTop');
    if (!btn) return;

    const onScroll = () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // check initial scroll position

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
