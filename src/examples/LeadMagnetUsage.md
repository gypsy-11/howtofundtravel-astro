# Using Lead Magnet Components in Blog Posts

Here are examples of how to use the lead magnet components in your blog posts:

## Job Sites Bookmarks

```astro
---
// Import at the top of your .astro or .md file
import JobSitesBookmarks from '../components/lead-magnets/JobSitesBookmarks.astro';
---

<!-- Your blog content -->

<p>Looking for the best remote job sites? I've compiled a list of 30+ specialized platforms that will help you find better opportunities with less competition.</p>

<!-- Insert the lead magnet component -->
<JobSitesBookmarks />

<!-- Continue with more blog content -->
```

## AI Tools Bookmarks

```astro
---
// Import at the top of your .astro or .md file
import AIToolsBookmarks from '../components/lead-magnets/AIToolsBookmarks.astro';
---

<!-- Your blog content -->

<p>AI tools can dramatically increase your productivity as a digital nomad. Here's how to get access to my curated collection of the best tools.</p>

<!-- Insert the lead magnet component -->
<AIToolsBookmarks />

<!-- Continue with more blog content -->
```

## Vibe Nomads Community

```astro
---
// Import at the top of your .astro or .md file
import VibeNomadsCommunity from '../components/lead-magnets/VibeNomadsCommunity.astro';
---

<!-- Your blog content -->

<p>Building a location-independent lifestyle is easier when you have support from like-minded individuals.</p>

<!-- Insert the lead magnet component -->
<VibeNomadsCommunity />

<!-- Continue with more blog content -->
```

## Family Visa Guide

```astro
---
// Import at the top of your .astro or .md file
import FamilyVisaGuide from '../components/lead-magnets/FamilyVisaGuide.astro';
---

<!-- Your blog content -->

<p>Navigating visa requirements for a family can be complex. Get my comprehensive guide to make the process easier.</p>

<!-- Insert the lead magnet component -->
<FamilyVisaGuide />

<!-- Continue with more blog content -->
```

## Remote Work Links

```astro
---
// Import at the top of your .astro or .md file
import RemoteWorkLinks from '../components/lead-magnets/RemoteWorkLinks.astro';
---

<!-- Your blog content -->

<p>Access all the remote work resources you need in one convenient file.</p>

<!-- Insert the lead magnet component -->
<RemoteWorkLinks />

<!-- Continue with more blog content -->
```

## Using with Custom Form IDs

If you have multiple instances of the same lead magnet on a page, you can specify a custom form ID to ensure they work independently:

```astro
<JobSitesBookmarks formId="job-sites-top" />

<!-- More content -->

<JobSitesBookmarks formId="job-sites-bottom" />
```
