import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const TopButton: React.FC = () => {
  const { bottomSurface, motionOn } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY >= window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: motionOn ? 'smooth' : 'auto',
    });
  };

  return (
    <button
      type="button"
      className={`top-btn u-anim ${visible ? 'is-visible' : ''}`}
      id="top-btn"
      data-surface={bottomSurface}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      style={{
        display: visible ? 'inline-flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        style={{ display: 'block', margin: 'auto' }}
      >
        <path
          d="M8 13V3M8 3L3 8M8 3L13 8"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="square"
        />
      </svg>
    </button>
  );
};
