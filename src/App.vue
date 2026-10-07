<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { site } from './data/site.js';
import videosData from './data/videos.json';
import { DAYS, formatCountdown, nowIn, streamStatus } from './schedule.js';
import NeonGrid from './components/NeonGrid.vue';
import Icon from './components/Icon.vue';

const base = import.meta.env.BASE_URL;

/* Ceasul pentru numărătoare și pentru „azi” din program */
const now = ref(new Date());
let timer = 0;
onMounted(() => { timer = setInterval(() => { now.value = new Date(); }, 1000); });
onBeforeUnmount(() => clearInterval(timer));

const status = computed(() => streamStatus(site.schedule, site.timezone, now.value));
const today = computed(() => nowIn(site.timezone, now.value).day);
const countdown = computed(() => formatCountdown(status.value.onAir ? status.value.endsIn : status.value.startsIn));
const slotLabel = computed(() => (status.value.slot ? `${DAYS[status.value.slot.day - 1]}, ${status.value.slot.start}` : ''));
const endLabel = computed(() => status.value.slot?.end ?? 'târziu');

/* Clipuri (generate la build de scripts/fetch-data.mjs) */
const videos = videosData.items ?? [];
const featured = videos[0];
const rest = videos.slice(1, 7);
const playing = ref(null);
const thumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const watch = (id) => `https://www.youtube.com/watch?v=${id}`;
const nf = new Intl.NumberFormat('ro-RO');
const num = (n) => (n == null ? '—' : nf.format(n));
function ago(iso) {
  if (!iso) return '';
  const days = Math.floor((Date.now() - Date.parse(iso)) / 86400000);
  if (days <= 0) return 'azi';
  if (days === 1) return 'ieri';
  if (days < 30) return `acum ${days} zile`;
  return new Date(iso).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* Player-ul Kick se încarcă doar la click: pagina rămâne rapidă și nu pune cookie-uri străine din prima. */
const kickOn = ref(false);

/* Setup CS2: apare doar ce e completat în site.js */
const loadout = [
  ['Crosshair', site.loadout.crosshair, true],
  ['Sensibilitate', site.loadout.sensitivity],
  ['DPI', site.loadout.dpi],
  ['Rezoluție', site.loadout.resolution],
  ['Mouse', site.loadout.mouse],
  ['Căști', site.loadout.headset],
].filter(([, v]) => v);
const copied = ref(false);
async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 1800);
  } catch { /* clipboard indisponibil: codul rămâne vizibil și selectabil */ }
}

const link = Object.fromEntries(site.links.map((l) => [l.id, l]));
const nav = [['#live', 'Live'], ['#clipuri', 'Clipuri'], ['#program', 'Program'], ['#despre', 'Despre'], ['#comunitate', 'Comunitate']];
const menuOpen = ref(false);
const year = new Date().getFullYear();
</script>

<template>
  <header class="nav" :class="{ open: menuOpen }">
    <div class="nav-inner">
      <a class="brand" href="#top" @click="menuOpen = false">
        <img :src="`${base}logo.jpg`" alt="" width="36" height="36">
        <span class="wordmark">XADRY</span>
      </a>
      <nav class="nav-links" aria-label="Secțiuni">
        <a v-for="[href, label] in nav" :key="href" :href="href" @click="menuOpen = false">{{ label }}</a>
      </nav>
      <a class="btn btn-live btn-sm nav-cta" :href="site.kick.url" target="_blank" rel="noopener">
        <span class="live-dot" :class="{ on: status.onAir }"></span><span class="long">{{ status.onAir ? 'Acum în program' : 'Kick' }}</span><span class="short">Kick</span>
      </a>
      <button class="nav-toggle" type="button" :aria-expanded="menuOpen" aria-controls="mobile-menu" @click="menuOpen = !menuOpen">
        <Icon :name="menuOpen ? 'close' : 'menu'" :size="22" /><span class="sr">Meniu</span>
      </button>
    </div>
    <nav id="mobile-menu" class="mobile-menu" aria-label="Secțiuni" :hidden="!menuOpen">
      <a v-for="[href, label] in nav" :key="href" :href="href" @click="menuOpen = false">{{ label }}</a>
    </nav>
  </header>

  <main>
    <!-- HERO -->
    <section id="top" class="hero">
      <NeonGrid />
      <div class="hero-inner">
        <a class="status-chip" :class="{ on: status.onAir }" :href="site.kick.url" target="_blank" rel="noopener">
          <span class="live-dot" :class="{ on: status.onAir }"></span>
          <template v-if="status.onAir">Acum e în program · intră pe Kick</template>
          <template v-else>Următorul live: {{ slotLabel }} · <span class="mono">{{ countdown }}</span></template>
        </a>
        <h1 class="title" data-text="XADRY">XADRY</h1>
        <p class="tagline">{{ site.tagline }}<span class="sep">//</span>CS2 Premier &amp; FACEIT</p>
        <p class="vibe">{{ site.vibe }}</p>
        <div class="cta">
          <a class="btn btn-live" :href="site.kick.url" target="_blank" rel="noopener"><Icon name="kick" /> Intră pe live</a>
          <a class="btn btn-ghost" href="#clipuri"><Icon name="play" /> Ultimele clipuri</a>
        </div>
        <ul class="socials" aria-label="Platforme">
          <li v-for="l in site.links" :key="l.id">
            <a :href="l.url" target="_blank" rel="noopener" :aria-label="l.label" :title="l.label" :class="`p-${l.id}`"><Icon :name="l.id" :size="20" /></a>
          </li>
        </ul>
      </div>
      <a class="scroll-hint" href="#live" aria-label="Mergi la secțiunea Live"><Icon name="down" :size="22" /></a>
    </section>

    <!-- LIVE -->
    <section id="live" class="section">
      <header class="sec-head">
        <p class="eyebrow">Live</p>
        <h2>Prinde-mă pe stream</h2>
        <p class="lead">Live-urile principale sunt pe Kick. Player-ul pornește doar când apeși, ca pagina să se încarce repede.</p>
      </header>
      <div class="live-grid">
        <div class="player hud">
          <iframe v-if="kickOn" :src="`https://player.kick.com/${site.kick.slug}`" title="Live XADRY pe Kick" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
          <button v-else class="player-cover" type="button" @click="kickOn = true">
            <img :src="`${base}og.png`" alt="" loading="lazy">
            <span class="play-btn"><Icon name="play" :size="34" /></span>
            <span class="cover-text">Pornește player-ul Kick</span>
          </button>
        </div>
        <aside class="live-side">
          <div class="next-card hud">
            <p class="eyebrow">{{ status.onAir ? 'Acum în program' : 'Următorul live' }}</p>
            <p class="next-when">{{ status.onAir ? `până la ${endLabel}` : slotLabel }}</p>
            <p class="countdown mono" aria-live="off">{{ countdown }}</p>
            <p class="small">{{ status.onAir ? 'rămas din intervalul de azi' : 'până începe' }} · ora României</p>
          </div>
          <a v-for="id in ['kick', 'youtube', 'tiktok']" :key="id" class="watch-link" :class="`p-${id}`" :href="link[id].url" target="_blank" rel="noopener">
            <Icon :name="id" :size="22" />
            <span><strong>{{ link[id].label }}</strong><small>{{ link[id].note }}</small></span>
            <Icon name="arrow" :size="18" />
          </a>
        </aside>
      </div>
    </section>

    <!-- CLIPURI -->
    <section id="clipuri" class="section">
      <header class="sec-head row">
        <div>
          <p class="eyebrow">Clipuri</p>
          <h2>Ultimele de pe YouTube</h2>
        </div>
        <a class="btn btn-ghost btn-sm" :href="site.youtube.url" target="_blank" rel="noopener"><Icon name="youtube" /> Toate pe YouTube</a>
      </header>
      <div v-if="featured" class="clips">
        <article class="clip featured hud">
          <div class="thumb">
            <iframe v-if="playing === featured.id" :src="`https://www.youtube-nocookie.com/embed/${featured.id}?autoplay=1`" :title="featured.title" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
            <button v-else type="button" class="thumb-btn" :aria-label="`Pornește: ${featured.title}`" @click="playing = featured.id">
              <img :src="thumb(featured.id)" alt="" loading="lazy">
              <span class="play-btn"><Icon name="play" :size="30" /></span>
              <span class="badge-new">Cel mai nou</span>
            </button>
          </div>
          <div class="clip-meta">
            <h3>{{ featured.title }}</h3>
            <p class="stats"><span>{{ ago(featured.published) }}</span><span><Icon name="eye" :size="15" /> {{ num(featured.views) }}</span><span><Icon name="heart" :size="15" /> {{ num(featured.likes) }}</span></p>
          </div>
        </article>
        <article v-for="v in rest" :key="v.id" class="clip">
          <a :href="watch(v.id)" target="_blank" rel="noopener" class="clip-link">
            <span class="thumb"><img :src="thumb(v.id)" alt="" loading="lazy"><span class="play-btn sm"><Icon name="play" :size="20" /></span></span>
            <span class="clip-meta">
              <h3>{{ v.title }}</h3>
              <span class="stats"><span>{{ ago(v.published) }}</span><span><Icon name="eye" :size="14" /> {{ num(v.views) }}</span><span><Icon name="heart" :size="14" /> {{ num(v.likes) }}</span></span>
            </span>
          </a>
        </article>
      </div>
      <p v-else class="empty">Clipurile apar aici după primul build. Până atunci, le găsești pe <a :href="site.youtube.url" target="_blank" rel="noopener">YouTube</a>.</p>
    </section>

    <!-- PROGRAM -->
    <section id="program" class="section">
      <header class="sec-head">
        <p class="eyebrow">Program</p>
        <h2>Când intru live</h2>
        <p class="lead">Ora României. Seara de vineri nu are oră de final.</p>
      </header>
      <ol class="week">
        <li v-for="s in site.schedule" :key="s.day" class="day-card" :class="{ today: s.day === today, onair: status.onAir && status.slot?.day === s.day, off: s.variable }">
          <span class="day">{{ DAYS[s.day - 1] }}</span>
          <span class="time mono">{{ s.variable ? 'variabil' : `${s.start} — ${s.end ?? '???'}` }}</span>
          <span class="note">{{ s.variable ? 'Anunț pe Discord și Telegram' : s.note }}</span>
          <span v-if="status.onAir && status.slot?.day === s.day" class="tag tag-live">Acum</span>
          <span v-else-if="s.day === today" class="tag">Azi</span>
        </li>
      </ol>
    </section>

    <!-- DESPRE -->
    <section id="despre" class="section about">
      <div class="about-main">
        <p class="eyebrow">Despre</p>
        <h2>Un fel de „game friend”</h2>
        <p class="lead">{{ site.about }}</p>
        <div class="on-stream">
          <div v-for="o in site.onStream" :key="o.title" class="on-card">
            <h3>{{ o.title }}</h3>
            <p>{{ o.text }}</p>
          </div>
        </div>
      </div>
      <aside class="rules hud">
        <p class="eyebrow">Regulile chatului</p>
        <ul>
          <li v-for="r in site.rules" :key="r">{{ r }}</li>
        </ul>
      </aside>
    </section>

    <!-- SETUP (doar dacă e completat) -->
    <section v-if="loadout.length" id="setup" class="section">
      <header class="sec-head">
        <p class="eyebrow">Setup</p>
        <h2>Cu ce joc</h2>
      </header>
      <dl class="loadout">
        <div v-for="[label, value, copyable] in loadout" :key="label" class="load-item" :class="{ wide: copyable }">
          <dt>{{ label }}</dt>
          <dd>
            <code>{{ value }}</code>
            <button v-if="copyable" type="button" class="btn btn-ghost btn-sm" @click="copy(value)"><Icon name="copy" :size="16" /> {{ copied ? 'Copiat' : 'Copiază' }}</button>
          </dd>
        </div>
      </dl>
    </section>

    <!-- COMUNITATE -->
    <section id="comunitate" class="section">
      <header class="sec-head">
        <p class="eyebrow">Comunitate</p>
        <h2>Intră în gașcă</h2>
        <p class="lead">Anunțurile de live, programul de weekend și fazele bune ajung întâi pe Discord și Telegram.</p>
      </header>
      <div class="community">
        <a v-for="id in ['discord', 'telegram']" :key="id" class="big-link hud" :class="`p-${id}`" :href="link[id].url" target="_blank" rel="noopener">
          <Icon :name="id" :size="40" />
          <span><strong>{{ link[id].label }}</strong><small>{{ link[id].note }}</small></span>
          <span class="go">Intră <Icon name="arrow" :size="18" /></span>
        </a>
      </div>
      <ul class="links-grid">
        <li v-for="l in site.links" :key="l.id">
          <a :href="l.url" target="_blank" rel="noopener" :class="`p-${l.id}`">
            <Icon :name="l.id" :size="22" />
            <span><strong>{{ l.label }}</strong><small>{{ l.note }}</small></span>
          </a>
        </li>
      </ul>
    </section>
  </main>

  <footer class="footer">
    <span class="wordmark small">XADRY</span>
    <p>© {{ year }} XADRY · <a :href="site.url">xadry.live</a></p>
    <ul class="socials small" aria-label="Platforme">
      <li v-for="l in site.links" :key="l.id"><a :href="l.url" target="_blank" rel="noopener" :aria-label="l.label" :class="`p-${l.id}`"><Icon :name="l.id" :size="18" /></a></li>
    </ul>
  </footer>
</template>
