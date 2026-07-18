import { Award, BookOpen, Copy, Download, RotateCcw } from 'lucide-react'
import { campaignChronicleMarkdown, chronicleFilename } from '../game/campaignExport.js'
import { OUTCOMES, campaignReport } from '../game/outcomes.js'

function downloadChronicle(state) {
  const blob = new Blob([campaignChronicleMarkdown(state)], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = chronicleFilename(state)
  anchor.click()
  URL.revokeObjectURL(url)
}

async function copyChronicle(state) {
  const text = campaignChronicleMarkdown(state)
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

export default function OutcomeOverlay({ state, onReset, onNotify }) {
  if (!state.outcome) return null
  const outcome = OUTCOMES[state.outcome]
  const report = campaignReport(state)
  return <div className="modal-backdrop outcome-backdrop">
    <section className="outcome-panel" role="dialog" aria-modal="true" aria-labelledby="outcome-title">
      <header><Award aria-hidden="true" /><div><small>Autumn 534 · Final assessment</small><h1 id="outcome-title">{outcome.title}</h1></div><strong className="overall-grade">{report.grade}</strong></header>
      <p className="outcome-summary">{outcome.summary}</p>
      <div className="grade-grid">
        {report.grades.map((item) => <article key={item.label}><span>{item.label}</span><strong>{item.grade}</strong><small>{item.score}/100</small></article>)}
      </div>
      <div className="chronicle">
        <h2><BookOpen aria-hidden="true" /> Imperial Chronicle</h2>
        <div>{state.chronicle.map((entry, index) => <p key={`${entry.season}-${index}`}><time>{entry.season}</time><strong>{entry.title}</strong><span>{entry.detail}</span></p>)}</div>
      </div>
      <footer><span>Overall stewardship <strong>{report.overall}/100</strong></span><div className="outcome-actions">
        <button className="secondary-button" onClick={async () => {
          try {
            await copyChronicle(state)
            onNotify('Imperial chronicle copied.')
          } catch {
            onNotify('The browser could not copy the chronicle. Use Download instead.')
          }
        }}><Copy aria-hidden="true" /> Copy</button>
        <button className="secondary-button" onClick={() => { downloadChronicle(state); onNotify('Imperial chronicle downloaded.') }}><Download aria-hidden="true" /> Download</button>
        <button onClick={onReset}><RotateCcw aria-hidden="true" /> New reign</button>
      </div></footer>
    </section>
  </div>
}
