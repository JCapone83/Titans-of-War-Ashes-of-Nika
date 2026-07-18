import { BookOpen, ExternalLink, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { HISTORICAL_CONTEXT } from '../game/historicalContext.js'

export default function HistoricalContextPanel({ open, onClose }) {
  const [selectedId, setSelectedId] = useState(HISTORICAL_CONTEXT[0].id)
  const selected = HISTORICAL_CONTEXT.find((entry) => entry.id === selectedId) ?? HISTORICAL_CONTEXT[0]

  useEffect(() => {
    if (!open) return undefined
    const handleKey = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null
  return <div className="context-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <aside className="context-panel" role="dialog" aria-modal="true" aria-labelledby="context-title">
      <header><BookOpen aria-hidden="true" /><div><small>Optional historical context</small><h1 id="context-title">Public Works in the Capital</h1></div><button className="panel-close" onClick={onClose} aria-label="Close historical context"><X aria-hidden="true" /></button></header>
      <nav aria-label="Historical context topics">
        {HISTORICAL_CONTEXT.map((entry) => <button key={entry.id} className={entry.id === selected.id ? 'active' : ''} onClick={() => setSelectedId(entry.id)}>{entry.title}</button>)}
      </nav>
      <article>
        <small>{selected.period}</small>
        <h2>{selected.title}</h2>
        <p>{selected.summary}</p>
        <section><strong>How the game models it</strong><p>{selected.gameLink}</p></section>
        <footer><strong><ExternalLink aria-hidden="true" /> Starting sources</strong>{selected.sources.map((source) => <span key={source}>{source}</span>)}</footer>
      </article>
    </aside>
  </div>
}
