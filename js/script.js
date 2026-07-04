// ===========================================================
// Career Strategies Group — Site Script
// ===========================================================
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initYear();
    initMobileNav();
    initAccordion();
    initScrollReveal();
    initCounters();
    initProgressBar();
    initBackToTop();
    initActiveNavLink();
    initHeaderShadow();
  });

  function initYear() {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ---------------- Mobile navigation ----------------
  function initMobileNav() {
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    links.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------------- Accordion (FAQ) ----------------
  function initAccordion() {
    var items = document.querySelectorAll('.accordion__item');
    if (!items.length) return;

    items.forEach(function (item) {
      var trigger = item.querySelector('.accordion__trigger');
      if (!trigger) return;

      trigger.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');
        items.forEach(function (other) { other.classList.remove('is-open'); });
        if (!isOpen) item.classList.add('is-open');
      });
    });
  }

  // ---------------- Scroll reveal ----------------
  function initScrollReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 0.08) + 's';
      observer.observe(el);
    });
  }

  // ---------------- Animated counters ----------------
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var animated = new WeakSet();

    function animate(el) {
      if (animated.has(el)) return;
      animated.add(el);

      var target = parseFloat(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1400;
      var start = null;

      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.round(target * eased);
        el.textContent = value + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animate);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  // ---------------- Scroll progress bar ----------------
  function initProgressBar() {
    var bar = document.getElementById('progressBar');
    if (!bar) return;

    function update() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ---------------- Back to top ----------------
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    function toggle() {
      if (window.scrollY > 600) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }

    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
  }

  // ---------------- Active nav link on scroll ----------------
  function initActiveNavLink() {
    var sections = document.querySelectorAll('main section[id], main[id]');
    var links = document.querySelectorAll('.nav-link');
    if (!sections.length || !links.length) return;

    function onScroll() {
      var scrollPos = window.scrollY + 140;
      var currentId = null;

      sections.forEach(function (section) {
        if (section.offsetTop <= scrollPos) {
          currentId = section.getAttribute('id');
        }
      });

      links.forEach(function (link) {
        var href = link.getAttribute('href').replace('#', '');
        link.classList.toggle('is-active', href === currentId);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------------- Header shadow on scroll ----------------
  function initHeaderShadow() {
    var header = document.getElementById('siteHeader');
    if (!header) return;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }
})();
