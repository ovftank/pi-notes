# pi-notes

**A pause button for pi.**

```bash
pi install git:github.com/ovftank/pi-notes
```

<p align="center">
  <a href="media/showcase.mp4">
    <img src="media/showcase.gif" alt="pi-notes demo" width="100%">
  </a>
</p>

## Why

pi is a **minimal coding agent**. It is fast, and it does **what I typed**.

A prompt is a **direction**, not a **specification**. The agent fills the gaps with confident guesses.

One morning I woke up, typed a brainrot prompt:

> "add realtime chat to my Vercel app"

Then I went to make coffee. While I was gone, pi researched Vercel, assumed "serverless means no Socket.IO", and then coded, deployed, tested, and fixed the whole thing by itself. It came back with a pile of fucking stupid dog-shit workarounds: **gRPC**, **Supabase**, and **Redis** — and it was wrong as fuck.

But the correct way is a **single small backend** running Socket.IO. One process, one dependency. The agent never fucking asked.

**It solved the prompt. It didn't solve my problem.**

> I don't want another methodology. I don't want a 40-step workflow. I want a pause button.

So I built **pi-notes**.

## Honest limits

- **It won't make a bad goal good.** It makes a missing goal impossible to hide.
- **It won't run the oracle.** The plan says how you'll know; you still have to
  look.
- **It won't replace a process.** It is the pause before one.
- **It won't stop a model from writing code.** The gate is on the plan, not on
  the editor. It makes the shortcut visible, not impossible.
