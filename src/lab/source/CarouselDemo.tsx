import { useEffect, useRef, useState, type CSSProperties } from 'react';

const clips = [
  { id: 'orbit', title: 'Orbital rhythm', description: 'A quiet loop around a common center.', color: '#aaf4dc', kind: 'mint' },
  { id: 'wave', title: 'Signal / wave', description: 'Different frequencies. One moving pattern.', color: '#c3afff', kind: 'purple' },
  { id: 'pulse', title: 'Solar pulse', description: 'A little energy, moving through the system.', color: '#f0c780', kind: 'amber' },
] as const;
export function CarouselDemo() {
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const pending = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState<number | null>(null);
  const [auto, setAuto] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);
  const [reduced, setReduced] = useState(matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [error, setError] = useState('');
  const [events, setEvents] = useState<string[]>(['Ready · select a clip to begin.']);
  function log(message: string) { setEvents(current => [message, ...current].slice(0, 6)); }
  function pauseAll(except: number | null = null) { videos.current.forEach((video, index) => { if (index !== except) video?.pause(); }); }
  function goTo(index: number, preserveVideo = false) {
    const normalized = (index + clips.length) % clips.length;
    pauseAll(preserveVideo ? normalized : null);
    setError('');
    setActive(normalized);
    const card = cards.current[normalized];
    const list = track.current;
    if (!card || !list) return;
    const left = list.scrollLeft + card.getBoundingClientRect().left - list.getBoundingClientRect().left - (list.clientWidth - card.offsetWidth) / 2;
    pending.current = Math.abs(list.scrollLeft - left) < 3 ? null : normalized;
    list.scrollTo({ left, behavior: reduced ? 'instant' : 'smooth' });
  }
  function onScroll() {
    const list = track.current;
    if (!list) return;
    const center = list.getBoundingClientRect().left + list.clientWidth / 2;
    const distances = cards.current.map(card => card ? Math.abs(card.getBoundingClientRect().left + card.offsetWidth / 2 - center) : Infinity);
    if (pending.current !== null) {
      if (distances[pending.current] > 3) return;
      pending.current = null;
    }
    const closest = distances.indexOf(Math.min(...distances));
    setActive(current => {
      if (closest !== current) return closest;
      return current;
    });
  }
  function play(index: number) {
    goTo(index, true);
    const video = videos.current[index];
    if (!video) return;
    if (!video.paused) { video.pause(); return; }
    // Call within the click gesture. Playing state comes from media events.
    void video.play().catch(() => setError('Playback could not start. Try the play button again.'));
  }
  useEffect(() => {
    videos.current.forEach((video, index) => { if (index !== active) video?.pause(); });
    setEvents(current => [`Selected · ${clips[active].title} · background synchronized`, ...current].slice(0, 6));
  }, [active]);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { setReduced(query.matches); if (query.matches) setAuto(false); };
    const visibility = () => { setVisible(!document.hidden); if (document.hidden) videos.current.forEach(video => video?.pause()); };
    query.addEventListener('change', change);
    document.addEventListener('visibilitychange', visibility);
    const list = track.current;
    const resize = new ResizeObserver(() => {
      pending.current = null;
      const selected = cards.current.find(card => card?.dataset.active === 'true');
      if (selected && list) list.scrollTo({ left: list.scrollLeft + selected.getBoundingClientRect().left - list.getBoundingClientRect().left - (list.clientWidth - selected.offsetWidth) / 2, behavior: 'instant' });
    });
    if (list) resize.observe(list);
    return () => { query.removeEventListener('change', change); document.removeEventListener('visibilitychange', visibility); resize.disconnect(); videos.current.forEach(video => video?.pause()); };
  }, []);
  useEffect(() => {
    if (!auto || playing !== null || interacting || !visible || reduced) return;
    const timer = setTimeout(() => goTo(active + 1), 5000);
    return () => clearTimeout(timer);
  }, [auto, active, playing, interacting, visible, reduced]);
  const selected = clips[active];
  return <>
    <section className={`media-stage ${selected.kind}`} style={{ '--tone': selected.color } as CSSProperties} onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }} aria-labelledby="carousel-title">
      <div className="media-heading"><div><span className="eyebrow">THREE CLIPS / ONE SOURCE OF TRUTH</span><h2 id="carousel-title">An experience that<br />moves together.</h2></div><span className="media-state">{playing === null ? 'Ready to play' : 'Video playing'}<i /></span></div>
      <div className="media-track" ref={track} onScroll={onScroll} onScrollEnd={() => { pending.current = null; onScroll(); }} onPointerDown={() => { pending.current = null; }} onWheel={() => { pending.current = null; }} onKeyDown={event => { if ((event.target as HTMLElement).tagName === 'VIDEO') return; if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); goTo(active + (event.key === 'ArrowRight' ? 1 : -1)); } }} tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Original sample animation clips. Swipe or use the arrow buttons.">
        {clips.map((clip, index) => <div key={clip.id} ref={node => { cards.current[index] = node; }} className={`media-card ${clip.kind}`} data-active={active === index} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${clips.length}: ${clip.title}`}>
          <div className="video-frame"><video ref={node => { videos.current[index] = node; }} src={`media/${clip.id}.mp4`} poster={`media/${clip.id}.svg`} playsInline muted preload="metadata" controls={active === index && playing === index} onPlay={() => { pauseAll(index); if (active !== index) goTo(index, true); setPlaying(index); log(`Playing · ${clip.title}`); }} onPause={() => { setPlaying(current => current === index ? null : current); log(`Paused · ${clip.title}`); }} onEnded={() => { setPlaying(current => current === index ? null : current); log(`Ended · ${clip.title}`); }} onError={() => setError(`The sample clip “${clip.title}” could not load. Its poster remains available.`)} aria-label={`${clip.title} sample video`} />
            <button className={`video-play ${playing === index ? 'is-playing' : ''}`} onClick={() => play(index)} aria-label={`${playing === index ? 'Pause' : 'Play'} ${clip.title}`}><span aria-hidden="true">{playing === index ? 'Ⅱ' : '▶'}</span><span>{playing === index ? 'Pause' : 'Play clip'}</span></button>
          </div><div className="media-card-caption"><span className="clip-number">0{index + 1}</span><div><h3>{clip.title}</h3><p>{clip.description}</p></div><span className="clip-length">06 SEC</span></div>
        </div>)}
      </div>
      <div className="carousel-footer"><div className="carousel-arrows"><button onClick={() => goTo(active - 1)} aria-label="Previous clip">←</button><button onClick={() => goTo(active + 1)} aria-label="Next clip">→</button></div><div className="carousel-dots" role="group" aria-label="Select a clip">{clips.map((clip, index) => <button key={clip.id} onClick={() => goTo(index)} aria-label={`Select ${clip.title}`} aria-pressed={index === active}><span /></button>)}</div><span className="slide-announcement" role="status">0{active + 1} / 03 · {selected.title}</span></div>
    </section>
    <div className="media-under"><div><label className="check-line"><input type="checkbox" checked={auto} disabled={reduced} onChange={event => setAuto(event.target.checked)} />Auto-browse clips</label><p className="field-help">{reduced ? 'Auto-browse is off for reduced motion.' : playing !== null && auto ? 'Paused while your video plays.' : 'Optional. Advances every 5 seconds; pauses for playback, hover, or focus.'}</p></div><p className="gesture-hint">Swipe on mobile · arrow keys · click a dot</p></div>
    {error && <p className="error-text" role="alert">{error}</p>}
    <details className="media-events"><summary>Watch the coordination log</summary><ul aria-live="polite">{events.map((event, index) => <li key={`${index}-${event}`}>{event}</li>)}</ul></details>
    <section className="engineering-notes"><h2>The engineering behind the interaction</h2><div className="notes-grid"><article><span>01 / SELECTION</span><h3>One selected slide.</h3><p>Arrows, dots, keyboard, and native swiping update a shared selection. The background and caption follow the same state.</p></article><article><span>02 / MEDIA</span><h3>Never competing playback.</h3><p>Scoped video refs pause other clips. Playback events drive the controls, and rejected play requests have an explicit recovery message.</p></article><article><span>03 / LIFECYCLE</span><h3>Motion with an off switch.</h3><p>Timers and observers clean up on unmount. Playback pauses when the page is hidden, and reduced motion disables automatic browsing.</p></article></div><details><summary>Connection to my BODi work & source</summary><p>I extended React carousel and hosted-video components in Harmony, including posters, playback coordination, centering selected videos, and a swipe/background synchronization fix. This standalone recreation uses new artwork and locally generated clips, without company media or services.</p><div className="source-links"><a href="source/CarouselDemo.tsx" target="_blank" rel="noopener">React carousel (.tsx) ↗</a></div></details></section>
  </>;
}
