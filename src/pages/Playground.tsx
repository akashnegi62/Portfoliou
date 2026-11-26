import React, { useState, useRef, useEffect, useCallback } from 'react';
import { COPY, META } from '../data';
import { BADGE_PALETTE, TRAIL_COLORS, layoutGlyphLines, esc, storageGet, storageSet } from '../utils/helpers';

export const Playground: React.FC = () => {
  const [grid, setGrid] = useState<string[]>(() => {
    const saved = storageGet<{ name: string; grid: string }>('kroon.badge', {
      name: 'Visitor',
      grid: '0'.repeat(256),
    });
    return (saved.grid || '0'.repeat(256)).split('').slice(0, 256);
  });
  const [badgeName, setBadgeName] = useState<string>(() => {
    const saved = storageGet<{ name: string; grid: string }>('kroon.badge', {
      name: 'Visitor',
      grid: '0'.repeat(256),
    });
    return saved.name || 'Visitor';
  });

  const [history, setHistory] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState<string>('0');
  const [tool, setTool] = useState<'paint' | 'erase' | 'fill' | 'mirror'>('paint');
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [cursorPos, setCursorPos] = useState({ r: 0, c: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync to storage
  useEffect(() => {
    storageSet('kroon.badge', {
      name: badgeName,
      grid: grid.join(''),
    });
  }, [badgeName, grid]);

  const pushHistory = useCallback(() => {
    setHistory((prev) => [...prev.slice(-19), grid.join('')]);
  }, [grid]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const cssSize = Math.max(256, Math.round(rect.width || 320));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssSize * dpr);
    canvas.height = Math.round(cssSize * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cell = cssSize / 16;
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        const palId = grid[r * 16 + c];
        const palObj = BADGE_PALETTE[Number(palId)] || BADGE_PALETTE[1];
        ctx.fillStyle = palObj.hex;
        ctx.fillRect(c * cell, r * cell, Math.ceil(cell), Math.ceil(cell));
      }
    }

    ctx.strokeStyle = 'rgba(254, 254, 255, 0.12)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 16; i++) {
      const p = Math.round(i * cell) + 0.5;
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, cssSize);
      ctx.moveTo(0, p);
      ctx.lineTo(cssSize, p);
      ctx.stroke();
    }

    if (isFocused) {
      ctx.strokeStyle = '#2E5FCE';
      ctx.lineWidth = 2;
      ctx.strokeRect(cursorPos.c * cell + 2, cursorPos.r * cell + 2, cell - 4, cell - 4);
    }
  }, [grid, isFocused, cursorPos]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const applyToolAt = useCallback(
    (r: number, c: number, overrideColor?: string) => {
      if (r < 0 || r >= 16 || c < 0 || c >= 16) return;
      const targetColor = overrideColor !== undefined ? overrideColor : tool === 'erase' ? '0' : currentColor;

      if (tool === 'fill') {
        const oldColor = grid[r * 16 + c];
        if (oldColor === targetColor) return;
        pushHistory();
        const nextGrid = [...grid];
        const queue: [number, number][] = [[r, c]];
        const seen = new Set<number>();
        while (queue.length > 0) {
          const [cr, cc] = queue.shift()!;
          const k = cr * 16 + cc;
          if (cr < 0 || cr >= 16 || cc < 0 || cc >= 16 || seen.has(k) || nextGrid[k] !== oldColor) continue;
          seen.add(k);
          nextGrid[k] = targetColor;
          queue.push([cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]);
        }
        setGrid(nextGrid);
      } else {
        setGrid((prev) => {
          const next = [...prev];
          next[r * 16 + c] = targetColor;
          if (tool === 'mirror') {
            next[r * 16 + (15 - c)] = targetColor;
          }
          return next;
        });
      }
    },
    [currentColor, grid, pushHistory, tool]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.focus();
    setIsPointerDown(true);
    pushHistory();

    const rect = canvas.getBoundingClientRect();
    const c = Math.min(15, Math.max(0, Math.floor(((e.clientX - rect.left) / rect.width) * 16)));
    const r = Math.min(15, Math.max(0, Math.floor(((e.clientY - rect.top) / rect.height) * 16)));
    setCursorPos({ r, c });
    applyToolAt(r, c);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDown) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const c = Math.min(15, Math.max(0, Math.floor(((e.clientX - rect.left) / rect.width) * 16)));
    const r = Math.min(15, Math.max(0, Math.floor(((e.clientY - rect.top) / rect.height) * 16)));
    if (r !== cursorPos.r || c !== cursorPos.c) {
      setCursorPos({ r, c });
      if (tool !== 'fill') {
        applyToolAt(r, c);
      }
    }
  };

  const handlePointerUp = () => {
    setIsPointerDown(false);
  };

  const handleRandom = () => {
    pushHistory();
    const next = new Array(256).fill('0').map(() => {
      return Math.random() > 0.65 ? String(Math.floor(Math.random() * BADGE_PALETTE.length)) : '0';
    });
    setGrid(next);
  };

  const handleClear = () => {
    pushHistory();
    setGrid(new Array(256).fill('0'));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setGrid(last.split(''));
  };

  // Generate Preview SVG Content
  const logoLayout = layoutGlyphLines([META.brand], 2, false);
  const lCellH = 2.4;
  const lCellW = lCellH * 1.25;
  const lx0 = 16;
  const ly0 = Math.round((48 - 9 * lCellH) / 2);

  const renderBadgeSVG = () => {
    const spriteSize = 16 * 15;
    const sx0 = (320 - spriteSize) / 2;
    const sy0 = 68;

    return (
      <svg
        className="badge-preview-svg"
        viewBox="0 0 320 480"
        shapeRendering="crispEdges"
        role="img"
        aria-label={`Studio card for ${badgeName || 'Visitor'}`}
      >
        <rect x="0" y="0" width="320" height="480" fill="#171919" stroke="#2E5FCE" strokeWidth="2" />
        <rect x="0" y="0" width="320" height="48" fill="#2E5FCE" />
        {logoLayout.cells.map((cell, idx) => (
          <rect
            key={idx}
            x={(lx0 + cell.x * lCellW).toFixed(2)}
            y={(ly0 + cell.y * lCellH).toFixed(2)}
            width={lCellW}
            height={lCellH}
            fill="#FEFEFF"
          />
        ))}
        {grid.map((palId, idx) => {
          const r = Math.floor(idx / 16);
          const c = idx % 16;
          const palObj = BADGE_PALETTE[Number(palId)] || BADGE_PALETTE[1];
          return (
            <rect
              key={idx}
              x={sx0 + c * 15}
              y={sy0 + r * 15}
              width="15"
              height="15"
              fill={palObj.hex}
            />
          );
        })}
        <text
          x="16"
          y="356"
          fontFamily="Inter Tight, Helvetica Neue, Helvetica, Arial, sans-serif"
          fontSize="26"
          fontWeight="600"
          fill="#FEFEFF"
        >
          {badgeName || 'Visitor'}
        </text>
        <text
          x="16"
          y="388"
          fontFamily="Inter Tight, Helvetica Neue, Helvetica, Arial, sans-serif"
          fontSize="14"
          fontWeight="500"
          fill="#FEFEFF"
        >
          Akash Negi · Full Stack Developer
        </text>
        {[0, 1].map((row) =>
          new Array(16).fill(0).map((_, i) => (
            <rect
              key={`${row}-${i}`}
              x={i * 20}
              y={432 + row * 24}
              width="20"
              height="24"
              fill={TRAIL_COLORS[(i + row * 3) % TRAIL_COLORS.length]}
            />
          ))
        )}
      </svg>
    );
  };

  const handleDownloadSVG = () => {
    let logoRects = '';
    for (let i = 0; i < logoLayout.cells.length; i++) {
      const cell = logoLayout.cells[i];
      logoRects += `<rect x="${(lx0 + cell.x * lCellW).toFixed(2)}" y="${(ly0 + cell.y * lCellH).toFixed(2)}" width="${lCellW}" height="${lCellH}" fill="#FEFEFF"/>`;
    }

    const spriteSize = 16 * 15;
    const sx0 = (320 - spriteSize) / 2;
    const sy0 = 68;
    let spriteRects = '';
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        const palId = grid[r * 16 + c];
        const palObj = BADGE_PALETTE[Number(palId)] || BADGE_PALETTE[1];
        spriteRects += `<rect x="${sx0 + c * 15}" y="${sy0 + r * 15}" width="15" height="15" fill="${palObj.hex}"/>`;
      }
    }

    let stripRects = '';
    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < 16; i++) {
        stripRects += `<rect x="${i * 20}" y="${432 + row * 24}" width="20" height="24" fill="${TRAIL_COLORS[(i + row * 3) % TRAIL_COLORS.length]}"/>`;
      }
    }

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 480" width="320" height="480" shape-rendering="crispEdges">
  <rect x="0" y="0" width="320" height="480" fill="#171919" stroke="#2E5FCE" stroke-width="2"/>
  <rect x="0" y="0" width="320" height="48" fill="#2E5FCE"/>
  ${logoRects}
  ${spriteRects}
  <text x="16" y="356" font-family="Inter Tight, Helvetica Neue, Helvetica, Arial, sans-serif" font-size="26" font-weight="600" fill="#FEFEFF">${esc(badgeName || 'Visitor')}</text>
  <text x="16" y="388" font-family="Inter Tight, Helvetica Neue, Helvetica, Arial, sans-serif" font-size="14" font-weight="500" fill="#FEFEFF">Akash Negi · Full Stack Developer</text>
  ${stripRects}
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixel-card-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const palObj = BADGE_PALETTE[Number(grid[cursorPos.r * 16 + cursorPos.c])] || BADGE_PALETTE[1];

  return (
    <section className="sub-sec" data-surface="ink">
      <div className="grid">
        <p className="col-1-3 t-micro">Pixel Lab</p>
        <div className="col-5-12">
          <h1 className="t-h1 t-paper" tabIndex={-1}>
            {COPY.badgeTitle}
          </h1>
          <p className="t-body" style={{ marginTop: '16px' }}>
            {COPY.badgeLead}
          </p>
        </div>
      </div>

      <div className="grid badge-layout">
        <div className="col-1-6">
          <canvas
            ref={canvasRef}
            className="badge-editor-canvas"
            tabIndex={0}
            role="application"
            aria-label="16 by 16 pixel sprite editor."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onContextMenu={(e) => e.preventDefault()}
          />
          <p className="t-micro badge-status" aria-live="polite">
            Row {cursorPos.r + 1}, column {cursorPos.c + 1}, {palObj.name}.
          </p>

          <div className="palette-group" role="radiogroup" aria-label="Colour palette" id="badge-palette">
            {BADGE_PALETTE.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                className="palette-swatch"
                role="radio"
                aria-checked={currentColor === c.id}
                aria-label={`Colour ${idx + 1}: ${c.name}`}
                data-col={c.id}
                style={{
                  background: c.hex,
                  outline: currentColor === c.id ? '2px solid #FEFEFF' : 'none',
                  outlineOffset: '2px',
                }}
                onClick={() => setCurrentColor(c.id)}
              />
            ))}
          </div>

          <div className="badge-tools">
            <button
              type="button"
              className="chip-toggle t-micro"
              aria-pressed={tool === 'paint'}
              onClick={() => setTool('paint')}
            >
              Paint
            </button>
            <button
              type="button"
              className="chip-toggle t-micro"
              aria-pressed={tool === 'erase'}
              onClick={() => setTool('erase')}
            >
              Erase
            </button>
            <button
              type="button"
              className="chip-toggle t-micro"
              aria-pressed={tool === 'fill'}
              onClick={() => setTool('fill')}
            >
              Fill
            </button>
            <button
              type="button"
              className="chip-toggle t-micro"
              aria-pressed={tool === 'mirror'}
              onClick={() => setTool('mirror')}
            >
              Mirror
            </button>
            <button type="button" className="chip-toggle t-micro" onClick={handleRandom}>
              Random
            </button>
            <button type="button" className="chip-toggle t-micro" onClick={handleClear}>
              Clear
            </button>
            <button type="button" className="chip-toggle t-micro" onClick={handleUndo}>
              Undo
            </button>
          </div>
        </div>

        <div className="col-8-12">
          {renderBadgeSVG()}
          <div className="field-group badge-name-field" style={{ marginTop: '16px' }}>
            <label className="t-micro" htmlFor="badge-name-input">
              Your name (max 18 characters)
            </label>
            <input
              className="text-input"
              type="text"
              id="badge-name-input"
              maxLength={18}
              value={badgeName}
              onChange={(e) => setBadgeName(e.target.value)}
            />
          </div>
          <div className="badge-dl-wrap" style={{ marginTop: '16px' }}>
            <button type="button" className="btn-primary t-small" onClick={handleDownloadSVG}>
              <span>Download card (.svg)</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
