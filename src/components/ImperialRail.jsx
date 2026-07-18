import { Church, Crown, Minus, Plus, Shield, Users } from 'lucide-react'
import { COUNCIL_LABELS, THEATERS } from '../game/data.js'

function relation(value) {
  if (value >= 68) return 'Strong'
  if (value >= 50) return 'Working'
  if (value >= 35) return 'Strained'
  return 'Hostile'
}

export default function ImperialRail({ state, onAllocate }) {
  return (
    <aside className="imperial-rail">
      <section className="theaters-panel">
        <h2>Imperial Theaters</h2>
        {Object.values(THEATERS).map((theater) => <article className="theater" key={theater.id}>
          <header><Shield aria-hidden="true" /><span><strong>{theater.name}</strong><small>{theater.summary}</small></span><b>{state.theaters[theater.id]}</b></header>
          {theater.id !== 'reserve' ? <div className="allocation">
            <button onClick={() => onAllocate(theater.id, -4)} aria-label={`Remove forces from ${theater.name}`}><Minus /></button>
            <i><b style={{ width: `${Math.min(100, state.theaters[theater.id] * 1.66)}%` }} /></i>
            <button onClick={() => onAllocate(theater.id, 4)} aria-label={`Assign forces to ${theater.name}`}><Plus /></button>
          </div> : null}
        </article>)}
      </section>
      <section className="council-panel">
        <h2>Imperial Council</h2>
        {Object.entries(COUNCIL_LABELS).map(([key, label]) => <div className="council-row" key={key}>
          {key === 'church' ? <Church aria-hidden="true" /> : key === 'partnership' ? <Crown aria-hidden="true" /> : <Users aria-hidden="true" />}
          <span>{label}</span><small>{relation(state.factions[key])}</small><strong>{state.factions[key]}</strong>
        </div>)}
      </section>
    </aside>
  )
}
