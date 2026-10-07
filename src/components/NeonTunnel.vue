<script setup>
// Fundalul din videoul bannerului XADRY (xadry-banner/xadry_banner.py), pe tot site-ul:
// tunel cu grilă cyan pe podea și tavan, rame magenta pe pereți care vin spre tine, particule care urcă
// și dâre de lumină orizontale. Aceiași parametri ca în video (STEP, ZMIN, ZFAR, XW, o ramă la 2 secunde).
// Liniile lungi ale tunelului sunt fixe, deci le desenăm o singură dată pe un strat separat.
// Când derulezi repede, tunelul accelerează („warp”). Cu „reduce motion” rămâne un cadru static.
import { onBeforeUnmount, onMounted, ref } from 'vue';

const STEP = 0.37;
const ZMIN = 0.75;
const ZFAR = 9;
const XW = 2.3;
const RING_SECONDS = 2;
const GRID = '54, 192, 250'; // cyan amestecat cu puțin albastru, ca în video
const MAG = '201, 75, 255';
const CYAN = '61, 224, 255';

const canvas = ref(null);
let ctx = null;
let layer = null; // stratul static cu liniile longitudinale
let w = 0;
let h = 0;
let dpr = 1;
let raf = 0;
let particles = [];
let streaks = [];
let travel = 0; // câte rame au trecut de la pornire (continuu)
let clock = 0; // timpul pentru particule și dâre
let speed = 1;
let lastFrame = 0;
let lastScrollY = 0;
let lastScrollAt = 0;
let warpTarget = 1;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const fade = (z) => Math.pow(Math.max(0, Math.min(1, 1 - (z - 1) / (ZFAR - 1))), 1.5);
const rand = (a, b) => a + Math.random() * (b - a);

function buildLayer() {
  layer = document.createElement('canvas');
  layer.width = Math.round(w * dpr);
  layer.height = Math.round(h * dpr);
  const l = layer.getContext('2d');
  l.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cx = w / 2;
  const cy = h / 2;
  const k = h / 2;
  const n = Math.floor(XW / STEP);
  const zs = Array.from({ length: 18 }, (_, i) => ZMIN + ((ZFAR - ZMIN) * i) / 17);
  const pass = (width, mult) => {
    l.lineWidth = width;
    for (let i = -n; i <= n; i++) {
      const xw = i * STEP;
      for (let j = 0; j < zs.length - 1; j++) {
        const za = zs[j];
        const zb = zs[j + 1];
        const a = fade((za + zb) / 2) * mult;
        if (a < 0.004) continue;
        l.strokeStyle = `rgba(${GRID}, ${a})`;
        for (const sgn of [1, -1]) {
          l.beginPath();
          l.moveTo(cx + (k * xw) / za, cy + (sgn * k) / za);
          l.lineTo(cx + (k * xw) / zb, cy + (sgn * k) / zb);
          l.stroke();
        }
      }
    }
  };
  pass(5, 0.12); // strălucire
  pass(1.2, 0.5); // linia
}

function seed() {
  const area = (w * h) / (1920 * 1080);
  particles = Array.from({ length: Math.round(40 + 70 * Math.min(1.4, area)) }, () => ({
    x: rand(0, w), y: rand(0, h), s: rand(0.8, 2.4), m: Math.random() < 0.5 ? 1 : 2,
    mag: Math.random() < 0.45, ph: Math.random(), tw: 1 + Math.floor(rand(0, 3)), dx: rand(-18, 18),
  }));
  const bands = [[0.14, 0.33], [0.67, 0.87]];
  streaks = Array.from({ length: 7 }, (_, i) => {
    const [a, b] = bands[i % 2];
    return { y: rand(a, b) * h, len: rand(0.14, 0.32) * w, k: Math.random() < 0.5 ? 1 : 2, ph: Math.random(), mag: Math.random() < 0.5 };
  });
}

function resize() {
  const el = canvas.value;
  if (!el) return;
  dpr = Math.min(1.5, window.devicePixelRatio || 1);
  w = el.clientWidth;
  h = el.clientHeight;
  el.width = Math.round(w * dpr);
  el.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  buildLayer();
  seed();
  draw();
}

function line(x1, y1, x2, y2, rgb, a) {
  ctx.strokeStyle = `rgba(${rgb}, ${a * 0.22})`;
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.strokeStyle = `rgba(${rgb}, ${a})`;
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}

function draw() {
  const cx = w / 2;
  const cy = h / 2;
  const k = h / 2;
  // Sus (în hero) tunelul e la intensitate maximă; mai jos se estompează, ca textul să se citească.
  const intensity = 1 - 0.5 * Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
  ctx.clearRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.55);
  glow.addColorStop(0, `rgba(${MAG}, ${0.16 * intensity})`);
  glow.addColorStop(0.45, `rgba(255, 0, 153, ${0.05 * intensity})`);
  glow.addColorStop(1, 'rgba(9, 18, 29, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.globalAlpha = intensity;
  if (layer) ctx.drawImage(layer, 0, 0, w, h);
  ctx.globalAlpha = 1;

  // Ramele tunelului: se apropie continuu; fiecare a treia are pereți magenta.
  const phase = travel % 1;
  const cycles = Math.floor(travel);
  ctx.lineCap = 'round';
  for (let kk = 0; kk < 60; kk++) {
    const z = ZMIN + (kk + 1 - phase) * STEP;
    if (z > ZFAR) break;
    const a = fade(z) * intensity;
    if (a < 0.01) continue;
    const xl = cx - (k * XW) / z;
    const xr = cx + (k * XW) / z;
    const yt = cy - k / z;
    const yb = cy + k / z;
    line(xl, yb, xr, yb, GRID, a * 0.55);
    line(xl, yt, xr, yt, GRID, a * 0.55);
    if ((kk + cycles) % 3 === 2) {
      line(xl, yt, xl, yb, MAG, a * 0.45);
      line(xr, yt, xr, yb, MAG, a * 0.45);
    }
  }

  // Particule care urcă, se leagănă și sclipesc.
  const T = 10; // bucla din video
  for (const p of particles) {
    const y = (((p.y - (p.m * h * clock) / T) % h) + h) % h;
    const x = p.x + p.dx * Math.sin(2 * Math.PI * (clock / T + p.ph));
    const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(2 * Math.PI * ((p.tw * clock) / T + p.ph)));
    const rgb = p.mag ? MAG : CYAN;
    ctx.fillStyle = `rgba(${rgb}, ${0.18 * tw * intensity})`;
    ctx.beginPath(); ctx.arc(x, y, p.s * 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgba(${rgb}, ${0.85 * tw * intensity})`;
    ctx.beginPath(); ctx.arc(x, y, p.s, 0, Math.PI * 2); ctx.fill();
  }

  // Dâre de lumină orizontale, cu coada care se stinge.
  ctx.lineWidth = 2;
  for (const s of streaks) {
    const u = ((s.k * clock) / T + s.ph) % 1;
    const head = -s.len + u * (w + 2 * s.len);
    const g = ctx.createLinearGradient(head - s.len, 0, head, 0);
    const rgb = s.mag ? MAG : CYAN;
    g.addColorStop(0, `rgba(${rgb}, 0)`);
    g.addColorStop(1, `rgba(${rgb}, ${0.8 * intensity})`);
    ctx.strokeStyle = g;
    ctx.beginPath(); ctx.moveTo(head - s.len, s.y); ctx.lineTo(head, s.y); ctx.stroke();
  }
}

function frame(now) {
  const dt = Math.min(0.05, (now - (lastFrame || now)) / 1000);
  lastFrame = now;
  if (!document.hidden) {
    if (now - lastScrollAt > 140) warpTarget = 1;
    speed += (warpTarget - speed) * 0.08;
    travel += (dt * speed) / RING_SECONDS;
    clock += dt * (1 + (speed - 1) * 0.4);
    draw();
  }
  raf = requestAnimationFrame(frame);
}

function onScroll() {
  const now = performance.now();
  const dy = Math.abs(window.scrollY - lastScrollY);
  const dtMs = Math.max(16, now - lastScrollAt);
  lastScrollY = window.scrollY;
  lastScrollAt = now;
  warpTarget = 1 + Math.min(6, (dy / dtMs) * 2.5);
  if (reduce) draw(); // fără animație redesenăm doar ca să ajustăm intensitatea
}

let ro = null;
onMounted(() => {
  ctx = canvas.value.getContext('2d');
  ro = new ResizeObserver(resize);
  ro.observe(canvas.value);
  lastScrollY = window.scrollY;
  window.addEventListener('scroll', onScroll, { passive: true });
  resize();
  if (!reduce) raf = requestAnimationFrame(frame);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  ro?.disconnect();
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <canvas ref="canvas" class="bg-tunnel" aria-hidden="true"></canvas>
</template>
