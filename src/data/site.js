// Tot conținutul site-ului stă aici. Schimbi textele, linkurile sau programul în fișierul ăsta și dai push:
// GitHub Actions reconstruiește și publică site-ul singur.

export const site = {
  name: 'XADRY',
  tagline: 'Entertainment și gaming',
  pitch: 'CS2, momente de râs și caterincă non-stop, plus gameplay puternic când se strânge vibe-ul.',
  vibe: 'bere rece + vibe bun',
  tags: ['CS2', 'Premier / FACEIT', 'Caterincă', 'OME.TV'],
  url: 'https://xadry.live',
  timezone: 'Europe/Bucharest',

  youtube: { channelId: 'UCMp-eXBL537Jfpn7zxDJz7g', handle: '@Adrian.Stefan7', url: 'https://www.youtube.com/@Adrian.Stefan7' },
  kick: { slug: 'adrianstefan7', url: 'https://kick.com/adrianstefan7' },
  twitch: { login: 'xadry_', url: 'https://www.twitch.tv/xadry_' },

  links: [
    { id: 'kick', label: 'Kick', note: 'Live-urile principale', url: 'https://kick.com/adrianstefan7' },
    { id: 'twitch', label: 'Twitch', note: 'Live-uri și VOD-uri', url: 'https://www.twitch.tv/xadry_' },
    { id: 'youtube', label: 'YouTube', note: 'Clipuri, gameplay și live-uri', url: 'https://www.youtube.com/@Adrian.Stefan7' },
    { id: 'tiktok', label: 'TikTok', note: 'Clipuri scurte și faze', url: 'https://www.tiktok.com/@adi_asz' },
    { id: 'instagram', label: 'Instagram', note: 'Stories și behind the scenes', url: 'https://www.instagram.com/adi_asz/' },
    { id: 'discord', label: 'Discord', note: 'Comunitatea XADRY', url: 'https://discord.com/invite/9Z6ttGv9ac' },
    { id: 'telegram', label: 'Telegram', note: 'Anunțuri și update-uri', url: 'https://t.me/adisgaminghub' },
  ],

  about: 'Caterincă zi de zi, gameplay-uri puternice și momente de neuitat. Pe YouTube mă găsești ca @Adrian.Stefan7, iar live-urile sunt pe Kick și Twitch.',
  onStream: [
    { title: 'CS2: Premier și FACEIT', text: 'RAGE PESTE RAGE, DAR TOT JUCĂM.' },
    { title: 'Caterincă', text: 'Faze de râs non-stop, cu chatul în rol principal.' },
    { title: 'OME.TV', text: 'Ocazional, când e chef de oameni noi.' },
  ],
  rules: [
    'Nu se spamează chatul.',
    'Ne tratăm ok, până la un anumit nivel de caterincă.',
    'Fără hate, fără toxic.',
    'Dacă e vibe: hai să bem o bere rece împreună.',
  ],

  // Program, în ora României. day: 1 = luni … 7 = duminică. end: null = „până se termină seara”.
  schedule: [
    { day: 1, start: '20:00', end: '00:00', note: 'Încălzire + meciuri' },
    { day: 2, start: '20:00', end: '00:00', note: 'Premier / FACEIT, focus pe progres' },
    { day: 3, start: '20:00', end: '00:00', note: 'Cu comunitatea, când se strânge lumea' },
    { day: 4, start: '20:00', end: '00:00', note: 'Gameplay + faze de povestit' },
    { day: 5, start: '20:00', end: null, note: 'Seară lungă: chill, glume și clutch-uri' },
    { day: 6, variable: true, note: 'Variabil' },
    { day: 7, variable: true, note: 'Variabil' },
  ],

  // Setup-ul de CS2. Secțiunea apare pe site doar după ce completezi măcar un câmp.
  loadout: {
    crosshair: '', // codul de crosshair din CS2, ex. CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx
    sensitivity: '',
    dpi: '',
    resolution: '',
    mouse: '',
    headset: '',
  },
};
