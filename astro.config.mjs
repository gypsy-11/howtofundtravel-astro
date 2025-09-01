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
  
  // Build optimization settings
  build: {
    // Minify CSS and HTML in production
    inlineStylesheets: 'auto',
    split: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['astro']
        }
      }
    }
  },
  
  // Vite configuration for CSS optimization
  vite: {
    css: {
      // Minify CSS in production
      minify: true,
      // Enable CSS source maps in development
      devSourcemap: true
    },
    build: {
      // Minify JavaScript in production
      minify: false,
      // Enable source maps for debugging
      sourcemap: false,
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Optimize chunk naming
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    },
    // Optimize image handling
    assetsInclude: ['**/*.webp', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg']
  },
  
  // Image optimization settings
  image: {
    // Enable image optimization
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    // Default image quality
    quality: 80,
    // Enable WebP format
    format: ['webp', 'avif'],
    // Responsive image sizes
    densities: [1, 2],
    // Optimize for LCP
    loading: 'eager'
  }
});
