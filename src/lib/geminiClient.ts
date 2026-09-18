import type { ModelInfo, Persona, TokenMetrics, UploadedDoc } from './types';
import { estimateTokens } from './chunking';

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiResponse {
  candidates?: Array<{
    content: { parts: Array<{ text: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
  error?: { message: string; code?: number };
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
}

function buildContext(docs: UploadedDoc[], persona: Persona, userPrompt: string): string {
  const docPayload = docs.length > 0
    ? docs.map((d) =>
        `--- Document: ${d.name} (${d.chunks.length} chunks, ~${d.chunks.reduce((s, c) => s + c.tokens, 0)} tokens) ---\n${d.content}`
      ).join('\n\n')
    : '[No documents uploaded — operating on prompt-only mode]';

  return `${persona.systemPrompt}

## Retrieved Context (RAG Payload)

${docPayload}

## User Task

${userPrompt}

## Instructions

Apply your specialized persona to the above context. Produce a comprehensive, well-structured response following your output format. Use Markdown formatting with headers, tables, and code blocks where appropriate.`;
}

export async function executeAgent(
  apiKey: string,
  model: ModelInfo,
  persona: Persona,
  userPrompt: string,
  docs: UploadedDoc[]
): Promise<{ output: string; metrics: TokenMetrics }> {
  const context = buildContext(docs, persona, userPrompt);
  const inputTokens = estimateTokens(context);

  if (!apiKey || apiKey.length < 10) {
    throw new Error('No API key configured. Open Settings to add your Google Gemini API key.');
  }

  const url = `${API_BASE}/${model.id}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: context }] }],
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  };

  const start = performance.now();
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Network error: could not reach Google Gemini API. Check your connection.');
  }

  const durationMs = performance.now() - start;
  const data: GeminiResponse = await res.json();

  if (!res.ok) {
    const msg = data.error?.message ?? `API error (HTTP ${res.status})`;
    if (res.status === 400 && msg.includes('API key not valid')) {
      throw new Error('Invalid API key. Verify your Google Gemini API key in Settings.');
    }
    if (res.status === 403) {
      throw new Error('Access denied. Ensure your API key has access to the selected model.');
    }
    if (res.status === 429) {
      throw new Error('Rate limit reached. Wait a moment and try again.');
    }
    throw new Error(msg);
  }

  if (data.promptFeedback?.blockReason) {
    throw new Error(`Request blocked: ${data.promptFeedback.blockReason}`);
  }

  const output = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!output) {
    throw new Error('Empty response from model. Try rephrasing your prompt.');
  }

  const outputTokens = data.usageMetadata?.candidatesTokenCount ?? estimateTokens(output);

  const metrics: TokenMetrics = {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    durationMs,
    tokensPerSec: Math.round(outputTokens / (durationMs / 1000)),
    estimatedCost: (inputTokens / 1_000_000) * model.inputCostPer1M + (outputTokens / 1_000_000) * model.outputCostPer1M,
  };

  return { output, metrics };
}

export function simulateMetrics(model: ModelInfo, inputTokens: number, outputTokens: number): TokenMetrics {
  const durationMs = (outputTokens / model.speedTokensPerSec) * 1000;
  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    durationMs,
    tokensPerSec: model.speedTokensPerSec,
    estimatedCost: (inputTokens / 1_000_000) * model.inputCostPer1M + (outputTokens / 1_000_000) * model.outputCostPer1M,
  };
}
