# Build together: Is HTML the new English?

## Presentation flow
1. Cover; the desktop is hidden.
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

## Real presenter workspace
Run `npm run build` then `npm run present` in the repository. Open http://127.0.0.1:8768/ . GitHub CLI must be signed in with the facilitator account. The public site links to this local workspace; it never receives GitHub credentials. Public visitors can read the published files but cannot run repository mutations.

The chat uses prepared code rather than calling an LLM. Its file operations are real: the first three Run clicks write workshop/live/index.html in an isolated Git worktree created from origin/main. The fourth copies it to workshop/starter/index.html and the five pairs, validates, commits, pushes a branch, opens a PR, waits for the required check, and merges. Existing pair index.html files are never overwritten. GitHub Pages deploys automatically after the merge.

After the handout is merged, the local viewer follows main and fetches updates periodically. The public viewer loads its published snapshot periodically. Closing or reopening a window does not delete or reset files. There is no reset/refresh/status furniture in the folder.

## Desktop interaction
Double-click the folder or browser icon to open its window; close with ×. Double-click HTML files to preview them. Markdown files open as readable text. On touch devices, tap instead; keyboard Enter also opens icons/files. Drag title bars within the right-side desktop, or focus a title bar and use arrow keys. Windows can coexist. Small screens stack them below the active chapter.

The path bar explicitly scopes the view to pairs/ or workshop/live/. The file viewer never claims to show the whole repository. A subtle View on GitHub link remains.

## Source and validation
See workshop/FACILITATOR.md for instructions. The local service is scripts/presenter-server.mjs; Git operations are scripts/presenter-workspace.mjs. It binds to loopback only, rejects other hosts/origins, and requires a per-process session token for mutations. Commands have fixed argument lists; the browser cannot send arbitrary shell commands or file paths to write.

The database table is a browser-memory teaching example, not a connected database. The earlier presentation is preserved under versions/2026-09-22-before-pair-workshop/ and in Git history.
