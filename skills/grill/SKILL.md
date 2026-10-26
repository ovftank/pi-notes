---
name: grill
description: Use when the user asks to grill, stress-test, sharpen, or challenge a plan, design, or decision, or when a plan is expensive and still fuzzy. Runs a design-tree interview through plan ask/answer — frontier rounds, numbered questions, a recommendation per question, facts from the agent, decisions from the user.
---

# Grill

Do not edit code while the frontier is non-empty.

## Map the tree

Every decision branches into decisions that depend on it. A question whose answer
depends on another open question belongs to a later round.

## Ask a round

The frontier is every question whose prerequisites are settled. Ask the whole
frontier in one round. Number each question; give a recommendation and what
breaks if it is wrong

Wait for the answers. `plan` `ask` records the round; `plan` `answer` closes it.
A partial answer leaves the rest open. Recompute the frontier; ask what the
answers unblocked.

If the user asks for one question at a time, or is reading in a second language,
do that. Do not turn a round into a menu.

## Facts vs decisions

Facts are yours: read the code, run the command, check the docs. Do not ask the
user what you can find. Decisions are theirs: put each to them and wait. Never
answer your own question.

When the user says how something works, check the code. If it disagrees, say so.

## Close

The frontier is empty only when every branch has been visited and nothing is
still assumed. Ask: "Anything still assumed?" Then `plan` `goal`, `plan` `save`.
Shared understanding is the exit condition, not a good feeling.

When a term resolves, `note` it as `decision` with a one-line definition. When a
decision is hard to reverse, surprising without context, and a real trade-off,
add it to `## Decisions` in the plan. Otherwise leave it in the notebook.
