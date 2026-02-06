// valentines.js (paste this whole file)

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

const bgMusic = document.getElementById("bgMusic");
const confettiSfx = document.getElementById("confettiSfx");
const revealMusic = document.getElementById("revealMusic");

const reasonBtn = document.getElementById("reasonBtn");
const reasonCards = document.getElementById("reasonCards");

const scriptureCard = document.getElementById("scriptureCard");
const prevVerse = document.getElementById("prevVerse");
const nextVerse = document.getElementById("nextVerse");

/* =========================
   AUDIO HELPERS
========================= */
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

/* Autoplay (usually blocked until user taps) */
window.addEventListener("load", () => safePlay(bgMusic, { volume: 0.33 }));
function startMusicOnce() {
  safePlay(bgMusic, { volume: 0.33 });
  window.removeEventListener("pointerdown", startMusicOnce);
  window.removeEventListener("keydown", startMusicOnce);
}
window.addEventListener("pointerdown", startMusicOnce);
window.addEventListener("keydown", startMusicOnce);

/* =========================
   FLOATING HEARTS
========================= */
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

/* =========================
   NO BUTTON RUN AWAY
========================= */
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

/* =========================
   CONFETTI
========================= */
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

/* =========================
   REASONS BUTTON (CYCLES)
========================= */
const reasons = [
  { icon: "💙", title: "You’re my best friend", text: "Life feels safer and happier with you in it." },
  { icon: "✨", title: "You bring peace", text: "You calm my mind and make home feel like home." },
  { icon: "🌷", title: "You’re kind", text: "The way you love people is rare and real." },
  { icon: "🧠", title: "You inspire me", text: "You make me want to be better—every single day." },

  // Faith-forward
  { icon: "✝️", title: "You help me love like Christ", text: "You push me toward patience, humility, and purpose." },
  { icon: "🙏", title: "I thank God for you", text: "You’re one of my biggest blessings, and I don’t take that lightly." },
  { icon: "📖", title: "Our love has a foundation", text: "I want us rooted in God—always, not just when it’s easy." },
  { icon: "🕊️", title: "You reflect grace", text: "Your heart reminds me what gentle strength looks like." }
];

let reasonIndex = 0;

function renderReasonCard() {
  if (!reasonCards) return;
  reasonCards.innerHTML = "";

  const r = reasons[reasonIndex];

  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <div class="icon">${r.icon}</div>
    <h3>${r.title}</h3>
    <p>${r.text}</p>
  `;

  // Add a few extra filler cards so the section still looks full on desktop
  // (optional but looks nicer)
  const filler = [];
  for (let i = 1; i <= 3; i++) {
    const idx = (reasonIndex + i) % reasons.length;
    const rr = reasons[idx];
    const c = document.createElement("article");
    c.className = "card";
    c.innerHTML = `
      <div class="icon">${rr.icon}</div>
      <h3>${rr.title}</h3>
      <p>${rr.text}</p>
    `;
    filler.push(c);
  }

  reasonCards.appendChild(card);
  filler.forEach(x => reasonCards.appendChild(x));
}

if (reasonBtn) {
  reasonBtn.addEventListener("click", () => {
    reasonIndex = (reasonIndex + 1) % reasons.length;
    renderReasonCard();
  });
}
renderReasonCard();

/* =========================
   SCRIPTURE CAROUSEL
========================= */
const verses = [
  { ref: "1 Corinthians 13:4–7", text: "Love is patient, love is kind… it always protects, trusts, hopes, and perseveres." },
  { ref: "Ecclesiastes 4:9–10", text: "Two are better than one… if either falls, the other can help them up." },
  { ref: "Proverbs 18:22", text: "He who finds a wife finds what is good and receives favor from the Lord." },
  { ref: "Psalm 37:4", text: "Delight yourself in the Lord, and He will give you the desires of your heart." },
  { ref: "Colossians 3:14", text: "Over all these virtues put on love, which binds them all together in perfect unity." }
];

let verseIndex = 0;

function renderVerse() {
  if (!scriptureCard) return;
  const v = verses[verseIndex];
  scriptureCard.innerHTML = `<div><strong>${v.ref}</strong></div><div style="margin-top:8px; opacity:.95;">${v.text}</div>`;
}
renderVerse();

if (prevVerse) prevVerse.addEventListener("click", () => { verseIndex = (verseIndex - 1 + verses.length) % verses.length; renderVerse(); });
if (nextVerse) nextVerse.addEventListener("click", () => { verseIndex = (verseIndex + 1) % verses.length; renderVerse(); });

/* =========================
   SCRATCH GLITTER
========================= */
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

/* =========================
   SCRATCH CARD
========================= */
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

  // texture speckles
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

  const brush = 64;
  const revealAt = 0.10;
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

  // Mouse
  scratchCanvas.onmousedown = down;
  scratchCanvas.onmousemove = move;
  window.onmouseup = up;

  // Touch (PREVENT SCROLL)
  scratchCanvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    down(e);
  }, { passive: false });

  scratchCanvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    move(e);
  }, { passive: false });

  scratchCanvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    up(e);
  }, { passive: false });
}

/* YES click: stop bg, play confetti, then reveal music */
yesBtn.addEventListener("click", () => {
  safeStop(bgMusic);

  safePlay(confettiSfx, { volume: 0.95, restart: true });
  confettiBurst(1700);
  showSection(prizeSection);

  safePlay(revealMusic, { volume: 0.42, restart: true });

  setTimeout(setupScratchCard, 150);
});

/* =========================
   CAROUSEL (ABSOLUTE URLS)
   You already confirmed these work:
   https://.../KIKI_PHOTOS/IMG_0250.jpeg
========================= */
const mediaItems = [
  "https://scaiaticsinger85.github.io/Kikis-valentinesday-gift/KIKI_PHOTOS/IMG_0250.jpeg",
  "https://scaiaticsinger85.github.io/Kikis-valentinesday-gift/KIKI_PHOTOS/IMG_3459.jpeg",
  "https://scaiaticsinger85.github.io/Kikis-valentinesday-gift/KIKI_PHOTOS/IMG_3527.jpeg",
  "https://scaiaticsinger85.github.io/Kikis-valentinesday-gift/KIKI_PHOTOS/IMG_3727.jpeg",
  "https://scaiaticsinger85.github.io/Kikis-valentinesday-gift/KIKI_PHOTOS/IMG_5390.jpeg",
  "https://scaiaticsinger85.github.io/Kikis-valentinesday-gift/KIKI_PHOTOS/IMG_5349.jpeg",
  "https://scaiaticsinger85.github.io/Kikis-valentinesday-gift/KIKI_PHOTOS/IMG_5617.jpeg",
  "https://scaiaticsinger85.github.io/Kikis-valentinesday-gift/KIKI_PHOTOS/IMG_5710.jpeg",
  "https://scaiaticsinger85.github.io/Kikis-valentinesday-gift/KIKI_PHOTOS/IMG_9077.jpeg",
  "https://scaiaticsinger85.github.io/Kikis-valentinesday-gift/KIKI_PHOTOS/IMG_81051.jpg"
];

let mediaIndex = 0;
let autoPlay = true;
let intervalId = null;

function preloadNext() {
  const next = mediaItems[(mediaIndex + 1) % mediaItems.length];
  const img = new Image();
  img.src = next;
}

function renderMedia() {
  if (!carouselMedia) return;
  carouselMedia.innerHTML = "";

  const src = mediaItems[mediaIndex];
  const img = document.createElement("img");
  img.src = src;
  img.alt = "Memory";

  img.onload = () => preloadNext();
  img.onerror = () => {
    carouselMedia.innerHTML = `<p class="subtitle">Couldn’t load an image. Double-check the URL + filename.</p>`;
  };

  carouselMedia.appendChild(img);
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

prevMedia?.addEventListener("click", prevItem);
nextMedia?.addEventListener("click", nextItem);

playPause?.addEventListener("click", () => {
  autoPlay = !autoPlay;
  playPause.textContent = autoPlay ? "Pause" : "Play";
});

renderMedia();
startAuto();
