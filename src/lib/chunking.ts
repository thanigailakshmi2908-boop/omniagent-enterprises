import type { DocumentChunk } from './types';

// Approximate token count: ~4 chars per token for English text
export function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

// Semantic chunking: split by paragraphs, then merge to target size
export function chunkDocument(text: string, targetTokens = 250, overlapTokens = 50): DocumentChunk[] {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  if (paragraphs.length === 0) return [];

  const chunks: DocumentChunk[] = [];
  let currentText = '';
  let currentTokens = 0;
  let chunkId = 0;

  for (const para of paragraphs) {
    const paraTokens = estimateTokens(para);
    if (currentTokens + paraTokens > targetTokens && currentText) {
      chunks.push({
        id: chunkId++,
        text: currentText.trim(),
        tokens: currentTokens,
        preview: currentText.trim().slice(0, 120),
      });
      // Overlap: keep last portion
      const overlapText = currentText.slice(-overlapTokens * 4);
      currentText = overlapText + '\n\n' + para;
      currentTokens = estimateTokens(currentText);
    } else {
      currentText = currentText ? currentText + '\n\n' + para : para;
      currentTokens = estimateTokens(currentText);
    }
  }

  if (currentText.trim()) {
    chunks.push({
      id: chunkId++,
      text: currentText.trim(),
      tokens: currentTokens,
      preview: currentText.trim().slice(0, 120),
    });
  }

  return chunks;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
