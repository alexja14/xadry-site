# XADRY · site

Site-ul de pe xadry.live, refăcut în stilul bannerului canalului: grila neon, titlul crom, cyan, violet și roz pe fundal închis. Vue 3 + Vite, publicat pe GitHub Pages din GitHub Actions.

## Ce e nou față de site-ul vechi

| | Înainte | Acum |
|---|---|---|
| Clipuri YouTube | citite în browser prin proxy-uri publice (allorigins, codetabs), care cad des | aduse la build de GitHub Actions, la fiecare 6 ore, fără proxy |
| Mărime JavaScript | ~590 KB (three.js pentru particule) | ~83 KB (32 KB comprimat), fundal pe canvas simplu |
| Live | doar linkuri | player Kick pe pagină (pornește la click) + numărătoare până la următorul live, în ora României |
| Program | listă | săptămâna întreagă, cu „Azi” și „Acum” evidențiate |
| Share pe Discord/WhatsApp | fără previzualizare | imagine și titlu (Open Graph), cu bannerul XADRY |
| Conținut | în cod | tot într-un singur fișier: `src/data/site.js` |

## Cum schimbi conținutul

Totul e în `src/data/site.js`:
- texte;
- linkuri;
- program (zile și ore);
- regulile chatului;
- setup-ul de CS2 (crosshair, sensibilitate, mouse).

Secțiunea Setup apare pe site doar după ce completezi măcar un câmp. Faci push pe `main`, iar site-ul se publică singur în 1–2 minute.

## Local

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # aduce clipurile + construiește în dist/
```

## Deploy cu GitHub Actions

Workflow-ul e în `.github/workflows/deploy.yml`. Rulează:
- la fiecare push pe `main`;
- la fiecare 6 ore, ca să apară clipurile noi;
- manual, din tab-ul **Actions**.

Prima dată, în repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### Varianta A: în repo-ul site-ului existent

Copiezi fișierele peste cele vechi, faci push pe `main`. Domeniul `xadry.live` rămâne setat în **Settings → Pages → Custom domain**, nu schimbi nimic în Cloudflare.

### Varianta B: repo nou

1. Creezi repo-ul pe GitHub și faci push. Pages gratuit merge pe repo public; pe repo privat cere GitHub Pro.
2. Verifici versiunea nouă pe `https://<cont>.github.io/<repo>/`. Căile sunt relative, deci merge și acolo.
3. Muți domeniul:
   - în repo-ul vechi: **Settings → Pages → Custom domain → Remove**;
   - în repo-ul nou: pui `xadry.live` la Custom domain.
4. Cloudflare:
   - dacă DNS-ul are înregistrări A spre GitHub (`185.199.108.153` – `185.199.111.153`), nu schimbi nimic;
   - dacă are CNAME spre `<cont-vechi>.github.io`, îl schimbi pe contul nou.

## De știut

- GitHub oprește workflow-urile programate dacă repo-ul public nu are niciun commit 60 de zile. Un push le repornește.
- Player-ul Kick și videoclipurile YouTube se încarcă doar la click, așa că pagina nu pune cookie-uri de la terți din prima.
