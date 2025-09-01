// Enhanced lazy loading utility with intersection observer
// Provides better performance than native loading="lazy"

export function initLazyLoading() {
  // Check if Intersection Observer is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback to native lazy loading
    return;
  }

  // Find all images that should be lazy loaded
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if (lazyImages.length === 0) return;

  // Create intersection observer
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Load the image
        img.src = img.dataset.src;
        
        // Remove data-src attribute
        img.removeAttribute('data-src');
        
        // Add loaded class for styling
        img.classList.add('lazy-loaded');
        
        // Stop observing this image
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px', // Start loading 50px before image comes into view
    threshold: 0.01
  });

  // Start observing each lazy image
  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });
}

// Enhanced lazy loading for background images
export function initLazyBackgroundImages() {
  if (!('IntersectionObserver' in window)) {
    return;
  }

  const lazyBackgrounds = document.querySelectorAll('[data-background-src]');
  
  if (lazyBackgrounds.length === 0) return;

  const backgroundObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        // Load the background image
        element.style.backgroundImage = `url(${element.dataset.backgroundSrc})`;
        
        // Remove data attribute
        element.removeAttribute('data-background-src');
        
        // Add loaded class
        element.classList.add('lazy-loaded');
        
        // Stop observing
        observer.unobserve(element);
      }
    });
  }, {
    rootMargin: '100px 0px',
    threshold: 0.01
  });

  lazyBackgrounds.forEach(element => {
    backgroundObserver.observe(element);
  });
}

// Initialize all lazy loading when DOM is ready
export function initAllLazyLoading() {
  document.addEventListener('DOMContentLoaded', () => {
    initLazyLoading();
    initLazyBackgroundImages();
  });
}
