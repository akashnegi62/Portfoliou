import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { projectById, trackById, archiveByProject, eraById } from '../utils/helpers';
import { PixelArtCanvas } from '../components/PixelArtCanvas';

export const ProjectDetail: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { navigate, savedIds, toggleSaved } = useApp();
  const [resIndex, setResIndex] = useState(3);
  const resLabels = ['4 × 4', '8 × 8', '16 × 16', '32 × 32'];
  const resSizes = [8, 4, 2, 1];

  const pr = projectById(projectId);
  if (!pr) {
    return (
      <section className="sub-sec" data-surface="paper">
        <div className="grid">
          <div className="col-full">
            <h1 className="t-h1">Project not found</h1>
            <a
              className="btn-primary t-small"
              href="#/projects"
              style={{ marginTop: 24 }}
              onClick={(e) => {
                e.preventDefault();
                navigate('#/projects');
              }}
            >
              <span>Back to all projects</span>
            </a>
          </div>
        </div>
      </section>
    );
  }

  const tr = trackById(pr.track);
  const related = archiveByProject(pr.id);

  return (
    <section className="sub-sec" data-surface="paper">
      <div className="grid">
        <div className="col-1-5">
          <figure>
            <div className="speaker-card-media" style={{ marginBottom: 16 }}>
              <img
                className="speaker-card-img"
                src={pr.image || `/projects/${pr.id}.webp`}
                alt={`${pr.name} screenshot`}
              />
            </div>

            <PixelArtCanvas
              project={pr}
              blockSize={resSizes[resIndex]}
              skipAssemble={false}
              className="portrait-canvas"
            />

            <div className="scrubber-wrap">
              <div className="scrubber-head">
                <label className="t-micro" htmlFor="res-scrubber">
                  Grid resolution
                </label>
                <output className="t-micro tnum" id="res-output" htmlFor="res-scrubber">
                  {resLabels[resIndex]}
                </output>
              </div>
              <input
                className="scrubber-input"
                type="range"
                id="res-scrubber"
                min="0"
                max="3"
                step="1"
                value={resIndex}
                aria-valuetext={resLabels[resIndex]}
                onChange={(e) => setResIndex(Number(e.target.value))}
              />
            </div>
            <figcaption className="t-micro" style={{ marginTop: 8 }}>
              Scrub to pool this 32 × 32 emblem down to a 4 × 4 grid.
            </figcaption>
          </figure>
        </div>

        <div className="col-7-12">
          <p className="t-micro">Case study</p>
          <h1 className="t-h1" tabIndex={-1} style={{ marginTop: 8 }}>
            {pr.name}
          </h1>
          <p className="t-lead" style={{ marginTop: 16 }}>
            {pr.outcome}
          </p>
          <p className="t-small" style={{ marginTop: 10 }}>
            {pr.client} · {pr.city} · {pr.year} ·{' '}
            <span className="track-meta">
              <span className="track-swatch" style={{ background: tr.chipBg }} />
              {tr.label}
            </span>
          </p>
          <p className="t-body" style={{ marginTop: 24 }}>
            {pr.summary}
          </p>
          <p className="t-micro" style={{ marginTop: 20 }}>
            Stack: {pr.stack.join(' · ')}
          </p>

          {pr.liveUrl && (
            <div style={{ marginTop: 24 }}>
              <a
                className="btn-primary t-small"
                href={pr.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Visit Live Project ↗</span>
              </a>
            </div>
          )}

          <h2 className="t-micro" style={{ marginTop: 48 }}>
            Deliverables &amp; notes
          </h2>
          <div className="speaker-sessions-list" id="sp-sessions-list">
            {related.map((s) => {
              const era = eraById(s.era);
              const isSaved = savedIds.includes(s.id);
              return (
                <div key={s.id} className="speaker-session-item">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 12,
                    }}
                  >
                    <div>
                      <p className="t-lead">{s.title}</p>
                      <p className="t-micro" style={{ marginTop: 4 }}>
                        {era.years} · {s.type} · {s.system}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="star-btn"
                      aria-label={isSaved ? 'Remove from saved' : 'Save deliverable'}
                      aria-pressed={isSaved ? 'true' : 'false'}
                      onClick={() => toggleSaved(s.id)}
                    >
                      {isSaved ? '★' : '☆'}
                    </button>
                  </div>
                  <p className="t-small" style={{ marginTop: 8 }}>
                    {s.abstract}
                  </p>
                  <p className="t-micro" style={{ marginTop: 8 }}>
                    Impact: {s.impact}
                  </p>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 36 }}>
            <a
              className="btn-primary t-small"
              href="#/projects"
              onClick={(e) => {
                e.preventDefault();
                navigate('#/projects');
              }}
            >
              <span>Back to all projects</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
