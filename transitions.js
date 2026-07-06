/* ============================================================
   PAGE TRANSITIONS — Cross-Document View Transitions
   Progressive enhancement:
   • Supporting browsers (Chrome 126+, Safari 18.2+): native
     cross-document view transitions with shared nav bar.
   • Other browsers: manual JS fallback with CSS animations.
============================================================ */

(function () {
    'use strict';

    const DURATION_OUT = 260;
    const DURATION_IN  = 520;

    function getTarget() {
        return document.querySelector('main') || document.querySelector('.container');
    }

    function animateIn() {
        const el = getTarget();
        if (!el) return;
        el.classList.add('pt-enter');
        setTimeout(() => el.classList.remove('pt-enter'), DURATION_IN + 60);
    }

    function animateOut(href) {
        const el = getTarget();
        if (!el) return;
        if (el.classList.contains('pt-leave')) return;
        el.classList.add('pt-leave');
        setTimeout(() => { window.location.href = href; }, DURATION_OUT);
    }

    function isInternalLink(anchor, e) {
        const href = anchor.getAttribute('href');
        if (!href) return false;
        return (
            !anchor.target &&
            !href.startsWith('http') &&
            !href.startsWith('//') &&
            !href.startsWith('mailto:') &&
            !href.startsWith('#') &&
            !anchor.hasAttribute('data-cv-trigger') &&
            !e.ctrlKey && !e.metaKey && !e.shiftKey
        );
    }

    /* ── Detect cross-document View Transitions support ── */
    const supportsCrossDocumentVT = (() => {
        try {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync('@view-transition { navigation: auto; }');
            return sheet.cssRules.length > 0;
        } catch (e) {
            return false;
        }
    })();

    if (supportsCrossDocumentVT) {
        /* ── Native VT path: direction awareness only ── */
        window.addEventListener('pageswap', (event) => {
            if (!event.viewTransition) return;
            const navType = event.activation?.entry?.navigationType;
            sessionStorage.setItem('vt-is-back', navType === 'traverse' ? '1' : '0');
        });

        /* Fallback enter animation for browsers that support VT
           but may still need a subtle load animation (e.g. initial load) */
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', animateIn);
        } else {
            requestAnimationFrame(() => requestAnimationFrame(animateIn));
        }

        window.addEventListener('pageshow', function (e) {
            if (e.persisted) {
                const el = getTarget();
                if (el) el.classList.remove('pt-leave');
                animateIn();
            }
        });

        return;
    }

    /* ── Fallback path: manual JS transitions ── */
    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('a');
        if (!anchor) return;
        if (!isInternalLink(anchor, e)) return;
        if (document.body.classList.contains('cs-is-open')) return;

        e.preventDefault();
        animateOut(anchor.getAttribute('href'));
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', animateIn);
    } else {
        requestAnimationFrame(() => requestAnimationFrame(animateIn));
    }

    window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            const el = getTarget();
            if (el) el.classList.remove('pt-leave');
            animateIn();
        }
    });
})();
