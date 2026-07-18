import { DECISIONS, DISTRICTS, PROJECTS, SEASONS, THEATERS } from './data.js'
import { createInitialState } from './initialState.js'
import { resolveSeasonEvent } from './seasonalEvents.js'

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)))
const resourceClamp = (value) => Math.max(0, Math.round(value))
const CITY_EFFECT_KEYS = ['water', 'housing', 'bread', 'employment', 'fireRisk', 'order', 'legitimacy']

function addValues(base, changes = {}, bounded = false) {
  const next = { ...base }
  Object.entries(changes).forEach(([key, value]) => {
    next[key] = bounded ? clamp((next[key] ?? 0) + value) : resourceClamp((next[key] ?? 0) + value)
  })
  return next
}

export function seasonLabel(state) {
  return SEASONS[Math.min(state.season, SEASONS.length - 1)] ?? 'Autumn 534'
}

export function selectedDistrict(state) {
  return state.districts.find((district) => district.id === state.selectedDistrictId) ?? state.districts[0]
}

export function activeLabor(state) {
  return state.districts.reduce((sum, district) => sum + (district.activeProject ? PROJECTS[district.activeProject.type].labor : 0), 0)
}

export function laborCapacity(state) {
  if (state.flags.contractSystem === 'collegia') return 132
  if (state.flags.contractSystem === 'church') return 128
  if (state.flags.contractSystem === 'palace') return 125
  return 120
}

export function availableLabor(state) {
  return Math.max(0, laborCapacity(state) - activeLabor(state))
}

function hasCompletedProject(state, projectId, districtId = null, favoredOnly = false) {
  return state.districts.some((district) => (!districtId || district.id === districtId)
    && district.projects.some((project) => project.type === projectId && (!favoredOnly || project.favored)))
}

function combineEffects(...groups) {
  return groups.reduce((combined, group) => {
    Object.entries(group ?? {}).forEach(([key, value]) => { combined[key] = (combined[key] ?? 0) + value })
    return combined
  }, {})
}

export function effectiveProjectCost(state, projectId) {
  const project = PROJECTS[projectId]
  if (!project) return { treasury: 0, masonry: 0, masonryDiscount: 0 }
  const artisanNetwork = projectId !== 'clear' && hasCompletedProject(state, 'workshop', 'workers', true)
  const masonryDiscount = artisanNetwork ? Math.max(2, Math.round(project.cost.masonry * 0.15)) : 0
  return {
    treasury: project.cost.treasury,
    masonry: Math.max(0, project.cost.masonry - masonryDiscount),
    masonryDiscount,
  }
}

export function projectPreview(state, projectId, districtId = state.selectedDistrictId) {
  const project = PROJECTS[projectId]
  const district = state.districts.find((item) => item.id === districtId)
  if (!project || !district) return null
  const favored = projectId === district.favoredProject
  const cisternNetwork = projectId === 'fire' && hasCompletedProject(state, 'cistern')
  const baseCity = Object.fromEntries(Object.entries(project.effects).filter(([key]) => CITY_EFFECT_KEYS.includes(key)))
  const networkCity = cisternNetwork ? { fireRisk: -4, order: 1 } : {}
  const city = combineEffects(baseCity, favored ? district.favoredBonus?.city : null, networkCity)
  const resources = combineEffects(
    project.effects.masonry ? { masonry: project.effects.masonry } : null,
    favored ? district.favoredBonus?.resources : null,
  )
  const bonusLabels = [
    favored ? district.favoredBonus?.label : null,
    cisternNetwork ? 'The restored cistern network gives the brigade additional water and coordination.' : null,
  ].filter(Boolean)
  return {
    project,
    district,
    cost: effectiveProjectCost(state, projectId),
    city,
    resources,
    devastation: project.effects.devastation ?? 0,
    ongoing: Object.fromEntries(Object.entries(project.effects).filter(([key]) => !CITY_EFFECT_KEYS.includes(key) && !['devastation', 'masonry'].includes(key))),
    favored,
    cisternNetwork,
    bonusLabels,
  }
}

export function seasonalIncome(state) {
  const completed = state.districts.flatMap((district) => district.projects)
  const workshops = completed.filter((project) => project.type === 'workshop').length
  const granaries = completed.filter((project) => project.type === 'granary').length
  const harborDamage = state.districts.find((district) => district.id === 'harbor')?.devastation ?? 100
  const easternRate = state.flags.persianSettlement === 'lump' ? 0.05 : state.flags.persianSettlement === 'installments' ? 0.08 : 0.15
  const breadBonus = state.flags.breadPolicy === 'subsidize' ? 4 : state.flags.breadPolicy === 'remit' ? 1 : 0
  return {
    treasury: 16 + (workshops * 2) - Math.round((state.theaters.east * easternRate) + ((state.theaters.africa + state.theaters.balkans) * 0.13)),
    grain: 11 + (granaries * 8) + Math.round((100 - harborDamage) / 18) - 13 + breadBonus,
    masonry: 8 + (workshops * 5),
    shipping: Math.max(1, 5 - Math.round(state.theaters.africa / 16)),
  }
}

export function cityAssessment(state) {
  const city = state.city
  const factions = Object.values(state.factions)
  const factionAverage = factions.reduce((sum, value) => sum + value, 0) / factions.length
  const recovery = clamp((city.water + city.housing + city.bread + city.employment + city.order + (100 - city.fireRisk)) / 6)
  const stability = clamp((city.order * 0.45) + (city.bread * 0.2) + (city.housing * 0.15) + (factionAverage * 0.2))
  const eastReadiness = clamp((state.theaters.east - 20) * 4)
  const balkanReadiness = clamp((state.theaters.balkans - 8) * 5)
  const reserveReadiness = clamp((state.theaters.reserve - 8) * 2.2)
  const africaReadiness = state.flags.africaPolicy === 'full'
    ? (state.theaters.africa >= 24 ? 85 : clamp(state.theaters.africa * 3))
    : state.flags.africaPolicy === 'limited'
      ? (state.theaters.africa >= 15 ? 75 : clamp(state.theaters.africa * 4))
      : state.flags.africaPolicy === 'declined' ? 70 : 45
  const imperial = clamp((eastReadiness * 0.3) + (balkanReadiness * 0.15) + (reserveReadiness * 0.25) + (africaReadiness * 0.3))
  return { recovery, stability, imperial, factionAverage: Math.round(factionAverage) }
}

export function canStartProject(state, projectId, districtId) {
  const project = PROJECTS[projectId]
  const district = state.districts.find((item) => item.id === districtId)
  if (!project || !district) return { ok: false, reason: 'Choose a valid reconstruction order and district.' }
  if (state.outcome) return { ok: false, reason: 'The vertical-slice campaign has concluded.' }
  if (state.pendingDecisionId) return { ok: false, reason: 'Resolve the active imperial council first.' }
  if (district.activeProject) return { ok: false, reason: 'This district already has an active works contract.' }
  if (district.projects.some((item) => item.type === projectId) && projectId !== 'clear') return { ok: false, reason: `${project.name} already operates in this district.` }
  if (projectId === 'clear' && district.devastation <= 15) return { ok: false, reason: 'This district no longer requires a major clearance contract.' }
  if (projectId !== 'clear' && district.devastation > 60) return { ok: false, reason: `Clear the unstable ruins in ${district.name} before beginning ${project.name}.` }
  if (state.season + project.duration > SEASONS.length) return { ok: false, reason: `${project.name} cannot be completed before this campaign ends.` }
  const cost = effectiveProjectCost(state, projectId)
  if (state.resources.treasury < cost.treasury) return { ok: false, reason: `Requires ${cost.treasury} treasury.` }
  if (state.resources.masonry < cost.masonry) return { ok: false, reason: `Requires ${cost.masonry} masonry.` }
  if (availableLabor(state) < project.labor) return { ok: false, reason: `Requires ${project.labor} available labor.` }
  return { ok: true, reason: '' }
}

export function startProject(state, projectId, districtId) {
  const availability = canStartProject(state, projectId, districtId)
  if (!availability.ok) return { state, error: availability.reason }
  const project = PROJECTS[projectId]
  const cost = effectiveProjectCost(state, projectId)
  return {
    error: '',
    state: {
      ...state,
      resources: {
        ...state.resources,
        treasury: state.resources.treasury - cost.treasury,
        masonry: state.resources.masonry - cost.masonry,
      },
      selectedProjectId: null,
      districts: state.districts.map((district) => district.id === districtId
        ? { ...district, activeProject: { type: projectId, remaining: project.duration, started: state.season, favored: projectId === district.favoredProject, cost } }
        : district),
      chronicle: [...state.chronicle, { season: seasonLabel(state), category: 'Reconstruction', title: project.name, detail: `Work began in ${state.districts.find((item) => item.id === districtId).name}.` }],
    },
  }
}

function completeProjects(state) {
  let city = { ...state.city }
  let resources = { ...state.resources }
  const completed = []
  const districts = state.districts.map((district) => {
    if (!district.activeProject) return district
    const remaining = district.activeProject.remaining - 1
    if (remaining > 0) return { ...district, activeProject: { ...district.activeProject, remaining } }
    const definition = PROJECTS[district.activeProject.type]
    const preview = projectPreview(state, definition.id, district.id)
    city = addValues(city, preview.city, true)
    resources = addValues(resources, preview.resources)
    completed.push({ district: district.name, project: definition.name, favored: preview.favored, bonusLabels: preview.bonusLabels })
    return {
      ...district,
      devastation: clamp(district.devastation + preview.devastation),
      activeProject: null,
      projects: [...district.projects, { type: definition.id, completed: state.season + 1, favored: preview.favored }],
    }
  })
  return { city, resources, districts, completed }
}

export function adjustTheater(state, theaterId, delta) {
  if (state.pendingDecisionId || state.outcome) return { state, error: 'Resolve the active council before changing deployments.' }
  const theater = THEATERS[theaterId]
  if (!theater || theaterId === 'reserve') return { state, error: 'Choose a field theater.' }
  const nextTheater = state.theaters[theaterId] + delta
  const nextReserve = state.theaters.reserve - delta
  if (nextTheater < theater.floor) return { state, error: `${theater.name} cannot fall below ${theater.floor}.` }
  if (nextReserve < THEATERS.reserve.floor) return { state, error: 'The capital reserve cannot be reduced further.' }
  if (nextTheater > 60) return { state, error: 'No theater can absorb more than 60 field-force points in this slice.' }
  return { state: { ...state, theaters: { ...state.theaters, [theaterId]: nextTheater, reserve: nextReserve } }, error: '' }
}

export function resolveDecision(state, choiceId) {
  const decision = DECISIONS[state.pendingDecisionId]
  const choice = decision?.choices.find((item) => item.id === choiceId)
  if (!decision || !choice) return { state, error: 'No matching council order is available.' }
  let theaters = { ...state.theaters }
  Object.entries(choice.theater ?? {}).forEach(([key, value]) => { theaters[key] = (theaters[key] ?? 0) + value })
  if (Object.values(theaters).some((value) => value < 0)) {
    return { state, error: 'This order requires more troops than remain in the capital reserve.' }
  }
  const forceTotal = Object.values(theaters).reduce((sum, value) => sum + value, 0)
  if (forceTotal !== state.resources.fieldForces) {
    return { state, error: 'This council order would violate the fixed field-force total.' }
  }
  const next = {
    ...state,
    resources: addValues(state.resources, choice.effects),
    city: addValues(state.city, choice.city, true),
    factions: addValues(state.factions, choice.factions, true),
    theaters,
    flags: { ...state.flags, ...(choice.flags ?? {}) },
    pendingDecisionId: null,
    resolvedDecisionIds: [...state.resolvedDecisionIds, decision.id],
    chronicle: [...state.chronicle, { season: seasonLabel(state), category: decision.authority, title: decision.title, detail: choice.title }],
  }
  return { state: next, error: '' }
}

function applySeasonalPressure(state) {
  const income = seasonalIncome(state)
  let resources = addValues(state.resources, income)
  resources.grain = Math.min(resources.grain, 170 + (state.districts.flatMap((d) => d.projects).filter((p) => p.type === 'granary').length * 45))
  let city = { ...state.city }
  if (resources.grain < 45) city = addValues(city, { bread: -8, order: -5 }, true)
  else city = addValues(city, { bread: 1 }, true)
  if (city.housing < 45) city = addValues(city, { order: -2, fireRisk: 1 }, true)
  if (city.employment < 45) city = addValues(city, { order: -2 }, true)
  if (state.theaters.reserve < 15) city = addValues(city, { order: -3 }, true)
  const factionDrift = {}
  if (city.bread < 50) { factionDrift.blues = -2; factionDrift.greens = -2 }
  if (city.order > 60) factionDrift.senate = 1
  if (state.resources.treasury < 25) factionDrift.army = -2
  return { resources, city, factions: addValues(state.factions, factionDrift, true) }
}

function finalOutcome(state) {
  const assessment = cityAssessment(state)
  const africaPolicy = state.flags.africaPolicy
  const africaSuccess = africaPolicy === 'full' ? state.theaters.africa >= 24 : africaPolicy === 'limited' ? state.theaters.africa >= 15 : true
  if (assessment.stability < 38 || state.city.order < 30 || state.city.bread < 30) return 'second-rising'
  if (africaPolicy === 'declined' && assessment.recovery >= 63 && assessment.stability >= 48) return 'capital-first'
  if (assessment.recovery >= 65 && assessment.stability >= 55 && africaSuccess && state.resources.treasury >= 25) return 'balanced-renewal'
  if (africaPolicy === 'full' && assessment.imperial >= 58 && assessment.recovery < 67) return 'conquerors-capital'
  return 'strained-recovery'
}

export function advanceSeason(state) {
  if (state.pendingDecisionId || state.outcome) return { state, error: state.pendingDecisionId ? 'Resolve the active imperial council first.' : 'The campaign has concluded.' }
  const completed = completeProjects(state)
  let next = { ...state, ...completed, season: state.season + 1 }
  const pressure = applySeasonalPressure(next)
  next = { ...next, ...pressure }
  const eventResult = resolveSeasonEvent(next)
  next = eventResult.state
  completed.completed.forEach((item) => {
    next.chronicle = [...next.chronicle, { season: SEASONS[Math.min(next.season, 11)], category: 'Completed', title: item.project, detail: item.district }]
  })
  next.chronicle = [...next.chronicle, { season: eventResult.event.season, category: 'Seasonal Pressure', title: eventResult.event.title, detail: eventResult.event.detail }]
  const reportChanges = {}
  Object.entries(next.resources).forEach(([key, value]) => {
    const delta = value - (state.resources[key] ?? 0)
    if (delta) reportChanges[key] = delta
  })
  Object.entries(next.city).forEach(([key, value]) => {
    const delta = value - (state.city[key] ?? 0)
    if (delta) reportChanges[key] = delta
  })
  next.lastSeasonReport = { event: eventResult.event, completed: completed.completed, changes: reportChanges }
  const decision = Object.values(DECISIONS).find((item) => item.season === next.season && !next.resolvedDecisionIds.includes(item.id))
  if (decision) next.pendingDecisionId = decision.id
  if (next.season >= SEASONS.length) next.outcome = finalOutcome(next)
  return { state: next, error: '' }
}

export function serializeState(state) {
  return JSON.stringify(state)
}

export function restoreState(value) {
  try {
    const parsed = JSON.parse(value)
    if (parsed?.version !== 2 || !Array.isArray(parsed.districts)) return null
    const districts = parsed.districts.map((district) => {
      const definition = DISTRICTS.find((item) => item.id === district.id)
      return definition ? { ...definition, ...district } : district
    })
    return { ...parsed, districts }
  } catch {
    return null
  }
}

export function resetState() {
  return createInitialState()
}

export function validateState(state) {
  const totalForces = Object.values(state.theaters).reduce((sum, value) => sum + value, 0)
  return {
    valid: state.districts.length === DISTRICTS.length && totalForces === state.resources.fieldForces,
    totalForces,
  }
}
