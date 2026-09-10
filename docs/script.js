/* =========================================================================
   everyday whimsy
   -------------------------------------------------------------------------
   Each CATEGORY shows one "cover" photo with a caption beside it. Click the
   cover and it expands to show the rest of that category's photos.

   TO ADD A PHOTO: drop the file in assets/, then add a line to that category:
       { src: "assets/yourfile.jpg", cap: "a little note" },
   TO ADD A CATEGORY: copy a { ... } block below and give it a name + caption.
   The FIRST photo in each list is used as the cover.
   ========================================================================= */

const CATEGORIES = [
  {
    name: "nature",
    caption: "my last trip was all trees and water and light through the leaves — i couldn't stop.",
    photos: [
      { src: "assets/sparkle.jpg", cap: "the water was doing that thing" },
      { src: "assets/ferns.jpg",   cap: "sun through the ferns" },
      { src: "assets/creek.jpg",   cap: "a creek worth the walk" },
      { src: "assets/deep.jpg",    cap: "deep in the green" },
    ],
  },
  {
    name: "skies & clouds",
    caption: "the four-minute skies — gone before you can point at them.",
    photos: [
      { src: "assets/lake.jpg", cap: "the sky went completely pink" },
    ],
  },
  {
    name: "food",
    caption: "little edible joys, usually eaten right after this photo.",
    photos: [
      { src: "assets/cake.jpg", cap: "cake in a window, golden hour" },
    ],
  },
  {
    name: "cities",
    caption: "streets, windows, corners — the loud kind of pretty. adding these soon.",
    photos: [],
  },
  {
    name: "fits",
    caption: "what i wore, why not.",
    photos: [],
  },
  {
    name: "a few things i loved enough to record",
    caption: "the random drawer — everything that didn't fit anywhere else.",
    photos: [],
  },
];

(function () {
  "use strict";
  var root = document.documentElement;

  /* ---------- day / night ---------- */
  var toggle = document.getElementById("toggle");
  var ticon = document.getElementById("toggle-icon");
  var tlabel = document.getElementById("toggle-label");
  function applyTheme(m) {
    if (m === "night") { root.setAttribute("data-theme", "night"); ticon.textContent = "☀"; tlabel.textContent = "day"; }
    else { root.removeAttribute("data-theme"); ticon.textContent = "☾"; tlabel.textContent = "night"; }
    setTimeout(drawDoodles, 50);
  }
  var saved; try { saved = localStorage.getItem("ew-mode"); } catch (e) {}
  applyTheme(saved || "day");
  toggle.addEventListener("click", function () {
    var n = root.getAttribute("data-theme") === "night" ? "day" : "night";
    applyTheme(n); try { localStorage.setItem("ew-mode", n); } catch (e) {}
  });

  /* ---------- lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbCap = document.getElementById("lb-cap");
  function openLightbox(src, cap) { lbImg.src = src; lbCap.textContent = cap || ""; lb.classList.add("open"); }
  lb.addEventListener("click", function () { lb.classList.remove("open"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") lb.classList.remove("open"); });

  /* ---------- build the categories ---------- */
  var host = document.getElementById("categories");
  // cover style: "stack" (default) or "grid" — try ?cover=grid to preview the collage version
  var COVER = new URLSearchParams(location.search).get("cover") || "stack";

  CATEGORIES.forEach(function (cat, i) {
    var n = cat.photos.length;
    var wrap = document.createElement("div");
    wrap.className = "category";

    var entry = document.createElement("div");
    entry.className = "entry" + (i % 2 ? " rev" : "");

    // cover
    var cover = document.createElement("div");
    cover.className = "cover";
    var clickTarget = null;
    if (n === 0) {
      cover.className += " empty";
      cover.innerHTML = '<div class="ph"><span>nothing here yet —<br>but soon ✶</span></div>';
    } else if (n === 1) {
      cover.innerHTML = '<figure class="photo"><span class="tape"></span><img src="' + cat.photos[0].src + '" alt="' + cat.name + '"></figure>';
      var only = cover.querySelector(".photo");
      only.style.cursor = "zoom-in";
      only.addEventListener("click", function () { openLightbox(cat.photos[0].src, cat.photos[0].cap); });
    } else if (COVER === "grid") {
      var g = '<div class="cover-grid">';
      cat.photos.slice(0, 4).forEach(function (p) {
        g += '<div class="gphoto"><figure class="photo"><img src="' + p.src + '" alt=""></figure></div>';
      });
      cover.innerHTML = g + '</div>';
      cover.style.cursor = "pointer";
      clickTarget = cover;
    } else { // stack
      var s = '<div class="stack"><figure class="photo front"><span class="tape"></span><img src="' + cat.photos[0].src + '" alt="' + cat.name + '"></figure>';
      if (n >= 2) s += '<div class="peek p1"></div>';
      if (n >= 3) s += '<div class="peek p2"></div>';
      cover.innerHTML = s + '</div>';
      var front = cover.querySelector(".front");
      front.style.cursor = "pointer";
      clickTarget = front;
    }

    // text
    var text = document.createElement("div");
    text.className = "cat-text";
    var meta = n === 0 ? "coming soon"
      : (n === 1 ? "1 picture · tap to view" : n + " pictures · tap to open");
    text.innerHTML =
      '<h2 class="name">' + cat.name + '</h2>' +
      '<p class="cap">' + cat.caption + '</p>' +
      '<span class="meta">' + (n > 0 ? '<span class="arrow">→</span>' : '') + '<span>' + meta + '</span></span>';

    entry.appendChild(cover);
    entry.appendChild(text);
    wrap.appendChild(entry);

    // expand panel (only when there's more than one photo)
    var panel = null;
    if (n > 1) {
      panel = document.createElement("div");
      panel.className = "expand";
      panel.hidden = true;
      var inner = document.createElement("div");
      inner.className = "expand-inner";
      cat.photos.forEach(function (p) {
        var mini = document.createElement("div");
        mini.className = "mini";
        mini.innerHTML = '<figure class="photo"><img src="' + p.src + '" alt="' + (p.cap || "") + '">' +
          (p.cap ? '<figcaption class="cap">' + p.cap + '</figcaption>' : "") + '</figure>';
        mini.addEventListener("click", function () { openLightbox(p.src, p.cap); });
        inner.appendChild(mini);
      });
      panel.appendChild(inner);
      wrap.appendChild(panel);
    }

    // interactions — expand / collapse the drawer
    if (clickTarget && panel) {
      var toggleOpen = function () {
        var open = wrap.classList.toggle("open");
        panel.hidden = !open;
      };
      clickTarget.addEventListener("click", toggleOpen);
      var meta = text.querySelector(".meta");
      meta.style.cursor = "pointer";
      meta.addEventListener("click", toggleOpen);
    }

    host.appendChild(wrap);
  });

  /* ---------- crayon smiley stars (yellow, little face) ---------- */
  function cssVar(nm) { return getComputedStyle(root).getPropertyValue(nm).trim() || "#d99a2b"; }
  function starPath(ctx, cx, cy, outer, inner, spikes, jit) {
    ctx.beginPath();
    var rot = -Math.PI / 2, step = Math.PI / spikes;
    for (var i = 0; i < spikes * 2; i++) {
      var r = (i % 2 === 0 ? outer : inner) * (1 + (Math.random() - 0.5) * jit);
      var x = cx + Math.cos(rot) * r, y = cy + Math.sin(rot) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); rot += step;
    }
    ctx.closePath();
  }
  function smileyStar(ctx, cx, cy, R) {
    var fill = cssVar("--marigold"), ink = "#5a4a2a";
    ctx.save(); starPath(ctx, cx, cy, R, R * 0.5, 5, 0.1); ctx.clip();
    ctx.strokeStyle = fill; ctx.lineCap = "round";
    for (var i = 0; i < 120; i++) {
      ctx.globalAlpha = 0.08 + Math.random() * 0.1; ctx.lineWidth = 2 + Math.random() * 4;
      var x = cx + (Math.random() - 0.5) * R * 2.3, y = cy + (Math.random() - 0.5) * R * 2.3;
      var a = Math.random() * Math.PI, len = R * (0.5 + Math.random() * 0.8);
      ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * len, y - Math.sin(a) * len);
      ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); ctx.stroke();
    }
    ctx.restore(); ctx.globalAlpha = 1;
    ctx.strokeStyle = ink; ctx.lineJoin = "round"; ctx.lineCap = "round";
    for (var p = 0; p < 3; p++) {
      ctx.globalAlpha = 0.55 + Math.random() * 0.3; ctx.lineWidth = 2.6 + Math.random() * 1.2;
      starPath(ctx, cx + (Math.random() - .5) * 2, cy + (Math.random() - .5) * 2, R * (1 + (Math.random() - .5) * .04), R * 0.5, 5, 0.1);
      ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.fillStyle = ink;
    var eo = R * 0.26, ey = cy - R * 0.02;
    ctx.beginPath(); ctx.arc(cx - eo, ey, R * 0.075, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + eo, ey, R * 0.075, 0, 7); ctx.fill();
    ctx.strokeStyle = ink; ctx.lineWidth = R * 0.06; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(cx, cy + R * 0.08, R * 0.24, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    ctx.globalAlpha = 0.5; ctx.fillStyle = cssVar("--coral");
    ctx.beginPath(); ctx.arc(cx - R * 0.42, cy + R * 0.16, R * 0.11, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + R * 0.42, cy + R * 0.16, R * 0.11, 0, 7); ctx.fill();
    ctx.globalAlpha = 1;
  }
  function drawDoodles() {
    document.querySelectorAll("canvas.doodle").forEach(function (cv) {
      var ctx = cv.getContext("2d"); ctx.clearRect(0, 0, cv.width, cv.height);
      smileyStar(ctx, cv.width / 2, cv.height / 2, cv.width * 0.33);
    });
  }
  drawDoodles();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawDoodles);
  var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(drawDoodles, 200); });
})();
