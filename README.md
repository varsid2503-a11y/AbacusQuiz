# 🧘 ZenAbacus: Cyber-Zen Mental Math

ZenAbacus is a professional, multi-sensory mental math training platform designed to bridge traditional abacus techniques with modern high-performance cognitive training. Inspired by the "Cyber-Zen" aesthetic, it combines rigorous mathematical logic with AI-generated atmospheric elements.

## 🚀 Core Functionality

### 1. Mathematical Logic Engine (`math.ts`)
The heart of the app is a modular generator that follows standard abacus pedagogical levels:

*   **Level 01 (Apprentice):** Focuses on simple 1-digit addition and subtraction. It ensures no "carries" or complex rotations are required, allowing users to build foundational bead-position memory.
*   **Level 02 (Adept):** High-level training for **Partner Rules**. 
    *   **Small Friends:** Solves additions where beads on a rod are insufficient but the '5' bead is available (e.g., `+4 = +5 - 1`).
    *   **Big Friends:** Handles carries to the next rod using base-10 complements (e.g., `+9 = +10 - 1`).
*   **Level 03 (Master):** Advances to **2-digit by 1-digit multiplication**, pushing the limits of mental visualization and high-throughput calculation.

### 2. Operational Protocols (Game Modes)
*   **Speed Trial:** A high-stakes, ranked mode with level-specific timers (20s for Apprentice, 40s for Adept, and configurable 60s+ for Master). Results are logged in the global leaderboard.
*   **Practice Mode:** A "Zen" focused environment with no timers or scoring. It features a "breathing" neon HUD to encourage deep focus and mastery without pressure.

---

## 🎨 Design & Interaction

### Artistic Flair Theme
The UI uses a **3-column architecture** on desktop:
*   **Tactile Feedback:** Includes haptic vibrations for errors and a "pulse correct" visual confirmation.
*   **HUD Interface:** A dark navy foundation (`#0a0b1e`) with neon teal (`#64d2ff`) and purple (`#bf5af2`) accents. 
*   **Numpad:** A large, circular input system optimized for high-speed mobile input and physical keyboard support for desktop operators.

### AI Integration (`ai.ts`)
ZenAbacus utilizes **Gemini AI** to create a unique sensory environment for every session:
*   **Atmospheric Music:** Uses `lyria-3-clip-preview` to generate custom 30-second lo-fi "Zen" tracks that aid concentration.
*   **Dynamic Identity:** Uses `gemini-2.5-flash-image` to generate a high-tech abacus favicon on-the-fly, ensuring the app's visual identity is as smart as its users.

---

## 🛠️ Technical Implementation

### Stack
*   **Frontend:** React 18+ with Vite for rapid module reloading.
*   **Animation:** `motion/react` for fluid state transitions and `AnimatePresence` for problem-swapping.
*   **Audio:** `howler.js` for zero-latency UI sound effects (clicks, correct, triumph).
*   **Styling:** Tailwind CSS with custom thematic variables in `index.css`.

### PWA Readiness
ZenAbacus is built to be a standalone tool:
*   **Offline Mode:** Service worker (`sw.js`) caches all assets for training without a network.
*   **Installable:** Full `manifest.json` support for usage as a full-screen mobile app.

---

## 📈 System Calibration (Development)

1.  **Clone & Install:** `npm install`
2.  **AI Config:** Ensure `GEMINI_API_KEY` is set for BGM and Favicon generation.
3.  **Launch:** `npm run dev`
4.  **Calibrate:** Use the Master Trial slider to adjust your focus duration.

*ZenAbacus Core v1.0.4 — Master your mind, bead by bead.*
