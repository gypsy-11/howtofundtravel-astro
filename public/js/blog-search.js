/**
 * Blog Search Functionality for How to Fund Travel
 * Handles client-side searching of blog content and category filtering
 */

// Ensure DOM is loaded before running
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBlogFunctionality);
} else {
  // DOM is already loaded
  initializeBlogFunctionality();
}

function initializeBlogFunctionality() {
  console.log('Initializing blog functionality...');
  initBlogSearch();
  initCategoryFiltering();
  initUrlCategoryFilter();
  initUrlSearchFilter();
}

/**
 * Initialize blog search functionality
 */
function initBlogSearch() {
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.querySelector('#blog-search');
  
  if (!searchForm || !searchInput) return;
  
  // Store the original posts HTML for reset
  const blogPostsContainer = document.querySelector('.posts-grid');
  if (!blogPostsContainer) return;
  
  const originalPosts = blogPostsContainer.innerHTML;
  
  // Add search handler
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
      // Reset to original posts if search is empty
      blogPostsContainer.innerHTML = originalPosts;
      return;
    }
    
    performSearch(searchTerm);
  });
  
  // Search on input change (optional - can be disabled for performance)
  let debounceTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    
    debounceTimeout = setTimeout(() => {
      const searchTerm = searchInput.value.trim().toLowerCase();
      
      // Only trigger search if at least 3 characters entered
      if (searchTerm.length >= 3) {
        performSearch(searchTerm);
      } else if (searchTerm.length === 0) {
        // Reset when search cleared
        blogPostsContainer.innerHTML = originalPosts;
      }
    }, 500); // Debounce delay
  });
  
  /**
   * Perform client-side search
   * Note: In a real implementation, this would ideally be server-side or use a dedicated search API
   */
  function performSearch(searchTerm) {
    const blogPostsContainer = document.querySelector('.posts-grid');
    const allPosts = document.querySelectorAll('.post-card');
    
    if (!blogPostsContainer) return;
    
    // If no posts or no search term, return
    if (!allPosts.length || !searchTerm) return;
    
    // Filter posts based on search term
    const matchingPosts = Array.from(allPosts).filter(post => {
      const title = post.querySelector('.post-title')?.textContent.toLowerCase() || '';
      const excerpt = post.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
      const category = post.querySelector('.post-category')?.textContent.toLowerCase() || '';
      
      // Check if search term is in any of these fields
      return (
        title.includes(searchTerm) || 
        excerpt.includes(searchTerm) || 
        category.includes(searchTerm)
      );
    });
    
    // Update UI with results
    updateSearchResults(matchingPosts, searchTerm);
  }
  
  /**
   * Update UI with search results
   */
  function updateSearchResults(matchingPosts, searchTerm) {
    const blogPostsContainer = document.querySelector('.posts-grid');
    const blogPostsSection = document.querySelector('.blog-posts');
    
    if (!blogPostsContainer || !blogPostsSection) return;
    
    // Clear existing posts
    blogPostsContainer.innerHTML = '';
    
    // Update heading
    const heading = blogPostsSection.querySelector('h2');
    if (heading) {
      heading.textContent = matchingPosts.length > 0 
        ? `Search Results for "${searchTerm}"` 
        : 'No Results Found';
    }
    
    // Add results count before container
    const resultsCount = document.createElement('div');
    resultsCount.className = 'search-results-count';
    resultsCount.textContent = matchingPosts.length > 0 
      ? `Found ${matchingPosts.length} article${matchingPosts.length === 1 ? '' : 's'}` 
      : 'Try another search term or browse all articles';
    
    // Check if results count already exists and replace it, otherwise add new one
    const existingCount = blogPostsSection.querySelector('.search-results-count');
    if (existingCount) {
      existingCount.replaceWith(resultsCount);
    } else {
      blogPostsContainer.before(resultsCount);
    }
    
    // If no matches found
    if (matchingPosts.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.innerHTML = `
        <p>No articles match your search for "${searchTerm}".</p>
        <button class="btn btn-secondary reset-search">View All Articles</button>
      `;
      blogPostsContainer.appendChild(noResults);
      
      // Add event listener to reset button
      const resetButton = noResults.querySelector('.reset-search');
      if (resetButton) {
        resetButton.addEventListener('click', () => {
          // Clear search input and reset posts
          searchInput.value = '';
          blogPostsContainer.innerHTML = originalPosts;
          
          // Reset heading
          if (heading) heading.textContent = 'Latest Articles';
          
          // Remove results count
          if (resultsCount) resultsCount.remove();
        });
      }
      
      return;
    }
    
    // Append matching posts to container
    matchingPosts.forEach(post => {
      blogPostsContainer.appendChild(post.cloneNode(true));
    });
    
    // Add reset option
    const resetContainer = document.createElement('div');
    resetContainer.className = 'search-reset';
    resetContainer.innerHTML = `
      <button class="btn btn-secondary reset-search">Clear Search</button>
    `;
    blogPostsContainer.after(resetContainer);
    
    // Add event listener to reset button
    const resetButton = resetContainer.querySelector('.reset-search');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        // Clear search input and reset posts
        searchInput.value = '';
        blogPostsContainer.innerHTML = originalPosts;
        
        // Reset heading
        if (heading) heading.textContent = 'Latest Articles';
        
        // Remove results count and reset container
        if (resultsCount) resultsCount.remove();
        if (resetContainer) resetContainer.remove();
      });
    }
  }
}

/**
 * Initialize category filtering functionality
 */
function initCategoryFiltering() {
  console.log('Initializing category filtering...');
  const categoryButtons = document.querySelectorAll('.category-btn');
  const postsContainer = document.querySelector('#posts-container');
  const featuredPostsContainer = document.querySelector('.featured-posts-grid');
  
  console.log('Found category buttons:', categoryButtons.length);
  console.log('Found posts container:', !!postsContainer);
  console.log('Found featured posts container:', !!featuredPostsContainer);
  
  if (!categoryButtons.length || !postsContainer) {
    console.log('Missing required elements for category filtering');
    return;
  }
  
  // Store original posts for reset functionality
  const originalPosts = postsContainer.innerHTML;
  const originalFeaturedPosts = featuredPostsContainer ? featuredPostsContainer.innerHTML : '';
  
  console.log('Stored original posts for reset');
  
  // Add click handlers to category buttons
  categoryButtons.forEach((button, index) => {
    console.log(`Adding click handler to button ${index + 1}:`, button.textContent);
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Category button clicked:', button.textContent);
      
      const selectedCategory = button.getAttribute('data-category');
      console.log('Selected category:', selectedCategory);
      
      // Add loading state
      button.classList.add('loading');
      
      // Update active button state
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Add visual feedback to category filters
      const categoryFilters = document.querySelector('.category-filters');
      if (categoryFilters) {
        categoryFilters.classList.add('has-active');
      }
      
      // Small delay for better UX
      setTimeout(() => {
        // Filter posts based on selected category
        filterPostsByCategory(selectedCategory, postsContainer, featuredPostsContainer, originalPosts, originalFeaturedPosts);
        
        // Update posts counter
        updatePostsCounter(postsContainer);
        
        // Remove loading state
        button.classList.remove('loading');
        
        console.log('Category filtering completed');
      }, 150);
    });
  });
  
  console.log('Category filtering initialization complete');
}

/**
 * Filter posts by category
 */
function filterPostsByCategory(category, postsContainer, featuredPostsContainer, originalPosts, originalFeaturedPosts) {
  console.log('Filtering posts for category:', category);
  
  if (category === 'all') {
    console.log('Showing all posts');
    // Show all posts
    postsContainer.innerHTML = originalPosts;
    if (featuredPostsContainer && originalFeaturedPosts) {
      featuredPostsContainer.innerHTML = originalFeaturedPosts;
    }
    
    // Remove any no-results messages
    const noResults = postsContainer.querySelector('.no-results');
    if (noResults) {
      noResults.remove();
    }
    
    // Show all featured posts
    if (featuredPostsContainer) {
      const featuredPosts = featuredPostsContainer.querySelectorAll('.featured-post-card');
      featuredPosts.forEach(post => {
        post.style.display = 'block';
      });
    }
    
    return;
  }
  
  // Filter regular posts
  const allPosts = postsContainer.querySelectorAll('.post-card');
  let visiblePostsCount = 0;
  
  console.log('Found', allPosts.length, 'regular posts to filter');
  
  allPosts.forEach((post, index) => {
    const postCategory = post.getAttribute('data-category');
    console.log(`Post ${index + 1} category:`, postCategory, 'matches:', postCategory === category);
    
    if (postCategory === category) {
      post.style.display = 'block';
      visiblePostsCount++;
    } else {
      post.style.display = 'none';
    }
  });
  
  // Filter featured posts if they exist
  let visibleFeaturedPostsCount = 0;
  if (featuredPostsContainer) {
    const featuredPosts = featuredPostsContainer.querySelectorAll('.featured-post-card');
    console.log('Found', featuredPosts.length, 'featured posts to filter');
    
    featuredPosts.forEach((post, index) => {
      const postCategory = post.getAttribute('data-category');
      console.log(`Featured post ${index + 1} category:`, postCategory, 'matches:', postCategory === category);
      
      if (postCategory === category) {
        post.style.display = 'block';
        visibleFeaturedPostsCount++;
      } else {
        post.style.display = 'none';
      }
    });
  }
  
  console.log('Visible posts:', visiblePostsCount, 'Visible featured posts:', visibleFeaturedPostsCount);
  
  // Handle no results case
  if (visiblePostsCount === 0 && visibleFeaturedPostsCount === 0) {
    console.log('No posts found, showing no results message');
    showNoResultsMessage(postsContainer, category);
    return;
  }
  
  // Remove any existing no-results messages
  const existingNoResults = postsContainer.querySelector('.no-results');
  if (existingNoResults) {
    existingNoResults.remove();
  }
  
  // Add smooth animation for better UX
  const visiblePosts = postsContainer.querySelectorAll('.post-card[style*="display: block"]');
  visiblePosts.forEach((post, index) => {
    post.style.opacity = '0';
    post.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      post.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      post.style.opacity = '1';
      post.style.transform = 'translateY(0)';
    }, index * 50);
  });
  
  console.log('Filtering completed successfully');
}

/**
 * Show no results message
 */
function showNoResultsMessage(postsContainer, category) {
  // Clear the container
  postsContainer.innerHTML = '';
  
  // Create no results message
  const noResults = document.createElement('div');
  noResults.className = 'no-results';
  noResults.innerHTML = `
    <div style="text-align: center; padding: 3rem 1rem;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
      <h3 style="color: var(--dark); margin-bottom: 1rem;">No posts found in "${getCategoryDisplayName(category)}"</h3>
      <p style="color: var(--medium); margin-bottom: 2rem;">We're working on more content in this category. Check back soon!</p>
      <button class="btn btn-primary reset-category-filter" style="margin-right: 1rem;">View All Posts</button>
      <button class="btn btn-outline browse-categories">Browse Other Categories</button>
    </div>
  `;
  
  postsContainer.appendChild(noResults);
  
  // Add event listeners to buttons
  const resetButton = noResults.querySelector('.reset-category-filter');
  const browseButton = noResults.querySelector('.browse-categories');
  
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      // Reset to "All Posts"
      const allButton = document.querySelector('.category-btn[data-category="all"]');
      if (allButton) {
        allButton.click();
      }
    });
  }
  
  if (browseButton) {
    browseButton.addEventListener('click', () => {
      // Scroll to category filters
      const categorySection = document.querySelector('.blog-categories');
      if (categorySection) {
        categorySection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/**
 * Get display name for category
 */
function getCategoryDisplayName(category) {
  const categoryNames = {
    'remote-work': 'Remote Work',
    'online-business': 'Online Business',
    'investing': 'Investing',
    'mindset': 'Mindset',
    'affiliate-marketing': 'Affiliate Marketing'
  };
  
  return categoryNames[category] || category;
}

/**
 * Initialize URL-based category filtering
 * Handles category filtering when page loads with URL parameters
 */
function initUrlCategoryFilter() {
  console.log('Initializing URL category filter...');
  
  // Get category from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  
  if (!categoryParam) {
    console.log('No category parameter found in URL');
    return;
  }
  
  console.log('Category parameter found:', categoryParam);
  
  // Wait for category filtering to be initialized
  setTimeout(() => {
    // Find the corresponding category button
    const categoryButton = document.querySelector(`.category-btn[data-category="${categoryParam}"]`);
    
    if (categoryButton) {
      console.log('Found category button, triggering click:', categoryParam);
      // Trigger the category button click
      categoryButton.click();
      
      // Scroll to the posts section for better UX
      const postsSection = document.querySelector('.all-posts');
      if (postsSection) {
        setTimeout(() => {
          postsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    } else {
      console.log('Category button not found for:', categoryParam);
    }
  }, 500); // Give time for other initialization to complete
}

/**
 * Update posts counter display
 */
function updatePostsCounter(postsContainer) {
  const postsShown = postsContainer.querySelectorAll('.post-card[style*="display: block"], .post-card:not([style*="display: none"])').length;
  const postsTotal = postsContainer.querySelectorAll('.post-card').length;
  
  const postsShownElement = document.getElementById('posts-shown');
  const postsTotalElement = document.getElementById('posts-total');
  
  if (postsShownElement) {
    postsShownElement.textContent = postsShown;
  }
  if (postsTotalElement) {
    postsTotalElement.textContent = postsTotal;
  }
}

/**
 * Initialize URL-based search filtering
 * Handles search when page loads with URL parameters from global search
 */
function initUrlSearchFilter() {
  console.log('Initializing URL search filter...');
  
  // Get search term from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('s');
  
  if (!searchTerm) {
    console.log('No search parameter found in URL');
    return;
  }
  
  console.log('Search parameter found:', searchTerm);
  
  // Wait for blog search to be initialized
  setTimeout(() => {
    const searchInput = document.querySelector('#blog-search');
    if (searchInput) {
      console.log('Found search input, setting value and triggering search:', searchTerm);
      searchInput.value = searchTerm;
      
      // Trigger the search
      const searchForm = document.querySelector('.search-form');
      if (searchForm) {
        searchForm.dispatchEvent(new Event('submit'));
      }
    } else {
      console.log('Search input not found');
    }
  }, 1000); // Give time for other initialization to complete
} 