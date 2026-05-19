# AbacusLab

Interactive Soroban practice, timed mental-math quizzes, and a progress dashboard.

## Stack

- **Server:** Node.js, Express, MongoDB (optional — in-memory fallback without DB)

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

- API: http://localhost:4000  

Without MongoDB, auth and quiz history use in-memory storage (resets on server restart).

## Features

- **Practice:** 7-rod Soroban with animated beads; Small Friend (+5 − complement) tutorial
- **Quiz:** Server-generated addition/subtraction/mixed; 1–2 digits; per-question countdown
- **Dashboard:** Score trend chart, streaks, high score (requires sign-in)
