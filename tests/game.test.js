import test from 'node:test'
import assert from 'node:assert/strict'
import { campaignChronicleMarkdown, chronicleFilename } from '../src/game/campaignExport.js'
import { PROJECTS } from '../src/game/data.js'
import { createInitialState } from '../src/game/initialState.js'
import { campaignReport } from '../src/game/outcomes.js'
import {
  activeLabor,
  adjustTheater,
  advanceSeason,
  effectiveProjectCost,
  laborCapacity,
  projectPreview,
  resolveDecision,
  restoreState,
  serializeState,
  startProject,
  validateState,
} from '../src/game/simulation.js'
import { resolveSeasonEvent } from '../src/game/seasonalEvents.js'

test('initial state conserves the fixed field force', () => {
  const state = createInitialState()
  assert.deepEqual(validateState(state), { valid: true, totalForces: 100 })
})

test('theater allocations transfer troops through the capital reserve', () => {
  const state = resolveDecision(createInitialState(), 'employment').state
  const result = adjustTheater(state, 'east', 4)
  assert.equal(result.error, '')
  assert.equal(result.state.theaters.east, 38)
  assert.equal(result.state.theaters.reserve, 44)
  assert.equal(validateState(result.state).valid, true)
})

test('a reconstruction contract spends resources, occupies labor, and completes', () => {
  let state = resolveDecision(createInitialState(), 'employment').state
  const treasury = state.resources.treasury
  const order = startProject(state, 'clear', 'augustaeum')
  assert.equal(order.error, '')
  state = order.state
  assert.equal(state.resources.treasury, treasury - 12)
  assert.equal(activeLabor(state), 18)
  state = advanceSeason(state).state
  const district = state.districts.find((item) => item.id === 'augustaeum')
  assert.equal(district.activeProject, null)
  assert.equal(district.projects[0].type, 'clear')
  assert.equal(activeLabor(state), 0)
})

test('favored placement adds a bounded district bonus without mutating project definitions', () => {
  const projectBefore = structuredClone(PROJECTS.baths)
  const prepare = () => {
    const state = resolveDecision(createInitialState(), 'employment').state
    return {
      ...state,
      resources: { ...state.resources, treasury: 200, masonry: 200 },
      resolvedDecisionIds: ['sophia'],
      districts: state.districts.map((district) => district.id === 'augustaeum' ? { ...district, devastation: 50 } : district),
    }
  }

  let favored = startProject(prepare(), 'baths', 'augustaeum').state
  favored = advanceSeason(favored).state
  favored = advanceSeason(favored).state

  let neutral = startProject(prepare(), 'baths', 'harbor').state
  neutral = advanceSeason(neutral).state
  neutral = advanceSeason(neutral).state

  assert.equal(favored.city.legitimacy - neutral.city.legitimacy, 3)
  assert.equal(favored.city.order - neutral.city.order, 3)
  assert.equal(favored.districts.find((district) => district.id === 'augustaeum').projects[0].favored, true)
  assert.deepEqual(PROJECTS.baths, projectBefore)
})

test('a favored artisan workshop reduces later masonry costs', () => {
  const state = createInitialState()
  const baseline = effectiveProjectCost(state, 'housing')
  const withWorkshop = {
    ...state,
    districts: state.districts.map((district) => district.id === 'workers'
      ? { ...district, projects: [{ type: 'workshop', completed: 2, favored: true }] }
      : district),
  }
  const discounted = effectiveProjectCost(withWorkshop, 'housing')
  assert.equal(discounted.treasury, baseline.treasury)
  assert.ok(discounted.masonry < baseline.masonry)
  assert.equal(discounted.masonryDiscount, baseline.masonry - discounted.masonry)
  assert.deepEqual(PROJECTS.housing.cost, { treasury: 24, masonry: 18 })
})

test('completed cistern works strengthen later fire brigades', () => {
  const state = createInitialState()
  const baseline = projectPreview(state, 'fire', 'hippodrome')
  const withCistern = {
    ...state,
    districts: state.districts.map((district) => district.id === 'cistern-quarter'
      ? { ...district, projects: [{ type: 'cistern', completed: 3, favored: true }] }
      : district),
  }
  const linked = projectPreview(withCistern, 'fire', 'hippodrome')
  assert.equal(linked.city.fireRisk, baseline.city.fireRisk - 4)
  assert.equal(linked.city.order, baseline.city.order + 1)
  assert.equal(linked.cisternNetwork, true)
})

test('a favored harbor granary strengthens the Black Sea grain fleet', () => {
  const state = { ...createInitialState(), season: 6, resources: { ...createInitialState().resources, shipping: 60 } }
  const baseline = resolveSeasonEvent(state)
  const withGranary = {
    ...state,
    districts: state.districts.map((district) => district.id === 'harbor'
      ? { ...district, projects: [{ type: 'granary', completed: 4, favored: true }] }
      : district),
  }
  const linked = resolveSeasonEvent(withGranary)
  assert.equal(linked.state.resources.grain - baseline.state.resources.grain, 6)
  assert.equal(linked.state.city.bread - baseline.state.city.bread, 1)
  assert.match(linked.event.detail, /quayside granaries/i)
})

test('major construction requires clearance in heavily devastated districts', () => {
  const state = resolveDecision(createInitialState(), 'justice').state
  const blocked = startProject(state, 'housing', 'augustaeum')
  const permitted = startProject(state, 'housing', 'harbor')
  assert.match(blocked.error, /clear the unstable ruins/i)
  assert.equal(permitted.error, '')
})

test('mandatory council decisions trigger at the scheduled seasons', () => {
  let state = resolveDecision(createInitialState(), 'justice').state
  state = advanceSeason(state).state
  assert.equal(state.pendingDecisionId, 'sophia')
  state = resolveDecision(state, 'staged').state
  state = advanceSeason(state).state
  state = advanceSeason(state).state
  assert.equal(state.pendingDecisionId, 'persian_peace')
  state = resolveDecision(state, 'installments').state
  state = advanceSeason(state).state
  assert.equal(state.pendingDecisionId, 'bread_assessment')
  state = resolveDecision(state, 'subsidize').state
  state = advanceSeason(state).state
  assert.equal(state.pendingDecisionId, 'africa')
})

test('policy decisions alter later operating capacity', () => {
  let state = createInitialState()
  state = { ...state, pendingDecisionId: 'persian_peace' }
  const beforePeace = state
  state = resolveDecision(state, 'lump').state
  assert.ok(state.flags.persianSettlement)
  assert.ok(state.resources.treasury < beforePeace.resources.treasury)

  state = { ...state, pendingDecisionId: 'contracts' }
  state = resolveDecision(state, 'collegia').state
  assert.equal(laborCapacity(state), 132)
})

test('ending a season records the disclosed pressure and its effects', () => {
  let state = resolveDecision(createInitialState(), 'employment').state
  state = advanceSeason(state).state
  assert.equal(state.lastSeasonReport.event.id, 'bread-convoys')
  assert.match(state.lastSeasonReport.event.detail, /grain/i)
  assert.ok(state.chronicle.some((entry) => entry.category === 'Seasonal Pressure'))
})

test('council cannot overdraw the capital reserve', () => {
  let state = createInitialState()
  state = { ...state, pendingDecisionId: 'africa', theaters: { east: 56, africa: 0, balkans: 28, reserve: 16 } }
  const result = resolveDecision(state, 'full')
  assert.match(result.error, /more troops/i)
  assert.equal(validateState(result.state).valid, true)
})

test('save snapshots round-trip without changing the campaign', () => {
  const state = resolveDecision(createInitialState(), 'authority').state
  assert.deepEqual(restoreState(serializeState(state)), state)
  assert.equal(restoreState('{bad json'), null)
})

test('version 2 saves gain district specialty metadata when restored', () => {
  const state = createInitialState()
  const legacy = structuredClone(state)
  legacy.districts.forEach((district) => {
    delete district.specialty
    delete district.favoredProject
    delete district.favoredBonus
  })
  const restored = restoreState(JSON.stringify(legacy))
  assert.equal(restored.districts.find((district) => district.id === 'harbor').favoredProject, 'granary')
  assert.equal(validateState(restored).valid, true)
})

test('the twelve-season slice always reaches a named final assessment', () => {
  let state = createInitialState()
  const choices = {
    mandate: 'employment',
    sophia: 'staged',
    persian_peace: 'installments',
    bread_assessment: 'subsidize',
    africa: 'limited',
    contracts: 'collegia',
    codex: 'publish',
  }
  while (!state.outcome) {
    if (state.pendingDecisionId) state = resolveDecision(state, choices[state.pendingDecisionId]).state
    else state = advanceSeason(state).state
  }
  assert.equal(state.season, 12)
  assert.match(state.outcome, /balanced-renewal|conquerors-capital|capital-first|strained-recovery|second-rising/)
  assert.equal(validateState(state).valid, true)
})

test('a rebuilt capital with no African expedition receives the capital-first outcome', () => {
  const initial = createInitialState()
  const state = {
    ...initial,
    season: 11,
    pendingDecisionId: null,
    resolvedDecisionIds: ['codex'],
    flags: { ...initial.flags, africaPolicy: 'declined' },
    resources: { ...initial.resources, treasury: 100 },
    city: { water: 72, housing: 70, bread: 72, employment: 68, fireRisk: 28, order: 70, legitimacy: 66 },
    factions: Object.fromEntries(Object.keys(initial.factions).map((key) => [key, 60])),
  }
  const result = advanceSeason(state)
  assert.equal(result.error, '')
  assert.equal(result.state.outcome, 'capital-first')
})

test('a second rising is graded as catastrophic despite an intact treasury', () => {
  const state = {
    ...createInitialState(),
    outcome: 'second-rising',
    resources: { ...createInitialState().resources, treasury: 250, grain: 200 },
  }
  assert.equal(campaignReport(state).grade, 'F')
})

test('campaign chronicle export is deterministic and includes the final assessment', () => {
  const initial = createInitialState()
  const state = {
    ...initial,
    outcome: 'balanced-renewal',
    chronicle: [{ season: 'Winter 532', title: 'The Morning After Nika', detail: 'Clearing crews received the first public order.' }],
    districts: initial.districts.map((district) => district.id === 'harbor'
      ? { ...district, projects: [{ type: 'granary', name: 'Granary & Bakery', favored: true }] }
      : district),
  }
  const first = campaignChronicleMarkdown(state)
  assert.equal(first, campaignChronicleMarkdown(state))
  assert.match(first, /The Capital and Empire Recover Together/)
  assert.match(first, /Granary & Bakery - Julian Harbor \(district strength\)/)
  assert.match(first, /The Morning After Nika/)
  assert.equal(chronicleFilename(state), 'titans-constantinople-balanced-renewal-chronicle.md')
})
