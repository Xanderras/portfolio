// Main Application Controller
class PortfolioApp {
  constructor() {
    this.isLoading = true;
    this.currentSection = 'home';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupNavigation();
    this.setupScrollEffects();
    this.setupContactForm();
    this.setupBackToTop();
    this.setupMobileMenu();
    this.setupSmoothScroll();
    this.setupLoadingEffects();
    this.preloadImages();
  }

  setupEventListeners() {
    // Window events
    window.addEventListener('load', () => this.handlePageLoad());
    window.addEventListener(
      'scroll',
      this.throttle(() => this.handleScroll(), 16)
    );
    window.addEventListener(
      'resize',
      this.debounce(() => this.handleResize(), 250)
    );

    // Keyboard navigation
    document.addEventListener('keydown', e => this.handleKeyboard(e));

    // Focus management for accessibility
    document.addEventListener('focusin', e => this.handleFocusIn(e));
    document.addEventListener('focusout', e => this.handleFocusOut(e));
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        this.navigateToSection(targetId);
        this.closeMobileMenu();
      });
    });

    // Update active nav link on scroll
    this.updateActiveNavLink();
  }

  navigateToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return;

    const headerHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = targetSection.offsetTop - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });

    this.currentSection = sectionId;
    this.updateActiveNavLink();
  }

  updateActiveNavLink() {
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 100;

    let currentSection = 'home';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  setupScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Add/remove scrolled class to navbar
      if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Hide/show navbar on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', this.throttle(handleScroll, 16));
  }

  setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      await this.handleFormSubmission(contactForm);
    });

    // Add floating label effects
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
      const input = group.querySelector('input, textarea');
      const label = group.querySelector('label');

      if (input && label) {
        input.addEventListener('focus', () => {
          group.classList.add('focused');
        });

        input.addEventListener('blur', () => {
          if (!input.value) {
            group.classList.remove('focused');
          }
        });

        // Check if input has value on page load
        if (input.value) {
          group.classList.add('focused');
        }
      }
    });
  }

  async handleFormSubmission(form) {
    // const formData = new FormData(form); // TODO: Use this when implementing real form submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> <span data-nl="Verzenden..." data-en="Sending...">Verzenden...</span>';
    submitBtn.disabled = true;

    try {
      // Simulate form submission (replace with your actual endpoint)
      await this.simulateFormSubmission();

      this.showNotification(
        window.languageManager?.getText('Bericht verzonden!', 'Message sent!') || 'Message sent!',
        'success'
      );
      form.reset();

      // Remove focused class from form groups
      form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('focused');
      });
    } catch (error) {
      console.error('Form submission error:', error);
      this.showNotification(
        window.languageManager?.getText(
          'Er is een fout opgetreden. Probeer het opnieuw.',
          'An error occurred. Please try again.'
        ) || 'An error occurred. Please try again.',
        'error'
      );
    } finally {
      // Restore button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  async simulateFormSubmission() {
    // Simulate API call (formData parameter kept for future implementation)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success (90% of the time)
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Simulated error'));
        }
      }, 2000);
    });
  }

  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;

    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'notification-styles';
      styles.textContent = `
                .notification {
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    background: var(--bg-glass);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--border-glass);
                    border-radius: var(--radius-medium);
                    padding: 1rem 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    z-index: 10000;
                    animation: slideInRight 0.3s ease;
                    max-width: 400px;
                    box-shadow: 0 10px 40px var(--shadow-medium);
                }
                .notification-success {
                    border-left: 4px solid #10b981;
                    color: #10b981;
                }
                .notification-error {
                    border-left: 4px solid #ef4444;
                    color: #ef4444;
                }
                .notification-info {
                    border-left: 4px solid var(--primary-color);
                    color: var(--primary-color);
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    padding: 0.25rem;
                    margin-left: auto;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  setupBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });

    // Show/hide back to top button
    window.addEventListener(
      'scroll',
      this.throttle(() => {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }, 100)
    );
  }

  setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Update aria attributes
    const isExpanded = navMenu.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);
  }

  closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  setupSmoothScroll() {
    // Smooth scroll for all internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
      link.addEventListener('click', e => {
        const targetId = link.getAttribute('href');
        if (targetId === '#' || targetId === '#top') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            this.navigateToSection(targetId.substring(1));
          }
        }
      });
    });
  }

  setupLoadingEffects() {
    // Add loading class to body
    document.body.classList.add('loading');

    // Remove loading effects after page is fully loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.body.classList.remove('loading');
        this.isLoading = false;
      }, 500);
    });
  }

  preloadImages() {
    const imageUrls = [
      'assets/images/profile.jpg',
      'assets/images/project1.jpg',
      'assets/images/project2.jpg',
      'assets/images/project3.jpg',
    ];

    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

  handlePageLoad() {
    // Initialize any components that need the full page to be loaded
    this.updateActiveNavLink();

    // Trigger entrance animations
    setTimeout(() => {
      const heroElements = document.querySelectorAll('.hero-text > *');
      heroElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('animate-slide-up');
        }, index * 100);
      });
    }, 200);
  }

  handleScroll() {
    this.updateActiveNavLink();

    // Add scroll-based animations here if needed
    const scrollProgress =
      window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty('--scroll-progress', scrollProgress);
  }

  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 991) {
      this.closeMobileMenu();
    }

    // Update any layout-dependent calculations
    this.updateActiveNavLink();
  }

  handleKeyboard(e) {
    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'k':
          e.preventDefault();
          // Focus search or navigation
          document.querySelector('.nav-link')?.focus();
          break;
        case 'Enter':
          if (e.target.classList.contains('nav-link')) {
            e.target.click();
          }
          break;
      }
    }

    // Escape key handlers
    if (e.key === 'Escape') {
      this.closeMobileMenu();

      // Close any open modals or overlays
      const activeOverlays = document.querySelectorAll('.overlay.active, .modal.active');
      activeOverlays.forEach(overlay => overlay.classList.remove('active'));
    }
  }

  handleFocusIn(e) {
    // Add focus indicators for accessibility
    e.target.classList.add('focused');
  }

  handleFocusOut(e) {
    // Remove focus indicators
    e.target.classList.remove('focused');
  }

  // Utility functions
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Public API methods
  getCurrentSection() {
    return this.currentSection;
  }

  isPageLoading() {
    return this.isLoading;
  }

  showSection(sectionId) {
    this.navigateToSection(sectionId);
  }

  addCustomAnimation(element, animationType, delay = 0) {
    setTimeout(() => {
      if (window.animationManager) {
        window.animationManager.triggerAnimation(element, animationType);
      }
    }, delay);
  }
}

// Portfolio initialization with new component system
async function initializeComponents() {
  try {
    console.log('🚀 Initializing component system...');

    // Initialize DataManager
    window.dataManager = new DataManager();

    // Preload critical data
    await window.dataManager.preloadData(['experiences', 'translations']);

    // Initialize Timeline component
    const timelineContainer = document.getElementById('timeline-container');
    if (timelineContainer) {
      window.timeline = new Timeline(timelineContainer, { visibleCount: 4 });

      // Load experiences data
      const experiences = await window.dataManager.loadExperiences();
      await window.timeline.loadData(experiences);

      console.log('✅ Timeline component initialized successfully');
    }

    // Initialize LanguageManager with DataManager
    if (window.languageManager && window.dataManager) {
      window.languageManager.dataManager = window.dataManager;
      await window.languageManager.loadTranslations();

      // Update timeline language
      if (window.timeline) {
        window.timeline.setLanguage(window.languageManager.getCurrentLanguage());
      }
    }

    console.log('✅ All components initialized successfully');

  } catch (error) {
    console.error('❌ Error initializing components:', error);

    // Show error state in timeline container
    const timelineContainer = document.getElementById('timeline-container');
    if (timelineContainer) {
      timelineContainer.innerHTML = `
        <div class="error-placeholder">
          <i class="fas fa-exclamation-triangle"></i>
          <span data-nl="Er is een fout opgetreden bij het laden van de ervaring." data-en="An error occurred while loading experience.">
            Er is een fout opgetreden bij het laden van de ervaring.
          </span>
        </div>
      `;
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  window.portfolioApp = new PortfolioApp();

  // Initialize the new component system
  await initializeComponents();

  // Add any additional initialization here
  console.log('Portfolio loaded successfully! 🚀');
});
