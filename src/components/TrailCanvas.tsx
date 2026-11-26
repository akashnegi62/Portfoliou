import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TOKENS } from '../data';
import { motion } from '../utils/helpers';

const TRAIL_COLORS = [
  TOKENS.blue,
  TOKENS.pink,
  TOKENS.green,
  TOKENS.lavender,
  TOKENS.coral,
  TOKENS.mint,
];

export const TrailCanvas: React.FC = () => {
  const { motionOn, menuOpen } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;

    let trailCells: Array<{ gx: number; gy: number; born: number; color: string }> = [];
    let trailRunning = false;
    let trailColorIdx = 0;
    let lastKey = '';

    const sizeCanvas = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    sizeCanvas();
    window.addEventListener('resize', sizeCanvas, { passive: true });

    const tick = (now: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      if (!motionOn) {
        trailCells = [];
        trailRunning = false;
        motion.remove(tick);
        return;
      }

      const alive: typeof trailCells = [];
      for (let i = 0; i < trailCells.length; i++) {
        const c = trailCells[i];
        const age = now - c.born;
        if (age >= 420) continue;
        alive.push(c);
        ctx.fillStyle = c.color;
        if (age < 140) {
          ctx.fillRect(c.gx * 16, c.gy * 16, 16, 16);
        } else if (age < 280) {
          ctx.fillRect(c.gx * 16 + 4, c.gy * 16 + 4, 8, 8);
        } else {
          ctx.fillRect(c.gx * 16 + 6, c.gy * 16 + 6, 4, 4);
        }
      }
      trailCells = alive;
      if (trailCells.length === 0) {
        trailRunning = false;
        motion.remove(tick);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!motionOn || menuOpen) return;
      const gx = Math.floor(e.clientX / 16);
      const gy = Math.floor(e.clientY / 16);
      const key = `${gx},${gy}`;
      if (key === lastKey) return;
      lastKey = key;

      const color = TRAIL_COLORS[trailColorIdx % TRAIL_COLORS.length];
      trailColorIdx++;
      trailCells.push({ gx, gy, born: performance.now(), color });
      if (trailCells.length > 14) trailCells.shift();

      if (!trailRunning) {
        trailRunning = true;
        motion.add(tick);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('resize', sizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      motion.remove(tick);
    };
  }, [motionOn, menuOpen]);

  return <canvas ref={canvasRef} id="trail-canvas" aria-hidden="true" />;
};
