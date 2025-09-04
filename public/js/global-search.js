/**
 * Global Search Functionality for How to Fund Travel
 * Handles search functionality in the header across all pages
 */

// Ensure DOM is loaded before running
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGlobalSearch);
} else {
  // DOM is already loaded
  initializeGlobalSearch();
}

function initializeGlobalSearch() {
  console.log('Initializing global search functionality...');
  
  // Wait for header to be loaded by template system
  setTimeout(() => {
    initSearchInput();
  }, 500);
}

/**
 * Initialize search input functionality
 */
function initSearchInput() {
  const searchInput = document.querySelector('.search-input');
  const searchContainer = document.querySelector('.search-container');
  
  if (!searchInput || !searchContainer) {
    console.log('Search elements not found, retrying...');
    // Retry after a short delay in case template hasn't loaded yet
    setTimeout(() => {
      initSearchInput();
    }, 1000);
    return;
  }
  
  console.log('Search input found, initializing...');
  
  // Add search functionality
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performGlobalSearch(searchInput.value.trim());
    }
  });
  
  // Add click handler to search icon
  const searchIcon = searchContainer.querySelector('.search-icon');
  if (searchIcon) {
    searchIcon.addEventListener('click', () => {
      performGlobalSearch(searchInput.value.trim());
    });
  }
  
  // Add focus/blur effects for better UX
  searchInput.addEventListener('focus', () => {
    searchContainer.classList.add('search-focused');
  });
  
  searchInput.addEventListener('blur', () => {
    searchContainer.classList.remove('search-focused');
  });
  
  // Add placeholder text rotation for better UX
  const placeholders = [
    'Search travel funding tips...',
    'Find remote work strategies...',
    'Discover online business ideas...',
    'Search investment tips...',
    'Find mindset articles...'
  ];
  
  let placeholderIndex = 0;
  setInterval(() => {
    placeholderIndex = (placeholderIndex + 1) % placeholders.length;
    searchInput.placeholder = placeholders[placeholderIndex];
  }, 3000);
}

/**
 * Perform global search
 */
function performGlobalSearch(searchTerm) {
  if (!searchTerm) {
    showSearchMessage('Please enter a search term', 'info');
    return;
  }
  
  console.log('Performing global search for:', searchTerm);
  
  // Show loading state
  showSearchMessage('Searching...', 'loading');
  
  // Determine the best search destination based on current page
  const currentPath = window.location.pathname;
  let searchUrl;
  
  if (currentPath.includes('/blog/') || currentPath === '/blog/') {
    // Already on blog page, perform client-side search if possible
    searchUrl = `/blog/?s=${encodeURIComponent(searchTerm)}`;
  } else {
    // Redirect to blog search
    searchUrl = `/blog/?s=${encodeURIComponent(searchTerm)}`;
  }
  
  // Navigate to search results
  window.location.href = searchUrl;
}

/**
 * Show search message
 */
function showSearchMessage(message, type = 'info') {
  // Remove any existing search messages
  const existingMessage = document.querySelector('.search-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = `search-message search-message-${type}`;
  messageElement.textContent = message;
  
  // Add styles
  messageElement.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : '#4444ff'};
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    font-size: 14px;
    max-width: 300px;
    word-wrap: break-word;
  `;
  
  // Add to page
  document.body.appendChild(messageElement);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (messageElement.parentNode) {
      messageElement.style.opacity = '0';
      messageElement.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        if (messageElement.parentNode) {
          messageElement.remove();
        }
      }, 300);
    }
  }, 3000);
}

/**
 * Enhanced search functionality for blog pages
 * This integrates with the existing blog search
 */
function enhanceBlogSearch() {
  // Check if we're on a blog page
  if (!window.location.pathname.includes('/blog/')) {
    return;
  }
  
  // Get search term from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('s');
  
  if (searchTerm) {
    // If there's a search term in URL, trigger the blog search
    setTimeout(() => {
      const blogSearchInput = document.querySelector('#blog-search');
      if (blogSearchInput) {
        blogSearchInput.value = searchTerm;
        // Trigger the search
        const searchForm = document.querySelector('.search-form');
        if (searchForm) {
          searchForm.dispatchEvent(new Event('submit'));
        }
      }
    }, 1000);
  }
}

// Initialize enhanced blog search
document.addEventListener('DOMContentLoaded', enhanceBlogSearch);

// Export functions for potential use in other scripts
window.globalSearch = {
  performSearch: performGlobalSearch,
  showMessage: showSearchMessage
}; 