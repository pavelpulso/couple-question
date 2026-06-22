# Love Map 💕

**A quiz game that helps couples actually talk to each other.**

How well do you really know your partner? Not their coffee order — their unfulfilled dream, their biggest fear, the worry they carried this week. *Love Map* turns that question into a warm, two-player game you play side by side on one phone.

> 🌐 **Available in English, Español, and Русский.**

---

## Why this exists

Most relationship apps sell you a subscription and a dashboard. This one has a much smaller goal: **get two people to put their phones down and have a real conversation.**

The design is built around the [Gottman Institute's "Love Maps"](https://www.gottman.com/blog/love-maps/) — the research-backed idea that couples who thrive keep a rich, detailed mental map of each other's inner world. Knowing the small things and the deep things. The questions you *can't* answer aren't failures — they're the most valuable part. They show you exactly where the next good conversation is hiding.

That's the whole product. No accounts, no tracking, no upsell. Just 61 questions and the person across from you.

## How it works

1. **Enter your names** and pick a length — a quick 10, a solid 20, or the full deep-dive.
2. **Take turns.** Each round asks how well you know one thing about your partner. They confirm whether you got it right.
3. **Questions are weighted.** "What's my favorite color?" is worth a little. "What's my biggest unfulfilled dream?" is worth a lot.
4. **See your Love Map score** — a friendly split between both partners, with confetti for good measure.
5. **Talk through what you missed.** That's the point. The result screen nudges you there on purpose.

## What's inside

A deliberately small, modern stack — fast to load, nothing to sign up for, works on any phone.

| | |
|---|---|
| **Framework** | Next.js 16 (App Router) + React 19 |
| **Styling** | Tailwind CSS |
| **Motion** | Framer Motion + canvas-confetti |
| **i18n** | Hand-tuned EN / ES / RU question banks |
| **Hosting** | Vercel |

```
app/                 # Routes, layout, global styles
components/
  LandingScreen.js   # Names, language, quiz length
  QuizScreen.js      # Turn-based question flow
  ResultScreen.js    # Weighted scoring + the "go talk" nudge
lib/
  questions.js       # 61 weighted questions, 3 languages
  i18n.js            # UI copy per language
```

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm run start   # production build
```

## Design principles

- **The friction is the feature.** One shared phone, taking turns — that's intentional. It keeps both people present.
- **No score-shaming.** The result is framed as a starting point, never a grade. The lowest scores point to the best conversations.
- **Respect the user.** No login wall, no analytics following you home, no dark patterns. Open the page, play, close it.
- **Small on purpose.** Every dependency earns its place. The whole thing is meant to load instantly and feel light.

## Credits

Question framework inspired by Dr. John & Julie Gottman's research on Love Maps and the *Sound Relationship House*. This is an independent, non-commercial project — not affiliated with or endorsed by the Gottman Institute.

---

*Built to help two people know each other a little better. That's it.* 💌
