# Is HTML the new English?

An interactive presentation and shared prototype gallery for The Octalysis Group. HTML, CSS, JavaScript, AI workflows, and practical ways to build on each other's work.

- **Presentation:** https://artur-octalysis.github.io/html-the-new-english/
- **Prototype gallery:** https://artur-octalysis.github.io/html-the-new-english/gallery.html
- **Contribute:** [CONTRIBUTING.md](CONTRIBUTING.md)

## Present

Scroll or use the left/right arrow keys. Press N to toggle presenter notes. The presentation follows a fitness project through Strategy Dashboard → Brainstorming → P/E Feature list and game loop → Battle Plan (Balancing and Logic) → Wireframes. The live opening creates an empty repository folder, then builds editable business metrics, player axes, and four player profiles with Core Drive controls. Desired actions, feedback, and rewards extend the live strategy. Core Drive brainstorm ideas flow into a Power/Ease table; complete scoring unlocks MVP/V1/V2 planning. Set decisions become downloadable Markdown, JSON, and HTML files. Shared project data connects the later loop, economy model, and floating phone. It includes a downloadable single-file fitness starter, a practice timer, and a simulated repository contribution flow. See [PRESENTATION.md](PRESENTATION.md) for the walkthrough and timing. Presenter notes appear on the same screen, so leave them hidden while screen-sharing unless you want the audience to see them.

## The shared workflow

Build a prototype → contribute a folder through a pull request → validate and review → merge → automatic publishing → present from the gallery.

Contributors can use their own AI tool and submit from a GitHub fork; no shared account or write permission is needed. The facilitator reviews and merges. No direct website upload or account creation is required.

## Repository structure

```text
site/                   Presentation, gallery, and shared assets
site/project/           Canonical project decisions and dependency metadata
project/                AI context and review instructions
prototypes/             Published team prototypes and handoff notes
  example/              Clearly labeled facilitator example
templates/prototype/    Copyable starter files
versions/               Complete archived presentations
site/downloads/         Editable fitness starter
scripts/                Dependency-free build and checks
.github/workflows/      Pull request checks and GitHub Pages deployment
```

Every prototype folder needs `index.html`, `prototype.json`, and `README.md`. The build automatically generates the gallery manifest. `dist/` is generated and not committed.

## Facilitator preparation

1. Share the live presentation, gallery, and contribution guide.
2. Have one person per pair sign in to GitHub and try forking the repository.
3. Assign unique folder names (pair-01, pair-02, etc.).
4. Keep the Pull requests and Actions tabs open during the session.
5. Approve workflow runs from new fork contributors when GitHub requests it, review changes, and merge.
6. Wait for publishing to finish before refreshing the gallery.

Repository infrastructure changes should be reviewed by the maintainer. Prototype code is not executed by the build; it runs only when opened in the gallery's restricted viewer or visited directly.

## Development

Requires Node.js 22+; no dependency installation needed.

```sh
npm test
npm run build
python3 -m http.server 8000 --directory dist
```

GitHub Pages serves a public static site. There is no database, private submission form, or server-side execution.
