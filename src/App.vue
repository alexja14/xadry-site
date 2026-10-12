<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { site } from './data/site.js';
import videosData from './data/videos.json';
import NeonTunnel from './components/NeonTunnel.vue';
import Icon from './components/Icon.vue';
import { setupMotion } from './motion.js';

const base = import.meta.env.BASE_URL;

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

const link = Object.fromEntries(site.links.map((l) => [l.id, l]));
// Discord are cardul mare separat; în grilă rămân platformele de conținut.
const contentLinks = site.links.filter((l) => l.id !== 'discord');
const nav = [['#live', 'Live'], ['#clipuri', 'Clipuri'], ['#despre', 'Despre'], ['#comunitate', 'Comunitate']];
const menuOpen = ref(false);

/* Efectele de scroll și secțiunea curentă din meniu */
const activeSection = ref('top');
let stopMotion = null;
onMounted(() => { stopMotion = setupMotion({ onSection: (id) => { activeSection.value = id; } }); });
onBeforeUnmount(() => stopMotion?.());
const year = new Date().getFullYear();
</script>

<template>
  <NeonTunnel />
  <div class="scroll-progress" aria-hidden="true"></div>
  <header class="nav" :class="{ open: menuOpen }">
    <div class="nav-inner">
      <a class="brand" href="#top" @click="menuOpen = false">
        <img :src="`${base}logo.jpg`" alt="" width="36" height="36">
        <span class="wordmark">XADRY</span>
      </a>
      <nav class="nav-links" aria-label="Secțiuni">
        <a v-for="[href, label] in nav" :key="href" :href="href" :class="{ active: activeSection === href.slice(1) }" :aria-current="activeSection === href.slice(1) ? 'true' : undefined" @click="menuOpen = false">{{ label }}</a>
      </nav>
      <a class="btn btn-live btn-sm nav-cta" :href="site.kick.url" target="_blank" rel="noopener">
        <Icon name="kick" :size="16" /> Kick
      </a>
      <button class="nav-toggle" type="button" :aria-expanded="menuOpen" aria-controls="mobile-menu" @click="menuOpen = !menuOpen">
        <Icon :name="menuOpen ? 'close' : 'menu'" :size="22" /><span class="sr">Meniu</span>
      </button>
    </div>
    <nav id="mobile-menu" class="mobile-menu" aria-label="Secțiuni" :hidden="!menuOpen">
      <a v-for="[href, label] in nav" :key="href" :href="href" :class="{ active: activeSection === href.slice(1) }" @click="menuOpen = false">{{ label }}</a>
    </nav>
  </header>

  <main>
    <!-- HERO -->
    <section id="top" class="hero">
      <div class="hero-inner">
        <h1 class="title" data-text="XADRY">XADRY</h1>
        <p class="tagline"><template v-for="(t, i) in site.tags" :key="t"><span v-if="i" class="sep">//</span>{{ t }}</template></p>
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
      <header class="sec-head reveal">
        <p class="eyebrow">Live</p>
        <h2>Prinde-mă pe stream</h2>
        <p class="lead">Live-urile principale sunt pe Kick, iar pe Twitch mă prinzi ca xAdry_. Player-ul pornește doar când apeși, ca pagina să se încarce repede.</p>
      </header>
      <div class="live-grid">
        <div class="player hud reveal">
          <iframe v-if="kickOn" :src="`https://player.kick.com/${site.kick.slug}`" title="Live XADRY pe Kick" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
          <button v-else class="player-cover" type="button" @click="kickOn = true">
            <img :src="`${base}og.png`" alt="" loading="lazy">
            <span class="play-btn"><Icon name="play" :size="34" /></span>
            <span class="cover-text">Pornește player-ul Kick</span>
          </button>
        </div>
        <aside class="live-side">
          <a v-for="(id, i) in ['kick', 'twitch', 'youtube']" :key="id" class="watch-link reveal" :style="{ '--d': i + 1 }" :class="`p-${id}`" :href="link[id].url" target="_blank" rel="noopener">
            <Icon :name="id" :size="22" />
            <span><strong>{{ link[id].label }}</strong><small>{{ link[id].note }}</small></span>
            <Icon name="arrow" :size="18" />
          </a>
        </aside>
      </div>
    </section>

    <!-- CLIPURI -->
    <section id="clipuri" class="section">
      <header class="sec-head row reveal">
        <div>
          <p class="eyebrow">Clipuri</p>
          <h2>Ultimele de pe YouTube</h2>
        </div>
        <a class="btn btn-ghost btn-sm" :href="site.youtube.url" target="_blank" rel="noopener"><Icon name="youtube" /> Toate pe YouTube</a>
      </header>
      <div v-if="featured" class="clips">
        <article class="clip featured hud reveal">
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
        <article v-for="(v, i) in rest" :key="v.id" class="clip reveal" :style="{ '--d': i + 1 }">
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

    <!-- DESPRE -->
    <section id="despre" class="section about">
      <div class="about-main reveal">
        <p class="eyebrow">Despre</p>
        <h2>Mai multe detalii</h2>
        <p class="lead">{{ site.about }}</p>
      </div>
      <aside class="rules hud reveal" style="--d: 2">
        <p class="eyebrow">Regulile chatului</p>
        <ul>
          <li v-for="r in site.rules" :key="r">{{ r }}</li>
        </ul>
      </aside>
    </section>

    <!-- COMUNITATE -->
    <section id="comunitate" class="section">
      <header class="sec-head reveal">
        <p class="eyebrow">Comunitate</p>
        <h2>xAdry's Community</h2>
        <p v-for="(p, i) in site.community" :key="i" class="lead">{{ p }}</p>
      </header>
      <div class="community">
        <a v-for="id in ['discord']" :key="id" class="big-link hud reveal" :class="`p-${id}`" :href="link[id].url" target="_blank" rel="noopener">
          <Icon :name="id" :size="40" />
          <span><strong>{{ link[id].label }}</strong><small>{{ link[id].note }}</small></span>
          <span class="go">Intră <Icon name="arrow" :size="18" /></span>
        </a>
      </div>
      <ul class="links-grid">
        <li v-for="(l, i) in contentLinks" :key="l.id" class="reveal" :style="{ '--d': i + 2 }">
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
