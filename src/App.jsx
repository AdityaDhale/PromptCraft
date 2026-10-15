import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { PromptEditor } from './components/PromptEditor';
import { ScenarioSelector } from './components/ScenarioSelector';
import { ResultsDeck } from './components/ResultsDeck';
import { SettingsModal } from './components/SettingsModal';
import { PRESETS } from './data/presets';
import { computeWordDiff } from './services/diffEngine';
import { evaluateOutput, compareVariants, estimateTokens } from './services/evaluator';
import { runPrompt } from './services/runner';

export default function App() {
  const [presets, setPresets] = useState(PRESETS);
  const [currentPresetId, setCurrentPresetId] = useState('support');

  const currentPreset = presets.find((p) => p.id === currentPresetId) || presets[0];

  const [variantA, setVariantA] = useState(currentPreset.variantA);
  const [variantB, setVariantB] = useState(currentPreset.variantB);
  const [scenarios, setScenarios] = useState(currentPreset.scenarios);
  const [activeScenarioId, setActiveScenarioId] = useState(currentPreset.scenarios[0].id);

  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [diffData, setDiffData] = useState(null);
  const [comparison, setComparison] = useState(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mode, setMode] = useState(() => localStorage.getItem('promptcraft_mode') || 'simulated');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('promptcraft_api_key') || '');
  const [copiedReport, setCopiedReport] = useState(false);

  // When changing presets, sync up state
  const handleSelectPreset = (presetId) => {
    const selected = presets.find((p) => p.id === presetId);
    if (!selected) return;
    setCurrentPresetId(presetId);
    setVariantA(selected.variantA);
    setVariantB(selected.variantB);
    setScenarios(selected.scenarios);
    setActiveScenarioId(selected.scenarios[0].id);
    setResult(null);
    setDiffData(null);
    setComparison(null);
  };

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  // Update scenario input
  const handleUpdateScenarioInput = (scenarioId, newInput) => {
    setScenarios((prev) =>
      prev.map((sc) => (sc.id === scenarioId ? { ...sc, input: newInput } : sc))
    );
  };

  // Add custom scenario
  const handleAddCustomScenario = (newScenario) => {
    setScenarios((prev) => [...prev, newScenario]);
    setActiveScenarioId(newScenario.id);
  };

  // Save Settings
  const handleSaveSettings = ({ mode: newMode, apiKey: newApiKey }) => {
    setMode(newMode);
    setApiKey(newApiKey);
    localStorage.setItem('promptcraft_mode', newMode);
    localStorage.setItem('promptcraft_api_key', newApiKey);
  };

  // Run Benchmark
  const handleRunBenchmark = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);

    try {
      const scenarioInput = activeScenario?.input || '';

      // Run both variants concurrently
      const [resA, resB] = await Promise.all([
        runPrompt({
          prompt: variantA.prompt,
          scenarioInput,
          presetId: currentPresetId,
          scenarioId: activeScenarioId,
          variantType: 'a',
          mode,
          apiKey
        }),
        runPrompt({
          prompt: variantB.prompt,
          scenarioInput,
          presetId: currentPresetId,
          scenarioId: activeScenarioId,
          variantType: 'b',
          mode,
          apiKey
        })
      ]);

      // Calculate quality scores
      const scoresA = evaluateOutput(variantA.prompt, resA.output, scenarioInput);
      const scoresB = evaluateOutput(variantB.prompt, resB.output, scenarioInput);

      // Compute word-level visual diff
      const diff = computeWordDiff(resA.output, resB.output);

      const benchmarkResult = {
        variantA: {
          prompt: variantA.prompt,
          output: resA.output,
          tokens: scoresA.tokenCount,
          latencyMs: resA.latencyMs,
          scores: scoresA
        },
        variantB: {
          prompt: variantB.prompt,
          output: resB.output,
          tokens: scoresB.tokenCount,
          latencyMs: resB.latencyMs,
          scores: scoresB
        }
      };

      const comp = compareVariants(benchmarkResult.variantA, benchmarkResult.variantB);

      setResult(benchmarkResult);
      setDiffData(diff);
      setComparison(comp);

      // Trigger celebratory confetti if candidate B decisively wins!
      if (comp?.winner === 'variantB') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#6366f1', '#06b6d4', '#10b981']
        });
      }
    } catch (err) {
      console.error('Benchmark execution failed:', err);
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, activeScenario, variantA, variantB, currentPresetId, activeScenarioId, mode, apiKey]);

  // Global Keyboard Shortcut: Ctrl+Enter or Cmd+Enter to run
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunBenchmark();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRunBenchmark]);

  // Export Markdown Report
  const handleExportReport = () => {
    if (!result) {
      alert('Please run the benchmark first before exporting report.');
      return;
    }

    const reportMarkdown = `# ⚡ PromptCraft Benchmark Report

**Preset**: ${currentPreset.name}  
**Scenario**: ${activeScenario.title}  
**Executed At**: ${new Date().toISOString()}  
**Winner**: ${comparison?.winner === 'variantA' ? 'Variant A (Baseline)' : comparison?.winner === 'variantB' ? 'Variant B (Candidate)' : 'Tie'} (Margin: ${comparison?.diffScore || 0} pts)

---

## 📊 Evaluation Summary

| Metric | Variant A (${variantA.name}) | Variant B (${variantB.name}) |
| :--- | :---: | :---: |
| **Composite Score** | **${result.variantA.scores.composite}/100** | **${result.variantB.scores.composite}/100** |
| Clarity & Structure | ${result.variantA.scores.clarity}/100 | ${result.variantB.scores.clarity}/100 |
| Conciseness & Density | ${result.variantA.scores.conciseness}/100 | ${result.variantB.scores.conciseness}/100 |
| Instruction Adherence | ${result.variantA.scores.adherence}/100 | ${result.variantB.scores.adherence}/100 |
| Tokens Generated | ~${result.variantA.tokens} tokens | ~${result.variantB.tokens} tokens |
| Latency | ${result.variantA.latencyMs}ms | ${result.variantB.latencyMs}ms |

**Key Rationale**: ${comparison?.summary}

---

## 🔍 Diff Statistics
- **Additions**: +${diffData?.stats?.added || 0} words
- **Deletions**: -${diffData?.stats?.removed || 0} words
- **Text Similarity**: ${diffData?.stats?.similarity || 0}%

---

## 📝 Tested Prompts

### Variant A (${variantA.name})
\`\`\`
${variantA.prompt}
\`\`\`

### Variant B (${variantB.name})
\`\`\`
${variantB.prompt}
\`\`\`

---

## 📤 Output Comparison

### Variant A Output
\`\`\`markdown
${result.variantA.output}
\`\`\`

### Variant B Output
\`\`\`markdown
${result.variantB.output}
\`\`\`

*Generated with PromptCraft — Spec-Driven Prompt Benchmarking*
`;

    navigator.clipboard.writeText(reportMarkdown);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Header */}
      <Header
        presets={presets}
        currentPresetId={currentPresetId}
        onSelectPreset={handleSelectPreset}
        isRunning={isRunning}
        onRunBenchmark={handleRunBenchmark}
        onOpenSettings={() => setSettingsOpen(true)}
        onExportReport={handleExportReport}
        copiedReport={copiedReport}
        mode={mode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-4">
        {/* Scenario Selector Ribbon */}
        <ScenarioSelector
          scenarios={scenarios}
          activeScenarioId={activeScenarioId}
          onSelectScenario={setActiveScenarioId}
          onUpdateScenarioInput={handleUpdateScenarioInput}
          onAddCustomScenario={handleAddCustomScenario}
        />

        {/* Dual Prompt Editor */}
        <PromptEditor
          variantA={variantA}
          variantB={variantB}
          onChangeVariantA={(newVal) => setVariantA((prev) => ({ ...prev, prompt: newVal }))}
          onChangeVariantB={(newVal) => setVariantB((prev) => ({ ...prev, prompt: newVal }))}
          onResetPrompts={() => {
            setVariantA(currentPreset.variantA);
            setVariantB(currentPreset.variantB);
          }}
        />

        {/* Results, Diff & Scorecard Deck */}
        <ResultsDeck
          isRunning={isRunning}
          result={result}
          diffData={diffData}
          comparison={comparison}
          variantAName={variantA.name}
          variantBName={variantB.name}
          onRunBenchmark={handleRunBenchmark}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PromptCraft — Spec-Driven AI Prompt Bench & Diff Workbench</span>
          <span>Devpost Learn: Build With AI: Basics Hackathon</span>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        mode={mode}
        apiKey={apiKey}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}
