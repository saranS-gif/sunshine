# 🌌 MIDNIGHT BLOOM — Interactive Birthday Surprise Website

> *“A midnight sky where a magical blue flower blooms for someone special.”*

A romantic, cinematic, mobile-first birthday surprise experience built with pure HTML5, CSS3, and modern Vanilla JavaScript. Designed as an emotional interactive love story rather than a standard webpage.

---

## ✨ Features & Story Journey

1. **🌌 Mysterious Midnight Screen** — Ambient dark nebula, twinkling starfield, floating cosmic dust, and slow camera drift.
2. **🔐 Secret Password** — Soft glowing PIN dots, interactive tactile numpad, shake animation on error, and PIN unlock (`2678`).
3. **✨ Stardust Seed Convergence** — On unlock, celestial particles swirl inward from the edges of the universe and coalesce into a radiant glowing seed.
4. **🌱 The Blooming Midnight Flower** — Procedural canvas animation: seed sprouts into an organic stem, glowing cyan sap pulses race through the veins, leaves unfurl, and layers of radiant blue petals bloom organically into a living, breathing flower.
5. **💙 Birthday Reveal** — Dramatic pause, radiant `# HAPPY BIRTHDAY ❤️` header, typewriter subtitle, and celebratory stardust burst.
6. **🎂 Personal Birthday Message** — Deep romantic letter revealed line-by-line with blur-to-focus transitions.
7. **📸 Starlit Memories Gallery** — Cinematic floating glassmorphism polaroids with subtle tilt, glow, and interactive full-resolution lightbox modal.
8. **🎵 Celestial Audio Engine** — Soft background music player with fade-in/fade-out, plus a built-in **Web Audio API procedural ambient synthesizer** that plays gentle, soothing starry night chords automatically if an MP3 file is not supplied!
9. **🎥 Surprise Video Reveal** — Textual buildup, glowing watch button, responsive mobile-friendly player, and graceful fallback card.
10. **❤️ Final Emotional Message & Midnight Bloom Ending** — Meaningful closing words, glowing blue flower, personalized sign-off by Saran, and an infinite celestial star loader badge.

---

## 🎨 Color Palette

| Token | Hex | Role |
| :--- | :--- | :--- |
| **Deep Midnight** | `#020617` | Primary cosmic background |
| **Slate Navy** | `#0F172A` | Card backgrounds & gradients |
| **Royal Blue** | `#1D4ED8` | Buttons & deep petal shadows |
| **Electric Blue** | `#2563EB` | Glowing stem & petal mid-tones |
| **Neon Cyan** | `#38BDF8` | Petal highlights, buttons, glows |
| **Soft Cyan** | `#7DD3FC` | Radiance aura & typography |
| **Pure White** | `#FFFFFF` | Text & starlight |

---

## 📁 Project Structure

```text
sunshine/
├── index.html                  # Main semantic HTML5 story entry
├── README.md                   # Complete documentation & guide
├── .gitignore                  # Git ignore rules
│
├── assets/
│   ├── images/
│   │   ├── flower/             # Optional flower imagery
│   │   ├── memories/           # Photo cards (memory-1.svg, etc.)
│   │   └── background/         # Optional background textures
│   ├── video/
│   │   ├── WhatsApp Video 2026-10-05 at 7.16.52 PM.mp4 # Active surprise video
│   │   └── birthday-video.mp4  # Supported fallback
│   └── audio/
│       └── background-music.mp3# Your background music (optional)
│
├── css/
│   ├── style.css               # Design tokens, layouts & components
│   ├── animations.css          # Keyframes, micro-interactions & pulses
│   └── responsive.css          # Mobile-first breakpoints (360px - 1440px+)
│
└── js/
    ├── particles.js            # Starfield, dust, convergence & petals
    ├── flower.js               # Procedural blooming flower engine
    ├── password.js             # PIN code, keypad & unlock sequence
    ├── birthday.js             # Reveal sequence, typewriter & audio synth
    ├── video.js                # Video buildup & player controls
    └── main.js                 # Story orchestrator & screen flow
```

---

## 🚀 How to Run Locally

Because Midnight Bloom uses standard web technologies without heavy frameworks:

### Option 1: Direct File Opening
Double-click `index.html` to open it directly in any modern browser (Chrome, Safari, Edge, Firefox).

### Option 2: Live Server (Recommended)
If using VS Code or similar editor:
1. Install the **Live Server** extension.
2. Right-click `index.html` and select **"Open with Live Server"**.
3. Access at `http://localhost:5500` on your desktop or phone via local WiFi.

---

## 🛠️ Customization Guide

### 1. How to Change the Password
Open `js/password.js` and edit the first line:
```javascript
const SECRET_PIN = "2678"; // Change to her favorite 4 digits or anniversary date
```

### 2. How to Add Photos to the Memory Gallery
1. Place your photos into `assets/images/memories/` (e.g. `photo1.jpg`, `photo2.jpg`, `photo3.jpg`).
2. In `index.html`, locate the `<div class="memories-deck">` section and update the `src` attribute and caption:
```html
<div class="memory-polaroid">
  <div class="memory-photo-frame">
    <img src="assets/images/memories/photo1.jpg" alt="Our first trip">
  </div>
  <p class="memory-caption">Our trip to the coast ❤️</p>
</div>
```
*(To remove the memory section entirely, simply delete or comment out `<div class="memories-section">...</div>`)*

### 3. How to Replace the Video
1. Place your video in `assets/video/birthday-video.mp4`.
2. H.264 format with `.mp4` extension is recommended for universal iOS and Android playback.
3. If no video is present, the website displays an elegant fallback card without throwing errors.

### 4. How to Replace Background Music
1. Place your song in `assets/audio/background-music.mp3`.
2. If this file is absent, clicking **♪ Music** automatically engages the built-in **procedural Web Audio API synthesizer** to play soothing starry night ambient chords!

### 5. How to Change the Birthday Message
Open `index.html` and locate `<article class="birthday-message-card">`:
```html
<article class="birthday-message-card">
  <p class="message-line">Today is more than just your birthday...</p>
  <p class="message-line">It is the day someone incredibly special came into this world...</p>
  ...
  <div class="message-sign">With all my love, always.</div>
</article>
```
You can add or remove `<p class="message-line">` tags as desired — the reveal animation automatically animates each line smoothly.

---

## 🌐 Deploying to Vercel (Free & Instant)

Deploying takes under 1 minute:

### Via Vercel Web Dashboard (Easiest)
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Midnight Bloom birthday experience"
   git remote add origin https://github.com/YOUR_USERNAME/midnight-bloom.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** -> **"Project"**.
4. Import your GitHub repository.
5. In **Framework Preset**, keep it as **"Other"** (static site).
6. Click **"Deploy"**. Vercel will provide an instant HTTPS URL (e.g., `https://midnight-bloom.vercel.app`) that you can send directly to her phone!

---

## 📱 Mobile Responsiveness Checklist

- [x] Tested at 360px, 375px, 390px, 414px, 768px, 1024px, 1440px+
- [x] Supports `env(safe-area-inset-top)` for iPhone dynamic islands & notches
- [x] Touch keypad targets are comfortably sized (>= 48px)
- [x] Flower canvas scales proportionally without horizontal overflow
- [x] Micro-interactions respond smoothly to touch and mouse movement
- [x] Accessible font hierarchy with high contrast and readable line heights

---

*Made with love, just for you.* — **Saran ❤️**
