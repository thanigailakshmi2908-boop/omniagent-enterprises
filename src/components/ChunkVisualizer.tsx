import { useState } from 'react';
import { Layers, ChevronRight, Hash } from 'lucide-react';
import type { UploadedDoc } from '@/lib/types';

interface ChunkVisualizerProps {
  docs: UploadedDoc[];
}

export default function ChunkVisualizer({ docs }: ChunkVisualizerProps) {
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [hoveredChunk, setHoveredChunk] = useState<number | null>(null);

  if (docs.length === 0) {
    return (
      <div className="glass p-4 text-center">
        <Layers className="w-5 h-5 text-slate-600 mx-auto mb-2" />
        <p className="text-xs text-slate-500">Vector chunking visualizer will appear after upload</p>
      </div>
    );
  }

  const maxTokens = Math.max(...docs.flatMap((d) => d.chunks.map((c) => c.tokens)), 1);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <Layers className="w-4 h-4 text-primary-400" />
        <span className="text-sm font-medium text-slate-200">Vector Chunking Visualizer</span>
      </div>
      {docs.map((doc) => {
        const isExpanded = expandedDoc === doc.id;
        return (
          <div key={doc.id} className="glass overflow-hidden">
            <button
              onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
              className="w-full flex items-center gap-2 p-3 hover:bg-white/[0.03] transition-colors"
            >
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              <span className="text-xs font-medium text-slate-300 truncate flex-1 text-left">{doc.name}</span>
              <span className="text-xs text-slate-500">{doc.chunks.length} chunks</span>
            </button>
            {isExpanded && (
              <div className="px-3 pb-3 space-y-1.5 animate-slide-up">
                {doc.chunks.map((chunk) => {
                  const widthPct = Math.max(15, (chunk.tokens / maxTokens) * 100);
                  const isHovered = hoveredChunk === chunk.id;
                  return (
                    <div
                      key={chunk.id}
                      onMouseEnter={() => setHoveredChunk(chunk.id)}
                      onMouseLeave={() => setHoveredChunk(null)}
                      className="relative"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 w-8 text-right">#{chunk.id}</span>
                        <div className="flex-1 h-7 bg-slate-900/60 rounded-lg overflow-hidden relative">
                          <div
                            className="h-full bg-gradient-to-r from-primary-600/40 to-accent-500/30 rounded-lg transition-all duration-300"
                            style={{ width: `${widthPct}%` }}
                          />
                          <div className="absolute inset-0 flex items-center px-2">
                            <span className="text-[10px] text-slate-400 truncate">{chunk.preview}...</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 flex items-center gap-0.5 w-14">
                          <Hash className="w-2.5 h-2.5" />{chunk.tokens}
                        </span>
                      </div>
                      {isHovered && (
                        <div className="absolute z-20 left-12 top-full mt-1 w-64 glass-strong p-2 text-[10px] text-slate-300 animate-scale-in shadow-xl">
                          <div className="font-mono text-slate-400 max-h-24 overflow-y-auto leading-relaxed">
                            {chunk.text.slice(0, 200)}...
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
