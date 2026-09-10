# everyday whimsy — your photography site

A little junk drawer of everything you love looking at. Everything is self-contained: no build step, no accounts, no external font requests.

## Files
- `index.html` — the page (edit text, captions, and the order of photos here)
- `styles.css` — colors, fonts, spacing (the palette is at the very top under `:root`)
- `script.js` — day/night toggle, click-to-enlarge, and the hand-drawn crayon doodles
- `fonts/` — the fonts, bundled in so nothing loads from the internet
- `assets/` — your photos

## Put it online (get a live link)

**Easiest — Netlify Drop (no account needed to start):**
1. Go to **app.netlify.com/drop**
2. Drag this whole `site` folder onto the page
3. You get a live link in a few seconds (e.g. `something-lovely.netlify.app`). Make a free account to keep it and rename it.

**GitHub Pages:** put these files in a repo, then Settings → Pages → deploy from the `main` branch. Your link will be `yourname.github.io/reponame`.

**Vercel / Cloudflare Pages:** same idea — drag the folder in or connect the repo.

## Make it yours
- **Add/replace photos:** drop a `.jpg` into `assets/`, then copy one of the `<article class="entry">` blocks in `index.html` and point `src="assets/yourphoto.jpg"`, and change the caption. Photos look best around 1200–1800px on the long edge.
- **Change the captions or quotes:** they're plain text in `index.html`.
- **Rename the site:** change the `<title>`, the `.logo`, and the big `<h1>`.
- **Change the colors:** edit the hex values under `:root` (day) and `:root[data-theme="night"]` (night) in `styles.css`.

Made with love. ✶
