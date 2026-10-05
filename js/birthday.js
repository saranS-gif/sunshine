/* ==========================================================================
   MIDNIGHT BLOOM — Birthday Reveal, Letter Sequence & Memory Stack Engine
   Features: 2-Second Cinematic Pause, Blur-to-Focus Typography, 
   Handwritten Pacing, Touch-Swipe Memory Stack & Lightbox Expansion
   ========================================================================== */

class BirthdayManager {
  constructor() {
    this.revealed = false;
    this.preText = document.querySelector('.pre-reveal-text');
    this.title = document.querySelector('.main-birthday-title');
    this.subtitle = document.querySelector('.typewriter-subtitle');
    this.messageLines = document.querySelectorAll('.message-line');
    this.signature = document.querySelector('.message-sign');
    this.continueBtn = document.querySelector('.birthday-continue-btn');

    // Memories Stack
    this.memoriesDeck = document.querySelector('.memories-deck');
    this.memories = Array.from(document.querySelectorAll('.memory-polaroid'));
    this.currentMemoryIndex = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;

    // Lightbox
    this.lightbox = document.querySelector('.memory-lightbox');
    this.lightboxImg = document.querySelector('#lightbox-image');
    this.lightboxCaption = document.querySelector('.lightbox-caption');
    this.lightboxClose = document.querySelector('.lightbox-close');

    // Audio Engine
    this.audioBtn = document.querySelector('.music-btn');
    this.bgAudio = document.getElementById('bg-music-player');
    this.isMusicPlaying = false;

    this.bindEvents();
    this.initAudioSystem();
    this.initMemoryStack();
  }

  bindEvents() {
    // Memory Polaroids Click -> Lightbox
    this.memories.forEach((card, idx) => {
      card.addEventListener('click', () => {
        this.openLightbox(card);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          this.openLightbox(card);
        }
      });
    });

    if (this.lightboxClose && this.lightbox) {
      this.lightboxClose.addEventListener('click', () => this.closeLightbox());
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) this.closeLightbox();
      });
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
          this.closeLightbox();
        }
      });
    }

    // Mobile Swipe Support for Memory Stack
    if (this.memoriesDeck) {
      this.memoriesDeck.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          this.touchStartX = e.touches[0].clientX;
        }
      }, { passive: true });

      this.memoriesDeck.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          this.touchEndX = e.changedTouches[0].clientX;
          this.handleSwipe();
        }
      }, { passive: true });
    }
  }

  // Memory Stack Rotation & Mobile Carousel
  initMemoryStack() {
    if (!this.memories.length) return;
    this.updateMemoryClasses();
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped Left -> Next Card
        this.currentMemoryIndex = (this.currentMemoryIndex + 1) % this.memories.length;
      } else {
        // Swiped Right -> Previous Card
        this.currentMemoryIndex = (this.currentMemoryIndex - 1 + this.memories.length) % this.memories.length;
      }
      this.updateMemoryClasses();
    }
  }

  updateMemoryClasses() {
    this.memories.forEach((card, i) => {
      card.classList.remove('stack-active', 'stack-prev', 'stack-next');
      if (i === this.currentMemoryIndex) {
        card.classList.add('stack-active');
      } else if (i === (this.currentMemoryIndex - 1 + this.memories.length) % this.memories.length) {
        card.classList.add('stack-prev');
      } else {
        card.classList.add('stack-next');
      }
    });
  }

  openLightbox(card) {
    const img = card.querySelector('img');
    const caption = card.querySelector('.memory-caption');
    if (img && this.lightbox && this.lightboxImg) {
      this.lightboxImg.src = img.src;
      if (this.lightboxCaption && caption) {
        this.lightboxCaption.textContent = caption.textContent;
      }
      this.lightbox.classList.add('active');
    }
  }

  closeLightbox() {
    if (this.lightbox) {
      this.lightbox.classList.remove('active');
    }
  }

  // =========================================================================
  // CINEMATIC BIRTHDAY REVEAL SEQUENCE
  // Sequence:
  // Flower fully blooms -> 2-second pause -> Background darkens slightly
  // -> Flower remains glowing -> "Today is your day…" -> Pause -> "HAPPY BIRTHDAY"
  // Typography animated using opacity, blur, scale, letter-spacing (no bouncing)
  // =========================================================================
  triggerRevealSequence() {
    if (this.revealed) return;
    this.revealed = true;

    // Dim background slightly for theatrical immersion
    document.body.classList.add('cinematic-dim');

    // 1. Initial 2-second emotional pause, then "Today is your day…"
    setTimeout(() => {
      if (this.preText) this.preText.classList.add('visible');
    }, 1800);

    // 2. Pause -> "HAPPY BIRTHDAY Sathiya Priya.K ❤️" (with blur-to-focus and letter-spacing)
    setTimeout(() => {
      if (this.title) this.title.classList.add('visible');

      // Delicate celebratory celestial sparks
      if (window.particles) {
        window.particles.enablePetals(true);
        window.particles.celebrateBurst(window.innerWidth * 0.5, window.innerHeight * 0.28);
      }
    }, 3800);

    // 3. Ethereal Subtitle
    setTimeout(() => {
      this.typewriteSubtitle("To the most special person in my world, Sathiya Priya.", 0);
    }, 5400);

    // 4. Staggered Romantic Letter Reveal (One sentence at a time with blur(8px) -> blur(0))
    setTimeout(() => {
      this.revealMessageLines();
    }, 7200);
  }

  typewriteSubtitle(text, index) {
    if (!this.subtitle) return;
    if (index === 0) this.subtitle.textContent = "";

    if (index < text.length) {
      this.subtitle.textContent += text.charAt(index);
      setTimeout(() => {
        this.typewriteSubtitle(text, index + 1);
      }, 48);
    } else {
      setTimeout(() => {
        if (this.subtitle) this.subtitle.style.borderRight = 'none';
      }, 2000);
    }
  }

  revealMessageLines() {
    const delayPerLine = 1350; // slow, intimate, thoughtful pacing

    this.messageLines.forEach((line, index) => {
      setTimeout(() => {
        line.classList.add('visible');
      }, index * delayPerLine);
    });

    // Reveal signature and continue button
    const totalLinesDelay = this.messageLines.length * delayPerLine;
    setTimeout(() => {
      if (this.signature) this.signature.classList.add('visible');
    }, totalLinesDelay + 400);

    setTimeout(() => {
      if (this.continueBtn) this.continueBtn.classList.add('visible');
    }, totalLinesDelay + 1800);
  }

  // =========================================================================
  // AUDIO SYSTEM (Playback & Volume Control)
  // =========================================================================
  initAudioSystem() {
    this.bgAudio = document.getElementById('bg-music-player');
    this.audioBtn = document.querySelector('.music-btn');

    if (this.audioBtn) {
      this.audioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMusic();
      });
    }

    // Start on first user interaction anywhere
    const unlockAudio = () => {
      if (!this.isMusicPlaying) {
        this.playMusic();
      }
    };

    ['click', 'touchstart', 'keydown'].forEach(evt => {
      document.addEventListener(evt, unlockAudio, { once: true, passive: true });
    });
  }

  toggleMusic() {
    if (!this.bgAudio) this.bgAudio = document.getElementById('bg-music-player');
    if (!this.bgAudio) return;

    if (this.bgAudio.paused) {
      this.playMusic();
    } else {
      this.pauseMusic();
    }
  }

  playMusic() {
    if (!this.bgAudio) this.bgAudio = document.getElementById('bg-music-player');
    if (!this.bgAudio) return;

    this.bgAudio.volume = 0.9;
    const playPromise = this.bgAudio.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isMusicPlaying = true;
        if (this.audioBtn) this.audioBtn.classList.add('active');
      }).catch((e) => {
        console.log("Audio waiting for user gesture:", e.name);
        this.isMusicPlaying = false;
        if (this.audioBtn) this.audioBtn.classList.remove('active');
      });
    }
  }

  pauseMusic() {
    if (!this.bgAudio) return;
    this.bgAudio.pause();
    this.isMusicPlaying = false;
    if (this.audioBtn) this.audioBtn.classList.remove('active');
  }
}

// Global Birthday Instance
window.birthdayManager = new BirthdayManager();
