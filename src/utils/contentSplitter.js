/**
 * Content splitting utilities to reduce bundle size
 */

// Split large content into smaller chunks
export function splitContentIntoChunks(content, maxChunkSize = 25000) {
  const chunks = [];
  let currentChunk = '';
  let currentSize = 0;
  
  // Split by sections (headers)
  const sections = content.split(/(?=^#{1,6}\s)/m);
  
  sections.forEach(section => {
    if (currentSize + section.length > maxChunkSize && currentChunk) {
      chunks.push(currentChunk);
      currentChunk = section;
      currentSize = section.length;
    } else {
      currentChunk += section;
      currentSize += section.length;
    }
  });
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

// Create lazy loading wrapper for content chunks
export function createLazyContentWrapper(chunks, filename) {
  const baseContent = chunks[0];
  const additionalChunks = chunks.slice(1);
  
  if (additionalChunks.length === 0) {
    return baseContent;
  }
  
  const lazyLoadScript = `
<script>
  // Lazy load additional content chunks
  const loadAdditionalContent = async () => {
    try {
      const response = await fetch('/api/content-chunks/${filename}');
      if (response.ok) {
        const chunks = await response.json();
        const container = document.getElementById('additional-content-${filename}');
        if (container) {
          container.innerHTML = chunks.join('\\n');
          container.style.display = 'block';
        }
      }
    } catch (error) {
      console.warn('Failed to load additional content:', error);
    }
  };
  
  // Load when user scrolls near the bottom
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadAdditionalContent();
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '100px' });
  
  const trigger = document.getElementById('content-trigger-${filename}');
  if (trigger) {
    observer.observe(trigger);
  }
</script>

<div id="content-trigger-${filename}" style="height: 1px; margin: 2rem 0;"></div>
<div id="additional-content-${filename}" style="display: none;">
  <div style="text-align: center; padding: 2rem; color: #666;">
    Loading additional content...
  </div>
</div>
  `;
  
  return baseContent + lazyLoadScript;
}

// Optimize frontmatter for smaller bundle size
export function optimizeFrontmatter(frontmatter) {
  const essentialFields = [
    'title',
    'description', 
    'publishedDate',
    'author',
    'image',
    'category',
    'tags',
    'featured',
    'draft',
    'canonical'
  ];
  
  const optimized = {};
  essentialFields.forEach(field => {
    if (frontmatter[field] !== undefined) {
      optimized[field] = frontmatter[field];
    }
  });
  
  return optimized;
}

// Remove unnecessary content to reduce bundle size
export function removeUnnecessaryContent(content) {
  return content
    // Remove excessive whitespace
    .replace(/\n{3,}/g, '\n\n')
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove empty paragraphs
    .replace(/<p>\s*<\/p>/g, '')
    // Remove excessive line breaks
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
}

// Main content optimization function
export function optimizeContentForBundle(content, frontmatter, filename) {
  // Remove unnecessary content
  const cleanedContent = removeUnnecessaryContent(content);
  
  // Split into chunks if too large
  const chunks = splitContentIntoChunks(cleanedContent);
  
  // Create lazy loading wrapper
  const optimizedContent = createLazyContentWrapper(chunks, filename);
  
  // Optimize frontmatter
  const optimizedFrontmatter = optimizeFrontmatter(frontmatter);
  
  return {
    content: optimizedContent,
    frontmatter: optimizedFrontmatter,
    chunks: chunks.slice(1) // Additional chunks for API
  };
}
