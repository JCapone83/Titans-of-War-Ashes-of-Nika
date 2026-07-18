import { OUTCOMES, campaignReport } from './outcomes.js'
import { PROJECTS } from './data.js'

function projectName(project) {
  return project.name ?? PROJECTS[project.type]?.name ?? project.type ?? 'Unnamed work'
}

export function campaignChronicleMarkdown(state) {
  const outcome = OUTCOMES[state.outcome]
  const report = campaignReport(state)
  const completed = state.districts.flatMap((district) => district.projects.map((project) => ({
    ...project,
    district: district.name,
  })))
  const favored = completed.filter((project) => project.favored)
  const lines = [
    '# Titans of Constantinople: Imperial Chronicle',
    '',
    `## ${outcome?.title ?? 'Campaign in Progress'}`,
    '',
    outcome?.summary ?? 'The campaign has not reached its final assessment.',
    '',
    `**Overall stewardship:** ${report.grade} (${report.overall}/100)`,
    '',
    '## Final Assessment',
    '',
    ...report.grades.map((item) => `- ${item.label}: ${item.grade} (${item.score}/100)`),
    '',
    '## Final Resources',
    '',
    `- Treasury: ${state.resources.treasury}`,
    `- Grain: ${state.resources.grain}`,
    `- Masonry: ${state.resources.masonry}`,
    `- Shipping: ${state.resources.shipping}`,
    `- Field forces: ${state.resources.fieldForces}`,
    '',
    '## Public Works Completed',
    '',
  ]

  if (completed.length) {
    completed.forEach((project) => lines.push(`- ${projectName(project)} - ${project.district}${project.favored ? ' (district strength)' : ''}`))
  } else {
    lines.push('- No public works were completed.')
  }

  lines.push('', `Favored placements completed: ${favored.length}`, '', '## Decisions and Events', '')
  if (state.chronicle.length) {
    state.chronicle.forEach((entry) => lines.push(`- **${entry.season} - ${entry.title}:** ${entry.detail}`))
  } else {
    lines.push('- No entries recorded.')
  }
  lines.push('', '_Generated locally by Titans of Constantinople: Ashes of Nika._', '')
  return lines.join('\n')
}

export function chronicleFilename(state) {
  const ending = state.outcome ?? 'campaign'
  return `titans-constantinople-${ending}-chronicle.md`
}
