import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { META, NAV_ITEMS } from '../data';
import { svgBitmapText } from '../utils/helpers';

export const Header: React.FC = () => {
  const { setMenuOpen, headerSurface } = useApp();
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    NAV_ITEMS.forEach((item) => {
      const targetId = item.href.replace(/^#/, '');
      const el = document.getElementById(targetId);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (href: string) => {
    const targetId = href.replace(/^#/, '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="site-header" role="banner" data-surface={headerSurface} id="site-header">
      <div className="grid header-grid">
        <a
          className="logo-link"
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Akash, front page"
          id="header-logo-link"
          dangerouslySetInnerHTML={{
            __html: svgBitmapText(META.brand, 2.5, 'currentColor', {
              bold: true,
              className: 'header-logo-svg',
              ariaHidden: true,
            }),
          }}
        />

        <nav className="main-nav" aria-label="Main" id="header-nav">
          {NAV_ITEMS.map((item) => {
            const targetId = item.href.replace(/^#/, '');
            const isActive = activeSection === targetId;
            return (
              <a
                key={item.href}
                className="nav-link t-small u-anim"
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="header-actions-desktop">
          <a
            className="btn-primary btn-sm t-small"
            href="#home-contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#home-contact');
            }}
          >
            <span>Hire me</span>
          </a>
        </div>

        <div className="menu-btn-wrap">
          <button
            type="button"
            className="menu-btn t-micro"
            id="menu-open-btn"
            aria-expanded="false"
            aria-controls="menu"
            onClick={() => setMenuOpen(true)}
          >
            Menu
          </button>
        </div>
      </div>
    </header>
  );
};
