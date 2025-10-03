// Timeline Component - Dynamic experience timeline rendering
/* exported Timeline */
class Timeline {
  constructor(container, options = {}) {
    this.container = container;
    this.experiences = [];
    this.currentLanguage = 'nl';
    this.visibleCount = options.visibleCount || 4;
    this.showMoreText = {
      nl: { show: 'Toon Meer Ervaring', hide: 'Toon Minder Ervaring' },
      en: { show: 'Show More Experience', hide: 'Show Less Experience' }
    };
    this.isExpanded = false;

    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for language changes
    document.addEventListener('languageChanged', (e) => {
      this.currentLanguage = e.detail.language;
      this.render();
    });
  }

  async loadData(experiences) {
    this.experiences = this.sortExperiences(experiences);
    this.render();
  }

  sortExperiences(experiences) {
    return experiences.sort((a, b) => {
      // Sort by priority first, then by start date (newest first)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }

      // Convert dates for comparison
      const dateA = this.parseDate(a.startDate);
      const dateB = this.parseDate(b.startDate);
      return dateB - dateA;
    });
  }

  parseDate(dateString) {
    if (dateString === 'current') return new Date();

    // Handle different date formats
    if (dateString.includes('-')) {
      return new Date(dateString + '-01'); // Add day if missing
    }

    return new Date(dateString + '-01-01'); // Year only
  }

  render() {
    if (!this.container) return;

    const visibleExperiences = this.experiences.filter(exp => exp.visible);
    const hiddenExperiences = this.experiences.filter(exp => !exp.visible);

    this.container.innerHTML = `
      <div class="timeline">
        ${this.renderTimelineItems(visibleExperiences)}

        ${hiddenExperiences.length > 0 ? `
          <div class="timeline-hidden" id="timeline-hidden" style="display: none; opacity: 0; transform: translateY(-20px);">
            ${this.renderTimelineItems(hiddenExperiences)}
          </div>

          <div class="timeline-toggle">
            <button class="btn btn-secondary" id="timeline-toggle-btn" onclick="window.timeline.toggleExpansion()">
              <span>${this.showMoreText[this.currentLanguage].show}</span>
              <i class="fas fa-chevron-down" id="timeline-toggle-icon"></i>
            </button>
          </div>
        ` : ''}
      </div>
    `;

    // Reapply expanded state if needed
    if (this.isExpanded && hiddenExperiences.length > 0) {
      this.showHiddenItems();
    }
  }

  renderTimelineItems(experiences) {
    return experiences.map(exp => this.renderTimelineItem(exp)).join('');
  }

  renderTimelineItem(experience) {
    const logoClass = experience.type === 'education' ? 'school-logo' : 'company-logo';
    const hasUrl = experience.organization.url;

    return `
      <div class="timeline-item" data-experience-id="${experience.id}">
        <div class="timeline-date">${experience.displayDate[this.currentLanguage]}</div>
        <div class="timeline-content">
          ${experience.organization.logo ? `
            <img src="${experience.organization.logo}" alt="${experience.organization.name} Logo" class="${logoClass}">
          ` : ''}

          <h3>${experience.position[this.currentLanguage]}</h3>

          ${hasUrl ? `
            <a href="${experience.organization.url}" target="_blank" class="${experience.type === 'education' ? 'school-link' : 'company-link'}">
              <h4>${experience.organization.name}</h4>
            </a>
          ` : `
            <h4>${experience.organization.name}</h4>
          `}

          <p>${experience.description[this.currentLanguage]}</p>
        </div>
      </div>
    `;
  }

  toggleExpansion() {
    const toggleBtn = document.getElementById('timeline-toggle-btn');
    const toggleIcon = document.getElementById('timeline-toggle-icon');
    const btnText = toggleBtn.querySelector('span');

    if (!this.isExpanded) {
      // Show more
      this.showHiddenItems();
      btnText.textContent = this.showMoreText[this.currentLanguage].hide;
      toggleIcon.classList.remove('fa-chevron-down');
      toggleIcon.classList.add('fa-chevron-up');
      this.isExpanded = true;
    } else {
      // Show less
      this.hideHiddenItems();
      btnText.textContent = this.showMoreText[this.currentLanguage].show;
      toggleIcon.classList.remove('fa-chevron-up');
      toggleIcon.classList.add('fa-chevron-down');
      this.isExpanded = false;

      // Scroll to experience section
      document.querySelector('#experience').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  showHiddenItems() {
    const hiddenTimeline = document.getElementById('timeline-hidden');
    if (hiddenTimeline) {
      hiddenTimeline.style.display = 'block';
      setTimeout(() => {
        hiddenTimeline.style.opacity = '1';
        hiddenTimeline.style.transform = 'translateY(0)';
      }, 10);
    }
  }

  hideHiddenItems() {
    const hiddenTimeline = document.getElementById('timeline-hidden');
    if (hiddenTimeline) {
      hiddenTimeline.style.opacity = '0';
      hiddenTimeline.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        hiddenTimeline.style.display = 'none';
      }, 300);
    }
  }

  // Public methods for external access
  setLanguage(language) {
    this.currentLanguage = language;
    this.render();
  }

  addExperience(experience) {
    this.experiences.push(experience);
    this.experiences = this.sortExperiences(this.experiences);
    this.render();
  }

  removeExperience(experienceId) {
    this.experiences = this.experiences.filter(exp => exp.id !== experienceId);
    this.render();
  }

  updateExperience(experienceId, updatedData) {
    const index = this.experiences.findIndex(exp => exp.id === experienceId);
    if (index !== -1) {
      this.experiences[index] = { ...this.experiences[index], ...updatedData };
      this.experiences = this.sortExperiences(this.experiences);
      this.render();
    }
  }

  // Filter experiences by type
  filterByType(type) {
    const filteredExperiences = this.experiences.filter(exp => exp.type === type);
    const container = this.container;
    container.innerHTML = `
      <div class="timeline">
        ${this.renderTimelineItems(filteredExperiences)}
      </div>
    `;
  }

  // Reset to show all experiences
  resetFilter() {
    this.render();
  }

  // Get experiences by type
  getExperiencesByType(type) {
    return this.experiences.filter(exp => exp.type === type);
  }

  // Get all experiences
  getAllExperiences() {
    return this.experiences;
  }
}