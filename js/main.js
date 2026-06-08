(function () {
  'use strict';

  var MAX_YEARS = 20;

  // ── Theme ────────────────────────────────────────────────
  var themeToggle = document.getElementById('theme-toggle');
  var stored = localStorage.getItem('theme');
  if (stored) document.documentElement.setAttribute('data-theme', stored);

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function setThemeIcon() {
    if (!themeToggle) return;
    themeToggle.textContent = currentTheme() === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label',
      currentTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  if (themeToggle) {
    setThemeIcon();
    themeToggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      setThemeIcon();
    });
  }

  // ── Tech tag pills ────────────────────────────────────────
  function buildTechTags() {
    document.querySelectorAll('.tech-tags-source').forEach(function (el) {
      var raw = el.textContent.trim();
      var container = document.createElement('div');
      container.className = 'tech-tags';
      raw.split(',').forEach(function (t) {
        var tag = t.trim().replace(/,$/, '');
        if (!tag) return;
        var span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = tag;
        container.appendChild(span);
      });
      el.parentNode.replaceChild(container, el);
    });
  }

  // ── Progress bars (IntersectionObserver) ─────────────────
  function animateProgressBars() {
    var bars = document.querySelectorAll('.progress-bar[data-width]');
    if (!bars.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          bar.style.width = bar.dataset.width;
          bar.setAttribute('aria-valuenow', parseFloat(bar.dataset.width));
          io.unobserve(bar);
        }
      });
    }, { threshold: 0.1 });

    bars.forEach(function (bar) { io.observe(bar); });
  }

  // ── Skill bar widths ──────────────────────────────────────
  function initSkillBars() {
    document.querySelectorAll('.skill').forEach(function (skill) {
      var levelEl = skill.querySelector('.skill-level');
      var bar = skill.querySelector('.progress-bar');
      if (!levelEl || !bar) return;
      var match = (levelEl.textContent || '').match(/(\d+(?:\.\d+)?)/);
      if (!match) return;
      var pct = Math.min((parseFloat(match[1]) / MAX_YEARS) * 100, 100);
      bar.dataset.width = pct.toFixed(2) + '%';
      bar.title = match[1] + ' Years';
    });
  }

  // ── Scroll-reveal ─────────────────────────────────────────
  function initReveal() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }

  // ── Back-to-top ───────────────────────────────────────────
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Active nav link on scroll ─────────────────────────────
  function initNavHighlight() {
    var sections = document.querySelectorAll('section[id], div[id]');
    var navLinks = document.querySelectorAll('#site-nav .nav-links a[href^="#"]');
    if (!navLinks.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(function (s) { io.observe(s); });
  }

  // ── Boot ──────────────────────────────────────────────────
  function init() {
    buildTechTags();
    initSkillBars();
    animateProgressBars();
    initReveal();
    initBackToTop();
    initNavHighlight();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
