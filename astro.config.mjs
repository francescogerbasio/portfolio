import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// Detect deployment target: GitHub Pages needs /portfolio/ base, Netlify uses root
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

// https://astro.build/config
export default defineConfig({
  base: isGitHubPages ? '/portfolio/' : '/',
  output: 'static',
  integrations: [svelte()],
  build: {
    format: 'file',
    assets: '_astro'
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  vite: {
    build: {
      cssCodeSplit: true
    },
    css: {
      transformer: 'lightningcss'
    }
  }
});
