import { Zap, DollarSign, Clock, Hash, TrendingUp } from 'lucide-react';
import type { TokenMetrics, ModelInfo } from '@/lib/types';

interface TokenMetricsBarProps {
  metrics: TokenMetrics;
  model: ModelInfo;
}

export default function TokenMetricsBar({ metrics, model }: TokenMetricsBarProps) {
  const items = [
    {
      icon: Clock,
      label: 'Duration',
      value: metrics.durationMs < 1000
        ? `${metrics.durationMs.toFixed(0)}ms`
        : `${(metrics.durationMs / 1000).toFixed(2)}s`,
      color: 'text-sky-400',
    },
    {
      icon: Zap,
      label: 'Speed',
      value: `${metrics.tokensPerSec.toLocaleString()}/s`,
      color: 'text-accent-400',
    },
    {
      icon: Hash,
      label: 'Tokens',
      value: `${metrics.totalTokens.toLocaleString()}`,
      sub: `${metrics.inputTokens.toLocaleString()} in → ${metrics.outputTokens.toLocaleString()} out`,
      color: 'text-violet-400',
    },
    {
      icon: DollarSign,
      label: 'Est. Cost',
      value: metrics.estimatedCost < 0.01
        ? `$${metrics.estimatedCost.toFixed(5)}`
        : `$${metrics.estimatedCost.toFixed(4)}`,
      color: 'text-warning-400',
    },
  ];

  return (
    <div className="glass p-3 rounded-xl">
      <div className="flex items-center gap-2 mb-2.5">
        <TrendingUp className="w-3.5 h-3.5 text-primary-400" />
        <span className="text-xs font-medium text-slate-300">Execution Metrics</span>
        <span className={`text-xs px-2 py-0.5 rounded-md bg-gradient-to-r ${model.badgeColor} text-white font-medium`}>
          {model.shortName}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-slate-900/50 rounded-lg p-2 text-center">
              <Icon className={`w-3.5 h-3.5 mx-auto mb-1 ${item.color}`} />
              <div className={`text-sm font-semibold ${item.color}`}>{item.value}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{item.label}</div>
              {item.sub && <div className="text-[9px] text-slate-600 mt-0.5">{item.sub}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
