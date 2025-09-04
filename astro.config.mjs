// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    // Vercel-specific configuration
    webAnalytics: {
      enabled: true
    },
    maxDuration: 30
  }),
  site: 'https://howtofund.travel',
  integrations: [mdx()],
  
  // Fix: Disable auto-inlining to ensure all CSS is properly processed
  build: {
    inlineStylesheets: 'never'
  },
  
  // Vite configuration for better asset handling
  vite: {
    build: {
      assetsDir: 'assets'
    }
  }
});
