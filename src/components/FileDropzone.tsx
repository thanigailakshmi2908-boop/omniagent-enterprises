import { useRef, useState, useCallback } from 'react';
import { UploadCloud, FileText, X, Layers } from 'lucide-react';
import { chunkDocument, formatFileSize, estimateTokens } from '@/lib/chunking';
import type { UploadedDoc } from '@/lib/types';

interface FileDropzoneProps {
  docs: UploadedDoc[];
  onAdd: (doc: UploadedDoc) => void;
  onRemove: (id: string) => void;
}

export default function FileDropzone({ docs, onAdd, onRemove }: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const content = String(reader.result ?? '');
        const chunks = chunkDocument(content);
        onAdd({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          size: file.size,
          content,
          chunks,
          createdAt: Date.now(),
        });
      };
      reader.readAsText(file);
    });
  }, [onAdd]);

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text');
    if (text.length > 100) {
      e.preventDefault();
      const chunks = chunkDocument(text);
      onAdd({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: `Pasted-${new Date().toLocaleTimeString()}`,
        size: new Blob([text]).size,
        content: text,
        chunks,
        createdAt: Date.now(),
      });
    }
  };

  const totalChunks = docs.reduce((s, d) => s + d.chunks.length, 0);
  const totalTokens = docs.reduce((s, d) => s + d.chunks.reduce((ss, c) => ss + c.tokens, 0), 0);

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onPaste={handlePaste}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
          dragging ? 'dropzone-active' : 'border-white/[0.1] hover:border-white/[0.2] bg-white/[0.02]'
        }`}
        tabIndex={0}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".txt,.md,.json,.js,.ts,.tsx,.jsx,.py,.sql,.csv,.html,.css,.xml,.yaml,.yml,.log"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-primary-600/30 to-accent-600/20 flex items-center justify-center mb-3 transition-transform ${dragging ? 'scale-110' : ''}`}>
          <UploadCloud className={`w-6 h-6 text-primary-400 ${dragging ? 'animate-bounce-subtle' : ''}`} />
        </div>
        <p className="text-sm text-slate-200 font-medium">
          {dragging ? 'Drop files to ingest' : 'Drop files or click to upload'}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          .txt, .md, .json, .js, .py, .sql, .csv — or paste text here
        </p>
      </div>

      {docs.length > 0 && (
        <div className="flex items-center gap-4 text-xs text-slate-400 px-1">
          <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {docs.length} docs</span>
          <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> {totalChunks} chunks</span>
          <span>~{totalTokens.toLocaleString()} tokens</span>
        </div>
      )}

      <div className="space-y-2">
        {docs.map((doc) => (
          <div key={doc.id} className="glass glass-hover p-3 flex items-center gap-3 group animate-slide-up">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-600/30 to-primary-500/20 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-200 font-medium truncate">{doc.name}</div>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>{formatFileSize(doc.size)}</span>
                <span>·</span>
                <span>{doc.chunks.length} chunks</span>
                <span>·</span>
                <span>~{estimateTokens(doc.content).toLocaleString()} tokens</span>
              </div>
            </div>
            <button
              onClick={() => onRemove(doc.id)}
              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-error-400 transition-all p-1.5 rounded-lg hover:bg-error-500/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
