---
doc: prd
status: approved
---

# PromptCraft — Product Requirements

An interactive prompt engineering workbench to benchmark, diff, and score AI prompts side-by-side across test scenarios.

Source: `scope.md > The Core Loop` and `scope.md > The POC Boundary`.

## The Core Journey
1. **Arrival & Orientation:** The user opens PromptCraft in the browser. They immediately see an intuitive dual-pane editor preloaded with a sample prompt comparison (Variant A: simple zero-shot prompt vs. Variant B: few-shot structured prompt with markdown constraints).
2. **Select or Customize Scenario:** The user selects a test case from the quick-switch scenario bar (e.g., "Customer Complaint", "Ambiguous Query", "Technical Support Ticket") or types custom input into the scenario editor.
3. **Execute Benchmark:** The user clicks the prominent **"Run Benchmark"** button (or hits `Ctrl+Enter` / `Cmd+Enter`).
4. **Inspect Streaming Results:** The runner executes both variants concurrently. Output cards stream in the generated responses with token counts and elapsed execution time.
5. **Analyze Diff & Scores:** The user toggles the **"Visual Diff"** view to highlight exact word differences between outputs. Below the outputs, a comparative score card rates Clarity (0–100), Conciseness (0–100), and Constraint Adherence.
6. **Iterate or Export:** The user can tweak either prompt and rerun, or click **"Export Report"** to copy markdown summary of the benchmark.

## Screens and Layout
PromptCraft is designed as a single, distraction-free command center:
1. **Top Navigation Bar:**
   - App branding with status pill (`Simulation Mode` vs `Live API Mode`).
   - Preset template selector (Customer Support, Code Review, Summarization, Creative Writing).
   - Global **"Run Benchmark"** action button.
   - Settings button (configure optional Gemini/OpenAI API key or toggle simulated model response speed).
2. **Prompt Workshop (Upper Half):**
   - Left column: **Prompt Variant A** editor with token counter, model badge, and variable placeholder hint (`{{input}}`).
   - Right column: **Prompt Variant B** editor with token counter, model badge, and variable placeholder hint.
3. **Scenario Matrix (Middle Bar):**
   - Active test input selector with preset tabs (Scenario 1, Scenario 2, Scenario 3) and an "Add Custom Input" button.
4. **Evaluation & Diff Deck (Lower Half):**
   - Tab switcher: **Side-by-Side Comparison**, **Unified Text Diff**, and **Metrics Radar**.
   - Output cards displaying response text, markdown rendering, token count, latency, and quality badge.
   - Summary scorecard declaring the winning variant based on composite score.

## Look and Feel
- **Visual Style:** High-precision developer workbench aesthetic (inspired by Linear, Vercel, and GitHub diffs).
- **Color Palette:**
  - Background: Deep slate (`#0B0F19`, `#111827`)
  - Panels/Cards: Muted dark surface (`#1F2937`) with subtle border lines (`#374151`)
  - Accent / Primary: Electric Indigo / Cyan (`#6366F1`, `#06B6D4`)
  - Diff additions: Emerald green tint (`#10B981` / `rgba(16, 185, 129, 0.15)`)
  - Diff deletions: Rose red tint (`#F43F5E` / `rgba(244, 63, 94, 0.15)`)
- **Typography:** Inter or system sans-serif for interface controls; JetBrains Mono / monospace font for prompt editors and diff inspection.

## Features and Behavior

### Prompt Editor & Variable Interpolation
- Two synchronized text areas for Variant A and Variant B.
- Automatically substitutes `{{input}}` (and any custom `{{variables}}`) with the scenario values at runtime.
- Live token counter estimating tokens based on standard tokenization rules (~4 chars/token).

### Test Case Runner
- Supports instant local zero-cost simulation (with deterministic realistic LLM responses tailored to the preset scenarios) ensuring reviewers and demo recordings can run effortlessly offline.
- Supports optional Live API mode if the user provides a Google Gemini or OpenAI API key.
- Runs both variants simultaneously with animated loading state.

### Visual Diff Engine
- Computes word-level and line-level differences between Response A and Response B.
- Highlights additions in green and deletions in red with clean inline badges.
- One-click toggle between "Side-by-Side View" and "Merged Inline Diff View".

### Automated Quality & Benchmark Scorecard
- Calculates three core objective metrics:
  1. **Clarity Score (0–100):** Evaluates sentence structure, readability, and formatting.
  2. **Conciseness Score (0–100):** Measures information density and brevity against token count.
  3. **Instruction Adherence (0–100):** Checks if the output honored formatting directives (e.g., bullet points, JSON, length caps).
- Identifies the winner based on composite weighted score.

### Export & Quick Copy
- "Copy Prompt" button for each editor.
- "Export Benchmark" button that formats the comparison into clean Markdown suitable for PRs, team documentation, or Devpost writeups.

## States and Boundaries
- **Initial State:** Preloaded with two distinct prompt variants and three scenario tabs so the user can immediately test with 1 click.
- **Running State:** Both output panels display an animated pulsing skeleton and elapsed timer.
- **Result State:** Displays rendered response text, diff highlights, and score metrics.
- **Empty / Error State:** Shows inline validation warning if prompt text is blank or missing `{{input}}`.
- **Persistence:** Automatically saves current prompts and custom test cases to browser `localStorage` so refreshing does not lose work.

## What We're Building
- Complete, responsive single-page web app built with Vite + React + Tailwind CSS (or modern vanilla ES modules for zero-build friction and instant launch).
- Bundled with sample prompts, diff engine, evaluation algorithms, and export capabilities.

## Deferred From the POC
- Multi-user authentication & team workspace sync.
- Cloud database backend.
- Automated generation of 100+ synthetic test cases.

## Non-Goals
- No backend server required for standard operation (100% client-side capable, runnable via static hosting or `npm run dev`).
- No paid third-party subscriptions required for testing.
