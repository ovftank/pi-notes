---
name: review-plan
description: Use when the user asks to review, critique, stress-test, or approve a saved plan before implementation, or when a plan is expensive and the route is non-trivial. Reads the plan and notebook, compares a credible alternative route, reviews fit, proof, budget, scope, and risk, and reports findings without editing code or rewriting the plan.
---

# Review a Plan

Review the plan on disk, not the pitch in chat. Start with `plan` `read`.

- No plan: say so. Ask for one. Do not review a plan from memory.
- `stale`: stop. Re-plan; do not review yesterday's route.
- `edited`: review the current text; say it was hand-edited.

If the user points to a prior review, read it first. Mark each prior finding
resolved, open, or regressed. Do not re-litigate an accepted trade-off without
new evidence; do revive it when the evidence is there.

Do not edit code. Do not rewrite the plan. Report findings; the user decides.

## Lenses

Run all six. Keep them separate; overlap is signal, not duplication.

### Fit

- Does the Goal solve the user's problem, not just the prompt?
- Is it observable and bounded?
- Is this the current system, or an earlier one? Git owns history.
- Does the route stay inside the scope? Are the non-goals explicit?
- Is there more than one live route for the same goal? One canonical route.
  Parallel plans are debt, not optionality.
- What is the smallest route that fits? Flag services, abstractions, or steps
  that exist only because the agent got excited.
- Does each abstraction serve a current requirement? No speculative generality.

### Proof

- Is the Oracle a command, page, or log a human can run, not an intention?
- Would it fail if the plan is wrong? If it passes, what does that prove?
- Does the route end at the Oracle?
- A retained check must name: the risk, the behavior, the consumer, an
  observation that can fail, an independent oracle, and why cheaper ordinary
  testing is not enough.
- Is a step only proving a retired implementation detail, a filename, or the
  presence of an artifact? Delete it or replace it with a real check.
- Does the plan rest on **observed** facts from the notebook, or on inferred
  ones? Cite the note. A plan that cites nothing is a plan from memory.
- Is there a verification gap: a behavior the plan changes that no step checks?

### Risk

- What assumption would make this plan wrong? Is it cheap to reverse?
- What breaks on failure: data, auth, permissions, rate limits, concurrency,
  retries, rollback?
- What is the blast radius? Is there a kill switch or a dry run?
- What is the worst realistic failure, and does the plan notice it?

### Budget

- Name the budget before judging the route: code you own, dependencies,
  services, environment variables, latency, infrastructure bill, on-call load,
  review surface, and time to first proof.
- Every new dependency, service, process, or env var is a line item. It is not
  free because the agent does not pay for it.
- What can be deleted and still pass the Oracle? Prefer subtraction.
- Set a patch budget. If the smallest fix needs more files, dependencies, or
  services than the budget allows, stop and re-plan. Do not keep patching.
- "It works" is not done. Done includes no unapproved operational surface.
- Money is one line. Complexity, latency, and on-call are the rest.

### Alternative

- Name at least one credible, executable alternate route. Not a strawman, not
  the current plan with more steps.
- Compare on: goal fit, proof, risk, budget, reversibility, code you own,
  operational surface, and time to first real evidence.
- A **trade-off** is what you pay after it ships: the code you maintain, the
  process you run, the surface you secure, the decision you delay. It is not a
  synonym for downside, and money is only one line.
- **Optimal** means the least code, process, and operational surface that can
  still prove the Goal and survive its risks. Not the fewest files, not the
  cheapest bill.
- If the alternative is better, say so even if it invalidates the plan. If the
  current route is already the smallest that fits, say that too.
- Do not choose a route that writes more code just to avoid one process. Do not
  propose a debt register or a parallel plan to avoid choosing. Choose.

### Adversarial

- What is the strongest reason this plan fails?
- Name the missing fact, the unasked question, the over-engineered path.
- If the plan is clean, say so. Do not invent findings.

## Alternative Route

Before the findings, answer the question in one section:

```markdown
## Alternative

| Route | Better at | Worse at | Reversible? | Verdict |
| ----- | --------- | -------- | ----------- | ------- |
| Current | ... | ... | ... | ... |
| Alternative | ... | ... | ... | ... |
```

Then one recommendation: keep the current route or switch, and why. One real
alternative beats five fake ones. If there is no credible alternative, write
`No credible alternative; the current route is the smallest that fits.` and say
what would have to change to create one.

## Findings

One block per finding. Quote the plan section it comes from.

```markdown
### <short title>

- **Where:** <section or line>
- **Problem:** <what is wrong, in one or two sentences>
- **Fix:** <the smallest change that fixes it>
- **Consequence:** <what ships wrong if ignored>
- **Disconfirming check:** <cheap read-only check that would prove this false>
```

No severity. No score. No ranking. A finding is a claim you can point at. A
finding is blocking only when it leaves the Oracle unable to prove the Goal, or
the route unsafe to run. If there are no findings, write `No findings.`

## Verdict

End with one line:

- `Ready.` — no open questions, no proof gaps, no scope creep, the budget is
  stated when new surface is added, and the alternative section says the current
  route is the right one.
- `Not ready.` — list the blocking findings by title.

Then list **Open questions** only when the plan needs a user decision. Give each
a recommendation and what changes if the user chooses differently. Do not answer
for them.

Close with **Strongest reason not to execute**, one paragraph, even when the
verdict is `Ready.` If the risk is acceptable, say why.

If the user asks to apply a fix, use the `plan` skill: `plan` `read`, edit the
text, `plan` `save`. Re-review only the changed sections.
