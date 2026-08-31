# Francesco Gerbasio — Portfolio

Source code for [gerbas.io](https://gerbas.io), the personal portfolio of Francesco Gerbasio, a UX/UI Designer and Localization QA Specialist based in Madrid.

[Live site](https://gerbas.io) · [GitHub repository](https://github.com/FrancescoGerbasio/portfolio)

## Overview

The portfolio brings together selected work in product design, interaction design, accessibility, and game localization QA. It also includes an About page, a career timeline, and a personal section covering travel photography, music production, and games.

## Current status

The site is live and the project is under active development. The repository is being moved from the original Astro-based application to a simpler, framework-free static site. The new structure is implemented locally and passes the repository’s link and image-alt checks.

The remaining work is to complete the deployment check for the new root-level structure and merge the migration into the public branch. Until then, the public `main` branch remains on the existing Astro deployment.

## Selected work

### Localization QA

- **Red Dead Redemption** — a protected project available privately on request.
- **[Dead Take](https://www.surgentstudios.com/projects/dead-take)**
- **[Kiln](https://www.doublefine.com/games/kiln)**

### UX/UI design

- Cines Callao
- Abruzzo Experience
- Dicarlobus Redesign
- QuickCheckout

The design projects are presented as interactive case studies, with selected Figma prototypes and process documentation. NDA-protected work is available privately.

## Site sections

- **Work** — selected UX/UI and localization QA projects.
- **About** — background, values, interests, and contact links.
- **Career** — experience, skills, certifications, and CV downloads in English and Spanish.
- **Fun** — travel photography, music production, favorite artists, and games.

## Features

- Responsive layout for desktop and mobile.
- Light and dark themes with persistent preference.
- Native dialog overlays for case studies.
- Page transitions with a browser-supported fallback.
- Scroll-reveal and career timeline animations.
- Travel gallery with country filtering and masonry layout.
- Current location and weather widget powered by [Open-Meteo](https://open-meteo.com/).
- Lazy-loaded WebP images.
- Semantic markup, keyboard-friendly navigation, focus states, and image alt text.

## Technology

The migrated version uses HTML5, CSS3, and vanilla JavaScript with browser APIs. It has no framework, package manager, bundler, or build step; the source files are served directly as a static site.

The repository also contains the previous Astro/Netlify setup while the migration is being finalized. `_headers` and `htaccess` provide cache and security rules for static hosting environments.

## Run locally

From the repository root, start a local HTTP server:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). Do not open the pages with `file://`; the weather widget and other browser APIs require an HTTP server.

Run the local checks with:

```sh
python3 validate.py
```

The validator checks local file references and image alt text in the case-study files.

## Project structure

```text
.
├── index.html                    # Work / landing page
├── about.html                    # Personal background and values
├── career.html                   # Experience, skills, and certifications
├── fun.html                      # Travel, music, and gaming
├── cs-*.html                     # UX/UI case-study content
├── case-study-engine.js          # Case-study loading and overlay behavior
├── case-study-overlays.html      # Shared case-study overlay markup
├── styles.css                    # Main site styles
├── styles-append.css             # Additional site styles
├── about.css / career.css        # Page-specific styles
├── case-study-engine.css         # Case-study overlay styles
├── script.js / fun.js             # Page interactions
├── navigation-ui.js              # Shared navigation behavior
├── transitions.js / theme.js     # Page transitions and theme persistence
├── data-*.js                     # Travel, music, and game content
├── location-config.js            # Current location data
├── cv-picker.js                  # English/Spanish CV selector
├── Assets/                       # Images, fonts, CVs, and certificates
├── _headers / htaccess            # Static-host cache configuration
├── robots.txt                    # Crawler rules
├── sitemap.xml                   # Public page sitemap
└── validate.py                   # Local link and accessibility checks
```

## Deployment

The migrated version is designed for static hosting from the repository root. It requires no install step and no build command. Production deployment will be re-verified after the migration is merged into `main`.

## Contact

- [LinkedIn](https://www.linkedin.com/in/francesco-gerbasio)
- [Instagram](https://www.instagram.com/gerbasio_francesco/)
- [Email](mailto:francesco.gerbasio00@gmail.com)

## Content and licensing

No open-source license is included. Portfolio copy, case-study material, photographs, CVs, certificates, and visual assets should not be reused without permission. Third-party trademarks and linked content belong to their respective owners.
