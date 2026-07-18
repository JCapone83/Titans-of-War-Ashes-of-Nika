import { Anvil, BookOpen, Boxes, CircleHelp, Coins, HardHat, RotateCcw, Shield, Ship, Wheat } from 'lucide-react'
import { availableLabor, seasonLabel } from '../game/simulation.js'

const READOUTS = [
  ['treasury', 'Treasury', Coins],
  ['grain', 'Grain', Wheat],
  ['labor', 'Labor', HardHat],
  ['masonry', 'Masonry', Boxes],
  ['shipping', 'Shipping', Ship],
  ['fieldForces', 'Field Forces', Shield],
]

export default function TopBar({ state, onReset, onOpenWalkthrough, onOpenContext }) {
  return (
    <header className="topbar">
      <div className="brand"><Anvil aria-hidden="true" /><span><strong>Titans of Constantinople</strong><small>Ashes of Nika</small></span></div>
      <div className="resource-strip" aria-label="Imperial resources">
        {READOUTS.map(([key, label, Icon]) => {
          const value = key === 'labor' ? availableLabor(state) : state.resources[key]
          return <div className="resource" key={key}><Icon aria-hidden="true" /><span><small>{label}</small><strong>{value}</strong></span></div>
        })}
      </div>
      <div className="season"><strong>{seasonLabel(state)}</strong><small>Season {Math.min(state.season + 1, 12)} of 12</small></div>
      <div className="topbar-actions">
        <button className="icon-button" onClick={onOpenWalkthrough} title="Open walkthrough" aria-label="Open walkthrough"><CircleHelp aria-hidden="true" /></button>
        <button className="icon-button" onClick={onOpenContext} title="Open historical context" aria-label="Open historical context"><BookOpen aria-hidden="true" /></button>
        <button className="icon-button" onClick={onReset} title="Reset campaign" aria-label="Reset campaign"><RotateCcw aria-hidden="true" /></button>
      </div>
    </header>
  )
}
