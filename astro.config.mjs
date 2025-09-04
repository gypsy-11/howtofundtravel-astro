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

  // Vite configuration to optimize builds and reduce empty chunks
  vite: {
    build: {
      rollupOptions: {
        output: {
          // Prevent empty chunks
          manualChunks: undefined,
          // Optimize chunk naming
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    }
  }
});
