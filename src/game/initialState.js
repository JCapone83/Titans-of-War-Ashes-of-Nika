import { DISTRICTS } from './data.js'

export function createInitialState() {
  return {
    version: 2,
    season: 0,
    resources: { treasury: 150, grain: 125, masonry: 88, shipping: 80, fieldForces: 100 },
    city: { water: 51, housing: 37, bread: 58, employment: 34, fireRisk: 76, order: 49, legitimacy: 44 },
    factions: { senate: 46, blues: 35, greens: 31, church: 63, army: 58, partnership: 74 },
    theaters: { east: 34, africa: 0, balkans: 18, reserve: 48 },
    districts: DISTRICTS.map((district) => ({ ...district, projects: [], activeProject: null })),
    selectedDistrictId: 'augustaeum',
    selectedProjectId: null,
    pendingDecisionId: 'mandate',
    resolvedDecisionIds: [],
    flags: {},
    chronicle: [],
    lastSeasonReport: null,
    outcome: null,
  }
}
