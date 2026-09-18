import { useEffect } from 'react';
import { X, Mail, User, Sparkles, Heart } from 'lucide-react';

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AboutModal({ open, onClose }: AboutModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md animate-scale-in">
        <div className="glass-strong p-6 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.06]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Avatar / Icon */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 flex items-center justify-center shadow-xl shadow-primary-600/30 mb-4">
              <User className="w-9 h-9 text-white" />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent-500 flex items-center justify-center shadow-lg border-2 border-slate-900">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">Created by Deepak</h2>
            <p className="text-sm text-slate-400 mt-1.5">
              OmniAgent Enterprise — Autonomous RAG & Workflow System
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent mb-5" />

          {/* Contact card */}
          <a
            href="mailto:thanigailakshmi2908@gmail.com?subject=OmniAgent%20Enterprise%20Inquiry"
            className="group flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-white/[0.08] hover:border-primary-500/30 hover:bg-primary-500/[0.06] transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600/30 to-primary-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5 text-primary-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-slate-500 mb-0.5">Contact Email</div>
              <div className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                thanigailakshmi2908@gmail.com
              </div>
            </div>
          </a>

          {/* Footer */}
          <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-slate-500">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-error-400" />
            <span>using React, Tailwind & Gemini AI</span>
          </div>

          <button
            onClick={onClose}
            className="btn-primary w-full mt-5 flex items-center justify-center gap-2"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
