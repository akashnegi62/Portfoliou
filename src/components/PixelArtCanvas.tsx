import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { type ProjectItem } from '../data';
import { makeRng, hashStr, motion } from '../utils/helpers';

interface PixelArtCanvasProps {
  project: ProjectItem;
  blockSize?: number;
  skipAssemble?: boolean;
  className?: string;
}

export const PixelArtCanvas: React.FC<PixelArtCanvasProps> = ({
  project,
  blockSize = 1,
  skipAssemble = false,
  className = 'portrait-canvas',
}) => {
  const { motionOn } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rows = project.art.rows;
    const pal = project.art.pal;

    function poolGrid(srcRows: string[], bSize: number): string[] {
      if (bSize <= 1) return srcRows;
      const out: string[] = [];
      for (let y = 0; y < 32; y += bSize) {
        const blockRows: string[] = [];
        for (let dy = 0; dy < bSize; dy++) blockRows.push('');
        for (let x = 0; x < 32; x += bSize) {
          const counts = [0, 0, 0, 0];
          for (let dy = 0; dy < bSize; dy++) {
            const r = srcRows[y + dy];
            for (let dx = 0; dx < bSize; dx++) {
              counts[Number(r[x + dx]) || 0]++;
            }
          }
          let bestIdx = 0;
          let bestCount = -1;
          for (let c = 0; c < 4; c++) {
            if (counts[c] > bestCount) {
              bestCount = counts[c];
              bestIdx = c;
            }
          }
          const ch = String(bestIdx);
          for (let dy = 0; dy < bSize; dy++) {
            blockRows[dy] += ch.repeat(bSize);
          }
        }
        for (let dy = 0; dy < bSize; dy++) out.push(blockRows[dy]);
      }
      return out;
    }

    const currentGrid = poolGrid(rows, blockSize);
    let assembled = !motionOn || skipAssemble;
    let assembleStart = 0;
    let animActive = false;
    let lastSize = 0;

    const rng = makeRng(hashStr(project.id));
    const fgIndices: number[] = [];
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        if (currentGrid[y][x] !== '0') fgIndices.push(y * 32 + x);
      }
    }
    for (let i = fgIndices.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = fgIndices[i];
      fgIndices[i] = fgIndices[j];
      fgIndices[j] = tmp;
    }
    const orderRank = new Int16Array(1024).fill(-1);
    fgIndices.forEach((pos, idx) => {
      orderRank[pos] = idx;
    });

    function sizeCanvas(): boolean {
      const rect = canvas!.getBoundingClientRect();
      const cssSize = Math.round(rect.width);
      if (cssSize <= 0 || cssSize === lastSize) return cssSize > 0;
      lastSize = cssSize;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(cssSize * dpr);
      canvas!.height = Math.round(cssSize * dpr);
      const ctx = canvas!.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return true;
    }

    function drawFrame(now: number) {
      const ctx = canvas!.getContext('2d');
      if (!ctx || lastSize <= 0) return;
      const size = lastSize;
      const cell = Math.floor(size / 32);
      const gridPx = cell * 32;
      const ox = Math.floor((size - gridPx) / 2);
      const oy = Math.floor((size - gridPx) / 2);

      ctx.fillStyle = pal[0];
      ctx.fillRect(0, 0, size, size);

      let assembleLimit = fgIndices.length;
      if (!assembled) {
        const elapsed = now - assembleStart;
        const p = Math.min(1, Math.max(0, elapsed / 640));
        assembleLimit = Math.floor(p * fgIndices.length);
        if (p >= 1) assembled = true;
      }

      for (let y = 0; y < 32; y++) {
        let runStart = 0;
        let runIdx = -1;
        for (let x = 0; x <= 32; x++) {
          let idx = 0;
          if (x < 32) {
            const raw = Number(currentGrid[y][x]) || 0;
            if (!assembled && raw !== 0) {
              const rank = orderRank[y * 32 + x];
              idx = rank < assembleLimit ? raw : 0;
            } else {
              idx = raw;
            }
          }
          if (x === 0) {
            runIdx = idx;
            runStart = 0;
          } else if (x === 32 || idx !== runIdx) {
            if (runIdx !== 0) {
              ctx.fillStyle = pal[runIdx];
              ctx.fillRect(ox + runStart * cell, oy + y * cell, (x - runStart) * cell, cell);
            }
            runStart = x;
            runIdx = idx;
          }
        }
      }

      if (assembled) {
        animActive = false;
        motion.remove(drawFrame);
      }
    }

    function startAnim() {
      if (!animActive) {
        animActive = true;
        motion.add(drawFrame);
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            io.disconnect();
            sizeCanvas();
            if (!motionOn || skipAssemble) {
              assembled = true;
              drawFrame(performance.now());
            } else {
              assembleStart = performance.now();
              startAnim();
            }
          }
        }
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      if (sizeCanvas()) drawFrame(performance.now());
    });
    ro.observe(canvas);

    return () => {
      io.disconnect();
      ro.disconnect();
      motion.remove(drawFrame);
    };
  }, [project, blockSize, skipAssemble, motionOn]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label={`Pixel emblem for ${project.name}`}
    />
  );
};
