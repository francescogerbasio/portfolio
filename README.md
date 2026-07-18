# Francesco Gerbasio — Portfolio

Personal portfolio website for Francesco Gerbasio, a UX/UI Designer and Localization QA Specialist based in Madrid.

- **Live website:** [gerbas.io](https://gerbas.io)
- **Repository:** [github.com/FrancescoGerbasio/portfolio](https://github.com/FrancescoGerbasio/portfolio)

## About the project

This portfolio brings together Francesco’s work across product design, interaction design, accessibility, and game localization QA. It is designed to show both the thinking behind each project and the person behind the work.

The site combines structured case studies with a more personal space for travel photography, music production, and gaming. The visual direction is editorial, expressive, and focused on clear storytelling rather than a conventional template-based portfolio.

## What’s included

### Work

The homepage presents two areas of work:

- **Localization QA:** *** **** **********, Dead Take, and Kiln.
- **UX/UI Design:** Cines Callao, Abruzzo Experience, Dicarlobus Redesign, and QuickCheckout.

The UX/UI projects include interactive case studies and links to selected Figma prototypes. NDA-protected work is presented through a private-project prompt.

### About

The About page introduces Francesco’s background, design values, current interests, and contact links.

### Career

The Career page covers skills, professional experience, certifications, and downloadable CVs in English and Spanish.

### Fun

The Fun page is a personal archive of:

- Travel photography from different cities and countries.
- Music production and favorite artists.
- Favorite, currently playing, and featured video games.

## Features

- Responsive layout for desktop and mobile.
- Light and dark themes.
- Native dialog overlays for case studies.
- Smooth page transitions with a browser-supported fallback.
- Scroll-based reveal animations.
- Dynamic travel gallery with country filtering.
- Current location and weather widget.
- Lazy-loaded images and responsive WebP assets.
- Accessible navigation, focus states, semantic markup, and image alt text.

## Built with

- HTML5
- CSS3 with responsive layouts, custom properties, cascade layers, and modern animation APIs
- Vanilla JavaScript with browser APIs
- WebP, SVG, WOFF2, and PDF assets
- [Open-Meteo](https://open-meteo.com/) for the weather widget
- [Netlify](https://www.netlify.com/) for static hosting

The project has no framework, package manager, bundler, or build step. The source files are deployed directly as a static website.

## Project structure

```text
.
├── index.html                    # Work / landing page
├── about.html                    # Personal background and values
├── career.html                   # Experience, skills, and certifications
├── fun.html                      # Travel, music, and gaming
├── cs-*.html                     # UX/UI case-study content
├── styles.css                    # Main site styles
├── about.css / career.css        # Page-specific styles
├── case-study-engine.css         # Case-study overlay styles
├── script.js                     # Shared site interactions
├── fun.js                        # Fun page interactions
├── data-*.js                     # Travel, music, and game content
├── location-config.js            # Current location data
├── Assets/                       # Images, fonts, CVs, and certificates
├── _headers                      # Netlify headers
├── robots.txt                    # Crawler rules
├── sitemap.xml                   # Public page sitemap
└── validate.py                   # Local link and accessibility checks
```

## Deployment

The site is suitable for any static hosting provider. The production site is deployed on Netlify, with [`_headers`](_headers) providing cache and security headers. There is no build command required.

## Contact

- [LinkedIn](https://www.linkedin.com/in/francesco-gerbasio)
- [Instagram](https://www.instagram.com/gerbasio_francesco/)
- [Email](mailto:francesco.gerbasio00@gmail.com)

## Content and licensing

No open-source license is currently included. Portfolio copy, case-study material, photographs, CVs, certificates, and visual assets should not be reused without permission. Third-party trademarks and linked content belong to their respective owners.
