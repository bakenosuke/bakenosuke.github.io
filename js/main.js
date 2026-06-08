(function () {
  'use strict';

  var MAX_YEARS = 18;

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

  // ── Mobile nav toggle ─────────────────────────────────────
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
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

  // ── Progress bars (set immediately) ──────────────────────
  function animateProgressBars() {
    document.querySelectorAll('.progress-bar[data-width]').forEach(function (bar) {
      bar.style.width = bar.dataset.width;
      if (bar.dataset.left) bar.style.left = bar.dataset.left;
      bar.setAttribute('aria-valuenow', parseFloat(bar.dataset.width));
    });
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

  // ── Experience bar widths (driven by tenure duration) ─────
  function initExperienceBars() {
    var CAREER_START = new Date('2008-06-01');
    var NOW = new Date();
    var totalMs = NOW - CAREER_START;

    document.querySelectorAll('article.experience').forEach(function (article) {
      var bar = article.querySelector('.experience-level-bar .progress-bar');
      if (!bar) return;

      var times = article.querySelectorAll('.experience-dates time[datetime]');
      if (!times.length) return;

      var start = new Date(times[0].getAttribute('datetime') + '-01');
      var end = times[1] ? new Date(times[1].getAttribute('datetime') + '-01') : NOW;

      var leftPct  = Math.max(0, Math.min(((start - CAREER_START) / totalMs) * 100, 100));
      var widthPct = Math.max(0, Math.min(((end - start) / totalMs) * 100, 100 - leftPct));

      bar.dataset.left  = leftPct.toFixed(2) + '%';
      bar.dataset.width = widthPct.toFixed(2) + '%';
      bar.title = times[0].textContent.trim() + ' \u2013 ' +
                  (times[1] ? times[1].textContent.trim() : 'Present');
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
    var sections = document.querySelectorAll('main > section[id], header[id]');
    var navAnchors = document.querySelectorAll('#site-nav .nav-links a[href^="#"]');
    if (!navAnchors.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(function (a) {
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
    initExperienceBars();
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
