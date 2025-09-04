# Fonts Directory

This directory contains custom fonts for the How to Fund Travel Astro website.

## Lemon Tuesday Font

The Lemon Tuesday font is used for highlighted words in hero sections across the site.

### Font Files:
- `LemonTuesday.otf` - OpenType font file (primary)

### Implementation:
The font is loaded via CSS `@font-face` declaration in `src/styles/fonts.css`:

```css
@font-face {
  font-family: 'Lemon Tuesday';
  src: url('/fonts/LemonTuesday.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

### Usage:
The font is applied to highlighted words in hero sections using:

```css
.hero .highlight {
  font-family: 'LemonTuesday', 'Shadows Into Light', cursive;
  color: #2A9D8F;
}
```

### Fallback:
If the local Lemon Tuesday font fails to load, the system will fall back to:
1. **Shadows Into Light** (Google Fonts)
2. **cursive** (system fallback)

### Pages Using Lemon Tuesday:
- Home page (`/`)
- About page (`/about`)
- Resources page (`/resources`)
- Contact page (`/contact`)
- Book a Call page (`/book-a-call`)
- Case Studies page (`/case-studies/`)
- Blog main page (`/blog/`)

## Font Sources

- **Lemon Tuesday**: Custom font (local file)
- **Shadows Into Light**: Google Fonts (fallback)
- **Montserrat**: Google Fonts (headings)
- **Open Sans**: Google Fonts (body text) 