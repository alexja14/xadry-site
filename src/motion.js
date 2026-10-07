// Efectele de navigare: apariția secțiunilor la scroll, meniul care arată secțiunea curentă,
// bara de progres, adâncimea din hero și scroll-ul lin la click pe linkurile #secțiune.
// Cu „reduce motion” din sistem, totul apare direct și scroll-ul sare fără animație.

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function setupMotion({ onSection }) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cleanups = [];

  // 1. Elementele .reveal apar când intră pe ecran (o singură dată).
  //    Cu „reduce motion”, CSS-ul le face doar să se estompeze, fără mișcare.
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());
  }

  // 2. Secțiunea din mijlocul ecranului devine „activă” în meniu.
  const spy = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) onSection(e.target.id);
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main > section[id]').forEach((s) => spy.observe(s));
  cleanups.push(() => spy.disconnect());

  // 3. Bara de progres și hero-ul care se ridică și se estompează la scroll.
  const bar = document.querySelector('.scroll-progress');
  const hero = document.querySelector('.hero-inner');
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar?.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : '0');
    if (hero && !reduce) {
      const k = Math.min(1, y / (window.innerHeight * 0.8));
      hero.style.translate = `0 ${Math.round(y * 0.28)}px`;
      hero.style.opacity = String(1 - k * 0.9);
    }
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
  cleanups.push(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  });

  // 4. Click pe #secțiune: alunecare lină, cu accelerare și frânare. Dacă dai scroll între timp, ne oprim.
  let anim = 0;
  const cancel = () => { cancelAnimationFrame(anim); anim = 0; };
  const navHeight = () => document.querySelector('.nav')?.offsetHeight ?? 0;
  const onClick = (ev) => {
    const a = ev.target.closest('a[href^="#"]');
    if (!a || ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
    const id = a.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    ev.preventDefault();
    const to = id === 'top' ? 0 : Math.max(0, target.getBoundingClientRect().top + window.scrollY - navHeight() - 12);
    history.replaceState(null, '', `#${id}`);
    cancel();
    if (reduce) {
      window.scrollTo({ top: to, behavior: 'instant' });
      return;
    }
    const from = window.scrollY;
    const dist = to - from;
    const duration = Math.min(1100, 450 + Math.abs(dist) * 0.25);
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      window.scrollTo({ top: from + dist * easeInOutCubic(t), behavior: 'instant' });
      anim = t < 1 ? requestAnimationFrame(step) : 0;
    };
    anim = requestAnimationFrame(step);
  };
  document.addEventListener('click', onClick);
  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchstart', cancel, { passive: true });
  window.addEventListener('keydown', cancel);
  cleanups.push(() => {
    cancel();
    document.removeEventListener('click', onClick);
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
    window.removeEventListener('keydown', cancel);
  });

  return () => cleanups.forEach((fn) => fn());
}
