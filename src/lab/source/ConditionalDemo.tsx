import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { evaluateRule, type Audience, type Rule } from './rules';

const products = [{ sku: 'MAT', name: 'Meteor mat', price: '$48', color: 'mint' }, { sku: 'BAND', name: 'Orbit bands', price: '$24', color: 'purple' }, { sku: 'BOTTLE', name: 'Solar bottle', price: '$18', color: 'amber' }] as const;
const AudienceContext = createContext<Audience | null>(null);
function useAudience() {
  const value = useContext(AudienceContext);
  if (!value) throw new Error('Conditional content requires an audience provider.');
  return value;
}
function ConditionalContent({ rule, editor, children }: { rule: Rule; editor: boolean; children: ReactNode }) {
  const decision = evaluateRule(rule, useAudience());
  if (!decision.matches && !editor) return <div className="empty-preview"><span className="empty-icon">◇</span><h3>Hidden for this visitor.</h3><p>Change the audience or the rule to reveal the offer.</p></div>;
  return <div className={!decision.matches ? 'editor-ghost' : ''}>{editor && <div className="editor-marker">Editor preview · {decision.matches ? 'visible to shoppers' : 'hidden from shoppers'}</div>}{children}</div>;
}
export function ConditionalDemo() {
  const [cart, setCart] = useState<string[]>(['MAT']);
  const [campaign, setCampaign] = useState('?utm_campaign=launch&utm_source=email');
  const [assignment, setAssignment] = useState<Audience['assignment']>('treatment');
  const [rule, setRule] = useState<Rule>({ kind: 'cart', skus: ['MAT', 'BAND'], match: 'any', present: true });
  const [editor, setEditor] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const exposures = useRef(new Set<string>());
  const audience = { cart, campaign, assignment };
  const decision = evaluateRule(rule, audience);
  // Simulate exposure only after matching content commits in shopper view.
  // Re-renders and editor previews must not produce duplicate exposures.
  useEffect(() => {
    if (editor || rule.kind !== 'experiment' || !decision.matches || assignment === 'off') return;
    const key = `sample-offer:${assignment}`;
    if (exposures.current.has(key)) return;
    exposures.current.add(key);
    setEvents(previous => [`Exposure · sample-offer / ${assignment}`, ...previous]);
  }, [editor, rule.kind, decision.matches, assignment]);
  const toggleCart = (sku: string) => setCart(current => current.includes(sku) ? current.filter(item => item !== sku) : [...current, sku]);
  function chooseRule(kind: Rule['kind']) {
    setRule(kind === 'cart' ? { kind, skus: ['MAT', 'BAND'], match: 'any', present: true } : kind === 'campaign' ? { kind, key: 'utm_campaign', value: 'launch', operator: 'equals' } : { kind, variant: 'treatment', includeUnassigned: false });
  }
  return <AudienceContext.Provider value={audience}>
    <div className="demo-grid">
      <section className="control-panel" aria-labelledby="audience-title">
        <div className="panel-heading"><span className="step">01</span><h2 id="audience-title">Set the conditions</h2></div>
        <label className="field">Show content based on<select value={rule.kind} onChange={event => chooseRule(event.target.value as Rule['kind'])}><option value="cart">Products in cart</option><option value="campaign">Campaign URL</option><option value="experiment">Experiment assignment</option></select></label>
        {rule.kind === 'cart' && <>
          <fieldset><legend>Visitor’s sample cart</legend>{products.map(product => <label key={product.sku} className="product-option"><input type="checkbox" checked={cart.includes(product.sku)} onChange={() => toggleCart(product.sku)} /><span className={`product-mark ${product.color}`} aria-hidden="true">{product.sku === 'MAT' ? '▱' : product.sku === 'BAND' ? '◎' : '▯'}</span><span>{product.name}<small>{product.sku}</small></span><span className="product-price">{product.price}</span></label>)}</fieldset>
          <fieldset className="rule-products"><legend>Products this rule checks</legend>{products.map(product => <label key={product.sku}><input type="checkbox" checked={rule.skus.includes(product.sku)} onChange={() => setRule({ ...rule, skus: rule.skus.includes(product.sku) ? rule.skus.filter(sku => sku !== product.sku) : [...rule.skus, product.sku] })} />{product.name}</label>)}</fieldset>
          <div className="field-pair"><label className="field">Match<select value={rule.match} onChange={event => setRule({ ...rule, match: event.target.value as 'any' | 'all' })}><option value="any">Any selected product</option><option value="all">All selected products</option></select></label><label className="field">Action<select value={String(rule.present)} onChange={event => setRule({ ...rule, present: event.target.value === 'true' })}><option value="true">Show on match</option><option value="false">Hide on match</option></select></label></div>
        </>}
        {rule.kind === 'campaign' && <>
          <label className="field">Visitor’s campaign URL<textarea rows={3} value={campaign} onChange={event => setCampaign(event.target.value)} aria-invalid={Boolean(decision.error)} aria-describedby="campaign-help" /></label>
          <p id="campaign-help" className={decision.error ? 'error-text' : 'field-help'}>{decision.error || 'Use a full URL or query string. No navigation or requests are made.'}</p>
          <label className="field">Parameter<input value={rule.key} onChange={event => setRule({ ...rule, key: event.target.value })} /></label>
          <label className="field">Condition<select value={rule.operator} onChange={event => setRule({ ...rule, operator: event.target.value as 'equals' | 'exists' | 'notEquals' })}><option value="equals">Equals</option><option value="exists">Is present</option><option value="notEquals">Is present and does not equal</option></select></label>
          {rule.operator !== 'exists' && <label className="field">Value<input value={rule.value} onChange={event => setRule({ ...rule, value: event.target.value })} /></label>}
        </>}
        {rule.kind === 'experiment' && <>
          <label className="field">Visitor assignment<select value={assignment} onChange={event => setAssignment(event.target.value as Audience['assignment'])}><option value="control">Control</option><option value="treatment">Treatment</option><option value="off">Unassigned / experiment off</option></select></label>
          <label className="field">Content targets<select value={rule.variant} onChange={event => setRule({ ...rule, variant: event.target.value as 'control' | 'treatment' })}><option value="control">Control</option><option value="treatment">Treatment</option></select></label>
          <label className="check-line"><input type="checkbox" checked={rule.includeUnassigned} onChange={event => setRule({ ...rule, includeUnassigned: event.target.checked })} />Also show to unassigned visitors</label>
          <div className="event-log"><h3>Local exposure log</h3><p>One event per assigned variant, after content is shown. Nothing leaves this page.</p><ul aria-live="polite">{events.length ? events.map(event => <li key={event}>{event}</li>) : <li>No exposures recorded.</li>}</ul></div>
        </>}
        <label className="editor-toggle"><input type="checkbox" checked={editor} onChange={event => setEditor(event.target.checked)} /><span>Editor preview<small>Inspect content even when the rule hides it.</small></span></label>
      </section>
      <section className="preview-panel" aria-labelledby="preview-title">
        <div className="panel-heading"><span className="step">02</span><h2 id="preview-title">See the experience</h2><span className={`status-badge ${decision.matches ? 'positive' : ''}`}>{decision.matches ? 'Rule matched' : 'No match'}</span></div>
        <div className="store-preview"><div className="store-header"><span>ORBIT / EVERYDAY EQUIPMENT</span><span>Bag ({cart.length})</span></div><div className="store-intro"><span className="eyebrow">A LITTLE ROOM TO MOVE</span><h3>Find your<br />daily orbit.</h3><p>Fictional products. A real content decision.</p><div className="orbit-illustration" aria-hidden="true"><i /><i /><i /><b>◎</b></div></div><ConditionalContent rule={rule} editor={editor}><article className="offer-card"><span className="offer-star" aria-hidden="true">✦</span><div><span className="eyebrow">MADE FOR YOUR ROUTINE</span><h3>A little extra momentum.</h3><p>Your sample offer is visible because this visitor matches the configured rule.</p></div><span className="sample-tag">Demo offer</span></article></ConditionalContent></div>
        <div className="decision-trace" role="status"><span className="eyebrow">WHY THIS HAPPENED</span><p>{decision.reason}</p>{editor && <small>Editor mode changes the preview, not the shopper’s eligibility.</small>}</div>
      </section>
    </div>
    <section className="engineering-notes"><h2>The engineering behind the interaction</h2><div className="notes-grid"><article><span>01 / RULES</span><h3>A decision you can test.</h3><p>A typed, pure evaluator handles rules independently of rendering. Empty product rules fail closed, and campaign values are compared literally.</p></article><article><span>02 / COMPOSITION</span><h3>One audience. Two views.</h3><p>React context supplies visitor state. The same content gate supports a shopper view and an inspectable editor preview.</p></article><article><span>03 / SIDE EFFECTS</span><h3>Measure after rendering.</h3><p>A separate effect records mock exposure once per variant. Editor previews never count as shopper exposures.</p></article></div><details><summary>Connection to my BODi work & source</summary><p>At BODi, I extended the shared Builder.io ConditionalBox with experiment, query-string, and cart-SKU visibility options. This is a new, standalone recreation of those concepts, with fictional products and no company services.</p><div className="source-links"><a href="source/rules.ts" target="_blank" rel="noopener">Rules evaluator (.ts) ↗</a><a href="source/ConditionalDemo.tsx" target="_blank" rel="noopener">React component (.tsx) ↗</a></div></details></section>
  </AudienceContext.Provider>;
}
