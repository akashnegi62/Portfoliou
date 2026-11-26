import React from 'react';
import { COPY, PROJECTS } from '../data';
import { ParticleCycleCanvas } from '../components/ParticleCycleCanvas';
import { DisciplinePanels } from '../components/DisciplinePanel';
import { TRACK_COLORS } from '../utils/helpers';

export const Home: React.FC = () => {

  return (
    <>
      {/* 1. Hero section */}
      <section className="hero-sec" id="hero" data-surface="sodium">
        <h1 className="visually-hidden">{COPY.heroH1}</h1>
        <figure className="hero-display-wrap">
          <ParticleCycleCanvas
            id="hero-canvas"
            items={COPY.heroCycle}
            bgColor="#171919"
            fgColor="#FEFEFF"
            yRatio={0.68}
            seedPrefix="hero"
          />
        </figure>
      </section>

      {/* 2. About section */}
      <section className="sec" id="about" data-surface="sodium">
        <div className="grid">
          <div className="col-1-8 about-left">
            <p className="t-micro" style={{ marginBottom: 16 }}>(About)</p>
            <h2 className="t-h2 reveal-text" style={{ marginBottom: 24 }}>{COPY.aboutLead}</h2>

            <div className="about-left-paras">
              <p className="t-body">{COPY.aboutP1}</p>
              <p className="t-body">{COPY.aboutP2}</p>
            </div>

            <div className="about-cta-wrap">
              <a
                className="btn-primary t-small"
                href="#speakers-preview"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('speakers-preview')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>View selected work</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What I Do / Disciplines section */}
      <section className="sec" id="tracks" data-surface="ink">
        <div className="grid">
          <div className="col-1-8">
            <p className="t-micro" style={{ marginBottom: 16 }}>(What I Do)</p>
            <h2 className="t-h2 t-paper reveal-text" style={{ marginBottom: 24 }}>
              {COPY.tracksLead}
            </h2>
          </div>
        </div>
        <DisciplinePanels />
      </section>

      {/* 4. Featured Projects section */}
      <section className="sec" id="speakers-preview" data-surface="sodium">
        <div className="grid">
          <div className="col-1-8">
            <p className="t-micro" style={{ marginBottom: 16 }}>(Featured Projects)</p>
            <h2 className="t-h2 reveal-text" style={{ marginBottom: 24 }}>{COPY.speakersLead}</h2>
          </div>
          <div className="col-full speakers-preview-grid" id="speakers-preview-grid">
            {PROJECTS.map((pr) => {
              const bandColor = TRACK_COLORS[pr.track] || '#2E5FCE';
              return (
                <div key={pr.id} className="project-track-fig">
                  <article
                    className="project-track-card"
                    style={{ '--track-band': bandColor } as React.CSSProperties}
                  >
                    <div className="project-track-card-media">
                      <img
                        className="project-track-card-img"
                        src={pr.image || `/projects/${pr.id}.webp`}
                        alt={`${pr.name} preview`}
                        loading="lazy"
                      />
                    </div>

                    <div className="project-track-card-body">
                      <div>
                        <div className="project-track-card-head">
                          <h3 className="project-track-card-title">
                            {pr.name}
                          </h3>
                          <span className="project-track-card-year tnum">{pr.year}</span>
                        </div>
                        <p className="project-track-card-desc">{pr.summary}</p>
                        <div className="project-track-card-tags">
                          {pr.stack.map((st, i) => (
                            <span key={i} className="project-track-card-tag">
                              {st}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="project-track-card-foot">
                        <a
                          className="project-track-live-btn"
                          href={pr.liveUrl || 'https://example.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Open live project: ${pr.name}`}
                        >
                          <span>Live Demo</span>
                          <svg
                            className="project-track-arrow"
                            width="13"
                            height="13"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M2 12L12 2M12 2H4M12 2V10"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="square"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Contact CTA section */}
      <section className="sec" id="home-contact" data-surface="ink">
        <div className="grid">
          <p className="col-1-3 t-micro">(Contact)</p>
          <div className="col-full home-contact-canvas-wrap">
            <h2 className="visually-hidden">Let's build something real.</h2>
            <ParticleCycleCanvas
              id="contact-canvas"
              items={COPY.contactCycle}
              bgColor="#121313"
              fgColor="#FEFEFF"
              yRatio={0.5}
              seedPrefix="contact"
            />
          </div>
          <div className="col-full home-contact-cta">
            <a
              className="btn-primary t-small"
              href="mailto:akashnegi184@gmail.com"
            >
              <span>Let's Talk</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
