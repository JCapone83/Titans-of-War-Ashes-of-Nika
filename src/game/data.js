export const SEASONS = [
  'Winter 532', 'Spring 532', 'Summer 532', 'Autumn 532',
  'Winter 533', 'Spring 533', 'Summer 533', 'Autumn 533',
  'Winter 534', 'Spring 534', 'Summer 534', 'Autumn 534',
]

export const PROJECTS = {
  clear: {
    id: 'clear', name: 'Clear Ruins', frame: 0, duration: 1,
    cost: { treasury: 12, masonry: 0 }, labor: 18,
    description: 'Remove unstable masonry, recover brick, and reopen a burned street.',
    effects: { devastation: -22, employment: 5, fireRisk: -5, masonry: 8 },
  },
  housing: {
    id: 'housing', name: 'Insula Housing', frame: 1, duration: 2,
    cost: { treasury: 24, masonry: 18 }, labor: 26,
    description: 'Rehouse families and workshops in compact fire-separated blocks.',
    effects: { housing: 13, employment: 4, order: 2, fireRisk: 2 },
  },
  baths: {
    id: 'baths', name: 'Public Baths', frame: 2, duration: 2,
    cost: { treasury: 30, masonry: 25 }, labor: 28,
    description: 'Restore bathing, water distribution, and neighborhood civic life.',
    effects: { water: 8, order: 5, legitimacy: 3 },
  },
  granary: {
    id: 'granary', name: 'Granary & Bakery', frame: 3, duration: 2,
    cost: { treasury: 27, masonry: 17 }, labor: 24,
    description: 'Protect grain stocks and expand the regulated bread supply.',
    effects: { bread: 13, grainCapacity: 45, employment: 4 },
  },
  cistern: {
    id: 'cistern', name: 'Cistern Works', frame: 4, duration: 3,
    cost: { treasury: 34, masonry: 31 }, labor: 31,
    description: 'Repair conduits, reservoirs, and neighborhood distribution points.',
    effects: { water: 18, fireRisk: -8, order: 2 },
  },
  workshop: {
    id: 'workshop', name: 'Artisan Workshop', frame: 5, duration: 2,
    cost: { treasury: 20, masonry: 10 }, labor: 22,
    description: 'Organize masons, carpenters, metalworkers, and recovered materials.',
    effects: { employment: 11, masonryIncome: 5, treasuryIncome: 2 },
  },
  watch: {
    id: 'watch', name: 'Fire-Watch Tower', frame: 6, duration: 1,
    cost: { treasury: 15, masonry: 13 }, labor: 14,
    description: 'Restore patrol visibility and rapid warning across rebuilt quarters.',
    effects: { fireRisk: -10, order: 4 },
  },
  fire: {
    id: 'fire', name: 'Fire Brigade', frame: 7, duration: 1,
    cost: { treasury: 19, masonry: 7 }, labor: 17,
    description: 'Station water carts, hooks, pumps, and trained neighborhood crews.',
    effects: { fireRisk: -14, employment: 3, order: 3 },
  },
}

export const PROJECT_ORDER = ['clear', 'housing', 'baths', 'granary', 'cistern', 'workshop', 'watch', 'fire']

export const DISTRICTS = [
  {
    id: 'hippodrome', name: 'Hippodrome Quarter', x: 31, y: 44, devastation: 61,
    note: 'Faction meeting places, housing, and workshops crowd the ceremonial spine.',
    specialty: 'Dense neighborhood rebuilding', favoredProject: 'housing',
    favoredBonus: { label: 'Compact neighborhood blocks add shelter and street order.', city: { housing: 4, order: 2 } },
  },
  {
    id: 'augustaeum', name: 'Augustaeum', x: 66, y: 39, devastation: 82,
    note: 'The imperial and ecclesiastical center remains a field of burned foundations.',
    specialty: 'Imperial civic works', favoredProject: 'baths',
    favoredBonus: { label: 'Civic restoration beside the ceremonial center carries added authority.', city: { order: 3, legitimacy: 3 } },
  },
  {
    id: 'harbor', name: 'Julian Harbor', x: 75, y: 76, devastation: 34,
    note: 'Warehouses, quays, and shipping connect the city to grain and army supply.',
    specialty: 'Grain and quay supply', favoredProject: 'granary',
    favoredBonus: { label: 'Quayside storage strengthens both the grain reserve and bread supply.', city: { bread: 4 }, resources: { grain: 10 } },
  },
  {
    id: 'cistern-quarter', name: 'Cistern Quarter', x: 43, y: 71, devastation: 48,
    note: 'Reservoirs survived, but conduits and neighborhood distribution are damaged.',
    specialty: 'Reservoir infrastructure', favoredProject: 'cistern',
    favoredBonus: { label: 'Surviving reservoirs extend the repaired conduits and fire reserve.', city: { water: 6, fireRisk: -3 } },
  },
  {
    id: 'workers', name: 'Artisan Quarter', x: 19, y: 69, devastation: 73,
    note: 'Burned insulae have displaced the labor needed for every imperial project.',
    specialty: 'Organized trades', favoredProject: 'workshop',
    favoredBonus: { label: 'Concentrated trades return additional employment and recovered masonry.', city: { employment: 4 }, resources: { masonry: 5 } },
  },
  {
    id: 'palace', name: 'Great Palace Precinct', x: 76, y: 19, devastation: 24,
    note: 'Administrative offices remain functional but command attention and guards.',
    specialty: 'Palace security', favoredProject: 'watch',
    favoredBonus: { label: 'A palace watch strengthens fire warning, order, and public confidence.', city: { fireRisk: -4, order: 2, legitimacy: 2 } },
  },
]

export const THEATERS = {
  east: { id: 'east', name: 'Eastern Frontier', floor: 24, summary: 'Peace requires forts, intelligence, and a credible field army.' },
  africa: { id: 'africa', name: 'African Expedition', floor: 0, summary: 'Uncommitted until the imperial council authorizes the expedition.' },
  balkans: { id: 'balkans', name: 'Balkan Approaches', floor: 12, summary: 'The capital cannot strip every nearby command for distant glory.' },
  reserve: { id: 'reserve', name: 'Capital Reserve', floor: 8, summary: 'Guards and mobile troops preserve order and strategic flexibility.' },
}

export const COUNCIL_LABELS = {
  senate: 'Senate', blues: 'Blues', greens: 'Greens', church: 'Church', army: 'Army', partnership: 'Theodora & Court',
}

export const DECISIONS = {
  mandate: {
    id: 'mandate', season: 0, authority: 'Imperial Council', title: 'The Morning After Nika',
    brief: 'The throne has survived, but fire, executions, faction grievances, and administrative hatred remain. The first public order will define what reconstruction means.',
    context: 'The revolt joined racing factions, officeholders, senators, and an alternative imperial claimant without turning them into one permanent political party. Reconstruction must separate these interests before they unite again.',
    sources: ['Procopius, Wars I.24', 'John Malalas, Chronicle XVIII', 'Chronicon Paschale, year 532'],
    choices: [
      { id: 'employment', title: 'Put the displaced to work immediately', argument: 'Paid clearing crews turn desperation into visible recovery.', effects: { treasury: -10, masonry: 8 }, city: { employment: 8, order: 3 }, factions: { blues: 4, greens: 4, senate: -2 } },
      { id: 'justice', title: 'Review grievances and dismissed officials', argument: 'Procedure can divide concrete complaints from dynastic opposition.', city: { order: 5, legitimacy: 4 }, factions: { blues: 5, greens: 6, senate: 4, partnership: -2 } },
      { id: 'authority', title: 'Secure the capital before rebuilding', argument: 'A second rising must be made impossible before money returns to the streets.', city: { order: 7, employment: -3 }, factions: { army: 6, blues: -6, greens: -7, senate: -3 } },
    ],
  },
  sophia: {
    id: 'sophia', season: 1, authority: 'Architectural Commission', title: 'The Great Church',
    brief: 'The burned Great Church stands beside the palace. Anthemius of Tralles and Isidore of Miletus offer a design unlike the basilica that was lost.',
    context: 'Justinian began the new Hagia Sophia within weeks of the revolt. The project joined worship, engineering, employment, ceremonial authority, and imperial competition for materials.',
    sources: ['Procopius, Buildings I.1', 'John Malalas, Chronicle XVIII', 'Paul the Silentiary, Description of Hagia Sophia'],
    choices: [
      { id: 'monument', title: 'Authorize the unprecedented design', argument: 'Make the rebuilt capital visible in one work of engineering and worship.', effects: { treasury: -28, masonry: -22 }, city: { employment: 8, legitimacy: 14 }, factions: { church: 9, senate: -4, partnership: 5 }, flags: { sophia: 'monumental' } },
      { id: 'staged', title: 'Build in funded stages', argument: 'Protect housing and water works while preserving the greater design.', effects: { treasury: -17, masonry: -13 }, city: { employment: 5, legitimacy: 8 }, factions: { church: 5, senate: 3 }, flags: { sophia: 'staged' } },
      { id: 'basilica', title: 'Restore a conventional basilica first', argument: 'Return worship quickly and reserve the most daring expenditure for a safer year.', effects: { treasury: -10, masonry: -8 }, city: { order: 5, legitimacy: 4 }, factions: { church: 2, senate: 7, partnership: -5 }, flags: { sophia: 'conventional' } },
    ],
  },
  persian_peace: {
    id: 'persian_peace', season: 3, authority: 'Consistorium', title: 'The Price of Eternal Peace',
    brief: 'Envoys can settle the war with Khusro. The demanded payment is immense, but a quiet eastern frontier would release revenue, attention, and eventually troops for the capital and the West.',
    context: 'The agreement of 532 restored the territorial position while the Romans paid 11,000 pounds of gold, formally connected to the defense of the Caucasian passes. Both rulers had reasons to secure their thrones and redirect their power.',
    sources: ['Procopius, Persian Wars I.22', 'John Malalas, Chronicle XVIII', 'Zachariah of Mytilene, Ecclesiastical History IX'],
    choices: [
      { id: 'lump', title: 'Pay the settlement in full', argument: 'Purchase strategic quiet now and reduce the recurring cost of the eastern army.', effects: { treasury: -30 }, city: { legitimacy: 3 }, factions: { senate: -5, army: -2, partnership: 5 }, flags: { persianSettlement: 'lump' } },
      { id: 'installments', title: 'Negotiate staged payments', argument: 'Preserve the reconstruction treasury while accepting a smaller continuing burden.', effects: { treasury: -18 }, city: { legitimacy: 2 }, factions: { senate: 2, army: -1 }, flags: { persianSettlement: 'installments' } },
      { id: 'armed', title: 'Keep the frontier mobilized', argument: 'Avoid the great payment, but retain the army and its expense in the East.', effects: { treasury: -8, grain: -5 }, city: { order: 2 }, factions: { army: 7, senate: -4, partnership: -3 }, flags: { persianSettlement: 'armed' } },
    ],
  },
  bread_assessment: {
    id: 'bread_assessment', season: 4, authority: 'Praetorian Prefecture', title: 'Bread, Arrears, and the Winter Assessment',
    brief: 'The treasury needs collection, the bakeries need grain, and households rebuilding burned property petition against arrears assessed before the riot.',
    context: 'Nika cannot be reduced to one grievance. Hostility toward leading officials and fiscal administration joined factional violence, senatorial intrigue, and immediate crowd politics. Winter policy can separate those interests or reunite them.',
    sources: ['John Lydus, On the Magistracies III', 'Procopius, Wars I.24', 'John Malalas, Chronicle XVIII'],
    choices: [
      { id: 'collect', title: 'Maintain the full assessment', argument: 'The state cannot rebuild the capital and command armies on petitions alone.', effects: { treasury: 20, grain: -4 }, city: { bread: -4, order: -2 }, factions: { senate: 4, blues: -5, greens: -5 }, flags: { breadPolicy: 'collect' } },
      { id: 'remit', title: 'Remit arrears in the burned quarters', argument: 'Tie relief to documented fire losses and restore taxpayers before pursuing old balances.', effects: { treasury: -6 }, city: { legitimacy: 8, employment: 3 }, factions: { blues: 5, greens: 5, senate: -3 }, flags: { breadPolicy: 'remit' } },
      { id: 'subsidize', title: 'Fund grain and regulated bread first', argument: 'A visible loaf is more urgent than either punishment or general remission.', effects: { treasury: -16, grain: 24 }, city: { bread: 9, order: 4 }, factions: { blues: 4, greens: 4, senate: -2 }, flags: { breadPolicy: 'subsidize' } },
    ],
  },
  africa: {
    id: 'africa', season: 5, authority: 'War Council', title: 'The African Question',
    brief: 'Belisarius and the fleet can sail against the Vandal kingdom. The city still needs masonry, grain, labor, and ships; the army needs pay and transport.',
    context: 'The expedition of 533 followed peace with Persia. Its apparent opportunity did not remove the danger of committing ships and soldiers while Constantinople was rebuilding.',
    sources: ['Procopius, Vandal Wars I.10-12', 'Codex Justinianus I.27', 'John Malalas, Chronicle XVIII'],
    choices: [
      { id: 'full', title: 'Fund Belisarius for a decisive expedition', argument: 'Concentrated command and sufficient shipping offer the shortest road to victory.', effects: { treasury: -26, shipping: -24 }, theater: { africa: 24, reserve: -24 }, factions: { army: 8, senate: -4 }, flags: { africaPolicy: 'full' } },
      { id: 'limited', title: 'Send a limited expedition with staged support', argument: 'Test the opportunity without suspending the capital’s reconstruction.', effects: { treasury: -15, shipping: -14 }, theater: { africa: 15, reserve: -15 }, factions: { army: 3, senate: 3 }, flags: { africaPolicy: 'limited' } },
      { id: 'decline', title: 'Keep the fleet and army near the capital', argument: 'A burned capital and exposed East make western adventure premature.', effects: { treasury: 5, shipping: 5 }, theater: { east: 5, reserve: -5 }, factions: { army: -8, senate: 5 }, flags: { africaPolicy: 'declined' } },
    ],
  },
  contracts: {
    id: 'contracts', season: 7, authority: 'Reconstruction Commission', title: 'Who Commands the Work Crews?',
    brief: 'Imperial projects now compete for trained masons, carpenters, haulers, and shipwrights. The palace must decide how contracts and labor are organized for the second year.',
    context: 'Procopius presents Justinianic building as directed imperial action executed through named architects and large bodies of craftsmen. That praise also reveals the administrative problem: labor, materials, and supervision had to be concentrated without emptying ordinary workshops.',
    sources: ['Procopius, Buildings I.1', 'John Lydus, On the Magistracies III', 'Codex Justinianus VIII.10'],
    choices: [
      { id: 'palace', title: 'Centralize contracts under palace officers', argument: 'Concentrated supervision gives the throne a smaller but more dependable labor reserve.', effects: { treasury: 8 }, city: { order: 3, employment: -2 }, factions: { senate: 4, partnership: 5 }, flags: { contractSystem: 'palace' } },
      { id: 'collegia', title: 'Rely on the artisan collegia', argument: 'Give organized trades wider control of recruitment and sequence the public contracts around them.', effects: { treasury: -8 }, city: { employment: 8, legitimacy: 3 }, factions: { blues: 3, greens: 3, senate: -2 }, flags: { contractSystem: 'collegia' } },
      { id: 'church', title: 'Route neighborhood works through church patrons', argument: 'Use ecclesiastical networks to pair relief, housing repair, and local supervision.', effects: { treasury: -6 }, city: { housing: 4, order: 3 }, factions: { church: 8, senate: -3, partnership: -2 }, flags: { contractSystem: 'church' } },
    ],
  },
  codex: {
    id: 'codex', season: 11, authority: 'Imperial Chancery', title: 'Cordi: A Revised Imperial Code',
    brief: 'New constitutions and the great legal compilation have made the first Code obsolete. Tribonian asks authority to issue a corrected second edition before the campaign closes.',
    context: 'The constitution Cordi promulgated the Codex repetitae praelectionis on 16 November 534. The work was both administrative machinery and a statement that imperial enactments should be gathered into an authoritative order.',
    sources: ['Constitutio Cordi, 16 November 534', 'Codex Justinianus I.17', 'Justinian, Constitutio Tanta'],
    choices: [
      { id: 'publish', title: 'Publish the revised Code now', argument: 'Accept the cost and resistance required to make one current collection authoritative.', effects: { treasury: -12 }, city: { legitimacy: 12, order: 3 }, factions: { senate: -3, partnership: 6 }, flags: { codexPolicy: 'published' } },
      { id: 'consult', title: 'Circulate it through provincial commissions', argument: 'Trade speed for broader administrative consent and fewer immediate contradictions.', effects: { treasury: -8, shipping: -4 }, city: { legitimacy: 7 }, factions: { senate: 4, partnership: 2 }, flags: { codexPolicy: 'consulted' } },
      { id: 'delay', title: 'Delay the second edition', argument: 'Preserve the treasury and avoid forcing another institutional settlement this year.', effects: { treasury: 6 }, city: { legitimacy: -5 }, factions: { senate: 5, partnership: -5 }, flags: { codexPolicy: 'delayed' } },
    ],
  },
}
