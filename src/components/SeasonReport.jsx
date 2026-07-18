import { CheckCircle2, X } from 'lucide-react'

const LABELS = {
  treasury: 'Treasury', grain: 'Grain', masonry: 'Masonry', shipping: 'Shipping',
  water: 'Water', housing: 'Housing', bread: 'Bread', employment: 'Employment', fireRisk: 'Fire risk', order: 'Order', legitimacy: 'Legitimacy',
}

export default function SeasonReport({ report, onDismiss }) {
  if (!report) return null
  const changes = Object.entries(report.changes).slice(0, 8)
  return <aside className="season-report" aria-live="polite">
    <header><CheckCircle2 aria-hidden="true" /><div><small>{report.event.season} resolved</small><h2>{report.event.title}</h2></div><button onClick={onDismiss} aria-label="Dismiss season report"><X aria-hidden="true" /></button></header>
    <p>{report.event.detail}</p>
    {report.completed.length ? <div className="completed-list">
      <strong>Works completed</strong>
      {report.completed.map((item) => <span key={`${item.district}-${item.project}`}>
        {item.project} · {item.district}{item.favored ? <em className="favored-text">Favored site</em> : null}
        {item.bonusLabels?.map((label) => <small key={label}>{label}</small>)}
      </span>)}
    </div> : null}
    <div className="report-changes">{changes.map(([key, value]) => {
      const beneficial = key === 'fireRisk' ? value < 0 : value > 0
      return <span className={beneficial ? 'positive' : 'negative'} key={key}>{LABELS[key] ?? key} {value > 0 ? '+' : ''}{value}</span>
    })}</div>
  </aside>
}
