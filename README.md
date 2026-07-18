# Titans of Constantinople: Ashes of Nika

A deterministic historical city-building strategy game about rebuilding Constantinople after the Nika revolt. The player governs twelve seasons from winter 532 through autumn 534, balancing urban recovery against factional politics, frontier security, and the opening of Justinian's western wars.

The game does not require an account, server, or AI model. Campaign state is stored only in the browser.

## Play

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. For a production build:

```bash
npm run build
npm run preview
```

## Command Model

- Choose one of six damaged districts on the reconstruction map.
- Commission clearance, housing, water, food, workshop, watch, and fire-control projects.
- Match projects to district strengths for additional effects: harbor granaries, cistern works near surviving reservoirs, artisan workshops among the organized trades, and other site-specific advantages.
- Reassign a fixed pool of field forces between the East, Africa, the Balkans, and the capital reserve.
- Resolve seven imperial councils grounded in the political and material problems of 532-534.
- Read the next seasonal pressure before committing orders, then review a deterministic after-action report.
- Finish with separate grades for urban recovery, political order, imperial strategy, fiscal reserve, and legitimacy.
- Open the optional walkthrough or public-works context from the header at any time.
- Copy or download the final imperial chronicle as a local Markdown record.

This is a game model, not a claim that the Byzantine administration used modern numerical meters. Resources and scores make historical constraints legible; decision notes identify the period evidence behind the situations.

## Historical Scope

The first release concentrates on the immediate reconstruction problem after Nika: factional grievance, burned districts, public employment, bread and water, the rebuilding of Hagia Sophia, the Persian settlement, the African expedition, reconstruction contracts, and the revised Code of 534. The principal primary-source starting points are Procopius, John Malalas, John Lydus, the *Chronicon Paschale*, Paul the Silentiary, and the *Codex Justinianus*.

## Verification

```bash
npm test
npm run balance
npm run build
```

## License

Code is released under the MIT License. Visual assets have separate terms described in [MEDIA_RIGHTS.md](MEDIA_RIGHTS.md).
