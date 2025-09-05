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
    // Enable image service
    imageService: true
  }),
  site: 'https://howtofund.travel',
  integrations: [mdx()],
  
  // Ensure all styles are inlined to avoid 404 errors
  build: {
    inlineStylesheets: 'always'
  },
  
  // Fix asset handling
  vite: {
    build: {
      assetsInlineLimit: 0, // Don't inline any assets as base64
      cssCodeSplit: false, // Don't split CSS to avoid missing files
      rollupOptions: {
        output: {
          // Use a simpler naming pattern for assets
          assetFileNames: 'assets/[name].[ext]',
          // Ensure chunks are properly named
          chunkFileNames: 'chunks/[name].js',
          // Ensure entry files are properly named
          entryFileNames: 'entries/[name].js'
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
