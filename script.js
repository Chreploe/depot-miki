/* ============================================================
   DEPOT MIKI BALIKPAPAN — script.js
   Features:
     - Sticky navbar
     - Hamburger menu toggle
     - Active nav link on scroll
     - Fade-in on scroll (IntersectionObserver)
     - Contact form → opens WhatsApp
     - Menu slider with category filter tabs
   ============================================================ */

'use strict';

// ─────────────────────────────────────────────
// CONFIG — update to the real WhatsApp number
// ─────────────────────────────────────────────
const WA_NUMBER = '628115911077'; // e.g. 628123456789

// ─────────────────────────────────────────────
// 1. DOM REFERENCES
// ─────────────────────────────────────────────
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navMenu     = document.getElementById('navMenu');
const navLinks    = document.querySelectorAll('.nav-link');
const sections    = document.querySelectorAll('section[id]');
const fadeEls     = document.querySelectorAll('.fade-in');
const contactForm = document.getElementById('contactForm');

// ─────────────────────────────────────────────
// 2. STICKY NAVBAR
// ─────────────────────────────────────────────
function handleNavbarScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

// ─────────────────────────────────────────────
// 3. HAMBURGER MENU
// ─────────────────────────────────────────────
function openMenu() {
  navMenu.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  navMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  navMenu.classList.contains('open') ? closeMenu() : openMenu();
});
navLinks.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', (e) => {
  if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== hamburger) {
    closeMenu();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// ─────────────────────────────────────────────
// 4. ACTIVE NAV LINK ON SCROLL
// ─────────────────────────────────────────────
const NAV_HEIGHT = 80;

function updateActiveLink() {
  let current = '';
  const scrollPos = window.scrollY + NAV_HEIGHT + 5;
  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href').replace('#', '') === current);
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// ─────────────────────────────────────────────
// 5. FADE-IN ON SCROLL
// ─────────────────────────────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -60px 0px', threshold: 0.12 });

fadeEls.forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.08}s`;
  fadeObserver.observe(el);
});

// ─────────────────────────────────────────────
// 6. CONTACT FORM → OPEN WHATSAPP
// ─────────────────────────────────────────────
const fields = {
  name: {
    el: document.getElementById('name'),
    errorEl: document.getElementById('nameError'),
    validate(v) {
      if (!v.trim()) return 'Please enter your full name.';
      if (v.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    }
  },
  phone: {
    el: document.getElementById('phone'),
    errorEl: document.getElementById('phoneError'),
    validate(v) {
      if (!v.trim()) return 'Please enter your phone number.';
      const digits = v.replace(/\D/g, '');
      if (digits.length < 6 || digits.length > 15) return 'Enter a valid phone number.';
      return '';
    }
  },
  message: {
    el: document.getElementById('message'),
    errorEl: document.getElementById('messageError'),
    validate(v) {
      if (!v.trim()) return 'Please write a message.';
      if (v.trim().length < 5) return 'Message is too short.';
      return '';
    }
  }
};

function setFieldError(key, msg) {
  const { el, errorEl } = fields[key];
  el.classList.toggle('error', !!msg);
  errorEl.textContent = msg;
}

Object.keys(fields).forEach(key => {
  const { el, validate } = fields[key];
  el.addEventListener('blur',  () => setFieldError(key, validate(el.value)));
  el.addEventListener('input', () => { if (el.classList.contains('error')) setFieldError(key, validate(el.value)); });
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let valid = true;
  Object.keys(fields).forEach(key => {
    const err = fields[key].validate(fields[key].el.value);
    setFieldError(key, err);
    if (err) valid = false;
  });
  if (!valid) return;

  const name    = fields.name.el.value.trim();
  const phone   = fields.phone.el.value.trim();
  const message = fields.message.el.value.trim();

  const waText = [
    `Halo Depot Miki!`,
    ``,
    `Nama  : ${name}`,
    `Telpon: ${phone}`,
    ``,
    `Pesan:`,
    message
  ].join('\n');

  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;

  const btn     = document.getElementById('submitBtn');
  const btnText = btn.querySelector('.btn-text');
  const prev    = btnText.textContent;

  btnText.textContent = 'Opening WhatsApp…';
  btn.disabled = true;

  setTimeout(() => {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    btnText.textContent = prev;
    btn.disabled = false;
    contactForm.reset();
  }, 600);
});

// ─────────────────────────────────────────────
// 7. SMOOTH SCROLL
// ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT, behavior: 'smooth' });
  });
});

// ─────────────────────────────────────────────
// 8. HERO ENTRANCE ANIMATION
// ─────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;
  heroContent.style.cssText = 'opacity:0;transform:translateY(30px);transition:opacity .9s ease,transform .9s ease';
  requestAnimationFrame(() => {
    setTimeout(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 150);
  });
});

// ─────────────────────────────────────────────
// 9. MENU SLIDER + CATEGORY FILTER
// ─────────────────────────────────────────────
(function initMenuSlider() {
  const grid      = document.getElementById('menuGrid');
  const viewport  = document.getElementById('menuViewport');
  const prevBtn   = document.getElementById('menuPrev');
  const nextBtn   = document.getElementById('menuNext');
  const dotsWrap  = document.getElementById('sliderDots');
  const filterBar = document.getElementById('menuFilterTabs');
  if (!grid || !viewport || !prevBtn || !nextBtn) return;

  const allCards = Array.from(grid.querySelectorAll('.menu-card'));
  const CARD_GAP = 28; // keep in sync with CSS gap: 1.75rem ≈ 28px
  let currentIdx = 0;

  /* ── Responsive breakpoints ── */
  function getItemsPerView() {
    const w = window.innerWidth;
    if (w >= 1024) return 4;
    if (w >=  700) return 2;
    return 1;
  }

  /* ── Only visible (non-hidden) cards ── */
  function visibleCards() {
    return allCards.filter(c => !c.classList.contains('hidden'));
  }

  function getMaxIndex() {
    return Math.max(0, visibleCards().length - getItemsPerView());
  }

  function cardWidth() {
    const ipv = getItemsPerView();
    return (viewport.clientWidth - CARD_GAP * (ipv - 1)) / ipv;
  }

  /* ── Sizing: only size visible cards ── */
  function sizeCards() {
    const w = cardWidth();
    visibleCards().forEach(c => {
      c.style.width    = w + 'px';
      c.style.minWidth = w + 'px';
      c.style.maxWidth = w + 'px';
    });
  }

  /* ── Dots ── */
  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = getMaxIndex() + 1;
    for (let i = 0; i < total; i++) {
      const btn = document.createElement('button');
      btn.className = 'slider-dot' + (i === currentIdx ? ' active' : '');
      btn.setAttribute('aria-label', `Halaman ${i + 1}`);
      btn.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(btn);
    }
  }

  function refreshDots() {
    dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentIdx);
    });
  }

  /* ── Navigation ── */
  function goTo(idx) {
    currentIdx = Math.max(0, Math.min(idx, getMaxIndex()));
    const offset = currentIdx * (cardWidth() + CARD_GAP);
    grid.style.transform = `translateX(-${offset}px)`;
    prevBtn.disabled = currentIdx <= 0;
    nextBtn.disabled = currentIdx >= getMaxIndex();
    refreshDots();
  }

  prevBtn.addEventListener('click', () => goTo(currentIdx - 1));
  nextBtn.addEventListener('click', () => goTo(currentIdx + 1));

  /* ── Keyboard ── */
  viewport.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(currentIdx - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIdx + 1); }
  });

  /* ── Touch swipe ── */
  let touchStartX = 0, touchStartY = 0;
  viewport.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 45 && Math.abs(dx) > dy) {
      dx > 0 ? goTo(currentIdx + 1) : goTo(currentIdx - 1);
    }
  }, { passive: true });

  /* ── Category filter ── */
  function applyFilter(cat) {
    // Show/hide cards by category
    allCards.forEach(c => {
      const match = cat === 'all' || c.dataset.category === cat;
      c.classList.toggle('hidden', !match);
    });

    // Reset strip instantly (no animation glitch on filter change)
    grid.style.transition = 'none';
    grid.style.transform  = 'translateX(0)';

    requestAnimationFrame(() => {
      currentIdx = 0;
      grid.style.transition = '';
      sizeCards();
      buildDots();
      goTo(0);
    });
  }

  if (filterBar) {
    filterBar.querySelectorAll('.filter-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.cat);
      });
    });
  }

  /* ── Init & resize ── */
  function init() {
    sizeCards();
    buildDots();
    goTo(0);
  }

  init();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (currentIdx > getMaxIndex()) currentIdx = getMaxIndex();
      sizeCards();
      buildDots();
      goTo(currentIdx);
    }, 150);
  });
})();
