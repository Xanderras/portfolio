// Theme Management System
class ThemeManager {
  constructor() {
    this.themes = ['light', 'dark'];
    this.currentTheme = 'light';
    this.init();
  }

  init() {
    this.loadStoredTheme();
    this.setupEventListeners();
    this.updateThemeToggle();
  }

  loadStoredTheme() {
    // Check for stored theme preference
    const storedTheme = localStorage.getItem('portfolio-theme');

    // Check for system preference if no stored theme
    if (!storedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? 'dark' : 'light';
    } else {
      this.currentTheme = storedTheme;
    }

    this.applyTheme(this.currentTheme);
    this.setupSystemThemeListener();
  }

  setupSystemThemeListener() {
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      // Only apply system theme if user hasn't manually set a preference
      if (!localStorage.getItem('portfolio-theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        this.currentTheme = newTheme;
        this.applyTheme(newTheme);
        this.updateThemeToggle();
      }
    });
  }

  setupEventListeners() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // Keyboard shortcut (Ctrl/Cmd + Shift + D for dark mode toggle)
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    this.animateThemeSwitch();
  }

  setTheme(theme) {
    if (this.themes.includes(theme)) {
      this.currentTheme = theme;
      this.applyTheme(theme);
      this.updateThemeToggle();
      localStorage.setItem('portfolio-theme', theme);
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update theme color meta tag for mobile browsers
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const colors = {
      light: '#ffffff',
      dark: '#111827',
    };

    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', colors[theme]);
    } else {
      // Create theme color meta tag if it doesn't exist
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = colors[theme];
      document.head.appendChild(meta);
    }

    // Dispatch custom event for theme change
    window.dispatchEvent(
      new CustomEvent('themeChange', {
        detail: { theme: theme },
      })
    );
  }

  updateThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const icon = themeToggle.querySelector('i');
    if (icon) {
      if (this.currentTheme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute(
          'title',
          window.languageManager
            ? window.languageManager.getText('Schakel naar licht thema', 'Switch to light theme')
            : 'Switch to light theme'
        );
      } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute(
          'title',
          window.languageManager
            ? window.languageManager.getText('Schakel naar donker thema', 'Switch to dark theme')
            : 'Switch to dark theme'
        );
      }
    }
  }

  animateThemeSwitch() {
    // Create a smooth transition effect
    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) {
      // Animate the toggle button
      themeToggle.style.transform = 'rotate(360deg)';
      themeToggle.style.transition = 'transform 0.5s ease';

      setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
      }, 500);
    }

    // Create a ripple effect
    this.createThemeRipple();
  }

  createThemeRipple() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const ripple = document.createElement('div');
    const rect = themeToggle.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.cssText = `
            position: fixed;
            border-radius: 50%;
            background: ${this.currentTheme === 'dark' ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
            transform: scale(0);
            animation: themeRipple 0.6s linear;
            pointer-events: none;
            z-index: 9999;
            left: ${rect.left + rect.width / 2 - size / 2}px;
            top: ${rect.top + rect.height / 2 - size / 2}px;
            width: ${size}px;
            height: ${size}px;
        `;

    // Add ripple animation keyframes if not already present
    if (!document.querySelector('#theme-ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'theme-ripple-styles';
      style.textContent = `
                @keyframes themeRipple {
                    to {
                        transform: scale(100);
                        opacity: 0;
                    }
                }
            `;
      document.head.appendChild(style);
    }

    document.body.appendChild(ripple);

    setTimeout(() => {
      document.body.removeChild(ripple);
    }, 600);
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  // Method to get theme-specific values
  getThemeValue(lightValue, darkValue) {
    return this.currentTheme === 'dark' ? darkValue : lightValue;
  }

  // Method to check if current theme is dark
  isDark() {
    return this.currentTheme === 'dark';
  }

  // Method to check if current theme is light
  isLight() {
    return this.currentTheme === 'light';
  }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();

  // Update theme toggle when language changes
  window.addEventListener('languageChange', () => {
    if (window.themeManager) {
      window.themeManager.updateThemeToggle();
    }
  });
});
