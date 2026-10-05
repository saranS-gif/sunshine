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

    this.videoSources = [
      'assets/video/WhatsApp%20Video%202026-10-05%20at%207.16.52%20PM.mp4',
      'assets/video/WhatsApp Video 2026-10-05 at 7.16.52 PM.mp4',
      'assets/video/birthday-video.mp4'
    ];
    this.currentSourceIdx = 0;

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

      // Video finishes: brief pause -> reveal final button & resume melody
      this.videoElement.addEventListener('ended', () => {
        setTimeout(() => {
          if (this.continueBtn) this.continueBtn.classList.add('visible');
          if (this.wasMusicPlaying && window.birthdayManager) {
            window.birthdayManager.playMusic();
          }
        }, 1000);
      });

      // If video file has load error (e.g. 404 or un-uploaded large file)
      this.videoElement.addEventListener('error', (e) => {
        console.warn("Video playback error details:", this.videoElement.error, e);
        
        // Try fallback source if available
        if (this.currentSourceIdx < this.videoSources.length - 1) {
          this.currentSourceIdx++;
          this.videoElement.src = this.videoSources[this.currentSourceIdx];
          this.videoElement.load();
          return;
        }

        if (this.fallbackBanner) {
          this.fallbackBanner.style.display = 'flex';
          const msg = this.fallbackBanner.querySelector('p');
          if (msg) {
            msg.innerHTML = "<b>Video not found on server.</b><br>If viewing on <b>GitHub Pages</b>, files over 100MB cannot be pushed to GitHub, so the video was not uploaded.<br><br>Test locally on your computer, or compress the video below 100MB to host it.";
          }
        }
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

    // Pre-buffer video during textual buildup for instant smooth playback
    if (this.videoElement) {
      if (!this.videoElement.src || this.videoElement.src === window.location.href) {
        this.videoElement.src = this.videoSources[0];
      }
      this.videoElement.preload = 'auto';
      this.videoElement.load();
    }

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

    // Ensure continue button is revealed so user can always progress
    if (this.continueBtn) {
      setTimeout(() => {
        this.continueBtn.classList.add('visible');
      }, 1500);
    }

    // Attempt video playback
    if (this.videoElement) {
      if (!this.videoElement.src || this.videoElement.src === window.location.href) {
        this.videoElement.src = this.videoSources[0];
        this.videoElement.load();
      }

      const playPromise = this.videoElement.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (this.fallbackBanner) this.fallbackBanner.style.display = 'none';
        }).catch((err) => {
          console.log("Video autoplay blocked by browser policy (user can tap native controls):", err);
          if (this.fallbackBanner) this.fallbackBanner.style.display = 'none';
        });
      }
    } else {
      if (this.fallbackBanner) this.fallbackBanner.style.display = 'flex';
    }
  }
}

// Global Video Instance
window.videoRevealManager = new VideoRevealManager();
