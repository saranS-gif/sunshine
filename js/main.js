/* ==========================================================================
   MIDNIGHT BLOOM — Master Story Orchestrator & Contextual UI Engine
   Manages Transitions: Intro -> Password -> Flower -> Birthday -> Video -> Final
   Features: Contextual UI (Zero Clutter), Emotional Pacing, Audio Coordination
   ========================================================================== */

class StoryOrchestrator {
  constructor() {
    this.screens = {
      intro: document.getElementById('screen-intro'),
      password: document.getElementById('screen-password'),
      flower: document.getElementById('screen-flower'),
      birthday: document.getElementById('screen-birthday'),
      video: document.getElementById('screen-video'),
      final: document.getElementById('screen-final')
    };

    this.currentScreen = 'intro';
    this.init();
  }

  init() {
    this.setupCursorGlow();
    this.bindNavigationButtons();
    this.startIntroSequence();
  }

  // Desktop subtle cursor glow (Disabled on touch devices)
  setupCursorGlow() {
    const cursor = document.querySelector('.custom-cursor-glow');
    if (!cursor) return;

    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }, { passive: true });
    } else {
      cursor.style.display = 'none';
    }
  }

  bindNavigationButtons() {
    // 1. Intro -> Password
    const beginBtn = document.querySelector('.begin-prompt-btn');
    if (beginBtn) {
      beginBtn.addEventListener('click', () => {
        if (window.birthdayManager && !window.birthdayManager.isMusicPlaying) {
          window.birthdayManager.playMusic();
        }
        this.goToScreen('password');
      });
    }

    // 2. Flower -> Birthday Reveal
    const flowerContinue = document.querySelector('.flower-continue-btn');
    if (flowerContinue) {
      flowerContinue.addEventListener('click', () => {
        this.goToScreen('birthday');
      });
    }

    // 3. Birthday -> Surprise Video
    const birthdayContinue = document.querySelector('.birthday-continue-btn');
    if (birthdayContinue) {
      birthdayContinue.addEventListener('click', () => {
        this.goToScreen('video');
      });
    }

    // 4. Video -> Final Emotional Message
    const videoContinue = document.querySelector('.video-continue-btn');
    if (videoContinue) {
      videoContinue.addEventListener('click', () => {
        // Pause video if playing
        const vid = document.getElementById('birthday-video-player');
        if (vid && !vid.paused) {
          vid.pause();
        }
        // Resume background song for the emotional ending
        if (window.birthdayManager && !window.birthdayManager.isMusicPlaying) {
          window.birthdayManager.playMusic();
        }
        this.goToScreen('final');
      });
    }

    // 5. Replay Journey Button
    const replayBtn = document.querySelector('.replay-btn');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        window.location.reload();
      });
    }
  }

  // SCREEN 1: Cinematic Intro Storyline
  startIntroSequence() {
    const line1 = document.querySelector('.intro-line');
    const line2 = document.querySelector('.intro-subline');
    const btn = document.querySelector('.begin-prompt-btn');

    // 1. "Something special is waiting for you…"
    setTimeout(() => {
      if (line1) line1.classList.add('visible');
    }, 800);

    // 2. "But first…"
    setTimeout(() => {
      if (line2) line2.classList.add('visible');
    }, 2400);

    // 3. Step into the future button
    setTimeout(() => {
      if (btn) btn.classList.add('visible');
    }, 3800);
  }

  // Master Screen Transitions with Contextual UI
  goToScreen(targetName) {
    const currentEl = this.screens[this.currentScreen];
    const targetEl = this.screens[targetName];

    if (!targetEl || targetName === this.currentScreen) return;

    // Exit current screen
    if (currentEl) {
      currentEl.classList.remove('active');
      currentEl.classList.add('exit');
      setTimeout(() => {
        currentEl.classList.remove('exit');
      }, 1000);
    }

    // Enter target screen
    setTimeout(() => {
      targetEl.classList.add('active');
      this.currentScreen = targetName;
      this.handleScreenEntry(targetName);
    }, 300);
  }

  handleScreenEntry(name) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (name) {
      case 'flower':
        this.runFlowerSequence();
        break;

      case 'birthday':
        if (window.birthdayManager) {
          window.birthdayManager.triggerRevealSequence();
        }
        break;

      case 'video':
        if (window.videoRevealManager) {
          window.videoRevealManager.triggerBuildup();
        }
        break;

      case 'final':
        this.runFinalSequence();
        break;
    }
  }

  // SCREEN 3: Contextual UI — Flower Blooms in Pure Darkness
  runFlowerSequence() {
    const caption1 = document.querySelector('.flower-caption-1');
    const caption2 = document.querySelector('.flower-caption-2');
    const continueBtn = document.querySelector('.flower-continue-btn');

    // CONTEXTUAL UI: Ensure all text and buttons are initially hidden
    if (caption1) caption1.classList.remove('visible');
    if (caption2) caption2.classList.remove('visible');
    if (continueBtn) continueBtn.classList.remove('visible');

    // Start organic plant blossoming
    if (window.midnightFlower) {
      window.midnightFlower.startBlooming(() => {
        // FLOWER IS FULLY BLOOMED:
        // Section 10: "Flower fully blooms -> 2-second pause -> Background darkens slightly -> Flower remains glowing"
        setTimeout(() => {
          document.body.classList.add('flower-bloomed');

          // Message appears
          if (caption1) caption1.classList.add('visible');

          setTimeout(() => {
            if (caption2) caption2.classList.add('visible');
          }, 1800);

          // Action prompt appears after reading
          setTimeout(() => {
            if (continueBtn) continueBtn.classList.add('visible');
          }, 3400);

        }, 2000); // Strict 2-second cinematic quiet pause
      });
    }
  }

  // SCREEN 6: Final Emotional Message Sequence
  runFinalSequence() {
    const line1 = document.querySelector('.final-line-1');
    const line2 = document.querySelector('.final-line-2');
    const line3 = document.querySelector('.final-line-3');
    const grandLove = document.querySelector('.final-grand-love');
    const flowerContainer = document.querySelector('.final-flower-container');
    const credits = document.querySelector('.final-credits');
    const replayBtn = document.querySelector('.replay-btn');

    // Enable soft floating petals
    if (window.particles) {
      window.particles.enablePetals(true);
    }

    // Slow, intimate, intentional pacing
    setTimeout(() => { if (line1) line1.classList.add('visible'); }, 700);
    setTimeout(() => { if (line2) line2.classList.add('visible'); }, 2500);
    setTimeout(() => { if (line3) line3.classList.add('visible'); }, 4500);
    setTimeout(() => { if (grandLove) grandLove.classList.add('visible'); }, 6600);
    setTimeout(() => { if (flowerContainer) flowerContainer.classList.add('visible'); }, 8200);
    setTimeout(() => { if (credits) credits.classList.add('visible'); }, 9600);
    setTimeout(() => { if (replayBtn) replayBtn.classList.add('visible'); }, 11200);
  }
}

// Instantiate on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.storyApp = new StoryOrchestrator();
});
