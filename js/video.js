/* ==========================================================================
   MIDNIGHT BLOOM — Premium Video Transition & Player Engine
   Sequence: "I made something for you…" -> Screen Darkens -> Blue Ambient Glow
   -> Glass Video Player Emerges -> Audio Coordination -> Emotional Ending Transition
   ========================================================================== */

class VideoRevealManager {
  constructor() {
    this.hook1 = document.querySelector('.video-hook-1');
    this.hook2 = document.querySelector('.video-hook-2');
    this.hook3 = document.querySelector('.video-hook-3');
    this.watchBtn = document.querySelector('.btn-watch-video');
    this.videoWrapper = document.querySelector('.video-player-wrapper');
    this.videoElement = document.getElementById('birthday-video-player');
    this.fallbackBanner = document.querySelector('.video-fallback-banner');
    this.continueBtn = document.querySelector('.video-continue-btn');

    this.initialized = false;
    this.wasMusicPlaying = false;
    this.bindEvents();
  }

  bindEvents() {
    if (this.watchBtn) {
      this.watchBtn.addEventListener('click', () => {
        this.openVideoPlayer();
      });
    }

    if (this.videoElement) {
      // Pause background music when user starts the video
      this.videoElement.addEventListener('play', () => {
        if (window.birthdayManager && window.birthdayManager.isMusicPlaying) {
          window.birthdayManager.pauseMusic();
          this.wasMusicPlaying = true;
        }
        if (this.fallbackBanner) this.fallbackBanner.style.display = 'none';
        if (this.continueBtn) this.continueBtn.classList.add('visible');
      });

      // Video finishes: brief pause -> reveal final button
      this.videoElement.addEventListener('ended', () => {
        setTimeout(() => {
          if (this.continueBtn) this.continueBtn.classList.add('visible');
          if (this.wasMusicPlaying && window.birthdayManager) {
            window.birthdayManager.playMusic();
          }
        }, 1200);
      });

      // If video file is missing or errors
      this.videoElement.addEventListener('error', () => {
        if (this.fallbackBanner) this.fallbackBanner.style.display = 'flex';
        if (this.continueBtn) this.continueBtn.classList.add('visible');
      });
    }
  }

  // Cinematic textual buildup sequence
  triggerBuildup() {
    if (this.initialized) return;
    this.initialized = true;

    // Darken screen for video presentation
    document.body.classList.add('video-scene-active');

    // 1. "I made something for you…"
    setTimeout(() => {
      if (this.hook1) this.hook1.classList.add('visible');
    }, 600);

    // 2. "Words aren't enough."
    setTimeout(() => {
      if (this.hook2) this.hook2.classList.add('visible');
    }, 2400);

    // 3. Subtitle hook
    setTimeout(() => {
      if (this.hook3) this.hook3.classList.add('visible');
    }, 4000);

    // 4. Reveal Watch Button
    setTimeout(() => {
      if (this.watchBtn) this.watchBtn.classList.add('visible');
    }, 5400);
  }

  openVideoPlayer() {
    if (this.watchBtn) this.watchBtn.style.display = 'none';

    if (this.videoWrapper) {
      this.videoWrapper.classList.add('active');
    }

    // Gentle particle slowing for cinematic focus
    if (window.particles) {
      window.particles.dust.forEach(d => {
        d.vy *= 0.35;
      });
    }

    // Pause background song so the video audio is clean
    if (window.birthdayManager && window.birthdayManager.isMusicPlaying) {
      window.birthdayManager.pauseMusic();
      this.wasMusicPlaying = true;
    }

    // Attempt video playback
    if (this.videoElement) {
      const playPromise = this.videoElement.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (this.fallbackBanner) this.fallbackBanner.style.display = 'none';
          if (this.continueBtn) this.continueBtn.classList.add('visible');
        }).catch((err) => {
          // If browser policy prevents unmuted autoplay, show native player ready to tap
          console.log("Video ready for tap-to-play:", err);
          if (this.fallbackBanner) this.fallbackBanner.style.display = 'none';
          if (this.continueBtn) this.continueBtn.classList.add('visible');
        });
      }
    } else {
      if (this.fallbackBanner) this.fallbackBanner.style.display = 'flex';
      if (this.continueBtn) this.continueBtn.classList.add('visible');
    }
  }
}

// Global Video Instance
window.videoRevealManager = new VideoRevealManager();
