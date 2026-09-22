# Build Together presentation

One continuously mounted phone (`fitness-demo.html`) evolves as the presenter scrolls through 15 chapters. `build-together.js` sets the stage through origin-checked messages; activity state remains inside the phone. Inputs and activity records survive chapter changes.

## Presenting

Use arrow keys or the bottom navigation. N toggles presenter notes. The phone is sticky on desktop; on narrow screens it becomes a compact sticky preview with a hide/show control. Its contents scroll independently.

The collaboration walkthrough intentionally has prerequisites: create the simulated repository, create the walking branch, open the pull request, test both options, mark reviewed, merge, delete the branch, deploy. These actions illustrate a GitHub workflow; they do not provision resources or make GitHub changes.

The data lesson mirrors phone records into a table. Enabling saving uses localStorage on the current browser/device. Reload phone demonstrates rehydration. Clear demo records removes the saved example. This is not a real backend, shared database, or multi-user service. No personal health data is required.

## Practice and timing

Download `downloads/fitness-starter.html`: a self-contained editable starter with Run and Walk, complete activity logging, and no external dependencies. It opens directly as a standalone app. Pair contributions still use `prototypes/<team>/` with metadata and a README, following CONTRIBUTING.md.

60 min: framing 5, build demo 9, Git 12, hosting/data 9, practice 15, debrief 5, transitions 5.
45 min: framing 3, build demo 6, Git 8, hosting/data 6, practice 15, debrief 4, transitions 3.

## Previous version

`versions/2026-09-22-before-build-together/` contains the entire built site from commit 30814e17fdee54564b73abd80808c90e1b6eaf67. It is copied into the published site's `/versions/` directory. Do not revise archived files when editing the current presentation.

## Implementation

Current presentation: `site/index.html`, `site/assets/build-together.css`, `site/assets/build-together.js`.
Phone: `site/fitness-demo.html`, `site/assets/fitness-demo.css`, `site/assets/fitness-demo.js`.
The standalone starter embeds the phone's CSS/JS; synchronize it when changing the phone.

Validation: `npm test`, `npm run build`, JavaScript syntax checks, and browser walkthrough of the incremental phone, collaboration prerequisites, logging, persistence/reload, reset, and gallery/archive links.
