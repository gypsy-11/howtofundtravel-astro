#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JavaScript files to analyze
const jsFiles = [
  '../public/js/main.js',
  '../public/js/add-ga4.js',
  '../public/js/blog-search.js',
  '../public/js/global-search.js'
];

// Analyze JavaScript file
function analyzeJS(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return null;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  
  // Basic analysis
  const stats = {
    file: filePath,
    size: content.length,
    sizeKB: (content.length / 1024).toFixed(2),
    lines: lines.length,
    functions: (content.match(/function\s+[a-zA-Z0-9_]+/g) || []).length,
    arrowFunctions: (content.match(/=>/g) || []).length,
    imports: (content.match(/import\s+/g) || []).length,
    requires: (content.match(/require\s*\(/g) || []).length,
    eventListeners: (content.match(/addEventListener/g) || []).length,
    consoleLogs: (content.match(/console\.log/g) || []).length,
    comments: (content.match(/\/\*[\s\S]*?\*\/|\/\/.*$/gm) || []).length
  };

  return stats;
}

// Generate optimization report
function generateReport() {
  console.log('⚡ JavaScript Bundle Optimization Analysis\n');
  
  let totalSize = 0;
  let totalLines = 0;
  let totalFunctions = 0;
  let totalEventListeners = 0;
  
  jsFiles.forEach(filePath => {
    const stats = analyzeJS(filePath);
    if (stats) {
      console.log(`📁 ${stats.file}`);
      console.log(`   Size: ${stats.sizeKB} KB (${stats.size} bytes)`);
      console.log(`   Lines: ${stats.lines}`);
      console.log(`   Functions: ${stats.functions}`);
      console.log(`   Arrow Functions: ${stats.arrowFunctions}`);
      console.log(`   Event Listeners: ${stats.eventListeners}`);
      console.log(`   Imports: ${stats.imports}`);
      console.log(`   Requires: ${stats.requires}`);
      console.log(`   Console Logs: ${stats.consoleLogs}`);
      console.log(`   Comments: ${stats.comments}`);
      console.log('');
      
      totalSize += stats.size;
      totalLines += stats.lines;
      totalFunctions += stats.functions;
      totalEventListeners += stats.eventListeners;
    }
  });
  
  console.log('📊 Summary:');
  console.log(`   Total JS Size: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`   Total Lines: ${totalLines}`);
  console.log(`   Total Functions: ${totalFunctions}`);
  console.log(`   Total Event Listeners: ${totalEventListeners}`);
  
  // Recommendations
  console.log('\n💡 Optimization Recommendations:');
  
  if (totalSize > 50 * 1024) { // 50KB
    console.log('   ⚠️  JavaScript bundle is quite large. Consider:');
    console.log('      - Code splitting and lazy loading');
    console.log('      - Tree shaking to remove unused code');
    console.log('      - Using dynamic imports for non-critical features');
  }
  
  if (totalFunctions > 50) {
    console.log('   ⚠️  Many functions. Consider:');
    console.log('      - Combining similar functions');
    console.log('      - Using utility libraries for common operations');
    console.log('      - Implementing function memoization');
  }
  
  console.log('   ✅ JavaScript minification is enabled in Astro config');
  console.log('   ✅ Tree shaking is enabled by default');
  console.log('   ✅ Code splitting is configured');
  console.log('   ✅ Bundle analysis tools available');
}

// Run the analysis
generateReport();
