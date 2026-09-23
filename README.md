# One Repo. Many Minds.

An interactive presentation and shared prototype gallery for The Octalysis Group. HTML, CSS, JavaScript, AI workflows, and practical ways to build on each other's work.

- **Presentation:** https://artur-octalysis.github.io/tog-learning/
- **Prototype gallery:** https://artur-octalysis.github.io/tog-learning/gallery.html
- **Contribute:** [CONTRIBUTING.md](CONTRIBUTING.md)

## Present

Scroll or use left/right arrow keys. Connect with pair-specific AI prompts or terminal commands. A desktop-style folder and browser coexist on the right. The Build Together chat creates HTML, adds CSS and JS, then copies the real screen to each pair and publishes it. The next chapter teaches how to sync the local pair branch with main.

For real file creation and publishing, Artur signs in with GitHub from the public presentation’s navigation bar. A dedicated GitHub App and hosted service commit the draft and publish the handout. Other visitors can read the published files. Chat code is prepared; Git operations are real. See [PRESENTATION.md](PRESENTATION.md) and [the facilitator guide](workshop/FACILITATOR.md).

## The shared workflow

Build a prototype → contribute a folder through a pull request → validate and review → merge → automatic publishing → present from the gallery.

Contributors can use their own AI tool and submit from a GitHub fork; no shared account or write permission is needed. The facilitator reviews and merges. No direct website upload or account creation is required.

## Repository structure

```text
site/                   Presentation, gallery, and shared assets
site/project/           Canonical project decisions and dependency metadata
project/                AI context and review instructions
pairs/                  Five pair folders with real briefs and eventual index.html
workshop/               Pair registry, canonical live starter and facilitator guide
prototypes/             Existing prototypes and handoff notes
  example/              Clearly labeled facilitator example
templates/prototype/    Copyable starter files
versions/               Complete archived presentations
site/downloads/         Editable fitness starter
scripts/                Dependency-free build and checks
.github/workflows/      Pull request checks and GitHub Pages deployment
```

Pair folders start with `README.md`; their `index.html` is distributed during the session. Legacy folders under prototypes/ need `index.html`, `prototype.json`, and `README.md`. The build automatically generates the gallery manifest. `dist/` is generated and not committed.

## Facilitator preparation

1. Share the live presentation, gallery, and contribution guide.
2. Have one driver per pair complete the AI setup prompt and browser sign-in.
3. Confirm the five named folders in pairs/ and rehearse the handout workflow.
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

GitHub Pages serves the public static site. Real repository writes run through the hosted service using the presenter’s GitHub App authorization. The activity database remains an in-memory teaching demonstration.
