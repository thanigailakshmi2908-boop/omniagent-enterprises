export type ModelId = 'gemini-3.6-flash' | 'gemini-3.5-flash-lite' | 'gemini-3.1-pro';

export interface ModelInfo {
  id: ModelId;
  name: string;
  shortName: string;
  description: string;
  tagline: string;
  role: 'planning' | 'extraction' | 'reasoning';
  inputCostPer1M: number;
  outputCostPer1M: number;
  speedTokensPerSec: number;
  maxTokens: number;
  badgeColor: string;
  iconColor: string;
}

export type PersonaId = 'financial' | 'codebase' | 'resume' | 'strategy';

export interface Persona {
  id: PersonaId;
  name: string;
  shortName: string;
  description: string;
  systemPrompt: string;
  outputFormat: string;
  icon: 'TrendingUp' | 'Code2' | 'UserCheck' | 'Briefcase';
  accent: string;
}

export interface DocumentChunk {
  id: number;
  text: string;
  tokens: number;
  preview: string;
}

export interface UploadedDoc {
  id: string;
  name: string;
  size: number;
  content: string;
  chunks: DocumentChunk[];
  createdAt: number;
}

export interface TokenMetrics {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  durationMs: number;
  tokensPerSec: number;
  estimatedCost: number;
}

export interface AgentResult {
  id: string;
  personaId: PersonaId;
  modelId: ModelId;
  prompt: string;
  output: string;
  metrics: TokenMetrics;
  timestamp: number;
  isError?: boolean;
}
