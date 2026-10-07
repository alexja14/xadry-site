<script setup>
// Fundalul din hero: podeaua cu grilă neon care vine spre tine și stelele din bannerul XADRY.
// Canvas simplu, fără biblioteci 3D. Se oprește când nu e pe ecran sau când tab-ul e în fundal,
// iar cu „reduce motion” desenează un singur cadru static.
import { onBeforeUnmount, onMounted, ref } from 'vue';

const canvas = ref(null);
let ctx = null;
let raf = 0;
let w = 0;
let h = 0;
let stars = [];
let visible = true;
let io = null;
let ro = null;
const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const t0 = performance.now();

function resize() {
  const el = canvas.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  w = r.width;
  h = r.height;
  el.width = Math.round(w * dpr);
  el.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.round((w * h) / 9000);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h * 0.62,
    r: Math.random() * 1.3 + 0.3,
    p: Math.random() * Math.PI * 2,
    c: Math.random() < 0.55 ? '61,224,255' : '201,75,255',
  }));
  draw(performance.now());
}

function draw(now) {
  const t = (now - t0) / 1000;
  const hy = h * 0.6; // linia orizontului
  ctx.clearRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(w / 2, hy, 0, w / 2, hy, Math.max(w, h) * 0.62);
  glow.addColorStop(0, 'rgba(201, 75, 255, 0.30)');
  glow.addColorStop(0.35, 'rgba(255, 0, 153, 0.09)');
  glow.addColorStop(1, 'rgba(9, 18, 29, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  for (const s of stars) {
    const a = reduce ? 0.55 : 0.35 + 0.35 * Math.sin(t * 1.4 + s.p);
    ctx.fillStyle = `rgba(${s.c}, ${a})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Linii orizontale în perspectivă: pornesc la orizont și „vin” spre privitor.
  const floor = h - hy;
  const phase = reduce ? 0.35 : (t * 0.32) % 1;
  const K = 16;
  ctx.lineWidth = 1;
  for (let k = 0; k < K; k++) {
    const z = (k + phase) / K;
    const y = hy + floor * z * z;
    ctx.strokeStyle = `rgba(61, 224, 255, ${Math.min(1, z * 1.7) * 0.5})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Linii care converg spre punctul de fugă.
  const fade = ctx.createLinearGradient(0, hy, 0, h);
  fade.addColorStop(0, 'rgba(61, 224, 255, 0)');
  fade.addColorStop(1, 'rgba(61, 224, 255, 0.5)');
  ctx.strokeStyle = fade;
  const J = 28;
  const spread = w * 2.6;
  for (let j = 0; j <= J; j++) {
    ctx.beginPath();
    ctx.moveTo(w / 2, hy);
    ctx.lineTo(w / 2 + (j / J - 0.5) * spread, h);
    ctx.stroke();
  }

  // Orizontul roz, ca badge-ul LIVE.
  const line = ctx.createLinearGradient(0, 0, w, 0);
  line.addColorStop(0, 'rgba(255, 0, 153, 0)');
  line.addColorStop(0.5, 'rgba(255, 0, 153, 0.85)');
  line.addColorStop(1, 'rgba(255, 0, 153, 0)');
  ctx.strokeStyle = line;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, hy);
  ctx.lineTo(w, hy);
  ctx.stroke();
}

function loop(now) {
  if (visible && !document.hidden) draw(now);
  raf = requestAnimationFrame(loop);
}

onMounted(() => {
  ctx = canvas.value.getContext('2d');
  ro = new ResizeObserver(resize);
  ro.observe(canvas.value);
  resize();
  io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(canvas.value);
  if (!reduce) raf = requestAnimationFrame(loop);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  ro?.disconnect();
  io?.disconnect();
});
</script>

<template>
  <canvas ref="canvas" class="neon-grid" aria-hidden="true"></canvas>
</template>
