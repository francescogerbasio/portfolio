/* ===================================
   CV LANGUAGE PICKER — Popover API
   =================================== */

document.addEventListener('DOMContentLoaded', function () {
(function () {
    'use strict';

    const picker = document.getElementById('cvPicker');
    if (!picker) return;

    // All nav links that should trigger the picker
    const triggers = document.querySelectorAll('[data-cv-trigger]');

    /* ── Position picker below the clicked trigger (desktop only) ── */
    function positionBelow(trigger) {
        if (window.innerWidth <= 768) return; // mobile uses fixed bottom sheet

        const rect   = trigger.getBoundingClientRect();
        const top    = rect.bottom + 10; // 10px gap below nav link
        const center = rect.left + rect.width / 2;

        picker.style.setProperty('--cv-picker-top',  top  + 'px');
        picker.style.setProperty('--cv-picker-left', center + 'px');
    }

    /* ── Open ── */
    function open(trigger) {
        positionBelow(trigger);
        picker.showPopover(); // native: top layer, focus trap
        trigger.setAttribute('aria-expanded', 'true');
    }

    /* ── Close ── */
    function close() {
        picker.hidePopover(); // native: removes from top layer
        triggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
    }

    /* ── Bind triggers ── */
    triggers.forEach(trigger => {
        trigger.setAttribute('aria-haspopup', 'menu');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', 'cvPicker');

        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            if (picker.matches(':popover-open')) {
                close(); // toggle off
            } else {
                open(this); // open
            }
        });
    });

    /* ── Close on ESC (popover="manual" doesn't auto-close on ESC) ── */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && picker.matches(':popover-open')) close();
    });

    /* ── Close when a CV link is actually clicked ── */
    picker.querySelectorAll('.cv-picker-option').forEach(function (link) {
        link.addEventListener('click', function () {
            // Small delay so the user sees the active state before dismiss
            setTimeout(close, 220);
        });
    });

    /* ── Reposition on resize ── */
    window.addEventListener('resize', function () {
        if (picker.matches(':popover-open')) {
            const activeTrigger = document.querySelector('[data-cv-trigger][aria-expanded="true"]');
            if (activeTrigger) positionBelow(activeTrigger);
        }
    });

})();
});