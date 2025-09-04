/**
 * Main JavaScript for How to Fund Travel
 * Handles navigation, animations, and core functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize favicon for all pages
  initFavicon();
  
  // Mobile Navigation Toggle - will be called after header template loads
  // initMobileNav(); // Moved to template-includes.js
  
  // Header scroll behavior (hide/show on scroll)
  initHeaderScroll();
  
  // Smooth scrolling for anchor links
  initSmoothScroll();
  
  // Initialize animations for elements as they enter viewport
  initScrollAnimations();
  
  // Newsletter form handling
  initNewsletterForm();
});

/**
 * Mobile Navigation Functionality
 */
function initMobileNav() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  console.log('initMobileNav: Initializing mobile navigation');
  console.log('menuToggle:', menuToggle);
  console.log('navLinks:', navLinks);
  
  if (!menuToggle || !navLinks) {
    console.log('initMobileNav: Missing required elements, returning');
    return;
  }
  
  // Mark as initialized to prevent double initialization
  menuToggle.setAttribute('data-initialized', 'true');
  
  menuToggle.addEventListener('click', () => {
    console.log('Mobile menu toggle clicked');
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    
    console.log('Current expanded state:', isExpanded);
    console.log('Nav links classes before toggle:', navLinks.className);
    
    // Toggle the menu
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
    
    console.log('Nav links classes after toggle:', navLinks.className);
    
    // Prevent body scroll when menu is open
    document.body.classList.toggle('nav-open');
    
    // Ensure header is visible when mobile menu is open
    const header = document.querySelector('.site-header');
    if (header && !isExpanded) {
      header.classList.remove('header-hidden');
      header.classList.add('header-visible');
    }
    
    // Transform hamburger into X
    if (isExpanded) {
      menuToggle.classList.remove('open');
    } else {
      menuToggle.classList.add('open');
    }
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      navLinks.classList.contains('active') &&
      !e.target.closest('.nav-links') &&
      !e.target.closest('.mobile-menu-toggle')
    ) {
      menuToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('active');
      document.body.classList.remove('nav-open');
      menuToggle.classList.remove('open');
    }
  });
}

// Make initMobileNav globally accessible
window.initMobileNav = initMobileNav;

/**
 * Header scroll behavior - hide on scroll down, show on scroll up
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  
  let lastScrollTop = 0;
  let scrollThreshold = 100; // Minimum scroll distance before hiding
  let isScrolling = false;
  let scrollTimeout;
  let ticking = false;
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  
  // Don't hide header on mobile devices (smaller screens)
  const isMobile = window.innerWidth <= 768;
  if (isMobile) return;
  
  // Detect Brave browser
  const isBrave = navigator.brave?.isBrave() || 
                  navigator.userAgent.includes('Brave') ||
                  window.chrome?.webstore === undefined;
  
  // Get scroll position - handle different browsers
  function getScrollTop() {
    // Try multiple methods to get scroll position for better browser compatibility
    const scrollTop = window.pageYOffset || 
                     document.documentElement.scrollTop || 
                     document.body.scrollTop || 
                     0;
    
    // Debug logging (remove in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Scroll position:', scrollTop, 'Method:', 
        window.pageYOffset ? 'pageYOffset' : 
        document.documentElement.scrollTop ? 'documentElement.scrollTop' : 
        document.body.scrollTop ? 'body.scrollTop' : 'fallback');
    }
    
    return scrollTop;
  }
  
  // Update header visibility
  function updateHeaderVisibility() {
    const currentScrollTop = getScrollTop();
    const scrollDelta = currentScrollTop - lastScrollTop;
    
    // Check if mobile menu is open - if so, don't hide header
    const mobileMenuOpen = document.querySelector('.nav-links.active');
    if (mobileMenuOpen) {
      header.classList.remove('header-hidden');
      header.classList.add('header-visible');
      lastScrollTop = currentScrollTop;
      ticking = false;
      return;
    }
    
      // Only hide/show if we've scrolled enough (more sensitive for Brave)
  const scrollSensitivity = isBrave ? 1 : 3;
  if (Math.abs(scrollDelta) > scrollSensitivity) {
    if (currentScrollTop > scrollThreshold) {
      if (scrollDelta > 0) {
        // Scrolling down - hide header
        header.classList.remove('header-visible');
        header.classList.add('header-hidden');
      } else {
        // Scrolling up - show header
        header.classList.remove('header-hidden');
        header.classList.add('header-visible');
      }
    } else {
      // Near top of page - always show header
      header.classList.remove('header-hidden');
      header.classList.add('header-visible');
    }
  }
    
    lastScrollTop = currentScrollTop;
    ticking = false;
  }
  
  // Throttled scroll handler
  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(updateHeaderVisibility);
      ticking = true;
    }
  }
  
  // Add scroll event listener with multiple fallbacks for Brave browser
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Fallback for Brave browser - also listen on document
  document.addEventListener('scroll', handleScroll, { passive: true });
  
  // Additional fallback for some browsers
  if (document.documentElement) {
    document.documentElement.addEventListener('scroll', handleScroll, { passive: true });
  }
  
  // Show header when user hovers near top of viewport
  document.addEventListener('mouseenter', (e) => {
    if (e.clientY < 100) {
      header.classList.remove('header-hidden');
      header.classList.add('header-visible');
    }
  });
  
  // Show header when user stops scrolling for a moment
  let stopScrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(stopScrollTimeout);
    stopScrollTimeout = setTimeout(() => {
      header.classList.remove('header-hidden');
      header.classList.add('header-visible');
    }, 1500); // Show header after 1.5 seconds of no scrolling
  }, { passive: true });
  
  // Handle window resize - disable on mobile
  window.addEventListener('resize', () => {
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile) {
      if (newIsMobile) {
        // Switched to mobile - show header
        header.classList.remove('header-hidden');
        header.classList.add('header-visible');
      }
    }
  });
  
  // Initialize header state
  updateHeaderVisibility();
  
  // Add a small delay to ensure everything is loaded
  setTimeout(() => {
    updateHeaderVisibility();
  }, 100);
  
  // Expose test function for debugging
  window.testHeaderScroll = function() {
    console.log('Testing header scroll behavior...');
    console.log('Current scroll position:', getScrollTop());
    console.log('Header element:', header);
    console.log('Header classes:', header.className);
    console.log('Is Brave browser:', isBrave);
    
    // Test hiding
    header.classList.remove('header-visible');
    header.classList.add('header-hidden');
    console.log('Header should be hidden now');
    
    // Test showing after 2 seconds
    setTimeout(() => {
      header.classList.remove('header-hidden');
      header.classList.add('header-visible');
      console.log('Header should be visible now');
    }, 2000);
  };
  
  // Debug info
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Header scroll behavior initialized');
    console.log('Browser:', navigator.userAgent);
    console.log('Is Brave:', isBrave);
    console.log('Initial scroll position:', getScrollTop());
    console.log('Scroll sensitivity:', isBrave ? 1 : 3);
  }
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      
      // Skip if it's just "#" (often used for buttons)
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Close mobile menu if open
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          document.body.classList.remove('nav-open');
          if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.classList.remove('open');
        }
        
        // Get header height for offset
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        
        // Scroll to element
        window.scrollTo({
          top: targetElement.offsetTop - headerHeight - 20, // Additional 20px buffer
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Animate elements when they enter the viewport
 */
function initScrollAnimations() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  if (!animateElements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        // Stop observing after animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  animateElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Handle newsletter form submission
 */
function initNewsletterForm() {
  const newsletterForm = document.querySelector('.newsletter-form');
  
  if (!newsletterForm) return;
  
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    
    if (!emailInput || !submitButton) return;
    
    const email = emailInput.value.trim();
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormMessage(newsletterForm, 'Please enter a valid email address.', 'error');
      return;
    }
    
    // Disable form while submitting
    emailInput.disabled = true;
    submitButton.disabled = true;
    submitButton.innerHTML = 'Subscribing...';
    
    try {
      // Replace with your actual form submission logic
      // This is a placeholder for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success!
      showFormMessage(newsletterForm, 'Thank you for subscribing! Check your email for confirmation.', 'success');
      newsletterForm.reset();
      
    } catch (error) {
      // Handle error
      showFormMessage(newsletterForm, 'Sorry, there was an error. Please try again.', 'error');
      console.error('Newsletter form submission error:', error);
      
    } finally {
      // Re-enable form
      emailInput.disabled = false;
      submitButton.disabled = false;
      submitButton.innerHTML = 'Get Free Access';
    }
  });
}

/**
 * Display form messages (success/error)
 */
function showFormMessage(form, message, type = 'success') {
  // Remove any existing messages
  const existingMessage = form.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new message
  const messageElement = document.createElement('div');
  messageElement.className = `form-message form-message-${type}`;
  messageElement.textContent = message;
  
  // Insert message after form
  form.appendChild(messageElement);
  
  // Auto-hide message after 5 seconds
  setTimeout(() => {
    messageElement.classList.add('form-message-hiding');
    
    // Remove message after fade out
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 300);
  }, 5000);
}

/**
 * Initialize favicon for all pages
 * Ensures favicon is present on every page, even if not explicitly added to HTML
 */
function initFavicon() {
  // Check if favicon links already exist
  const existingFavicon = document.querySelector('link[rel="icon"]');
  const existingAppleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
  
  // Only add favicon links if they don't already exist
  if (!existingFavicon) {
    // Add SVG favicon
    const svgFavicon = document.createElement('link');
    svgFavicon.rel = 'icon';
    svgFavicon.type = 'image/svg+xml';
    svgFavicon.href = 'images/how-to-fund-travel-favicon.svg';
    document.head.appendChild(svgFavicon);
    
    // Add PNG favicon as fallback
    const pngFavicon = document.createElement('link');
    pngFavicon.rel = 'icon';
    pngFavicon.type = 'image/png';
    pngFavicon.href = 'images/howtofundtravel-favicon.png';
    document.head.appendChild(pngFavicon);
  }
  
  if (!existingAppleTouchIcon) {
    // Add Apple touch icon for iOS devices
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = 'images/howtofundtravel-favicon.png';
    document.head.appendChild(appleTouchIcon);
  }
} 