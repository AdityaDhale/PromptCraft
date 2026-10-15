---
doc: scope
status: approved
---

# PromptCraft

An interactive prompt workbench to benchmark, diff, and score AI prompts side-by-side across test cases.

## The Unique Kernel
Side-by-side prompt version benchmarking with real-time visual token/word diffs and multi-dimensional prompt scoring (clarity, conciseness, instruction adherence) across test case scenarios.

## Who It's For
AI builders, developers, and product creators who iterate on prompts in chaotic chat windows, losing track of regressions when tweaking instructions.

## The Core Loop
1. Open PromptCraft with Prompt Variant A and Prompt Variant B.
2. Select or enter test scenario variables (e.g., standard input, edge cases, adversarial query).
3. Run the benchmark to generate side-by-side outputs.
4. Toggle visual diff mode to see exactly how changes in instructions impacted responses, paired with real-time quality scores.

## Inspiration & Identity
Modern developer-grade workbench aesthetics inspired by Linear and Vercel: dark mode default, crisp monospace accents, amber and cyan highlighting for additions and deletions, and clean card surfaces.

## Why This Matters to the Learner
Moves prompt engineering from guesswork to disciplined, test-driven iteration—a perfect reflection of the "plan before you build" hackathon ethos.

## What "Working" Looks Like
A sleek, locally running web application loaded in the browser. The user enters or selects sample prompt variants, runs the test runner, sees outputs stream in side-by-side, inspects visual color-coded text diffs, and reviews comparative score metrics. The entire flow is demonstrable on video in under 90 seconds.

## The POC Boundary
- Side-by-side dual prompt editor (Variant A vs Variant B).
- Pre-loaded test cases (e.g. Customer Support Escalation, Technical Explainer, Code Reviewer) plus custom input field.
- Built-in instant execution engine (reliable offline simulation engine + optional Gemini/OpenAI API key integration).
- Output comparison panel with side-by-side cards and unified diff viewer.
- Real-time scoring breakdown: Clarity, Conciseness, Instruction Adherence, and Token count.

## Later
- Team collaboration and cloud workspace saving.
- Multi-model routing (comparing Claude vs Gemini vs GPT-4 simultaneously).
- Automated adversarial test generation.

## Explicitly Cut
- User login / accounts (unnecessary overhead for a local-first PoC).
- External database dependencies (local storage used for saving prompt sets).
- Complex payment or subscription gates.
