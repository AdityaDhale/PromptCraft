import React, { useState } from 'react';
import { Database, Plus, Edit3, Check, FileText } from 'lucide-react';

export function ScenarioSelector({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  onUpdateScenarioInput,
  onAddCustomScenario
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customInput, setCustomInput] = useState('');

  const currentScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  const handleSaveCustom = (e) => {
    e.preventDefault();
    if (!customTitle.trim() || !customInput.trim()) return;
    onAddCustomScenario({
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      input: customInput.trim()
    });
    setCustomTitle('');
    setCustomInput('');
    setCustomModalOpen(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Test Case Scenarios
          </span>
          <span className="text-[11px] text-slate-500">
            (Injected into <code className="text-cyan-400">{'{{input}}'}</code>)
          </span>
        </div>

        {/* Scenario Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {scenarios.map((sc) => {
            const isActive = sc.id === activeScenarioId;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  onSelectScenario(sc.id);
                  setIsEditing(false);
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                <span>{sc.title}</span>
              </button>
            );
          })}

          <button
            onClick={() => setCustomModalOpen(true)}
            className="text-xs px-2.5 py-1.5 rounded-lg font-medium bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-indigo-300 border border-dashed border-slate-700 hover:border-indigo-500/50 transition-all flex items-center gap-1"
            title="Create Custom Test Scenario"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Custom</span>
          </button>
        </div>
      </div>

      {/* Active Scenario Input Box */}
      <div className="relative bg-slate-950/70 border border-slate-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-cyan-400" />
            <span>Scenario Payload: <strong className="text-slate-200">{currentScenario?.title}</strong></span>
          </span>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            {isEditing ? (
              <>
                <Check className="w-3 h-3" />
                <span>Done Editing</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3 h-3" />
                <span>Edit Payload</span>
              </>
            )}
          </button>
        </div>

        {isEditing ? (
          <textarea
            value={currentScenario?.input || ''}
            onChange={(e) => onUpdateScenarioInput(currentScenario.id, e.target.value)}
            className="w-full h-20 bg-slate-900 text-slate-200 font-mono text-xs p-2 rounded border border-slate-700 focus:border-cyan-500 focus:outline-none resize-none leading-relaxed"
          />
        ) : (
          <p className="text-xs font-mono text-slate-300 line-clamp-2 select-all bg-slate-900/40 p-2 rounded border border-slate-800/50">
            {currentScenario?.input}
          </p>
        )}
      </div>

      {/* Custom Scenario Modal */}
      {customModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 max-w-md w-full shadow-2xl">
            <h3 className="text-sm font-semibold text-white mb-3">Add Custom Scenario</h3>
            <form onSubmit={handleSaveCustom} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Scenario Title</label>
                <input
                  type="text"
                  placeholder="e.g. Edge Case Empty String, Angry VIP Customer"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Payload Content ({'{{input}}'})</label>
                <textarea
                  rows={4}
                  placeholder="Enter the raw text input or code to test..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomModalOpen(false)}
                  className="text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-md shadow-cyan-600/20"
                >
                  Add Scenario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
