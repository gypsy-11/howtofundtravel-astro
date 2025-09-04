// Template Include System for How to Fund Travel
// Automatically includes header and footer templates with proper path adjustments

class TemplateManager {
    constructor() {
        this.basePath = this.getBasePath();
    }

    getBasePath() {
        // Determine the base path based on current page location
        const path = window.location.pathname;
        const hostname = window.location.hostname;
        
        // For local development (localhost or file://)
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
            if (path.includes('/blog/') || path.includes('/case-studies/')) {
                return '../';
            } else if (path === '/' || path === '/index.html' || path.endsWith('.html')) {
                return './';
            } else {
                return './';
            }
        }
        
        // For production - use absolute paths
        return '/';
    }

    async includeHeader() {
        try {
            // Check if header already exists
            if (document.querySelector('.site-header')) {
                console.log('Header already exists, skipping includeHeader');
                return;
            }
            
            const headerPath = `${this.basePath}templates/header-template.html`;
            
            const response = await fetch(headerPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            let headerHtml = await response.text();
            
            // Adjust paths in header template
            headerHtml = this.adjustPaths(headerHtml);
            
            // Insert header at the beginning of body
            document.body.insertAdjacentHTML('afterbegin', headerHtml);
            
            // Set active navigation state
            this.setActiveNavigation();
            
            // Initialize mobile navigation after header is loaded
            if (typeof initMobileNav === 'function') {
                initMobileNav();
            }
        } catch (error) {
            console.error('Error loading header template:', error);
            // Fallback: create a simple header
            this.createFallbackHeader();
        }
    }

    async includeFooter() {
        try {
            // Check if footer already exists
            if (document.querySelector('.site-footer')) {
                console.log('Footer already exists, skipping includeFooter');
                return;
            }
            
            const footerPath = `${this.basePath}templates/footer-template.html`;
            
            const response = await fetch(footerPath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            let footerHtml = await response.text();
            
            // Adjust paths in footer template
            footerHtml = this.adjustPaths(footerHtml);
            
            // Insert footer before closing body tag
            document.body.insertAdjacentHTML('beforeend', footerHtml);
        } catch (error) {
            console.error('Error loading footer template:', error);
            // Fallback: create a simple footer
            this.createFallbackFooter();
        }
    }

    createFallbackHeader() {
        // Check if header already exists
        if (document.querySelector('.site-header')) {
            return;
        }
        
        const fallbackHeader = `
            <header class="site-header">
                <div class="container">
                    <nav class="main-nav" aria-label="Main Navigation">
                        <a href="${this.basePath}" class="logo" aria-label="How to Fund Travel Home">
                            <img src="${this.basePath}images/how-to-fund-travel-logo-transparent.svg" alt="How to Fund Travel Logo" width="150" height="32">
                        </a>
                        
                        <button class="mobile-menu-toggle" aria-label="Toggle Menu" aria-expanded="false">
                            <span class="sr-only">Menu</span>
                            <span class="hamburger"></span>
                        </button>
                        
                        <ul class="nav-links">
                            <li><a href="${this.basePath}" data-nav="home">Home</a></li>
                            <li><a href="${this.basePath}blog/" data-nav="blog">Blog</a></li>
                            <li><a href="${this.basePath}case-studies/" data-nav="case-studies">Case Studies</a></li>
                            <li><a href="${this.basePath}about.html" data-nav="about">About Me</a></li>
                        </ul>
                        
                        <div class="header-actions">
                            <div class="search-container">
                                <input type="text" placeholder="Search travel funding tips..." class="search-input">
                                <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27c.98-1.14 1.57-2.62 1.57-4.23 0-3.59-2.91-6.5-6.5-6.5S2.5 5.91 2.5 9.5s2.91 6.5 6.5 6.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                </svg>
                            </div>
                            <a href="${this.basePath}#newsletter" class="btn btn-primary subscribe-btn">Subscribe</a>
                        </div>
                    </nav>
                </div>
            </header>
        `;
        document.body.insertAdjacentHTML('afterbegin', fallbackHeader);
    }

    createFallbackFooter() {
        // Check if footer already exists
        if (document.querySelector('.site-footer')) {
            return;
        }
        
        const fallbackFooter = `
            <footer class="site-footer">
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-brand">
                            <a href="${this.basePath}" class="footer-logo">
                                <img src="${this.basePath}images/how-to-fund-travel-logo-white.svg" alt="How to Fund Travel Logo" width="160" height="35">
                            </a>
                            <p class="footer-tagline">Helping families achieve location independence and fund their travel lifestyle.</p>
                        </div>
                        
                        <div class="footer-links">
                            <div class="footer-nav">
                                <h3>Navigation</h3>
                                <ul>
                                    <li><a href="${this.basePath}">Home</a></li>
                                    <li><a href="${this.basePath}blog/">Blog</a></li>
                                    <li><a href="${this.basePath}about.html">About Me</a></li>
                                    <li><a href="${this.basePath}resources">Resources</a></li>
                                    <li><a href="${this.basePath}contact">Contact</a></li>
                                </ul>
                            </div>
                            
                            <div class="footer-categories">
                                <h3>Explore</h3>
                                <ul>
                                    <li><a href="${this.basePath}blog/category/remote-work">Remote Work</a></li>
                                    <li><a href="${this.basePath}blog/category/online-business">Online Business</a></li>
                                    <li><a href="${this.basePath}blog/category/investing">Travel Investing</a></li>
                                    <li><a href="${this.basePath}blog/category/mindset">Freedom Mindset</a></li>
                                </ul>
                            </div>
                            
                            <div class="footer-legal">
                                <h3>Legal</h3>
                                <ul>
                                    <li><a href="${this.basePath}privacy">Privacy Policy</a></li>
                                    <li><a href="${this.basePath}terms">Terms of Use</a></li>
                                    <li><a href="${this.basePath}disclaimer">Disclaimer</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="footer-newsletter">
                            <h3>Stay Connected</h3>
                            <p>Join our community of freedom seekers and receive travel funding tips.</p>
                            <a href="${this.basePath}#newsletter" class="btn btn-secondary">Subscribe</a>
                            
                            <div class="social-icons">
                                <a href="https://instagram.com/fulltimefamilytravel" aria-label="Follow us on Instagram">
                                    <svg aria-hidden="true" width="24" height="24"><use href="#icon-instagram"></use></svg>
                                </a>
                                <a href="https://facebook.com/worldtravelambitions" aria-label="Follow us on Facebook">
                                    <svg aria-hidden="true" width="24" height="24"><use href="#icon-facebook"></use></svg>
                                </a>
                                <a href="https://www.linkedin.com/in/melissawiringi/" aria-label="Connect with us on LinkedIn">
                                    <svg aria-hidden="true" width="24" height="24"><use href="#icon-linkedin"></use></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="copyright">
                        <p>&copy; <script>document.write(new Date().getFullYear())</script> How to Fund Travel. All rights reserved.</p>
                    </div>
                </div>
            </footer>
            
            <!-- SVG Icons Sprite - Hidden -->
            <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                <symbol id="icon-instagram" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </symbol>
                <symbol id="icon-facebook" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z"/>
                </symbol>
                <symbol id="icon-youtube" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </symbol>
                <symbol id="icon-pinterest" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                </symbol>
                <symbol id="icon-linkedin" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </symbol>
            </svg>
        `;
        document.body.insertAdjacentHTML('beforeend', fallbackFooter);
    }

    adjustPaths(html) {
        // Replace both absolute paths (starting with /) and relative paths (starting with ../) with correct base path
        let adjustedHtml = html.replace(/href="\//g, `href="${this.basePath}`)
                               .replace(/src="\//g, `src="${this.basePath}`)
                               .replace(/href="\.\.\//g, `href="${this.basePath}`)
                               .replace(/src="\.\.\//g, `src="${this.basePath}`);
        
        return adjustedHtml;
    }

    setActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('[data-nav]');
        
        navLinks.forEach(link => {
            const navType = link.getAttribute('data-nav');
            link.classList.remove('active');
            
            // Set active based on current page
            if (currentPath === '/' && navType === 'home') {
                link.classList.add('active');
            } else if (currentPath.startsWith('/blog/') && navType === 'blog') {
                link.classList.add('active');
            } else if (currentPath.startsWith('/case-studies/') && navType === 'case-studies') {
                link.classList.add('active');
            } else if (currentPath.includes('about') && navType === 'about') {
                link.classList.add('active');
            }
        });
    }

    // Initialize all templates
    async init() {
        console.log('TemplateManager: Starting initialization');
        await this.includeHeader();
        await this.includeFooter();
        console.log('TemplateManager: Initialization complete');
        
        // Fallback: Initialize mobile nav after a delay in case template system fails
        setTimeout(() => {
            if (document.querySelector('.mobile-menu-toggle') && !document.querySelector('.mobile-menu-toggle').hasAttribute('data-initialized')) {
                console.log('Fallback: Initializing mobile navigation');
                if (typeof initMobileNav === 'function') {
                    initMobileNav();
                }
            }
        }, 1000);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Prevent multiple initializations
    if (window.templateManagerInitialized) {
        return;
    }
    
    // Additional check to prevent race conditions
    if (document.querySelector('.site-header')) {
        console.log('Header already exists, skipping template initialization');
        return;
    }
    
    const templateManager = new TemplateManager();
    templateManager.init();
    
    // Mark as initialized
    window.templateManagerInitialized = true;
}); 