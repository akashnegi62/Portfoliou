import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { COPY, DISCIPLINES, PROJECTS } from '../data';
import { trackById } from '../utils/helpers';

export const Projects: React.FC = () => {
  const { navigate } = useApp();
  const [selectedTracks, setSelectedTracks] = useState<string[]>(() => {
    const hash = window.location.hash;
    const match = hash.match(/track=([^&]+)/);
    return match ? [match[1]] : [];
  });
  const [sort, setSort] = useState<'featured' | 'az' | 'year'>('featured');

  const toggleTrack = (id: string) => {
    setSelectedTracks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const filteredProjects = useMemo(() => {
    let list = PROJECTS.filter(
      (pr) => selectedTracks.length === 0 || selectedTracks.includes(pr.track)
    );
    if (sort === 'az') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'year') {
      list = [...list].sort((a, b) => Number(b.year) - Number(a.year));
    }
    return list;
  }, [selectedTracks, sort]);

  return (
    <section className="sub-sec" data-surface="sodium">
      <div className="grid">
        <p className="col-1-3 t-micro">Selected work</p>
        <div className="col-5-12">
          <h1 className="t-h1" tabIndex={-1}>
            {COPY.speakersTitle}
          </h1>
          <p className="t-body" style={{ marginTop: 16 }}>
            {COPY.speakersLeadPage}
          </p>
          <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <div className="track-toggles-wrap" id="spk-track-toggles">
              {DISCIPLINES.map((t) => {
                const pressed = selectedTracks.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    className="chip-toggle t-small"
                    data-track={t.id}
                    aria-pressed={pressed ? 'true' : 'false'}
                    onClick={() => toggleTrack(t.id)}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      shapeRendering="crispEdges"
                      aria-hidden="true"
                    >
                      <rect x="0" y="0" width="10" height="10" fill="#FEFEFF" />
                      <rect x="1" y="1" width="8" height="8" fill={t.chipBg} />
                    </svg>
                    {t.label}
                  </button>
                );
              })}
            </div>
            <div className="seg-group" role="group" aria-label="Sort case studies">
              <button
                type="button"
                className="chip-toggle t-small"
                aria-pressed={sort === 'featured' ? 'true' : 'false'}
                onClick={() => setSort('featured')}
              >
                Featured
              </button>
              <button
                type="button"
                className="chip-toggle t-small"
                aria-pressed={sort === 'az' ? 'true' : 'false'}
                onClick={() => setSort('az')}
              >
                A–Z
              </button>
              <button
                type="button"
                className="chip-toggle t-small"
                aria-pressed={sort === 'year' ? 'true' : 'false'}
                onClick={() => setSort('year')}
              >
                Newest
              </button>
            </div>
          </div>
        </div>

        <div className="col-full" id="spk-grid-wrap">
          {filteredProjects.length === 0 ? (
            <p className="t-lead" style={{ marginTop: 48 }}>
              No case studies in this discipline.
            </p>
          ) : (
            <div className="speakers-index-grid">
              {filteredProjects.map((pr) => {
                const tr = trackById(pr.track);
                return (
                  <figure key={pr.id} className="speaker-card" data-spcard={pr.id}>
                    <div className="speaker-card-media">
                      <img
                        className="speaker-card-img"
                        src={pr.image || `/projects/${pr.id}.webp`}
                        alt={`${pr.name} screenshot`}
                        loading="lazy"
                      />
                    </div>
                    <figcaption className="speaker-card-figcap">
                      <div className="speaker-card-head">
                        <h2 className="t-lead speaker-card-name">
                          {pr.name}
                        </h2>
                        <p className="t-micro speaker-card-role">{pr.client}</p>
                      </div>
                      <p className="t-micro" style={{ marginTop: 6 }}>
                        <span className="track-meta">
                          <span className="track-swatch" style={{ background: tr.chipBg }} />
                          {tr.label}
                        </span>
                      </p>
                      <p className="t-small" style={{ marginTop: 8 }}>
                        {pr.summary}
                      </p>
                      {pr.liveUrl && (
                        <div style={{ marginTop: 12 }}>
                          <a
                            className="btn-primary t-small"
                            href={pr.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            <span>Live Demo ↗</span>
                          </a>
                        </div>
                      )}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
