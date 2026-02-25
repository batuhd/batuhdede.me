document.addEventListener('DOMContentLoaded', async () => {
  await initFirebase();
  initIntro();
  initSmoothScroll();
  initNavigation();
  initHeroButtons();
  initHeroGlitch();
  initBackgroundVideo();
  renderAbout();
  renderWorks();
  renderBlog();
  renderContact();
  initContactForm();
  initScrollAnimations();
});

// hero buttons

function initHeroButtons() {
  const resumeBtn = document.getElementById('resume-link');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (SITE_DATA.resumeURL) {
        window.open(SITE_DATA.resumeURL, '_blank');
      }
    });
  }
}

// firebase

let firebaseDB = null;

async function initFirebase() {
  let config = null;

  // try loading from Vercel serverless function
  try {
    const res = await fetch('/api/config');
    if (res.ok) config = await res.json();
  } catch (e) { /* /api/config not available (local dev) */ }

  // fallback to data.js (for local development)
  if (!config && SITE_DATA.firebase) config = SITE_DATA.firebase;

  if (!config || !config.apiKey) {
    console.warn('Firebase config not available');
    return;
  }

  try {
    firebase.initializeApp(config);
    firebaseDB = firebase.database();
  } catch (e) {
    console.warn('Firebase init failed:', e.message);
  }
}

// youtube

let ytPlayer = null;
let isMobile = window.innerWidth <= 900;
let videoOn = !isMobile;
let soundOn = false;

function initBackgroundVideo() {
  const videoToggle = document.getElementById('video-toggle');
  const soundToggle = document.getElementById('sound-toggle');
  const container = document.getElementById('bg-video-container');

  // mobile: start with video off
  if (isMobile) {
    videoToggle.textContent = 'Video: Off';
    videoToggle.classList.remove('active');
    container.classList.add('hidden');
  }

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);

  window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('bg-video-player', {
      width: '100%',
      height: '100%',
      videoId: 'sAkVnhthpMI',
      playerVars: {
        autoplay: isMobile ? 0 : 1,
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
          if (!isMobile) {
            event.target.playVideo();
          }
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
  const video = document.getElementById('intro-video');

  if (!overlay) return;

  // play intro video
  if (video) {
    video.play().catch(() => {});
  }

  // auto-dismiss after 2 seconds
  const autoDismiss = setTimeout(() => dismissIntro(), 2000);

  // skip button
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      clearTimeout(autoDismiss);
      dismissIntro();
    });
  }

  function dismissIntro() {
    overlay.classList.add('hidden');
    if (skipBtn) {
      skipBtn.style.opacity = '0';
      skipBtn.style.pointerEvents = 'none';
    }

    setTimeout(() => {
      document.getElementById('main-site').classList.add('visible');
      triggerHeroAnimations();
      if (skipBtn && skipBtn.parentNode) skipBtn.remove();
    }, 300);

    setTimeout(() => {
      if (overlay.parentNode) overlay.remove();
      if (video) { video.pause(); video.src = ''; }
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
      const href = link.getAttribute('href');

      // page links (*.html) — let browser navigate normally
      if (href.endsWith('.html')) return;

      // scroll links (#section) — prevent default and scroll
      e.preventDefault();
      const targetId = href.substring(1);
      const target = document.getElementById(targetId);

      // update active nav
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

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
          const href = link.getAttribute('href');
          if (href.startsWith('#')) {
            link.classList.toggle('active', href === '#' + id);
          }
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

  // try Firebase first, fallback to data.js
  if (firebaseDB) {
    const projectsRef = firebaseDB.ref('projects');
    projectsRef.orderByChild('timestamp').on('value', (snapshot) => {
      const fbProjects = [];
      snapshot.forEach(child => {
        fbProjects.push(child.val());
      });
      fbProjects.reverse();

      // combine: Firebase projects first, then data.js projects
      const allProjects = [...fbProjects, ...SITE_DATA.projects];
      renderProjectCards(container, allProjects);
    });
  } else {
    renderProjectCards(container, SITE_DATA.projects);
  }
}

function renderProjectCards(container, projects) {
  container.innerHTML = '';

  projects.forEach((project, i) => {
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
            <span>${project.year || ''}</span>
            <span>${project.category || ''}</span>
          </div>
          <div class="work-card-title">${project.title}</div>
          <div class="work-card-desc">${project.description || ''}</div>
        </div>
        <div class="work-card-arrow">→</div>
      </div>
    `;

    if (project.link && project.link !== '#') {
      card.addEventListener('click', () => window.open(project.link, '_blank'));
    }

    container.appendChild(card);
  });

  initScrollAnimations();
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

// contact form

function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.contact-submit');
    btn.textContent = '[ SENDING... ]';
    btn.disabled = true;
    status.textContent = '';
    status.className = 'form-status';

    try {
      const res = await fetch(SITE_DATA.contact.formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: form.name.value,
          email: form.email.value,
          message: form.message.value
        })
      });

      if (res.ok) {
        status.textContent = '> Message sent successfully.';
        status.classList.add('success');
        form.reset();
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      status.textContent = '> Error sending message. Try again.';
      status.classList.add('error');
    }

    btn.textContent = '[ SEND ]';
    btn.disabled = false;
  });
}

// blog (firebase)

function renderBlog() {
  const container = document.getElementById('blog-grid');
  if (!container || !firebaseDB) {
    if (container) {
      container.innerHTML = '<div class="blog-empty">No posts yet.</div>';
    }
    return;
  }

  const postsRef = firebaseDB.ref('posts');
  postsRef.orderByChild('timestamp').on('value', (snapshot) => {
    container.innerHTML = '';
    const posts = [];

    snapshot.forEach((child) => {
      posts.push({ id: child.key, ...child.val() });
    });

    // newest first
    posts.reverse();

    if (posts.length === 0) {
      container.innerHTML = '<div class="blog-empty">No posts yet.</div>';
      return;
    }

    posts.forEach((post) => {
      const card = document.createElement('div');
      card.className = 'blog-card fade-in';

      const date = new Date(post.timestamp).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });

      const tags = post.tags ? post.tags.map(t => `<span class="blog-tag">${t}</span>`).join('') : '';

      card.innerHTML = `
        <div class="blog-card-date">${date}</div>
        <div class="blog-card-title">${post.title}</div>
        <div class="blog-card-summary">${post.summary || ''}</div>
        <div class="blog-card-tags">${tags}</div>
        <div class="blog-card-read">READ MORE →</div>
      `;

      card.addEventListener('click', () => openBlogModal(post, date));
      container.appendChild(card);
    });

    // re-observe new fade-in elements
    initScrollAnimations();
  });
}

function openBlogModal(post, dateStr) {
  const modal = document.getElementById('blog-modal');
  const title = document.getElementById('blog-modal-title');
  const meta = document.getElementById('blog-modal-meta');
  const body = document.getElementById('blog-modal-body');

  title.textContent = post.title;
  meta.textContent = dateStr + (post.tags ? ' — ' + post.tags.join(', ') : '');
  body.innerHTML = post.content ? post.content.replace(/\n/g, '<br>') : '';

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // close handlers
  const closeBtn = modal.querySelector('.blog-modal-close');
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  closeBtn.onclick = closeModal;
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', esc);
    }
  });
}
