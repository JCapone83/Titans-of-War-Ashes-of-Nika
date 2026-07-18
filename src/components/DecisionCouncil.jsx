import { ArrowRight, BookOpen, Landmark, Scale } from 'lucide-react'

function effectLabel(key) {
  const labels = {
    treasury: 'Treasury', grain: 'Grain', masonry: 'Masonry', shipping: 'Shipping',
    employment: 'Employment', order: 'Order', legitimacy: 'Legitimacy',
    senate: 'Senate', blues: 'Blues', greens: 'Greens', church: 'Church', army: 'Army', partnership: 'Partnership',
    east: 'East', africa: 'Africa', balkans: 'Balkans', reserve: 'Reserve',
  }
  return labels[key] ?? key
}

function ChoiceEffects({ choice }) {
  const effects = [choice.effects, choice.city, choice.factions, choice.theater]
    .flatMap((group) => Object.entries(group ?? {}))
    .filter(([, value]) => value !== 0)
  return <div className="choice-effects" aria-label="Expected effects">
    {effects.map(([key, value], index) => <span className={value > 0 ? 'positive' : 'negative'} key={`${key}-${index}`}>
      {effectLabel(key)} {value > 0 ? '+' : ''}{value}
    </span>)}
  </div>
}

export default function DecisionCouncil({ decision, state, onChoose }) {
  if (!decision) return null
  return <div className="modal-backdrop" role="presentation">
    <section className="decision-council" role="dialog" aria-modal="true" aria-labelledby="decision-title">
      <header>
        <div className="decision-seal"><Landmark aria-hidden="true" /></div>
        <div><small>{decision.authority}</small><h1 id="decision-title">{decision.title}</h1></div>
        <span className="decision-season">Imperial order · {state.season + 1}/12</span>
      </header>
      <div className="decision-brief">
        <Scale aria-hidden="true" />
        <div><strong>The question before the council</strong><p>{decision.brief}</p><p className="decision-context">{decision.context}</p></div>
      </div>
      <div className="decision-choices">
        {decision.choices.map((choice, index) => {
          const insufficientReserve = Object.entries(choice.theater ?? {}).some(([key, value]) => key === 'reserve' && state.theaters.reserve + value < 0)
          return <article className="decision-choice" key={choice.id}>
            <span className="choice-index">{String.fromCharCode(65 + index)}</span>
            <div className="choice-copy"><h2>{choice.title}</h2><p>{choice.argument}</p><ChoiceEffects choice={choice} /></div>
            <button onClick={() => onChoose(choice.id)} disabled={insufficientReserve}>
              {insufficientReserve ? 'Reserve too small' : 'Issue order'} <ArrowRight aria-hidden="true" />
            </button>
          </article>
        })}
      </div>
      <details className="source-note"><summary><BookOpen aria-hidden="true" /> Historical grounding</summary><p>{decision.sources.join(' · ')}</p></details>
    </section>
  </div>
}
