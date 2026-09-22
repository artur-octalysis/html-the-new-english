# One connected design project

The workshop follows the user's session-specific process:
1. Strategy Dashboard
2. Brainstorming
3. P/E Feature list and game loop
4. Battle Plan (Balancing and Logic)
5. Wireframes

This sequence is authoritative for this presentation; it is not a claim of organization-wide naming approval. There are 21 scroll chapters, including the repository foundation, a cross-project change demonstration, and supporting Git, hosting, and data lessons.

## Central argument

The repository contains the project, not just a prototype. Structured decisions, stable IDs, AI instructions, tests, and HTML views make related changes visible and reviewable. Shared-source values update deterministic views. An instructed AI can propose and reconcile semantic edits across files; a repository alone does not execute AI or guarantee strategic consistency.

## Project source and views

Canonical source: `site/project/fitness-project.json`.
AI instructions and review responsibilities: `project/AI_CONTEXT.md`.
Calculations: `site/assets/project-model.js`.
Live project views and browser-edit state: `site/assets/project-workflow.js`.

The right-hand panel progresses through strategy, ideas, feature decisions, loop, and economy. It becomes the existing interactive phone at Wireframes. Phone activities and saved records are teaching data, with no remote database. Reward redemption is not implemented; the feature list deliberately marks it Model first.

## Demonstrations

- Economy: default expected cost is $1,920 over four weeks; full-participation cost is $8,000 against a $5,000 budget. Move cost to $1.25 to fit the upper bound under the simplified assumptions. This is scenario arithmetic, not a forecast or purchase.
- Alignment: one activity on each of three days yields 30 points; the proposed 60-point reward needs six activities. The interface flags this as an unresolved demand on busy returners.
- Dependency-aware change: inspect a proposed 10 → 5 minute threshold, acknowledge unresolved metric/economy validation, then apply it. Strategy, metric definition, feature labels, loop, and wireframe policy change together. The baseline remains marked for review. This is a scripted impact preview, not a live AI call.
- Browser changes are temporary. Download current JSON to preserve proposed edits, then commit and review them in the repository. Restore workshop assumptions resets project rules, not logged activities.
- Wireframe: under-threshold activity is recorded but earns no points. Qualifying activities earn points up to the daily cap. Weekly eligibility requires both distinct days and points. Week boundaries use the browser's local time; this is an explicit demo convention.
- Repository → branch → PR → diff → merge → deletion → deployment remains simulated. The repository foundation appears before Strategy. Complete it before the later Git exercise.

## Presenting

Arrow keys navigate; N toggles notes. Pause motion respects reduced-motion preferences. Mobile has a compact, always-visible project/phone preview. Panels and the phone scroll independently.

60 minutes: framing/repository 5; Strategy 3; Brainstorming 2; Feature List/Loop 4; Logic/change 8; Wireframes 7; Git/hosting/data 9; practice 15; debrief 4; transitions 3.
45 minutes: framing 3; Strategy 2; Brainstorming 1; Feature List/Loop 3; Logic/change 6; Wireframes 5; Git/hosting/data 5; practice 15; debrief 3; transitions 2.

Practice asks each pair to change a project decision, trace its implications, test, and hand it off. The downloadable fitness starter embeds baseline canonical rules. Exported project JSON can be given to the pair's AI alongside it to apply revised hypotheses.

## Development and validation

`npm run build` regenerates the self-contained baseline starter and builds the site. `npm test` checks gallery contribution handling, archive preservation, dependency IDs, reward exposure, qualification, daily caps, distinct days, and week boundaries. Browser verification covers the source-change demo, calculator, wireframe behavior, responsive views, and the existing Git/saving flow.

The archived pre-Build-Together site remains at `versions/2026-09-22-before-build-together/`; leave it unchanged. Later iterations are also recorded in Git history.
