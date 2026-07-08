(function () {
    'use strict';
    const STORAGE_KEY = 'theme';
    const html = document.documentElement;

    function applyThemeCore(theme) {
        html.setAttribute('data-theme', theme);
        html.style.colorScheme = theme;
        const csm = document.querySelector('meta[name="color-scheme"]');
        if (csm) csm.content = theme;
    }

    function applyThemeChrome(theme) {
        const color = theme === 'dark' ? '#252525' : '#fdf5f6';
        let m = document.querySelector('meta[name="theme-color"]');
        if (!m) {
            m = document.createElement('meta');
            m.name = 'theme-color'; m.id = 'themeColorMeta';
            document.head.appendChild(m);
        }
        m.content = color;
    }

    function applyTheme(theme) { applyThemeCore(theme); applyThemeChrome(theme); }

    function getSavedTheme() { return localStorage.getItem(STORAGE_KEY) || 'light'; }

    function toggleTheme() {
        const next = (html.getAttribute('data-theme') || 'light') === 'dark' ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, next);
        // ponytail: data-vt-theme scopes mask CSS so it won't clash with page-nav VT
        html.setAttribute('data-vt-theme', '');
        if (!document.startViewTransition) {
            applyTheme(next);
            html.removeAttribute('data-vt-theme');
            return;
        }
        const t = document.startViewTransition(() => applyThemeCore(next));
        t.finished.finally(() => {
            applyThemeChrome(next);
            html.removeAttribute('data-vt-theme');
        });
    }

    applyTheme(getSavedTheme());

    document.addEventListener('DOMContentLoaded', function () {
        const m = document.getElementById('themeColorMeta');
        if (m) m.content = getSavedTheme() === 'dark' ? '#252525' : '#fdf5f6';
        ['themeToggle', 'themeToggleMobile'].forEach(function (id) {
            var b = document.getElementById(id);
            if (b) b.addEventListener('click', toggleTheme);
        });
        window.addEventListener('storage', function (e) { if (e.key === STORAGE_KEY && e.newValue) applyTheme(e.newValue); });
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? 'dark' : 'light');
        });
    });
})();
