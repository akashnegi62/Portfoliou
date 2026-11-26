import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { COPY, ARCHIVE_ITEMS, DISCIPLINES, ERAS } from '../data';
import { trackById, eraById, projectById, normText } from '../utils/helpers';

export const Archive: React.FC<{ initialOpenId?: string }> = ({ initialOpenId }) => {
  const { savedIds, toggleSaved, navigate } = useApp();
  const [search, setSearch] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(initialOpenId || null);

  const filteredItems = useMemo(() => {
    const q = normText(search);
    return ARCHIVE_ITEMS.filter((item) => {
      if (selectedTrack !== 'all' && item.track !== selectedTrack) return false;
      if (selectedEra !== 'all' && item.era !== selectedEra) return false;
      if (q) {
        const text = normText(`${item.title} ${item.abstract} ${item.impact} ${item.system}`);
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [search, selectedTrack, selectedEra]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="sub-sec" data-surface="paper">
      <div className="grid">
        <p className="col-1-3 t-micro">Archive</p>
        <div className="col-5-12">
          <h1 className="t-h1" tabIndex={-1}>
            {COPY.talksTitle}
          </h1>
          <p className="t-body" style={{ marginTop: 16 }}>
            {COPY.talksLead}
          </p>

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input
              type="search"
              className="text-input"
              placeholder="Search deliverables, architecture notes, metrics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button
                type="button"
                className="chip-toggle t-micro"
                aria-pressed={selectedTrack === 'all' ? 'true' : 'false'}
                onClick={() => setSelectedTrack('all')}
              >
                All Disciplines
              </button>
              {DISCIPLINES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="chip-toggle t-micro"
                  aria-pressed={selectedTrack === t.id ? 'true' : 'false'}
                  onClick={() => setSelectedTrack(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button
                type="button"
                className="chip-toggle t-micro"
                aria-pressed={selectedEra === 'all' ? 'true' : 'false'}
                onClick={() => setSelectedEra('all')}
              >
                All Eras
              </button>
              {ERAS.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  className="chip-toggle t-micro"
                  aria-pressed={selectedEra === e.id ? 'true' : 'false'}
                  onClick={() => setSelectedEra(e.id)}
                >
                  {e.shortLabel}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-full" style={{ marginTop: 32 }}>
          <p className="t-micro" style={{ marginBottom: 16 }}>
            Showing {filteredItems.length} of {ARCHIVE_ITEMS.length} archive entries
          </p>

          <div className="talks-table-wrap">
            <table className="data-table talks-table" style={{ width: '100%', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(254, 254, 255, 0.2)' }}>
                  <th className="t-micro" style={{ padding: '12px 8px' }}>
                    Title &amp; Scope
                  </th>
                  <th className="t-micro" style={{ padding: '12px 8px' }}>
                    Discipline
                  </th>
                  <th className="t-micro" style={{ padding: '12px 8px' }}>
                    Era
                  </th>
                  <th className="t-micro" style={{ padding: '12px 8px' }}>
                    System
                  </th>
                  <th className="t-micro" style={{ padding: '12px 8px' }}>
                    Save
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const tr = trackById(item.track);
                  const era = eraById(item.era);
                  const isSaved = savedIds.includes(item.id);
                  const isExpanded = expandedId === item.id;

                  return (
                    <React.Fragment key={item.id}>
                      <tr
                        className="talk-row"
                        data-track={item.track}
                        style={{
                          cursor: 'pointer',
                          borderBottom: isExpanded
                            ? 'none'
                            : '1px solid rgba(254, 254, 255, 0.1)',
                        }}
                        onClick={() => toggleExpand(item.id)}
                      >
                        <td style={{ padding: '14px 8px' }}>
                          <span className="t-small" style={{ fontWeight: 600 }}>
                            {item.title}
                          </span>
                        </td>
                        <td className="t-micro" style={{ padding: '14px 8px' }}>
                          <span className="track-meta">
                            <span className="track-swatch" style={{ background: tr.chipBg }} />
                            {tr.label}
                          </span>
                        </td>
                        <td className="t-micro" style={{ padding: '14px 8px' }}>
                          {era.years}
                        </td>
                        <td className="t-micro" style={{ padding: '14px 8px' }}>
                          {item.system}
                        </td>
                        <td
                          style={{ padding: '14px 8px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaved(item.id);
                          }}
                        >
                          <button
                            type="button"
                            className="star-btn"
                            aria-label={isSaved ? 'Remove from saved' : 'Save deliverable'}
                          >
                            {isSaved ? '★' : '☆'}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr
                          className="talk-expand-row"
                          style={{ borderBottom: '2px solid rgba(254, 254, 255, 0.2)' }}
                        >
                          <td colSpan={5} style={{ padding: '16px 20px', background: '#141616' }}>
                            <p className="t-body">{item.abstract}</p>
                            <p
                              className="t-small"
                              style={{ marginTop: 12, color: '#2E5FCE', fontWeight: 600 }}
                            >
                              Impact: {item.impact}
                            </p>
                            {item.projects.length > 0 && (
                              <div
                                style={{
                                  marginTop: 16,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                }}
                              >
                                <span className="t-micro">Related case study:</span>
                                {item.projects.map((pid) => {
                                  const pr = projectById(pid);
                                  if (!pr) return null;
                                  return (
                                    <a
                                      key={pid}
                                      className="btn-text t-micro u-anim"
                                      href={`#/projects/${pid}`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        navigate(`#/projects/${pid}`);
                                      }}
                                    >
                                      {pr.name} →
                                    </a>
                                  );
                                })}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
