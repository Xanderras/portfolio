// DataManager - Centralized data loading and caching
/* exported DataManager */
class DataManager {
  constructor() {
    this.cache = new Map();
    this.baseUrl = './data/';
    this.loadingStates = new Map();
  }

  /**
   * Load JSON data from file with caching
   * @param {string} filename - The JSON filename (without extension)
   * @returns {Promise<Object>} - The loaded data
   */
  async loadData(filename) {
    const cacheKey = filename;

    // Return cached data if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Check if already loading to prevent duplicate requests
    if (this.loadingStates.has(cacheKey)) {
      return this.loadingStates.get(cacheKey);
    }

    // Create loading promise
    const loadingPromise = this.fetchData(filename);
    this.loadingStates.set(cacheKey, loadingPromise);

    try {
      const data = await loadingPromise;
      this.cache.set(cacheKey, data);
      this.loadingStates.delete(cacheKey);
      return data;
    } catch (error) {
      this.loadingStates.delete(cacheKey);
      throw error;
    }
  }

  /**
   * Fetch data from JSON file
   * @param {string} filename - The JSON filename
   * @returns {Promise<Object>} - The fetched data
   */
  async fetchData(filename) {
    const url = `${this.baseUrl}${filename}.json`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Loaded ${filename} data successfully`);
      return data;

    } catch (error) {
      console.error(`❌ Error loading ${filename}:`, error);
      throw new Error(`Failed to load ${filename} data: ${error.message}`);
    }
  }

  /**
   * Load experiences data
   * @returns {Promise<Array>} - Array of experiences
   */
  async loadExperiences() {
    const data = await this.loadData('experiences');
    return data.experiences || [];
  }

  /**
   * Load projects data
   * @returns {Promise<Array>} - Array of projects
   */
  async loadProjects() {
    const data = await this.loadData('projects');
    return data.projects || [];
  }

  /**
   * Load skills data
   * @returns {Promise<Object>} - Skills data structure
   */
  async loadSkills() {
    const data = await this.loadData('skills');
    return data;
  }

  /**
   * Load translations data
   * @returns {Promise<Object>} - Translations object
   */
  async loadTranslations() {
    const data = await this.loadData('translations');
    return data;
  }

  /**
   * Load personal data
   * @returns {Promise<Object>} - Personal information
   */
  async loadPersonalData() {
    const data = await this.loadData('personal');
    return data;
  }

  /**
   * Load all data at once
   * @returns {Promise<Object>} - Object containing all loaded data
   */
  async loadAllData() {
    try {
      const [experiences, translations] = await Promise.all([
        this.loadExperiences(),
        this.loadTranslations().catch(() => ({})) // Make translations optional for now
      ]);

      return {
        experiences,
        translations
      };
    } catch (error) {
      console.error('❌ Error loading data:', error);
      throw error;
    }
  }

  /**
   * Clear cache for a specific data type
   * @param {string} filename - The filename to clear from cache
   */
  clearCache(filename) {
    this.cache.delete(filename);
  }

  /**
   * Clear all cached data
   */
  clearAllCache() {
    this.cache.clear();
  }

  /**
   * Get cached data without loading
   * @param {string} filename - The filename
   * @returns {Object|null} - Cached data or null
   */
  getCachedData(filename) {
    return this.cache.get(filename) || null;
  }

  /**
   * Check if data is cached
   * @param {string} filename - The filename
   * @returns {boolean} - Whether data is cached
   */
  isCached(filename) {
    return this.cache.has(filename);
  }

  /**
   * Check if data is currently loading
   * @param {string} filename - The filename
   * @returns {boolean} - Whether data is loading
   */
  isLoading(filename) {
    return this.loadingStates.has(filename);
  }

  /**
   * Reload data (clears cache and loads fresh)
   * @param {string} filename - The filename to reload
   * @returns {Promise<Object>} - The reloaded data
   */
  async reloadData(filename) {
    this.clearCache(filename);
    return this.loadData(filename);
  }

  /**
   * Preload data for better performance
   * @param {Array<string>} filenames - Array of filenames to preload
   */
  async preloadData(filenames = ['experiences', 'translations']) {
    try {
      console.log('🚀 Preloading data...');
      const promises = filenames.map(filename =>
        this.loadData(filename).catch(error => {
          console.warn(`⚠️ Failed to preload ${filename}:`, error.message);
          return null;
        })
      );

      await Promise.all(promises);
      console.log('✅ Data preloading complete');
    } catch (error) {
      console.error('❌ Error during data preloading:', error);
    }
  }

  /**
   * Get loading statistics
   * @returns {Object} - Loading statistics
   */
  getLoadingStats() {
    return {
      cachedItems: this.cache.size,
      loadingItems: this.loadingStates.size,
      cachedKeys: Array.from(this.cache.keys()),
      loadingKeys: Array.from(this.loadingStates.keys())
    };
  }
}