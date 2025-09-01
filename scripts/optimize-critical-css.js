#!/usr/bin/env node

/**
 * Critical CSS Optimization Script
 * Extracts and optimizes critical CSS for better LCP performance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Critical CSS for above-the-fold content
const criticalCSS = `
/* Critical CSS for LCP optimization */
:root {
  --primary-color: #3BAEA0;
  --secondary-color: #2a9d8f;
  --accent-color: #f4a261;
  --dark: #264653;
  --white: #ffffff;
  --text-gray: #666;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--dark);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Hero section critical styles */
.hero {
  align-items: center;
  background: url('/images/optimized/ocean-shores-transparency.webp') no-repeat center center;
  background-size: cover;
  color: var(--dark);
  display: flex;
  min-height: 80vh;
  padding: 6rem 0;
  position: relative;
  text-align: center;
  background-attachment: scroll;
  will-change: transform;
}

.hero-content {
  margin: 0 auto;
  max-width: 800px;
  position: relative;
  z-index: 2;
}

.hero-badge {
  align-items: center;
  background: var(--primary-color);
  border-radius: 25px;
  color: var(--white);
  display: inline-flex;
  font-size: 0.9rem;
  font-weight: 600;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
}

.hero h1 {
  color: var(--dark);
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 4px hsla(0, 0%, 100%, 0.8);
}

.highlight {
  color: #2a9d8f;
  font-family: 'Lemon Tuesday', 'Shadows Into Light', cursive;
}

.hero-subtitle {
  color: var(--dark);
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-shadow: 0 1px 2px hsla(0, 0%, 100%, 0.8);
}

.hero-stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-icon {
  display: block;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-text {
  color: var(--dark);
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.3;
  text-shadow: 0 1px 2px hsla(0, 0%, 100%, 0.8);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

/* Button styles */
.btn {
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: var(--primary-color);
  color: var(--white);
}

.btn-secondary {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

/* Header critical styles */
header {
  background: var(--white);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* Responsive design */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1rem;
  }
}
`;

// Function to minify CSS
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\s*{\s*/g, '{') // Remove spaces around braces
    .replace(/\s*}\s*/g, '}') // Remove spaces around braces
    .replace(/\s*:\s*/g, ':') // Remove spaces around colons
    .replace(/\s*;\s*/g, ';') // Remove spaces around semicolons
    .replace(/\s*,\s*/g, ',') // Remove spaces around commas
    .trim();
}

// Function to generate critical CSS file
function generateCriticalCSS() {
  const minifiedCSS = minifyCSS(criticalCSS);
  const outputPath = path.join(__dirname, '..', 'src', 'styles', 'critical.css');
  
  try {
    fs.writeFileSync(outputPath, minifiedCSS);
    console.log('✅ Critical CSS generated successfully:', outputPath);
    console.log('📊 CSS size:', (minifiedCSS.length / 1024).toFixed(2), 'KB');
  } catch (error) {
    console.error('❌ Error generating critical CSS:', error);
  }
}

// Function to analyze CSS files
function analyzeCSSFiles() {
  const stylesDir = path.join(__dirname, '..', 'src', 'styles');
  const cssFiles = ['main.css', 'blog.css'];
  
  console.log('📁 Analyzing CSS files...');
  
  cssFiles.forEach(file => {
    const filePath = path.join(stylesDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const size = (content.length / 1024).toFixed(2);
      console.log(`  📄 ${file}: ${size} KB`);
    }
  });
}

// Main execution
console.log('🚀 Starting Critical CSS Optimization...\n');

analyzeCSSFiles();
console.log('');
generateCriticalCSS();

console.log('\n✨ Critical CSS optimization complete!');
console.log('💡 Remember to include critical.css in your BaseLayout for optimal LCP performance.');
