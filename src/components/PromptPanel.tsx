import { useState, useRef } from 'react';
import { Sparkles, Loader2, Wand2, FileText } from 'lucide-react';
import type { Persona, UploadedDoc } from '@/lib/types';
import { estimateTokens } from '@/lib/chunking';

interface PromptPanelProps {
  persona: Persona;
  docs: UploadedDoc[];
  onRun: (prompt: string) => void;
  isLoading: boolean;
  hasApiKey: boolean;
}

const promptTemplates: Record<string, string[]> = {
  financial: [
    'Analyze these transactions for anomalies and flag suspicious patterns',
    'Identify compliance violations in the provided financial records',
    'Perform a risk assessment on this portfolio data',
  ],
  codebase: [
    'Review this codebase for refactoring opportunities and complexity',
    'Identify security vulnerabilities and anti-patterns in this code',
    'Generate a phased migration plan to improve maintainability',
  ],
  resume: [
    'Score this candidate against a senior engineer role requiring React, TypeScript, and system design',
    'Extract all skills and certifications from these resumes',
    'Compare these candidates and rank them by fit for a product manager role',
  ],
  strategy: [
    'Draft a Q4 strategic plan based on these market research documents',
    'Create a SWOT analysis from this competitive intelligence data',
    'Synthesize these reports into an executive summary with KPIs',
  ],
};

export default function PromptPanel({ persona, docs, onRun, isLoading, hasApiKey }: PromptPanelProps) {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const docTokens = docs.reduce((s, d) => s + estimateTokens(d.content), 0);
  const promptTokens = estimateTokens(prompt);
  const totalInput = docTokens + promptTokens;

  const handleRun = () => {
    if (!prompt.trim() || isLoading) return;
    onRun(prompt.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleRun();
    }
  };

  return (
    <div className="glass-panel h-full flex flex-col rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${persona.accent} flex items-center justify-center shadow-lg`}>
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Agent Instructions</h3>
              <p className="text-xs text-slate-400">{persona.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-white/[0.06]">
        <div className="glass p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary-400" />
            <span className="text-xs font-medium text-slate-300">Quick Templates</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(promptTemplates[persona.id] ?? []).map((tmpl) => (
              <button
                key={tmpl}
                onClick={() => { setPrompt(tmpl); textareaRef.current?.focus(); }}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200"
              >
                {tmpl.length > 50 ? tmpl.slice(0, 50) + '...' : tmpl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col min-h-0">
        <label className="text-xs font-medium text-slate-400 mb-2 block">Task Description</label>
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Describe what you want the ${persona.shortName} agent to do with the uploaded context...`}
          className="input-field flex-1 resize-none min-h-[120px] font-sm"
          disabled={isLoading}
        />

        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {promptTokens} prompt tokens</span>
          <span>+ {docTokens.toLocaleString()} doc tokens</span>
          <span className="text-slate-400">= {totalInput.toLocaleString()} input</span>
        </div>

        <button
          onClick={handleRun}
          disabled={isLoading || !prompt.trim()}
          className="btn-primary mt-4 flex items-center justify-center gap-2 w-full py-3"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Executing Agent...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Run Agent (Cmd+Enter)</>
          )}
        </button>
        {!hasApiKey && (
          <p className="text-xs text-warning-400 mt-2 text-center">
            Open Settings to add your API key first
          </p>
        )}
      </div>
    </div>
  );
}
