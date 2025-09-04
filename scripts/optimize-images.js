#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts images to WebP format and optimizes them for web use
 */

import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const IMAGES_DIR = './public/images';
const OUTPUT_DIR = './public/images/optimized';

// Image optimization settings
const OPTIMIZATION_SETTINGS = {
  webp: {
    quality: 80,
    effort: 6,
    nearLossless: false
  },
  jpeg: {
    quality: 80,
    progressive: true,
    mozjpeg: true
  },
  png: {
    quality: 80,
    compressionLevel: 9,
    progressive: true
  }
};

// Responsive image sizes
const RESPONSIVE_SIZES = [
  { width: 640, suffix: 'sm' },
  { width: 750, suffix: 'md' },
  { width: 828, suffix: 'lg' },
  { width: 1080, suffix: 'xl' },
  { width: 1200, suffix: '2xl' },
  { width: 1920, suffix: '3xl' }
];

// Supported image formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp'];

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function getImageFiles(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  const imageFiles = [];

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      // Skip the optimized directory to prevent recursive processing
      if (file.name === 'optimized') {
        continue;
      }
      // Recursively process other subdirectories
      const subFiles = await getImageFiles(fullPath);
      imageFiles.push(...subFiles);
    } else if (file.isFile()) {
      const ext = path.extname(file.name).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        imageFiles.push(fullPath);
      }
    }
  }

  return imageFiles;
}

async function optimizeImage(inputPath, outputPath, options = {}) {
  try {
    const { width, height, quality, format } = options;
    
    let pipeline = sharp(inputPath);
    
    // Resize if dimensions provided
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Apply format-specific optimization
    switch (format) {
      case 'webp':
        pipeline = pipeline.webp(OPTIMIZATION_SETTINGS.webp);
        break;
      case 'jpeg':
        pipeline = pipeline.jpeg(OPTIMIZATION_SETTINGS.jpeg);
        break;
      case 'png':
        pipeline = pipeline.png(OPTIMIZATION_SETTINGS.png);
        break;
      default:
        // Keep original format but optimize
        const ext = path.extname(inputPath).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg') {
          pipeline = pipeline.jpeg(OPTIMIZATION_SETTINGS.jpeg);
        } else if (ext === '.png') {
          pipeline = pipeline.png(OPTIMIZATION_SETTINGS.png);
        }
    }
    
    await pipeline.toFile(outputPath);
    
    // Get file sizes for comparison
    const originalStats = await fs.stat(inputPath);
    const optimizedStats = await fs.stat(outputPath);
    const savings = ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(1);
    
    return {
      originalSize: originalStats.size,
      optimizedSize: optimizedStats.size,
      savings: `${savings}%`
    };
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function createResponsiveImages(inputPath, outputDir, baseName) {
  const results = [];
  
  for (const size of RESPONSIVE_SIZES) {
    const outputPath = path.join(outputDir, `${baseName}-${size.suffix}.webp`);
    
    const result = await optimizeImage(inputPath, outputPath, {
      width: size.width,
      format: 'webp'
    });
    
    if (result) {
      results.push({
        size: size.suffix,
        width: size.width,
        path: outputPath,
        ...result
      });
    }
  }
  
  return results;
}

async function processImage(inputPath) {
  const relativePath = path.relative(IMAGES_DIR, inputPath);
  const dirName = path.dirname(relativePath);
  const baseName = path.basename(inputPath, path.extname(inputPath));
  
  // Create output directory structure
  const outputDir = path.join(OUTPUT_DIR, dirName);
  await ensureDirectoryExists(outputDir);
  
  console.log(`\n🖼️  Processing: ${relativePath}`);
  
  const results = [];
  
  // 1. Create optimized WebP version
  const webpPath = path.join(outputDir, `${baseName}.webp`);
  const webpResult = await optimizeImage(inputPath, webpPath, { format: 'webp' });
  if (webpResult) {
    results.push({
      type: 'webp',
      path: webpPath,
      ...webpResult
    });
  }
  
  // 2. Create responsive WebP versions
  const responsiveResults = await createResponsiveImages(inputPath, outputDir, baseName);
  results.push(...responsiveResults);
  
  // 3. Create fallback optimized original format
  const ext = path.extname(inputPath).toLowerCase();
  if (ext !== '.webp') {
    const fallbackPath = path.join(outputDir, `${baseName}${ext}`);
    const fallbackResult = await optimizeImage(inputPath, fallbackPath);
    if (fallbackResult) {
      results.push({
        type: 'fallback',
        path: fallbackPath,
        ...fallbackResult
      });
    }
  }
  
  // Log results
  if (results.length > 0) {
    console.log(`  ✅ Optimized versions created:`);
    results.forEach(result => {
      const sizeMB = (result.optimizedSize / 1024 / 1024).toFixed(2);
      console.log(`    - ${path.basename(result.path)} (${sizeMB}MB, ${result.savings} smaller)`);
    });
  }
  
  return results;
}

async function main() {
  console.log('🚀 Starting image optimization...');
  
  try {
    // Ensure output directory exists
    await ensureDirectoryExists(OUTPUT_DIR);
    
    // Get all image files
    const imageFiles = await getImageFiles(IMAGES_DIR);
    
    if (imageFiles.length === 0) {
      console.log('No images found to optimize.');
      return;
    }
    
    console.log(`Found ${imageFiles.length} images to optimize.`);
    
    // Process each image
    const allResults = [];
    for (const imagePath of imageFiles) {
      const results = await processImage(imagePath);
      allResults.push(...results);
    }
    
    // Summary
    console.log('\n📊 Optimization Summary:');
    console.log(`Total images processed: ${imageFiles.length}`);
    console.log(`Total optimized files created: ${allResults.length}`);
    
    const totalOriginalSize = allResults.reduce((sum, r) => sum + r.originalSize, 0);
    const totalOptimizedSize = allResults.reduce((sum, r) => sum + r.optimizedSize, 0);
    const totalSavings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
    
    console.log(`Total size reduction: ${totalSavings}%`);
    console.log(`Original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Space saved: ${((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(2)}MB`);
    
    console.log('\n✅ Image optimization complete!');
    console.log(`Optimized images saved to: ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('❌ Error during optimization:', error);
    process.exit(1);
  }
}

// Run the script
main();
