import React, { useState } from 'react';
import { COPY, STUDIO_PLAN, STUDIO_ZONES, TOKENS } from '../data';
import { zoneById } from '../utils/helpers';

export const Studio: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<string>(STUDIO_ZONES[0]?.id || 'systems-desk');
  const activeZone = zoneById(selectedZone);

  return (
    <section className="sub-sec" data-surface="paper">
      <div className="grid">
        <p className="col-1-3 t-micro">Studio</p>
        <div className="col-5-12">
          <h1 className="t-h1" tabIndex={-1}>
            {COPY.venueTitle}
          </h1>
          <p className="t-body" style={{ marginTop: '16px' }}>
            {COPY.venueLead}
          </p>
        </div>
      </div>

      <div className="grid venue-grid">
        <div className="col-1-8">
          <svg
            className="venue-svg"
            viewBox="0 0 40 24"
            shapeRendering="crispEdges"
            role="img"
            aria-label="Studio workflow floorplan. Select a station to inspect tools and methods."
          >
            <rect x="0" y="0" width="40" height="24" fill={TOKENS.paper} stroke={TOKENS.ink} strokeWidth="0.25" />
            {STUDIO_PLAN.map((rm) => {
              const sel = selectedZone === rm.id;
              return (
                <g
                  key={rm.id}
                  className="venue-room-shape"
                  onClick={() => setSelectedZone(rm.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    x={rm.x}
                    y={rm.y}
                    width={rm.w}
                    height={rm.h}
                    fill={rm.fill}
                    stroke={TOKENS.ink}
                    strokeWidth={sel ? '0.6' : '0.2'}
                  />
                  <text
                    x={rm.x + 1}
                    y={rm.y + 2.4}
                    fontFamily="Inter Tight, sans-serif"
                    fontSize="1.4"
                    fontWeight="600"
                    fill={rm.text}
                  >
                    {rm.label}
                  </text>
                  {rm.chip && (
                    <>
                      <rect
                        x={rm.x + rm.w - 3.6}
                        y={rm.y + 0.6}
                        width="3"
                        height="1.8"
                        fill={TOKENS.ink}
                      />
                      <text
                        x={rm.x + rm.w - 2.1}
                        y={rm.y + 1.9}
                        textAnchor="middle"
                        fontFamily="Inter Tight, sans-serif"
                        fontSize="1.1"
                        fontWeight="600"
                        fill={TOKENS.sodium}
                      >
                        {rm.chip}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
          <p className="t-micro" style={{ marginTop: '8px' }}>
            Interactive studio map: click any zone to inspect tooling and standards.
          </p>
        </div>

        <div className="col-9-12">
          <div className="venue-room-list" id="venue-room-list">
            {STUDIO_ZONES.map((r) => {
              const isSelected = selectedZone === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  className="venue-room-btn t-small"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedZone(r.id)}
                >
                  <span>{r.name}</span>
                  <span className="t-micro tnum">{r.spec}</span>
                </button>
              );
            })}
          </div>

          <div className="venue-details" id="venue-details" aria-live="polite">
            <h3 className="t-lead">
              {activeZone.name} <span className="t-micro">· {activeZone.nickname}</span>
            </h3>
            <p className="t-micro tnum" style={{ marginTop: '6px' }}>
              Focus: {activeZone.spec}
            </p>
            <p className="t-small" style={{ marginTop: '10px' }}>
              {activeZone.features.join(' · ')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid venue-info-cols">
        <div className="col-1-5">
          <h2 className="t-lead">Collaboration &amp; timezone</h2>
          <p className="t-body" style={{ marginTop: '12px' }}>
            {COPY.venueGettingThere}
          </p>
        </div>
        <div className="col-7-12">
          <h2 className="t-lead">Engineering standards</h2>
          <ul className="access-list t-body">
            {COPY.venueAccess.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
