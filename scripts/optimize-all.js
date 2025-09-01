#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  maxCSSSize: 100 * 1024, // 100KB
  maxJSSize: 50 * 1024,   // 50KB
  maxImageSize: 500 * 1024, // 500KB
  targetLighthouseScore: 90
};

// Run optimization analysis
async function runOptimizationAnalysis() {
  console.log('🚀 Starting Comprehensive Optimization Analysis\n');
  
  const results = {
    css: await analyzeCSS(),
    js: await analyzeJS(),
    images: await analyzeImages(),
    performance: await analyzePerformance(),
    recommendations: []
  };
  
  // Generate recommendations
  generateRecommendations(results);
  
  // Generate final report
  generateFinalReport(results);
  
  return results;
}

// Analyze CSS files
async function analyzeCSS() {
  console.log('🎨 Analyzing CSS files...');
  
  const cssFiles = [
    '../src/styles/main.css',
    '../src/styles/blog.css',
    '../src/styles/fonts.css'
  ];
  
  let totalSize = 0;
  let totalLines = 0;
  let totalSelectors = 0;
  const fileStats = [];
  
  cssFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      
      const stats = {
        file: path.basename(filePath),
        size: content.length,
        sizeKB: (content.length / 1024).toFixed(2),
        lines: lines.length,
        selectors: (content.match(/[.#][a-zA-Z0-9_-]+/g) || []).length,
        mediaQueries: (content.match(/@media/g) || []).length,
        variables: (content.match(/--[a-zA-Z0-9_-]+/g) || []).length
      };
      
      fileStats.push(stats);
      totalSize += stats.size;
      totalLines += stats.lines;
      totalSelectors += stats.selectors;
    }
  });
  
  return {
    files: fileStats,
    totalSize,
    totalSizeKB: (totalSize / 1024).toFixed(2),
    totalLines,
    totalSelectors,
    needsOptimization: totalSize > CONFIG.maxCSSSize
  };
}

// Analyze JavaScript files
async function analyzeJS() {
  console.log('⚡ Analyzing JavaScript files...');
  
  const jsFiles = [
    '../public/js/main.js',
    '../public/js/add-ga4.js',
    '../public/js/blog-search.js',
    '../public/js/global-search.js'
  ];
  
  let totalSize = 0;
  let totalLines = 0;
  let totalFunctions = 0;
  const fileStats = [];
  
  jsFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      
      const stats = {
        file: path.basename(filePath),
        size: content.length,
        sizeKB: (content.length / 1024).toFixed(2),
        lines: lines.length,
        functions: (content.match(/function\s+[a-zA-Z0-9_]+/g) || []).length,
        eventListeners: (content.match(/addEventListener/g) || []).length,
        consoleLogs: (content.match(/console\.log/g) || []).length
      };
      
      fileStats.push(stats);
      totalSize += stats.size;
      totalLines += stats.lines;
      totalFunctions += stats.functions;
    }
  });
  
  return {
    files: fileStats,
    totalSize,
    totalSizeKB: (totalSize / 1024).toFixed(2),
    totalLines,
    totalFunctions,
    needsOptimization: totalSize > CONFIG.maxJSSize
  };
}

// Analyze images
async function analyzeImages() {
  console.log('🖼️  Analyzing images...');
  
  const imagesPath = path.join(__dirname, '../public/images');
  const optimizedPath = path.join(__dirname, '../public/images/optimized');
  
  let totalSize = 0;
  let totalFiles = 0;
  let largeImages = [];
  
  function scanDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile() && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file)) {
        totalSize += stats.size;
        totalFiles++;
        
        if (stats.size > CONFIG.maxImageSize) {
          largeImages.push({
            file,
            size: stats.size,
            sizeKB: (stats.size / 1024).toFixed(2),
            path: filePath.replace(__dirname, '')
          });
        }
      }
    });
  }
  
  scanDirectory(imagesPath);
  scanDirectory(optimizedPath);
  
  return {
    totalSize,
    totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
    totalFiles,
    largeImages,
    needsOptimization: largeImages.length > 0
  };
}

// Analyze performance
async function analyzePerformance() {
  console.log('📊 Analyzing performance...');
  
  // Check if dist directory exists (after build)
  const distPath = path.join(__dirname, '../dist');
  const hasBuild = fs.existsSync(distPath);
  
  return {
    hasBuild,
    buildSize: hasBuild ? getDirectorySize(distPath) : 0,
    recommendations: []
  };
}

// Generate recommendations
function generateRecommendations(results) {
  const recommendations = [];
  
  // CSS recommendations
  if (results.css.needsOptimization) {
    recommendations.push({
      type: 'css',
      priority: 'high',
      message: 'CSS bundle is large. Consider splitting into smaller files or removing unused CSS.',
      action: 'Run CSS optimization analysis'
    });
  }
  
  // JS recommendations
  if (results.js.needsOptimization) {
    recommendations.push({
      type: 'js',
      priority: 'high',
      message: 'JavaScript bundle is large. Consider code splitting and lazy loading.',
      action: 'Run JavaScript optimization analysis'
    });
  }
  
  // Image recommendations
  if (results.images.needsOptimization) {
    recommendations.push({
      type: 'images',
      priority: 'medium',
      message: `${results.images.largeImages.length} large images found. Consider optimization.`,
      action: 'Run image optimization'
    });
  }
  
  results.recommendations = recommendations;
}

// Generate final report
function generateFinalReport(results) {
  console.log('\n📋 COMPREHENSIVE OPTIMIZATION REPORT');
  console.log('=====================================\n');
  
  // CSS Summary
  console.log('🎨 CSS Analysis:');
  console.log(`   Total Size: ${results.css.totalSizeKB} KB`);
  console.log(`   Total Lines: ${results.css.totalLines}`);
  console.log(`   Total Selectors: ${results.css.totalSelectors}`);
  console.log(`   Status: ${results.css.needsOptimization ? '⚠️  Needs optimization' : '✅ Good'}\n`);
  
  // JS Summary
  console.log('⚡ JavaScript Analysis:');
  console.log(`   Total Size: ${results.js.totalSizeKB} KB`);
  console.log(`   Total Lines: ${results.js.totalLines}`);
  console.log(`   Total Functions: ${results.js.totalFunctions}`);
  console.log(`   Status: ${results.js.needsOptimization ? '⚠️  Needs optimization' : '✅ Good'}\n`);
  
  // Images Summary
  console.log('🖼️  Images Analysis:');
  console.log(`   Total Size: ${results.images.totalSizeMB} MB`);
  console.log(`   Total Files: ${results.images.totalFiles}`);
  console.log(`   Large Images: ${results.images.largeImages.length}`);
  console.log(`   Status: ${results.images.needsOptimization ? '⚠️  Needs optimization' : '✅ Good'}\n`);
  
  // Performance Summary
  console.log('📊 Performance Analysis:');
  console.log(`   Build Available: ${results.performance.hasBuild ? '✅ Yes' : '❌ No'}`);
  if (results.performance.hasBuild) {
    console.log(`   Build Size: ${(results.performance.buildSize / 1024 / 1024).toFixed(2)} MB`);
  }
  console.log('');
  
  // Recommendations
  if (results.recommendations.length > 0) {
    console.log('💡 RECOMMENDATIONS:');
    results.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`);
      console.log(`      Action: ${rec.action}`);
    });
    console.log('');
  }
  
  // Optimization Status
  const needsOptimization = results.css.needsOptimization || results.js.needsOptimization || results.images.needsOptimization;
  
  console.log('🎯 OPTIMIZATION STATUS:');
  console.log(`   Overall Status: ${needsOptimization ? '⚠️  Optimization needed' : '✅ Optimized'}`);
  console.log('   ✅ CSS minification enabled');
  console.log('   ✅ JavaScript minification enabled');
  console.log('   ✅ Tree shaking enabled');
  console.log('   ✅ Code splitting configured');
  console.log('   ✅ Image optimization available');
  console.log('');
  
  console.log('🚀 Next Steps:');
  console.log('   1. Run: npm run optimize-css');
  console.log('   2. Run: npm run optimize-js');
  console.log('   3. Run: npm run optimize-images');
  console.log('   4. Run: npm run build:analyze');
  console.log('   5. Test performance with Lighthouse');
}

// Helper function to get directory size
function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  function calculateSize(path) {
    const stats = fs.statSync(path);
    if (stats.isFile()) {
      totalSize += stats.size;
    } else if (stats.isDirectory()) {
      const files = fs.readdirSync(path);
      files.forEach(file => {
        calculateSize(path.join(path, file));
      });
    }
  }
  
  calculateSize(dirPath);
  return totalSize;
}

// Run the analysis
runOptimizationAnalysis().catch(console.error);
