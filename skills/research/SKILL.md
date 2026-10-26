---
name: research
description: Use when the job is to find something out before deciding anything — a codebase, an API, a protocol, a product behaviour, a paper, a bug's history, a competitor, a config — or when what you learn would otherwise flood the context.
---

# Research, then decide

Anything that is not yet a task: you do not know enough to write a goal, and
writing one anyway is how the work goes wrong. The output of this phase is not
prose in the transcript, it is a notebook of findings on disk.

Works for any subject. Reading a repo, running a program, watching traffic,
reading docs, asking a person — the medium changes, the loop does not.

## Diverge, then converge

If the decision is not yet a choice between real options, diverge: list the
options, constraints, and killed ideas. Note them. Do not write a plan while the
option space is open; that is an assumption with formatting. Converge when the
notebook can answer the decision, then put the choices to the user.

## 1. Name the decision

Research without a decision behind it never ends. Say what will be different
once you know: which approach you pick, whether to build at all, which file to
touch. If the answer would not change anything, you are reading for comfort.

If the decision depends on the user's constraints (scope, budget, what "good
enough" means), ask now — `plan` `ask`, one round, with your recommendation
attached, then `plan` `answer` when the reply comes. Do not ask what you can
find out yourself; do ask what only they can decide.

## 2. Pick the medium the environment has

Whatever gets you primary evidence cheapest: read the source, run the thing and
watch it, read the log it already writes, read the docs, search, ask someone
who knows. Do not assume a tool from another machine or another day exists
here; do not install something to prove a point.

Two rules that keep this honest:

- **Observed vs inferred.** Mark which one each finding is. A conclusion from
  reading code is an inference; a value you saw printed is observed.
- **Re-checkable.** Every finding keeps a pointer: a path, a URL, a command, a
  line number, a query. A finding you cannot re-open is a rumour.

## 3. Note each finding the moment you have it

`note` with a `kind` you make up as you go — `fact`, `quote`, `number`, `path`,
`command`, `contradiction`, `doubt`. One line, plus where it came from.

```text
note text="writes are queued in src/store/write.ts, flushed on idle" kind="fact"
→ { "path": ".pi-notes/notes/…md", "notes": 4 }
```

The return is two fields on purpose: the finding leaves the context, the fact
does not. Long output never goes in the notebook — if the evidence is a wall of
text, keep it in a file and note the path plus the one line that matters.

When the transcript gets heavy, compact. `plan` `read` brings the notebook back.
A finding that only exists in your head across a compaction does not exist.

## 4. Checkpoint: turn findings into a decision

Stop researching when the notebook answers the question in step 1 — not when
you run out of interesting things. Then put the real options to the user, each
with its cost and what breaks, and let them choose. That choice is the goal:
`plan` `goal`, then `plan` `save`, with the route written as the findings it
rests on (kinds and paths from the notebook, not prose).

`goal` is refused while a question is open, and `save` is refused without a
goal. If you find yourself rephrasing to get past a gate, you skipped step 1.

## 5. Do the thing, with evidence

When something runs long or runs live, turn its own logging up and keep the raw
stream in a file of its own; read the tail first, the middle when the tail lies.
You cannot attach a debugger to everything, so the log you asked for is the
debugger.

Whatever the `## Oracle` in the plan says, do that and paste what it printed.
Nothing checks this for you — no tool runs the command, no gate compares the
output to the goal. The only thing between "it works" and "I think it works"
is whether you ran it and kept the log.

## 6. Close the loop

On a failure: reproduce from the log, find the first event that should not have
happened, change that one thing, run again, compare the two logs. One change at
a time — two changes hide which one worked.

When it holds: `note` the path to the log and the one line that shows it, then
`note` the one thing that surprised you. That note is what the next session
starts from instead of rediscovering it.

## Anti-patterns

- Research with no decision behind it, ending in a summary nobody asked for.
- A conclusion with no pointer back to where it came from.
- Pasting long output into the conversation instead of the notebook or a log.
- Asking the user a fact you could have looked up.
- Writing the plan from memory after a compaction instead of `plan` `read`.
