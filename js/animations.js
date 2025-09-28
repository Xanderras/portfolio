// Animation System
class AnimationManager {
  constructor() {
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.observer = null;
    this.init();
  }

  init() {
    this.setupParticleCanvas();
    this.setupScrollAnimations();
    this.setupTypingAnimation();
    this.setupSkillAnimations();
    this.setupStatCounters();
    this.setupParallaxEffects();
    this.setupCursorEffects();
  }

  // Particle Background System
  setupParticleCanvas() {
    this.canvas = document.getElementById('particle-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    this.createParticles();
    this.animateParticles();

    // Handle resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });

    // Pause animation when page is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
  }

  resizeCanvas() {
    if (!this.canvas) return;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: this.getParticleColor(),
      });
    }
  }

  getParticleColor() {
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  animateParticles() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Wrap around edges
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.y > this.canvas.height) particle.y = 0;
      if (particle.y < 0) particle.y = this.canvas.height;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle =
        particle.color +
        Math.floor(particle.opacity * 255)
          .toString(16)
          .padStart(2, '0');
      this.ctx.fill();
    });

    // Draw connections between nearby particles
    this.drawConnections();

    this.animationId = requestAnimationFrame(() => this.animateParticles());
  }

  drawConnections() {
    const maxDistance = 150;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.2;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }

  pauseAnimations() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resumeAnimations() {
    if (!this.animationId) {
      this.animateParticles();
    }
  }

  // Scroll-triggered animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');

          // Trigger specific animations based on element
          this.handleElementAnimation(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll(
      '.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-zoom-in, .scroll-rotate-in'
    );
    animatedElements.forEach(el => {
      this.observer.observe(el);
    });

    // Observe sections for staggered animations
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      this.observer.observe(section);
    });
  }

  handleElementAnimation(element) {
    // Handle specific element animations
    if (element.classList.contains('skills')) {
      this.animateSkills();
    }

    if (element.classList.contains('about')) {
      this.animateStats();
    }

    // Add staggered animations to child elements
    const staggerElements = element.querySelectorAll(
      '.project-card, .skill-category, .timeline-item'
    );
    staggerElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate-slide-up');
      }, index * 100);
    });
  }

  // Typing Animation
  setupTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const texts = [
      'Web Developer',
      'IoT Specialist',
      'Frontend Expert',
      'Backend Developer',
      'Tech Enthusiast',
      'Problem Solver',
    ];

    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
      const currentText = texts[currentTextIndex];

      if (isDeleting) {
        typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingSpeed = 50;
      } else {
        typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && currentCharIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause before deleting
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % texts.length;
        typingSpeed = 500; // Pause before typing next word
      }

      setTimeout(type, typingSpeed);
    };

    // Start typing animation after a brief delay
    setTimeout(type, 1000);

    // Store reference for language switching
    window.typingAnimation = {
      updateTexts: newTexts => {
        texts.length = 0;
        texts.push(...newTexts);
      },
    };
  }

  // Skill Bar Animations
  setupSkillAnimations() {
    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach(bar => {
      this.observer.observe(bar.parentElement);
    });
  }

  animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach((bar, index) => {
      setTimeout(() => {
        bar.style.width = bar.style.getPropertyValue('--width') || '0%';
      }, index * 100);
    });
  }

  // Statistics Counter Animation
  setupStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    statNumbers.forEach(stat => {
      this.observer.observe(stat);
    });
  }

  animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          stat.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target;
        }
      };

      updateCounter();
    });
  }

  // Parallax Effects
  setupParallaxEffects() {
    window.addEventListener(
      'scroll',
      this.throttle(() => {
        this.updateParallax();
      }, 16)
    );
  }

  updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-fast');

    parallaxElements.forEach(element => {
      const speed = element.classList.contains('parallax-fast') ? 0.5 : 0.2;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });

    // Update floating icons
    const floatingIcons = document.querySelectorAll('.floating-icon');
    floatingIcons.forEach((icon, index) => {
      const speed = 0.1 + index * 0.02;
      const yPos = Math.sin(scrolled * speed) * 10;
      icon.style.transform = `translateY(${yPos}px)`;
    });
  }

  // Cursor Effects
  setupCursorEffects() {
    // Mouse position tracking for future cursor effects
    document.addEventListener('mousemove', e => {
      // Store mouse position for potential future use
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Create cursor trail on click
    document.addEventListener('click', e => {
      this.createCursorTrail(e.clientX, e.clientY);
    });

    // Interactive elements tilt effect
    const interactiveElements = document.querySelectorAll('.interactive-tilt');
    interactiveElements.forEach(element => {
      element.addEventListener('mousemove', e => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((centerX - x) / centerX) * 10;

        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  createCursorTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = `${x - 10}px`;
    trail.style.top = `${y - 10}px`;

    document.body.appendChild(trail);

    setTimeout(() => {
      if (document.body.contains(trail)) {
        document.body.removeChild(trail);
      }
    }, 600);
  }

  // Utility function for throttling
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

  // Public methods for controlling animations
  pauseParticles() {
    this.pauseAnimations();
  }

  resumeParticles() {
    this.resumeAnimations();
  }

  // Method to trigger specific animations
  triggerAnimation(element, animationType) {
    element.classList.add(`animate-${animationType}`);

    // Remove animation class after completion
    element.addEventListener(
      'animationend',
      () => {
        element.classList.remove(`animate-${animationType}`);
      },
      { once: true }
    );
  }
}

// Initialize animation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.animationManager = new AnimationManager();

  // Reduce animations for users who prefer reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduced-motion');
    if (window.animationManager) {
      window.animationManager.pauseParticles();
    }
  }
});
