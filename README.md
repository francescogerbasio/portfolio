# Francesco Gerbasio — Portfolio

Source code for [gerbas.io](https://gerbas.io), the personal portfolio of Francesco Gerbasio, a UX/UI Designer and Localization QA Specialist based in Madrid.

[Live site](https://gerbas.io) · [GitHub repository](https://github.com/FrancescoGerbasio/portfolio)

## Overview

The portfolio brings together selected work in product design, interaction design, accessibility, and game localization QA. It also includes an About page, a career timeline, and a personal section covering travel photography, music production, and games.

## Current status

The migration from the original static HTML/CSS/JavaScript portfolio to Astro is complete and merged into `main`. The current site uses Astro for static generation and Svelte islands for interactive behavior.

The site is live at [gerbas.io](https://gerbas.io) and continues to evolve as new work and content are added.

## Selected work

### Localization QA

- **Red Dead Redemption** — a protected project presented privately because of NDA restrictions.
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
- Lazy-loaded and responsive WebP images.
- Semantic markup, keyboard-friendly navigation, focus states, and image alt text.

## Built with

- [Astro](https://astro.build/) for pages and static generation
- [Svelte](https://svelte.dev/) for interactive islands
- [GSAP](https://gsap.com/) and [Lenis](https://lenis.darkroom.engineering/) for animation and smooth scrolling
- CSS with custom properties, cascade layers, and responsive layouts
- Open-Meteo for weather data
- Netlify for deployment configuration and hosting support

## Run locally

The project requires Node.js `22.12.0` or newer.

```sh
npm ci
npm run dev
```

Open the local URL shown by Astro. To create a production build and preview it locally:

```sh
npm run build
npm run preview
```

Run the checks with:

```sh
npm run check
python3 validate.py
```

`validate.py` checks the generated site in `dist/` for missing local references and image alt text.

## Project structure

```text
.
├── src/
│   ├── components/              # Shared Astro components
│   ├── data/                    # Travel, music, game, and location data
│   ├── islands/                 # Svelte interactive islands
│   ├── layouts/                 # Shared page layouts
│   ├── pages/                   # Site routes
│   └── styles/                  # Global and page-specific styles
├── public/                      # Static assets and public files
├── astro.config.mjs             # Astro configuration
├── package.json                 # Scripts and dependencies
├── netlify.toml                 # Netlify build configuration
├── .github/workflows/           # GitHub Pages workflow
└── validate.py                  # Build validation checks
```

## Deployment

The Astro build outputs the production site to `dist/`. `netlify.toml` configures Netlify to run `npm run build` and publish that directory. The repository also includes a GitHub Pages workflow for the `test` branch.

## Contact

- [LinkedIn](https://www.linkedin.com/in/francesco-gerbasio)
- [Instagram](https://www.instagram.com/gerbasio_francesco/)
- [Email](mailto:francesco.gerbasio00@gmail.com)

## Content and licensing

No open-source license is included. Portfolio copy, case-study material, photographs, CVs, certificates, and visual assets should not be reused without permission. Third-party trademarks and linked content belong to their respective owners.
