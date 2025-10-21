// footer.js — Footer with semantic blocks + i18n + center column (socials + review)
// + Floating Review FAB (bottom-right) that hides when footer is visible

const LOCALES = {
    pt: {
        phoneTitle: "Contacte-nos:",
        addressTitle: "Visite a nossa loja:",
        socialsTitle: "Encontre-nos nas redes:",
        reviewCta: "Avalie-nos no Google",
        phoneAria: "Ligar por telefone",
        addressAria: "Abrir localização no mapa",
        socialsAria: "Redes sociais",
        reviewAria: "Abrir página de reviews no Google",
        fabTextDesktop: "Deixe-nos uma Review", // desktop
        fabTextMobile: "Review",                 // mobile
        fabAria: "Abrir página de reviews no Google"
    },
    en: {
        phoneTitle: "Call us:",
        addressTitle: "Visit our store:",
        socialsTitle: "Find us on socials:",
        reviewCta: "Leave us a review on Google",
        phoneAria: "Call by phone",
        addressAria: "Open location on the map",
        socialsAria: "Social networks",
        reviewAria: "Open Google reviews page",
        fabTextDesktop: "Review us", // desktop
        fabTextMobile: "Review",     // mobile
        fabAria: "Open Google reviews page"
    },
    fr: {
        phoneTitle: "Contactez-nous :",
        addressTitle: "Visitez notre magasin :",
        socialsTitle: "Retrouvez-nous sur les réseaux :",
        reviewCta: "Laissez-nous un avis sur Google",
        phoneAria: "Appeler par téléphone",
        addressAria: "Ouvrir l’emplacement sur la carte",
        socialsAria: "Réseaux sociaux",
        reviewAria: "Ouvrir la page d’avis Google",
        fabTextDesktop: "Laissez-nous un avis", // desktop
        fabTextMobile: "Avis",                  // mobile
        fabAria: "Ouvrir la page d’avis Google"
    }
};


const LANG = (document.documentElement.lang || "en").toLowerCase().slice(0,2);
const T = LOCALES[LANG] || LOCALES.en;

const FOOTER_DATA = {
    phoneDisplay: "265 236 666",
    phoneHref: "tel:+351265236666",
    addressDisplay: ["Avenida Luísa Todi, 518", "2900-456 Setúbal", "Portugal"],
    addressHref: "https://maps.app.goo.gl/hkUTxjE4JNztxfn16",
    socials: [
        {
            label: "Tripadvisor",
            href: "https://www.tripadvisor.pt/Restaurant_Review-g189163-d6888889-Reviews-Vicci_gelados_e_crepes-Setubal_Setubal_District_Alentejo.html",
            iconSrc: "./assets/icons/tripadvisor.svg", iconAlt: "Tripadvisor"
        },
        {
            label: "Facebook",
            href: "https://www.facebook.com/share/1A9nazbant/",
            iconSrc: "./assets/icons/facebook.svg", iconAlt: "Facebook"
        },
        {
            label: "Instagram",
            href: "https://www.instagram.com/vicci_setubal",
            iconSrc: "./assets/icons/instagram.svg", iconAlt: "Instagram"
        },
        // {
        //     label: "Foursquare",
        //     href: "https://foursquare.com/v/your_page",
        //     iconSrc: "./imagens/social-foursquare.png",  iconAlt: "Foursquare"
        // },
        // {
        //     label: "TheFork",
        //     href: "https://www.thefork.pt/restaurante/your_page",
        //     iconSrc: "./imagens/social-thefork.png", iconAlt: "TheFork"
        // }
    ],
    review: {
        href: "https://g.page/r/CbM4WLTEiEf4EBM/review",
        iconSrc: "./assets/icons/google_g_icon.png",
        iconAlt: "Google"
    }
};

(function injectFooter(){
    const mount = document.getElementById("site-footer");
    if (!mount) return;

    const addressLines = FOOTER_DATA.addressDisplay.map(line => `<span>${line}</span>`).join("");

    const socials = FOOTER_DATA.socials.map(s => `
    <a class="social" href="${s.href}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}">
      <img src="${s.iconSrc}" alt="${s.iconAlt}" loading="lazy" />
    </a>
  `).join("");

    mount.innerHTML = `
    <footer class="footer" role="contentinfo" aria-label="Site footer">
      <div class="content-width">
        <div class="footer-row">
          <!-- Left: Phone -->
          <div class="footer-phone">
            <h3>${T.phoneTitle}</h3>
            <a class="cta cta-phone" href="${FOOTER_DATA.phoneHref}" aria-label="${T.phoneAria} ${FOOTER_DATA.phoneDisplay}">
              ${FOOTER_DATA.phoneDisplay}
            </a>
          </div>

          <!-- Center: Socials (top) + Review button (below) -->
          <div class="footer-center">
            <div class="footer-socials">
              <h4>${T.socialsTitle}</h4>
              <div class="socials" aria-label="${T.socialsAria}">
                ${socials}
              </div>
            </div>
            <div class="footer-review">
              <a class="review-btn" href="${FOOTER_DATA.review.href}" target="_blank" rel="noopener noreferrer" aria-label="${T.reviewAria}">
                <img src="${FOOTER_DATA.review.iconSrc}" alt="${FOOTER_DATA.review.iconAlt}" />
                <span>${T.reviewCta}</span>
              </a>
            </div>
          </div>

          <!-- Right: Address -->
          <div class="footer-address">
            <h3>${T.addressTitle}</h3>
            <a class="cta cta-address" href="${FOOTER_DATA.addressHref}" target="_blank" rel="noopener noreferrer" aria-label="${T.addressAria}">
              ${addressLines}
            </a>
          </div>
        </div>
      </div>
    </footer>
  `;

    // --- Inject Floating Review FAB (bottom-right) ---
    const fab = document.createElement('a');
    fab.className = 'review-fab';
    fab.href = FOOTER_DATA.review.href;
    fab.target = '_blank';
    fab.rel = 'noopener noreferrer';
    fab.setAttribute('aria-label', T.fabAria);
    fab.innerHTML = `
  <img src="${FOOTER_DATA.review.iconSrc}" alt="${FOOTER_DATA.review.iconAlt}" />
  <span></span>
`;
    document.body.appendChild(fab);

// Pick label based on viewport (desktop vs mobile)
    const mqDesktop = window.matchMedia('(min-width: 1024px)');
    function applyFabText() {
        const label = mqDesktop.matches ? T.fabTextDesktop : T.fabTextMobile;
        fab.querySelector('span').textContent = label;
    }
    mqDesktop.addEventListener ? mqDesktop.addEventListener('change', applyFabText)
        : mqDesktop.addListener(applyFabText); // older Safari
    applyFabText();

// Hide FAB when footer cta btn is visible (IntersectionObserver)
    const footerEl = document.querySelector('.footer-review');
    if ('IntersectionObserver' in window && footerEl) {
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) fab.classList.add('is-hidden');
            else fab.classList.remove('is-hidden');
        }, { root: null, threshold: 0.1 });
        io.observe(footerEl);
    }


})();
