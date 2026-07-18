import { createInitialState } from '../src/game/initialState.js'
import { campaignReport } from '../src/game/outcomes.js'
import { adjustTheater, advanceSeason, resolveDecision, startProject } from '../src/game/simulation.js'

const PROFILES = {
  collapse: {
    expected: { outcome: 'second-rising', grade: 'F' },
    reserveFloor: 999,
    choices: { mandate: 'authority', sophia: 'basilica', persian_peace: 'armed', bread_assessment: 'collect', africa: 'full', contracts: 'palace', codex: 'delay' },
    projects: [],
    deploymentAfterFlag: 'africaPolicy',
    theaterTargets: { east: 50 },
  },
  exceptional: {
    expected: { outcome: 'capital-first', grade: 'A' },
    reserveFloor: 12,
    choices: { mandate: 'justice', sophia: 'staged', persian_peace: 'installments', bread_assessment: 'subsidize', africa: 'decline', contracts: 'collegia', codex: 'publish' },
    projects: [['workers', 'clear'], ['workers', 'workshop'], ['hippodrome', 'clear'], ['hippodrome', 'housing'], ['augustaeum', 'clear'], ['augustaeum', 'baths'], ['harbor', 'granary'], ['cistern-quarter', 'cistern'], ['palace', 'watch'], ['harbor', 'fire']],
  },
  'favored-sites': {
    expected: { outcome: 'strained-recovery', grade: 'C' },
    reserveFloor: 22,
    choices: { mandate: 'employment', sophia: 'staged', persian_peace: 'installments', bread_assessment: 'subsidize', africa: 'limited', contracts: 'collegia', codex: 'publish' },
    projects: [['augustaeum', 'clear'], ['workers', 'clear'], ['hippodrome', 'clear'], ['harbor', 'granary'], ['cistern-quarter', 'cistern'], ['palace', 'watch'], ['workers', 'workshop'], ['hippodrome', 'housing'], ['augustaeum', 'baths'], ['harbor', 'fire']],
  },
  balanced: {
    expected: { outcome: 'balanced-renewal', grade: 'B' },
    reserveFloor: 22,
    choices: { mandate: 'justice', sophia: 'staged', persian_peace: 'installments', bread_assessment: 'subsidize', africa: 'limited', contracts: 'collegia', codex: 'publish' },
    projects: [['augustaeum', 'clear'], ['workers', 'clear'], ['hippodrome', 'clear'], ['harbor', 'granary'], ['cistern-quarter', 'cistern'], ['workers', 'housing'], ['augustaeum', 'baths'], ['harbor', 'workshop'], ['hippodrome', 'fire'], ['palace', 'watch']],
  },
  'capital-first': {
    expected: { outcome: 'capital-first', grade: 'A' },
    reserveFloor: 22,
    choices: { mandate: 'justice', sophia: 'staged', persian_peace: 'lump', bread_assessment: 'subsidize', africa: 'decline', contracts: 'collegia', codex: 'publish' },
    projects: [['workers', 'clear'], ['hippodrome', 'clear'], ['augustaeum', 'clear'], ['cistern-quarter', 'cistern'], ['harbor', 'granary'], ['workers', 'housing'], ['hippodrome', 'housing'], ['augustaeum', 'baths'], ['palace', 'watch'], ['harbor', 'fire']],
  },
  expansionist: {
    expected: { outcome: 'conquerors-capital', grade: 'B' },
    reserveFloor: 30,
    choices: { mandate: 'authority', sophia: 'monument', persian_peace: 'lump', bread_assessment: 'collect', africa: 'full', contracts: 'palace', codex: 'publish' },
    projects: [['augustaeum', 'clear'], ['palace', 'watch'], ['harbor', 'workshop'], ['cistern-quarter', 'granary'], ['hippodrome', 'clear'], ['augustaeum', 'baths']],
  },
  hardliner: {
    expected: { outcome: 'strained-recovery', grade: 'C' },
    reserveFloor: 80,
    choices: { mandate: 'authority', sophia: 'basilica', persian_peace: 'armed', bread_assessment: 'collect', africa: 'decline', contracts: 'palace', codex: 'delay' },
    projects: [['palace', 'watch'], ['harbor', 'workshop'], ['cistern-quarter', 'granary']],
  },
}

function commissionAvailable(state, orders, reserveFloor) {
  let next = state
  for (const [district, project] of orders) {
    const districtState = next.districts.find((item) => item.id === district)
    const alreadyOrdered = districtState?.activeProject?.type === project || districtState?.projects.some((item) => item.type === project)
    if (alreadyOrdered) continue
    const result = startProject(next, project, district)
    if (!result.error && result.state.resources.treasury >= reserveFloor) next = result.state
  }
  return next
}

function runProfile(profile) {
  let state = createInitialState()
  let deploymentsApplied = false
  while (!state.outcome) {
    if (state.pendingDecisionId) {
      state = resolveDecision(state, profile.choices[state.pendingDecisionId]).state
    } else {
      if (!deploymentsApplied && profile.theaterTargets && (!profile.deploymentAfterFlag || state.flags[profile.deploymentAfterFlag])) {
        for (const [theaterId, target] of Object.entries(profile.theaterTargets)) {
          while (state.theaters[theaterId] < target) {
            const result = adjustTheater(state, theaterId, Math.min(4, target - state.theaters[theaterId]))
            if (result.error) break
            state = result.state
          }
        }
        deploymentsApplied = true
      }
      state = commissionAvailable(state, profile.projects, profile.reserveFloor)
      state = advanceSeason(state).state
    }
  }
  const report = campaignReport(state)
  const completedProjects = state.districts.flatMap((district) => district.projects)
  const favoredPlacements = completedProjects.filter((project) => project.favored).length
  return {
    outcome: state.outcome,
    grade: report.grade,
    overall: report.overall,
    recovery: report.assessment.recovery,
    stability: report.assessment.stability,
    imperial: report.assessment.imperial,
    treasury: state.resources.treasury,
    grain: state.resources.grain,
    completed: completedProjects.length,
    favored: favoredPlacements,
    placement: completedProjects.length ? `${Math.round((favoredPlacements / completedProjects.length) * 100)}%` : '0%',
  }
}

const results = Object.fromEntries(Object.entries(PROFILES).map(([name, profile]) => [name, runProfile(profile)]))
console.table(results)
Object.entries(PROFILES).forEach(([name, profile]) => {
  const result = results[name]
  if (result.outcome !== profile.expected.outcome || result.grade !== profile.expected.grade) {
    throw new Error(`${name} reachability changed: expected ${profile.expected.outcome}/${profile.expected.grade}, received ${result.outcome}/${result.grade}`)
  }
})
