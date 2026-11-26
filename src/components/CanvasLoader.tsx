import React, { useEffect, useRef, useState } from 'react';
import { layoutGlyphLines, easeAssemble, motion } from '../utils/helpers';
import { TOKENS } from '../data';

const ACCENT_COLORS = [
  TOKENS.blue,
  TOKENS.pink,
  TOKENS.lavender,
  TOKENS.green,
  TOKENS.coral,
];

interface Particle {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

export const CanvasLoader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fading, setFading] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // If user prefers reduced motion, finish quickly
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 400 : 1800;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // 1. Generate target positions for "AKASH"
    const glyphData = layoutGlyphLines(['AKASH'], 2, true);
    const cellSize = Math.min(10, Math.max(5, Math.floor(w / 40)));
    const textW = glyphData.cols * cellSize;
    const textH = glyphData.rows * cellSize;
    const textOffsetX = (w - textW) / 2;
    const textOffsetY = (h - textH) / 2 - 35;

    // Create particles
    const particles: Particle[] = glyphData.cells.map((c, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (Math.min(w, h) * 0.45) + 60;
      const targetX = textOffsetX + c.x * cellSize;
      const targetY = textOffsetY + c.y * cellSize;

      return {
        sx: targetX + Math.cos(angle) * dist,
        sy: targetY + Math.sin(angle) * dist,
        tx: targetX,
        ty: targetY,
        x: targetX + Math.cos(angle) * dist,
        y: targetY + Math.sin(angle) * dist,
        size: cellSize,
        color: ACCENT_COLORS[i % ACCENT_COLORS.length],
        delay: (Math.random() * 0.35) * duration,
      };
    });

    const startTime = performance.now();
    let isExiting = false;
    let exitStartTime = 0;

    const dismiss = () => {
      if (isExiting) return;
      isExiting = true;
      exitStartTime = performance.now();
      setFading(true);
      setTimeout(() => {
        setFinished(true);
      }, 500);
    };

    const handleSkip = () => dismiss();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        dismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Frame rendering loop
    const frame = (now: number) => {
      if (finished) return;

      const elapsed = now - startTime;
      const rawProg = Math.min(1, elapsed / duration);
      // Smooth non-linear progress curve
      const progress = easeAssemble(rawProg);

      ctx.clearRect(0, 0, w, h);

      // Background fill
      ctx.fillStyle = '#171919';
      ctx.fillRect(0, 0, w, h);

      // Subtle background grid marks
      const gridGap = 32;
      ctx.fillStyle = 'rgba(254, 254, 255, 0.04)';
      for (let gx = 0; gx < w; gx += gridGap) {
        for (let gy = 0; gy < h; gy += gridGap) {
          ctx.fillRect(gx, gy, 2, 2);
        }
      }

      // Corner status readouts
      ctx.font = '10px "Inter Tight", monospace';
      ctx.fillStyle = 'rgba(254, 254, 255, 0.35)';
      ctx.fillText('SYS://AKASH.INIT', 24, 32);

      const statusRight = `BUFFER [${Math.floor(progress * 100).toString().padStart(3, '0')}%]`;
      const rightW = ctx.measureText(statusRight).width;
      ctx.fillText(statusRight, w - rightW - 24, 32);

      // Render logo particles assembling
      const exitProgress = isExiting ? Math.min(1, (now - exitStartTime) / 450) : 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pProg = Math.max(0, Math.min(1, (elapsed - p.delay) / (duration * 0.65)));
        const easedP = easeAssemble(pProg);

        p.x = p.sx + (p.tx - p.sx) * easedP;
        p.y = p.sy + (p.ty - p.sy) * easedP;

        if (exitProgress > 0) {
          p.y -= exitProgress * 40;
        }

        // Color transition from accent colors to white
        if (pProg > 0.85) {
          ctx.fillStyle = '#FEFEFF';
        } else {
          ctx.fillStyle = p.color;
        }

        ctx.fillRect(
          Math.round(p.x),
          Math.round(p.y),
          p.size - 0.5,
          p.size - 0.5
        );
      }

      // Progress bar geometry
      const barW = Math.min(320, w * 0.75);
      const barH = 5;
      const barX = (w - barW) / 2;
      const barY = textOffsetY + textH + 36 + (exitProgress > 0 ? -exitProgress * 25 : 0);

      // Bar outline / empty track
      ctx.fillStyle = 'rgba(254, 254, 255, 0.12)';
      ctx.fillRect(barX, barY, barW, barH);

      // Bar filled blocks
      const filledW = barW * progress;
      ctx.fillStyle = TOKENS.blue;
      ctx.fillRect(barX, barY, filledW, barH);

      // Leading head pixel on progress bar
      if (filledW > 0 && progress < 1) {
        ctx.fillStyle = '#FEFEFF';
        ctx.fillRect(barX + filledW - 3, barY - 1, 3, barH + 2);
      }

      // Dynamic text underneath bar
      let statusText = 'INITIALIZING SYSTEM...';
      if (progress >= 0.98) statusText = 'SYSTEM READY';
      else if (progress >= 0.7) statusText = 'FINALIZING ASSETS...';
      else if (progress >= 0.4) statusText = 'ASSEMBLING PIXELS...';
      else if (progress >= 0.15) statusText = 'CALIBRATING ENGINE...';

      ctx.font = '11px "Inter Tight", monospace';
      ctx.fillStyle = 'rgba(254, 254, 255, 0.6)';
      ctx.fillText(statusText, barX, barY + 24);

      // Percentage counter
      const pctStr = `${Math.floor(progress * 100)}%`;
      const pctW = ctx.measureText(pctStr).width;
      ctx.fillStyle = progress >= 1 ? '#2E5FCE' : '#FEFEFF';
      ctx.fillText(pctStr, barX + barW - pctW, barY + 24);

      // Completion check
      if (elapsed >= duration + 200 && !isExiting) {
        dismiss();
      }

      if (!finished) {
        requestAnimationFrame(frame);
      }
    };

    const animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [finished]);

  if (finished) return null;

  return (
    <div
      className={`canvas-loader-overlay ${fading ? 'is-fading' : ''}`}
      id="canvas-loader"
      role="status"
      aria-label="Loading portfolio"
      onClick={() => setFading(true)}
      title="Click or press Esc to skip"
    >
      <canvas ref={canvasRef} className="canvas-loader-canvas" />
    </div>
  );
};
