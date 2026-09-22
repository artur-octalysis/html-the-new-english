# Join the fitness workshop

Select your pair on the presentation's Connect chapter. Copy its prompt into a local Codex or Claude Code session with terminal access. It checks Git/GitHub CLI, guides browser sign-in, clones this repository and creates a pair branch. You complete authentication yourself.

## Work in your pair folder
- pairs/dirk-chris/
- pairs/fabio-han-fang/
- pairs/ivan-joris/
- pairs/myrte-rob/
- pairs/sergio-yu-kai/

Read your README.md first. Wait for the presenter to distribute index.html, then fetch the original repository's main and merge it into your pair branch. Your AI should inspect remotes and local changes before syncing. Cloning does not grant push permission: contributors without write access use a personal fork, with the original repository as upstream.

Build only within your pair folder. Use one driver to submit the work. Test valid and invalid activity entries, mobile width, keyboard controls and feedback. Update your README with the motivation hypothesis, changes, checks and limitations. Inspect the diff, commit, push your branch and open a PR against artur-octalysis/html-the-new-english main. The facilitator reviews and merges; Pages publishes after successful validation. Never force-push main.

## Prototype constraints
All source and published files are public. Use fictional data and no secrets. Prefer a self-contained index.html, with relative paths for extra assets. The gallery uses a sandboxed iframe: storage and external services may be unavailable. Keep interactions in memory for the workshop. Only standard web assets are accepted; no hidden files, symlinks or executables. Maximum 5 MB per file and 25 MB per pair folder.

## Preview the workshop site
With Node.js 22+ and Python:

```sh
npm test
npm run build
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000/ . Do not edit dist; it is generated. Older prototypes under prototypes/ continue using their existing prototype.json metadata.
