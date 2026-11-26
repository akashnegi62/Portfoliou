import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MenuOverlay } from './components/MenuOverlay';
import { TopButton } from './components/TopButton';
import { TrailCanvas } from './components/TrailCanvas';
import { WipeCanvas } from './components/WipeCanvas';
import { CanvasLoader } from './components/CanvasLoader';
import { Home } from './pages/Home';

export const App: React.FC = () => {
  return (
    <div className="app-root">
      <CanvasLoader />

      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <Header />

      <main id="main" tabIndex={-1} className="main-content">
        <Home />
      </main>

      <Footer />
      <MenuOverlay />
      <TopButton />
      <TrailCanvas />
      <WipeCanvas />
    </div>
  );
};
