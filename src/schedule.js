// Programul e în ora României, indiferent unde e vizitatorul. Calculăm totul în „secunde de la luni 00:00”
// în fusul orar Europe/Bucharest, ca să meargă și peste miezul nopții și la trecerea duminică → luni.

export const DAYS = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
const WEEK = 7 * 86400;
const DEFAULT_LENGTH = 4 * 3600; // „20:00 — ???” îl tratăm ca 4 ore

export function nowIn(timeZone, date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday')) + 1;
  const sec = Number(get('hour')) * 3600 + Number(get('minute')) * 60 + Number(get('second'));
  return { day, weekSec: (day - 1) * 86400 + sec };
}

const toSec = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 3600 + m * 60;
};

function slots(schedule) {
  return schedule.filter((s) => !s.variable && s.start).map((s) => {
    const start = (s.day - 1) * 86400 + toSec(s.start);
    let end = s.end ? (s.day - 1) * 86400 + toSec(s.end) : start + DEFAULT_LENGTH;
    if (end <= start) end += 86400;
    return { ...s, startSec: start, endSec: end };
  });
}

// { onAir: true, slot, endsIn } dacă acum e în intervalul din program, altfel { onAir: false, slot, startsIn }.
export function streamStatus(schedule, timeZone, date = new Date()) {
  const { weekSec } = nowIn(timeZone, date);
  const list = slots(schedule);
  for (const s of list) {
    for (const shift of [0, -WEEK]) {
      if (weekSec >= s.startSec + shift && weekSec < s.endSec + shift) return { onAir: true, slot: s, endsIn: s.endSec + shift - weekSec };
    }
  }
  let best = null;
  for (const s of list) {
    let d = s.startSec - weekSec;
    if (d <= 0) d += WEEK;
    if (!best || d < best.startsIn) best = { onAir: false, slot: s, startsIn: d };
  }
  return best ?? { onAir: false, slot: null, startsIn: null };
}

export function formatCountdown(sec) {
  if (sec == null) return '';
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const pad = (n) => String(n).padStart(2, '0');
  return d > 0 ? `${d}z ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)}`;
}
