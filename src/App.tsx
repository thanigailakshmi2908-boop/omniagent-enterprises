import { useState, useCallback, useEffect } from 'react';
import { Library, PanelsTopLeft, Info } from 'lucide-react';
import Header from '@/components/Header';
import AboutModal from '@/components/AboutModal';
import SettingsDrawer from '@/components/SettingsDrawer';
import PersonaSwitcher from '@/components/PersonaSwitcher';
import FileDropzone from '@/components/FileDropzone';
import ChunkVisualizer from '@/components/ChunkVisualizer';
import PromptPanel from '@/components/PromptPanel';
import ResultsPanel from '@/components/ResultsPanel';
import { storage } from '@/lib/storage';
import { MODELS, PERSONAS } from '@/lib/models';
import { executeAgent } from '@/lib/geminiClient';
import type { ModelId, PersonaId, UploadedDoc, AgentResult } from '@/lib/types';

export default function App() {
  const [apiKey, setApiKey] = useState(storage.getApiKey());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelId>(
    () => {
      const stored = storage.getModel();
      return (MODELS.find((m) => m.id === stored)?.id ?? 'gemini-3.6-flash') as ModelId;
    }
  );
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>(
    () => {
      const stored = storage.getPersona();
      return (PERSONAS.find((p) => p.id === stored)?.id ?? 'financial') as PersonaId;
    }
  );
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Initializing agent...');
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('omniagent_about_seen');
    if (!seen) {
      setAboutOpen(true);
      sessionStorage.setItem('omniagent_about_seen', '1');
    }
  }, []);

  const persona = PERSONAS.find((p) => p.id === selectedPersona)!;
  const model = MODELS.find((m) => m.id === selectedModel)!;

  const handleModelSelect = (id: ModelId) => {
    setSelectedModel(id);
    storage.setModel(id);
  };

  const handlePersonaSelect = (id: PersonaId) => {
    setSelectedPersona(id);
    storage.setPersona(id);
  };

  const handleAddDoc = (doc: UploadedDoc) => setDocs((prev) => [...prev, doc]);
  const handleRemoveDoc = (id: string) => setDocs((prev) => prev.filter((d) => d.id !== id));

  const handleRun = useCallback(async (prompt: string) => {
    if (!apiKey) {
      setSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setResult(null);

    const stages = [
      'Retrieving & vectorizing context...',
      'Constructing agent prompt payload...',
      `Dispatching to ${model.name}...`,
      'Agent reasoning over documents...',
      'Structuring output...',
    ];

    let stageIdx = 0;
    setLoadingStage(stages[0]);
    const stageInterval = setInterval(() => {
      stageIdx = Math.min(stageIdx + 1, stages.length - 1);
      setLoadingStage(stages[stageIdx]);
    }, 800);

    try {
      const { output, metrics } = await executeAgent(apiKey, model, persona, prompt, docs);
      setResult({
        id: `${Date.now()}`,
        personaId: persona.id,
        modelId: model.id,
        prompt,
        output,
        metrics,
        timestamp: Date.now(),
      });
    } catch (err) {
      setResult({
        id: `${Date.now()}`,
        personaId: persona.id,
        modelId: model.id,
        prompt,
        output: err instanceof Error ? err.message : 'An unexpected error occurred.',
        metrics: { inputTokens: 0, outputTokens: 0, totalTokens: 0, durationMs: 0, tokensPerSec: 0, estimatedCost: 0 },
        timestamp: Date.now(),
        isError: true,
      });
    } finally {
      clearInterval(stageInterval);
      setIsLoading(false);
    }
  }, [apiKey, model, persona, docs]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        selectedModel={selectedModel}
        onModelSelect={handleModelSelect}
        onOpenSettings={() => setSettingsOpen(true)}
        hasApiKey={!!apiKey}
      />

      <main className="flex-1 px-4 lg:px-6 py-4 lg:py-6 max-w-[1800px] w-full mx-auto space-y-4">
        {/* Persona Switcher */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <PanelsTopLeft className="w-4 h-4 text-primary-400" />
            <h2 className="text-sm font-semibold text-slate-200">Multi-Agent Persona Workflows</h2>
          </div>
          <PersonaSwitcher selected={selectedPersona} onSelect={handlePersonaSelect} />
        </section>

        {/* Split-Screen Dual Output */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[calc(100vh-340px)]">
          {/* Left Panel: Input & Document Workspace */}
          <div className="space-y-4 flex flex-col">
            <div className="glass-panel rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Library className="w-4 h-4 text-primary-400" />
                <h3 className="text-sm font-bold text-white">RAG Document Workspace</h3>
              </div>
              <FileDropzone docs={docs} onAdd={handleAddDoc} onRemove={handleRemoveDoc} />
            </div>

            <div className="glass-panel rounded-2xl p-4">
              <ChunkVisualizer docs={docs} />
            </div>

            <div className="flex-1 min-h-[300px]">
              <PromptPanel
                persona={persona}
                docs={docs}
                onRun={handleRun}
                isLoading={isLoading}
                hasApiKey={!!apiKey}
              />
            </div>
          </div>

          {/* Right Panel: Results */}
          <div className="min-h-[400px] lg:min-h-0">
            <ResultsPanel
              result={result}
              isLoading={isLoading}
              loadingStage={loadingStage}
            />
          </div>
        </section>
      </main>

      <footer className="px-6 py-3 flex items-center justify-center gap-3 text-xs text-slate-600 border-t border-white/[0.04]">
        <span>OmniAgent Enterprise — Powered by Google Gemini · Keys stored locally in your browser</span>
        <button
          onClick={() => setAboutOpen(true)}
          className="flex items-center gap-1 text-slate-500 hover:text-primary-400 transition-colors"
        >
          <Info className="w-3.5 h-3.5" /> About Creator
        </button>
      </footer>

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSaved={(key) => setApiKey(key)}
      />
    </div>
  );
}
