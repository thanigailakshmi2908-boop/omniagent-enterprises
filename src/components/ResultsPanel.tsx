import { useState } from 'react';
import { FileOutput, Download, FileJson, Copy, Check, AlertCircle, Bot, Sparkles } from 'lucide-react';
import { renderMarkdown } from '@/lib/markdown';
import { exportResultAsMarkdown, exportResultAsJson } from '@/lib/export';
import type { AgentResult } from '@/lib/types';
import { MODELS, PERSONAS } from '@/lib/models';
import TokenMetricsBar from './TokenMetricsBar';

interface ResultsPanelProps {
  result: AgentResult | null;
  isLoading: boolean;
  loadingStage: string;
}

export default function ResultsPanel({ result, isLoading, loadingStage }: ResultsPanelProps) {
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered');
  const [copied, setCopied] = useState(false);

  const model = result ? MODELS.find((m) => m.id === result.modelId) : null;
  const persona = result ? PERSONAS.find((p) => p.id === result.personaId) : null;

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMd = () => {
    if (!result || !persona) return;
    exportResultAsMarkdown(`${persona.shortName}-result`, result.output);
  };

  const handleExportJson = () => {
    if (!result) return;
    exportResultAsJson({
      persona: persona?.name,
      model: model?.name,
      prompt: result.prompt,
      output: result.output,
      metrics: result.metrics,
      timestamp: new Date(result.timestamp).toISOString(),
    });
  };

  return (
    <div className="glass-panel h-full flex flex-col rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-600 to-accent-500 flex items-center justify-center shadow-lg">
              <FileOutput className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Agent Output</h3>
              <p className="text-xs text-slate-400">Structured results & analysis</p>
            </div>
          </div>
          {result && !result.isError && (
            <div className="flex items-center gap-1.5">
              <div className="flex bg-slate-900/60 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('rendered')}
                  className={`text-xs px-2.5 py-1 rounded-md transition-all ${viewMode === 'rendered' ? 'bg-white/[0.08] text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Rendered
                </button>
                <button
                  onClick={() => setViewMode('raw')}
                  className={`text-xs px-2.5 py-1 rounded-md transition-all ${viewMode === 'raw' ? 'bg-white/[0.08] text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Raw
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && (
          <LoadingState stage={loadingStage} />
        )}

        {!isLoading && !result && (
          <EmptyState />
        )}

        {!isLoading && result && result.isError && (
          <ErrorState message={result.output} />
        )}

        {!isLoading && result && !result.isError && (
          <div className="space-y-4 animate-slide-up">
            {model && (
              <TokenMetricsBar metrics={result.metrics} model={model} />
            )}

            {viewMode === 'rendered' ? (
              <div
                className="md-content"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(result.output) }}
              />
            ) : (
              <pre className="text-xs font-mono text-slate-300 bg-slate-950/60 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap break-words">
                {result.output}
              </pre>
            )}
          </div>
        )}
      </div>

      {result && !result.isError && !isLoading && (
        <div className="p-3 border-t border-white/[0.06] flex items-center gap-2">
          <button onClick={handleCopy} className="btn-ghost flex items-center gap-1.5 text-xs !py-2">
            {copied ? <><Check className="w-3.5 h-3.5 text-accent-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
          <button onClick={handleExportMd} className="btn-ghost flex items-center gap-1.5 text-xs !py-2">
            <Download className="w-3.5 h-3.5" /> Markdown
          </button>
          <button onClick={handleExportJson} className="btn-ghost flex items-center gap-1.5 text-xs !py-2">
            <FileJson className="w-3.5 h-3.5" /> JSON
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600/20 to-accent-600/10 flex items-center justify-center mb-4 animate-pulse-glow">
        <Bot className="w-8 h-8 text-slate-500" />
      </div>
      <p className="text-sm font-medium text-slate-400">Awaiting agent execution</p>
      <p className="text-xs text-slate-600 mt-1 max-w-xs">
        Upload documents, select a persona, describe your task, then run the agent to see structured results here.
      </p>
    </div>
  );
}

function LoadingState({ stage }: { stage: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-20">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-600/30 to-accent-600/20 animate-pulse-glow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-primary-400 animate-spin-slow" />
        </div>
      </div>
      <p className="text-sm font-medium text-white animate-fade-in">{stage}</p>
      <div className="mt-4 w-48 space-y-2">
        <div className="h-3 shimmer-bg rounded-lg" />
        <div className="h-3 shimmer-bg rounded-lg w-3/4" />
        <div className="h-3 shimmer-bg rounded-lg w-1/2" />
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-20">
      <div className="w-14 h-14 rounded-2xl bg-error-500/15 flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7 text-error-400" />
      </div>
      <p className="text-sm font-medium text-error-300 mb-2">Execution Failed</p>
      <p className="text-xs text-slate-400 max-w-sm">{message}</p>
    </div>
  );
}
