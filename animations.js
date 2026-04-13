/* ============================================================
   FasoSmart — Shared Animation & Interaction Script
   ============================================================ */

(function () {
  'use strict';

  /* ===== NAV: Shadow on scroll ===== */
  var header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('nav-scrolled', window.scrollY > 24);
    }, { passive: true });
  }

  /* ===== MOBILE MENU TOGGLE ===== */
  window.toggleMobileMenu = function () {
    var menu = document.getElementById('mobile-menu');
    var btn  = document.getElementById('mobile-menu-btn');
    if (!menu) return;
    var closing = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    if (btn) {
      var icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = closing ? 'menu' : 'close';
    }
  };

  /* ===== SCROLL REVEAL ===== */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    .forEach(function (el) { revealObserver.observe(el); });

  /* ===== ANIMATED COUNTERS ===== */
  function animateCounter(el) {
    var rawTarget  = el.dataset.counterTarget;
    var suffix     = el.dataset.counterSuffix  || '';
    var prefix     = el.dataset.counterPrefix  || '';
    var target     = parseFloat(rawTarget);
    var isDecimal  = rawTarget.indexOf('.') !== -1;
    var duration   = 1800;
    var startTime  = null;

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var val = easeOutCubic(progress) * target;
      el.textContent = prefix + (isDecimal ? val.toFixed(1) : Math.round(val)) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + rawTarget + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-counter-target]')
    .forEach(function (el) { counterObserver.observe(el); });

  /* ===== STAGGER: auto-assign stagger classes to grid children ===== */
  document.querySelectorAll('[data-stagger]').forEach(function (parent) {
    var children = parent.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    children.forEach(function (child, i) {
      child.classList.add('stagger-' + Math.min(i + 1, 6));
    });
  });

  /* ===== PARALLAX: subtle hero background ===== */
  var heroBlob = document.querySelector('.hero-blob');
  if (heroBlob) {
    window.addEventListener('scroll', function () {
      heroBlob.style.transform = 'translateY(' + (window.scrollY * 0.15) + 'px)';
    }, { passive: true });
  }

})();
