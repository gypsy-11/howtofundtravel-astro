module.exports = {
  plugins: {
    // Add vendor prefixes automatically
    autoprefixer: {
      // Target modern browsers
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'not dead',
        'not ie 11'
      ],
      // Enable grid autoprefixer
      grid: true
    },
    
    // CSS optimization and minification
    cssnano: {
      preset: ['default', {
        // Remove all comments
        discardComments: {
          removeAll: true,
        },
        // Normalize whitespace
        normalizeWhitespace: true,
        // Optimize colors
        colormin: true,
        // Minify font values
        minifyFontValues: true,
        // Minify selectors
        minifySelectors: true,
        // Remove unused CSS
        discardUnused: true,
        // Merge rules
        mergeRules: true,
        // Optimize calc expressions
        calc: true,
        // Optimize longhand properties
        longhandOptimizations: true,
        // Optimize shorthand properties
        shorthandOptimizations: true,
        // Remove empty rules
        discardEmpty: true,
        // Optimize media queries
        mergeMedia: true,
        // Remove duplicate rules
        discardDuplicates: true
      }]
    }
  }
};
