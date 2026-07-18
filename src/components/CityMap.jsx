import { Construction, LockKeyhole, MapPin, Sparkles } from 'lucide-react'
import { PROJECTS } from '../game/data.js'
import { canStartProject } from '../game/simulation.js'

export default function CityMap({ state, onSelectDistrict, onBuild }) {
  return (
    <main className={`city-map ${state.selectedProjectId ? 'placing' : ''}`} aria-label="Reconstruction map of Constantinople">
      <img src="./assets/constantinople-532-map.png" alt="Isometric reconstruction of Constantinople after the Nika revolt" />
      {state.districts.map((district) => {
        const active = district.activeProject ? PROJECTS[district.activeProject.type] : null
        const selected = state.selectedDistrictId === district.id
        const favored = state.selectedProjectId === district.favoredProject
        const availability = state.selectedProjectId ? canStartProject(state, state.selectedProjectId, district.id) : { ok: true, reason: '' }
        const blocked = Boolean(state.selectedProjectId && !availability.ok)
        return <button
          className={`district-marker ${selected ? 'selected' : ''} ${active ? 'active' : ''} ${favored ? 'favored' : ''} ${blocked ? 'blocked' : ''}`}
          style={{ left: `${district.x}%`, top: `${district.y}%` }}
          key={district.id}
          onClick={() => state.selectedProjectId ? onBuild(state.selectedProjectId, district.id) : onSelectDistrict(district.id)}
          aria-label={`${district.name}, ${district.devastation}% devastated${active ? `, building ${active.name}` : ''}${favored ? ', favored site' : ''}`}
          title={blocked ? availability.reason : favored ? district.favoredBonus.label : district.note}
        >
          {active ? <Construction aria-hidden="true" /> : blocked ? <LockKeyhole aria-hidden="true" /> : favored ? <Sparkles aria-hidden="true" /> : <MapPin aria-hidden="true" />}
          <span><strong>{district.name}</strong><small>{active ? `${active.name} · ${district.activeProject.remaining} season` : blocked && favored ? 'Favored after prerequisites' : blocked ? 'Unavailable for this order' : favored ? `Favored site · ${district.specialty}` : `${district.devastation}% devastated`}</small></span>
        </button>
      })}
      <div className="map-caption"><span>Constantinople</span><strong>Reconstruction survey · 532</strong></div>
      {state.selectedProjectId ? <div className="placement-order">Select a district for {PROJECTS[state.selectedProjectId].name}</div> : null}
    </main>
  )
}
