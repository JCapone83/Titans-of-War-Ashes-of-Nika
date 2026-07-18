import { cityAssessment } from './simulation.js'

export const OUTCOMES = {
  'balanced-renewal': {
    title: 'The Capital and Empire Recover Together',
    summary: 'Constantinople has water, bread, work, and defensible order. The western expedition did not consume the administrative state that launched it.',
  },
  'conquerors-capital': {
    title: 'A Conqueror’s Capital',
    summary: 'Imperial reach has expanded while burned quarters and fragile services remain beneath the court’s ceremonies.',
  },
  'capital-first': {
    title: 'The Capital Before the Map',
    summary: 'The throne declined the western gamble and rebuilt a more resilient Constantinople, leaving another generation to judge the opportunity refused.',
  },
  'strained-recovery': {
    title: 'A Recovery Under Strain',
    summary: 'The city functions and the armies remain in the field, but one failed harvest, mutiny, or fire could expose how narrow the margin remains.',
  },
  'second-rising': {
    title: 'The Ashes Ignite Again',
    summary: 'Bread, housing, and political authority failed together. The factions do not need identical interests to find a common enemy in the palace.',
  },
}

function grade(score) {
  if (score >= 70) return 'A'
  if (score >= 64) return 'B'
  if (score >= 56) return 'C'
  if (score >= 46) return 'D'
  return 'F'
}

export function campaignReport(state) {
  const assessment = cityAssessment(state)
  const fiscal = Math.max(0, Math.min(100, Math.round((state.resources.treasury * 0.6) + (state.resources.grain * 0.2))))
  const legitimacy = Math.round((state.city.legitimacy + assessment.factionAverage) / 2)
  const grades = [
    ['Urban Recovery', assessment.recovery],
    ['Political Order', assessment.stability],
    ['Imperial Strategy', assessment.imperial],
    ['Fiscal Reserve', fiscal],
    ['Legitimacy', legitimacy],
  ].map(([label, score]) => ({ label, score, grade: grade(score) }))
  const overall = Math.round(grades.reduce((sum, item) => sum + item.score, 0) / grades.length)
  return { assessment, grades, overall, grade: state.outcome === 'second-rising' ? 'F' : grade(overall) }
}
