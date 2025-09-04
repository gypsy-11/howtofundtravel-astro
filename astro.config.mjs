// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    // Vercel-specific configuration
    maxDuration: 30
  }),
  site: 'https://howtofund.travel',
  integrations: [mdx()],
  
  // Fix: Disable auto-inlining to ensure all CSS is properly processed
  build: {
    inlineStylesheets: 'never'
  },
  
  // Fix: Ensure proper asset resolution
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]'
        }
      }
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }
});
