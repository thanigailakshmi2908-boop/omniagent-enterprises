import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check, Zap, Database, BrainCircuit } from 'lucide-react';
import { MODELS } from '@/lib/models';
import type { ModelId, ModelInfo } from '@/lib/types';

interface ModelSelectorProps {
  selected: ModelId;
  onSelect: (id: ModelId) => void;
}

const roleIcons: Record<string, typeof Zap> = {
  planning: Zap,
  extraction: Database,
  reasoning: BrainCircuit,
};

export default function ModelSelector({ selected, onSelect }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = MODELS.find((m) => m.id === selected) ?? MODELS[0];
  const RoleIcon = roleIcons[current.role];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200 min-w-[200px]"
      >
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${current.badgeColor} flex items-center justify-center shadow-lg`}>
          <RoleIcon className="w-4 h-4 text-white" />
        </div>
        <div className="text-left flex-1">
          <div className="text-xs text-slate-400 leading-tight">Model</div>
          <div className="text-sm font-medium text-white leading-tight">{current.shortName}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 glass-strong p-2 z-50 animate-scale-in shadow-2xl">
          {MODELS.map((m: ModelInfo) => {
            const Icon = roleIcons[m.role];
            return (
              <button
                key={m.id}
                onClick={() => { onSelect(m.id); setOpen(false); }}
                className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all duration-200 ${
                  m.id === selected ? 'bg-white/[0.08]' : 'hover:bg-white/[0.05]'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${m.badgeColor} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{m.name}</span>
                    {m.id === selected && <Check className="w-3.5 h-3.5 text-accent-400" />}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{m.description}</div>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
                    <span>${m.inputCostPer1M}/1M in</span>
                    <span>${m.outputCostPer1M}/1M out</span>
                    <span>~{m.speedTokensPerSec} tok/s</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
