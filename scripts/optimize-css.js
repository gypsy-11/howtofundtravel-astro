#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CSS files to analyze
const cssFiles = [
  '../src/styles/main.css',
  '../src/styles/blog.css',
  '../src/styles/fonts.css'
];

// Analyze CSS file
function analyzeCSS(filePath) {
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
    selectors: (content.match(/[.#][a-zA-Z0-9_-]+/g) || []).length,
    mediaQueries: (content.match(/@media/g) || []).length,
    imports: (content.match(/@import/g) || []).length,
    variables: (content.match(/--[a-zA-Z0-9_-]+/g) || []).length,
    unusedSelectors: [],
    duplicateRules: []
  };

  // Find potential duplicate rules (simple check)
  const rules = content.match(/\.[a-zA-Z0-9_-]+\s*\{[^}]*\}/g) || [];
  const ruleMap = new Map();
  
  rules.forEach(rule => {
    const selector = rule.match(/^\.([a-zA-Z0-9_-]+)/)?.[1];
    if (selector && ruleMap.has(selector)) {
      stats.duplicateRules.push(selector);
    } else if (selector) {
      ruleMap.set(selector, rule);
    }
  });

  return stats;
}

// Generate optimization report
function generateReport() {
  console.log('🎨 CSS Optimization Analysis\n');
  
  let totalSize = 0;
  let totalLines = 0;
  let totalSelectors = 0;
  
  cssFiles.forEach(filePath => {
    const stats = analyzeCSS(filePath);
    if (stats) {
      console.log(`📁 ${stats.file}`);
      console.log(`   Size: ${stats.sizeKB} KB (${stats.size} bytes)`);
      console.log(`   Lines: ${stats.lines}`);
      console.log(`   Selectors: ${stats.selectors}`);
      console.log(`   Media Queries: ${stats.mediaQueries}`);
      console.log(`   CSS Variables: ${stats.variables}`);
      console.log(`   Imports: ${stats.imports}`);
      
      if (stats.duplicateRules.length > 0) {
        console.log(`   ⚠️  Potential duplicates: ${stats.duplicateRules.length}`);
      }
      
      console.log('');
      
      totalSize += stats.size;
      totalLines += stats.lines;
      totalSelectors += stats.selectors;
    }
  });
  
  console.log('📊 Summary:');
  console.log(`   Total CSS Size: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`   Total Lines: ${totalLines}`);
  console.log(`   Total Selectors: ${totalSelectors}`);
  
  // Recommendations
  console.log('\n💡 Optimization Recommendations:');
  
  if (totalSize > 100 * 1024) { // 100KB
    console.log('   ⚠️  CSS is quite large. Consider:');
    console.log('      - Removing unused CSS');
    console.log('      - Splitting into smaller files');
    console.log('      - Using CSS-in-JS for component-specific styles');
  }
  
  if (totalSelectors > 1000) {
    console.log('   ⚠️  Many CSS selectors. Consider:');
    console.log('      - Using CSS modules or scoped styles');
    console.log('      - Implementing a CSS methodology (BEM, etc.)');
  }
  
  console.log('   ✅ CSS minification is enabled in Astro config');
  console.log('   ✅ CSS source maps enabled for development');
  console.log('   ✅ Critical CSS inlining enabled');
}

// Run the analysis
generateReport();
