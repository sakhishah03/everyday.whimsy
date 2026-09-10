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
Everything lives in the `CATEGORIES` list at the top of **`script.js`** — it's set up to be copy-paste friendly.

- **Add a photo:** drop the `.jpg` into `assets/`, then add one line to the right category:
  `{ src: "assets/yourfile.jpg", cap: "a little note" },`
  Photos look best around 1200–1800px on the long edge.
- **Add a category:** copy one `{ key, name, blurb, photos: [...] }` block and give it a new `name`. Empty categories automatically show the "nothing here yet — but soon" card until you add photos.
- **Fill the empty ones** (cities, fits, the random drawer): just add photo lines to their `photos: []`.
- **Change captions/quotes/copy:** the intro line and the closing quote are plain text in `index.html`.
- **Rename the site:** change the `<title>`, the `.logo` button, and the big `<h1>` in `index.html`.
- **Change colors:** edit the hex values under `:root` (day) and `:root[data-theme="night"]` (night) in `styles.css`.

Click any photo to enlarge it. The ☾/☀ button flips day/night sky.

Made with love. ✶
