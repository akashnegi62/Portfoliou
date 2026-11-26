import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TOKENS } from '../data';
import { layoutGlyphLines, makeRng, hashStr, easeMorph, easeAssemble, motion } from '../utils/helpers';

const TRACK_COLORS = [TOKENS.blue, TOKENS.pink, TOKENS.lavender, TOKENS.green];

interface ParticleCycleProps {
  id: string;
  items: ReadonlyArray<{ desktop: string[]; mobile: string[] }>;
  bgColor?: string;
  fgColor?: string;
  yRatio?: number;
  seedPrefix?: string;
}

export const ParticleCycleCanvas: React.FC<ParticleCycleProps> = ({
  id,
  items,
  bgColor = '#171919',
  fgColor = '#FEFEFF',
  yRatio = 0.68,
  seedPrefix = 'hero',
}) => {
  const { motionOn } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cssW = 0;
    let cssH = 0;
    let dpr = 1;
    let isMobile = window.innerWidth < 768;
    let cycleIdx = 0;

    interface Particle {
      sx: number;
      sy: number;
      sw: number;
      sh: number;
      tx: number;
      ty: number;
      tw: number;
      th: number;
      x: number;
      y: number;
      w: number;
      h: number;
      vx: number;
      vy: number;
      delay: number;
      color: string;
      sparkle: boolean;
    }

    let particles: Particle[] = [];
    let morphStart = 0;
    let morphDuration = 1200;
    let isAssembling = true;
    let holdTimer = 0;
    let inView = true;
    let running = false;
    let pointerX = -9999;
    let pointerY = -9999;

    function getTargetLayout(idx: number) {
      const item = items[idx];
      const lines = isMobile ? item.mobile : item.desktop;
      const layout = layoutGlyphLines(lines, 2, true);
      const w = cssW || 1000;
      const h = cssH || 200;
      const maxW = w / layout.cols;
      const maxH_w = (h / layout.rows) * 1.25;
      const cellW = Math.min(maxW, maxH_w);
      const cellH = cellW / 1.25;
      const ox = 0;
      const oy = (h - layout.rows * cellH) * yRatio;
      const cells = layout.cells.map((c) => ({
        nx: (ox + c.x * cellW) / w,
        ny: (oy + c.y * cellH) / h,
        nw: cellW / w,
        nh: cellH / h,
        gx: c.x,
        gy: c.y,
      }));
      return { layout, cellW, cellH, ox, oy, cells };
    }

    function sizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      isMobile = window.innerWidth < 768;
      cssW = rect.width;
      cssH = rect.height;
      if (cssW <= 0 || cssH <= 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function buildParticlesForTarget(idx: number, assembleFromRandom: boolean) {
      const t = getTargetLayout(idx);
      const rng = makeRng(hashStr(`${seedPrefix}-${idx}-${Date.now()}`));
      const newParticles: Particle[] = [];
      const targetCells = t.cells;
      const oldParticles = particles;

      if (assembleFromRandom || oldParticles.length === 0) {
        for (let i = 0; i < targetCells.length; i++) {
          const tc = targetCells[i];
          const sx = assembleFromRandom ? rng() * (1 - tc.nw) : tc.nx;
          const sy = assembleFromRandom ? rng() * (1 - tc.nh) : tc.ny;
          newParticles.push({
            sx,
            sy,
            sw: tc.nw,
            sh: tc.nh,
            tx: tc.nx,
            ty: tc.ny,
            tw: tc.nw,
            th: tc.nh,
            x: sx,
            y: sy,
            w: tc.nw,
            h: tc.nh,
            vx: 0,
            vy: 0,
            delay: assembleFromRandom ? rng() * 400 : 0,
            color: fgColor,
            sparkle: false,
          });
        }
        isAssembling = assembleFromRandom;
        morphDuration = 1200;
      } else {
        const count = Math.max(oldParticles.length, targetCells.length);
        for (let i = 0; i < count; i++) {
          const src = oldParticles[i % oldParticles.length];
          const dst = targetCells[i % targetCells.length];
          const isSparkle = rng() < 0.14;
          newParticles.push({
            sx: src.x,
            sy: src.y,
            sw: src.w,
            sh: src.h,
            tx: dst.nx,
            ty: dst.ny,
            tw: dst.nw,
            th: dst.nh,
            x: src.x,
            y: src.y,
            w: src.w,
            h: src.h,
            vx: 0,
            vy: 0,
            delay: dst.nx * 300,
            color: isSparkle ? TRACK_COLORS[Math.floor(rng() * 4)] : fgColor,
            sparkle: isSparkle,
          });
        }
        isAssembling = false;
        morphDuration = 900;
      }
      particles = newParticles;
      morphStart = performance.now();
    }

    function drawCrispSettled(idx: number) {
      const t = getTargetLayout(idx);
      ctx!.fillStyle = fgColor;
      const rowMap = new Map<number, number[]>();
      for (let i = 0; i < t.layout.cells.length; i++) {
        const c = t.layout.cells[i];
        if (!rowMap.has(c.y)) rowMap.set(c.y, []);
        rowMap.get(c.y)!.push(c.x);
      }
      rowMap.forEach((xs, y) => {
        xs.sort((a, b) => a - b);
        let start = xs[0];
        let prev = xs[0];
        const y0 = Math.round((t.oy + y * t.cellH) * dpr) / dpr;
        const y1 = Math.round((t.oy + (y + 1) * t.cellH) * dpr) / dpr;
        for (let k = 1; k <= xs.length; k++) {
          if (k < xs.length && (xs[k] === prev + 1 || xs[k] === prev)) {
            prev = xs[k];
          } else {
            const x0 = Math.round((t.ox + start * t.cellW) * dpr) / dpr;
            const x1 = Math.round((t.ox + (prev + 1) * t.cellW) * dpr) / dpr;
            ctx!.fillRect(x0, y0, x1 - x0, y1 - y0);
            if (k < xs.length) {
              start = xs[k];
              prev = xs[k];
            }
          }
        }
      });
    }

    function drawStatic(idx = 0) {
      sizeCanvas();
      if (cssW <= 0) return;
      ctx!.fillStyle = bgColor;
      ctx!.fillRect(0, 0, cssW, cssH);
      drawCrispSettled(idx);
    }

    function step(now: number) {
      if (!motionOn) {
        running = false;
        motion.remove(step);
        drawStatic(cycleIdx);
        return;
      }
      if (cssW <= 0) sizeCanvas();
      if (cssW <= 0) return;

      const elapsed = now - morphStart;
      const easeFn = isAssembling ? easeAssemble : easeMorph;
      const t = getTargetLayout(cycleIdx);
      const repelRadius = Math.max(24, t.cellW * 3);
      const maxDispPx = t.cellW * 1.5;

      ctx!.fillStyle = bgColor;
      ctx!.fillRect(0, 0, cssW, cssH);

      const buckets = new Map<string, Particle[]>();
      buckets.set(fgColor, []);
      let allSettled = pointerX < -5000;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const localT = Math.min(1, Math.max(0, (elapsed - p.delay) / morphDuration));
        const e = easeFn(localT);
        const baseX = p.sx + (p.tx - p.sx) * e;
        const baseY = p.sy + (p.ty - p.sy) * e;
        p.w = p.sw + (p.tw - p.sw) * e;
        p.h = p.sh + (p.th - p.sh) * e;

        let targetDx = 0;
        let targetDy = 0;
        if (pointerX > -5000) {
          const px = (baseX + p.w * 0.5) * cssW;
          const py = (baseY + p.h * 0.5) * cssH;
          const dx = px - pointerX;
          const dy = py - pointerY;
          const dist = Math.hypot(dx, dy);
          if (dist > 0.001 && dist < repelRadius) {
            const push = (1 - dist / repelRadius) * maxDispPx;
            targetDx = ((dx / dist) * push) / cssW;
            targetDy = ((dy / dist) * push) / cssH;
          }
        }
        if (localT >= 1 && pointerX < -5000) {
          p.vx = 0;
          p.vy = 0;
          p.x = p.tx;
          p.y = p.ty;
        } else {
          allSettled = false;
          p.vx = (p.vx + (targetDx - (p.x - baseX)) * 0.12) * 0.8;
          p.vy = (p.vy + (targetDy - (p.y - baseY)) * 0.12) * 0.8;
          p.x = baseX + (p.x - baseX) + p.vx;
          p.y = baseY + (p.y - baseY) + p.vy;
        }

        const col = p.sparkle && elapsed < 400 ? p.color : fgColor;
        if (!buckets.has(col)) buckets.set(col, []);
        buckets.get(col)!.push(p);
      }

      if (allSettled && elapsed >= 400) {
        drawCrispSettled(cycleIdx);
      } else {
        buckets.forEach((list, col) => {
          ctx!.fillStyle = col;
          for (let i = 0; i < list.length; i++) {
            const p = list[i];
            const x0 = Math.round(p.x * cssW * dpr) / dpr;
            const y0 = Math.round(p.y * cssH * dpr) / dpr;
            const x1 = Math.round((p.x + p.w) * cssW * dpr) / dpr;
            const y1 = Math.round((p.y + p.h) * cssH * dpr) / dpr;
            ctx!.fillRect(x0, y0, x1 - x0, y1 - y0);
          }
        });
      }
    }

    function scheduleNext() {
      window.clearTimeout(holdTimer);
      if (!motionOn || !inView) return;
      holdTimer = window.setTimeout(() => {
        if (!motionOn || !inView || document.hidden) return;
        cycleIdx = (cycleIdx + 1) % items.length;
        buildParticlesForTarget(cycleIdx, false);
        scheduleNext();
      }, 3200 + morphDuration);
    }

    function startLoop() {
      if (!motionOn) {
        drawStatic(cycleIdx);
        return;
      }
      if (!running) {
        running = true;
        motion.add(step);
      }
      scheduleNext();
    }

    function stopLoop() {
      window.clearTimeout(holdTimer);
      if (running) {
        running = false;
        motion.remove(step);
      }
    }

    sizeCanvas();
    if (motionOn) {
      buildParticlesForTarget(0, true);
      startLoop();
    } else {
      drawStatic(0);
    }

    const handleClick = () => {
      cycleIdx = (cycleIdx + 1) % items.length;
      if (!motionOn) {
        drawStatic(cycleIdx);
        return;
      }
      buildParticlesForTarget(cycleIdx, false);
      scheduleNext();
    };
    canvas.addEventListener('click', handleClick);

    const handlePointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointerX = e.clientX - r.left;
      pointerY = e.clientY - r.top;
    };
    const handlePointerLeave = () => {
      pointerX = -9999;
      pointerY = -9999;
    };

    if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
      canvas.addEventListener('pointermove', handlePointerMove, { passive: true });
      canvas.addEventListener('pointerleave', handlePointerLeave);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          inView = entry.intersectionRatio >= 0.1;
          if (inView && motionOn) startLoop();
          else stopLoop();
        }
      },
      { threshold: [0, 0.1] }
    );
    io.observe(canvas);

    let rTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(rTimer);
      rTimer = window.setTimeout(() => {
        const wasMob = isMobile;
        sizeCanvas();
        if (!motionOn) drawStatic(cycleIdx);
        else if (wasMob !== isMobile) buildParticlesForTarget(cycleIdx, false);
      }, 150);
    });
    ro.observe(canvas);

    return () => {
      stopLoop();
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      io.disconnect();
      ro.disconnect();
    };
  }, [items, bgColor, fgColor, yRatio, seedPrefix, motionOn]);

  return <canvas ref={canvasRef} className="hero-canvas" id={id} aria-hidden="true" />;
};
