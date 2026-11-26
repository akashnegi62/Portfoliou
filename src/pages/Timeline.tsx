import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { COPY, ERAS, DISCIPLINES } from '../data';
import { archiveByEra, trackById } from '../utils/helpers';

export const Timeline: React.FC = () => {
  const { savedIds, toggleSaved, navigate } = useApp();
  const [selectedEra, setSelectedEra] = useState<string>(ERAS[0].id);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');

  const toggleTrack = (id: string) => {
    setSelectedTracks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const filteredEntries = useMemo(() => {
    const eraAll = archiveByEra(selectedEra);
    return eraAll.filter((s) => {
      if (selectedTracks.length > 0 && !selectedTracks.includes(s.track)) return false;
      if (savedOnly && !savedIds.includes(s.id)) return false;
      return true;
    });
  }, [selectedEra, selectedTracks, savedOnly, savedIds]);

  return (
    <section className="sub-sec" data-surface="paper">
      <div className="grid">
        <p className="col-1-3 t-micro">Experience</p>
        <div className="col-5-12">
          <h1 className="t-h1" tabIndex={-1}>
            {COPY.scheduleTitle}
          </h1>
          <p className="t-body" style={{ marginTop: 16 }}>
            {COPY.scheduleLead}
          </p>
        </div>
      </div>

      <div className="schedule-controls" id="sched-controls">
        <div className="grid">
          <div className="col-full schedule-controls-inner">
            <div className="day-tabs" role="tablist" aria-label="Career eras">
              {ERAS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className="day-tab t-small"
                  role="tab"
                  aria-selected={selectedEra === d.id ? 'true' : 'false'}
                  onClick={() => setSelectedEra(d.id)}
                >
                  {d.shortLabel}
                </button>
              ))}
            </div>

            <div className="track-toggles-wrap">
              {DISCIPLINES.map((t) => {
                const pressed = selectedTracks.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    className="chip-toggle t-small"
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

            <button
              type="button"
              className="chip-toggle t-small"
              aria-pressed={savedOnly ? 'true' : 'false'}
              onClick={() => setSavedOnly(!savedOnly)}
            >
              Review list ({savedIds.length})
            </button>

            <div className="seg-group" role="group" aria-label="Experience view">
              <button
                type="button"
                className="chip-toggle t-small"
                aria-pressed={viewMode === 'timeline' ? 'true' : 'false'}
                onClick={() => setViewMode('timeline')}
              >
                Timeline
              </button>
              <button
                type="button"
                className="chip-toggle t-small"
                aria-pressed={viewMode === 'table' ? 'true' : 'false'}
                onClick={() => setViewMode('table')}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid">
        <p className="col-full t-micro schedule-live-count" style={{ margin: '16px 0' }}>
          Showing {filteredEntries.length} deliverables
        </p>

        <div className="col-full">
          {filteredEntries.length === 0 ? (
            <p className="t-lead" style={{ margin: '32px 0' }}>
              No deliverables match your filter.
            </p>
          ) : viewMode === 'timeline' ? (
            <div className="day-sessions-list">
              {filteredEntries.map((item) => {
                const tr = trackById(item.track);
                const isSaved = savedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="day-session-row"
                    data-track={item.track}
                    style={{
                      borderBottom: '1px solid rgba(254, 254, 255, 0.12)',
                      padding: '20px 0',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        flexWrap: 'wrap',
                        gap: 8,
                      }}
                    >
                      <h3 className="t-lead day-session-title">{item.title}</h3>
                      <button
                        type="button"
                        className="star-btn"
                        aria-label={isSaved ? 'Remove from saved' : 'Save deliverable'}
                        onClick={() => toggleSaved(item.id)}
                      >
                        {isSaved ? '★' : '☆'}
                      </button>
                    </div>
                    <div className="day-session-meta" style={{ marginTop: 8 }}>
                      <span className="t-micro" style={{ opacity: 0.8 }}>
                        {item.period} · {item.type} · {item.system}
                      </span>
                      <span className="track-meta" style={{ marginLeft: 12 }}>
                        <span className="track-swatch" style={{ background: tr.chipBg }} />
                        {tr.label}
                      </span>
                    </div>
                    <p className="t-body" style={{ marginTop: 12 }}>
                      {item.abstract}
                    </p>
                    <p className="t-micro" style={{ marginTop: 8, color: '#2E5FCE' }}>
                      Impact: {item.impact}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="data-table-wrap">
              <table className="data-table" style={{ width: '100%', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(254, 254, 255, 0.2)' }}>
                    <th className="t-micro" style={{ padding: '12px 8px' }}>
                      Period
                    </th>
                    <th className="t-micro" style={{ padding: '12px 8px' }}>
                      Title
                    </th>
                    <th className="t-micro" style={{ padding: '12px 8px' }}>
                      Discipline
                    </th>
                    <th className="t-micro" style={{ padding: '12px 8px' }}>
                      System
                    </th>
                    <th className="t-micro" style={{ padding: '12px 8px' }}>
                      Saved
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((item) => {
                    const tr = trackById(item.track);
                    const isSaved = savedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        style={{ borderBottom: '1px solid rgba(254, 254, 255, 0.1)' }}
                      >
                        <td className="t-micro" style={{ padding: '12px 8px' }}>
                          {item.period}
                        </td>
                        <td className="t-small" style={{ padding: '12px 8px', fontWeight: 600 }}>
                          {item.title}
                        </td>
                        <td className="t-micro" style={{ padding: '12px 8px' }}>
                          {tr.label}
                        </td>
                        <td className="t-micro" style={{ padding: '12px 8px' }}>
                          {item.system}
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <button
                            type="button"
                            className="star-btn"
                            onClick={() => toggleSaved(item.id)}
                          >
                            {isSaved ? '★' : '☆'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
