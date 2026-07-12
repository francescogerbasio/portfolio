import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
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
