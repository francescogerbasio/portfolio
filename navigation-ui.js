(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const navigation = document.querySelector('.navigation');
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileNavLinks = document.querySelectorAll('.mobile-menu .nav-link');

        function closeMobileMenu() {
            if (!hamburgerBtn || !mobileMenu) return;
            hamburgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            hamburgerBtn.setAttribute('aria-label', 'Open navigation menu');
            mobileMenu.setAttribute('aria-hidden', 'true');
        }

        if (hamburgerBtn && mobileMenu) {
            hamburgerBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                const isOpen = mobileMenu.classList.contains('active');
                this.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                this.setAttribute('aria-expanded', String(!isOpen));
                this.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
                mobileMenu.setAttribute('aria-hidden', String(isOpen));
            });
        }

        document.addEventListener('click', function (e) {
            if (!mobileMenu || !hamburgerBtn) return;
            if (!mobileMenu.classList.contains('active')) return;
            if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        if (navigation) {
            let scrollScheduled = false;
            function onScroll() {
                if (scrollScheduled) return;
                scrollScheduled = true;
                requestAnimationFrame(() => {
                    navigation.classList.toggle('scrolled', window.scrollY > 20);
                    scrollScheduled = false;
                });
            }

            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }
    });
})();
