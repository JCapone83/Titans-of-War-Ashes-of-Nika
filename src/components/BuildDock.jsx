import { ChevronRight, Clock3, Hammer, Pause } from 'lucide-react'
import { PROJECT_ORDER, PROJECTS, SEASONS } from '../game/data.js'
import { availableLabor, canStartProject, projectPreview } from '../game/simulation.js'
import { getSeasonForecast } from '../game/seasonalEvents.js'

const EFFECT_LABELS = {
  water: 'Water', housing: 'Housing', bread: 'Bread', employment: 'Employment', fireRisk: 'Fire risk',
  order: 'Order', legitimacy: 'Legitimacy', masonry: 'Masonry recovered', devastation: 'Devastation',
  grainCapacity: 'Grain storage', masonryIncome: 'Masonry / season', treasuryIncome: 'Treasury / season',
}

function ProjectSprite({ frame }) {
  return <span className="project-sprite" style={{ backgroundImage: "url('./assets/reconstruction-atlas.png')", backgroundPosition: `${(frame / 7) * 100}% center` }} />
}

function effectTone(key, value) {
  const inverse = key === 'fireRisk' || key === 'devastation'
  return (inverse ? value < 0 : value > 0) ? 'positive' : 'negative'
}

function ProjectBrief({ state }) {
  const preview = projectPreview(state, state.selectedProjectId, state.selectedDistrictId)
  if (!preview) return <><Hammer aria-hidden="true" /><span><strong>Rebuild</strong><small>{availableLabor(state)} labor available</small></span></>
  const availability = canStartProject(state, preview.project.id, preview.district.id)
  const favoredDistrict = state.districts.find((district) => district.favoredProject === preview.project.id)
  const completionSeason = SEASONS[Math.min(state.season + preview.project.duration, SEASONS.length - 1)]
  const effects = [
    ...Object.entries(preview.city),
    ...Object.entries(preview.resources),
    ...(preview.devastation ? [['devastation', preview.devastation]] : []),
    ...Object.entries(preview.ongoing),
  ]
  return <>
    <Hammer aria-hidden="true" />
    <span>
      <small>Selected project</small>
      <strong>{preview.project.name}</strong>
      <span className="brief-costs">
        {preview.cost.treasury} treasury · {preview.cost.masonry} masonry · {preview.project.labor} labor
        {preview.cost.masonryDiscount ? <b>{preview.cost.masonryDiscount} masonry saved by artisan network</b> : null}
      </span>
      <span className="brief-timing"><Clock3 aria-hidden="true" /> {preview.project.duration} season{preview.project.duration === 1 ? '' : 's'} · completes {completionSeason}</span>
      <span className="brief-effects">{effects.map(([key, value]) => <i className={effectTone(key, value)} key={key}>{EFFECT_LABELS[key] ?? key} {value > 0 ? '+' : ''}{value}</i>)}</span>
      <span className={availability.ok ? 'placement-ready' : 'placement-blocked'}>{availability.ok ? `Ready in ${preview.district.name}` : availability.reason}</span>
      {favoredDistrict ? <span className="favored-advice">Favored: {favoredDistrict.name} · {favoredDistrict.favoredBonus.label}</span> : null}
      {preview.cisternNetwork ? <span className="network-advice">Cistern network bonus active</span> : null}
    </span>
  </>
}

export default function BuildDock({ state, onSelectProject, onAdvance }) {
  const forecast = getSeasonForecast(state)
  return (
    <footer className={`build-dock ${state.selectedProjectId ? 'has-project-brief' : ''}`}>
      <div className="dock-title project-brief"><ProjectBrief state={state} /></div>
      <div className="project-list">
        {PROJECT_ORDER.map((id) => {
          const project = PROJECTS[id]
          return <button className={state.selectedProjectId === id ? 'selected' : ''} key={id} onClick={() => onSelectProject(state.selectedProjectId === id ? null : id)} disabled={Boolean(state.pendingDecisionId || state.outcome)}>
            <ProjectSprite frame={project.frame} />
            <span><strong>{project.name}</strong><small>{project.cost.treasury} treasury · {project.duration} season{project.duration === 1 ? '' : 's'}</small></span>
          </button>
        })}
      </div>
      <div className="turn-controls">
        <span title={forecast.brief}><Pause aria-hidden="true" /><small>Next: {forecast.title}<b>{forecast.watch}</b></small></span>
        <button onClick={onAdvance} disabled={Boolean(state.pendingDecisionId || state.outcome)}>End Season <ChevronRight /></button>
      </div>
    </footer>
  )
}
