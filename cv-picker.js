/* ===================================
   CV LANGUAGE PICKER — Invoker Commands + Popover API
   =================================== */

document.addEventListener('DOMContentLoaded', function () {
(function () {
    'use strict';

    const picker = document.getElementById('cvPicker');
    if (!picker) return;

    const triggers = document.querySelectorAll('[commandfor="cvPicker"]');
    let lastTrigger = null;

    /* ── Position picker below the clicked trigger (desktop only) ── */
    function positionBelow(trigger) {
        if (window.innerWidth <= 768) return;

        const rect   = trigger.getBoundingClientRect();
        const top    = rect.bottom + 10;
        const center = rect.left + rect.width / 2;

        picker.style.setProperty('--cv-picker-top',  top  + 'px');
        picker.style.setProperty('--cv-picker-left', center + 'px');
    }

    /* ── Track which trigger was clicked (for positioning) ── */
    triggers.forEach(trigger => {
        trigger.addEventListener('click', function () {
            lastTrigger = this;
        });
    });

    /* ── Position on open (beforetoggle fires before popover is visible) ── */
    picker.addEventListener('beforetoggle', function (e) {
        if (e.newState === 'open' && lastTrigger) {
            positionBelow(lastTrigger);
        }
    });

    /* ── Sync aria-expanded on all triggers ── */
    picker.addEventListener('toggle', function (e) {
        const isOpen = e.newState === 'open';
        triggers.forEach(t => t.setAttribute('aria-expanded', isOpen ? 'true' : 'false'));
    });

    /* ── Close when a CV link is clicked ── */
    picker.querySelectorAll('.cv-picker-option').forEach(function (link) {
        link.addEventListener('click', function () {
            setTimeout(() => picker.hidePopover(), 220);
        });
    });

    /* ── Reposition on resize ── */
    window.addEventListener('resize', function () {
        if (picker.matches(':popover-open') && lastTrigger) {
            positionBelow(lastTrigger);
        }
    });

    /* ── Fallback: JS toggle for browsers without invoker commands ── */
    if (!('commandForElement' in HTMLButtonElement.prototype)) {
        triggers.forEach(trigger => {
            trigger.setAttribute('aria-haspopup', 'popover');

            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                if (picker.matches(':popover-open')) {
                    picker.hidePopover();
                } else {
                    picker.showPopover();
                }
            });
        });
    }

})();
});