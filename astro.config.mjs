// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    // Vercel-specific configuration
    maxDuration: 30,
    // Fix: Ensure CSS files are properly processed
    imageService: true
  }),
  site: 'https://howtofund.travel',
  integrations: [mdx()],
  
  // Fix: Use hybrid mode for better CSS handling
  build: {
    inlineStylesheets: 'auto'
  },
  
  // Fix: Ensure proper asset resolution
  vite: {
    build: {
      assetsInlineLimit: 0, // Don't inline any assets as base64
      cssCodeSplit: true, // Split CSS into smaller files
      rollupOptions: {
        output: {
          // Use a simpler naming pattern for assets
          assetFileNames: 'assets/[name]-[hash:8][extname]',
          // Ensure chunks are properly named
          chunkFileNames: 'chunks/[name]-[hash:8].js',
          // Ensure entry files are properly named
          entryFileNames: 'entries/[name]-[hash:8].js'
        }
      }
    },
    css: {
      // Ensure CSS is properly extracted
      devSourcemap: true
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }
});
