#!/usr/bin/env node

/**
 * Cleanup Images Script
 * Removes original images that have optimized versions to reduce bundle size
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicImagesDir = path.join(__dirname, '../public/images');
const optimizedDir = path.join(publicImagesDir, 'optimized');

// Images that have optimized versions and can be removed
const imagesToRemove = [
  'melissa-profile-how-to-fund-travel.png',
  'melissa-profile-how-to-fund-travel.jpg',
  'kids-play-how-to-fund-travel.png',
  'kids-play-on-beach-how-to-fund-travel.png',
  'how-to-fund-travel-balloons-hero.png',
  'ocean-shores-transparency.png',
  'work-phone-horizontal-how-to-fund-travel.png',
  'G0104928.JPG',
  'how-to-fund-travel-kayaking.jpg',
  'how-to-fund-travel-melissa-work-anywhere.jpg',
  'work-while-kids-play-how-to-fund-travel.JPG',
  'melissa-working-how-to-fund-travel.jpg',
  'how-to-fund-family-travel.jpg',
  'time-blocking-calendar.jpg',
  'workspace-setup-travel.jpg',
  '20200518_141822.jpg',
  'G0064765.JPG',
  'Vibe Nomads.png',
  'Ocean-shores.png',
  'how-to-fund-travel-kayaking.jpg'
];

function removeImage(imageName) {
  const imagePath = path.join(publicImagesDir, imageName);
  
  if (fs.existsSync(imagePath)) {
    try {
      fs.unlinkSync(imagePath);
      console.log(`✅ Removed: ${imageName}`);
      return true;
    } catch (error) {
      console.error(`❌ Error removing ${imageName}:`, error.message);
      return false;
    }
  } else {
    console.log(`⚠️  Not found: ${imageName}`);
    return false;
  }
}

function cleanupImages() {
  console.log('🧹 Starting image cleanup...\n');
  
  let removedCount = 0;
  let totalSize = 0;
  
  // Get total size before cleanup
  for (const imageName of imagesToRemove) {
    const imagePath = path.join(publicImagesDir, imageName);
    if (fs.existsSync(imagePath)) {
      const stats = fs.statSync(imagePath);
      totalSize += stats.size;
    }
  }
  
  console.log(`📊 Total size to be freed: ${(totalSize / 1024 / 1024).toFixed(2)} MB\n`);
  
  // Remove images
  for (const imageName of imagesToRemove) {
    if (removeImage(imageName)) {
      removedCount++;
    }
  }
  
  console.log(`\n🎉 Cleanup complete!`);
  console.log(`📈 Removed ${removedCount} images`);
  console.log(`💾 Freed ${(totalSize / 1024 / 1024).toFixed(2)} MB of space`);
  
  // Check remaining size
  const remainingSize = getDirectorySize(publicImagesDir);
  console.log(`📦 Remaining images directory size: ${(remainingSize / 1024 / 1024).toFixed(2)} MB`);
}

function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  if (fs.existsSync(dirPath)) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        totalSize += getDirectorySize(itemPath);
      } else {
        totalSize += stats.size;
      }
    }
  }
  
  return totalSize;
}

// Run cleanup
cleanupImages();
