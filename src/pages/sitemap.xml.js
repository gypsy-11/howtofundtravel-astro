import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog');
  
  // Base URL
  const baseUrl = 'https://howtofund.travel';
  
  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/digital-nomad-parents', priority: '0.8', changefreq: 'monthly' },
    { url: '/the-nomad-map', priority: '0.9', changefreq: 'monthly' },
    { url: '/book-a-call', priority: '0.7', changefreq: 'monthly' },
    { url: '/vibe-nomads', priority: '0.8', changefreq: 'monthly' },
    { url: '/blog', priority: '0.9', changefreq: 'weekly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.3', changefreq: 'yearly' }
  ];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Static Pages -->
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  
  <!-- Blog Posts -->
  ${posts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.data.updatedDate ? post.data.updatedDate.toISOString().split('T')[0] : post.data.publishedDate.toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    ${post.data.image ? `
    <image:image>
      <image:loc>${baseUrl}${post.data.image}</image:loc>
      <image:title>${post.data.title}</image:title>
    </image:image>` : ''}
  </url>`).join('')}
  
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
    }
  });
}
