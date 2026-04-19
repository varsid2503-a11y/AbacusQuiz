## Plan: Refine Abacus Quiz App

TL;DR - Polish the existing React + Tailwind app into a more professional quiz experience by improving game structure, visual clarity, scoring, accessibility, and component organization while preserving the core cyber-zen visual theme.

**Steps**
1. Split the large `src/App.tsx` into focused components for maintainability.
   - Extract `Header`, `StartPanel`, `QuizPane`, `TutorialPanel`, `GameOverPanel`, and `Sidebar` components.
   - Keep state management in `App.tsx` and pass handlers/props down.
2. Add a real abacus visualization and stronger visual feedback.
   - Build an `AbacusBoard` component showing rods, upper/lower beads, and current answer progress.
   - Add correct/error state effects like glow pulses and shake animations.
3. Improve quiz logic and scoring.
   - Separate `playing`, `practice`, and `tutorial` modes more clearly.
   - Add streak tracking, multipliers, and a clearer score breakdown.
   - Refine the `generateProblem` engine with predictable difficulty and fallback validation.
4. Polish UX and workflows.
   - Add a professional landing panel with clear module descriptions and a compact level selector.
   - Create a better result summary screen with performance metrics and next-step guidance.
   - Improve responsive layout so the app works cleanly on mobile and desktop.
   - Add keyboard navigation hints and accessible button labels.
5. Clean up styles and theme usage.
   - Move repeated Tailwind utility patterns into CSS classes in `src/index.css`.
   - Ensure color tokens are used consistently and improve text contrast.
6. Audit AI features and optional integrations.
   - Keep or optionally disable `generateFavicon`/`generateBGM` depending on environment support.
   - Avoid runtime failures when the Gemini API key is unavailable.
7. Validate persistence and high-score behavior.
   - Ensure user name and scoreboard persist correctly and do not overwrite bad values.
   - Cap high scores and add level-specific leaderboards.

**Relevant files**
- `src/App.tsx` — primary state management and UI flow.
- `src/index.css` — Tailwind theme variables and utility classes.
- `src/lib/math.ts` — problem generator and difficulty rules.
- `src/lib/sounds.ts` — sound playback utility.
- `src/lib/ai.ts` — favicon and BGM generation.
- `src/lib/tutorials.ts` — tutorial content.

**Verification**
1. Run `npm run dev` and manually verify each mode: start, practice, tutorial, playing, game over.
2. Confirm the timer works correctly for each difficulty and that `timeLeft === 0` leads to game over.
3. Test input via numpad, keyboard digits, Backspace, and Enter.
4. Check `localStorage` values for `zen_abacus_scores` and `zen_abacus_name` after a session.
5. Run `npm run lint` to catch TypeScript issues.

**Decisions**
- Keep the current cyber-zen design and enhance it rather than replace it.
- Preserve AI-enabled favicon/BGM as optional features; do not make them mandatory for core functionality.
- Focus on making the quiz more professional through structure, performance, and UX rather than adding unrelated new game modes.

**Further Considerations**
1. Should the app include a dedicated “practice analytics” summary (accuracy, average response time)?
Ans: Yes, a post-practice summary with performance metrics would provide valuable feedback and encourage improvement.
2. Do you want a true abacus bead interaction or a visual-only representation with answer input via numpad?
Ans: A visual-only representation with numpad input is sufficient for now, as it keeps the focus on mental calculation rather than physical manipulation.
3. Should the app support more levels or adaptive difficulty once the core refinement is complete?
Ans: Potentially, but it’s best to first polish the existing levels and ensure a smooth experience before adding more complexity. Adaptive difficulty could be a future enhancement based on user performance data.

## My improvements which you can implement:
🛠️ 1. Fix the "Blank Screen" (Vite Configuration)Since your GitHub URL is .../kite-graph-viewer/, Vite thinks your files are at the root, but they are actually in a sub-folder.The Fix: Open your vite.config.ts (or .js) file and add the base property:JavaScriptexport default defineConfig({
  base: '/kite-graph-viewer/', // This MUST match your repo name
  plugins: [react()],
})
Why? This tells the browser to look for style.css and script.js inside your project folder instead of the "front door" of the server.🧮 2. Upgrade the Abacus Logic (Big/Small Friends)Your README.md mentions "Partner Rules." To make this a true training tool, the problem generator in math.ts should specifically target these:Small Friends (+5): Create problems that force the use of the 5-bead (e.g., $2 + 3$).Big Friends (+10): Create problems that force a carry-over (e.g., $7 + 4$).Visual Hint: When a user gets stuck, show a small neon "Hint" text like: +4 = +5 - 1.🎨 3. UI/UX "Cyber-Zen" PolishThe fcfd62.png screenshot shows a squashed layout. Improve the "3-column architecture" mentioned in your plan:Center the Focus: The problem (e.g., $12 + 5$) should be the biggest thing on the screen in a glowing neon font.Responsive Numpad: On mobile, the buttons should be large circles. On desktop, they should shrink to allow the AbacusBoard component to be larger.The "Pulse": When an answer is correct, don't just change the number—make the whole screen border flash a soft neon green.🚀 4. PWA & InstallationSince you want this to be a professional platform, ensure your sw.js (Service Worker) is actually registered in your main.tsx:JavaScriptif ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/kite-graph-viewer/sw.js');
  });
}
This allows you to open the app on your phone even when you are at school without Wi-Fi.📝 Final Action Plan for your TerminalOnce you update the base in your Vite config, run these commands to see the website correctly:Bash# 1. Build the project
npm run build

# 2. If you are using 'gh-pages' package:
npm run deploy

# 3. If pushing manually, ensure the 'dist' folder contents 
# go to the root of your 'main' or 'gh-pages' branch.