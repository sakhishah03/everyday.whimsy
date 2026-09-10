/* ===== everyday whimsy ===== */
(function () {
  "use strict";

  /* ---------- day / night sky ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById("toggle");
  var icon = document.getElementById("toggle-icon");
  var label = document.getElementById("toggle-label");

  function apply(mode) {
    if (mode === "night") { root.setAttribute("data-theme", "night"); icon.textContent = "☀"; label.textContent = "day"; }
    else { root.removeAttribute("data-theme"); icon.textContent = "☾"; label.textContent = "night"; }
    setTimeout(drawDoodles, 50); // redraw crayon in the new colours
  }
  var saved;
  try { saved = localStorage.getItem("ew-mode"); } catch (e) {}
  apply(saved || "day");

  toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "night" ? "day" : "night";
    apply(next);
    try { localStorage.setItem("ew-mode", next); } catch (e) {}
  });

  /* ---------- lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbCap = document.getElementById("lb-cap");

  document.querySelectorAll(".photo").forEach(function (fig) {
    fig.addEventListener("click", function () {
      var img = fig.querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = fig.getAttribute("data-cap") || "";
      lb.classList.add("open");
    });
  });
  function closeLb() { lb.classList.remove("open"); }
  lb.addEventListener("click", closeLb);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLb(); });

  /* ---------- crayon doodles: colored-in, rough wobbly outline (drawn by hand, not vector-clean) ---------- */
  function cssVar(name) {
    return getComputedStyle(root).getPropertyValue(name).trim() || "#d99a2b";
  }
  function starPath(ctx, cx, cy, outer, inner, spikes, jitter) {
    ctx.beginPath();
    var rot = -Math.PI / 2, step = Math.PI / spikes;
    for (var i = 0; i < spikes * 2; i++) {
      var r = (i % 2 === 0 ? outer : inner) * (1 + (Math.random() - 0.5) * jitter);
      var x = cx + Math.cos(rot) * r, y = cy + Math.sin(rot) * r;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      rot += step;
    }
    ctx.closePath();
  }
  function crayonStar(ctx, cx, cy, R, spikes, fill, ink) {
    var inner = R * (spikes === 4 ? 0.36 : 0.44), jit = 0.13;
    // 1) scribble-fill inside the star (like coloring it in with a crayon)
    ctx.save();
    starPath(ctx, cx, cy, R, inner, spikes, jit);
    ctx.clip();
    ctx.strokeStyle = fill; ctx.lineCap = "round";
    for (var i = 0; i < 110; i++) {
      ctx.globalAlpha = 0.07 + Math.random() * 0.10;
      ctx.lineWidth = 2 + Math.random() * 3.5;
      var x = cx + (Math.random() - 0.5) * R * 2.2, y = cy + (Math.random() - 0.5) * R * 2.2;
      var a = Math.random() * Math.PI, len = R * (0.5 + Math.random() * 0.8);
      ctx.beginPath();
      ctx.moveTo(x - Math.cos(a) * len, y - Math.sin(a) * len);
      ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    // 2) a few wobbly outline passes in ink — re-jittered each pass so it never looks clean
    ctx.strokeStyle = ink; ctx.lineJoin = "round"; ctx.lineCap = "round";
    for (var p = 0; p < 3; p++) {
      ctx.globalAlpha = 0.55 + Math.random() * 0.3;
      ctx.lineWidth = 2.6 + Math.random() * 1.4;
      starPath(ctx, cx + (Math.random() - 0.5) * 2, cy + (Math.random() - 0.5) * 2, R * (1 + (Math.random() - 0.5) * 0.04), inner, spikes, jit);
      ctx.stroke();
    }
    // a couple of little shine ticks beside it
    ctx.globalAlpha = 0.8; ctx.lineWidth = 2.4;
    for (var t = 0; t < 3; t++) {
      var ta = Math.random() * Math.PI * 2, td = R * (1.25 + Math.random() * 0.25);
      var sx = cx + Math.cos(ta) * td, sy = cy + Math.sin(ta) * td;
      ctx.beginPath(); ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(ta) * 7, sy + Math.sin(ta) * 7); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function drawDoodles() {
    document.querySelectorAll("canvas.doodle").forEach(function (cv) {
      var ctx = cv.getContext("2d");
      ctx.clearRect(0, 0, cv.width, cv.height);
      var cx = cv.width / 2, cy = cv.height / 2, R = cv.width * 0.34;
      if (cv.dataset.shape === "sparkle") crayonStar(ctx, cx, cy, R, 4, cssVar("--coral"), cssVar("--ink"));
      else crayonStar(ctx, cx, cy, R, 5, cssVar("--marigold"), cssVar("--ink"));
    });
  }
  // fonts/colours ready -> draw. Redraw once webfonts settle & on resize.
  drawDoodles();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawDoodles);
  var rt;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(drawDoodles, 200); });
})();
