/* =====================================================
   RACINES — script.js
   Vanilla JS, zéro dépendance runtime fragile
   ===================================================== */

/* ─── 1. INIT AOS (Gastro : 1200ms, ease-out) ──────── */
AOS.init({
  once:     true,
  duration: 1200,
  easing:   'ease-out',
  offset:   80
});

/* ─── 2. NAV scroll transparent → solid ────────────── */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('nav--scrolled', window.scrollY > 60);
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ─── 3. BURGER MENU ────────────────────────────────── */
(function () {
  const burger   = document.querySelector('.nav-burger');
  const navMobile = document.getElementById('nav-mobile');
  const closeBtn  = document.getElementById('nav-close');
  if (!burger || !navMobile) return;

  const open  = () => { burger.setAttribute('aria-expanded','true');  navMobile.hidden = false; document.body.style.overflow = 'hidden'; };
  const close = () => { burger.setAttribute('aria-expanded','false'); navMobile.hidden = true;  document.body.style.overflow = ''; };

  burger.addEventListener('click', () => {
    burger.getAttribute('aria-expanded') === 'true' ? close() : open();
  });
  closeBtn?.addEventListener('click', close);
  navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  // Fermer à l'appui sur Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ─── 4. ANNÉE FOOTER ───────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── 5. PARALLAX HERO scroll-based ─────────────────── */
(function () {
  const heroImage   = document.querySelector('.hero-image');
  const heroSection = document.querySelector('.hero-full');
  if (!heroImage || !heroSection) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  const update = () => {
    const scrollY     = window.scrollY;
    const heroHeight  = heroSection.offsetHeight;
    if (scrollY < heroHeight) {
      heroImage.style.transform = `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.00025})`;
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();

/* ─── 6. COMPTEURS ANIMÉS ───────────────────────────── */
(function () {
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const duration = parseInt(el.dataset.duration) || 1800;
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const isInt    = Number.isInteger(target);
    const start    = performance.now();

    (function frame(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);
      const val      = target * eased;
      el.textContent = prefix + (isInt ? Math.round(val) : val.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    })(performance.now());
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.counter[data-target]').forEach(el => {
    el.textContent = (el.dataset.prefix || '') + '0' + (el.dataset.suffix || '');
    obs.observe(el);
  });
})();

/* ─── 7. REVEAL MOTS PAR MOT ────────────────────────── */
(function () {
  document.querySelectorAll('.reveal-words').forEach(el => {
    const words = el.textContent.trim().split(/(\s+)/);
    el.innerHTML = words.map((w, i) => {
      if (/^\s+$/.test(w)) return w;
      return `<span class="word" style="--i:${i}">${w}</span>`;
    }).join('');
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.reveal-words').forEach(el => obs.observe(el));
})();

/* ─── 8. GALERIE — caption depuis alt ──────────────── */
document.querySelectorAll('.galerie .img-with-fallback').forEach(pic => {
  const img = pic.querySelector('img');
  if (img?.alt) pic.setAttribute('data-caption', img.alt);
});

/* ─── 9. GALERIE — filtres + voir plus/moins ────────── */
(function () {
  const galerieGrid   = document.getElementById('galerie-grid');
  const seeMoreTrigger = document.querySelector('.see-more-trigger');
  const filtreButtons  = document.querySelectorAll('.galerie-filtres button');
  const galerieItems   = document.querySelectorAll('#galerie-grid > [data-cat]');
  const seeLessBtn     = document.querySelector('.galerie-less');
  if (!galerieGrid) return;

  galerieGrid.dataset.filter = 'all';

  // Filtres
  filtreButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filtre = btn.dataset.filtre;
      filtreButtons.forEach(b => b.classList.remove('actif'));
      btn.classList.add('actif');
      galerieGrid.dataset.filter = filtre;

      // Filtres non-"tout" : auto-expand
      if (filtre !== 'all') galerieGrid.classList.add('expanded');

      galerieItems.forEach(item => {
        item.style.display = (filtre === 'all' || item.dataset.cat === filtre) ? '' : 'none';
      });
    });
  });

  // Trigger "Voir plus"
  if (seeMoreTrigger) {
    seeMoreTrigger.setAttribute('role', 'button');
    seeMoreTrigger.setAttribute('tabindex', '0');
    seeMoreTrigger.setAttribute('aria-label', 'Voir toutes les photos');

    const expand = e => {
      if (galerieGrid.classList.contains('expanded')) return;
      e?.preventDefault();
      e?.stopPropagation();
      galerieGrid.classList.add('expanded');
    };

    seeMoreTrigger.addEventListener('click', expand, true);
    seeMoreTrigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') expand(e);
    });
  }

  // "Voir moins"
  seeLessBtn?.addEventListener('click', () => {
    galerieGrid.classList.remove('expanded');
    const section = document.getElementById('galerie');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

/* ─── 10. LIGHTBOX ──────────────────────────────────── */
(function () {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCap = document.getElementById('lightbox-caption');
  const closeBtn    = document.getElementById('lightbox-close');
  const prevBtn     = document.getElementById('lightbox-prev');
  const nextBtn     = document.getElementById('lightbox-next');
  if (!lightbox) return;

  // Collecter toutes les photos de la galerie (dans l'ordre DOM)
  const getItems = () => [...document.querySelectorAll('#galerie-grid .img-with-fallback:not([style*="display: none"]) img')];
  let currentIdx = 0;

  const show = idx => {
    const items = getItems();
    if (!items.length) return;
    currentIdx = (idx + items.length) % items.length;
    const img = items[currentIdx];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCap.textContent = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lightboxImg.focus();
  };

  const hide = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Ouvrir au clic sur une photo
  document.getElementById('galerie-grid')?.addEventListener('click', e => {
    const pic = e.target.closest('.img-with-fallback');
    if (!pic || pic.classList.contains('see-more-trigger') && !document.getElementById('galerie-grid').classList.contains('expanded')) return;
    const items = getItems();
    const img   = pic.querySelector('img');
    const idx   = items.indexOf(img);
    if (idx !== -1) show(idx);
  });

  closeBtn?.addEventListener('click', hide);
  prevBtn?.addEventListener('click', () => show(currentIdx - 1));
  nextBtn?.addEventListener('click', () => show(currentIdx + 1));

  // Fermer fond ou Esc
  lightbox.addEventListener('click', e => { if (e.target === lightbox) hide(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      hide();
    if (e.key === 'ArrowLeft')   show(currentIdx - 1);
    if (e.key === 'ArrowRight')  show(currentIdx + 1);
  });
})();

/* ─── 11. MENU — filtres par catégorie ─────────────── */
(function () {
  const catBtns   = document.querySelectorAll('.menu-cat-btn');
  const sections  = document.querySelectorAll('.menu-section-block[data-section]');
  if (!catBtns.length) return;

  function appliquerFiltre(cat) {
    sections.forEach(sec => {
      sec.hidden = !(cat === 'all' || sec.dataset.section === cat);
    });
  }

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('actif'));
      btn.classList.add('actif');
      appliquerFiltre(btn.dataset.cat);
    });
  });

  // Filtre par défaut au chargement (le bouton .actif, "Entrées") :
  // n'affiche qu'une catégorie à la fois pour garder le menu compact.
  const btnDefaut = document.querySelector('.menu-cat-btn.actif') || catBtns[0];
  if (btnDefaut) appliquerFiltre(btnDefaut.dataset.cat);
})();

/* ─── 12. MENU LIFT — CSS seul, pas de JS ───────────── */
// (géré par CSS .menu-item:hover — voir styles.css)
