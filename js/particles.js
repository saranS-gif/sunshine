/* ==========================================================================
   MIDNIGHT BLOOM — Layered Celestial Particle Engine
   Layers: Distant Stars (3 depth planes), Slow-moving Cosmic Dust, Subtle Parallax
   Seed Convergence & Celebratory Falling Petals
   ========================================================================== */

class ParticleEngine {
  constructor() {
    this.starCanvas = document.getElementById('canvas-stars');
    this.particleCanvas = document.getElementById('canvas-particles');
    
    this.starCtx = this.starCanvas ? this.starCanvas.getContext('2d') : null;
    this.particleCtx = this.particleCanvas ? this.particleCanvas.getContext('2d') : null;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Multi-depth star arrays
    this.starsDistant = []; // Layer 3a: Smallest, dimmest (0.4 - 0.8px)
    this.starsMid = [];     // Layer 3b: Mid-range (0.9 - 1.3px)
    this.starsNear = [];    // Layer 3c: Subtle cyan/white (1.4 - 2.0px with glow)

    // Layer 4: Slow-moving cosmic dust
    this.dust = [];
    this.petals = [];
    this.sparks = [];

    // Subtle Parallax offsets
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    this.targetOffsetX = 0;
    this.targetOffsetY = 0;
    this.currentOffsetX = 0;
    this.currentOffsetY = 0;

    // Convergence
    this.isConvergingToSeed = false;
    this.seedTarget = { x: this.width / 2, y: this.height * 0.42 };
    this.convergenceCallback = null;

    this.petalsEnabled = false;
    this.running = true;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    if (!this.starCtx || !this.particleCtx) return;

    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    this.createLayeredStars();
    this.createCosmicDust(38);

    this.bindEvents();
    this.loop();

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', (e) => { this.reducedMotion = e.matches; });
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.seedTarget = { x: this.width / 2, y: this.height * 0.42 };

    [this.starCanvas, this.particleCanvas].forEach(canvas => {
      if (canvas) {
        canvas.width = this.width * this.dpr;
        canvas.height = this.height * this.dpr;
        canvas.style.width = `${this.width}px`;
        canvas.style.height = `${this.height}px`;
      }
    });

    if (this.starCtx) this.starCtx.scale(this.dpr, this.dpr);
    if (this.particleCtx) this.particleCtx.scale(this.dpr, this.dpr);

    this.createLayeredStars();
  }

  bindEvents() {
    // Parallax tracking (subtle and calm)
    const handlePointer = (x, y) => {
      if (this.reducedMotion) return;
      this.targetOffsetX = (x - this.width / 2) / (this.width / 2);
      this.targetOffsetY = (y - this.height / 2) / (this.height / 2);
    };

    window.addEventListener('mousemove', (e) => handlePointer(e.clientX, e.clientY), { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  createLayeredStars() {
    this.starsDistant = [];
    this.starsMid = [];
    this.starsNear = [];

    // Distant Stars (80 stars, faint, slow twinkling)
    for (let i = 0; i < 80; i++) {
      this.starsDistant.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 0.4 + 0.4,
        alpha: Math.random() * 0.35 + 0.15,
        baseAlpha: Math.random() * 0.3 + 0.15,
        twinkleSpeed: Math.random() * 0.008 + 0.003,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: '#94a3b8'
      });
    }

    // Mid Stars (50 stars, clear celestial dots)
    for (let i = 0; i < 50; i++) {
      this.starsMid.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 0.5 + 0.9,
        alpha: Math.random() * 0.4 + 0.3,
        baseAlpha: Math.random() * 0.35 + 0.3,
        twinkleSpeed: Math.random() * 0.015 + 0.006,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: Math.random() < 0.6 ? '#bae6fd' : '#e2e8f0'
      });
    }

    // Near Stars (25 stars, soft cyan glow)
    for (let i = 0; i < 25; i++) {
      this.starsNear.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 0.6 + 1.4,
        alpha: Math.random() * 0.4 + 0.5,
        baseAlpha: Math.random() * 0.3 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: '#7dd3fc'
      });
    }
  }

  createCosmicDust(count) {
    this.dust = [];
    for (let i = 0; i < count; i++) {
      this.dust.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.8 + 0.7,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -(Math.random() * 0.22 + 0.08), // slow atmospheric drift
        alpha: Math.random() * 0.35 + 0.15,
        oscillationSpeed: Math.random() * 0.015 + 0.008,
        angle: Math.random() * Math.PI * 2
      });
    }
  }

  // Cinematic convergence to the seed
  convergeToSeed(targetX, targetY, onComplete) {
    this.isConvergingToSeed = true;
    this.seedTarget = { 
      x: targetX || this.width / 2, 
      y: targetY || this.height * 0.42 
    };
    this.convergenceCallback = onComplete;

    // Inward spiraling stardust
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * Math.min(this.width, this.height) * 0.55 + 60;
      this.sparks.push({
        x: this.seedTarget.x + Math.cos(angle) * dist,
        y: this.seedTarget.y + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        speed: Math.random() * 0.045 + 0.03,
        radius: Math.random() * 2.2 + 1.0,
        color: Math.random() < 0.7 ? '#38bdf8' : '#bae6fd',
        alpha: 1
      });
    }

    setTimeout(() => {
      this.isConvergingToSeed = false;
      this.sparks = [];
      if (this.convergenceCallback) {
        this.convergenceCallback();
        this.convergenceCallback = null;
      }
    }, 2200);
  }

  enablePetals(enable = true) {
    this.petalsEnabled = enable;
    if (enable && this.petals.length < 12) {
      for (let i = 0; i < 18; i++) {
        this.petals.push(this.createPetal(true));
      }
    }
  }

  createPetal(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20,
      size: Math.random() * 7 + 5,
      vx: (Math.random() - 0.5) * 0.6,
      vy: Math.random() * 0.6 + 0.35,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 1.2,
      alpha: Math.random() * 0.4 + 0.25,
      swingSpeed: Math.random() * 0.018 + 0.008,
      swingAmp: Math.random() * 2 + 1,
      swingAngle: Math.random() * Math.PI * 2
    };
  }

  // Gentle celebration shimmer (refined, no harsh explosions)
  celebrateBurst(originX, originY) {
    const x = originX || this.width / 2;
    const y = originY || this.height * 0.35;
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      this.sparks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        gravity: 0.08,
        drag: 0.97,
        radius: Math.random() * 2.2 + 1.2,
        color: ['#7dd3fc', '#bae6fd', '#ffffff', '#38bdf8'][Math.floor(Math.random() * 4)],
        alpha: 1,
        life: 1,
        decay: Math.random() * 0.014 + 0.008
      });
    }
  }

  loop() {
    if (!this.running) return;

    // Smooth lerp parallax offset
    this.currentOffsetX += (this.targetOffsetX - this.currentOffsetX) * 0.05;
    this.currentOffsetY += (this.targetOffsetY - this.currentOffsetY) * 0.05;

    this.renderStars();
    this.renderParticles();

    requestAnimationFrame(() => this.loop());
  }

  renderStars() {
    const ctx = this.starCtx;
    ctx.clearRect(0, 0, this.width, this.height);

    const now = Date.now();
    const ox = this.currentOffsetX;
    const oy = this.currentOffsetY;

    // Plane A: Distant (Parallax 6px)
    this.renderStarLayer(ctx, this.starsDistant, now, ox * 6, oy * 6, false);

    // Plane B: Mid (Parallax 14px)
    this.renderStarLayer(ctx, this.starsMid, now, ox * 14, oy * 14, false);

    // Plane C: Near (Parallax 24px, with subtle bloom)
    this.renderStarLayer(ctx, this.starsNear, now, ox * 24, oy * 24, true);

    ctx.globalAlpha = 1;
  }

  renderStarLayer(ctx, stars, now, px, py, hasHalo) {
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const twinkle = Math.sin(now * s.twinkleSpeed + s.twinkleOffset);
      const alpha = Math.max(0.1, Math.min(1, s.baseAlpha + twinkle * 0.3));

      const drawX = s.x + px;
      const drawY = s.y + py;

      ctx.beginPath();
      ctx.arc(drawX, drawY, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = alpha;
      ctx.fill();

      if (hasHalo) {
        ctx.beginPath();
        ctx.arc(drawX, drawY, s.size * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(125, 211, 252, 0.12)';
        ctx.fill();
      }
    }
  }

  renderParticles() {
    const ctx = this.particleCtx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Slow-moving Cosmic Dust
    for (let i = 0; i < this.dust.length; i++) {
      const d = this.dust[i];
      d.angle += d.oscillationSpeed;
      d.x += d.vx + Math.sin(d.angle) * 0.2;
      d.y += d.vy;

      // Wrap around
      if (d.y < -10) {
        d.y = this.height + 10;
        d.x = Math.random() * this.width;
      }
      if (d.x < -10) d.x = this.width + 10;
      if (d.x > this.width + 10) d.x = -10;

      ctx.save();
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#bae6fd';
      ctx.globalAlpha = d.alpha;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }

    // 2. Converging Stardust & Sparks
    if (this.sparks.length > 0) {
      for (let i = this.sparks.length - 1; i >= 0; i--) {
        const s = this.sparks[i];

        if (this.isConvergingToSeed) {
          const dx = this.seedTarget.x - s.x;
          const dy = this.seedTarget.y - s.y;
          s.x += dx * s.speed;
          s.y += dy * s.speed;
          s.radius *= 0.988;
        } else if (s.gravity !== undefined) {
          s.vx *= s.drag;
          s.vy = s.vy * s.drag + s.gravity;
          s.x += s.vx;
          s.y += s.vy;
          s.life -= s.decay;
          s.alpha = Math.max(0, s.life);

          if (s.life <= 0) {
            this.sparks.splice(i, 1);
            continue;
          }
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      }
    }

    // 3. Falling / Drifting Petals
    if (this.petalsEnabled && this.petals.length > 0) {
      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];
        p.swingAngle += p.swingSpeed;
        p.x += p.vx + Math.sin(p.swingAngle) * p.swingAmp;
        p.y += p.vy;
        p.rotation += p.vRot;

        if (p.y > this.height + 25) {
          this.petals[i] = this.createPetal(false);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(p.size * 0.5, -p.size * 0.4, p.size * 0.7, p.size * 0.7, 0, p.size * 1.3);
        ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.7, -p.size * 0.5, -p.size * 0.4, 0, 0);

        const grad = ctx.createLinearGradient(0, 0, 0, p.size * 1.3);
        grad.addColorStop(0, 'rgba(125, 211, 252, 0.75)');
        grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.5)');
        grad.addColorStop(1, 'rgba(37, 99, 235, 0.3)');

        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.35)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }
    }
  }
}

// Global Particle Instance
window.particles = new ParticleEngine();
