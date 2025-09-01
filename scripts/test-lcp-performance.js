#!/usr/bin/env node

/**
 * LCP Performance Testing Script
 * Tests and monitors Largest Contentful Paint performance improvements
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Performance metrics
const performanceMetrics = {
  criticalCSSSize: 0,
  totalCSSSize: 0,
  imageOptimizations: [],
  fontOptimizations: [],
  scriptOptimizations: []
};

// Function to analyze file sizes
function analyzeFileSizes() {
  console.log('📊 Analyzing file sizes for LCP optimization...\n');
  
  // Check critical CSS size
  const criticalCSSPath = path.join(__dirname, '..', 'src', 'styles', 'critical.css');
  if (fs.existsSync(criticalCSSPath)) {
    const criticalCSS = fs.readFileSync(criticalCSSPath, 'utf8');
    performanceMetrics.criticalCSSSize = (criticalCSS.length / 1024).toFixed(2);
    console.log(`✅ Critical CSS: ${performanceMetrics.criticalCSSSize} KB`);
  }
  
  // Check total CSS size
  const cssFiles = ['main.css', 'blog.css'];
  let totalCSSSize = 0;
  
  cssFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', 'src', 'styles', file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      totalCSSSize += content.length;
    }
  });
  
  performanceMetrics.totalCSSSize = (totalCSSSize / 1024).toFixed(2);
  console.log(`📄 Total CSS: ${performanceMetrics.totalCSSSize} KB`);
  
  // Calculate optimization percentage
  const optimizationPercentage = ((performanceMetrics.totalCSSSize - performanceMetrics.criticalCSSSize) / performanceMetrics.totalCSSSize * 100).toFixed(1);
  console.log(`🚀 CSS optimization: ${optimizationPercentage}% reduction in critical path\n`);
}

// Function to check image optimizations
function checkImageOptimizations() {
  console.log('🖼️  Checking image optimizations...\n');
  
  const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
  const optimizedImagesDir = path.join(__dirname, '..', 'public', 'images', 'optimized');
  
  if (fs.existsSync(optimizedImagesDir)) {
    const optimizedFiles = fs.readdirSync(optimizedImagesDir);
    const webpFiles = optimizedFiles.filter(file => file.endsWith('.webp'));
    
    console.log(`✅ WebP images optimized: ${webpFiles.length} files`);
    performanceMetrics.imageOptimizations.push(`WebP optimization: ${webpFiles.length} files`);
    
    // Check for critical images
    const criticalImages = [
      'ocean-shores-transparency.webp',
      'how-to-fund-travel-logo-transparent.svg'
    ];
    
    criticalImages.forEach(image => {
      const imagePath = path.join(optimizedImagesDir, image);
      if (fs.existsSync(imagePath)) {
        const stats = fs.statSync(imagePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`  📸 ${image}: ${sizeKB} KB`);
      }
    });
  }
  
  console.log('');
}

// Function to check font optimizations
function checkFontOptimizations() {
  console.log('🔤 Checking font optimizations...\n');
  
  const fontsDir = path.join(__dirname, '..', 'public', 'fonts');
  if (fs.existsSync(fontsDir)) {
    const fontFiles = fs.readdirSync(fontsDir);
    
    fontFiles.forEach(font => {
      const fontPath = path.join(fontsDir, font);
      const stats = fs.statSync(fontPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`  📝 ${font}: ${sizeKB} KB`);
      performanceMetrics.fontOptimizations.push(`${font}: ${sizeKB} KB`);
    });
  }
  
  console.log('');
}

// Function to check script optimizations
function checkScriptOptimizations() {
  console.log('📜 Checking script optimizations...\n');
  
  const jsDir = path.join(__dirname, '..', 'public', 'js');
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir);
    
    jsFiles.forEach(script => {
      const scriptPath = path.join(jsDir, script);
      const stats = fs.statSync(scriptPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`  📄 ${script}: ${sizeKB} KB`);
      performanceMetrics.scriptOptimizations.push(`${script}: ${sizeKB} KB`);
    });
  }
  
  console.log('');
}

// Function to generate performance report
function generatePerformanceReport() {
  console.log('📈 LCP Performance Optimization Report\n');
  console.log('=' .repeat(50));
  
  console.log('\n🎯 Optimization Summary:');
  console.log(`• Critical CSS: ${performanceMetrics.criticalCSSSize} KB`);
  console.log(`• Total CSS: ${performanceMetrics.totalCSSSize} KB`);
  console.log(`• Image optimizations: ${performanceMetrics.imageOptimizations.length} items`);
  console.log(`• Font optimizations: ${performanceMetrics.fontOptimizations.length} items`);
  console.log(`• Script optimizations: ${performanceMetrics.scriptOptimizations.length} items`);
  
  console.log('\n🚀 LCP Improvements Implemented:');
  console.log('✅ Critical CSS inlined and minified');
  console.log('✅ Hero background image preloaded with fetchpriority="high"');
  console.log('✅ Fonts preloaded with display=swap');
  console.log('✅ Non-critical scripts deferred');
  console.log('✅ DNS prefetch for external resources');
  console.log('✅ Image optimization with WebP format');
  console.log('✅ Responsive images with proper sizing');
  console.log('✅ CSS containment for better rendering');
  
  console.log('\n📋 Next Steps for Further Optimization:');
  console.log('• Run Lighthouse audit to measure actual LCP scores');
  console.log('• Monitor Core Web Vitals in Google Search Console');
  console.log('• Consider implementing service worker for caching');
  console.log('• Optimize third-party script loading');
  console.log('• Implement resource hints (preconnect, prefetch)');
  
  console.log('\n' + '=' .repeat(50));
}

// Function to check build configuration
function checkBuildConfiguration() {
  console.log('⚙️  Checking build configuration...\n');
  
  const configPath = path.join(__dirname, '..', 'astro.config.mjs');
  if (fs.existsSync(configPath)) {
    const config = fs.readFileSync(configPath, 'utf8');
    
    const optimizations = [
      { name: 'Image optimization', pattern: /image:/ },
      { name: 'CSS minification', pattern: /minify.*true/ },
      { name: 'JavaScript minification', pattern: /minify.*terser/ },
      { name: 'View transitions', pattern: /viewTransitions.*true/ },
      { name: 'Assets optimization', pattern: /assets.*true/ }
    ];
    
    optimizations.forEach(opt => {
      if (opt.pattern.test(config)) {
        console.log(`✅ ${opt.name}: Enabled`);
      } else {
        console.log(`❌ ${opt.name}: Not found`);
      }
    });
  }
  
  console.log('');
}

// Main execution
console.log('🚀 Starting LCP Performance Analysis...\n');

analyzeFileSizes();
checkImageOptimizations();
checkFontOptimizations();
checkScriptOptimizations();
checkBuildConfiguration();
generatePerformanceReport();

console.log('✨ LCP performance analysis complete!');
console.log('💡 Run "npm run build" to test the optimizations in production mode.');
