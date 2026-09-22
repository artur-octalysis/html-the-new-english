# Contribute a prototype

The presentation and prototype gallery are one public workshop site. Each merged contribution is published automatically after GitHub Actions completes.

## The challenge
Help a new community member make their first contribution. Choose a Core Drive, state your motivation hypothesis, and build one complete action → feedback interaction. Use fictional content, one screen, and no login.

## Files to contribute
Create a unique folder such as `prototypes/pair-01/` containing:

- `index.html` — your working prototype (embedded CSS and JavaScript are simplest).
- `prototype.json` — title, team, description, and Core Drive.
- `README.md` — purpose, motivation hypothesis, how to run, checks, limitations, and next step.

Copy the files from `templates/prototype/`. Replace their placeholder content. Set `kind` to `team`. Do not edit the gallery or the generated `dist/` directory; the build discovers your folder automatically.

## Browser-only path: no Git setup required

1. Sign in to GitHub and **fork this repository** to your own account. Each pair needs one person to submit.
2. On your fork, use **Add file → Create new file** to create `prototypes/pair-01/prototype.json`. Copy the template metadata, fill it in, and commit.
3. Create `prototypes/pair-01/README.md` the same way.
4. Open your new pair folder, use **Add file → Upload files**, and upload your `index.html` (and any relative local assets). Commit to your fork.
5. From your fork, choose **Contribute → Open pull request**, with `artur-octalysis/html-the-new-english` and `main` as the destination. Fill in the pull request template.
6. Wait for the **Validate and build** check and facilitator review. The facilitator merges accepted work. Contributions from first-time contributors may need the facilitator to approve the workflow run.
7. Wait for **Publish workshop** to succeed, refresh the gallery, and click **Present prototype**.

If you have write access, you can create a branch in the original repository and follow the same pull request flow instead of forking. Repository access is not required to view or present published work.

## Extend another pair's work

After their first version is merged, sync your fork with the upstream main branch. Create a new branch, edit the original pair's folder, and open a pull request explaining what changed and why. Ask the original pair to review. Avoid changing other teams' files or shared infrastructure.

## Run and present

Open your `index.html` locally while building. On the workshop site, the gallery's **Present prototype** button opens a large sandboxed viewer. Use **Mobile width** for a narrow preview, **Restart** to reset the page, and **Close** or **Escape** to return.

## Prototype constraints

- All submitted source and published prototypes are public. No API keys, secrets, client data, or private personal information.
- Prefer self-contained HTML. Local assets must use relative paths.
- The viewer allows JavaScript but blocks pop-ups, form submissions, top-level navigation, and same-origin access. Storage and some external APIs may not work inside it. Keep the workshop interaction local and in memory.
- Use only HTML, CSS, JavaScript, JSON, Markdown, standard image/audio/video, or font files. No executables, hidden files, or symbolic links.
- Maximum 5 MB per file and 25 MB per prototype.
- Automated checks verify files and metadata; a human still reviews behavior and content before merging.

## Local site preview (optional)

With Node.js 22 or newer:

```sh
npm test
npm run build
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000/` for the presentation and `/gallery.html` for prototypes. No npm dependencies are required.
