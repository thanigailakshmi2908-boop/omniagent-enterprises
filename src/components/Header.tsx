import { Shield, Github, Activity } from 'lucide-react';
import type { ModelId } from '@/lib/types';
import ModelSelector from './ModelSelector';

interface HeaderProps {
  selectedModel: ModelId;
  onModelSelect: (id: ModelId) => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

export default function Header({ selectedModel, onModelSelect, onOpenSettings, hasApiKey }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-white/[0.06] px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-600/30">
            <Activity className="w-5 h-5 text-white" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 opacity-0 hover:opacity-30 transition-opacity blur-md" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold text-white leading-tight">
              OmniAgent <span className="gradient-text">Enterprise</span>
            </h1>
            <p className="text-[10px] text-slate-500 leading-tight">Autonomous RAG & Workflow System</p>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <ModelSelector selected={selectedModel} onSelect={onModelSelect} />
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 ${
              hasApiKey
                ? 'bg-accent-500/10 border-accent-500/20 hover:bg-accent-500/15'
                : 'bg-warning-500/10 border-warning-500/20 hover:bg-warning-500/15 animate-pulse-glow'
            }`}
          >
            <Shield className={`w-4 h-4 ${hasApiKey ? 'text-accent-400' : 'text-warning-400'}`} />
            <span className={`text-xs font-medium hidden sm:inline ${hasApiKey ? 'text-accent-300' : 'text-warning-300'}`}>
              {hasApiKey ? 'Key Active' : 'Add API Key'}
            </span>
          </button>
          <a
            href="https://ai.google.dev/gemini-api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all"
          >
            <Github className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">Docs</span>
          </a>
        </div>
      </div>
    </header>
  );
}
