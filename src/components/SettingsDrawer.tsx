import { useEffect, useState } from 'react';
import { X, Key, Eye, EyeOff, Shield, Trash2, Check, ExternalLink, Zap } from 'lucide-react';
import { storage } from '@/lib/storage';

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  onSaved: (key: string) => void;
}

export default function SettingsDrawer({ open, onClose, onSaved }: SettingsDrawerProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setApiKey(storage.getApiKey());
  }, [open]);

  const handleSave = () => {
    storage.setApiKey(apiKey.trim());
    onSaved(apiKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    setApiKey('');
    storage.setApiKey('');
    onSaved('');
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 animate-slide-in-right">
        <div className="glass-panel h-full flex flex-col p-6 border-l border-white/[0.08] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-600/25">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">API Key Vault</h2>
                <p className="text-xs text-slate-400">Securely stored in your browser</p>
              </div>
            </div>
            <button onClick={onClose} className="btn-ghost !p-2 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            <div className="glass p-4 space-y-3">
              <label className="text-sm font-medium text-slate-200 flex items-center gap-2">
                <Key className="w-4 h-4 text-primary-400" />
                Google Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza..."
                  className="input-field pr-12 font-mono text-xs"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Your key is stored locally in this browser only. It never leaves your device except to call Google's API directly.
              </p>
            </div>

            <div className="glass p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-4 h-4 text-accent-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-slate-400 space-y-1.5">
                  <p className="text-slate-300 font-medium">How to get an API key:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Visit Google AI Studio</li>
                    <li>Sign in with your Google account</li>
                    <li>Click "Get API Key" and create one</li>
                    <li>Paste it above and save</li>
                  </ol>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 mt-2"
                  >
                    Open Google AI Studio <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="glass p-4">
              <h3 className="text-sm font-medium text-slate-200 mb-2">Security & Privacy</h3>
              <ul className="text-xs text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-accent-400 mt-0.5 flex-shrink-0" />
                  Keys are encrypted in browser LocalStorage
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-accent-400 mt-0.5 flex-shrink-0" />
                  No intermediary server — direct calls to Google
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-accent-400 mt-0.5 flex-shrink-0" />
                  Keys are never logged or transmitted elsewhere
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-auto pt-6 flex gap-3">
            <button onClick={handleClear} className="btn-ghost flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
            <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saved ? (
                <><Check className="w-4 h-4" /> Saved!</>
              ) : (
                'Save Key'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
