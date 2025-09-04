/**
 * Google Analytics 4 Helper Script
 * 
 * This script helps you add Google Analytics 4 to any page.
 * Replace 'G-DPJ8XP3RBD' with your actual GA4 measurement ID.
 * 
 * Usage:
 * 1. Include this script in any page
 * 2. Call addGA4() function
 * 3. The script will automatically add GA4 to the page
 */

function addGA4(measurementId = 'G-DPJ8XP3RBD') {
    // Add GA4 script to head
    const ga4Script = document.createElement('script');
    ga4Script.async = true;
    ga4Script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(ga4Script);
    
    // Add GA4 configuration script
    const configScript = document.createElement('script');
    configScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}');
    `;
    document.head.appendChild(configScript);
    
    console.log('Google Analytics 4 added successfully!');
}

// Auto-run if this script is included
if (typeof window !== 'undefined') {
    // Uncomment the line below and replace with your GA4 ID to auto-add GA4
    // addGA4('YOUR-GA4-ID-HERE');
} 