// Language Management System
class LanguageManager {
  constructor() {
    this.currentLanguage = 'nl';
    this.languages = {
      nl: '🇳🇱',
      en: '🇺🇸',
    };
    this.translations = {};
    this.dataManager = null;
    this.isInitialized = false;
    this.init();
  }

  async init() {
    // Initialize DataManager if available
    if (window.dataManager) {
      this.dataManager = window.dataManager;
      await this.loadTranslations();
    }

    this.loadStoredLanguage();
    this.setupEventListeners();
    this.updateLanguageToggle();
    this.isInitialized = true;

    // Dispatch event that language manager is ready
    document.dispatchEvent(new CustomEvent('languageManagerReady', {
      detail: { languageManager: this }
    }));
  }

  async loadTranslations() {
    if (!this.dataManager) return;

    try {
      const translationsData = await this.dataManager.loadTranslations();
      this.translations = translationsData.ui || {};
      console.log('✅ Translations loaded successfully');
    } catch (error) {
      console.warn('⚠️ Could not load translations, falling back to DOM attributes:', error.message);
      this.translations = {};
    }
  }

  loadStoredLanguage() {
    const storedLanguage = localStorage.getItem('portfolio-language');
    if (storedLanguage && storedLanguage in this.languages) {
      this.currentLanguage = storedLanguage;
    }
    this.setLanguage(this.currentLanguage);
  }

  setupEventListeners() {
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
      languageToggle.addEventListener('click', () => {
        this.toggleLanguage();
      });
    }
  }

  toggleLanguage() {
    const newLanguage = this.currentLanguage === 'nl' ? 'en' : 'nl';
    this.setLanguage(newLanguage);
    this.animateLanguageSwitch();
  }

  setLanguage(language) {
    this.currentLanguage = language;
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('portfolio-language', language);
    this.updateContent();
    this.updateLanguageToggle();

    // Dispatch language changed event for components to listen to
    document.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: this.currentLanguage, languageManager: this }
    }));
  }

  updateContent() {
    // Update all elements with language data attributes
    const elements = document.querySelectorAll('[data-nl][data-en]');

    elements.forEach(element => {
      const text = element.getAttribute(`data-${this.currentLanguage}`);
      if (text) {
        // Animate text change
        element.style.opacity = '0.5';
        element.style.transform = 'translateY(-5px)';

        setTimeout(() => {
          element.textContent = text;
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, 150);
      }
    });

    // Update page title
    const titles = {
      nl: 'Portfolio - Computer Science & IoT Developer',
      en: 'Portfolio - Computer Science & IoT Developer',
    };
    document.title = titles[this.currentLanguage];

    // Update meta description
    const descriptions = {
      nl: 'Portfolio van een Computer Science afgestudeerde en IoT ontwikkelaar',
      en: 'Portfolio of a Computer Science graduate and IoT developer',
    };
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptions[this.currentLanguage]);
    }

    // Update form placeholders
    this.updateFormPlaceholders();

    // Update typing text
    this.updateTypingText();
  }

  updateFormPlaceholders() {
    const placeholders = {
      nl: {
        name: 'Voer je naam in',
        email: 'Voer je email in',
        subject: 'Voer het onderwerp in',
        message: 'Voer je bericht in',
      },
      en: {
        name: 'Enter your name',
        email: 'Enter your email',
        subject: 'Enter the subject',
        message: 'Enter your message',
      },
    };

    Object.keys(placeholders[this.currentLanguage]).forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.setAttribute('placeholder', placeholders[this.currentLanguage][id]);
      }
    });
  }

  updateTypingText() {
    const typingTexts = {
      nl: [
        'Web Developer',
        'IoT Specialist',
        'Frontend Expert',
        'Backend Developer',
        'Tech Enthusiast',
        'Problem Solver',
      ],
      en: [
        'Web Developer',
        'IoT Specialist',
        'Frontend Expert',
        'Backend Developer',
        'Tech Enthusiast',
        'Problem Solver',
      ],
    };

    // Update the typing animation with new texts
    if (window.typingAnimation) {
      window.typingAnimation.updateTexts(typingTexts[this.currentLanguage]);
    }
  }

  updateLanguageToggle() {
    const languageToggle = document.getElementById('language-toggle');
    if (!languageToggle) return;

    const flagIcon = languageToggle.querySelector('.flag-icon');
    const langText = languageToggle.querySelector('.lang-text');

    if (flagIcon && langText) {
      if (this.currentLanguage === 'nl') {
        flagIcon.textContent = '🇳🇱';
        langText.textContent = 'EN';
        languageToggle.setAttribute('title', 'Switch to English');
      } else {
        flagIcon.textContent = '🇺🇸';
        langText.textContent = 'NL';
        languageToggle.setAttribute('title', 'Schakel naar Nederlands');
      }
    }
  }

  animateLanguageSwitch() {
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
      languageToggle.style.transform = 'scale(0.9)';
      languageToggle.style.transition = 'transform 0.2s ease';

      setTimeout(() => {
        languageToggle.style.transform = 'scale(1)';
      }, 100);
    }

    // Add a subtle page animation
    document.body.style.opacity = '0.95';
    document.body.style.transition = 'opacity 0.3s ease';

    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 150);
  }

  // Method to get current language text
  getText(nlText, enText) {
    return this.currentLanguage === 'nl' ? nlText : enText;
  }

  // Method to get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Method to add translation keys programmatically
  addTranslation(key, nlText, enText) {
    if (!this.translations[key]) {
      this.translations[key] = {};
    }
    this.translations[key].nl = nlText;
    this.translations[key].en = enText;
  }

  // Method to get translation by key
  getTranslation(key) {
    if (this.translations[key] && this.translations[key][this.currentLanguage]) {
      return this.translations[key][this.currentLanguage];
    }
    return key; // Fallback to key if translation not found
  }

  // Method to get translation by nested path (e.g., 'sections.about.title')
  getTranslationByPath(path) {
    const keys = path.split('.');
    let current = this.translations;

    // Navigate through the nested object
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        console.warn(`Translation path not found: ${path}`);
        return path; // Fallback to path if not found
      }
    }

    // Return the translation for current language
    if (current && typeof current === 'object' && this.currentLanguage in current) {
      return current[this.currentLanguage];
    }

    console.warn(`Translation not found for language ${this.currentLanguage} at path: ${path}`);
    return path; // Fallback to path if not found
  }

  // Helper method to translate text with fallback to data attributes
  translate(element, path) {
    // Try to get from JSON first
    if (this.translations && Object.keys(this.translations).length > 0) {
      const translation = this.getTranslationByPath(path);
      if (translation !== path) {
        return translation;
      }
    }

    // Fallback to data attributes
    const fallback = element.getAttribute(`data-${this.currentLanguage}`);
    return fallback || path;
  }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.languageManager = new LanguageManager();
});
