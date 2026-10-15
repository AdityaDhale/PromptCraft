---
doc: spec
status: approved
---

# PromptCraft — Technical Spec

## How This Works, In Plain Language
PromptCraft is a client-side developer workbench for prompt engineers and AI creators. It allows users to write or modify two prompt variations (Variant A and Variant B) side-by-side, bind test scenario variables (`{{input}}`), and execute both against simulated or live AI models.

When execution finishes, PromptCraft's client-side diff engine computes word-level additions and subtractions, while an automated scoring module analyzes clarity, conciseness, and constraint adherence. Everything runs in the browser with zero required backend dependencies, ensuring that anyone judging the project or reviewing the demo video can run it instantly without API key friction or billing setup.

## The Core Journey Through the System
1. **User inputs/selects prompts:** React component state holds `promptA`, `promptB`, and the active `scenario`.
2. **User clicks "Run Benchmark":** The `runner.js` service intercepts the request, merges `{{input}}` into both prompt templates, and fires two parallel promises (either to the realistic offline simulation engine or to the Gemini API endpoint if an API key is configured).
3. **Responses return:** Output text strings are passed to `diffEngine.js` which computes word-by-word token diffs using a Longest Common Subsequence (LCS) algorithm.
4. **Metrics Evaluated:** `evaluator.js` calculates Clarity, Conciseness, and Instruction Adherence scores.
5. **UI Updates:** React renders the side-by-side cards, highlights diff tokens in green and red, and updates the comparative scorecards with winner badges.

PRD ref: `prd.md > The Core Journey`.

## Stack
- **Framework & Build:** React 18 + Vite (ultra-fast HMR, lightweight bundle, zero server configuration needed).
- **Styling:** Tailwind CSS (utility-first styling for dark-mode developer workbench aesthetic).
- **Icons:** Lucide React (clean, consistent icons for run, diff, copy, export, settings).
- **Diff Computation:** Lightweight custom word/token diff engine (LCS based, zero heavy external binary dependencies).
- **Markdown Rendering:** Lightweight inline Markdown renderer for rendering AI outputs with code syntax blocks.
- **Storage:** Web `localStorage` for persisting prompt drafts, custom test cases, and API keys locally and securely.

## Where It Runs and How Someone Tries It
- **Runtime:** Browser (Chrome, Firefox, Edge, Safari).
- **Local Dev Server:** Node.js (v18+).
- **Start Command:**
  ```bash
  npm install
  npm run dev
  ```
- **Demo Recording Flow:** Open `http://localhost:5173/`, select a preset, click "Run Benchmark", show side-by-side responses, toggle the Visual Diff tab, show the Scorecard metrics, and copy the Markdown export report. All demonstrable in under 90 seconds.

## Look and Feel
- **Theme:** Developer dark mode inspired by Linear and Vercel.
- **Color Palette:**
  - Background: Slate 950 (`#030712`) / Slate 900 (`#0f172a`)
  - Borders: Slate 800 (`#1e293b`)
  - Accent / Primary: Indigo 500 (`#6366f1`) and Cyan 500 (`#06b6d4`)
  - Diff additions: Emerald green (`#10b981`)
  - Diff deletions: Rose red (`#f43f5e`)
- **Typography:** Inter for UI elements, JetBrains Mono / monospace font for prompt text areas, variables, and diff highlights.

## Components

### 1. `Header.jsx`
- Displays PromptCraft branding, active mode status pill (`Simulation Mode` vs `Live API Mode`), preset selector dropdown, global **Run Benchmark** button, and **Export Report** button.
- PRD ref: `prd.md > Screens and Layout (Top Navigation Bar)`.

### 2. `PromptEditor.jsx`
- Dual-column text editor for Variant A and Variant B.
- Shows live token count badge, copy button, and highlights `{{input}}` tags.
- PRD ref: `prd.md > Features and Behavior (Prompt Editor)`.

### 3. `ScenarioSelector.jsx`
- Horizontal tab strip with built-in test scenarios (e.g. "Customer Complaint", "Code Review Request", "Summarization Edge Case") plus an interactive "Custom Input" editor.
- PRD ref: `prd.md > Screens and Layout (Scenario Matrix)`.

### 4. `ResultsDeck.jsx`
- Tabbed bottom panel:
  - **Side-by-Side:** Shows formatted responses with word count, token count, and latency badges.
  - **Visual Diff:** Unified and Split diff view highlighting additions and deletions.
  - **Scorecard / Metrics:** Comparative quality bars for Clarity, Conciseness, and Adherence with a designated winner banner.
- PRD ref: `prd.md > Features and Behavior (Visual Diff Engine & Scorecard)`.

### 5. `SettingsModal.jsx`
- Allows user to switch between Fast Offline Simulation and Live Google Gemini / OpenAI API execution by inputting their own key.

## Data Model

```typescript
interface Scenario {
  id: string;
  name: string;
  description: string;
  input: string;
}

interface BenchmarkResult {
  variantA: {
    prompt: string;
    output: string;
    tokens: number;
    latencyMs: number;
    scores: {
      clarity: number;       // 0 - 100
      conciseness: number;   // 0 - 100
      adherence: number;     // 0 - 100
      composite: number;     // 0 - 100
    };
  };
  variantB: {
    prompt: string;
    output: string;
    tokens: number;
    latencyMs: number;
    scores: {
      clarity: number;
      conciseness: number;
      adherence: number;
      composite: number;
    };
  };
  diff: Array<{
    type: 'added' | 'removed' | 'common';
    value: string;
  }>;
  winner: 'variantA' | 'variantB' | 'tie';
}
```

## File Structure

```
buildai/
├── devpost/
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   ├── spec.md
│   ├── checklist.md
│   └── app-map.html
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── PromptEditor.jsx
│   │   ├── ScenarioSelector.jsx
│   │   ├── ResultsDeck.jsx
│   │   ├── Scorecard.jsx
│   │   ├── DiffViewer.jsx
│   │   └── SettingsModal.jsx
│   ├── services/
│   │   ├── diffEngine.js
│   │   ├── evaluator.js
│   │   └── runner.js
│   ├── data/
│   │   └── presets.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
├── scope.md
├── prd.md
└── spec.md
```

## External Services and Dependencies
- **No external server required.**
- **Default Execution:** 100% local realistic simulation engine with real-world prompt benchmark responses.
- **Optional External API:** Direct HTTPS client fetch to Google Gemini API (`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`) if the user chooses to input an API key in settings.

## Important Failure Modes
1. **Empty Prompt Text:** If user clicks Run with empty prompt fields, an inline warning banner highlights the missing field instead of running.
2. **Missing `{{input}}` Tag:** If prompt lacks variable placeholders, the system warns that the test scenario input will be appended to the prompt body automatically.
3. **Invalid or Expired API Key (in Live Mode):** Caught cleanly with toast error message, offering 1-click fallback to Simulation Mode.

## What Was Simplified and Why
- **Browser-local execution instead of a Dockerized Python backend:** Keeps the repo 100% clone-and-run ready with `npm run dev`, eliminating Python environment/venv headaches for judges and viewers.
- **Custom LCS client diff algorithm instead of heavy backend diff binaries:** Executes in sub-millisecond time directly in browser JavaScript.
