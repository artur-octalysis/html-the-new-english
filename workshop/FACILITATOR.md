# Facilitate the pair workshop

## Before the session
Confirm everyone has a GitHub account and a local AI coding tool with terminal access. Git and GitHub CLI can be installed before the meeting. Browser authorization remains a participant action. Select a driver per pair. Use the copyable pair-specific setup prompt on the presentation.

The public repository can be cloned without collaborator access. Drivers can contribute through their own forks; collaborators can push branches to the original repository. Check remotes before pushing. Do not put credentials in prompts. No participant invitations have been issued by this project.

## Live build and real handout
The default live code comes from workshop/starter/index.html. The presentation progressively enables HTML, CSS and JS in an isolated iframe. Edits are local, not Git commits.

If you edit the code during the live build, download the current HTML and replace workshop/starter/index.html in a reviewed commit before handing it out. Keep the app-css, app-js and APP HTML markers, which the download preserves. After merging the starter change, run Prepare pair handout from Actions on main. Its job summary links to the new branch comparison. Open a PR, wait for Validate and build, review and merge it. Actions creates a branch, not a PR automatically. Repository workflow-token settings do not permit automated PR creation.

The workflow runs scripts/distribute-starter.mjs. It copies the starter into all five actual pair folders and refuses to overwrite an existing index.html. It is deliberately not run before the session.

A local alternative: create a handout branch, run `node scripts/distribute-starter.mjs`, inspect `git diff`, commit the pair files, push and open a PR. This requires repository write access.

Participants fetch the original repository's main branch after the handout is merged and merge it into their pair branch. For a fork, this usually means `git fetch upstream` followed by `git merge upstream/main`; for a direct clone it is usually origin. Let the AI inspect the remotes, uncommitted work and branch first. Do not force-reset participant work.

## Twelve-minute practice
One driver writes; the navigator tests. Swap halfway. Scope edits to your assigned pairs/<pair>/ folder. Open index.html locally. Complete the README handoff, then open a PR against the original repository's main branch. First-time fork workflows may need maintainer approval. Pair previews appear in the gallery only after an index.html exists and its merge has deployed.

## A real conflict, prepared deliberately
Use one consenting pair's index.html after the starter handout exists. The main presenter and the pair create separate branches from the SAME main commit. Both change the text on the SAME h1 line, with no other edits needed.

1. Pair branch: change “Every move counts.” to “Your next small win.” and open a PR.
2. Presenter branch: change the same line to “Every step is progress.” and open a PR.
3. Merge the first PR. The second now has a competing change.
4. On the second branch, fetch and merge the original main. Git marks the conflicting block. Keep the agreed heading and remove all conflict markers.
5. Open the app, check the heading, stage and commit the resolved file, then push the second branch. Review and merge the PR. Delete finished branches.

Do not manufacture a conflict on unrelated files or discard a participant's changes. The on-site branch diagram explains the flow; it does not manipulate Git.

## Hosting and database
GitHub Actions validates and builds. Pages publishes after a successful main deployment. Refresh published files reads that published snapshot, not unmerged branches.

The activity table is a browser-memory demonstration with no remote database. In a deployed product, an authenticated API validates writes and enforces access rules before storing data. An API read supplies records that JS renders into HTML. GitHub Pages can host this front end; it does not provide the database.

## Sources
- https://cli.github.com/manual/gh_auth_login
- https://cli.github.com/manual/gh_repo_clone
- https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/resolving-a-merge-conflict-on-github
