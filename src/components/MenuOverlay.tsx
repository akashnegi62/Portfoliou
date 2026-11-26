import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { NAV_ITEMS } from '../data';

export const MenuOverlay: React.FC = () => {
  const { menuOpen, setMenuOpen, motionOn, toggleMotion } = useApp();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (menuOpen) {
      closeBtnRef.current?.focus();
    }
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen, setMenuOpen]);

  const scrollToSection = (href: string) => {
    setMenuOpen(false);
    const targetId = href.replace(/^#/, '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`menu-overlay ${menuOpen ? 'is-open' : ''}`}
      id="menu"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      data-surface="sodium"
      style={{ display: menuOpen ? 'flex' : 'none' }}
    >
      <div className="menu-overlay-top grid">
        <span className="col-1-3 t-micro">Navigation</span>
        <div className="menu-btn-wrap">
          <button
            ref={closeBtnRef}
            type="button"
            className="menu-btn t-micro"
            id="menu-close-btn"
            onClick={() => setMenuOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
      <div className="grid">
        <nav className="menu-overlay-links col-full" aria-label="Mobile navigation" id="menu-nav">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              className="t-h1"
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="menu-overlay-footer col-full">
          <button
            type="button"
            className="btn-text t-small u-anim"
            id="motion-toggle-mobile"
            aria-pressed={motionOn ? 'true' : 'false'}
            onClick={toggleMotion}
          >
            Motion: {motionOn ? 'on' : 'off'}
          </button>
          <a
            className="btn-primary t-small"
            href="#home-contact"
            id="menu-tickets-btn"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#home-contact');
            }}
          >
            <span>Hire me</span>
          </a>
        </div>
      </div>
    </div>
  );
};
