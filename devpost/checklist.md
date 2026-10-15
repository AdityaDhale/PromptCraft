---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Project scaffold, dual prompt editor, and live token counting**
  Becomes usable: Running React + Vite + Tailwind workbench with header, mode indicator, and dual prompt editors with real-time character & token calculation.
  Why now: Establishes project base and visual shell where all other features connect.
  PRD ref: `prd.md > Screens and Layout`, `prd.md > Features and Behavior (Prompt Editor)`
  Spec ref: `spec.md > Stack`, `spec.md > Components (Header, PromptEditor)`
  Build: Scaffold Vite + React, configure Tailwind CSS and Lucide icons, implement Header and PromptEditor components with preset selection.
  Verify (mechanical): Dev server compiles with zero errors; typing in editor updates token counter dynamically.
  Learner check: Open workbench in browser and observe developer dark theme, responsive dual editors, and reactive token chips.
  Commit: `feat: scaffold promptcraft workbench with dual prompt editors and token counting`

- [x] **2. Test scenario matrix and variable interpolation**
  Becomes usable: Interactive scenario tabs (Customer Escalation, Code Review, Executive Summary) plus custom scenario modal that interpolates `{{input}}` dynamically into prompts.
  Why now: Provides the inputs required to run comparative benchmarks.
  PRD ref: `prd.md > Screens and Layout (Scenario Matrix)`, `prd.md > Features and Behavior (Variable Interpolation)`
  Spec ref: `spec.md > Components (ScenarioSelector)`, `spec.md > Data Model`
  Build: Implement ScenarioSelector component, preset library (`presets.js`), and variable substitution engine.
  Verify (mechanical): Selecting scenarios swaps active test input; custom scenario modal persists to state.
  Learner check: Switch between scenarios and verify prompt preview includes active scenario text.
  Commit: `feat: add scenario matrix and variable interpolation engine`

- [x] **3. Dual execution runner with streaming simulation and live API mode**
  Becomes usable: Clicking "Run Benchmark" triggers concurrent execution with loading spinners, generating realistic responses for both prompt variants.
  Why now: Delivers the core loop of executing prompts against test scenarios.
  PRD ref: `prd.md > Features and Behavior (Test Case Runner)`
  Spec ref: `spec.md > Components (ResultsDeck)`, `spec.md > External Services`
  Build: Build `runner.js` supporting both instant offline simulation and live Google Gemini API calls via user API key.
  Verify (mechanical): Clicking Run triggers execution animation and populates both response panels with accurate latency metrics.
  Learner check: Click "Run Benchmark" and observe simultaneous response generation with execution timing.
  Commit: `feat: implement dual benchmark execution runner with simulation and live mode`

- [x] **4. Visual Word-Level Diff Engine (Unified & Split Views)**
  Becomes usable: Dedicated diff viewer showing word-by-word additions in green and deletions in red between Variant A and Variant B outputs.
  Why now: Fulfills the project's unique kernel—seeing the exact output impact of prompt adjustments.
  PRD ref: `prd.md > Features and Behavior (Visual Diff Engine)`
  Spec ref: `spec.md > Components (ResultsDeck, DiffViewer)`, `spec.md > diffEngine.js`
  Build: Implement LCS word-level diffing in `diffEngine.js` and render unified/split diff toggle in `DiffViewer.jsx`.
  Verify (mechanical): Automated test verifies diff tags correctly classify differing phrases between two outputs.
  Learner check: Toggle between Side-by-Side and Visual Diff tabs to inspect highlighted modifications.
  Commit: `feat: add visual word-level diff engine with unified and split modes`

- [x] **5. Automated Quality Scorecard, Winner Declaration, and Markdown Export**
  Becomes usable: Complete evaluation deck displaying Clarity, Conciseness, and Adherence scores, declaring the winner, plus one-click Markdown report export.
  Why now: Completes the full workflow from input to insight to shareable documentation.
  PRD ref: `prd.md > Features and Behavior (Automated Quality Scorecard, Export)`
  Spec ref: `spec.md > Components (Scorecard)`, `spec.md > evaluator.js`
  Build: Implement `evaluator.js` with multi-dimensional scoring algorithms and report generator.
  Verify (mechanical): Scores calculate within 0–100 bounds; "Export Report" copies formatted markdown to clipboard.
  Learner check: Review the scorecard, inspect the winner badge, and copy the benchmark markdown report.
  Commit: `feat: add quality scorecard, winner detection, and export capabilities`

## Hands-on Checkpoints

- [x] Early usable behavior explored — Slice 2 boundary (prompt editors + scenarios ready)
- [x] Final kick-the-tires exploration and feedback completed — Slice 5 (full workbench operational)

## Final Review

- [x] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: PromptCraft workbench built and verified across 5 slices
Route and stops: src/App.jsx, src/components/PromptEditor.jsx, src/services/diffEngine.js, src/services/evaluator.js
Edit outcome: Verified in browser with full production build and dev server
Reflection: Documented in learner profile and README
Activity mode: live app and editor

## Revisions
- Enhanced word-level LCS diff algorithm with inline and split views for deeper contrast.
- Added client-side export generator with clipboard copy animation for instant report sharing.
