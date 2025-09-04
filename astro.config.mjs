// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel({
    // Vercel-specific configuration for static sites
    webAnalytics: {
      enabled: true
    }
  }),
  site: 'https://howtofund.travel',
  integrations: [mdx()],
  
  // Fix: Disable auto-inlining to ensure all CSS is properly processed
  build: {
    inlineStylesheets: 'never',
    assets: 'assets'
  },
  
  // Ensure public assets are properly handled
  publicDir: './public'
});
