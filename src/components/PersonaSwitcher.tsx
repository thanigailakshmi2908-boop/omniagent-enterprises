import { TrendingUp, Code2, UserCheck, Briefcase } from 'lucide-react';
import { PERSONAS } from '@/lib/models';
import type { PersonaId } from '@/lib/types';

interface PersonaSwitcherProps {
  selected: PersonaId;
  onSelect: (id: PersonaId) => void;
}

const iconMap = { TrendingUp, Code2, UserCheck, Briefcase };

export default function PersonaSwitcher({ selected, onSelect }: PersonaSwitcherProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {PERSONAS.map((persona) => {
        const Icon = iconMap[persona.icon];
        const isActive = persona.id === selected;
        return (
          <button
            key={persona.id}
            onClick={() => onSelect(persona.id)}
            className={`group relative overflow-hidden rounded-2xl p-4 border transition-all duration-300 text-left animate-slide-up ${
              isActive
                ? 'bg-white/[0.08] border-white/[0.18] shadow-xl'
                : 'glass glass-hover border-white/[0.08]'
            }`}
            style={{ animationDelay: `${PERSONAS.indexOf(persona) * 80}ms` }}
          >
            {isActive && (
              <div className={`absolute inset-0 bg-gradient-to-br ${persona.accent} opacity-[0.08]`} />
            )}
            <div className="relative flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${persona.accent} flex items-center justify-center shadow-lg flex-shrink-0 transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-200'} truncate`}>
                  {persona.shortName}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-snug">
                  {persona.description}
                </div>
              </div>
            </div>
            {isActive && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-400 animate-pulse-glow" />
            )}
          </button>
        );
      })}
    </div>
  );
}
