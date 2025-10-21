// pwa-navigation.js (v4 - hard block at app entry)
// Goal: on installed PWA, prevent Android from traversing "beyond" the first page (splash/blank).
// Approach:
// - Detect standalone mode.
// - On first load, set a root marker and add multiple guard states.
// - If user tries to go back into the root (or beyond), immediately push a new guard and force forward().

(() => {
    const isStandalone =
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        (navigator.standalone === true); // iOS

    if (!isStandalone) return;

    const SS_KEY = 'pwaPrimed_v4';
    const GUARD_COUNT = 8; // number of back presses absorbed from the start

    function primeHistory() {
        if (sessionStorage.getItem(SS_KEY) === '1') return;

        try {
            const url = location.pathname + location.search + location.hash;
            // Mark current as root and push several guard states above it
            history.replaceState({ pwaRoot: true }, '', url);
            for (let i = 1; i <= GUARD_COUNT; i++) {
                history.pushState({ pwaGuard: i }, '', url);
            }
            sessionStorage.setItem(SS_KEY, '1');
        } catch { /* ignore */ }
    }

    function bounceForward() {
        // Recreate a guard and immediately move forward to cancel the back
        try {
            history.pushState({ pwaGuard: 'bounce' }, '', location.href);
            // Force a forward navigation to neutralize the back press
            history.forward();
        } catch { /* ignore */ }
    }

    primeHistory();

    window.addEventListener('popstate', (ev) => {
        const s = ev.state || {};
        // If we reached the root marker or no known state, don't allow going further back
        if (s.pwaRoot || (!s.pwaRoot && !s.pwaGuard)) {
            bounceForward();
        }
    }, { passive: true });

    // Open external links outside the PWA so we don't leave the app container
    document.addEventListener('click', (e) => {
        const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) return;
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        const url = new URL(href, location.origin);
        if (url.origin !== location.origin) {
            a.target = '_blank';
            a.rel = 'noopener,noreferrer';
        }
    }, true);
})();
