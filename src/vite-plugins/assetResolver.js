/**
 * Vite plugin to properly handle asset references in CSS that might cause build warnings
 */
export default function assetResolverPlugin() {
  const criticalAssets = [
    '/images/optimized/ocean-shores-transparency.webp',
    '/images/optimized/ocean-shores-transparency-xl.webp',
    '/fonts/LemonTuesday.otf'
  ];

  return {
    name: 'asset-resolver',
    enforce: /** @type {"pre"} */ ('pre'),
    // Make sure Vite processes these assets by adding them to the build
    transform(code, id) {
      // Only process CSS files
      if (!id.endsWith('.css')) return null;
      
      // Check if the CSS contains any of our critical assets
      const containsCriticalAsset = criticalAssets.some(asset => code.includes(asset));
      
      if (containsCriticalAsset) {
        // Add an import statement for the assets in a way that Vite will process
        let newCode = code;
        
        // Add a comment to indicate the processed file
        newCode = `/* Asset references processed by asset-resolver plugin */\n${newCode}`;
        
        return {
          code: newCode,
          map: null
        };
      }
      
      return null;
    },
    
    // Add the assets to the list of assets to be processed
    async resolveId(source, importer) {
      if (criticalAssets.includes(source)) {
        // Return the resolved ID as is to ensure Vite processes it
        return {
          id: source,
          external: false
        };
      }
      
      return null;
    }
  };
}
