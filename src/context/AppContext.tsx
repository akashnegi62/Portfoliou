import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { storageGet, storageSet } from '../utils/helpers';

export interface RouteInfo {
  view: string;
  param?: string;
  key: string;
}

export function parseRoute(hash: string): RouteInfo {
  const clean = (hash || '').replace(/^#\/?/, '').trim();
  if (!clean) return { view: 'home', key: 'home' };
  const parts = clean.split('/');
  const seg0 = parts[0];
  const seg1 = parts[1];
  if (seg0 === 'timeline') return { view: 'timeline', key: 'timeline' };
  if (seg0 === 'projects') {
    if (seg1) return { view: 'project-detail', param: seg1, key: `project-${seg1}` };
    return { view: 'projects', key: 'projects' };
  }
  if (seg0 === 'archive') {
    if (seg1) return { view: 'archive', param: seg1, key: `archive-${seg1}` };
    return { view: 'archive', key: 'archive' };
  }
  if (seg0 === 'studio') return { view: 'studio', key: 'studio' };
  if (seg0 === 'contact') return { view: 'contact', key: 'contact' };
  if (seg0 === 'playground') return { view: 'playground', key: 'playground' };
  return { view: 'not-found', key: 'not-found' };
}

interface TipInfo {
  text: string;
  x: number;
  y: number;
  visible: boolean;
}

interface AppContextType {
  route: RouteInfo;
  navigate: (targetHash: string, skipWipe?: boolean) => void;
  motionOn: boolean;
  setMotionOn: (on: boolean) => void;
  toggleMotion: () => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  headerSurface: string;
  setHeaderSurface: (surf: string) => void;
  bottomSurface: string;
  setBottomSurface: (surf: string) => void;
  savedIds: string[];
  toggleSaved: (id: string) => void;
  tip: TipInfo | null;
  showTip: (targetEl: HTMLElement, text: string) => void;
  hideTip: () => void;
  triggerWipe: (onFull?: () => void) => void;
  wipeActive: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<RouteInfo>(() => parseRoute(window.location.hash));
  const [motionOn, setMotionOnState] = useState<boolean>(() => {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return storageGet<boolean>('kroon:motion', !prefersReduced);
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerSurface, setHeaderSurface] = useState('sodium');
  const [bottomSurface, setBottomSurface] = useState('sodium');
  const [savedIds, setSavedIds] = useState<string[]>(() => storageGet<string[]>('kroon:saved', []));
  const [tip, setTip] = useState<TipInfo | null>(null);
  const [wipeActive, setWipeActive] = useState(false);

  const setMotionOn = useCallback((on: boolean) => {
    setMotionOnState(on);
    storageSet('kroon:motion', on);
    document.documentElement.classList.toggle('motion-on', on);
  }, []);

  const toggleMotion = useCallback(() => {
    setMotionOn(!motionOn);
  }, [motionOn, setMotionOn]);

  useEffect(() => {
    document.documentElement.classList.toggle('motion-on', motionOn);
  }, [motionOn]);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', menuOpen);
  }, [menuOpen]);

  // Screen wipe trigger
  const triggerWipe = useCallback((onFull?: () => void) => {
    if (!motionOn) {
      if (onFull) onFull();
      return;
    }
    setWipeActive(true);
    // After half transition (220ms), trigger onFull callback
    setTimeout(() => {
      if (onFull) onFull();
    }, 220);
    // After full transition (440ms), end wipe
    setTimeout(() => {
      setWipeActive(false);
    }, 450);
  }, [motionOn]);

  const navigate = useCallback((targetHash: string, skipWipe = false) => {
    setMenuOpen(false);
    const dest = targetHash.startsWith('#') ? targetHash : `#${targetHash}`;
    if (window.location.hash === dest) {
      // Re-trigger route update if same hash
      setRoute(parseRoute(dest));
      window.scrollTo({ top: 0, behavior: motionOn ? 'smooth' : 'auto' });
      return;
    }

    if (skipWipe || !motionOn) {
      window.location.hash = dest;
      window.scrollTo(0, 0);
    } else {
      triggerWipe(() => {
        window.location.hash = dest;
        window.scrollTo(0, 0);
      });
    }
  }, [motionOn, triggerWipe]);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseRoute(window.location.hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      storageSet('kroon:saved', next);
      return next;
    });
  }, []);

  const showTip = useCallback((targetEl: HTMLElement, text: string) => {
    const rect = targetEl.getBoundingClientRect();
    const x = Math.min(Math.max(16, rect.left + rect.width / 2), window.innerWidth - 160);
    const y = rect.top >= 48 ? rect.top - 8 : rect.bottom + 8;
    setTip({ text, x, y, visible: true });
  }, []);

  const hideTip = useCallback(() => {
    setTip(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        route,
        navigate,
        motionOn,
        setMotionOn,
        toggleMotion,
        menuOpen,
        setMenuOpen,
        headerSurface,
        setHeaderSurface,
        bottomSurface,
        setBottomSurface,
        savedIds,
        toggleSaved,
        tip,
        showTip,
        hideTip,
        triggerWipe,
        wipeActive,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const useAppContext = useApp;

