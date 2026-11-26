import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { DISCIPLINES, PROJECTS, type Discipline } from '../data';

const weavePlus = (x: number, y: number, phase: number) => {
  const px = (x + phase) % 6;
  const py = (y + phase) % 6;
  const inA = (px === 1 && py <= 2) || (py === 1 && px <= 2);
  const inB = (px === 4 && py >= 3) || (py === 4 && px >= 3);
  return inA || inB ? 1 : 0;
};
const weaveCross = (x: number, y: number, phase: number) => {
  const px = (x + phase) % 4;
  const py = (y + phase) % 4;
  return px === 1 || py === 1 ? 1 : 0;
};
const weaveTartan = (x: number, y: number, phase: number) => {
  const px = (x + phase) % 4;
  const py = (y + phase) % 4;
  return px < 2 !== py < 2 || (px === 1 && py === 1) ? 1 : 0;
};
const weaveBasket = (x: number, y: number, phase: number) => {
  const px = (x + phase) % 4;
  const py = (y + phase) % 4;
  const block = (Math.floor((x + phase) / 4) + Math.floor((y + phase) / 4)) % 2 === 0;
  return block ? (py % 2 === 0 ? 1 : 0) : px % 2 === 0 ? 1 : 0;
};

const PANEL_STYLES: Record<
  Discipline['id'],
  { colA: string; colB: string; band: string; weave: (x: number, y: number, p: number) => number }
> = {
  systems: { colA: '#2E5FCE', colB: '#3b6fe8', band: '#2E5FCE', weave: weavePlus },
  graphics: { colA: '#18B47E', colB: '#2E5FCE', band: '#18B47E', weave: weaveCross },
  product: { colA: '#F5B700', colB: '#FF5A36', band: '#F5B700', weave: weaveBasket },
  performance: { colA: '#A98BF7', colB: '#2E5FCE', band: '#A98BF7', weave: weaveTartan },
};

const TrackCard: React.FC<{
  discipline: Discipline;
}> = ({ discipline }) => {
  const { motionOn } = useApp();
  const [phase, setPhase] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const animatingRef = useRef(false);

  const panel = PANEL_STYLES[discipline.id];
  const cell = 4;
  const cols = 20;
  const rows = 18;

  const play = useCallback(() => {
    if (!motionOn || animatingRef.current) return;
    animatingRef.current = true;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setPhase(step % 6);
      if (step >= 6) {
        clearInterval(timer);
        setPhase(0);
        animatingRef.current = false;
      }
    }, 90);
  }, [motionOn]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            io.disconnect();
            play();
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play]);

  const rects = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (panel.weave(x, y, phase) === 1) {
        rects.push(
          <rect
            key={`${x}-${y}`}
            x={x * cell}
            y={y * cell}
            width={cell}
            height={cell}
            fill={panel.colB}
          />
        );
      }
    }
  }

  return (
    <div className="track-fig">
      <div
        ref={cardRef}
        className="track-panel-card"
        data-track={discipline.id}
        style={{ '--track-band': panel.band } as React.CSSProperties}
        onMouseEnter={play}
      >
        <svg
          className="track-panel-svg"
          viewBox="0 0 80 72"
          shapeRendering="crispEdges"
          aria-hidden="true"
        >
          <rect x="0" y="0" width={cols * cell} height={rows * cell} fill={panel.colA} />
          {rects}
        </svg>
        <div className="track-card-body">
          <div>
            <p className="track-card-title">{discipline.label}</p>
            <p className="t-small track-card-desc">{discipline.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DisciplinePanels: React.FC = () => {
  return (
    <div className="grid tracks-grid" id="tracks-grid">
      {DISCIPLINES.map((t) => (
        <TrackCard key={t.id} discipline={t} />
      ))}
    </div>
  );
};
