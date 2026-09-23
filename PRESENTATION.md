# Build together: Is HTML the new English?

## Presentation flow
1. Cover; the larger desktop icons are visible at the top right.
2. Connect: pair selector and Codex / Claude Code vs Terminal Commands tabs. Both snippets follow the selected pair. Read the pair brief in the folder window.
3. Build together: one chat with four prepared prompts. Run creates HTML, adds CSS, applies JavaScript, then copies the finished file to the five pair folders and publishes.
4. Sync your local branch: copy a pair-specific AI prompt; explain fetch and merge for direct clones and forks.
5. Twelve-minute pair practice.
6. Real conflict exercise.
7. Branch, diff, review and merge visuals.
8. Deployment.
9. Activity table / database explanation.
10. Share prototypes.

Allow 45–60 minutes, including 12 minutes of pair practice and 5 minutes of sharing. Complete GitHub sign-in before the session if possible.

## Hosted presenter workspace
Open the public presentation and use **Sign in with GitHub** in the top navigation. Only the configured presenter, Artur, can perform writes. The GitHub App is installed on this repository only. The backend is https://html-workshop-api.vercel.app/api/workshop.

The chat uses prepared code rather than calling an LLM. The first three Run clicks commit workshop/live/index.html on workshop/hosted-presenter. The fourth copies it into the five pair folders and the canonical starter, opens a pull request, waits for Validate and build on that exact revision, then requests a squash merge. Existing pair index.html files are never overwritten. Pages deploys after merge.

Sign-in uses OAuth with PKCE and a short-lived encrypted session held in browser memory. Reloading requires signing in again; the draft survives in GitHub. Public visitors read the published snapshot. The signed-in viewer follows the working branch, then main after publication. Both refresh files periodically. The gallery lists the live-built screen first, excludes unchanged handout copies, and checks for newly published pair versions every 15 seconds.

For a local fallback, run npm run build and npm run present, then open http://127.0.0.1:8768/. This separate path uses the facilitator’s GitHub CLI session and an isolated temporary worktree.

## Desktop interaction
Double-click the folder or browser icon to open its window; close with ×. Double-click HTML files to preview them. Markdown files open in an independently draggable reader with formatted headings, lists and code. On touch devices, tap instead; keyboard Enter also opens icons/files. Drag title bars within the right-side desktop, or focus a title bar and use arrow keys. Windows can coexist and cover the desktop icons. Small screens stack them below the active chapter.

The path bar explicitly scopes the view to pairs/. The prepared live build remains available through the Browser icon. The file viewer never claims to show the whole repository. A subtle View on GitHub link remains.

## Source and validation
See workshop/FACILITATOR.md for instructions. The hosted handler is api/workshop.js; hosted/github.mjs constrains repository operations. Production secrets live in Vercel environment variables. Run vercel deploy --prod from the linked html-workshop-api project to update the backend; the Pages workflow updates the public frontend. The local service is scripts/presenter-server.mjs; Git operations are scripts/presenter-workspace.mjs. It binds to loopback only, rejects other hosts/origins, and requires a per-process session token for mutations. Commands have fixed argument lists; the browser cannot send arbitrary shell commands or file paths to write.

The database table is a browser-memory teaching example, not a connected database. The earlier presentation is preserved under versions/2026-09-22-before-pair-workshop/ and in Git history.
