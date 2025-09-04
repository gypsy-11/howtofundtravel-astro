/**
 * Asset import utilities to help fix Vite build warnings
 * This file provides utility functions to properly import assets that might be referenced in CSS
 */

// Import critical assets that are referenced in CSS
// This ensures Vite processes them correctly during build
export function importCriticalAssets() {
  try {
    // Import image assets
    import.meta.glob('/public/images/optimized/ocean-shores-transparency.webp');
    import.meta.glob('/public/images/optimized/ocean-shores-transparency-xl.webp');
    
    // Import font assets
    import.meta.glob('/public/fonts/LemonTuesday.otf');

    // Return true to indicate success
    return true;
  } catch (error) {
    console.error('Error importing critical assets:', error);
    // Return false to indicate failure
    return false;
  }
}

/**
 * Get the URL for an asset
 * @param {string} path - The path to the asset, starting with '/'
 * @returns {string} The processed URL for the asset
 */
export function getAssetUrl(path) {
  // In Astro, we return the path as-is since assets in public/ are served at root
  return path;
}
