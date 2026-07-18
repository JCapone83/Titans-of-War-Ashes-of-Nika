import { PROJECTS, SEASONS } from './data.js'

const FORECASTS = {
  1: { id: 'bread-convoys', title: 'Emergency Bread Convoys', brief: 'Shipping capacity will determine whether spring grain arrivals steady the bakeries.', watch: 'Keep shipping at 60 or above.' },
  2: { id: 'summer-sparks', title: 'Summer Sparks', brief: 'Dry ruins and crowded housing make neighborhood fire control the season’s test.', watch: 'Bring fire risk below 60.' },
  3: { id: 'pay-chests', title: 'Autumn Pay Chests', brief: 'The field commands will judge whether reconstruction has emptied the military treasury.', watch: 'Hold at least 50 treasury.' },
  4: { id: 'winter-cisterns', title: 'Winter Cistern Levels', brief: 'Damaged conduits will expose any weakness in the city’s water reserve.', watch: 'Keep water at 50 or above.' },
  5: { id: 'sailing-season', title: 'The Sailing Season Opens', brief: 'Fleet readiness will shape the cost of any African commitment.', watch: 'Preserve at least 55 shipping.' },
  6: { id: 'grain-fleet', title: 'The Black Sea Grain Fleet', brief: 'A working harbor and sufficient ships can turn summer arrivals into a real reserve.', watch: 'Keep shipping at 50 or above; a favored harbor granary strengthens the convoy.' },
  7: { id: 'artisan-wages', title: 'Artisan Wage Pressure', brief: 'Large public works are bidding against ordinary workshops for skilled hands.', watch: 'Avoid committing more than 80 labor at once.' },
  8: { id: 'winter-watch', title: 'The Winter Fire Watch', brief: 'Rebuilt blocks will be tested by lamps, braziers, workshops, and narrow streets.', watch: 'Bring fire risk to 55 or below.' },
  9: { id: 'requisitions', title: 'Provincial Requisitions', brief: 'Distant forces may require another draw on the capital’s grain and money.', watch: 'Large African deployments carry a supply cost.' },
  10: { id: 'harbor-season', title: 'The Harbor Season', brief: 'Recovered quays can return shipping and customs revenue to the treasury.', watch: 'Reduce Julian Harbor devastation to 30 or below.' },
  11: { id: 'senatorial-audit', title: 'The Senatorial Audit', brief: 'The court’s final legislative program will be judged against the remaining reserve.', watch: 'Hold at least 40 treasury.' },
  12: { id: 'closing-accounts', title: 'Closing the Imperial Accounts', brief: 'Officials compare the rebuilt city, the army establishment, and the money left to sustain both.', watch: 'Finish with bread, order, and treasury intact.' },
}

const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)))
const resourceClamp = (value) => Math.max(0, Math.round(value))

function add(base, effects = {}, bounded = false) {
  const next = { ...base }
  Object.entries(effects).forEach(([key, value]) => {
    next[key] = bounded ? clamp((next[key] ?? 0) + value) : resourceClamp((next[key] ?? 0) + value)
  })
  return next
}

export function getSeasonForecast(state) {
  return FORECASTS[Math.min(state.season + 1, 12)] ?? FORECASTS[12]
}

export function resolveSeasonEvent(state) {
  const event = FORECASTS[Math.min(state.season, 12)] ?? FORECASTS[12]
  let resources = { ...state.resources }
  let city = { ...state.city }
  let factions = { ...state.factions }
  let detail = ''

  switch (state.season) {
    case 1:
      if (state.resources.shipping >= 60) { resources = add(resources, { grain: 10 }); city = add(city, { bread: 2 }, true); detail = 'Adequate shipping brought emergency grain into the city.' }
      else { resources = add(resources, { grain: -7 }); city = add(city, { bread: -3 }, true); detail = 'Too few serviceable ships delayed the spring grain convoys.' }
      break
    case 2:
      if (state.city.fireRisk <= 60) { city = add(city, { order: 2, legitimacy: 2 }, true); detail = 'Fire patrols contained the summer outbreaks.' }
      else { resources = add(resources, { treasury: -6 }); city = add(city, { order: -3, housing: -2 }, true); detail = 'Uncontrolled fires consumed money and temporary housing.' }
      break
    case 3:
      if (state.resources.treasury >= 50) { factions = add(factions, { army: 2 }, true); detail = 'The autumn pay chests reached the field commands on time.' }
      else { factions = add(factions, { army: -6 }, true); city = add(city, { order: -2 }, true); detail = 'Late army pay weakened confidence in the palace.' }
      break
    case 4:
      if (state.city.water >= 50) { city = add(city, { legitimacy: 2 }, true); detail = 'The repaired water system carried the city through winter.' }
      else { city = add(city, { bread: -4, order: -3 }, true); detail = 'Low cistern levels disrupted bakeries and neighborhood order.' }
      break
    case 5:
      if (state.resources.shipping >= 55) { resources = add(resources, { shipping: 3 }); detail = 'Prepared yards returned additional transports to service.' }
      else { resources = add(resources, { treasury: -5, shipping: -3 }); detail = 'Emergency refits raised the cost of the sailing season.' }
      break
    case 6:
      {
        const harbor = state.districts.find((district) => district.id === 'harbor')
        const harborGranary = harbor?.projects.some((project) => project.type === 'granary' && project.favored)
        if (state.resources.shipping >= 50) {
          resources = add(resources, { grain: harborGranary ? 18 : 12 })
          city = add(city, { bread: harborGranary ? 3 : 2 }, true)
          detail = harborGranary ? 'The Black Sea fleet unloaded directly into the quayside granaries, enlarging the reserve.' : 'The Black Sea fleet added a substantial grain reserve.'
        } else {
          resources = add(resources, { grain: harborGranary ? -6 : -10 })
          city = add(city, { bread: harborGranary ? -3 : -4 }, true)
          detail = harborGranary ? 'Quayside storage softened, but could not erase, the losses caused by weak shipping.' : 'Weak shipping left the summer grain schedule exposed.'
        }
      }
      break
    case 7: {
      const committedLabor = state.districts.reduce((sum, district) => sum + (district.activeProject ? PROJECTS[district.activeProject.type].labor : 0), 0)
      if (committedLabor > 80) { resources = add(resources, { treasury: -6 }); city = add(city, { employment: 3 }, true); detail = 'Competing public contracts drove skilled wages upward.' }
      else { city = add(city, { employment: 2 }, true); detail = 'A measured building schedule kept private workshops functioning.' }
      break
    }
    case 8:
      if (state.city.fireRisk <= 55) { city = add(city, { order: 3 }, true); detail = 'The winter watch protected the rebuilt quarters.' }
      else { city = add(city, { housing: -3, order: -2 }, true); detail = 'Winter fires exposed gaps in patrols and water access.' }
      break
    case 9:
      if (state.theaters.africa >= 20) { resources = add(resources, { treasury: -5, grain: -6 }); factions = add(factions, { army: 2 }, true); detail = 'The African army received another costly round of requisitions.' }
      else { resources = add(resources, { treasury: 3 }); detail = 'Limited western commitments left more revenue near the capital.' }
      break
    case 10: {
      const harbor = state.districts.find((district) => district.id === 'harbor')
      if ((harbor?.devastation ?? 100) <= 30) { resources = add(resources, { treasury: 5, shipping: 5 }); detail = 'Recovered quays increased customs receipts and available shipping.' }
      else { detail = 'Damaged quays continued to restrain customs and ship repair.' }
      break
    }
    case 11:
      if (state.resources.treasury >= 40) { factions = add(factions, { senate: 3 }, true); city = add(city, { legitimacy: 2 }, true); detail = 'The remaining reserve strengthened the final legislative program.' }
      else { factions = add(factions, { senate: -4 }, true); detail = 'An exhausted treasury sharpened senatorial resistance.' }
      break
    case 12:
      if (state.city.bread >= 55 && state.city.order >= 55 && state.resources.treasury >= 30) { city = add(city, { legitimacy: 4 }, true); detail = 'The closing accounts showed a capital able to sustain imperial policy.' }
      else { city = add(city, { legitimacy: -3 }, true); detail = 'The closing accounts exposed unresolved weakness beneath the ceremonies.' }
      break
    default:
      detail = 'The administration used the season to consolidate its existing orders.'
  }

  return {
    state: { ...state, resources, city, factions },
    event: { ...event, season: SEASONS[Math.min(state.season, 11)], detail },
  }
}
