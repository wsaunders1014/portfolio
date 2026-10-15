import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ConditionalDemo } from './ConditionalDemo';
import { CarouselDemo } from './CarouselDemo';
import { OriginalExcerpt } from './OriginalExcerpt';

function App() {
  const params = new URLSearchParams(location.search);
  const [demo, setDemo] = useState<'conditions' | 'carousel'>(params.get('demo') === 'carousel' ? 'carousel' : 'conditions');
  const back = params.get('portfolio') === 'mobile' ? '../mobile-flight.html#bodi' : '../index.html#bodi';
  function select(next: typeof demo) { setDemo(next); const url = new URL(location.href); url.searchParams.set('demo', next); history.replaceState(null, '', url); }
  return <><a className="skip-link" href="#playground">Skip to demo</a><header className="lab-header"><a className="lab-identity" href={back}>WS <span>/ COMPONENT LAB</span></a><a className="back-link" href={back}>← Back to BODi</a></header><main><div className="lab-intro"><div><p className="eyebrow">WILL SAUNDERS / FRONT-END EXPLORATIONS</p><h1>Small interfaces.<br /><em>Real decisions.</em></h1><p>Interactive React & TypeScript examples drawn from my work in commerce, content, and media.</p></div><div className="lab-stamp"><span className="status-dot" />LIVE, EDITABLE DEMOS<span>React · TypeScript</span></div></div><nav className="demo-tabs" aria-label="Component demos"><button onClick={() => select('conditions')} aria-current={demo === 'conditions' ? 'page' : undefined}><span>01</span>Conditional content<span className="tab-arrow">↗</span></button><button onClick={() => select('carousel')} aria-current={demo === 'carousel' ? 'page' : undefined}><span>02</span>Carousel & video<span className="tab-arrow">↗</span></button></nav><div className="demo-context"><span>{demo === 'conditions' ? 'Builder.io / content logic' : 'Harmony / media interaction'}</span><p>Runnable portfolio recreation · sample data and original demo assets</p></div><div id="playground" tabIndex={-1}>{demo === 'conditions' ? <ConditionalDemo /> : <CarouselDemo />}</div><OriginalExcerpt kind={demo} /><footer className="lab-footer"><span>Built for a closer look.</span><a href={back}>Back to the BODi case study ↗</a></footer></main></>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
