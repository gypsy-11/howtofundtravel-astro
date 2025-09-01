/**
 * Event Handlers Utility
 * Handles button clicks, analytics tracking, and user interactions
 */

// Analytics tracking function
export function trackEvent(eventName, parameters = {}) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, parameters);
  }
  
  // Also log to console in development
  if (import.meta.env.DEV) {
    console.log('Analytics Event:', eventName, parameters);
  }
}

// Button click tracking
export function trackButtonClick(buttonText, buttonType = 'button', page = 'unknown') {
  trackEvent('button_click', {
    button_text: buttonText,
    button_type: buttonType,
    page: page
  });
}

// Download tracking
export function trackDownload(fileName, fileType = 'pdf') {
  trackEvent('download', {
    file_name: fileName,
    file_type: fileType
  });
}

// External link tracking
export function trackExternalLink(url, linkText, page = 'unknown') {
  trackEvent('external_link_click', {
    link_url: url,
    link_text: linkText,
    page: page
  });
}

// Form submission tracking
export function trackFormSubmission(formName, formType = 'lead_magnet') {
  trackEvent('form_submit', {
    form_name: formName,
    form_type: formType
  });
}

// Page view tracking for dynamic content
export function trackPageView(pageTitle, pagePath) {
  if (typeof gtag !== 'undefined') {
    gtag('config', 'G-DPJ8XP3RBD', {
      page_title: pageTitle,
      page_path: pagePath
    });
  }
}

// Initialize button click handlers
export function initButtonHandlers() {
  // Track all button clicks
  document.addEventListener('click', function(event) {
    const target = event.target;
    
    // Handle button elements
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      const button = target.tagName === 'BUTTON' ? target : target.closest('button');
      const buttonText = button.textContent.trim();
      const buttonType = button.className.includes('btn-primary') ? 'primary' : 
                        button.className.includes('btn-secondary') ? 'secondary' : 'default';
      
      trackButtonClick(buttonText, buttonType, window.location.pathname);
    }
    
    // Handle anchor links with button styling
    if (target.tagName === 'A' && target.className.includes('btn')) {
      const linkText = target.textContent.trim();
      const linkType = target.className.includes('btn-primary') ? 'primary' : 
                      target.className.includes('btn-secondary') ? 'secondary' : 'default';
      
      // Check if it's an external link
      if (target.hostname !== window.location.hostname) {
        trackExternalLink(target.href, linkText, window.location.pathname);
      } else {
        trackButtonClick(linkText, linkType, window.location.pathname);
      }
    }
  });
}

// Initialize download button handlers
export function initDownloadHandlers() {
  // Job bookmarks download
  const downloadBookmarksBtn = document.getElementById('downloadBookmarks');
  if (downloadBookmarksBtn) {
    downloadBookmarksBtn.addEventListener('click', function() {
      trackDownload('job-sites-bookmarks', 'pdf');
    });
  }
  
  // AI tools bookmarks download
  const downloadAIToolsBtn = document.getElementById('downloadAITools');
  if (downloadAIToolsBtn) {
    downloadAIToolsBtn.addEventListener('click', function() {
      trackDownload('ai-tools-bookmarks', 'pdf');
    });
  }
  
  // Visa guide download
  const downloadGuideBtn = document.getElementById('downloadGuide');
  if (downloadGuideBtn) {
    downloadGuideBtn.addEventListener('click', function() {
      trackDownload('family-visa-guide', 'pdf');
    });
  }
}

// Initialize form submission tracking
export function initFormTracking() {
  // Track form submissions
  document.addEventListener('submit', function(event) {
    const form = event.target;
    const formName = form.id || form.className || 'unknown_form';
    const formType = formName.includes('newsletter') ? 'newsletter' :
                    formName.includes('lead') ? 'lead_magnet' :
                    formName.includes('contact') ? 'contact' : 'general';
    
    trackFormSubmission(formName, formType);
  });
}

// Initialize external link tracking
export function initExternalLinkTracking() {
  document.addEventListener('click', function(event) {
    const target = event.target.closest('a');
    if (target && target.hostname !== window.location.hostname) {
      const linkText = target.textContent.trim();
      const linkUrl = target.href;
      
      // Don't track if it's already been tracked by button handler
      if (!target.className.includes('btn')) {
        trackExternalLink(linkUrl, linkText, window.location.pathname);
      }
    }
  });
}

// Initialize scroll tracking
export function initScrollTracking() {
  let scrollDepth = 0;
  let scrollEvents = new Set();
  
  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    // Track scroll depth milestones
    [25, 50, 75, 90].forEach(milestone => {
      if (scrollPercent >= milestone && !scrollEvents.has(milestone)) {
        scrollEvents.add(milestone);
        trackEvent('scroll_depth', {
          depth: milestone,
          page: window.location.pathname
        });
      }
    });
  });
}

// Initialize time on page tracking
export function initTimeTracking() {
  const startTime = Date.now();
  
  // Track time on page when user leaves
  window.addEventListener('beforeunload', function() {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_page', {
      seconds: timeOnPage,
      page: window.location.pathname
    });
  });
  
  // Track time on page every 30 seconds
  setInterval(function() {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    if (timeOnPage % 30 === 0) { // Every 30 seconds
      trackEvent('time_on_page_interval', {
        seconds: timeOnPage,
        page: window.location.pathname
      });
    }
  }, 1000);
}

// Initialize all event handlers
export function initAllEventHandlers() {
  initButtonHandlers();
  initDownloadHandlers();
  initFormTracking();
  initExternalLinkTracking();
  initScrollTracking();
  initTimeTracking();
  
  // Track page view for SPA navigation
  if (typeof window !== 'undefined') {
    trackPageView(document.title, window.location.pathname);
  }
}

// Utility function to track specific interactions
export function trackInteraction(interactionType, details = {}) {
  trackEvent('user_interaction', {
    interaction_type: interactionType,
    ...details,
    page: window.location.pathname,
    timestamp: new Date().toISOString()
  });
}

// Track lead magnet interactions
export function trackLeadMagnet(formId, leadMagnetType) {
  trackEvent('lead_magnet_interaction', {
    form_id: formId,
    lead_magnet_type: leadMagnetType,
    page: window.location.pathname
  });
}

// Track search interactions
export function trackSearch(query, resultsCount = 0) {
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount,
    page: window.location.pathname
  });
}

// Track tag clicks
export function trackTagClick(tagName) {
  trackEvent('tag_click', {
    tag_name: tagName,
    page: window.location.pathname
  });
}

// Track category clicks
export function trackCategoryClick(categoryName) {
  trackEvent('category_click', {
    category_name: categoryName,
    page: window.location.pathname
  });
}

// Track lightbox interactions
export function trackLightboxOpen(imageSrc) {
  trackEvent('lightbox_open', {
    image_src: imageSrc,
    page: window.location.pathname
  });
}

// Track mobile menu interactions
export function trackMobileMenuToggle(isOpen) {
  trackEvent('mobile_menu_toggle', {
    menu_state: isOpen ? 'open' : 'closed',
    page: window.location.pathname
  });
}

// Track newsletter signup
export function trackNewsletterSignup(source = 'footer') {
  trackEvent('newsletter_signup', {
    source: source,
    page: window.location.pathname
  });
}

// Track book a call clicks
export function trackBookCallClick(source = 'button') {
  trackEvent('book_call_click', {
    source: source,
    page: window.location.pathname
  });
}

// Track Vibe Nomads community clicks
export function trackVibeNomadsClick(source = 'button') {
  trackEvent('vibe_nomads_click', {
    source: source,
    page: window.location.pathname
  });
}

// Track case study views
export function trackCaseStudyView(caseStudyName) {
  trackEvent('case_study_view', {
    case_study_name: caseStudyName,
    page: window.location.pathname
  });
}

// Track blog post reads
export function trackBlogPostRead(postTitle, readTime = 0) {
  trackEvent('blog_post_read', {
    post_title: postTitle,
    read_time_seconds: readTime,
    page: window.location.pathname
  });
}

// Track social media clicks
export function trackSocialMediaClick(platform, postType = 'general') {
  trackEvent('social_media_click', {
    platform: platform,
    post_type: postType,
    page: window.location.pathname
  });
}

// Track email clicks
export function trackEmailClick(emailType = 'general') {
  trackEvent('email_click', {
    email_type: emailType,
    page: window.location.pathname
  });
}

// Track phone clicks
export function trackPhoneClick() {
  trackEvent('phone_click', {
    page: window.location.pathname
  });
}

// Track FAQ interactions
export function trackFAQInteraction(question, action = 'expand') {
  trackEvent('faq_interaction', {
    question: question,
    action: action,
    page: window.location.pathname
  });
}

// Track video interactions
export function trackVideoInteraction(videoTitle, action = 'play') {
  trackEvent('video_interaction', {
    video_title: videoTitle,
    action: action,
    page: window.location.pathname
  });
}

// Track error events
export function trackError(errorType, errorMessage, errorContext = {}) {
  trackEvent('error', {
    error_type: errorType,
    error_message: errorMessage,
    error_context: errorContext,
    page: window.location.pathname
  });
}

// Track performance metrics
export function trackPerformance(metricName, value, unit = 'ms') {
  trackEvent('performance', {
    metric_name: metricName,
    value: value,
    unit: unit,
    page: window.location.pathname
  });
}

// Track user engagement
export function trackEngagement(engagementType, details = {}) {
  trackEvent('engagement', {
    engagement_type: engagementType,
    ...details,
    page: window.location.pathname
  });
}

// Export all tracking functions
export default {
  trackEvent,
  trackButtonClick,
  trackDownload,
  trackExternalLink,
  trackFormSubmission,
  trackPageView,
  initButtonHandlers,
  initDownloadHandlers,
  initFormTracking,
  initExternalLinkTracking,
  initScrollTracking,
  initTimeTracking,
  initAllEventHandlers,
  trackInteraction,
  trackLeadMagnet,
  trackSearch,
  trackTagClick,
  trackCategoryClick,
  trackLightboxOpen,
  trackMobileMenuToggle,
  trackNewsletterSignup,
  trackBookCallClick,
  trackVibeNomadsClick,
  trackCaseStudyView,
  trackBlogPostRead,
  trackSocialMediaClick,
  trackEmailClick,
  trackPhoneClick,
  trackFAQInteraction,
  trackVideoInteraction,
  trackError,
  trackPerformance,
  trackEngagement
};
