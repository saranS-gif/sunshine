/* ==========================================================================
   MIDNIGHT BLOOM — Premium Password Experience
   Passcode: 2678
   Features: Individual Dot Pop (1.0 -> 1.15 -> 1.0), Gentle Error Shake & Hue,
   Cinematic Dissolve & Particle Convergence into the Flower Seed
   ========================================================================== */

const SECRET_PIN = "2678";

class PasswordManager {
  constructor() {
    this.currentInput = "";
    this.maxDigits = 4;
    this.isUnlocking = false;

    // Elements
    this.dots = document.querySelectorAll('.pin-dot');
    this.card = document.querySelector('.card-glass');
    this.feedback = document.querySelector('.password-feedback');
    this.unlockBtn = document.querySelector('.btn-unlock');
    this.hiddenInput = document.querySelector('.hidden-password-input');
    this.keypadButtons = document.querySelectorAll('.key-btn');
    this.flashOverlay = document.querySelector('.flash-overlay');

    this.bindEvents();
  }

  bindEvents() {
    // 1. Touch & Click Keypad
    this.keypadButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.isUnlocking) return;

        const val = btn.getAttribute('data-key');
        if (val === 'clear') {
          this.clearInput();
        } else if (val === 'backspace') {
          this.removeDigit();
        } else if (val !== null) {
          this.addDigit(val);
        }
      });
    });

    // 2. Physical & Bluetooth Keyboard
    window.addEventListener('keydown', (e) => {
      if (this.isUnlocking) return;

      const screen = document.getElementById('screen-password');
      if (!screen || !screen.classList.contains('active')) return;

      if (e.key >= '0' && e.key <= '9') {
        this.addDigit(e.key);
      } else if (e.key === 'Backspace') {
        this.removeDigit();
      } else if (e.key === 'Enter') {
        this.attemptUnlock();
      }
    });

    // 3. Unlock Action Button
    if (this.unlockBtn) {
      this.unlockBtn.addEventListener('click', () => {
        this.attemptUnlock();
      });
    }

    // 4. Mobile Software Keyboard Fallback
    if (this.card && this.hiddenInput) {
      this.card.addEventListener('click', () => {
        this.hiddenInput.focus();
      });

      this.hiddenInput.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
        this.currentInput = val;
        this.updateDots();
        if (this.currentInput.length === 4) {
          setTimeout(() => this.attemptUnlock(), 240);
        }
      });
    }
  }

  addDigit(digit) {
    if (this.currentInput.length >= this.maxDigits) return;

    const newIndex = this.currentInput.length;
    this.currentInput += digit;

    this.animateDotPop(newIndex);
    this.updateDots();
    this.clearFeedback();

    // Auto unlock when all 4 digits entered
    if (this.currentInput.length === this.maxDigits) {
      setTimeout(() => {
        this.attemptUnlock();
      }, 280);
    }
  }

  removeDigit() {
    if (this.currentInput.length === 0) return;
    this.currentInput = this.currentInput.slice(0, -1);
    this.updateDots();
    this.clearFeedback();
  }

  clearInput() {
    this.currentInput = "";
    this.updateDots();
    this.clearFeedback();
  }

  updateDots() {
    this.dots.forEach((dot, index) => {
      if (index < this.currentInput.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
        dot.classList.remove('pop');
      }
    });
  }

  // Animation: dot appears -> small blue glow -> scale 1.0 -> 1.15 -> 1.0
  animateDotPop(index) {
    const dot = this.dots[index];
    if (!dot) return;

    dot.classList.remove('pop');
    void dot.offsetWidth; // Force reflow
    dot.classList.add('pop');
  }

  clearFeedback() {
    if (this.feedback) {
      this.feedback.className = 'password-feedback';
      this.feedback.textContent = '';
    }
    if (this.card) {
      this.card.classList.remove('shake-warning');
      this.card.classList.remove('error-glow');
    }
  }

  attemptUnlock() {
    if (this.isUnlocking) return;

    if (this.currentInput.length < this.maxDigits) {
      this.showError("Enter 4 numbers ✦");
      return;
    }

    if (this.currentInput === SECRET_PIN) {
      this.handleSuccess();
    } else {
      this.handleFailure();
    }
  }

  // Incorrect: Gentle horizontal shake + soft red/blue glow + smooth reset
  handleFailure() {
    if (this.card) {
      this.card.classList.remove('shake-warning');
      this.card.classList.remove('error-glow');
      void this.card.offsetWidth; // Force reflow
      this.card.classList.add('shake-warning');
      this.card.classList.add('error-glow');
    }

    this.showError("Not quite… try again ❤️");

    setTimeout(() => {
      this.clearInput();
      if (this.card) {
        this.card.classList.remove('error-glow');
      }
    }, 850);
  }

  showError(msg) {
    if (this.feedback) {
      this.feedback.textContent = msg;
      this.feedback.className = 'password-feedback show-error';
    }
  }

  // Correct: Input glow -> UI blur -> Particles gather -> Blue light expands -> Dissolve -> Flower begins
  handleSuccess() {
    this.isUnlocking = true;

    if (this.feedback) {
      this.feedback.textContent = "Welcome, Sathiya Priya.K ✨";
      this.feedback.className = 'password-feedback show-success';
    }

    // Start background music gently
    if (window.birthdayManager && !window.birthdayManager.isMusicPlaying) {
      window.birthdayManager.playMusic();
    }

    // 1. Password dots radiant glow
    this.dots.forEach(dot => {
      dot.classList.add('unlocked-glow');
    });

    if (this.unlockBtn) {
      this.unlockBtn.classList.add('unlocked-glow');
    }

    // 2. UI Blur & dissolve
    setTimeout(() => {
      if (this.card) {
        this.card.style.transition = 'filter 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        this.card.style.filter = 'blur(16px)';
        this.card.style.opacity = '0';
        this.card.style.transform = 'scale(0.92) translateY(15px)';
      }

      // 3. Particles gather towards the center flower seed coordinates
      const targetY = window.innerHeight * 0.44;
      if (window.particles) {
        window.particles.convergeToSeed(window.innerWidth / 2, targetY);
      }

      // 4. Blue atmospheric light expansion
      setTimeout(() => {
        if (this.flashOverlay) {
          this.flashOverlay.classList.add('active');
        }

        // 5. Flower scene begins (with all UI hidden!)
        setTimeout(() => {
          if (window.storyApp) {
            window.storyApp.goToScreen('flower');
          }

          setTimeout(() => {
            if (this.flashOverlay) {
              this.flashOverlay.classList.remove('active');
            }
          }, 600);
        }, 800);

      }, 1400);

    }, 500);
  }
}

// Global Password Instance
window.passwordManager = new PasswordManager();
