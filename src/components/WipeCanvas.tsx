import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TOKENS } from '../data';
import { motion } from '../utils/helpers';

const TRACK_COLORS = [TOKENS.blue, TOKENS.pink, TOKENS.lavender, TOKENS.green];

export const WipeCanvas: React.FC = () => {
  const { wipeActive, motionOn } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !wipeActive || !motionOn) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cell = w >= 768 ? 48 : 32;
    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);
    const maxDiag = cols + rows - 2 || 1;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, w, h);

      if (elapsed < 220) {
        const prog = elapsed / 220;
        const limit = prog * (maxDiag + 1);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (c + r <= limit) {
              ctx.fillStyle = TRACK_COLORS[(c + r) % 4];
              ctx.fillRect(c * cell, r * cell, cell, cell);
            }
          }
        }
      } else {
        const prog = Math.min(1, (elapsed - 220) / 220);
        const limit = prog * (maxDiag + 1);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (c + r > limit) {
              ctx.fillStyle = TRACK_COLORS[(c + r) % 4];
              ctx.fillRect(c * cell, r * cell, cell, cell);
            }
          }
        }
        if (prog >= 1) {
          ctx.clearRect(0, 0, w, h);
          motion.remove(step);
        }
      }
    };

    motion.add(step);

    return () => {
      motion.remove(step);
      if (ctx) ctx.clearRect(0, 0, w, h);
    };
  }, [wipeActive, motionOn]);

  return (
    <canvas
      ref={canvasRef}
      id="wipe-canvas"
      className={wipeActive ? 'is-active' : ''}
      aria-hidden="true"
    />
  );
};
