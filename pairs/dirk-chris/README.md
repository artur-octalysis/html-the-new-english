# Dirk & Chris — Every move counts

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
Edit only `pairs/dirk-chris/`. The presenter will distribute `index.html` here after the live build. Pull the merged handout before starting. Open that file in your browser and AI editor.

## Shared protocol
Read this brief before editing. Make a branch named `pair/dirk-chris`. Keep the app self-contained. Explain the proposed change; inspect the diff; test before submitting a pull request to the original repository's main branch. Do not edit other pairs or shared infrastructure.

## Acceptance checks
- A valid activity adds exactly one row and updates the total.
- Empty, negative, or invalid minutes cannot be logged.
- Feedback is understandable and encouraging.
- The screen works at mobile width with keyboard controls.
- No secrets, external services, or real personal data.

## Handoff — complete before submitting
- Motivation hypothesis: For busy adults getting back into fitness, the main barrier is that it feels like too much of a time or energy commitment. We focused on Core Drive 6 — reducing that fear of not having enough time — by making fitness feel easy and flexible. No gym required: you can do it at home, in the park, or wherever you are. We used tiny, customizable quests — small bodyweight activities and habit-sized goals — so returning to movement feels achievable. It's the gym in your pocket: anywhere can be your gym.
- What changed: Added a prominent "⚡ Quick log: 2-min anywhere move" button as the primary action, reusing the existing activity-logging logic (same activities list, totals, and feedback row). Moved the walk/run form behind a native collapsible "Log another activity" disclosure so the interface reads simpler and it's unambiguous the quick-quest is a button, not a static feedback block — first-round feedback was that the earlier orange version was unclear ("is it a button? is it a feedback mechanic?") and cluttered. Added a daily goal + progress bar (20-minute default) so users can see how close they are to a manageable target. Kept the "minutes / activities" stat tiles exactly as before per direct feedback ("I liked it as your 18 minutes and 5 activities").
- Known limitation: The daily goal (20 minutes) is fixed, not user-configurable. Nothing persists across a page reload — no accounts/storage, per the brief's constraints. There's no visual distinction yet between a quick-quest entry and a full walk/run session in the activity list.
- Next step: Test whether a user-adjustable daily goal changes perceived achievability more than the fixed default, and consider persisting today's log (e.g. localStorage) so a returning user sees their progress carry across a session.
