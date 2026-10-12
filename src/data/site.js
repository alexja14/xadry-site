// Tot conținutul site-ului stă aici. Schimbi textele sau linkurile în fișierul ăsta și dai push:
// GitHub Actions reconstruiește și publică site-ul singur.

export const site = {
  name: 'XADRY',
  tags: ['Entertainment', 'Gaming', 'Caterincă'],
  url: 'https://xadry.live',

  youtube: { channelId: 'UCMp-eXBL537Jfpn7zxDJz7g', handle: '@Adrian.Stefan7', url: 'https://www.youtube.com/@Adrian.Stefan7' },
  kick: { slug: 'adrianstefan7', url: 'https://kick.com/adrianstefan7' },
  twitch: { login: 'xadry_', url: 'https://www.twitch.tv/xadry_' },

  links: [
    { id: 'kick', label: 'Kick', note: 'Live-urile principale', url: 'https://kick.com/adrianstefan7' },
    { id: 'twitch', label: 'Twitch', note: 'Live-uri și VOD-uri', url: 'https://www.twitch.tv/xadry_' },
    { id: 'youtube', label: 'YouTube', note: 'Clipuri, gameplay și live-uri', url: 'https://www.youtube.com/@Adrian.Stefan7' },
    { id: 'tiktok', label: 'TikTok', note: 'Clipuri scurte și faze', url: 'https://www.tiktok.com/@adi_asz' },
    { id: 'instagram', label: 'Instagram', note: 'Actualizări zilnice', url: 'https://www.instagram.com/adi_asz/' },
    // Invitația spre serverul „xAdry's Community” (nu expiră).
    { id: 'discord', label: 'Discord', note: 'xAdry\'s Community', url: 'https://discord.gg/DQNQVVdpw8' },
  ],

  // Secțiunea „Mai multe detalii”
  about: 'Bine ai venit în comunitatea lui xAdry! Aici vei găsi entertainment, gaming și caterincă. Dacă ești interesat, mă poți găsi pe YouTube, Kick și Twitch, iar pentru mai multe informații și actualizări zilnice mă poți găsi pe Instagram. Toate aceste linkuri le vei găsi în josul acestei pagini.',
  rules: [
    'Nu se spamează chatul.',
    'Ne tratăm ok, până la un anumit nivel de caterincă.',
    'Fără hate, fără toxic.',
  ],

  // Secțiunea „xAdry's Community”, câte un paragraf pe rând
  community: [
    'Aici găsești o gașcă de oameni super de treabă, prietenoși și foarte cool! Fie că ai chef de glume, gaming, conversații random sau pur și simplu vrei să-ți faci prieteni noi, la noi sigur nu te plictisești!',
    'Vrei să faci parte din gașca noastră? Te așteptăm cu brațele deschise, multă voie bună și, bineînțeles, cu glume mai bune sau mai proaste.',
    'Ne găsești pe Discord! Link-ul este în partea de jos a paginii. Hai și tu în comunitate, că loc avem pentru toată lumea!',
  ],
};
