const heartsWrap = document.querySelector(".bg-hearts");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const nopeSection = document.getElementById("nope");
const confettiCanvas = document.getElementById("confettiCanvas");

const prizeSection = document.getElementById("prize");
const scratchCanvas = document.getElementById("scratchCanvas");

const carouselMedia = document.getElementById("carouselMedia");
const prevMedia = document.getElementById("prevMedia");
const nextMedia = document.getElementById("nextMedia");
const playPause = document.getElementById("playPause");

const lockedCard = document.getElementById("lockedCard");
const unlockedCard = document.getElementById("unlockedCard");

const bgMusic = document.getElementById("bgMusic");
const confettiSfx = document.getElementById("confettiSfx");
const revealMusic = document.getElementById("revealMusic");

function safePlay(audioEl, { volume = 0.6, restart = false } = {}) {
  if (!audioEl) return;
  audioEl.volume = volume;
  if (restart) audioEl.currentTime = 0;
  const p = audioEl.play();
  if (p && typeof p.catch === "function") p.catch(() => {});
}

function safeStop(audioEl) {
  if (!audioEl) return;
  audioEl.pause();
  audioEl.currentTime = 0;
}

/* Try autoplay bg music (may be blocked until interaction) */
window.addEventListener("load", () => {
  safePlay(bgMusic, { volume: 0.35 });
});
function startMusicOnce() {
  safePlay(bgMusic, { volume: 0.35 });
  window.removeEventListener("pointerdown", startMusicOnce);
  window.removeEventListener("keydown", startMusicOnce);
}
window.addEventListener("pointerdown", startMusicOnce);
window.addEventListener("keydown", startMusicOnce);

/* ===== Floating hearts ===== */
function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";

  const hearts = ["💙", "💖", "💘", "💗", "💜"];
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

  const left = Math.random() * 100;
  const size = 14 + Math.random() * 22;
  const duration = 5 + Math.random() * 6;
  const drift = (Math.random() * 160 - 80).toFixed(0) + "px";
  const scale = (0.9 + Math.random() * 0.9).toFixed(2);

  heart.style.left = left + "vw";
  heart.style.fontSize = size + "px";
  heart.style.animationDuration = duration + "s";
  heart.style.setProperty("--drift", drift);
  heart.style.setProperty("--scale", scale);

  heartsWrap.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000 + 200);
}
setInterval(spawnHeart, 220);

function showSection(el) {
  el.classList.remove("hidden");
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ===== No button run away ===== */
let noMoves = 0;
noBtn.addEventListener("mouseenter", () => {
  noMoves++;
  const btn = noBtn.getBoundingClientRect();
  const padding = 20;

  const maxX = window.innerWidth - btn.width - padding;
  const maxY = window.innerHeight - btn.height - padding;

  const x = Math.max(padding, Math.random() * maxX);
  const y = Math.max(padding, Math.random() * maxY);

  noBtn.style.position = "fixed";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  if (noMoves >= 4) {
    showSection(nopeSection);
    noMoves = 0;
  }
});
noBtn.addEventListener("click", () => showSection(nopeSection));

/* ===== Confetti ===== */
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  confettiCanvas.width = Math.floor(window.innerWidth * dpr);
  confettiCanvas.height = Math.floor(window.innerHeight * dpr);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function confettiBurst(ms = 1600) {
  const ctx = confettiCanvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const W = confettiCanvas.width;
  const H = confettiCanvas.height;

  const pieces = Array.from({ length: 180 }).map(() => {
    const x = W / 2 + (Math.random() * 140 - 70) * dpr;
    const y = H / 3 + (Math.random() * 60 - 30) * dpr;
    const hue = Math.floor(Math.random() * 360);
    return {
      x,
      y,
      vx: (Math.random() * 10 - 5) * dpr,
      vy: (Math.random() * -10 - 6) * dpr,
      g: (0.28 + Math.random() * 0.16) * dpr,
      s: (4 + Math.random() * 6) * dpr,
      r: Math.random() * Math.PI,
      vr: Math.random() * 0.2 - 0.1,
      a: 1,
      hue
    };
  });

  const start = performance.now();

  function frame(t) {
    const elapsed = t - start;
    ctx.clearRect(0, 0, W, H);

    pieces.forEach(p => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      p.a = Math.max(0, 1 - elapsed / ms);

      ctx.save();
      ctx.globalAlpha = p.a;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${p.a})`;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.65);
      ctx.restore();
    });

    if (elapsed < ms) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, W, H);
  }

  requestAnimationFrame(frame);
}

/* ===== Scratch glitter particles (tiny sparkles) ===== */
function spawnScratchGlitter(x, y) {
  const n = 8;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("div");
    s.className = "scratch-glitter";
    s.textContent = ["✨", "✦", "✧"][Math.floor(Math.random() * 3)];

    const r = scratchCanvas.getBoundingClientRect();
    s.style.left = (r.left + x + window.scrollX) + "px";
    s.style.top = (r.top + y + window.scrollY) + "px";

    document.body.appendChild(s);

    const dx = (Math.random() * 60 - 30);
    const dy = (Math.random() * -50 - 10);

    s.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.6)`, opacity: 0 }
      ],
      { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" }
    );

    setTimeout(() => s.remove(), 600);
  }
}

/* ===== Scratch Card (solid overlay, easier reveal) ===== */
function setupScratchCard() {
  const ticketEl = document.getElementById("ticket");
  const ctx = scratchCanvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  const rect = ticketEl.getBoundingClientRect();

  scratchCanvas.width = Math.floor(rect.width * dpr);
  scratchCanvas.height = Math.floor(rect.height * dpr);
  scratchCanvas.style.width = rect.width + "px";
  scratchCanvas.style.height = rect.height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // SOLID scratch overlay (whitish yellow)
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#f6f1c7";
  ctx.fillRect(0, 0, rect.width, rect.height);

  // subtle texture speckles
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    const r = Math.random() * 1.1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // text
  ctx.fillStyle = "rgba(60,60,60,0.55)";
  ctx.font = "700 18px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("SCRATCH TO REVEAL ✨", rect.width / 2, rect.height / 2);

  const brush = 64;        // easier scratch
  const revealAt = 0.10;   // reveals faster
  let isDown = false;
  let last = null;

  function getPos(e) {
    const r = scratchCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - r.left, y: clientY - r.top };
  }

  function scratchLine(a, b) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brush * 2;

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(b.x, b.y, brush, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";
  }

  function checkReveal() {
    const img = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
    let cleared = 0;
    for (let i = 3; i < img.length; i += 4) if (img[i] === 0) cleared++;
    const ratio = cleared / (img.length / 4);

    if (ratio > revealAt) {
      ctx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
      scratchCanvas.style.pointerEvents = "none";
    }
  }

  function down(e) {
    isDown = true;
    last = getPos(e);
    scratchLine(last, last);
    spawnScratchGlitter(last.x, last.y);
  }

  function move(e) {
    if (!isDown) return;
    const p = getPos(e);
    scratchLine(last, p);
    last = p;
    if (Math.random() < 0.35) spawnScratchGlitter(p.x, p.y);
  }

  function up() {
    if (!isDown) return;
    isDown = false;
    last = null;
    checkReveal();
  }

  scratchCanvas.style.pointerEvents = "auto";

  scratchCanvas.onmousedown = down;
  scratchCanvas.onmousemove = move;
  window.onmouseup = up;

  scratchCanvas.ontouchstart = down;
  scratchCanvas.ontouchmove = move;
  scratchCanvas.ontouchend = up;
}

/* ===== YES click (audio switching) ===== */
yesBtn.addEventListener("click", () => {
  // stop bg
  safeStop(bgMusic);

  // play confetti SFX
  safePlay(confettiSfx, { volume: 0.95, restart: true });

  // show confetti + reveal section
  confettiBurst(1700);
  showSection(prizeSection);

  // start reveal song
  safePlay(revealMusic, { volume: 0.45, restart: true });

  setTimeout(setupScratchCard, 150);
});

/* ===== Carousel (robust paths for GitHub Pages + local) ===== */

// Build a base URL from where this JS file lives:
// .../valentines day/valentines.js  ->  .../KIKI_PHOTOS/
const SCRIPT_URL = new URL(document.currentScript.src);
const MEDIA_BASE = new URL("../KIKI_PHOTOS/", SCRIPT_URL);

// Put ONLY filenames here (must match repo EXACTLY)
const mediaFiles = [
  "IMG_0250.jpeg",
  "IMG_3459.jpeg",
  "IMG_3527.jpeg",
  "IMG_3727.jpeg",
  "IMG_5390.jpeg",
  "IMG_5349.jpeg",
  "IMG_5617.jpeg",
  "IMG_5710.jpeg",
  "IMG_9077.jpeg",
  "IMG_81051.jpg"
];

// Turn them into full URLs that will work everywhere
const mediaItems = mediaFiles.map(name => new URL(name, MEDIA_BASE).href);

let mediaIndex = 0;
let autoPlay = true;
let intervalId = null;

function isVideo(path) {
  return /\.(mp4|webm|mov)$/i.test(path);
}

function preloadNext() {
  const next = mediaItems[(mediaIndex + 1) % mediaItems.length];
  if (!next || isVideo(next)) return;
  const img = new Image();
  img.src = next;
}

function renderMedia() {
  carouselMedia.innerHTML = "";
  const src = mediaItems[mediaIndex];

  if (isVideo(src)) {
    const v = document.createElement("video");
    v.src = src;
    v.controls = true;
    v.playsInline = true;
    v.preload = "metadata";
    carouselMedia.appendChild(v);
  } else {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Memory";

    img.onload = () => preloadNext();

    img.onerror = () => {
      carouselMedia.innerHTML = "";
      const msg = document.createElement("p");
      msg.className = "subtitle";
      msg.textContent =
        "Image not found. Check folder name is exactly 'KIKI_PHOTOS' and filenames/extensions match exactly (.jpeg vs .jpg).";
      carouselMedia.appendChild(msg);
    };

    carouselMedia.appendChild(img);
  }
}

function nextItem() {
  mediaIndex = (mediaIndex + 1) % mediaItems.length;
  renderMedia();
}

function prevItem() {
  mediaIndex = (mediaIndex - 1 + mediaItems.length) % mediaItems.length;
  renderMedia();
}

function startAuto() {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    if (autoPlay) nextItem();
  }, 2600);
}

prevMedia.addEventListener("click", prevItem);
nextMedia.addEventListener("click", nextItem);

playPause.addEventListener("click", () => {
  autoPlay = !autoPlay;
  playPause.textContent = autoPlay ? "Pause" : "Play";
});

renderMedia();
startAuto();
