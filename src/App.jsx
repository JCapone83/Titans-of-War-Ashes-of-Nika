import { useEffect, useState } from 'react'
import BuildDock from './components/BuildDock.jsx'
import CityMap from './components/CityMap.jsx'
import CityRail from './components/CityRail.jsx'
import DecisionCouncil from './components/DecisionCouncil.jsx'
import HistoricalContextPanel from './components/HistoricalContextPanel.jsx'
import ImperialRail from './components/ImperialRail.jsx'
import OutcomeOverlay from './components/OutcomeOverlay.jsx'
import SeasonReport from './components/SeasonReport.jsx'
import TopBar from './components/TopBar.jsx'
import WalkthroughOverlay from './components/WalkthroughOverlay.jsx'
import { DECISIONS } from './game/data.js'
import { createInitialState } from './game/initialState.js'
import { adjustTheater, advanceSeason, resolveDecision, restoreState, serializeState, startProject } from './game/simulation.js'

const SAVE_KEY = 'titans-constantinople-campaign-v1'
const WALKTHROUGH_KEY = 'titans-constantinople-walkthrough-seen-v1'

function loadCampaign() {
  return restoreState(localStorage.getItem(SAVE_KEY)) ?? createInitialState()
}

export default function App() {
  const [state, setState] = useState(loadCampaign)
  const [notice, setNotice] = useState('')
  const [walkthroughOpen, setWalkthroughOpen] = useState(() => localStorage.getItem(WALKTHROUGH_KEY) !== '1')
  const [contextOpen, setContextOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, serializeState(state))
  }, [state])

  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => setNotice(''), 3200)
    return () => window.clearTimeout(timeout)
  }, [notice])

  function applyResult(result) {
    if (result.error) setNotice(result.error)
    else setState(result.state)
  }

  function resetCampaign() {
    if (!window.confirm('Abandon this reconstruction campaign and begin again?')) return
    localStorage.removeItem(SAVE_KEY)
    setState(createInitialState())
    setNotice('A new imperial record has begun.')
  }

  function closeWalkthrough() {
    localStorage.setItem(WALKTHROUGH_KEY, '1')
    setWalkthroughOpen(false)
  }

  return <div className="app-shell">
    <TopBar state={state} onReset={resetCampaign} onOpenWalkthrough={() => setWalkthroughOpen(true)} onOpenContext={() => setContextOpen(true)} />
    <div className="command-grid">
      <CityRail state={state} />
      <CityMap
        state={state}
        onSelectDistrict={(districtId) => setState((current) => ({ ...current, selectedDistrictId: districtId }))}
        onBuild={(projectId, districtId) => applyResult(startProject(state, projectId, districtId))}
      />
      <ImperialRail state={state} onAllocate={(theaterId, delta) => applyResult(adjustTheater(state, theaterId, delta))} />
    </div>
    <BuildDock
      state={state}
      onSelectProject={(projectId) => setState((current) => ({ ...current, selectedProjectId: projectId }))}
      onAdvance={() => applyResult(advanceSeason(state))}
    />
    <DecisionCouncil decision={DECISIONS[state.pendingDecisionId]} state={state} onChoose={(choiceId) => applyResult(resolveDecision(state, choiceId))} />
    <OutcomeOverlay state={state} onReset={resetCampaign} onNotify={setNotice} />
    <SeasonReport report={state.lastSeasonReport} onDismiss={() => setState((current) => ({ ...current, lastSeasonReport: null }))} />
    <HistoricalContextPanel open={contextOpen} onClose={() => setContextOpen(false)} />
    <WalkthroughOverlay open={walkthroughOpen} onClose={closeWalkthrough} />
    {notice ? <div className="notice" role="status">{notice}</div> : null}
  </div>
}
