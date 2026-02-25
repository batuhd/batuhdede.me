document.addEventListener('DOMContentLoaded', () => {
  initIntro();
  initSmoothScroll();
  initNavigation();
  initHeroGlitch();
  initBackgroundVideo();
  renderAbout();
  renderWorks();
  renderContact();
  initScrollAnimations();
});

// youtube

let ytPlayer = null;
let videoOn = true;
let soundOn = false;

function initBackgroundVideo() {
  const videoToggle = document.getElementById('video-toggle');
  const soundToggle = document.getElementById('sound-toggle');
  const container = document.getElementById('bg-video-container');

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);

  window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('bg-video-player', {
      width: '100%',
      height: '100%',
      videoId: 'sAkVnhthpMI',
      playerVars: {
        autoplay: 1,
        controls: 0,
        mute: 1,
        loop: 1,
        start: 757,
        playlist: 'sAkVnhthpMI',
        showinfo: 0,
        rel: 0,
        modestbranding: 1,
        iv_load_policy: 3,
        disablekb: 1,
        fs: 0,
        playsinline: 1,
        origin: window.location.origin
      },
      events: {
        onReady: function(event) {
          event.target.setPlaybackQuality('hd720');
          event.target.seekTo(757, true);
          event.target.playVideo();
        }
      }
    });
  };

  // on/off
  videoToggle.addEventListener('click', () => {
    videoOn = !videoOn;
    videoToggle.textContent = videoOn ? 'Video: On' : 'Video: Off';
    videoToggle.classList.toggle('active', videoOn);

    if (videoOn) {
      container.classList.remove('hidden');
      if (ytPlayer && ytPlayer.playVideo) {
        ytPlayer.playVideo();
      }
    } else {
      container.classList.add('hidden');
      if (ytPlayer && ytPlayer.pauseVideo) {
        ytPlayer.pauseVideo();
      }
      // mute
      if (soundOn) {
        soundOn = false;
        soundToggle.textContent = 'Sound: Off';
        soundToggle.classList.remove('active');
        if (ytPlayer && ytPlayer.mute) ytPlayer.mute();
      }
    }
  });

  // sound on/off
  soundToggle.addEventListener('click', () => {
    if (!videoOn) {
      // on
      videoOn = true;
      videoToggle.textContent = 'Video: On';
      videoToggle.classList.add('active');
      container.classList.remove('hidden');
      if (ytPlayer && ytPlayer.playVideo) ytPlayer.playVideo();
    }

    soundOn = !soundOn;
    soundToggle.textContent = soundOn ? 'Sound: On' : 'Sound: Off';
    soundToggle.classList.toggle('active', soundOn);

    if (ytPlayer) {
      if (soundOn) {
        ytPlayer.unMute();
        ytPlayer.setVolume(30);
      } else {
        ytPlayer.mute();
      }
    }
  });
}

// smooth scroll

const SmoothScroller = {
  current: 0,
  target: 0,
  ease: 0.08,
  running: false,
  rafId: null,

  init() {
    this.current = window.scrollY;
    this.target = window.scrollY;

    window.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.target += e.deltaY;
      this.target = Math.max(0, Math.min(this.target, document.body.scrollHeight - window.innerHeight));
      if (!this.running) this.run();
    }, { passive: false });

    // keyboard scroll
    window.addEventListener('keydown', (e) => {
      const scrollKeys = { ArrowDown: 100, ArrowUp: -100, PageDown: 400, PageUp: -400, ' ': 400 };
      if (scrollKeys[e.key] !== undefined) {
        e.preventDefault();
        this.target += scrollKeys[e.key];
        this.target = Math.max(0, Math.min(this.target, document.body.scrollHeight - window.innerHeight));
        if (!this.running) this.run();
      }
    });

    // touch support
    let touchStart = 0;
    window.addEventListener('touchstart', (e) => {
      touchStart = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      const touchDelta = touchStart - e.touches[0].clientY;
      touchStart = e.touches[0].clientY;
      this.target += touchDelta * 1.5;
      this.target = Math.max(0, Math.min(this.target, document.body.scrollHeight - window.innerHeight));
      if (!this.running) this.run();
    }, { passive: true });
  },

  scrollTo(y) {
    this.target = Math.max(0, Math.min(y, document.body.scrollHeight - window.innerHeight));
    if (!this.running) this.run();
  },

  run() {
    this.running = true;
    this.animate();
  },

  animate() {
    const diff = this.target - this.current;
    this.current += diff * this.ease;

    // snap
    if (Math.abs(diff) < 0.5) {
      this.current = this.target;
      window.scrollTo(0, this.current);
      this.running = false;
      return;
    }

    window.scrollTo(0, this.current);
    this.rafId = requestAnimationFrame(() => this.animate());
  }
};

function initSmoothScroll() {
  // Only on desktop — mobile gets native touch scroll
  if (window.innerWidth > 900) {
    SmoothScroller.init();
  }
}

// intro

function initIntro() {
  const overlay = document.getElementById('intro-overlay');
  const skipBtn = document.getElementById('skip-intro');
  const bootContainer = document.getElementById('boot-lines');
  const progressContainer = document.getElementById('progress-container');
  const progressFill = document.getElementById('progress-fill');
  const progressPercent = document.getElementById('progress-percent');
  const welcomeCard = document.getElementById('welcome-card');
  const transitionLine = document.getElementById('transition-line');
  const video = document.getElementById('intro-video');

  // play video
  if (video) {
    video.play().catch(() => {});
  }

  // typewriter boot lines
  const bootLines = SITE_DATA.bootLines;
  bootLines.forEach((line, i) => {
    const el = document.createElement('div');
    el.className = 'boot-line';
    
    if (i === bootLines.length - 1) {
      el.classList.add('success');
    }

    bootContainer.appendChild(el);

    setTimeout(() => {
      typeWriter(el, line.text, 25, () => {
        if (i === bootLines.length - 1) {
          el.innerHTML += ' <span class="cursor-blink">_</span>';
        }
      });
      el.classList.add('visible');
    }, line.delay);
  });

  // show progress bar
  const lastDelay = bootLines[bootLines.length - 1].delay;
  setTimeout(() => {
    progressContainer.classList.add('visible');
    animateProgress(progressFill, progressPercent, 0, 100, 1500, () => {
      // show welcome card
      setTimeout(() => {
        renderWelcomeCard(welcomeCard);
        welcomeCard.classList.add('visible');

        // show transition line
        setTimeout(() => {
          transitionLine.classList.add('visible');
          setTimeout(() => {
            dismissIntro();
          }, 2000);
        }, 800);
      }, 300);
    });
  }, lastDelay + 600);

  // skip button
  skipBtn.addEventListener('click', dismissIntro);

  function dismissIntro() {
    overlay.classList.add('hidden');
    skipBtn.style.opacity = '0';
    skipBtn.style.pointerEvents = 'none';
    
    setTimeout(() => {
      document.getElementById('main-site').classList.add('visible');
      triggerHeroAnimations();
      if (skipBtn.parentNode) skipBtn.remove();
    }, 300);

    setTimeout(() => {
      if (overlay.parentNode) overlay.remove();
    }, 1000);
  }
}

function typeWriter(element, text, speed, callback) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed + Math.random() * 15);
    } else if (callback) {
      callback();
    }
  }
  type();
}

function animateProgress(fillEl, percentEl, start, end, duration, callback) {
  const startTime = Date.now();
  
  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(start + (end - start) * eased);
    
    fillEl.style.width = value + '%';
    percentEl.textContent = value + '%';
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else if (callback) {
      callback();
    }
  }
  update();
}

function renderWelcomeCard(container) {
  const card = SITE_DATA.welcomeCard;
  const separator = container.querySelector('.welcome-separator');
  const rows = container.querySelector('.welcome-rows');

  const data = [
    { label: 'NAME:', value: card.name },
    { label: 'ROLE:', value: card.role },
    { label: 'FIELD:', value: card.field },
    { label: 'FROM:', value: card.location }
  ];

  data.forEach(item => {
    const row = document.createElement('div');
    row.className = 'welcome-row';
    row.innerHTML = `<span class="label">${item.label}</span><span class="value">${item.value}</span>`;
    rows.appendChild(row);
  });
}

// hero animations

function triggerHeroAnimations() {
  const heroTitle = document.getElementById('hero-title');
  if (!heroTitle) return;

  const text = SITE_DATA.profile.heroTitle;
  heroTitle.innerHTML = '';

  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${0.3 + i * 0.06}s`;
    heroTitle.appendChild(span);
  });
}

function initHeroGlitch() {
  setInterval(() => {
    const heroTitle = document.getElementById('hero-title');
    if (!heroTitle || !document.getElementById('main-site').classList.contains('visible')) return;
    
    if (Math.random() > 0.7) {
      heroTitle.classList.add('glitch');
      setTimeout(() => heroTitle.classList.remove('glitch'), 400);
    }
  }, 4000);
}

// navbar

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const sidebar = document.querySelector('.sidebar-nav');
  const sections = document.querySelectorAll('.section, .section-hero');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY;
        if (window.innerWidth > 900 && SmoothScroller.running !== undefined) {
          SmoothScroller.scrollTo(y);
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // close mobile nav
      if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        mobileToggle.classList.remove('open');
      }
    });
  });

  // mobile toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      mobileToggle.classList.toggle('open');
    });
  }

  // active section tracking
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}

// scroll animations

function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  fadeElements.forEach(el => observer.observe(el));
}

// render about

function renderAbout() {
  const container = document.getElementById('about-blocks');
  if (!container) return;

  SITE_DATA.about.forEach((block, i) => {
    const el = document.createElement('div');
    el.className = 'about-block fade-in';
    el.innerHTML = `
      <div class="about-block-label">[ ${block.id} ${block.title} ]</div>
      <div class="about-block-content">${block.content.replace(/\n/g, '<br>')}</div>
    `;
    container.appendChild(el);
  });
}

// render works

function renderWorks() {
  const container = document.getElementById('works-grid');
  if (!container) return;

  SITE_DATA.projects.forEach((project, i) => {
    const card = document.createElement('div');
    card.className = 'work-card fade-in';
    
    const imageContent = project.image 
      ? `<img src="${project.image}" alt="${project.title}" loading="lazy">`
      : `<div class="work-card-placeholder">${project.title}</div>`;

    card.innerHTML = `
      <div class="work-card-image">
        ${imageContent}
      </div>
      <div class="work-card-info">
        <div>
          <div class="work-card-meta">
            <span>${project.year}</span>
            <span>${project.category}</span>
          </div>
          <div class="work-card-title">${project.title}</div>
          <div class="work-card-desc">${project.description}</div>
        </div>
        <div class="work-card-arrow">→</div>
      </div>
    `;

    if (project.link && project.link !== '#') {
      card.addEventListener('click', () => window.open(project.link, '_blank'));
    }

    container.appendChild(card);
  });
}

// render contact

function renderContact() {
  const container = document.getElementById('contact-links');
  if (!container) return;

  SITE_DATA.links.forEach(link => {
    const el = document.createElement('a');
    el.className = 'contact-link';
    el.href = link.url;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
    el.innerHTML = `
      <span>${link.label}</span>
      <span class="contact-link-arrow">→</span>
    `;
    container.appendChild(el);
  });
}
