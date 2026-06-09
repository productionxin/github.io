/* ============================================
   PRODUCTION X — script.js
   productionx.in
   ============================================ */

(function () {
  'use strict';

  // ── NAV SCROLL EFFECT ────────────────────
  const nav = document.getElementById('nav');
  function handleNavScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ── MOBILE MENU ──────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ── SMOOTH SCROLL OFFSET ─────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  // ── INTERSECTION OBSERVER ANIMATIONS ─────
  const fadeEls = document.querySelectorAll(
    '.service-card, .vertical-card, .stat-item, .process-step, .package-card, .credential, .section-header, .about-content, .booking-left'
  );

  fadeEls.forEach(function (el) {
    el.classList.add('fade-up');
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ── BOOKING FORM ──────────────────────────
  const form = document.getElementById('bookingForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const btnText = submitBtn.querySelector('.btn-text');
      const original = btnText.textContent;
      btnText.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Collect form data
      const data = {
        name:    form.name.value.trim(),
        brand:   form.brand.value.trim(),
        phone:   form.phone.value.trim(),
        email:   form.email.value.trim(),
        service: form.service.value,
        budget:  form.budget.value,
        message: form.message.value.trim(),
      };

      // Build WhatsApp message
      const waText = encodeURIComponent(
        'Hi Production X!\n\n' +
        'I\'d like to book a discovery call.\n\n' +
        'Name: ' + data.name + '\n' +
        'Brand: ' + data.brand + '\n' +
        'Phone: ' + data.phone + '\n' +
        'Email: ' + data.email + '\n' +
        'Service: ' + data.service + '\n' +
        'Budget: ' + data.budget + '\n\n' +
        'Message: ' + (data.message || 'N/A')
      );

      // Show success state
      setTimeout(function () {
        form.style.display = 'none';
        formSuccess.classList.add('visible');

        // Open WhatsApp with pre-filled message
        window.open('https://wa.me/919391926846?text=' + waText, '_blank');
      }, 800);
    });
  }

  // ── COUNTER ANIMATION ─────────────────────
  function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = (target / (duration / step));

    const timer = setInterval(function () {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(start) + suffix;
    }, step);
  }

  const statNums = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  if ('IntersectionObserver' in window) {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      const statsObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !countersStarted) {
          countersStarted = true;
          statNums.forEach(function (el) {
            const raw = el.textContent;
            const num = parseInt(raw.replace(/\D/g, ''), 10);
            const suffix = raw.includes('+') ? '<em>+</em>' : '';
            el.innerHTML = '0' + suffix;
            animateCounter(el, num, '');
            setTimeout(function () {
              el.innerHTML = num + (raw.includes('+') ? '<em>+</em>' : '');
            }, 1900);
          });
          statsObserver.disconnect();
        }
      }, { threshold: 0.5 });
      statsObserver.observe(statsSection);
    }
  }

  // ── ACTIVE NAV LINK ON SCROLL ─────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - nav.offsetHeight - 80;
      if (window.scrollY >= sectionTop) {
        current = '#' + section.getAttribute('id');
      }
    });
    navLinkEls.forEach(function (link) {
      link.style.color = link.getAttribute('href') === current ? 'var(--gold)' : '';
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ── CURSOR GRAIN PARALLAX (desktop only) ──
  if (window.matchMedia('(min-width: 1024px)').matches) {
    const grain = document.querySelector('.hero-grain');
    if (grain) {
      document.addEventListener('mousemove', function (e) {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        grain.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      }, { passive: true });
    }
  }

})();
