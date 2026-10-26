---
name: plan
description: Use when a request is vague enough that guessing wrong would be expensive, when starting or resuming tracked work, or when the user mentions plan, goal, questions, or a notebook of findings. Two tools, one loop ask → answer → goal → save, plus note. For an expensive, fuzzy design, hand the interview to the grill skill.
---

# Plan Loop

Ask → answer → goal → save. The tool holds the order, so a confident-sounding
plan cannot skip the questions:

- `plan` `goal` is **refused while a question is open**
- `plan` `save` is **refused until a goal exists**

If a gate refuses you, that is the answer: go back and ask, do not rephrase.

## 1. Ask in small rounds

Say what you would do if forced to guess, then ask the questions whose answer
would change the work. Two or three at a time, not ten. Each question gets your
recommendation and what breaks if it is wrong, so "yes" is enough of a reply.

If the plan is expensive and still fuzzy, load `grill`: it maps the decisions as
a tree and asks one frontier round at a time. If the user asks for one question
at a time, or is reading in a second language, do that.

Facts are yours to find (read, grep, prior plans, `git log`); only decisions go
to the user. While questions are open: no edits, no code, no confident plan.

`plan` `ask` with the questions. When the reply comes, `plan` `answer` with one
answer per question, in order. A partial answer leaves the rest open — asking
again is cheaper than guessing once.

## 2. Set the goal only when nothing is open

Before `goal`, ask: "Anything still assumed?" If yes, it is a question. Then
`plan` `goal` in one sentence: the observable state that means this is over.
Not the activity ("fix the save path"), the outcome ("what is in the buffer is
what is on disk, byte for byte"). If you cannot name how you would check it,
the goal is still a wish — go back and ask.

## 3. Plan the route, not the steps

`plan` `save`:

```markdown
# Goal
<the sentence from above>

## Oracle
<how you will know, as you would actually do it: the command you run, the page
you load, the log line you read. If it already shows the right thing, either the
work is done or the oracle is wrong>

## Route
<inspect → reproduce → locate → fix → check, only as much as the problem needs>

## Non-goals
<what to leave untouched>

## Decisions
<only choices that are expensive to reverse; one line each, with the reason.
Everything else stays in the notebook>

## Assumptions
<cheap-to-reverse guesses; never decisions that were refused above>
```

For a bug, the route is a trace, not a guess: reproduce, then `git log` /
`git bisect` / `git blame` until one commit or one line explains the symptom.
Say what you ruled out and how.

### Shape

- The title is 2–10 words. A title that needs a paragraph is a route, not a plan.
- Five or more steps: group them into named phases, each checkable on its own.
- `## Oracle` is something you can **run or look at**, not an intention.
  "Check the logs" is not an oracle; `node app.js --replay race.jsonl` is.
- No questions at the end. If something is still unknown, it was a question and
  you skipped step 1 — ask it now and come back.

`plan` `read` also reports two things about the file on disk:

- `edited: true` — the user changed the plan by hand. Read what is there and
  keep it. `save` returns `overwrote: true` when you replaced it, and that means
  you threw away their work.
- `stale: true` — the plan belongs to an earlier goal. Re-plan; do not build
  yesterday's route under today's goal, and do not rewrite the old plan to match
  the code.

Before implementation, run `review-plan` when the plan is expensive or the route
is non-trivial. It reads the plan and the notebook; it does not rewrite either.

## 4. Keep the notebook

`note` writes one finding and returns only `{ path, notes }`. The point is that
the fact leaves your context without being lost.

Write one the moment you have it, not at the end:

- a path that exists, an endpoint that answers, a version string, an error
- a dead end: what you tried and what ruled it out
- a decision and its reason, so it is not re-litigated

Two honesty rules:

- **observed vs inferred.** Mark `observed` only if you saw it in this session.
  Everything else is `inferred` and has to be labelled that way.
- **re-checkable.** A note that cannot be checked again is a story. Name the
  file, the command, or the URL.

A resolved term or a durable decision goes in `note` as `decision`, with its
reason. When a decision is hard to reverse, surprising without context, and a
real trade-off, add it to `## Decisions` in the plan instead of leaving it in
the notebook.

`plan` `read` returns the plan and the notebook together, so a resumed session
starts from what was learned instead of re-deriving it.

## 5. Close the loop

When the oracle holds, `note` what it printed and the one thing that surprised
you. If a decision changed during the work, record the decision; never rewrite
the plan to match the code.

## Rules

- Report what ran and what it printed. Confidence is not evidence.
- Do not report more than you last saw.
- When stuck: stop adding code. Note what you ruled out, then ask the user one
  question with your recommendation attached.
