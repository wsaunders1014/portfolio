import { originals } from './original-snippets';
export function OriginalExcerpt({ kind }: { kind: 'conditions' | 'carousel' }) {
  const original = originals[kind];
  return <section className="original-section"><div><p className="eyebrow">FROM MY ORIGINAL IMPLEMENTATION</p><h2>The work behind the recreation.</h2><p>{original.description}</p></div><details><summary>Read the preserved original excerpt</summary><p className="original-caption">{original.file} · {original.lines}<br />Verbatim excerpt from the archived checkout. The runnable demo above is a separate adaptation.</p><pre tabIndex={0} aria-label="Preserved original code excerpt"><code>{original.code}</code></pre><p className="field-help">{original.context}</p></details></section>;
}
