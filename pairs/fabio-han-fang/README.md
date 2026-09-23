# Fabio & Han-fang — Every move counts

## Your challenge
Help a busy adult returning to movement log a walk or run and feel encouraged to return. Build one complete action → feedback interaction. You have 12 minutes. One person drives; one tests and challenges the motivation hypothesis. Swap halfway.

## Fitness tracker context
Our fictional app helps people build a sustainable movement habit. Start with one screen: activity type, minutes, a log button, and visible progress. Use fictional activities; no accounts or real health data. Avoid shame or punitive streaks.

## Audience — workshop hypothesis
Our primary audience is **busy adults returning to movement** after an inconsistent routine. They want to feel more active, but work, family responsibilities, and low confidence can make restarting difficult. A short walk or run should feel worthwhile, even when they cannot exercise every day.

- **What they need:** a quick way to log an activity, a manageable next step, and reassuring evidence that small efforts count.
- **What may motivate them:** achievable goals, visible personal progress, and encouraging feedback. Treat these as hypotheses to explore through your chosen Core Drive.
- **What can discourage them:** complicated tracking, comparison with highly active people, and losing all progress after missing a day.
- **Secondary audience:** progress seekers who already move occasionally and want to see their consistency improve over time.

Design primarily for the busy returner. These are fictional audience assumptions for the exercise, not findings from user research.

## Business metrics — workshop hypotheses
- First-week activation: increase the share of new users logging their first 10-minute activity from 40% to 60%.
- Week-four retention: increase the share of a signup cohort still logging an activity in week four from 30% to 40%.
These are illustrative targets, not measured client results. Our prototype tests the interaction, not these business outcomes.

## Desired action and feedback
Choose a walk or run, enter valid minutes, and log it. Confirm the activity, update totals, and encourage a next achievable step. Pick one Core Drive hypothesis and explain why it fits this audience.

## Your workspace
Edit only `pairs/fabio-han-fang/`. The presenter will distribute `index.html` here after the live build. Pull the merged handout before starting. Open that file in your browser and AI editor.

## Shared protocol
Read this brief before editing. Make a branch named `pair/fabio-han-fang`. Keep the app self-contained. Explain the proposed change; inspect the diff; test before submitting a pull request to the original repository's main branch. Do not edit other pairs or shared infrastructure.

## Acceptance checks
- A valid activity adds exactly one row and updates the total.
- Empty, negative, or invalid minutes cannot be logged.
- Feedback is understandable and encouraging.
- The screen works at mobile width with keyboard controls.
- No secrets, external services, or real personal data.

## Handoff — complete before submitting
- Motivation hypothesis: Core Drive 5 (Social Influence & Relatedness), used as company rather than comparison. Busy adults returning to movement stick with it when they don't feel alone, so a fictional walking buddy, Sam, who is also getting back into it, cheers each log. There is no leaderboard or ranking.
- What changed: Added the Sam buddy card. After each valid log, Sam cheers ("You're back!" on the first log, then "I'm right here with you") and suggests a manageable next walk together (5–20 minutes). Pressing Enter now logs an activity, keyboard focus is clearly visible, and invalid minutes show a gentle message instead of failing silently.
- Known limitation: Sam is scripted. The messages don't react to missed days, and nothing is saved after a page refresh.
- Next step: Test whether a fictional buddy feels like real company, or whether inviting a real friend works better.
