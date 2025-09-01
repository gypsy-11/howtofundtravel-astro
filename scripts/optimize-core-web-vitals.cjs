#!/usr/bin/env node

/**
 * Core Web Vitals Optimization Script
 * Analyzes and provides recommendations for improving Core Web Vitals
 */

const fs = require('fs');
const path = require('path');

// Core Web Vitals thresholds
const VITALS_THRESHOLDS = {
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint (ms)
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint (ms)
  FID: { good: 100, needsImprovement: 300 },   // First Input Delay (ms)
  CLS: { good: 0.1, needsImprovement: 0.25 }   // Cumulative Layout Shift
};

// Performance recommendations
const RECOMMENDATIONS = {
  FCP: {
    good: "✅ First Contentful Paint is excellent!",
    needsImprovement: "⚠️ FCP needs improvement. Consider:",
    poor: "❌ FCP is poor. Critical issues to address:",
    suggestions: [
      "Optimize critical rendering path",
      "Minimize critical resources",
      "Eliminate render-blocking resources",
      "Optimize CSS delivery",
      "Inline critical CSS",
      "Preload critical fonts",
      "Optimize server response time"
    ]
  },
  LCP: {
    good: "✅ Largest Contentful Paint is excellent!",
    needsImprovement: "⚠️ LCP needs improvement. Consider:",
    poor: "❌ LCP is poor. Critical issues to address:",
    suggestions: [
      "Optimize largest contentful element",
      "Optimize image loading",
      "Use responsive images",
      "Implement lazy loading",
      "Optimize font loading",
      "Reduce server response time",
      "Use CDN for static assets",
      "Optimize CSS and JavaScript"
    ]
  },
  FID: {
    good: "✅ First Input Delay is excellent!",
    needsImprovement: "⚠️ FID needs improvement. Consider:",
    poor: "❌ FID is poor. Critical issues to address:",
    suggestions: [
      "Reduce JavaScript execution time",
      "Optimize event handlers",
      "Use passive event listeners",
      "Implement code splitting",
      "Optimize third-party scripts",
      "Reduce main thread work",
      "Use web workers for heavy tasks"
    ]
  },
  CLS: {
    good: "✅ Cumulative Layout Shift is excellent!",
    needsImprovement: "⚠️ CLS needs improvement. Consider:",
    poor: "❌ CLS is poor. Critical issues to address:",
    suggestions: [
      "Set explicit dimensions for images",
      "Reserve space for dynamic content",
      "Avoid inserting content above existing content",
      "Use transform animations instead of layout-triggering properties",
      "Optimize font loading with font-display: swap",
      "Set aspect ratios for media elements",
      "Avoid layout shifts from ads and embeds"
    ]
  }
};

// Analyze Core Web Vitals
function analyzeCoreWebVitals(metrics) {
  const analysis = {};
  
  Object.entries(metrics).forEach(([metric, value]) => {
    const threshold = VITALS_THRESHOLDS[metric];
    let rating = 'good';
    
    if (value > threshold.needsImprovement) {
      rating = 'poor';
    } else if (value > threshold.good) {
      rating = 'needs-improvement';
    }
    
    analysis[metric] = {
      value,
      rating,
      threshold: threshold.good,
      recommendations: RECOMMENDATIONS[metric][rating],
      suggestions: RECOMMENDATIONS[metric].suggestions
    };
  });
  
  return analysis;
}

// Generate optimization report
function generateReport(analysis) {
  let report = `# 🚀 Core Web Vitals Optimization Report\n\n`;
  report += `Generated on: ${new Date().toLocaleString()}\n\n`;
  
  // Summary
  report += `## 📊 Summary\n\n`;
  const ratings = Object.values(analysis).map(a => a.rating);
  const goodCount = ratings.filter(r => r === 'good').length;
  const score = Math.round((goodCount / ratings.length) * 100);
  
  report += `**Overall Score: ${score}/100**\n\n`;
  report += `- ✅ Good: ${goodCount}/4 metrics\n`;
  report += `- ⚠️ Needs Improvement: ${ratings.filter(r => r === 'needs-improvement').length}/4 metrics\n`;
  report += `- ❌ Poor: ${ratings.filter(r => r === 'poor').length}/4 metrics\n\n`;
  
  // Detailed analysis
  report += `## 📈 Detailed Analysis\n\n`;
  
  Object.entries(analysis).forEach(([metric, data]) => {
    const emoji = data.rating === 'good' ? '✅' : data.rating === 'needs-improvement' ? '⚠️' : '❌';
    report += `### ${emoji} ${metric} (${data.value}${metric === 'CLS' ? '' : 'ms'})\n\n`;
    report += `**Rating:** ${data.rating.toUpperCase()}\n\n`;
    report += `**Target:** ${data.threshold}${metric === 'CLS' ? '' : 'ms'}\n\n`;
    report += `**Recommendation:** ${data.recommendations}\n\n`;
    
    if (data.rating !== 'good') {
      report += `**Suggestions:**\n`;
      data.suggestions.forEach(suggestion => {
        report += `- ${suggestion}\n`;
      });
      report += `\n`;
    }
  });
  
  // Implementation guide
  report += `## 🛠️ Implementation Guide\n\n`;
  report += `### Critical CSS Optimization\n\n`;
  report += `\`\`\`css\n`;
  report += `/* Inline critical CSS in <head> */\n`;
  report += `:root {\n`;
  report += `  --primary-color: #2a9d8f;\n`;
  report += `  --secondary-color: #264653;\n`;
  report += `}\n\n`;
  report += `/* Critical above-the-fold styles */\n`;
  report += `.hero {\n`;
  report += `  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);\n`;
  report += `  color: var(--white);\n`;
  report += `  padding: var(--space-xl) 0;\n`;
  report += `  text-align: center;\n`;
  report += `}\n`;
  report += `\`\`\`\n\n`;
  
  report += `### Image Optimization\n\n`;
  report += `\`\`\`html\n`;
  report += `<!-- Use responsive images with explicit dimensions -->\n`;
  report += `<img src="image.webp" alt="Description" width="800" height="600" loading="lazy">\n\n`;
  report += `<!-- Or use picture element for multiple formats -->\n`;
  report += `<picture>\n`;
  report += `  <source srcset="image.webp" type="image/webp">\n`;
  report += `  <source srcset="image.jpg" type="image/jpeg">\n`;
  report += `<img src="image.jpg" alt="Description" width="800" height="600">\n`;
  report += `</picture>\n`;
  report += `\`\`\`\n\n`;
  
  report += `### Font Optimization\n\n`;
  report += `\`\`\`html\n`;
  report += `<!-- Preload critical fonts -->\n`;
  report += `<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>\n\n`;
  report += `<!-- Use font-display: swap -->\n`;
  report += `<style>\n`;
  report += `@font-face {\n`;
  report += `  font-family: 'Custom Font';\n`;
  report += `  src: url('font.woff2') format('woff2');\n`;
  report += `  font-display: swap;\n`;
  report += `}\n`;
  report += `</style>\n`;
  report += `\`\`\`\n\n`;
  
  report += `### JavaScript Optimization\n\n`;
  report += `\`\`\`html\n`;
  report += `<!-- Defer non-critical JavaScript -->\n`;
  report += `<script src="non-critical.js" defer></script>\n\n`;
  report += `<!-- Use passive event listeners -->\n`;
  report += `<script>\n`;
  report += `element.addEventListener('scroll', handler, { passive: true });\n`;
  report += `</script>\n`;
  report += `\`\`\`\n\n`;
  
  // Performance monitoring
  report += `## 📊 Performance Monitoring\n\n`;
  report += `### Google Analytics 4 Integration\n\n`;
  report += `\`\`\`javascript\n`;
  report += `// Monitor Core Web Vitals\n`;
  report += `new PerformanceObserver((list) => {\n`;
  report += `  for (const entry of list.getEntries()) {\n`;
  report += `    gtag('event', 'web_vitals', {\n`;
  report += `      event_category: 'Web Vitals',\n`;
  report += `      event_label: entry.name,\n`;
  report += `      value: Math.round(entry.startTime)\n`;
  report += `    });\n`;
  report += `  }\n`;
  report += `}).observe({ entryTypes: ['largest-contentful-paint'] });\n`;
  report += `\`\`\`\n\n`;
  
  // Next steps
  report += `## 🎯 Next Steps\n\n`;
  report += `1. **Implement critical CSS inlining** for above-the-fold content\n`;
  report += `2. **Optimize image loading** with responsive images and lazy loading\n`;
  report += `3. **Reduce JavaScript execution time** with code splitting and optimization\n`;
  report += `4. **Prevent layout shifts** by setting explicit dimensions\n`;
  report += `5. **Monitor performance** with real user data\n`;
  report += `6. **Test on mobile devices** with slower connections\n`;
  report += `7. **Use Lighthouse** for ongoing performance audits\n\n`;
  
  return report;
}

// Main function
function main() {
  console.log('🔍 Analyzing Core Web Vitals...\n');
  
  // Example metrics (replace with real data)
  const exampleMetrics = {
    FCP: 1200,  // Good
    LCP: 2800,  // Needs improvement
    FID: 80,    // Good
    CLS: 0.15   // Needs improvement
  };
  
  const analysis = analyzeCoreWebVitals(exampleMetrics);
  const report = generateReport(analysis);
  
  // Save report
  const reportPath = path.join(process.cwd(), 'core-web-vitals-report.md');
  fs.writeFileSync(reportPath, report);
  
  console.log('📊 Core Web Vitals Analysis Complete!\n');
  console.log(`📄 Report saved to: ${reportPath}\n`);
  
  // Print summary
  const ratings = Object.values(analysis).map(a => a.rating);
  const goodCount = ratings.filter(r => r === 'good').length;
  const score = Math.round((goodCount / ratings.length) * 100);
  
  console.log(`🎯 Overall Score: ${score}/100`);
  console.log(`✅ Good: ${goodCount}/4 metrics`);
  console.log(`⚠️ Needs Improvement: ${ratings.filter(r => r === 'needs-improvement').length}/4 metrics`);
  console.log(`❌ Poor: ${ratings.filter(r => r === 'poor').length}/4 metrics\n`);
  
  // Print recommendations
  Object.entries(analysis).forEach(([metric, data]) => {
    if (data.rating !== 'good') {
      const emoji = data.rating === 'needs-improvement' ? '⚠️' : '❌';
      console.log(`${emoji} ${metric}: ${data.recommendations}`);
    }
  });
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  analyzeCoreWebVitals,
  generateReport,
  VITALS_THRESHOLDS,
  RECOMMENDATIONS
};
