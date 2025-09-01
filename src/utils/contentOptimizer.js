/**
 * Content optimization utilities to reduce bundle size
 */

// Optimize frontmatter by removing unnecessary fields
export function optimizeFrontmatter(frontmatter) {
  const {
    title,
    description,
    publishedDate,
    author,
    image,
    category,
    tags,
    featured,
    draft,
    canonical,
    // Remove fields that aren't essential for rendering
    // ...rest
  } = frontmatter;

  return {
    title,
    description,
    publishedDate,
    author,
    image,
    category,
    tags,
    featured,
    draft,
    canonical
  };
}

// Optimize content by truncating if too long
export function optimizeContent(content, maxLength = 50000) {
  if (content.length > maxLength) {
    // Truncate content and add a "read more" indicator
    return content.substring(0, maxLength) + '\n\n... [Content truncated for performance]';
  }
  return content;
}

// Remove unnecessary imports from MDX files
export function optimizeImports(content) {
  // Remove static imports that can be lazy loaded
  return content.replace(
    /import\s+(\w+)\s+from\s+['"]\.\.\/\.\.\/components\/lead-magnets\/(\w+)\.astro['"];?/g,
    '<!-- Lazy loaded: $1 from $2.astro -->'
  );
}

// Optimize images in content
export function optimizeImages(content) {
  return content.replace(
    /<img([^>]+)>/g,
    (match, attributes) => {
      // Add lazy loading and optimization attributes
      if (!attributes.includes('loading=')) {
        attributes += ' loading="lazy"';
      }
      if (!attributes.includes('decoding=')) {
        attributes += ' decoding="async"';
      }
      return `<img${attributes}>`;
    }
  );
}

// Main optimization function
export function optimizeContentForBundle(content, frontmatter) {
  return {
    content: optimizeContent(optimizeImports(optimizeImages(content))),
    frontmatter: optimizeFrontmatter(frontmatter)
  };
}
