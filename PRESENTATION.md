# One connected design project

The workshop follows the user's session-specific process:
1. Strategy Dashboard
2. Brainstorming
3. P/E Feature list and game loop
4. Battle Plan (Balancing and Logic)
5. Wireframes

This sequence is authoritative for this presentation; it is not a claim of organization-wide naming approval. There are 25 scroll chapters, including the repository foundation, a cross-project change demonstration, and supporting Git, hosting, and data lessons.

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

Arrow keys navigate; N toggles notes. Pause motion respects reduced-motion preferences. Mobile has a compact sticky preview after repository creation; the cover hides it. Panels and the phone scroll independently.

60 minutes: opening/repository 4; live metrics/axes/players 12; brainstorming/P-E/loop 5; logic/change 5; wireframes 5; Git/hosting/data 7; practice 15; debrief 4; transitions 3.
45 minutes: opening/repository 3; live strategy 8 (use suggestions); brainstorming/P-E/loop 3; logic/change 3; wireframes 3; Git/hosting/data 5; practice 15; debrief 3; transitions 2.

Practice asks each pair to change a project decision, trace its implications, test, and hand it off. The downloadable fitness starter embeds baseline canonical rules. Exported project JSON can be given to the pair's AI alongside it to apply revised hypotheses.

## Development and validation

`npm run build` regenerates the self-contained baseline starter and builds the site. `npm test` checks gallery contribution handling, archive preservation, dependency IDs, reward exposure, qualification, daily caps, distinct days, and week boundaries. Browser verification covers the source-change demo, calculator, wireframe behavior, responsive views, and the existing Git/saving flow.

The archived pre-Build-Together site remains at `versions/2026-09-22-before-build-together/`; leave it unchanged. Later iterations are also recorded in Git history.

## Live Strategy Dashboard opening (22 September revision)

The first six folds are now:
1. Cover: left-side introduction and architectural background, with the preview hidden.
2. Create repository: reveal an empty folder. The detailed file-format explanation is expandable.
3. Set the business metrics: write four priority-ordered outcomes or use the prepared fitness example. Set creates context/business-metrics.md.
4. Define player axes: write four axis endpoints or use the prepared example. Set creates context/player-axes.json.
5. Create four player types: select a quadrant, write a title and profile, optionally upload an image, and adjust eight Core Drive emphasis sliders. Set locks the profile and adds players/player-N.html plus a shared context/player-types.json.

6. Desired Actions: write chronological actions for Discovery, Onboarding, Scaffolding, and Endgame; define each win-state and select linked business metrics. Each set phase updates context/desired-actions.json. Editing business metrics unlocks action phases for review.

The sticky schematic follows the supplied player → action → metric/feedback/reward relationships. Nodes light up as decisions are set. The diagram has no state legend or discussion outlines. Player completion requires four set profiles.

Examples follow the reference dashboard's method: priority-ordered quantifiable outcomes, two psychographic dimensions, four quadrants, and Core Drive hypotheses. The fitness names, numbers, and scores are proposed teaching examples, not source-deck facts or research. The chart is a neutral eight-axis input visualization, not official framework artwork.

Each “Write a fitness example” button animates the draft. Typing cancels the animation; Pause motion or reduced-motion preferences produce an immediate fill. Images are optional PNG/JPEG/WebP up to 1.2 MB and remain local. Suggestions use initials until an image is provided.

Set decisions generate real downloadable file content in a simulated repository; they do not make GitHub API calls. Open a file to inspect or download it, or download all set files as a ZIP with folder paths preserved. Drafts persist in local browser storage when available. Editing axes unlocks all player profiles for review; editing a decision removes its set artifact until it is set again.

The rest of the presentation continues through brainstorming, P/E, balancing, wireframes, Git, hosting, and data. Written workshop context accompanies the project JSON export. Narrative metric edits do not silently change the existing executable fitness qualification or economy rules.

Previous version: versions/2026-09-22-before-live-strategy/index.html.

The repository folder uses nearly the full available desktop height, with compact file rows and the schematic below. Downloads use plain text buttons. Storage captions, draft counts, and the schematic state legend have been removed. Reset repo clears the local workshop draft after a second confirmation click and returns to the opening; it does not alter the GitHub repository. S-shaped connectors meet the sides of the bubbles horizontally; the two vertical relationships retain vertical arrowheads.


## Feedback, rewards, brainstorm, and feature planning

After Desired Actions, two live list editors capture client context: feedback mechanics/vehicles and available rewards. Set generates context/feedback.md and context/rewards.md.

Brainstorming uses a central workshop octagon with eight selectable Core Drive groups. Write one idea per line, use optional fitness suggestions, and set each group. Saved groups generate brainstorm/core-drives.json and feed the P/E table directly. The board is a custom workshop arrangement, not official framework artwork.

Every saved idea becomes a feature row with Power and Ease scores from 1 to 5. All rows need both scores before MVP/V1/V2 choices become available. Optional score suggestions fill missing values; they are discussion examples, not an approved TOG formula. Optional release suggestions classify high-power/easier examples as MVP, then V1/V2; the presenter can change each choice. Set saves planning/pe-features.json.

Idea IDs are stable within a Core Drive for unchanged text. Reordering preserves scores. Changing an idea creates a new ID and requires scoring; editing any brainstorm group unlocks the feature plan. Older browser drafts migrate with empty editors while retaining existing metrics, players, and action phases.

The subsequent game-loop and economy lessons remain the baseline fitness demonstration. The feature plan is a proposed scope, not an automatic implementation of the chosen ideas.
