# Facilitate the pair workshop

## Before the session
Confirm everyone has a GitHub account and a local AI coding tool with terminal access. Git and GitHub CLI can be installed before the meeting. Browser authorization remains a participant action. Select a driver per pair. Use the copyable pair-specific setup prompt on the presentation.

The public repository can be cloned without collaborator access. Drivers can contribute through their own forks; collaborators can push branches to the original repository. Check remotes before pushing. Do not put credentials in prompts. No participant invitations have been issued by this project.

## Live build and real handout
Open the public presentation and click **Sign in with GitHub** in the top navigation. Authorize the Octalysis HTML Workshop app as artur-octalysis. Other accounts cannot run the build. Allow the sign-in popup if the browser blocks it.

The chat is a prepared teaching sequence, not a remote AI model. Each Run changes a real file:
1. Commit workshop/live/index.html on workshop/hosted-presenter.
2. Commit CSS to the same file.
3. Commit JavaScript to the same file.
4. Copy into every pair folder and the canonical starter, open a PR, wait for validation on its exact head, and merge. Do not run this final prompt early in rehearsal.

The handout refuses to overwrite existing pair index.html files. Drafts remain in GitHub if the browser closes; sign in again to resume. After publication, the viewer follows main. The public frontend updates after Pages deployment. The hosted service is deployed separately on Vercel.

Local fallback: npm run build, then npm run present, then http://127.0.0.1:8768/. This uses GitHub CLI and an isolated temporary worktree. Use only one handout route.

Double-click index.html in the folder to open the mobile-width browser window. Markdown opens in its own formatted reader. Folder, reader and browser can coexist, close and reopen independently, and be dragged by their title bars. Enter opens selected icons/files; touch uses a single tap. The folder path bar shows the subset being viewed: pairs/ or workshop/live/.

The next chapter supplies a pair-specific sync prompt. Participants inspect their remotes and local changes, then fetch the original repository’s main and merge it into their current pair branch. A fork usually uses upstream/main; a direct clone usually uses origin/main. Never force-reset participant work. Confirm pairs/<pair>/index.html exists before practice.

The older Prepare pair handout Actions workflow remains available as an alternative for distributing the canonical starter. Use one handout route only.

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
