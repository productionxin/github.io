/* ============================================
   PRODUCTION X PARALLAX — script.js
   productionx.in
   ============================================ */

(function () {
  'use strict';

  var cursor = document.getElementById('cursor');
  var follower = document.getElementById('cursorFollower');
  var followerX = 0, followerY = 0, cursorX = 0, cursorY = 0;

  // ── CUSTOM CURSOR ─────────────────────────
  if (cursor && follower && window.matchMedia('(min-width:769px)').matches) {
    document.addEventListener('mousemove', function(e) {
      cursorX = e.clientX; cursorY = e.clientY;
      cursor.style.left = cursorX + 'px';
      cursor.style.top  = cursorY + 'px';
    }, { passive: true });

    // Smooth follower
    function animateFollower() {
      followerX += (cursorX - followerX) * 0.12;
      followerY += (cursorY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effects
    var hoverEls = document.querySelectorAll('a, button, .pcard-media, .reel-poster, .ptab');
    hoverEls.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', function() {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });
  }

  // ── NAV SCROLL ────────────────────────────
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 80) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── MOBILE NAV ────────────────────────────
  var toggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (toggle) {
    toggle.addEventListener('click', function() {
      var open = navLinks.classList.toggle('open');
      toggle.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        navLinks.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ── SMOOTH SCROLL ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var offset = nav ? nav.offsetHeight + 20 : 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  // ── PARALLAX ENGINE ───────────────────────
  var parallaxEls = [];
  var parallaxTextEls = [];
  var parallaxBgEls = [];

  function initParallax() {
    // Layer parallax (hero layers)
    document.querySelectorAll('[data-parallax]').forEach(function(el) {
      parallaxEls.push({ el: el, speed: parseFloat(el.getAttribute('data-parallax')) });
    });
    // Text parallax (background text)
    document.querySelectorAll('[data-parallax-text]').forEach(function(el) {
      parallaxTextEls.push({ el: el, speed: parseFloat(el.getAttribute('data-parallax-text')) });
    });
  }

  var ticking = false;
  var scrollY = 0;

  function updateParallax() {
    scrollY = window.scrollY;

    // Hero layer parallax
    parallaxEls.forEach(function(item) {
      var rect = item.el.parentElement ? item.el.parentElement.getBoundingClientRect() : null;
      var offset = scrollY * item.speed;
      item.el.style.transform = 'translateY(' + offset + 'px)';
    });

    // Background text parallax
    parallaxTextEls.forEach(function(item) {
      var rect = item.el.getBoundingClientRect();
      var center = rect.top + rect.height / 2 - window.innerHeight / 2;
      var offset = center * item.speed;
      item.el.style.transform = 'translateY(calc(-50% + ' + offset + 'px))';
    });

    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  // ── HERO TEXT REVEAL ──────────────────────
  function initHeroReveal() {
    var words = document.querySelectorAll('.hero-word, .hero-italic');
    words.forEach(function(el) {
      var delay = parseInt(el.getAttribute('data-delay') || 0);
      setTimeout(function() {
        el.style.transition = 'opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 400 + delay);
    });
  }

  // ── SCROLL REVEAL ─────────────────────────
  var revealEls = document.querySelectorAll('.reveal-item');

  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var delay = parseInt(entry.target.getAttribute('data-delay') || 0);
          setTimeout(function() {
            entry.target.classList.add('visible');
          }, delay);
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function(el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function(el) { el.classList.add('visible'); });
  }

  // ── COUNTER ANIMATION ─────────────────────
  var countersStarted = false;
  var statSection = document.querySelector('.stats');

  function animateCount(el, target) {
    var start = 0;
    var dur = 2000;
    var step = 16;
    var inc = target / (dur / step);
    var timer = setInterval(function() {
      start += inc;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = Math.floor(start);
    }, step);
  }

  if (statSection && 'IntersectionObserver' in window) {
    var statObs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        document.querySelectorAll('.stat-n').forEach(function(el) {
          var target = parseInt(el.getAttribute('data-target'));
          animateCount(el, target);
        });
        statObs.disconnect();
      }
    }, { threshold: 0.5 });
    statObs.observe(statSection);
  }

  // ── SHOWREEL PLAYER ───────────────────────
  var playBtn    = document.getElementById('playBtn');
  var reelPoster = document.getElementById('reelPoster');
  var reelEmbed  = document.getElementById('reelEmbed');
  var reelIframe = document.getElementById('reelIframe');

  if (playBtn) {
    function triggerPlay() {
      var src = reelIframe.getAttribute('data-src');
      if (src) {
        reelIframe.setAttribute('src', src);
        reelPoster.style.display = 'none';
        reelEmbed.style.display  = 'block';
      }
    }
    playBtn.addEventListener('click', triggerPlay);
    if (reelPoster) {
      reelPoster.addEventListener('click', function(e) {
        if (!playBtn.contains(e.target)) triggerPlay();
      });
    }
  }

  // ── VIDEO MODAL ───────────────────────────
  var modal       = document.getElementById('videoModal');
  var modalIframe = document.getElementById('modalIframe');
  var modalClose  = document.getElementById('modalClose');
  var modalBg     = document.getElementById('modalBg');

  function openModal(videoId, platform) {
    if (!videoId || videoId.indexOf('YOUR_') === 0) {
      showToast(); return;
    }
    var src = platform === 'vimeo'
      ? 'https://player.vimeo.com/video/' + videoId + '?autoplay=1&color=C9A84C&title=0&byline=0'
      : 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0&modestbranding=1';
    modalIframe.src = src;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modalIframe.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.pcard-media').forEach(function(el) {
    el.addEventListener('click', function() {
      openModal(this.getAttribute('data-video-id'), this.getAttribute('data-platform') || 'youtube');
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBg) modalBg.addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
  });

  // ── TOAST ─────────────────────────────────
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { toast.classList.remove('show'); }, 3500);
  }

  // ── PORTFOLIO FILTER ──────────────────────
  var ptabs = document.querySelectorAll('.ptab');
  var pcards = document.querySelectorAll('.pcard');

  ptabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var filter = this.getAttribute('data-filter');
      ptabs.forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');
      pcards.forEach(function(c) {
        if (filter === 'all' || c.getAttribute('data-category') === filter) {
          c.classList.remove('hidden');
        } else {
          c.classList.add('hidden');
        }
      });
    });
  });

  // ── BOOKING FORM ──────────────────────────
  var bform   = document.getElementById('bookingForm');
  var bsuccess = document.getElementById('formSuccess');
  var submitBtn = document.getElementById('submitBtn');

  if (bform) {
    bform.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = submitBtn.querySelector('.bform-submit') || submitBtn;
      submitBtn.disabled = true;

      var data = {
        name:    bform.name ? bform.name.value.trim() : bform.elements.name.value.trim(),
        brand:   bform.elements.brand.value.trim(),
        phone:   bform.elements.phone.value.trim(),
        email:   bform.elements.email.value.trim(),
        service: bform.elements.service.value,
        budget:  bform.elements.budget.value,
        message: bform.elements.message.value.trim(),
      };

      var waText = encodeURIComponent(
        'Hi Production X!\n\nI\'d like to book a discovery call.\n\n' +
        'Name: ' + data.name + '\nBrand: ' + data.brand +
        '\nPhone: ' + data.phone + '\nEmail: ' + data.email +
        '\nService: ' + data.service + '\nBudget: ' + data.budget +
        '\n\nMessage: ' + (data.message || 'N/A')
      );

      setTimeout(function() {
        bform.style.display = 'none';
        bsuccess.classList.add('visible');
        window.open('https://wa.me/919391926846?text=' + waText, '_blank');
      }, 700);
    });
  }

  // ── ACTIVE NAV HIGHLIGHT ──────────────────
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-link');

  function updateNav() {
    var cur = '';
    sections.forEach(function(s) {
      if (window.scrollY >= s.offsetTop - (nav ? nav.offsetHeight : 80) - 80) {
        cur = '#' + s.id;
      }
    });
    navAnchors.forEach(function(a) {
      a.style.color = a.getAttribute('href') === cur ? 'var(--gold)' : '';
    });
  }
  window.addEventListener('scroll', updateNav, { passive: true });

  // ── INIT ──────────────────────────────────
  initParallax();
  initHeroReveal();
  updateParallax();

})();
