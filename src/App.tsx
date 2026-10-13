import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Compass, Crosshair, Earth, ExternalLink, Globe2, Info, Menu, Orbit, Plus, RotateCcw, Satellite, Sparkles, X, Scan, ZoomIn, ZoomOut, Hand, Volume2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SpaceScene from './components/SpaceScene';
import { planets, journeyPlanets, type PlanetInfo } from './data/planets';

gsap.registerPlugin(ScrollTrigger);
const SEGMENT_VH = 1.65;

function OrbThumbnail({ planet }: { planet: PlanetInfo }) {
  return <span className="orb-thumbnail" style={{ '--orb-color': planet.color, backgroundImage: `linear-gradient(95deg, transparent 20%, rgba(0,0,0,.76) 96%), url('${planet.texture}')` } as CSSProperties} />;
}

function PlanetChapter({ planet, index, onDetails, onNext, onInspect }: {
  planet: PlanetInfo; index: number; onDetails: (planet: PlanetInfo) => void; onNext: () => void; onInspect: () => void;
}) {
  return (
    <section className="chapter" id={`planet-${planet.id}`} data-planet={planet.id} aria-label={`Explore ${planet.name}`}>
      <div className="chapter-inner">
        <div className="chapter-copy">
          <div className="overline" data-reveal><span className="overline-dot" style={{ background: planet.accent }} />{planet.classification}</div>
          <div className="chapter-index" data-reveal>EXPLORATION LOG <span>{planet.number} / 08</span></div>
          <h1 className="chapter-title" data-reveal><span>{planet.headline[0]}</span><strong style={{ color: planet.accent }}>{planet.headline[1]}</strong></h1>
          <p className="chapter-tagline" data-reveal>{planet.tagline}</p>
          <p className="chapter-description" data-reveal>{planet.introduction}</p>
          <div className="chapter-stats" data-reveal>
            <div><span>DIAMETER</span><strong>{planet.diameter}</strong></div>
            <div><span>LENGTH OF DAY</span><strong>{planet.day}</strong></div>
            <div><span>YEAR</span><strong>{planet.year}</strong></div>
          </div>
          <div className="chapter-actions" data-reveal>
            <button className="primary-action" onClick={() => onDetails(planet)}>
              EXPLORE PLANET <ArrowUpRight size={15} strokeWidth={2} />
            </button>
            <button className="text-action" onClick={onNext}>
              {index === journeyPlanets.length - 1 ? 'RESTART JOURNEY' : 'NEXT DESTINATION'} <ArrowRight size={17} />
            </button>
          </div>
        </div>
        <div className="mobile-exhibit">
          <div className="mobile-topline"><span>FIELD NOTE / {planet.number}—08</span><span>{planet.classification.split(' / ')[0]}</span></div>
          <div className="mobile-gesture" aria-hidden="true">SWIPE DOWN TO TRAVEL THROUGH SPACE</div>
          <div className="mobile-exhibit-inner">
            <p className="mobile-exhibit-kicker">{planet.headline[0]}</p>
            <h2 className="mobile-planet-name">{planet.name}</h2>
            <p className="mobile-exhibit-intro">{planet.introduction}</p>
            <div className="mobile-action-row">
              <button className="mobile-details-button" onClick={() => onDetails(planet)}>PLANET DETAILS <ArrowUpRight size={17} /></button>
              <button className="mobile-inspect-button" onClick={onInspect}><Hand size={15} /> INSPECT 3D</button>
            </div>
          </div>
        </div>
        <div className="planet-callout" data-reveal aria-hidden="true">
          <span className="callout-cross">+</span><span className="callout-line" />
          <div><small>PLANETARY NOTE</small><strong>{planet.callout}</strong></div>
        </div>
        <div className="chapter-bottom" data-reveal>
          <span className="chapter-location"><Crosshair size={15} /> SOL SYSTEM <span className="slash">/</span> {planet.name.toUpperCase()}</span>
          <span className="chapter-draghint"><Orbit size={14} strokeWidth={1.4} /> DRAG PLANET TO ROTATE</span>
          <span className="chapter-scrollhint"><span className="scroll-line" />SCROLL TO TRAVEL <ArrowDown size={14} /></span>
        </div>
      </div>
    </section>
  );
}

function Atlas({ current, onClose, onNavigate }: {
  current: number; onClose: () => void; onNavigate: (index: number) => void;
}) {
  return (
    <div className="overlay atlas-overlay" role="dialog" aria-modal="true" aria-label="Planet atlas">
      <div className="overlay-heading">
        <div className="small-logo"><Orbit size={22} /> COSMOS <span> / ATLAS</span></div>
        <button className="icon-button close-button" onClick={onClose} aria-label="Close atlas"><X size={22} /></button>
      </div>
      <div className="atlas-inner">
        <p className="mini-heading"><span className="accent-dash" /> PLANETARY INDEX / EIGHT WORLDS</p>
        <h2 className="overlay-title">CHOOSE YOUR <em>NEXT WORLD.</em></h2>
        <p className="overlay-subtitle">Explore eight planets. The main journey travels outward from Earth to Neptune; Mercury and Venus are available as individual dossiers.</p>
        <div className="atlas-grid">
          {planets.map((planet, index) => (
            <button className={`atlas-tile ${current === index ? 'selected' : ''}`} key={planet.id} onClick={() => onNavigate(index)}>
              <div className="tile-planet"><OrbThumbnail planet={planet} /></div>
              <span className="tile-top"><span>{planet.number} / 08</span><ArrowUpRight size={16} /></span>
              <strong>{planet.name.toUpperCase()}</strong>
              <small>{planet.classification.split(' / ')[0]}</small>
            </button>
          ))}
        </div>
        <p className="atlas-footnote">The cinematic journey travels outward from Earth to Neptune. Mercury and Venus are available in the atlas as additional scientific dossiers.</p>
      </div>
    </div>
  );
}

function PlanetDossier({ planet, onClose, onNext, onMoons }: {
  planet: PlanetInfo; onClose: () => void; onNext: () => void; onMoons: (host: string) => void;
}) {
  const touchStart = useRef<number | null>(null);
  return (
    <div className="overlay dossier-backdrop" role="dialog" aria-modal="true" aria-label={`${planet.name} planetary dossier`}>
      <button className="dossier-scrim" aria-label="Close planet dossier" onClick={onClose} />
      <aside className="dossier-panel" style={{ '--local-accent': planet.accent } as CSSProperties}
        onTouchStart={(e) => { if (e.currentTarget.scrollTop < 3) touchStart.current = e.touches[0].clientY; else touchStart.current = null; }}
        onTouchEnd={(e) => { if (touchStart.current !== null && e.changedTouches[0].clientY - touchStart.current > 110) onClose(); touchStart.current = null; }}>
        <div className="dossier-top">
          <span><Satellite size={16} /> PLANETARY DOSSIER / {planet.number}</span>
          <button className="icon-button" aria-label="Close planet dossier" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="dossier-orb"><OrbThumbnail planet={planet} /><span className="dossier-orbit" /></div>
        <div className="dossier-id"><span className="accent-dash" /> CLASSIFIED / SOL SYSTEM</div>
        <h2>{planet.name.toUpperCase()}</h2>
        <p className="dossier-description">{planet.details}</p>
        <div className="dossier-table">
          {[['MEAN DISTANCE FROM SUN', planet.distance], ['EQUATORIAL DIAMETER', planet.diameter], ['LENGTH OF DAY', planet.day], ['ORBITAL PERIOD', planet.year], ['TEMPERATURE', planet.temperature], ['KNOWN MOONS', planet.moons]].map(([label, value]) => (
            <div className="dossier-row" key={label}><span>{label}</span><strong>{value}</strong></div>
          ))}
        </div>
        <div className="fact-card">
          <div><Sparkles size={16} /><strong>DID YOU KNOW?</strong></div>
          <p>{planet.fact}</p>
        </div>
        {['earth', 'jupiter', 'saturn'].includes(planet.id) && <button className="dossier-moon-link" onClick={() => onMoons(planet.id)}><Satellite size={17} /> EXPLORE {planet.name.toUpperCase()}’S MOONS <ArrowUpRight size={17} /></button>}
        <button className="dossier-moon-link" onClick={() => (window as unknown as { COSMOS_DISCOVERY?: { openHotspots: (id: string) => void }}).COSMOS_DISCOVERY?.openHotspots(planet.id)}><Crosshair size={17} /> DISCOVER PLANETARY FEATURES <ArrowUpRight size={17} /></button>
        <div className="dossier-links">
          <a href={planet.url} target="_blank" rel="noopener noreferrer">EXPLORE NASA SCIENCE <ExternalLink size={14} /></a>
          <button onClick={onNext}>NEXT WORLD <ArrowRight size={15} /></button>
        </div>
      </aside>
    </div>
  );
}

function MissionPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay mission-overlay" role="dialog" aria-modal="true" aria-label="About the Cosmos mission">
      <div className="mission-card">
        <button className="icon-button mission-close" onClick={onClose} aria-label="Close about"><X size={22} /></button>
        <div className="mission-emblem"><Orbit size={42} strokeWidth={1.1} /></div>
        <p className="mini-heading">ABOUT / THE PROJECT</p>
        <h2>WE ARE MADE<br /><em>OF STARSTUFF.</em></h2>
        <p>COSMOS is a scroll-driven journey through eight planets. It combines 3D rendering, planetary texture maps, and a visual language inspired by space exploration. This is an independent educational art project, not an official NASA website.</p>
        <div className="mission-features"><span><Globe2 size={17} /> EIGHT WORLDS</span><span><Compass size={17} /> CAMERA TRAVEL</span><span><Info size={17} /> SCIENCE FACTS</span></div>
        <p className="mission-credits">Planetary source maps: JPL Solar System Simulator texture archive. Space imagery: supplied Gemini-generated backgrounds. Certain textures have been visually enhanced or reconstructed for this artistic experience; planet scale, spacing, and camera travel are illustrative.</p>
        <button className="primary-action" onClick={onClose}>RETURN TO THE JOURNEY <ArrowRight size={16} /></button>
      </div>
    </div>
  );
}

export default function App() {
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [atlasOpen, setAtlasOpen] = useState(false);
  const [dossier, setDossier] = useState<PlanetInfo | null>(null);
  const [missionOpen, setMissionOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [inspectMode, setInspectMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [motion] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [sceneReady, setSceneReady] = useState(false);
  const animationFrame = useRef(0);
  const current = journeyPlanets[active];
  const overlayOpen = atlasOpen || dossier !== null || missionOpen || menuOpen;

  const goTo = useCallback((index: number) => {
    setInspectMode(false); setZoom(1);
    const target = Math.min(Math.max(0, index), journeyPlanets.length - 1);
    if (index >= journeyPlanets.length) { setAtlasOpen(false); setMenuOpen(false); setMissionOpen(false); setDossier(planets[index]); return; }
    window.scrollTo({ top: target * window.innerHeight * SEGMENT_VH, behavior: motion ? 'smooth' : 'auto' });
    setAtlasOpen(false); setDossier(null); setMenuOpen(false); setMissionOpen(false);
  }, [motion]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const pos = Math.max(0, Math.min(journeyPlanets.length - 1, window.scrollY / (window.innerHeight * SEGMENT_VH)));
      const phase = pos % 1;
      const flight = Math.sin(Math.PI * Math.max(0, Math.min(1, (phase - .34) / .62)));
      document.documentElement.style.setProperty('--flight', String(Math.max(0,flight)));
      document.documentElement.style.setProperty('--ambient-shift', `${pos * -11}px`);
      document.querySelectorAll<HTMLElement>('.chapter-inner').forEach((node, i) => {
        const age = pos - i;
        const phase = Math.max(0, Math.min(1, (age - .36) / .27));
        const eased = phase * phase * (3 - 2 * phase);
        node.style.opacity = String(age <= .36 ? 1 : 1 - eased);
      });
      progressRef.current = pos;
      setActive(old => { const next = Math.min(journeyPlanets.length - 1, Math.floor(pos + .17)); return old === next ? old : next; });
      setProgressPercent(Math.round(pos / (journeyPlanets.length - 1) * 100));
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.chapter').forEach((chapter) => {
        const items = chapter.querySelectorAll('[data-reveal]');
        gsap.fromTo(items, { opacity: 0, y: 30, filter: 'blur(7px)' }, {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: .95, stagger: .07,
          ease: 'power3.out',
          scrollTrigger: { trigger: chapter, start: 'top 72%', end: 'bottom 17%', toggleActions: 'play reverse play reverse' },
        });
      });
    });
    const onRefresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onRefresh);
    return () => { ctx.revert(); window.removeEventListener('resize', onRefresh); };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('overlay-open', overlayOpen);
    return () => document.body.classList.remove('overlay-open');
  }, [overlayOpen]);

  useEffect(() => {
    document.body.classList.toggle('inspect-lock', inspectMode);
    return () => document.body.classList.remove('inspect-lock');
  }, [inspectMode]);

  useEffect(() => {
    const onNavigate = (event: Event) => {
      const id = (event as CustomEvent<{id: string}>).detail?.id;
      const chapterIndex = journeyPlanets.findIndex(planet => planet.id === id);
      if (chapterIndex >= 0) goTo(chapterIndex);
      else { const other = planets.find(planet => planet.id === id); if (other) { setAtlasOpen(false); setDossier(other); } }
    };
    window.addEventListener('cosmos:navigate', onNavigate);
    return () => window.removeEventListener('cosmos:navigate', onNavigate);
  }, [goTo]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setInspectMode(false); setZoom(1);
        setFocusMode(false);
        setDossier(null); setAtlasOpen(false); setMissionOpen(false); setMenuOpen(false);
      } else if (!overlayOpen && event.key.toLowerCase() === 'f' && !event.repeat && !['INPUT','TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName || '')) {
        setFocusMode(value => !value);
      } else if (!overlayOpen && ['ArrowRight', 'ArrowLeft'].includes(event.key) && !['INPUT','TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName || '')) {
        event.preventDefault(); goTo(active + (event.key === 'ArrowRight' ? 1 : -1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, goTo, overlayOpen]);

  useEffect(() => {
    animationFrame.current = window.setTimeout(() => setSceneReady(true), 850);
    return () => clearTimeout(animationFrame.current);
  }, []);

  return (
    <div className={`app-shell ${focusMode ? "focus-mode" : ""} ${inspectMode ? "inspect-mode" : ""}`} style={{ '--active-color': current.accent } as CSSProperties}>
      <div className="space-backdrops" aria-hidden="true">
        {['deep-space', 'nebula', 'dark-space', 'starfield'].map((name, index) => (
          <div className={`backdrop-layer ${Math.floor(active / 2) % 4 === index ? 'is-visible' : ''}`} key={name} style={{ backgroundImage: `url(/assets/backgrounds/${name}.webp)` }} />
        ))}
      </div>
      <div className="space-vignette" aria-hidden="true" />
      <div className="space-noise" aria-hidden="true" />
      <div className="flight-velocity" aria-hidden="true" />
      <div className="transit-ui" aria-hidden="true"><small>INTERPLANETARY TRANSIT</small><strong>{journeyPlanets[Math.min(active,journeyPlanets.length - 2)].name.toUpperCase()} <span>—</span> {journeyPlanets[Math.min(active + 1,journeyPlanets.length - 1)].name.toUpperCase()}</strong><span>SCROLL TO CONTROL FLIGHT</span></div>
      <div className="scene-layer"><SpaceScene progressRef={progressRef} activeIndex={active} motion={motion} inspectMode={inspectMode} zoom={zoom} onZoom={setZoom} /></div>
      <div className={`startup-curtain ${sceneReady ? 'ready' : ''}`} aria-hidden="true"><div className="startup-symbol"><Orbit size={45} strokeWidth={1} /></div><strong>COSMOS</strong><small>PREPARING VISUALIZATION</small></div>

      <header className="topbar">
        <button className="brand" onClick={() => goTo(0)} aria-label="Return to Earth">
          <span className="brand-icon"><Orbit size={23} strokeWidth={1.4} /></span>
          <span className="brand-words"><strong>COSMOS</strong><small>PLANETARY FIELD GUIDE</small></span>
        </button>
        <nav className="top-nav" aria-label="Main navigation">
          <button onClick={() => goTo(0)}>THE JOURNEY</button>
          <button onClick={() => setAtlasOpen(true)}>PLANET ATLAS</button>
          <button onClick={() => setMissionOpen(true)}>ABOUT THE PROJECT</button>
        </nav>
        <div className="topbar-right">
          <button className="mobile-atlas-launch" style={{display:'none'}} onClick={() => setAtlasOpen(true)} aria-label="Explore all planets" title="Explore all planets"><Compass size={18}/></button>
          <span className="signal">SOLAR SYSTEM / INTERACTIVE</span>
          <button className={`focus-toggle ${focusMode ? "is-active" : ""}`} onClick={() => setFocusMode(v => !v)} title={focusMode ? "Show planet information" : "Hide information for an unobstructed planet view"} aria-label={focusMode ? "Exit focus mode" : "Enter focus mode"} aria-pressed={focusMode}><Scan size={15} strokeWidth={1.7} /><span>{focusMode ? "EXIT FOCUS" : "FOCUS VIEW"}</span></button>
          <button className="motion-toggle" data-cl-sound="" type="button" aria-label="COSMOS soundtrack is enabled" aria-pressed="true" title="Sound is enabled"><Volume2 size={16} strokeWidth={1.6} /><span>SOUND ON</span></button>
          <button className="mobile-menu icon-button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
        </div>
      </header>

      <div className="top-divider" aria-hidden="true" />
      <aside className="edge-data" aria-hidden="true"><span>PLANETARY VISUALIZATION</span><span>ILLUSTRATIVE DISTANCES</span></aside>
      <aside className="chapter-rail" aria-label="Planet navigation">
        <span className="rail-title">DESTINATIONS</span>
        {journeyPlanets.map((planet, index) => (
          <button
            className={`rail-stop ${active === index ? 'current' : ''}`}
            key={planet.id}
            onClick={() => goTo(index)}
            title={`Explore ${planet.name}`}
            aria-label={`Go to ${planet.name}`}
            aria-current={active === index ? 'step' : undefined}
          >
            <span className="rail-dot" /><span className="rail-name">{planet.name.toUpperCase()}</span>
          </button>
        ))}
        <span className="rail-tail">06 STOPS / 08 WORLDS</span>
      </aside>

      <main id="journey">
        {journeyPlanets.map((planet, index) => (
          <PlanetChapter key={planet.id} planet={planet} index={index}
            onDetails={setDossier} onNext={() => goTo((index + 1) % journeyPlanets.length)} onInspect={() => { setZoom(1); setInspectMode(true); }} />
        ))}
        <section className="journey-end" aria-label="Journey complete">
          <div className="end-eyebrow"><span className="overline-dot" /> EXPEDITION COMPLETE</div>
          <h2>THE UNIVERSE<br /><em>IS WAITING.</em></h2>
          <p>We have only begun to explore the worlds beyond our own.</p>
          <div><button className="primary-action" onClick={() => goTo(0)}>RESTART THE JOURNEY <RotateCcw size={17} /></button><button className="text-action" onClick={() => setAtlasOpen(true)}>OPEN THE ATLAS <ArrowUpRight size={16} /></button></div>
          <span className="end-credit">COSMOS — AN INDEPENDENT PLANETARY EXPERIENCE<br />NOT AFFILIATED WITH NASA</span>
        </section>
      </main>

      <div className="bottom-hud">
        <div className="hud-coordinates"><span className="hud-cross"><Plus size={20} strokeWidth={1} /></span><div><small>NOW EXPLORING</small><strong>{current.name.toUpperCase()} <span>/ {current.number}</span></strong></div></div>
        <div className="hud-progress"><span>{String(progressPercent).padStart(2, '0')}% COMPLETE</span><div className="hud-track"><span style={{ width: `${progressPercent}%` }} /></div></div>
        <button className="atlas-launch" onClick={() => setAtlasOpen(true)}><Compass size={18} strokeWidth={1.5} /> OPEN PLANET ATLAS <ArrowUpRight size={15} /></button>
        <button className="mobile-next" style={{display:'none'}} aria-label={active===journeyPlanets.length-1?'Journey complete':`Travel to ${journeyPlanets[active+1]?.name}`} disabled={active===journeyPlanets.length-1} onClick={() => goTo(active+1)}><ArrowRight size={19}/></button>
      </div>
      <div className="inspect-caption" aria-live="polite">DRAG TO ROTATE · PINCH OR USE +/− TO ZOOM</div>
      <div className="inspect-toolbar">
        <button className="inspect-zoom" onClick={() => setZoom(z => Math.min(1.55, +(z + .12).toFixed(2)))} disabled={zoom>=1.54} aria-label="Zoom into planet"><ZoomIn size={20}/></button>
        <button className="inspect-zoom" onClick={() => setZoom(z => Math.max(.72, +(z - .12).toFixed(2)))} disabled={zoom<=.73} aria-label="Zoom away from planet"><ZoomOut size={20}/></button>
        <button className="inspect-finish" onClick={() => {setInspectMode(false);setZoom(1)}}>DONE INSPECTING <X size={16}/></button>
      </div>
      <div className="floating-side-controls">
        <button aria-label="Previous planet" title="Previous planet" onClick={() => goTo(active - 1)} disabled={active === 0}><ArrowLeft size={17} /></button>
        <button aria-label="Next planet" title="Next planet" onClick={() => goTo(active + 1)} disabled={active === journeyPlanets.length - 1}><ArrowRight size={17} /></button>
      </div>

      {atlasOpen && <Atlas current={active} onClose={() => setAtlasOpen(false)} onNavigate={goTo} />}
      {dossier && <PlanetDossier planet={dossier} onClose={() => setDossier(null)} onNext={() => goTo((planets.indexOf(dossier) + 1) % planets.length)} onMoons={(host) => { setDossier(null); (window as Window & { COSMOS_LAB?: { openMoonOf:(host:string)=>void } }).COSMOS_LAB?.openMoonOf(host); }} />}
      {missionOpen && <MissionPanel onClose={() => setMissionOpen(false)} />}
      {menuOpen && (
        <div className="overlay mobile-overlay" role="dialog" aria-label="Mobile navigation" aria-modal="true">
          <button className="icon-button mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={24} /></button>
          <span className="small-logo"><Earth size={22} /> COSMOS</span>
          <button onClick={() => goTo(0)}>THE JOURNEY <ArrowUpRight size={22} /></button>
          <button onClick={() => { setMenuOpen(false); setAtlasOpen(true); }}>PLANET ATLAS <ArrowUpRight size={22} /></button>
          <button onClick={() => { setMenuOpen(false); setMissionOpen(true); }}>ABOUT THE PROJECT <ArrowUpRight size={22} /></button>
          <small>PLANETARY FIELD GUIDE / 2026</small>
        </div>
      )}
    </div>
  );
}
