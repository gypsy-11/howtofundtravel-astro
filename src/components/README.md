# Image Component

A unified, feature-rich image component that consolidates the functionality of the previous `OptimizedImage`, `ResponsiveImage`, and `SVGImage` components.

## Features

- **Automatic Format Detection**: Automatically detects SVG files and handles them appropriately
- **Responsive Images**: Generates responsive image sources with WebP optimization
- **Lazy Loading**: Built-in lazy loading with smooth fade-in effects
- **Performance Optimization**: Priority loading for above-the-fold images
- **Accessibility**: Proper alt text and ARIA attributes
- **Lightbox Support**: Optional lightbox functionality integration
- **Caption Support**: Optional image captions
- **CSS Classes**: Flexible styling with CSS classes

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **required** | Image source path |
| `alt` | `string` | **required** | Alt text for accessibility |
| `width` | `number` | `undefined` | Image width |
| `height` | `number` | `undefined` | Image height |
| `class` | `string` | `""` | Additional CSS classes |
| `priority` | `boolean` | `false` | Set to true for above-the-fold images |
| `sizes` | `string` | `"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"` | Responsive image sizes |
| `quality` | `number` | `80` | Image quality (1-100) |
| `format` | `'webp' \| 'avif' \| 'jpeg' \| 'png'` | `'webp'` | Preferred format |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` (or `'eager'` if priority=true) | Loading strategy |
| `decoding` | `'async' \| 'sync' \| 'auto'` | `'async'` | Decoding strategy |
| `caption` | `string` | `undefined` | Optional caption for lightbox |
| `lightbox` | `boolean` | `false` | Enable lightbox functionality |
| `responsive` | `boolean` | `true` | Enable responsive image generation |
| `svg` | `boolean` | `auto-detected` | Treat as SVG (simplified handling) |

## Usage Examples

### Basic Image
```astro
<Image
  src="/images/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
/>
```

### Priority Image (Above the Fold)
```astro
<Image
  src="/images/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
  priority={true}
/>
```

### Responsive Image with Caption
```astro
<Image
  src="/images/blog-post.jpg"
  alt="Blog post image"
  width={400}
  height={300}
  caption="Beautiful sunset over the ocean"
  lightbox={true}
/>
```

### SVG Image
```astro
<Image
  src="/images/icon.svg"
  alt="Icon description"
  width={64}
  height={64}
/>
```

### Custom Responsive Sizes
```astro
<Image
  src="/images/featured.jpg"
  alt="Featured image"
  width={600}
  height={400}
  sizes="(max-width: 768px) 100vw, 600px"
  responsive={true}
/>
```

## Automatic Features

### SVG Detection
The component automatically detects SVG files and:
- Sets `loading="eager"` for immediate loading
- Skips responsive image generation
- Applies SVG-specific CSS classes

### Responsive Images
When `responsive={true}` (default), the component:
- Generates multiple image sizes (640w, 750w, 828w, 1080w, 1200w, 1920w)
- Creates WebP versions for modern browsers
- Provides fallback formats for older browsers
- Uses `<picture>` element with `<source>` tags

### Optimization
- Automatically routes images through `/images/optimized/` folder
- Generates WebP format for better compression
- Implements lazy loading for performance
- Adds performance attributes like `fetchpriority`

## CSS Classes

The component adds these CSS classes automatically:
- `.unified-image` - Base image styles
- `.unified-image.responsive` - Responsive image styles
- `.unified-image.svg` - SVG-specific styles

## Migration from Old Components

### From OptimizedImage
```astro
<!-- Old -->
<OptimizedImage src="/images/photo.jpg" alt="Photo" />

<!-- New -->
<Image src="/images/photo.jpg" alt="Photo" />
```

### From ResponsiveImage
```astro
<!-- Old -->
<ResponsiveImage src="/images/photo.jpg" alt="Photo" />

<!-- New -->
<Image src="/images/photo.jpg" alt="Photo" responsive={true} />
```

### From SVGImage
```astro
<!-- Old -->
<SVGImage src="/images/icon.svg" alt="Icon" />

<!-- New -->
<Image src="/images/icon.svg" alt="Icon" />
```

## Performance Benefits

- **Reduced Bundle Size**: Single component instead of three
- **Automatic Optimization**: WebP generation and responsive images
- **Lazy Loading**: Built-in performance optimization
- **Priority Loading**: Critical images load immediately
- **CSS Optimization**: Efficient CSS with contain properties

## Browser Support

- **Modern Browsers**: WebP format, responsive images, lazy loading
- **Older Browsers**: Fallback formats, graceful degradation
- **SVG Support**: Universal SVG support across all browsers

## File Structure

```
src/components/
├── Image.astro          # Unified image component
└── README.md           # This documentation
```

## Dependencies

- **Astro**: Built for Astro framework
- **Node.js path module**: For file path manipulation
- **No external dependencies**: Pure Astro component

## Notes

- The component automatically detects if an image is already in the optimized folder
- SVG files bypass responsive image generation for better performance
- All previous functionality from the three old components is preserved
- The component is backward compatible with existing usage patterns
