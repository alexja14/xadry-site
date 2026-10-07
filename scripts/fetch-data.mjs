// Rulează la fiecare build (local și în GitHub Actions, inclusiv la fiecare 6 ore din cron):
// ia ultimele videoclipuri din feed-ul public YouTube și le scrie în src/data/videos.json.
// Site-ul nu mai depinde de proxy-uri CORS în browser. Dacă YouTube nu răspunde, păstrăm lista veche.
import fs from 'node:fs';
import { site } from '../src/data/site.js';

const OUT = new URL('../src/data/videos.json', import.meta.url);
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${site.youtube.channelId}`;

const decode = (s) => String(s ?? '')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const num = (v) => (v == null || v === '' ? null : Number(v));

try {
  const r = await fetch(FEED, { headers: { 'user-agent': 'xadry-site-build' } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const xml = await r.text();
  const items = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 9).map(([, e]) => ({
    id: e.match(/<yt:videoId>([^<]+)/)?.[1],
    title: decode(e.match(/<title>([^<]*)/)?.[1]),
    published: e.match(/<published>([^<]+)/)?.[1] ?? null,
    views: num(e.match(/<media:statistics views="(\d+)"/)?.[1]),
    likes: num(e.match(/<media:starRating count="(\d+)"/)?.[1]),
  })).filter((v) => v.id);
  if (!items.length) throw new Error('feed-ul nu are videoclipuri');
  fs.writeFileSync(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), items }, null, 2) + '\n');
  console.log(`videos.json: ${items.length} videoclipuri, cel mai nou: ${items[0].title}`);
} catch (e) {
  if (!fs.existsSync(OUT)) fs.writeFileSync(OUT, JSON.stringify({ updatedAt: null, items: [] }, null, 2) + '\n');
  console.warn(`Nu am putut actualiza videoclipurile (${e.message}). Păstrez lista existentă.`);
}
