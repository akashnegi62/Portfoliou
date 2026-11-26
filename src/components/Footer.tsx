import React from 'react';
import { COPY, TOKENS } from '../data';

const TRACK_COLORS = [TOKENS.blue, TOKENS.pink, TOKENS.lavender, TOKENS.green];

export const Footer: React.FC = () => {
  const stairCells = 96;
  const stairRects = [];
  for (let i = 0; i < stairCells; i++) {
    const col = TRACK_COLORS[Math.floor(i / 4) % 4];
    stairRects.push(
      <rect key={i} x={i} y="0" width="1" height="1" fill={col} />
    );
  }

  return (
    <footer className="site-footer" role="contentinfo" data-surface="ink" id="site-footer">
      <div className="grid footer-bottom">
        <p className="footer-ver t-micro">{COPY.version}</p>
      </div>
      <svg
        className="footer-staircase"
        viewBox={`0 0 ${stairCells} 1`}
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        {stairRects}
      </svg>
    </footer>
  );
};
