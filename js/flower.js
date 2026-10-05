/* ==========================================================================
   MIDNIGHT BLOOM — Realistic Organic Flower Simulation Engine
   Phases: Seed -> Stem Growth -> Leaves Unfolding -> Bud -> Layered Petals
   Features: Natural Wind Sway, Moonlit Radiance Bloom, Touch & Cursor Reaction
   ========================================================================== */

class MidnightFlower {
  constructor() {
    this.canvas = document.getElementById('canvas-flower');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.container = document.querySelector('.flower-canvas-wrapper');
    this.radiance = document.querySelector('.flower-radiance');

    this.width = 380;
    this.height = 460;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Lifecycle progress [0 to 1]
    this.growthProgress = 0;
    this.isBlooming = false;
    this.isFullyBloomed = false;
    this.bloomStartTime = 0;
    this.bloomDuration = 7200; // 7.2s of slow, intentional organic growth

    // Organic Components
    this.leaves = [
      { side: -1, yNorm: 0.38, length: 52, width: 22, unfoldStart: 0.28, unfoldDur: 0.22, currentAngle: 0, currentScale: 0 },
      { side: 1,  yNorm: 0.54, length: 48, width: 20, unfoldStart: 0.40, unfoldDur: 0.22, currentAngle: 0, currentScale: 0 }
    ];

    // Multi-tier Petals: outer (10), mid (8), inner (6)
    this.petals = [];
    this.initPetalLayers();

    // Vascular sap pulses (light traveling up stem)
    this.sapPulses = [];

    // Wind & Environmental Physics
    this.windTime = 0;
    this.windAngle = 0;
    this.stemBend = 0;

    // Interactive Dynamics (Touch & Cursor)
    this.pointerX = null;
    this.pointerY = null;
    this.pointerActive = false;
    this.touchGlow = 0; // extra luminance burst on touch
    this.springAngle = 0;
    this.springVel = 0;
    this.touchSparks = []; // floating firefly embers emitted on touch

    // Orbiting Stardust
    this.orbitParticles = [];
    this.initOrbitParticles(26);

    // Reduced motion flag
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  initPetalLayers() {
    this.petals = [];

    // Tier 1: Outer Layer (10 large deep midnight/cyan petals)
    const count1 = 10;
    for (let i = 0; i < count1; i++) {
      const angle = (i * Math.PI * 2) / count1 + (Math.random() - 0.5) * 0.05;
      this.petals.push({
        layer: 1,
        baseAngle: angle,
        spreadDist: 48,
        width: 32,
        length: 70,
        startProgress: 0.52 + (i % 3) * 0.035, // staggered unfolding
        unfoldDur: 0.32,
        curl: 0.85,
        colorDark: '#081a42',
        colorMid: '#1d4ed8',
        colorLight: '#38bdf8',
        alpha: 0.92
      });
    }

    // Tier 2: Mid Layer (8 radiant azure petals, offset)
    const count2 = 8;
    const offset2 = Math.PI / count2;
    for (let i = 0; i < count2; i++) {
      const angle = (i * Math.PI * 2) / count2 + offset2 + (Math.random() - 0.5) * 0.04;
      this.petals.push({
        layer: 2,
        baseAngle: angle,
        spreadDist: 34,
        width: 25,
        length: 54,
        startProgress: 0.64 + (i % 2) * 0.04,
        unfoldDur: 0.28,
        curl: 0.95,
        colorDark: '#1e40af',
        colorMid: '#38bdf8',
        colorLight: '#7dd3fc',
        alpha: 0.95
      });
    }

    // Tier 3: Inner Core (6 glowing luminous petals)
    const count3 = 6;
    for (let i = 0; i < count3; i++) {
      const angle = (i * Math.PI * 2) / count3 + (Math.random() - 0.5) * 0.03;
      this.petals.push({
        layer: 3,
        baseAngle: angle,
        spreadDist: 20,
        width: 17,
        length: 36,
        startProgress: 0.74 + i * 0.025,
        unfoldDur: 0.22,
        curl: 1.05,
        colorDark: '#2563eb',
        colorMid: '#7dd3fc',
        colorLight: '#ffffff',
        alpha: 0.98
      });
    }
  }

  initOrbitParticles(count) {
    this.orbitParticles = [];
    for (let i = 0; i < count; i++) {
      this.orbitParticles.push({
        radiusX: Math.random() * 65 + 35,
        radiusY: Math.random() * 32 + 18,
        speed: (Math.random() * 0.012 + 0.006) * (Math.random() < 0.5 ? 1 : -1),
        angle: Math.random() * Math.PI * 2,
        size: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.6 + 0.3,
        color: Math.random() < 0.7 ? '#7dd3fc' : '#bae6fd'
      });
    }
  }

  init() {
    if (!this.canvas || !this.ctx) return;
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
    this.bindInteractions();

    // Check media query changes
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', (e) => { this.reducedMotion = e.matches; });
  }

  resize() {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width || 360;
    this.height = rect.height || 440;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);

    if (!this.isBlooming && !this.isFullyBloomed) {
      this.draw(this.growthProgress);
    }
  }

  bindInteractions() {
    // 1. Desktop Cursor Hover Reaction (Only on fine pointers)
    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', (e) => {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        this.pointerX = e.clientX - rect.left;
        this.pointerY = e.clientY - rect.top;
        this.pointerActive = (
          e.clientX >= rect.left - 80 &&
          e.clientX <= rect.right + 80 &&
          e.clientY >= rect.top - 80 &&
          e.clientY <= rect.bottom + 80
        );
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        this.pointerActive = false;
      });
    }

    // 2. Mobile Touch Interaction (Passive to never impede scrolling)
    const handleTouch = (clientX, clientY) => {
      if (!this.container) return;
      const rect = this.container.getBoundingClientRect();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;

      // Check proximity to flower head (~36% from top)
      const flowerHeadY = this.height * 0.36;
      const dist = Math.hypot(localX - this.width / 2, localY - flowerHeadY);

      if (dist < 130) {
        // Excite flower spring
        const pushDir = localX < this.width / 2 ? 0.06 : -0.06;
        this.springVel += pushDir;
        this.touchGlow = Math.min(1, this.touchGlow + 0.45);

        // Emit glowing embers
        for (let i = 0; i < 4; i++) {
          this.touchSparks.push({
            x: localX + (Math.random() - 0.5) * 30,
            y: localY + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -(Math.random() * 1.5 + 0.8),
            radius: Math.random() * 2.2 + 1,
            alpha: 1,
            decay: Math.random() * 0.02 + 0.015
          });
        }
      }
    };

    if (this.canvas) {
      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          handleTouch(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      this.canvas.addEventListener('click', (e) => {
        handleTouch(e.clientX, e.clientY);
      });
    }
  }

  // Master Blossom Sequence Trigger
  startBlooming(onComplete) {
    this.isBlooming = true;
    this.isFullyBloomed = false;
    this.growthProgress = 0;
    this.bloomStartTime = performance.now();
    this.onCompleteCallback = onComplete;

    // Send vascular light pulses up the stem at milestone intervals
    setTimeout(() => this.addSapPulse(), 1500);
    setTimeout(() => this.addSapPulse(), 2800);
    setTimeout(() => this.addSapPulse(), 4000);
    setTimeout(() => this.addSapPulse(), 5200);

    const animate = (now) => {
      const elapsed = now - this.bloomStartTime;
      const linear = Math.min(1, elapsed / this.bloomDuration);

      // Smooth easeOutCubic curve for organic acceleration & deceleration
      this.growthProgress = this.easeOutCubic(linear);
      this.draw(this.growthProgress);

      if (linear < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isBlooming = false;
        this.isFullyBloomed = true;
        this.growthProgress = 1;

        if (this.radiance) this.radiance.classList.add('active');

        // Continuous living loop with physics and wind
        this.livingLoop();

        if (this.onCompleteCallback) {
          this.onCompleteCallback();
          this.onCompleteCallback = null;
        }
      }
    };

    requestAnimationFrame(animate);
  }

  addSapPulse() {
    this.sapPulses.push({
      progress: 0,
      speed: 0.024,
      intensity: 1
    });
  }

  easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  easeOutBack(x) {
    const c1 = 1.6;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }

  // Primary Render Function
  draw(progress) {
    const ctx = this.ctx;
    if (!ctx) return;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // Update natural wind and physics
    this.updatePhysics();

    const seedX = w / 2;
    const seedY = h * 0.88;
    const flowerHeadTargetX = w / 2;
    const flowerHeadTargetY = h * 0.36;

    // Apply wind and spring sway to stem tip
    const swayOffsetX = (this.windAngle + this.springAngle) * (h * 0.45);
    const flowerHeadX = flowerHeadTargetX + swayOffsetX;
    const flowerHeadY = flowerHeadTargetY;

    // 1. Environmental Moonlight Radiance (Pre-flower & bloom glow)
    this.drawEnvironmentalGlow(ctx, flowerHeadX, flowerHeadY, progress);

    // 2. STAGE 1: Glowing Seed (0.00 to 0.22)
    const seedAlpha = Math.max(0, 1 - progress * 2.8);
    if (seedAlpha > 0.01) {
      this.drawSeed(ctx, seedX, seedY, seedAlpha);
    }

    // 3. STAGE 2: Organic Curved Stem (0.06 to 0.58)
    const stemProg = Math.min(1, Math.max(0, (progress - 0.06) / 0.48));
    if (stemProg > 0) {
      this.drawCurvedStem(ctx, seedX, seedY, flowerHeadX, flowerHeadY, stemProg);
    }

    // 4. STAGE 3: Leaves (0.24 to 0.65)
    const leafProg = Math.min(1, Math.max(0, (progress - 0.24) / 0.38));
    if (leafProg > 0) {
      this.drawOrganicLeaves(ctx, seedX, seedY, flowerHeadX, flowerHeadY, leafProg);
    }

    // 5. STAGE 4: Sap Capillary Light Pulses
    this.drawSapPulses(ctx, seedX, seedY, flowerHeadX, flowerHeadY, stemProg);

    // 6. STAGE 5: Swelling Bud to Full Blossom (0.48 to 1.00)
    const bloomProg = Math.min(1, Math.max(0, (progress - 0.48) / 0.52));
    if (bloomProg > 0) {
      this.drawBlossom(ctx, flowerHeadX, flowerHeadY, bloomProg);
    }

    // 7. Interactive Floating Embers
    this.drawTouchSparks(ctx);
  }

  // Realistic moonlight glow falloff
  drawEnvironmentalGlow(ctx, cx, cy, progress) {
    if (progress < 0.1) return;

    const baseIntensity = Math.min(1, (progress - 0.1) * 1.15);
    const pulse = Math.sin(Date.now() * 0.0016) * 0.08;
    const intensity = (baseIntensity * 0.55 + this.touchGlow * 0.45 + pulse);

    const glowRadius = Math.min(this.width, this.height) * 0.55;
    const radial = ctx.createRadialGradient(cx, cy, 5, cx, cy, glowRadius);

    radial.addColorStop(0, `rgba(186, 230, 253, ${0.45 * intensity})`);
    radial.addColorStop(0.3, `rgba(56, 189, 248, ${0.22 * intensity})`);
    radial.addColorStop(0.7, `rgba(37, 99, 235, ${0.08 * intensity})`);
    radial.addColorStop(1, 'rgba(2, 6, 23, 0)');

    ctx.save();
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Seed with soft breathing pulse
  drawSeed(ctx, x, y, alpha) {
    const pulse = 1 + Math.sin(Date.now() * 0.004) * 0.12;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);

    // Outer halo
    ctx.beginPath();
    ctx.arc(0, 0, 14 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.fill();

    // Core seed
    ctx.beginPath();
    ctx.ellipse(0, 0, 4.5 * pulse, 6.5 * pulse, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#bae6fd';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 18;
    ctx.fill();

    ctx.restore();
  }

  // Curved Stem with organic spline & thickness taper
  drawCurvedStem(ctx, startX, startY, endX, endY, progress) {
    const currentEndY = startY - (startY - endY) * progress;
    const currentEndX = startX + (endX - startX) * progress;
    const midY = (startY + endY) * 0.5;

    // Organic growth wiggle
    const wiggle = Math.sin(progress * Math.PI * 1.5) * 14;
    const ctrlX = (startX + currentEndX) * 0.5 - wiggle + this.stemBend * 20;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(ctrlX, midY, currentEndX, currentEndY);

    // Deep luminous indigo-to-cyan gradient
    const stemGrad = ctx.createLinearGradient(startX, startY, currentEndX, currentEndY);
    stemGrad.addColorStop(0, 'rgba(30, 64, 175, 0.45)');
    stemGrad.addColorStop(0.4, '#1d4ed8');
    stemGrad.addColorStop(0.85, '#38bdf8');
    stemGrad.addColorStop(1, '#bae6fd');

    ctx.strokeStyle = stemGrad;
    ctx.lineWidth = 3.6 - progress * 0.8; // tapered naturally
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
    ctx.shadowBlur = 14;
    ctx.stroke();

    ctx.restore();
  }

  // Organic leaves: start folded, unfold, rotate, settle
  drawOrganicLeaves(ctx, startX, startY, endX, endY, progress) {
    this.leaves.forEach((leaf) => {
      const localProg = Math.min(1, Math.max(0, (progress - leaf.unfoldStart) / leaf.unfoldDur));
      if (localProg <= 0) return;

      const scale = this.easeOutBack(localProg);
      const leafStemY = startY - (startY - endY) * leaf.yNorm;
      const leafStemX = startX + (endX - startX) * leaf.yNorm;

      // Natural unfold angle (folded against stem -> natural tilt)
      const targetAngle = leaf.side * 0.55 + Math.sin(this.windTime + leaf.yNorm) * 0.05;
      const currentAngle = (leaf.side * 0.1) + (targetAngle - leaf.side * 0.1) * scale;

      ctx.save();
      ctx.translate(leafStemX, leafStemY);
      ctx.rotate(currentAngle);
      ctx.scale(scale, scale);

      this.drawSingleLeaf(ctx, leaf.side === -1, leaf.width, leaf.length);

      ctx.restore();
    });
  }

  drawSingleLeaf(ctx, isLeft, w, len) {
    ctx.beginPath();
    ctx.moveTo(0, 0);

    const dir = isLeft ? -1 : 1;
    ctx.bezierCurveTo(dir * (w * 0.6), -len * 0.25, dir * w, -len * 0.7, 0, -len);
    ctx.bezierCurveTo(-dir * (w * 0.4), -len * 0.65, -dir * (w * 0.2), -len * 0.2, 0, 0);

    const grad = ctx.createLinearGradient(0, 0, dir * w, -len);
    grad.addColorStop(0, '#1e40af');
    grad.addColorStop(0.5, '#2563eb');
    grad.addColorStop(0.9, '#38bdf8');
    grad.addColorStop(1, '#bae6fd');

    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
    ctx.shadowBlur = 12;
    ctx.fill();

    // Translucent delicate leaf vein
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(dir * (w * 0.15), -len * 0.5, 0, -len * 0.88);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Vascular light pulses ascending the stem
  drawSapPulses(ctx, startX, startY, endX, endY, stemProg) {
    if (stemProg <= 0) return;

    for (let i = this.sapPulses.length - 1; i >= 0; i--) {
      const p = this.sapPulses[i];
      p.progress += p.speed;

      if (p.progress > stemProg) {
        this.sapPulses.splice(i, 1);
        continue;
      }

      const curY = startY - (startY - endY) * p.progress;
      const curX = startX + (endX - startX) * p.progress;

      ctx.save();
      ctx.beginPath();
      ctx.arc(curX, curY, 3.8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#bae6fd';
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.restore();
    }
  }

  // Multi-tier Petal Blossom & Center Pistil Core
  drawBlossom(ctx, cx, cy, progress) {
    ctx.save();
    ctx.translate(cx, cy);

    // Apply gentle head sway with wind & spring
    const headSway = (this.windAngle + this.springAngle) * 0.8;
    ctx.rotate(headSway);

    // STAGE: Swelling Bud (when progress is between 0.0 and 0.4)
    if (progress < 0.4) {
      const budProg = progress / 0.4;
      const budScale = 0.5 + budProg * 0.6;

      ctx.save();
      ctx.scale(budScale, budScale);
      ctx.beginPath();
      ctx.ellipse(0, -10, 10, 18, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#2563eb';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.fill();

      // Sepals wrapping bud
      ctx.beginPath();
      ctx.moveTo(-8, 4);
      ctx.quadraticCurveTo(-14, -10, 0, -22);
      ctx.quadraticCurveTo(14, -10, 8, 4);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    // STAGE: Layered Petals Unfolding
    this.petals.forEach((p) => {
      const localProg = Math.min(1, Math.max(0, (progress - p.startProgress) / p.unfoldDur));
      if (localProg <= 0) return;

      const scale = this.easeOutCubic(localProg);
      const spread = p.spreadDist * scale;
      const extraGlow = this.touchGlow * 0.3;

      ctx.save();
      ctx.rotate(p.baseAngle);
      this.drawRealisticPetal(ctx, 0, -spread, p.width * scale, p.length * scale, p.colorDark, p.colorMid, p.colorLight, p.alpha, extraGlow);
      ctx.restore();
    });

    // STAGE: Radiant Center Pistil & Stamen (Golden-Cyan Core)
    if (progress > 0.45) {
      const coreProg = Math.min(1, (progress - 0.45) * 2);
      const coreScale = this.easeOutBack(coreProg);

      // Luminous center pearl
      ctx.beginPath();
      ctx.arc(0, 0, 12 * coreScale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#bae6fd';
      ctx.shadowBlur = 24 + this.touchGlow * 15;
      ctx.fill();

      // Radiating stamen filaments
      const stamenCount = 14;
      for (let i = 0; i < stamenCount; i++) {
        const sAngle = (i * Math.PI * 2) / stamenCount;
        const sDist = 15 * coreScale;
        const sx = Math.cos(sAngle) * sDist;
        const sy = Math.sin(sAngle) * sDist;

        // Filament stalk
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Anther tip
        ctx.beginPath();
        ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = '#bae6fd';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.fill();
      }
    }

    // STAGE: Orbiting Stardust Fireflies
    if (this.isFullyBloomed) {
      this.orbitParticles.forEach((p) => {
        p.angle += p.speed;
        const px = Math.cos(p.angle) * p.radiusX;
        const py = Math.sin(p.angle) * p.radiusY - 8;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#bae6fd';
        ctx.shadowBlur = 10;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    ctx.restore();
  }

  // Realistic Petal with Bezier curvature and layered shading
  drawRealisticPetal(ctx, x, y, width, length, colDark, colMid, colLight, alpha, extraGlow = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = Math.min(1, alpha + extraGlow);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-width * 0.75, -length * 0.35, -width, -length * 0.8, 0, -length);
    ctx.bezierCurveTo(width, -length * 0.8, width * 0.75, -length * 0.35, 0, 0);

    const grad = ctx.createLinearGradient(0, 0, 0, -length);
    grad.addColorStop(0, colDark);
    grad.addColorStop(0.55, colMid);
    grad.addColorStop(1, colLight);

    ctx.fillStyle = grad;
    ctx.shadowColor = colLight;
    ctx.shadowBlur = 16 + extraGlow * 20;
    ctx.fill();

    // Central translucent spine
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -length * 0.88);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  // Interactive Floating Sparks
  drawTouchSparks(ctx) {
    for (let i = this.touchSparks.length - 1; i >= 0; i--) {
      const s = this.touchSparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= s.decay;

      if (s.alpha <= 0) {
        this.touchSparks.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#bae6fd';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.globalAlpha = s.alpha;
      ctx.fill();
      ctx.restore();
    }
  }

  // Physics update (Natural wind + Spring dynamics + Pointer tracking)
  updatePhysics() {
    if (this.reducedMotion) {
      this.windAngle = 0;
      this.springAngle = 0;
      this.stemBend = 0;
      return;
    }

    // 1. Natural Environmental Wind (Gentle low-amplitude oscillation: left -> center -> right)
    this.windTime += 0.016;
    const windBreeze = Math.sin(this.windTime * 0.85) * 0.022 + Math.sin(this.windTime * 0.38) * 0.012;
    this.windAngle = windBreeze;
    this.stemBend = Math.sin(this.windTime * 0.6) * 0.015;

    // 2. Cursor Attraction (Desktop)
    if (this.pointerActive && this.pointerX !== null) {
      const targetAngle = (this.pointerX - this.width / 2) / (this.width * 2) * 0.08;
      this.springVel += (targetAngle - this.springAngle) * 0.04;
    }

    // 3. Damped Spring Return
    this.springVel -= this.springAngle * 0.08; // restoring force
    this.springVel *= 0.88; // air resistance damping
    this.springAngle += this.springVel;

    // 4. Touch Glow decay
    if (this.touchGlow > 0.005) {
      this.touchGlow *= 0.94;
    } else {
      this.touchGlow = 0;
    }
  }

  // Living Loop for Post-Bloom Organic Swaying & Interaction
  livingLoop() {
    if (!this.isFullyBloomed) return;
    this.draw(1);
    requestAnimationFrame(() => this.livingLoop());
  }
}

// Global Flower Instance
window.midnightFlower = new MidnightFlower();
