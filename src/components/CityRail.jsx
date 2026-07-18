import { Droplets, Flame, Hammer, House, ShieldCheck, Wheat } from 'lucide-react'
import { PROJECTS } from '../game/data.js'
import { selectedDistrict } from '../game/simulation.js'

const NEEDS = [
  ['water', 'Water', Droplets, false],
  ['housing', 'Housing', House, false],
  ['bread', 'Bread', Wheat, false],
  ['employment', 'Employment', Hammer, false],
  ['fireRisk', 'Fire Risk', Flame, true],
  ['order', 'Order', ShieldCheck, false],
]

function tone(value, inverse) {
  const score = inverse ? 100 - value : value
  return score >= 65 ? 'good' : score >= 42 ? 'warning' : 'danger'
}

export default function CityRail({ state }) {
  const district = selectedDistrict(state)
  const active = district.activeProject ? PROJECTS[district.activeProject.type] : null
  const favored = PROJECTS[district.favoredProject]
  return (
    <aside className="city-rail">
      <section className="needs-panel">
        <h2>City Needs</h2>
        {NEEDS.map(([key, label, Icon, inverse]) => <div className="need" key={key}>
          <Icon aria-hidden="true" /><span><small>{label}</small><i><b className={tone(state.city[key], inverse)} style={{ width: `${state.city[key]}%` }} /></i></span><strong>{state.city[key]}%</strong>
        </div>)}
      </section>
      <section className="district-inspector">
        <small>Selected district</small>
        <h2>{district.name}</h2>
        <p>{district.note}</p>
        <div className="district-specialty">
          <small>District strength</small>
          <strong>{district.specialty}</strong>
          <span>Favored work: {favored?.name ?? 'None'}</span>
        </div>
        <dl>
          <div><dt>Devastation</dt><dd>{district.devastation}%</dd></div>
          <div><dt>Completed works</dt><dd>{district.projects.length}</dd></div>
          <div><dt>Current contract</dt><dd>{active ? active.name : 'None'}</dd></div>
          {active ? <div><dt>Completion</dt><dd>{district.activeProject.remaining} season{district.activeProject.remaining === 1 ? '' : 's'}</dd></div> : null}
          {active?.id === district.favoredProject ? <div><dt>Site quality</dt><dd className="favored-text">Favored</dd></div> : null}
        </dl>
      </section>
    </aside>
  )
}
